#!/bin/bash

# ============================================================
# ДЕМОНСТРАЦИОННЫЙ ЭКЗАМЕН 2027
# МОДУЛЬ 1. ПРОВЕРКА ЗАДАНИЯ №9:
# Настройка DHCP-сервера для клиентов (HQ-CLI)
# ============================================================

# Проверка прав root
if [ "$EUID" -ne 0 ]; then
    echo -e "\033[0;31mОшибка: Скрипт должен быть запущен с правами root (sudo) на узле Proxmox VE!\033[0m"
    exit 1
fi

# --- Настройки и пути ---
REPORT_DIR="/root/pve_reports"
TIMESTAMP=$(date +"%d-%m-%Y_%H-%M-%S")
REPORT_FILE="${REPORT_DIR}/2027_M1_Task9_Report_${TIMESTAMP}.txt"

# ID виртуальных машин стенда 2027 года в Proxmox VE (VMID)
HQ_RTR="101"
HQ_CLI="103"

# Отображаемые имена ВМ
declare -A VM_NAMES
VM_NAMES[$HQ_RTR]="HQ-RTR"
VM_NAMES[$HQ_CLI]="HQ-CLI"

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

    local status
    status=$(qm status "$vm_id" 2>/dev/null | awk '{print $2}')
    if [ "$status" != "running" ]; then
        log_report "[ FAIL ] $vm_name (ID $vm_id): ВМ выключена или не существует!" "$RED"
        return
    fi

    local check_res
    check_res=$(qm guest exec "$vm_id" -- bash -c "$check_command" 2>/dev/null)
    local exitcode
    exitcode=$(echo "$check_res" | jq -r '.exitcode // empty' 2>/dev/null)

    if [ "$exitcode" = "0" ]; then
        local fact_output
        fact_output=$(qm guest exec "$vm_id" -- bash -c "$fact_command" 2>/dev/null | jq -r '."out-data" // empty' | tr '\n' ' ' | sed 's/ *$//')
        [ -z "$fact_output" ] && fact_output="OK"
        log_report "[ OK ] $vm_name: $description -> $fact_output" "$GREEN"
    else
        local fact_output
        fact_output=$(qm guest exec "$vm_id" -- bash -c "$fact_command" 2>/dev/null | jq -r '."out-data" // empty' | tr '\n' ' ' | sed 's/ *$//')
        [ -z "$fact_output" ] && fact_output="ПАРАМЕТР НЕ ЗАДАН ИЛИ ОШИБКА"
        log_report "[ FAIL ] $vm_name: $description (Факт: $fact_output)" "$RED"
    fi
}

# --- НАЧАЛО ТЕСТИРОВАНИЯ ---
clear
log_report "============================================================" "$CYAN"
log_report "  ПРОВЕРКА ВЫПОЛНЕНИЯ ЗАДАНИЯ №9 (МОДУЛЬ 1 - 2027)" "$CYAN"
log_report "  Настройка DHCP-сервера для клиентов (VLAN 200)" "$CYAN"
log_report "  Дата проверки: $(date +'%d.%m.%Y %H:%M:%S')" "$CYAN"
log_report "============================================================" "$CYAN"
echo ""

# ------------------------------------------------------------
# 1. Проверка конфигурации службы dhcpd на HQ-RTR
# ------------------------------------------------------------
log_report "1. Проверка службы dhcpd на HQ-RTR:" "$BLUE"

check_task "$HQ_RTR" "Служба dhcpd активна" \
    "systemctl is-active dhcpd" \
    "systemctl is-active dhcpd"

check_task "$HQ_RTR" "Объявление подсети subnet 192.168.200.0/28" \
    "grep -E 'subnet\s+192\.168\.200\.0\s+netmask\s+255\.255\.255\.240' /etc/dhcp/dhcpd.conf" \
    "grep -E 'subnet\s+192\.168\.200\.0' /etc/dhcp/dhcpd.conf || echo 'НЕ ЗАДАНО'"

check_task "$HQ_RTR" "Диапазон выдачи range 192.168.200.2 192.168.200.14" \
    "grep -E 'range\s+192\.168\.200\.2\s+192\.168\.200\.14' /etc/dhcp/dhcpd.conf" \
    "grep -E 'range\s+' /etc/dhcp/dhcpd.conf || echo 'НЕ ЗАДАНО'"

check_task "$HQ_RTR" "Опция маршрутизатора option routers 192.168.200.1" \
    "grep -E 'option\s+routers\s+192\.168\.200\.1' /etc/dhcp/dhcpd.conf" \
    "grep -E 'option\s+routers' /etc/dhcp/dhcpd.conf || echo 'НЕ ЗАДАНО'"

echo ""

# ------------------------------------------------------------
# 2. Проверка получения настроек рабочей станцией HQ-CLI
# ------------------------------------------------------------
log_report "2. Проверка сетевых параметров на клиенте HQ-CLI:" "$BLUE"

check_task "$HQ_CLI" "Получение IP-адреса из диапазона VLAN 200" \
    "ip -4 addr show ens18 | grep -E '192\.168\.200\.(2|3|4|5|6|7|8|9|10|11|12|13|14)/28'" \
    "ip -4 -br addr show ens18 | awk '{print \$3}'"

check_task "$HQ_CLI" "Маршрут по умолчанию через 192.168.200.1" \
    "ip route show default | grep -E 'via\s+192\.168\.200\.1'" \
    "ip route show default"

check_task "$HQ_CLI" "Доступность сети Интернет (ping 77.88.8.8)" \
    "ping -c 3 -W 2 77.88.8.8" \
    "ping -c 3 -W 2 77.88.8.8 | tail -n 2"

echo ""
log_report "=== ПРОВЕРКА ЗАВЕРШЕНА ===" "$YELLOW"
log_report "Отчет сохранен в: $REPORT_FILE" "$YELLOW"
echo ""
