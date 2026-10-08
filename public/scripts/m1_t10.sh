#!/bin/bash

# ============================================================
# ПРОВЕРКА ЗАДАНИЯ №10: DNS сервер (bind) на HQ-SRV
# ============================================================

# Проверка прав root
if [ "$EUID" -ne 0 ]; then
    echo -e "\033[0;31mОшибка: Скрипт должен быть запущен с правами root (sudo)!\033[0m"
    exit 1
fi

# --- Настройки и пути ---
REPORT_DIR="/root/pve_reports"
TIMESTAMP=$(date +"%d-%m-%Y_%H-%M-%S")
REPORT_FILE="${REPORT_DIR}/Task10_Check_Report_${TIMESTAMP}.txt"

# ID виртуальной машины
HQ_SRV="10103"

# Отображаемые имена ВМ
declare -A VM_NAMES
VM_NAMES[$HQ_SRV]="HQ-SRV"

# Цвета для вывода в консоль
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

mkdir -p "$REPORT_DIR"

get_vm_name() {
    local vm_id="$1"
    echo "${VM_NAMES[$vm_id]:-$vm_id}"
}

log_report() {
    local message="$1"
    local color="$2"
    echo -e "${color}${message}${NC}"
    echo "$message" >> "$REPORT_FILE"
}

# Базовая функция проверки через QEMU Guest Agent
check_task() {
    local vm_id="$1"
    local description="$2"
    local check_command="$3"
    local fact_command="$4"
    local vm_name
    vm_name=$(get_vm_name "$vm_id")

    # Проверка статуса ВМ
    local vm_status
    vm_status=$(qm status "$vm_id" 2>/dev/null | awk '{print $2}')
    if [[ "$vm_status" != "running" ]]; then
        log_report "[ FAIL ] $vm_name: $description -> ВМ не запущена (статус: ${vm_status:-not_found})" "$RED"
        return 1
    fi

    # 1. Получение фактического значения
    local fact_output
    fact_output=$(qm guest exec "$vm_id" -- /bin/bash -c "$fact_command" 2>&1)
    
    local fact_exitcode
    fact_exitcode=$(echo "$fact_output" | grep -oP '"exitcode"\s*:\s*\K[0-9]+' | head -1)
    
    local fact_data
    fact_data=$(echo "$fact_output" | grep -oP '"out-data"\s*:\s*"\K[^"]*' | sed 's/\\n/\n/g' | head -1)
    
    if [[ -z "$fact_data" ]]; then
        fact_data=$(echo "$fact_output" | grep -oP '"err-data"\s*:\s*"\K[^"]*' | sed 's/\\n/\n/g' | head -1)
    fi
    
    if [[ -z "$fact_data" ]]; then
        if [[ "$fact_exitcode" == "0" ]]; then
            fact_data="[OK]"
        elif [[ -z "$fact_exitcode" ]]; then
            fact_data="Нет ответа от QEMU Guest Agent (служба не запущена)"
            log_report "[ FAIL ] $vm_name: $description -> $fact_data" "$RED"
            return 1
        else
            fact_data="Ошибка выполнения (exitcode: ${fact_exitcode})"
            log_report "[ FAIL ] $vm_name: $description -> $fact_data" "$RED"
            return 1
        fi
    fi

    # 2. Выполнение проверки
    local check_output
    check_output=$(qm guest exec "$vm_id" -- /bin/bash -c "$check_command" 2>&1)
    
    local check_exitcode
    if echo "$check_output" | grep -E -q '"exitcode"\s*:\s*0'; then
        check_exitcode=0
    else
        check_exitcode=1
    fi

    if [[ "$check_exitcode" == "0" ]]; then
        log_report "[ OK ] $vm_name: $description -> ${fact_data}" "$GREEN"
        return 0
    else
        local error_data
        error_data=$(echo "$check_output" | grep -oP '"err-data"\s*:\s*"\K[^"]*' | sed 's/\\n/\n/g' | head -1)
        if [[ -n "$error_data" ]]; then
            log_report "[ FAIL ] $vm_name: $description -> Ошибка: ${error_data} (Факт: ${fact_data})" "$RED"
        else
            log_report "[ FAIL ] $vm_name: $description -> Ошибка (Факт: ${fact_data})" "$RED"
        fi
        return 1
    fi
}

# Проверка службы DNS (bind, bind9 или named)
check_dns_service() {
    local vm_id="$1"
    local fact_cmd="(systemctl is-active bind 2>/dev/null || systemctl is-active bind9 2>/dev/null || systemctl is-active named 2>/dev/null || echo 'inactive/dead')"
    local check_cmd="systemctl is-active --quiet bind || systemctl is-active --quiet bind9 || systemctl is-active --quiet named"
    check_task "$vm_id" "Служба DNS (bind/named)" "$check_cmd" "$fact_cmd"
}

# Проверка прямой A-записи
check_dns_record() {
    local vm_id="$1"
    local record_name="$2"
    local expected_value="$3"
    
    local fact_cmd="RESULT=\$(host $record_name 127.0.0.1 2>/dev/null); if echo \"\$RESULT\" | grep -q 'has address'; then echo \"\$RESULT\" | grep 'has address' | awk '{print \$NF}'; elif echo \"\$RESULT\" | grep -q 'NXDOMAIN'; then echo 'NXDOMAIN'; else echo 'not_resolved'; fi"
    local check_cmd="host $record_name 127.0.0.1 2>/dev/null | grep -q '$expected_value'"
    
    check_task "$vm_id" "DNS запись A (${record_name} -> ${expected_value})" "$check_cmd" "$fact_cmd"
}

# Проверка обратной PTR-записи
check_dns_ptr() {
    local vm_id="$1"
    local ip_address="$2"
    local expected_name="$3"
    
    local fact_cmd="RESULT=\$(host $ip_address 127.0.0.1 2>/dev/null); if echo \"\$RESULT\" | grep -q 'pointer'; then echo \"\$RESULT\" | grep 'pointer' | awk '{print \$NF}'; elif echo \"\$RESULT\" | grep -q 'NXDOMAIN'; then echo 'NXDOMAIN'; else echo 'not_resolved'; fi"
    local check_cmd="host $ip_address 127.0.0.1 2>/dev/null | grep -q '$expected_name'"
    
    check_task "$vm_id" "DNS запись PTR (${ip_address} -> ${expected_name})" "$check_cmd" "$fact_cmd"
}

# ============================================================
# ВЫПОЛНЕНИЕ ПРОВЕРОК
# ============================================================

echo "Отчет о проверке Задания №10 (DNS сервер bind)" > "$REPORT_FILE"
echo "Дата и время: $(date '+%Y-%m-%d %H:%M:%S')" >> "$REPORT_FILE"
echo "============================================================" >> "$REPORT_FILE"

log_report ""
log_report "=== НАЧАЛО ПРОВЕРКИ ЗАДАНИЯ №10 ===" "$YELLOW"
log_report ""

log_report "1. Статус службы DNS на HQ-SRV:" "$BLUE"
check_dns_service "$HQ_SRV"

log_report ""
log_report "2. Прямые записи (A):" "$BLUE"
check_dns_record "$HQ_SRV" "hq-rtr.au-team.irpo" "192.168.100.1"
check_dns_record "$HQ_SRV" "hq-srv.au-team.irpo" "192.168.100.2"
check_dns_record "$HQ_SRV" "br-rtr.au-team.irpo" "192.168.0.1"
check_dns_record "$HQ_SRV" "br-srv.au-team.irpo" "192.168.0.2"

log_report ""
log_report "3. Обратные записи (PTR):" "$BLUE"
check_dns_ptr "$HQ_SRV" "192.168.100.1" "hq-rtr.au-team.irpo"
check_dns_ptr "$HQ_SRV" "192.168.100.2" "hq-srv.au-team.irpo"

# ============================================================
# ИТОГОВАЯ СТАТИСТИКА
# ============================================================
log_report ""
log_report "=== СТАТИСТИКА ПРОВЕРКИ ЗАДАНИЯ №10 ===" "$YELLOW"

ok_checks=$(grep -c '^\[ OK \]' "$REPORT_FILE")
fail_checks=$(grep -c '^\[ FAIL \]' "$REPORT_FILE")
total_checks=$(( ok_checks + fail_checks ))

log_report "Всего проверок: $total_checks" "$BLUE"
log_report "Успешно: $ok_checks" "$GREEN"
log_report "Провалено: $fail_checks" "$RED"

if [[ $fail_checks -eq 0 && $total_checks -gt 0 ]]; then
    log_report "СТАТУС: ЗАДАНИЕ №10 ВЫПОЛНЕНО УСПЕШНО!" "$GREEN"
else
    log_report "СТАТУС: ОБНАРУЖЕНЫ ОШИБКИ (провалено проверок: ${fail_checks})" "$RED"
fi

log_report ""
log_report "Отчет сохранен в: $REPORT_FILE" "$YELLOW"
echo ""

