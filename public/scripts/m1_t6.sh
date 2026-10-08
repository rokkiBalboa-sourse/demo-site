#!/bin/bash

# ============================================================
# ПРОВЕРКА ЗАДАНИЯ №6: GRE туннель (HQ-RTR <-> BR-RTR)
# ============================================================

# Проверка прав root
if [ "$EUID" -ne 0 ]; then
    echo -e "\033[0;31mОшибка: Скрипт должен быть запущен с правами root (sudo)!\033[0m"
    exit 1
fi

# --- Настройки и пути ---
REPORT_DIR="/root/pve_reports"
TIMESTAMP=$(date +"%d-%m-%Y_%H-%M-%S")
REPORT_FILE="${REPORT_DIR}/Task6_Check_Report_${TIMESTAMP}.txt"

# ID виртуальных машин маршрутизаторов
HQ_RTR="10102"
BR_RTR="10105"

# Отображаемые имена ВМ
declare -A VM_NAMES
VM_NAMES[$HQ_RTR]="HQ-RTR"
VM_NAMES[$BR_RTR]="BR-RTR"

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

# Проверка IP-адреса на интерфейсе
check_ip() {
    local vm_id="$1"
    local interface="$2"
    local expected_ip="$3"
    local fact_cmd="ip -br a show $interface 2>/dev/null | awk '{print \$3}' | head -1"
    local check_cmd="ip -br a show $interface 2>/dev/null | grep -E -o '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/[0-9]+' | grep -q '${expected_ip}'"
    check_task "$vm_id" "IP адрес ${interface} (${expected_ip})" "$check_cmd" "$fact_cmd"
}

# Проверка параметров GRE туннеля (поддерживает etcnet и системный вывод ip tunnel)
check_gre_tunnel() {
    local vm_id="$1"
    local tunnel_name="$2"
    local local_ip="$3"
    local remote_ip="$4"
    
    local fact_cmd="if [[ -f /etc/net/ifaces/${tunnel_name}/options ]]; then cat /etc/net/ifaces/${tunnel_name}/options 2>/dev/null | grep -E 'TUNLOCAL|TUNREMOTE' | tr '\n' ' '; else ip tunnel show ${tunnel_name} 2>/dev/null || echo 'not_found'; fi"
    local check_cmd="(grep -q 'TUNLOCAL=${local_ip}' /etc/net/ifaces/${tunnel_name}/options 2>/dev/null && grep -q 'TUNREMOTE=${remote_ip}' /etc/net/ifaces/${tunnel_name}/options 2>/dev/null) || (ip tunnel show ${tunnel_name} 2>/dev/null | grep -q 'remote ${remote_ip}' && ip tunnel show ${tunnel_name} 2>/dev/null | grep -q 'local ${local_ip}')"
    
    check_task "$vm_id" "Конфигурация GRE ${tunnel_name} (local: ${local_ip}, remote: ${remote_ip})" "$check_cmd" "$fact_cmd"
}

# ============================================================
# ВЫПОЛНЕНИЕ ПРОВЕРОК
# ============================================================

echo "Отчет о проверке Задания №6 (GRE туннель)" > "$REPORT_FILE"
echo "Дата и время: $(date '+%Y-%m-%d %H:%M:%S')" >> "$REPORT_FILE"
echo "============================================================" >> "$REPORT_FILE"

log_report ""
log_report "=== НАЧАЛО ПРОВЕРКИ ЗАДАНИЯ №6 ===" "$YELLOW"
log_report ""

log_report "1. Проверка параметров GRE туннеля gre1:" "$BLUE"
check_gre_tunnel "$HQ_RTR" "gre1" "172.16.1.2" "172.16.2.2"
check_gre_tunnel "$BR_RTR" "gre1" "172.16.2.2" "172.16.1.2"

log_report ""
log_report "2. IP-адреса внутри туннеля gre1:" "$BLUE"
check_ip "$HQ_RTR" "gre1" "10.10.10.1/30"
check_ip "$BR_RTR" "gre1" "10.10.10.2/30"

log_report ""
log_report "3. Проверка связности через туннель (Ping):" "$BLUE"
check_task "$HQ_RTR" "Пинг 10.10.10.2 через GRE с HQ-RTR" \
    "ping -c 3 -W 3 10.10.10.2 &>/dev/null" \
    "ping -c 3 -W 3 10.10.10.2 2>&1 | tail -1"

# ============================================================
# ИТОГОВАЯ СТАТИСТИКА
# ============================================================
log_report ""
log_report "=== СТАТИСТИКА ПРОВЕРКИ ЗАДАНИЯ №6 ===" "$YELLOW"

ok_checks=$(grep -c '^\[ OK \]' "$REPORT_FILE")
fail_checks=$(grep -c '^\[ FAIL \]' "$REPORT_FILE")
total_checks=$(( ok_checks + fail_checks ))

log_report "Всего проверок: $total_checks" "$BLUE"
log_report "Успешно: $ok_checks" "$GREEN"
log_report "Провалено: $fail_checks" "$RED"

if [[ $fail_checks -eq 0 && $total_checks -gt 0 ]]; then
    log_report "СТАТУС: ЗАДАНИЕ №6 ВЫПОЛНЕНО УСПЕШНО!" "$GREEN"
else
    log_report "СТАТУС: ОБНАРУЖЕНЫ ОШИБКИ (провалено проверок: ${fail_checks})" "$RED"
fi

log_report ""
log_report "Отчет сохранен в: $REPORT_FILE" "$YELLOW"
echo ""

