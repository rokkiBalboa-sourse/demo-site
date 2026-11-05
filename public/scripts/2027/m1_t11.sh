#!/bin/bash

# ============================================================
# ДЕМОНСТРАЦИОННЫЙ ЭКЗАМЕН 2027
# МОДУЛЬ 1. ПРОВЕРКА ЗАДАНИЯ №11:
# Настройка системного времени и часового пояса (Asia/Novosibirsk)
# ============================================================

# Проверка прав root
if [ "$EUID" -ne 0 ]; then
    echo -e "\033[0;31mОшибка: Скрипт должен быть запущен с правами root (sudo) на узле Proxmox VE!\033[0m"
    exit 1
fi

# --- Настройки и пути ---
REPORT_DIR="/root/pve_reports"
TIMESTAMP=$(date +"%d-%m-%Y_%H-%M-%S")
REPORT_FILE="${REPORT_DIR}/2027_M1_Task11_Report_${TIMESTAMP}.txt"

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

ALL_VMS=("$ISP" "$HQ_RTR" "$HQ_SRV" "$HQ_CLI" "$BR_RTR" "$BR_FW" "$BR_SRV")

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
        [ -z "$fact_output" ] && fact_output="НЕВЕРНЫЙ ЧАСОВОЙ ПОЯС"
        log_report "[ FAIL ] $vm_name: $description (Факт: $fact_output)" "$RED"
    fi
}

# --- НАЧАЛО ТЕСТИРОВАНИЯ ---
clear
log_report "============================================================" "$CYAN"
log_report "  ПРОВЕРКА ВЫПОЛНЕНИЯ ЗАДАНИЯ №11 (МОДУЛЬ 1 - 2027)" "$CYAN"
log_report "  Настройка системного времени и часового пояса" "$CYAN"
log_report "  Дата проверки: $(date +'%d.%m.%Y %H:%M:%S')" "$CYAN"
log_report "============================================================" "$CYAN"
echo ""

# ------------------------------------------------------------
# 1. Проверка установки часового пояса Asia/Novosibirsk на всех ВМ
# ------------------------------------------------------------
log_report "1. Проверка часового пояса Asia/Novosibirsk (UTC+7) на всех узлах:" "$BLUE"

for vm in "${ALL_VMS[@]}"; do
    check_task "$vm" "Часовой пояс Asia/Novosibirsk" \
        "timedatectl show --property=Timezone | grep -iE 'Timezone=Asia/Novosibirsk' || readlink -f /etc/localtime | grep -iE 'Novosibirsk'" \
        "timedatectl show --property=Timezone 2>/dev/null || readlink -f /etc/localtime"
done

echo ""
log_report "=== ПРОВЕРКА ЗАВЕРШЕНА ===" "$YELLOW"
log_report "Отчет сохранен в: $REPORT_FILE" "$YELLOW"
echo ""
