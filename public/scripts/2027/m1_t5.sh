#!/bin/bash

# ============================================================
# ДЕМОНСТРАЦИОННЫЙ ЭКЗАМЕН 2027
# МОДУЛЬ 1. ПРОВЕРКА ЗАДАНИЯ №5:
# Безопасный удаленный доступ (SSH) на HQ-SRV и BR-SRV
# ============================================================

# Проверка прав root
if [ "$EUID" -ne 0 ]; then
    echo -e "\033[0;31mОшибка: Скрипт должен быть запущен с правами root (sudo) на узле Proxmox VE!\033[0m"
    exit 1
fi

# --- Настройки и пути ---
REPORT_DIR="/root/pve_reports"
TIMESTAMP=$(date +"%d-%m-%Y_%H-%M-%S")
REPORT_FILE="${REPORT_DIR}/2027_M1_Task5_Report_${TIMESTAMP}.txt"

# ID виртуальных машин стенда 2027 года в Proxmox VE (VMID)
HQ_SRV="102"
BR_SRV="106"

# Отображаемые имена ВМ
declare -A VM_NAMES
VM_NAMES[$HQ_SRV]="HQ-SRV"
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
        [ -z "$fact_output" ] && fact_output="ПАРАМЕТР НЕ ЗАДАН ИЛИ ОШИБКА"
        log_report "[ FAIL ] $vm_name: $description (Факт: $fact_output)" "$RED"
    fi
}

# --- НАЧАЛО ТЕСТИРОВАНИЯ ---
clear
log_report "============================================================" "$CYAN"
log_report "  ПРОВЕРКА ВЫПОЛНЕНИЯ ЗАДАНИЯ №5 (МОДУЛЬ 1 - 2027)" "$CYAN"
log_report "  Безопасный удаленный доступ (SSH) на серверах" "$CYAN"
log_report "  Дата проверки: $(date +'%d.%m.%Y %H:%M:%S')" "$CYAN"
log_report "============================================================" "$CYAN"
echo ""

# ------------------------------------------------------------
# 1. Проверка конфигурации SSH на HQ-SRV
# ------------------------------------------------------------
log_report "1. Проверка настроек службы OpenSSH на HQ-SRV:" "$BLUE"

check_task "$HQ_SRV" "Нестандартный порт Port 2027" \
    "grep -E '^\s*Port\s+2027\b' /etc/openssh/sshd_config" \
    "grep -E '^\s*Port\s+' /etc/openssh/sshd_config || echo 'DEFAULT (22)'"

check_task "$HQ_SRV" "Белый список AllowUsers sshuser" \
    "grep -E '^\s*AllowUsers\s+.*sshuser' /etc/openssh/sshd_config" \
    "grep -E '^\s*AllowUsers\s+' /etc/openssh/sshd_config || echo 'НЕ ЗАДАНО'"

check_task "$HQ_SRV" "Лимит попыток MaxAuthTries 2" \
    "grep -E '^\s*MaxAuthTries\s+2\b' /etc/openssh/sshd_config" \
    "grep -E '^\s*MaxAuthTries\s+' /etc/openssh/sshd_config || echo 'НЕ ЗАДАНО'"

check_task "$HQ_SRV" "Директива баннера Banner /etc/openssh/ssh_banner" \
    "grep -E '^\s*Banner\s+/etc/openssh/ssh_banner' /etc/openssh/sshd_config" \
    "grep -E '^\s*Banner\s+' /etc/openssh/sshd_config || echo 'НЕ ЗАДАНО'"

check_task "$HQ_SRV" "Содержимое файла /etc/openssh/ssh_banner" \
    "[ -f /etc/openssh/ssh_banner ] && grep -q 'Authorized access only' /etc/openssh/ssh_banner" \
    "cat /etc/openssh/ssh_banner 2>/dev/null || echo 'ФАЙЛ ОТСУТСТВУЕТ'"

check_task "$HQ_SRV" "Статус службы sshd" \
    "systemctl is-active sshd" \
    "systemctl is-active sshd"

check_task "$HQ_SRV" "Прослушивание TCP-порта 2027" \
    "ss -tulpn | grep -E ':2027\b'" \
    "ss -tulpn | grep -E ':2027\b' | awk '{print \$5}'"

echo ""

# ------------------------------------------------------------
# 2. Проверка конфигурации SSH на BR-SRV
# ------------------------------------------------------------
log_report "2. Проверка настроек службы OpenSSH на BR-SRV:" "$BLUE"

check_task "$BR_SRV" "Нестандартный порт Port 2027" \
    "grep -E '^\s*Port\s+2027\b' /etc/openssh/sshd_config" \
    "grep -E '^\s*Port\s+' /etc/openssh/sshd_config || echo 'DEFAULT (22)'"

check_task "$BR_SRV" "Белый список AllowUsers sshuser" \
    "grep -E '^\s*AllowUsers\s+.*sshuser' /etc/openssh/sshd_config" \
    "grep -E '^\s*AllowUsers\s+' /etc/openssh/sshd_config || echo 'НЕ ЗАДАНО'"

check_task "$BR_SRV" "Лимит попыток MaxAuthTries 2" \
    "grep -E '^\s*MaxAuthTries\s+2\b' /etc/openssh/sshd_config" \
    "grep -E '^\s*MaxAuthTries\s+' /etc/openssh/sshd_config || echo 'НЕ ЗАДАНО'"

check_task "$BR_SRV" "Директива баннера Banner /etc/openssh/ssh_banner" \
    "grep -E '^\s*Banner\s+/etc/openssh/ssh_banner' /etc/openssh/sshd_config" \
    "grep -E '^\s*Banner\s+' /etc/openssh/sshd_config || echo 'НЕ ЗАДАНО'"

check_task "$BR_SRV" "Содержимое файла /etc/openssh/ssh_banner" \
    "[ -f /etc/openssh/ssh_banner ] && grep -q 'Authorized access only' /etc/openssh/ssh_banner" \
    "cat /etc/openssh/ssh_banner 2>/dev/null || echo 'ФАЙЛ ОТСУТСТВУЕТ'"

check_task "$BR_SRV" "Статус службы sshd" \
    "systemctl is-active sshd" \
    "systemctl is-active sshd"

check_task "$BR_SRV" "Прослушивание TCP-порта 2027" \
    "ss -tulpn | grep -E ':2027\b'" \
    "ss -tulpn | grep -E ':2027\b' | awk '{print \$5}'"

echo ""
log_report "=== ПРОВЕРКА ЗАВЕРШЕНА ===" "$YELLOW"
log_report "Отчет сохранен в: $REPORT_FILE" "$YELLOW"
echo ""
