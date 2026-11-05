#!/bin/bash

# ============================================================
# ДЕМОНСТРАЦИОННЫЙ ЭКЗАМЕН 2027
# МОДУЛЬ 1. ПРОВЕРКА ЗАДАНИЯ №1:
# Базовая настройка сети и хостов (FQDN, etcnet, VLAN, маршрутизация)
# ============================================================

# Проверка прав суперпользователя
if [ "$EUID" -ne 0 ]; then
    echo -e "\033[0;31mОшибка: Скрипт должен быть запущен с правами root (sudo) на узле Proxmox VE!\033[0m"
    exit 1
fi

# --- Настройки и пути ---
REPORT_DIR="/root/pve_reports"
TIMESTAMP=$(date +"%d-%m-%Y_%H-%M-%S")
REPORT_FILE="${REPORT_DIR}/2027_M1_Task1_Report_${TIMESTAMP}.txt"

# ID виртуальных машин стенда 2027 года в Proxmox VE (VMID)
ISP="100"
HQ_RTR="101"
HQ_SRV="102"
HQ_CLI="103"
BR_RTR="104"
BR_FW="105"
BR_SRV="106"

# Отображаемые имена ВМ
declare -A VM_NAMES
VM_NAMES[$ISP]="ISP"
VM_NAMES[$HQ_RTR]="HQ-RTR"
VM_NAMES[$HQ_SRV]="HQ-SRV"
VM_NAMES[$HQ_CLI]="HQ-CLI"
VM_NAMES[$BR_RTR]="BR-RTR"
VM_NAMES[$BR_FW]="BR-FW"
VM_NAMES[$BR_SRV]="BR-SRV"

# Цвета для вывода в консоль
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
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

check_task() {
    local vm_id="$1"
    local description="$2"
    local check_command="$3"
    local fact_command="$4"
    local vm_name
    vm_name=$(get_vm_name "$vm_id")

    local vm_status
    vm_status=$(qm status "$vm_id" 2>/dev/null | awk '{print $2}')
    if [[ "$vm_status" != "running" ]]; then
        log_report "[ FAIL ] $vm_name: $description -> ВМ не запущена (статус: ${vm_status:-not_found})" "$RED"
        return 1
    fi

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
            fact_data="Нет ответа от QEMU Guest Agent (служба qemu-guest-agent не запущена)"
            log_report "[ FAIL ] $vm_name: $description -> $fact_data" "$RED"
            return 1
        else
            fact_data="Ошибка выполнения (exitcode: ${fact_exitcode})"
            log_report "[ FAIL ] $vm_name: $description -> $fact_data" "$RED"
            return 1
        fi
    fi

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

# Проверка Hostname
check_hostname() {
    local vm_id="$1"
    local expected="$2"
    local fact_cmd="hostname"
    local check_cmd="hostname | tr -dc 'a-zA-Z0-9' | grep -iq '$(echo "$expected" | tr -dc 'a-zA-Z0-9')'"
    check_task "$vm_id" "FQDN хоста (${expected})" "$check_cmd" "$fact_cmd"
}

# Проверка IP-адреса и маски сети
check_ip() {
    local vm_id="$1"
    local interface="$2"
    local expected_ip="$3"
    local fact_cmd="ip -br a show $interface 2>/dev/null | awk '{print \$3}' | head -1"
    local check_cmd="ip -br a show $interface 2>/dev/null | grep -E -o '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/[0-9]+' | grep -q '${expected_ip}'"
    check_task "$vm_id" "IP адрес ${interface} (${expected_ip})" "$check_cmd" "$fact_cmd"
}

# Проверка шлюза по умолчанию
check_default_route() {
    local vm_id="$1"
    local expected_gw="$2"
    local fact_cmd="ip r | grep '^default' | awk '{print \$3}' | head -1"
    local check_cmd="ip r | grep '^default' | grep -q '${expected_gw}'"
    check_task "$vm_id" "Шлюз по умолчанию (default via ${expected_gw})" "$check_cmd" "$fact_cmd"
}

# Проверка включения маршрутизации пакетов
check_ip_forward() {
    local vm_id="$1"
    local fact_cmd="sysctl -n net.ipv4.ip_forward"
    local check_cmd="sysctl -n net.ipv4.ip_forward | grep -q '^1$'"
    check_task "$vm_id" "Маршрутизация (net.ipv4.ip_forward = 1)" "$check_cmd" "$fact_cmd"
}

# ============================================================
# СТАРТ ТЕСТИРОВАНИЯ
# ============================================================

echo "Отчет о проверке Задания №1 (2027 год): Базовая настройка сети и хостов" > "$REPORT_FILE"
echo "Дата и время: $(date '+%Y-%m-%d %H:%M:%S')" >> "$REPORT_FILE"
echo "============================================================" >> "$REPORT_FILE"

log_report ""
log_report "=== НАЧАЛО ПРОВЕРКИ ЗАДАНИЯ №1 (2027 год) ===" "$YELLOW"
log_report ""

log_report "--- 1. Имена хостов (FQDN в au-team.irpo) ---" "$CYAN"
check_hostname "$ISP" "isp.au-team.irpo"
check_hostname "$HQ_RTR" "hq-rtr.au-team.irpo"
check_hostname "$HQ_SRV" "hq-srv.au-team.irpo"
check_hostname "$HQ_CLI" "hq-cli.au-team.irpo"
check_hostname "$BR_RTR" "br-rtr.au-team.irpo"
check_hostname "$BR_FW" "br-fw.au-team.irpo"
check_hostname "$BR_SRV" "br-srv.au-team.irpo"

log_report ""
log_report "--- 2. Адресация сетевых интерфейсов ---" "$CYAN"
# ISP
check_ip "$ISP" "ens19" "172.16.1.1/28"
check_ip "$ISP" "ens20" "172.16.2.1/28"
check_ip_forward "$ISP"

# HQ-RTR
check_ip "$HQ_RTR" "ens18" "172.16.1.2/28"
check_default_route "$HQ_RTR" "172.16.1.1"
check_ip "$HQ_RTR" "vlan100" "192.168.100.1/27"
check_ip "$HQ_RTR" "vlan200" "192.168.200.1/24"
check_ip "$HQ_RTR" "vlan999" "192.168.99.1/29"
check_ip_forward "$HQ_RTR"

# HQ-SRV
check_ip "$HQ_SRV" "ens18" "192.168.100.2/27"
check_default_route "$HQ_SRV" "192.168.100.1"

# BR-RTR
check_ip "$BR_RTR" "ens18" "172.16.2.2/28"
check_default_route "$BR_RTR" "172.16.2.1"
check_ip "$BR_RTR" "ens19" "172.16.10.1/30"
check_ip_forward "$BR_RTR"

# BR-FW
check_ip "$BR_FW" "ens18" "172.16.10.2/30"
check_default_route "$BR_FW" "172.16.10.1"
check_ip "$BR_FW" "ens19" "172.16.20.1/28"
check_ip_forward "$BR_FW"

# BR-SRV
check_ip "$BR_SRV" "ens18" "172.16.20.2/28"
check_default_route "$BR_SRV" "172.16.20.1"

# ============================================================
# ИТОГОВАЯ СТАТИСТИКА
# ============================================================
log_report ""
log_report "=== СТАТИСТИКА ПРОВЕРКИ ЗАДАНИЯ №1 (2027) ===" "$YELLOW"

ok_checks=$(grep -c '^\[ OK \]' "$REPORT_FILE")
fail_checks=$(grep -c '^\[ FAIL \]' "$REPORT_FILE")
total_checks=$(( ok_checks + fail_checks ))

log_report "Всего проверок: $total_checks" "$BLUE"
log_report "Успешно: $ok_checks" "$GREEN"
log_report "Провалено: $fail_checks" "$RED"

if [[ $fail_checks -eq 0 && $total_checks -gt 0 ]]; then
    log_report "СТАТУС: ЗАДАНИЕ №1 (2027) ВЫПОЛНЕНО УСПЕШНО!" "$GREEN"
else
    log_report "СТАТУС: ОБНАРУЖЕНЫ ОШИБКИ (провалено проверок: ${fail_checks})" "$RED"
fi

log_report ""
log_report "=== ПРОВЕРКА ЗАВЕРШЕНА ===" "$YELLOW"
log_report "Файл отчета сохранен в: $REPORT_FILE" "$YELLOW"
echo ""

