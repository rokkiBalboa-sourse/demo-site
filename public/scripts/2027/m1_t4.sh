#!/bin/bash

# ============================================================
# ДЕМОНСТРАЦИОННЫЙ ЭКЗАМЕН 2027
# МОДУЛЬ 1. ПРОВЕРКА ЗАДАНИЯ №4:
# Коммутация и сегментация VLAN в сегменте HQ (Access vs Trunk)
# ============================================================

# Проверка прав root
if [ "$EUID" -ne 0 ]; then
    echo -e "\033[0;31mОшибка: Скрипт должен быть запущен с правами root (sudo) на узле Proxmox VE!\033[0m"
    exit 1
fi

# --- Настройки и пути ---
REPORT_DIR="/root/pve_reports"
TIMESTAMP=$(date +"%d-%m-%Y_%H-%M-%S")
REPORT_FILE="${REPORT_DIR}/2027_M1_Task4_Report_${TIMESTAMP}.txt"

# ID виртуальных машин стенда 2027 года в Proxmox VE (VMID)
HQ_RTR="101"
HQ_SRV="102"
HQ_CLI="103"

# Отображаемые имена ВМ
declare -A VM_NAMES
VM_NAMES[$HQ_RTR]="HQ-RTR"
VM_NAMES[$HQ_SRV]="HQ-SRV"
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

check_pve_task() {
    local vm_id="$1"
    local description="$2"
    local check_command="$3"
    local fact_command="$4"
    local vm_name
    vm_name=$(get_vm_name "$vm_id")

    # Проверяем, существует ли виртуальная машина в Proxmox
    if ! qm status "$vm_id" &>/dev/null; then
        log_report "[ FAIL ] $vm_name (ID $vm_id): ВМ не найдена на гипервизоре!" "$RED"
        return
    fi

    # Выполняем проверку
    if eval "$check_command" &>/dev/null; then
        local fact_output
        fact_output=$(eval "$fact_command" 2>/dev/null | tr '\n' ' ' | sed 's/ *$//')
        log_report "[ OK ] $vm_name: $description -> $fact_output" "$GREEN"
    else
        local fact_output
        fact_output=$(eval "$fact_command" 2>/dev/null | tr '\n' ' ' | sed 's/ *$//')
        [ -z "$fact_output" ] && fact_output="ПАРАМЕТР НЕ ЗАДАН ИЛИ ОШИБКА"
        log_report "[ FAIL ] $vm_name: $description (Факт: $fact_output)" "$RED"
    fi
}

check_guest_exec() {
    local vm_id="$1"
    local description="$2"
    local guest_cmd="$3"
    local vm_name
    vm_name=$(get_vm_name "$vm_id")

    local status
    status=$(qm status "$vm_id" 2>/dev/null | awk '{print $2}')
    if [ "$status" != "running" ]; then
        log_report "[ SKIP ] $vm_name (ID $vm_id): ВМ выключена, выполнение команды в ОС невозможно" "$YELLOW"
        return
    fi

    local exec_res
    exec_res=$(qm guest exec "$vm_id" -- bash -c "$guest_cmd" 2>/dev/null)
    local exitcode
    exitcode=$(echo "$exec_res" | jq -r '.exitcode // empty' 2>/dev/null)

    if [ "$exitcode" = "0" ]; then
        local out_text
        out_text=$(echo "$exec_res" | jq -r '."out-data" // empty' 2>/dev/null | tr '\n' ' ' | sed 's/ *$//')
        [ -z "$out_text" ] && out_text="SUCCESS"
        log_report "[ OK ] $vm_name: $description -> $out_text" "$GREEN"
    else
        log_report "[ FAIL ] $vm_name: $description (Команда завершилась с ошибкой)" "$RED"
    fi
}

# --- НАЧАЛО ТЕСТИРОВАНИЯ ---
clear
log_report "============================================================" "$CYAN"
log_report "  ПРОВЕРКА ВЫПОЛНЕНИЯ ЗАДАНИЯ №4 (МОДУЛЬ 1 - 2027)" "$CYAN"
log_report "  Сегментация VLAN в сегменте HQ (Proxmox 802.1Q)" "$CYAN"
log_report "  Дата проверки: $(date +'%d.%m.%Y %H:%M:%S')" "$CYAN"
log_report "============================================================" "$CYAN"
echo ""

# ------------------------------------------------------------
# 1. Проверка настроек сетевых адаптеров на гипервизоре Proxmox VE
# ------------------------------------------------------------
log_report "1. Проверка конфигурации адаптеров ВМ на Proxmox VE:" "$BLUE"

# 1.1 HQ-SRV net0 -> tag=100 (Access)
check_pve_task "$HQ_SRV" "Адаптер net0 в режиме Access (tag=100)" \
    "qm config $HQ_SRV | grep -E '^net0:.*tag=100'" \
    "qm config $HQ_SRV | grep -E '^net0:'"

# 1.2 HQ-CLI net0 -> tag=200 (Access)
check_pve_task "$HQ_CLI" "Адаптер net0 в режиме Access (tag=200)" \
    "qm config $HQ_CLI | grep -E '^net0:.*tag=200'" \
    "qm config $HQ_CLI | grep -E '^net0:'"

# 1.3 HQ-RTR net1 -> Trunk (без тега)
check_pve_task "$HQ_RTR" "Адаптер net1 в режиме Trunk (без тега VLAN)" \
    "qm config $HQ_RTR | grep -E '^net1:' | grep -v 'tag='" \
    "qm config $HQ_RTR | grep -E '^net1:'"

echo ""

# ------------------------------------------------------------
# 2. Проверка межсегментной связности и доступности шлюза
# ------------------------------------------------------------
log_report "2. Проверка сетевой связности (L2/L3 через Router-on-a-Stick):" "$BLUE"

# Проверка связи HQ-SRV (VLAN 100) -> HQ-RTR vlan100 (192.168.100.1)
check_guest_exec "$HQ_SRV" "Пинг со шлюзом HQ-RTR (192.168.100.1, VLAN 100)" \
    "ping -c 3 -W 2 192.168.100.1 | tail -n 2"

# Проверка связи HQ-CLI (VLAN 200) -> HQ-RTR vlan200 (192.168.200.1) если назначен статический IP или DHCP
check_guest_exec "$HQ_CLI" "Пинг со шлюзом HQ-RTR (192.168.200.1, VLAN 200)" \
    "ping -c 3 -W 2 192.168.200.1 | tail -n 2"

echo ""
log_report "=== ПРОВЕРКА ЗАВЕРШЕНА ===" "$YELLOW"
log_report "Отчет сохранен в: $REPORT_FILE" "$YELLOW"
echo ""

