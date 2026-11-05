#!/bin/bash

# ============================================================
# ДЕМОНСТРАЦИОННЫЙ ЭКЗАМЕН 2027
# МОДУЛЬ 1. ПРОВЕРКА ЗАДАНИЯ №8:
# Динамическая трансляция адресов (NAT) на маршрутизаторах HQ-RTR и BR-RTR
# ============================================================

# Проверка прав root
if [ "$EUID" -ne 0 ]; then
    echo -e "\033[0;31mОшибка: Скрипт должен быть запущен с правами root (sudo) на узле Proxmox VE!\033[0m"
    exit 1
fi

# --- Настройки и пути ---
REPORT_DIR="/root/pve_reports"
TIMESTAMP=$(date +"%d-%m-%Y_%H-%M-%S")
REPORT_FILE="${REPORT_DIR}/2027_M1_Task8_Report_${TIMESTAMP}.txt"

# ID виртуальных машин стенда 2027 года в Proxmox VE (VMID)
HQ_RTR="101"
HQ_SRV="102"
BR_RTR="104"
BR_SRV="106"

# Отображаемые имена ВМ
declare -A VM_NAMES
VM_NAMES[$HQ_RTR]="HQ-RTR"
VM_NAMES[$HQ_SRV]="HQ-SRV"
VM_NAMES[$BR_RTR]="BR-RTR"
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
        [ -z "$fact_output" ] && fact_output="ОШИБКА ИЛИ НЕТ ПРАВИЛА"
        log_report "[ FAIL ] $vm_name: $description (Факт: $fact_output)" "$RED"
    fi
}

# --- НАЧАЛО ТЕСТИРОВАНИЯ ---
clear
log_report "============================================================" "$CYAN"
log_report "  ПРОВЕРКА ВЫПОЛНЕНИЯ ЗАДАНИЯ №8 (МОДУЛЬ 1 - 2027)" "$CYAN"
log_report "  Динамическая трансляция адресов (NAT Masquerade на ens18)" "$CYAN"
log_report "  Дата проверки: $(date +'%d.%m.%Y %H:%M:%S')" "$CYAN"
log_report "============================================================" "$CYAN"
echo ""

# ------------------------------------------------------------
# 1. Проверка правил nftables на маршрутизаторах
# ------------------------------------------------------------
log_report "1. Проверка службы nftables и правил Masquerade на ens18:" "$BLUE"

for rtr_id in "$HQ_RTR" "$BR_RTR"; do
    check_task "$rtr_id" "Служба nftables активна" \
        "systemctl is-active nftables" \
        "systemctl is-active nftables"

    check_task "$rtr_id" "Правило masquerade на внешнем интерфейсе ens18" \
        "nft list ruleset | grep -iE 'oifname \"ens18\" masquerade'" \
        "nft list ruleset | grep -iE 'masquerade' | head -n 1"
done

echo ""

# ------------------------------------------------------------
# 2. Проверка выхода в глобальную сеть с внутренних серверов
# ------------------------------------------------------------
log_report "2. Проверка выхода в Интернет с серверов через NAT:" "$BLUE"

check_task "$HQ_SRV" "Доступ в Интернет с HQ-SRV (ping 77.88.8.8)" \
    "ping -c 3 -W 2 77.88.8.8" \
    "ping -c 3 -W 2 77.88.8.8 | tail -n 2"

check_task "$BR_SRV" "Доступ в Интернет с BR-SRV (ping 77.88.8.8)" \
    "ping -c 3 -W 2 77.88.8.8" \
    "ping -c 3 -W 2 77.88.8.8 | tail -n 2"

echo ""
log_report "=== ПРОВЕРКА ЗАВЕРШЕНА ===" "$YELLOW"
log_report "Отчет сохранен в: $REPORT_FILE" "$YELLOW"
echo ""
