#!/bin/bash

# ============================================================
# ПРОВЕРКА ЗАДАНИЯ №9: DNS и DHCP (dnsmasq на HQ-RTR)
# ============================================================

# Проверка прав root
if [ "$EUID" -ne 0 ]; then
    echo -e "\033[0;31mОшибка: Скрипт должен быть запущен с правами root (sudo)!\033[0m"
    exit 1
fi

# --- Настройки и пути ---
REPORT_DIR="/root/pve_reports"
TIMESTAMP=$(date +"%d-%m-%Y_%H-%M-%S")
REPORT_FILE="${REPORT_DIR}/Task9_Check_Report_${TIMESTAMP}.txt"

# ID виртуальной машины
HQ_RTR="10102"

# Отображаемые имена ВМ
declare -A VM_NAMES
VM_NAMES[$HQ_RTR]="HQ-RTR"

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

# Проверка статуса службы systemd
check_service() {
    local vm_id="$1"
    local service_name="$2"
    local fact_cmd="systemctl is-active $service_name 2>/dev/null || echo 'inactive/dead'"
    local check_cmd="systemctl is-active --quiet $service_name"
    check_task "$vm_id" "Служба ${service_name}" "$check_cmd" "$fact_cmd"
}

# Проверка конфигурации DHCP в dnsmasq
check_dhcp_config() {
    local vm_id="$1"
    local config_line="$2"
    local fact_cmd="grep -E '^[# ]*dhcp-range' /etc/dnsmasq.conf /etc/dnsmasq.d/* 2>/dev/null | head -1 || echo 'not_found'"
    local check_cmd="grep -h -q '${config_line}' /etc/dnsmasq.conf /etc/dnsmasq.d/* 2>/dev/null"
    check_task "$vm_id" "DHCP конфигурация dnsmasq" "$check_cmd" "$fact_cmd"
}

# ============================================================
# ВЫПОЛНЕНИЕ ПРОВЕРОК
# ============================================================

echo "Отчет о проверке Задания №9 (DNS и DHCP dnsmasq)" > "$REPORT_FILE"
echo "Дата и время: $(date '+%Y-%m-%d %H:%M:%S')" >> "$REPORT_FILE"
echo "============================================================" >> "$REPORT_FILE"

log_report ""
log_report "=== НАЧАЛО ПРОВЕРКИ ЗАДАНИЯ №9 ===" "$YELLOW"
log_report ""

log_report "1. Служба dnsmasq на HQ-RTR:" "$BLUE"
check_service "$HQ_RTR" "dnsmasq"

log_report ""
log_report "2. Конфигурация пула DHCP:" "$BLUE"
check_dhcp_config "$HQ_RTR" "dhcp-range=interface:vlan200,192.168.200.2,192.168.200.2,255.255.255.240,6h"

log_report ""
log_report "3. Настройка DNS nameserver на HQ-RTR:" "$BLUE"
check_task "$HQ_RTR" "DNS перенаправлен на 192.168.100.2" \
    "grep -q 'nameserver 192.168.100.2' /etc/net/ifaces/vlan111/resolv.conf 2>/dev/null || grep -q 'nameserver 192.168.100.2' /etc/resolv.conf 2>/dev/null" \
    "cat /etc/net/ifaces/vlan111/resolv.conf /etc/resolv.conf 2>/dev/null | grep 'nameserver 192.168.100.2' | head -1 || echo 'not_set'"

# ============================================================
# ИТОГОВАЯ СТАТИСТИКА
# ============================================================
log_report ""
log_report "=== СТАТИСТИКА ПРОВЕРКИ ЗАДАНИЯ №9 ===" "$YELLOW"

ok_checks=$(grep -c '^\[ OK \]' "$REPORT_FILE")
fail_checks=$(grep -c '^\[ FAIL \]' "$REPORT_FILE")
total_checks=$(( ok_checks + fail_checks ))

log_report "Всего проверок: $total_checks" "$BLUE"
log_report "Успешно: $ok_checks" "$GREEN"
log_report "Провалено: $fail_checks" "$RED"

if [[ $fail_checks -eq 0 && $total_checks -gt 0 ]]; then
    log_report "СТАТУС: ЗАДАНИЕ №9 ВЫПОЛНЕНО УСПЕШНО!" "$GREEN"
else
    log_report "СТАТУС: ОБНАРУЖЕНЫ ОШИБКИ (провалено проверок: ${fail_checks})" "$RED"
fi

log_report ""
log_report "Отчет сохранен в: $REPORT_FILE" "$YELLOW"
echo ""

