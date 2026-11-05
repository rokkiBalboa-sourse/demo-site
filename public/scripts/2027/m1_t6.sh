#!/bin/bash

# ============================================================
# ДЕМОНСТРАЦИОННЫЙ ЭКЗАМЕН 2027
# МОДУЛЬ 1. ПРОВЕРКА ЗАДАНИЯ №6:
# Межофисный защищенный IP-туннель (GRE) между HQ-RTR и BR-RTR
# ============================================================

# Проверка прав root
if [ "$EUID" -ne 0 ]; then
    echo -e "\033[0;31mОшибка: Скрипт должен быть запущен с правами root (sudo) на узле Proxmox VE!\033[0m"
    exit 1
fi

# --- Настройки и пути ---
REPORT_DIR="/root/pve_reports"
TIMESTAMP=$(date +"%d-%m-%Y_%H-%M-%S")
REPORT_FILE="${REPORT_DIR}/2027_M1_Task6_Report_${TIMESTAMP}.txt"

# ID виртуальных машин стенда 2027 года в Proxmox VE (VMID)
HQ_RTR="101"
BR_RTR="104"

# Отображаемые имена ВМ
declare -A VM_NAMES
VM_NAMES[$HQ_RTR]="HQ-RTR"
VM_NAMES[$BR_RTR]="BR-RTR"

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
log_report "  ПРОВЕРКА ВЫПОЛНЕНИЯ ЗАДАНИЯ №6 (МОДУЛЬ 1 - 2027)" "$CYAN"
log_report "  Межофисный защищенный IP-туннель (GRE 10.10.10.0/30)" "$CYAN"
log_report "  Дата проверки: $(date +'%d.%m.%Y %H:%M:%S')" "$CYAN"
log_report "============================================================" "$CYAN"
echo ""

# ------------------------------------------------------------
# 1. Проверка конфигурации gre1 на маршрутизаторе HQ-RTR
# ------------------------------------------------------------
log_report "1. Проверка параметров туннеля gre1 на HQ-RTR:" "$BLUE"

check_task "$HQ_RTR" "Тип интерфейса TYPE=iptun" \
    "grep -E '^\s*TYPE=iptun\b' /etc/net/ifaces/gre1/options" \
    "grep -E '^\s*TYPE=' /etc/net/ifaces/gre1/options || echo 'НЕ ЗАДАНО'"

check_task "$HQ_RTR" "Протокол инкапсуляции TUNTYPE=gre" \
    "grep -E '^\s*TUNTYPE=gre\b' /etc/net/ifaces/gre1/options" \
    "grep -E '^\s*TUNTYPE=' /etc/net/ifaces/gre1/options || echo 'НЕ ЗАДАНО'"

check_task "$HQ_RTR" "Локальный внешний адрес TUNLOCAL=172.16.1.2" \
    "grep -E '^\s*TUNLOCAL=172\.16\.1\.2\b' /etc/net/ifaces/gre1/options" \
    "grep -E '^\s*TUNLOCAL=' /etc/net/ifaces/gre1/options || echo 'НЕ ЗАДАНО'"

check_task "$HQ_RTR" "Удаленный внешний адрес TUNREMOTE=172.16.2.2" \
    "grep -E '^\s*TUNREMOTE=172\.16\.2\.2\b' /etc/net/ifaces/gre1/options" \
    "grep -E '^\s*TUNREMOTE=' /etc/net/ifaces/gre1/options || echo 'НЕ ЗАДАНО'"

check_task "$HQ_RTR" "Туннельный IP-адрес 10.10.10.1/30" \
    "grep -E '^\s*10\.10\.10\.1/30\b' /etc/net/ifaces/gre1/ipv4address" \
    "cat /etc/net/ifaces/gre1/ipv4address 2>/dev/null || echo 'НЕ ЗАДАНО'"

check_task "$HQ_RTR" "Состояние интерфейса gre1 в ядре" \
    "ip link show gre1 | grep -q 'state UP'" \
    "ip -br addr show gre1 2>/dev/null || echo 'ИНТЕРФЕЙС ОТСУТСТВУЕТ'"

echo ""

# ------------------------------------------------------------
# 2. Проверка конфигурации gre1 на маршрутизаторе BR-RTR
# ------------------------------------------------------------
log_report "2. Проверка параметров туннеля gre1 на BR-RTR:" "$BLUE"

check_task "$BR_RTR" "Тип интерфейса TYPE=iptun" \
    "grep -E '^\s*TYPE=iptun\b' /etc/net/ifaces/gre1/options" \
    "grep -E '^\s*TYPE=' /etc/net/ifaces/gre1/options || echo 'НЕ ЗАДАНО'"

check_task "$BR_RTR" "Протокол инкапсуляции TUNTYPE=gre" \
    "grep -E '^\s*TUNTYPE=gre\b' /etc/net/ifaces/gre1/options" \
    "grep -E '^\s*TUNTYPE=' /etc/net/ifaces/gre1/options || echo 'НЕ ЗАДАНО'"

check_task "$BR_RTR" "Локальный внешний адрес TUNLOCAL=172.16.2.2" \
    "grep -E '^\s*TUNLOCAL=172\.16\.2\.2\b' /etc/net/ifaces/gre1/options" \
    "grep -E '^\s*TUNLOCAL=' /etc/net/ifaces/gre1/options || echo 'НЕ ЗАДАНО'"

check_task "$BR_RTR" "Удаленный внешний адрес TUNREMOTE=172.16.1.2" \
    "grep -E '^\s*TUNREMOTE=172\.16\.1\.2\b' /etc/net/ifaces/gre1/options" \
    "grep -E '^\s*TUNREMOTE=' /etc/net/ifaces/gre1/options || echo 'НЕ ЗАДАНО'"

check_task "$BR_RTR" "Туннельный IP-адрес 10.10.10.2/30" \
    "grep -E '^\s*10\.10\.10\.2/30\b' /etc/net/ifaces/gre1/ipv4address" \
    "cat /etc/net/ifaces/gre1/ipv4address 2>/dev/null || echo 'НЕ ЗАДАНО'"

check_task "$BR_RTR" "Состояние интерфейса gre1 в ядре" \
    "ip link show gre1 | grep -q 'state UP'" \
    "ip -br addr show gre1 2>/dev/null || echo 'ИНТЕРФЕЙС ОТСУТСТВУЕТ'"

echo ""

# ------------------------------------------------------------
# 3. Проверка прохождения ICMP-трафика по туннелю gre1
# ------------------------------------------------------------
log_report "3. Проверка связности по туннелю (ICMP Ping):" "$BLUE"

check_task "$HQ_RTR" "Пинг с HQ-RTR на 10.10.10.2 (BR-RTR)" \
    "ping -c 3 -W 2 10.10.10.2" \
    "ping -c 3 -W 2 10.10.10.2 | tail -n 2"

check_task "$BR_RTR" "Пинг с BR-RTR на 10.10.10.1 (HQ-RTR)" \
    "ping -c 3 -W 2 10.10.10.1" \
    "ping -c 3 -W 2 10.10.10.1 | tail -n 2"

echo ""
log_report "=== ПРОВЕРКА ЗАВЕРШЕНА ===" "$YELLOW"
log_report "Отчет сохранен в: $REPORT_FILE" "$YELLOW"
echo ""

