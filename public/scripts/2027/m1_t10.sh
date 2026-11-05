#!/bin/bash

# ============================================================
# ДЕМОНСТРАЦИОННЫЙ ЭКЗАМЕН 2027
# МОДУЛЬ 1. ПРОВЕРКА ЗАДАНИЯ №10:
# Инфраструктура службы доменных имён (BIND)
# ============================================================

# Проверка прав root
if [ "$EUID" -ne 0 ]; then
    echo -e "\033[0;31mОшибка: Скрипт должен быть запущен с правами root (sudo) на узле Proxmox VE!\033[0m"
    exit 1
fi

# --- Настройки и пути ---
REPORT_DIR="/root/pve_reports"
TIMESTAMP=$(date +"%d-%m-%Y_%H-%M-%S")
REPORT_FILE="${REPORT_DIR}/2027_M1_Task10_Report_${TIMESTAMP}.txt"

# ID виртуальных машин стенда 2027 года в Proxmox VE (VMID)
HQ_SRV="102"
BR_SRV="106"
HQ_CLI="103"

# Отображаемые имена ВМ
declare -A VM_NAMES
VM_NAMES[$HQ_SRV]="HQ-SRV"
VM_NAMES[$BR_SRV]="BR-SRV"
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
        [ -z "$fact_output" ] && fact_output="ОШИБКА РЕЗОЛВИНГА ИЛИ СЛУЖБЫ"
        log_report "[ FAIL ] $vm_name: $description (Факт: $fact_output)" "$RED"
    fi
}

# --- НАЧАЛО ТЕСТИРОВАНИЯ ---
clear
log_report "============================================================" "$CYAN"
log_report "  ПРОВЕРКА ВЫПОЛНЕНИЯ ЗАДАНИЯ №10 (МОДУЛЬ 1 - 2027)" "$CYAN"
log_report "  Инфраструктура службы доменных имён (BIND)" "$CYAN"
log_report "  Дата проверки: $(date +'%d.%m.%Y %H:%M:%S')" "$CYAN"
log_report "============================================================" "$CYAN"
echo ""

# ------------------------------------------------------------
# 1. Проверка работы службы BIND на HQ-SRV
# ------------------------------------------------------------
log_report "1. Проверка службы BIND на сервере HQ-SRV:" "$BLUE"

check_task "$HQ_SRV" "Служба bind активна" \
    "systemctl is-active bind" \
    "systemctl is-active bind"

check_task "$HQ_SRV" "Прямое разрешение имени hq-srv.au-team.irpo" \
    "dig @127.0.0.1 +short hq-srv.au-team.irpo | grep -E '^192\.168\.100\.2$'" \
    "dig @127.0.0.1 +short hq-srv.au-team.irpo"

check_task "$HQ_SRV" "Обратное разрешение PTR для 192.168.100.2" \
    "dig @127.0.0.1 +short -x 192.168.100.2 | grep -iE 'hq-srv\.au-team\.irpo'" \
    "dig @127.0.0.1 +short -x 192.168.100.2"

check_task "$HQ_SRV" "Пересылка внешних DNS-запросов (Forwarders)" \
    "dig @127.0.0.1 +short ya.ru | grep -v '^$'" \
    "dig @127.0.0.1 +short ya.ru | head -n 1"

echo ""

# ------------------------------------------------------------
# 2. Проверка клиентского DNS-резолвинга на других узлах
# ------------------------------------------------------------
log_report "2. Проверка разрешения доменных имён клиентами:" "$BLUE"

check_task "$BR_SRV" "Настройка nameserver 192.168.100.2 в /etc/resolv.conf" \
    "grep -E 'nameserver\s+192\.168\.100\.2\b' /etc/resolv.conf" \
    "grep -E 'nameserver' /etc/resolv.conf"

check_task "$BR_SRV" "Пинг по доменному имени au-team.irpo с BR-SRV" \
    "ping -c 3 -W 2 au-team.irpo" \
    "ping -c 3 -W 2 au-team.irpo | tail -n 2"

check_task "$HQ_CLI" "Разрешение имени br-rtr с клиента HQ-CLI" \
    "host br-rtr | grep -E '172\.16\.10\.1' || dig +short br-rtr.au-team.irpo | grep -E '172\.16\.10\.1'" \
    "host br-rtr 2>/dev/null || dig +short br-rtr.au-team.irpo"

echo ""
log_report "=== ПРОВЕРКА ЗАВЕРШЕНА ===" "$YELLOW"
log_report "Отчет сохранен в: $REPORT_FILE" "$YELLOW"
echo ""
