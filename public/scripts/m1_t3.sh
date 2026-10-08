#!/bin/bash

# ============================================================
# ПРОВЕРКА ЗАДАНИЯ №3: Пользователи и права sudo
# ============================================================

# Проверка прав root
if [ "$EUID" -ne 0 ]; then
    echo -e "\033[0;31mОшибка: Скрипт должен быть запущен с правами root (sudo)!\033[0m"
    exit 1
fi

# --- Настройки и пути ---
REPORT_DIR="/root/pve_reports"
TIMESTAMP=$(date +"%d-%m-%Y_%H-%M-%S")
REPORT_FILE="${REPORT_DIR}/Task3_Check_Report_${TIMESTAMP}.txt"

# ID виртуальных машин
HQ_RTR="10102"
HQ_SRV="10103"
BR_RTR="10105"
BR_SRV="10106"

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

# Проверка учетной записи (существует и не заблокирована)
check_user_not_locked() {
    local vm_id="$1"
    local user="$2"
    local fact_cmd="PASS=\$(getent shadow '$user' 2>/dev/null | cut -d: -f2); if [[ -z \"\$PASS\" ]]; then echo 'user_not_found'; elif [[ \"\$PASS\" =~ ^[!*] ]]; then echo 'LOCKED'; else echo 'ACTIVE'; fi"
    local check_cmd="PASS=\$(getent shadow '$user' 2>/dev/null | cut -d: -f2); [[ -n \"\$PASS\" ]] && [[ ! \"\$PASS\" =~ ^[!*] ]]"
    check_task "$vm_id" "Пользователь ${user} существует и активен" "$check_cmd" "$fact_cmd"
}

# Проверка привилегий sudo (наличие NOPASSWD)
check_sudo() {
    local vm_id="$1"
    local user="$2"
    local fact_cmd="if [[ -f /etc/sudoers.d/$user ]]; then cat /etc/sudoers.d/$user 2>/dev/null | head -1; elif groups $user 2>/dev/null | grep -q wheel; then echo 'user in wheel group'; else echo 'no sudo config found'; fi"
    local check_cmd="if [[ -f /etc/sudoers.d/$user ]]; then grep -q 'NOPASSWD' /etc/sudoers.d/$user 2>/dev/null; elif groups $user 2>/dev/null | grep -q wheel; then grep -q '%wheel.*NOPASSWD\|%WHEEL_USERS.*NOPASSWD' /etc/sudoers /etc/sudoers.d/* 2>/dev/null; else false; fi"
    check_task "$vm_id" "Sudo права ${user} (NOPASSWD)" "$check_cmd" "$fact_cmd"
}

# ============================================================
# ВЫПОЛНЕНИЕ ПРОВЕРОК
# ============================================================

echo "Отчет о проверке Задания №3 (Пользователи и права sudo)" > "$REPORT_FILE"
echo "Дата и время: $(date '+%Y-%m-%d %H:%M:%S')" >> "$REPORT_FILE"
echo "============================================================" >> "$REPORT_FILE"

log_report ""
log_report "=== НАЧАЛО ПРОВЕРКИ ЗАДАНИЯ №3 ===" "$YELLOW"
log_report ""

log_report "1. Пользователь sshuser на серверах (HQ-SRV, BR-SRV):" "$BLUE"
check_user_not_locked "$HQ_SRV" "sshuser"
check_sudo "$HQ_SRV" "sshuser"
check_user_not_locked "$BR_SRV" "sshuser"
check_sudo "$BR_SRV" "sshuser"

log_report ""
log_report "2. Пользователь net_admin на маршрутизаторах (HQ-RTR, BR-RTR):" "$BLUE"
check_user_not_locked "$HQ_RTR" "net_admin"
check_sudo "$HQ_RTR" "net_admin"
check_user_not_locked "$BR_RTR" "net_admin"
check_sudo "$BR_RTR" "net_admin"

# ============================================================
# ИТОГОВАЯ СТАТИСТИКА
# ============================================================
log_report ""
log_report "=== СТАТИСТИКА ПРОВЕРКИ ЗАДАНИЯ №3 ===" "$YELLOW"

ok_checks=$(grep -c '^\[ OK \]' "$REPORT_FILE")
fail_checks=$(grep -c '^\[ FAIL \]' "$REPORT_FILE")
total_checks=$(( ok_checks + fail_checks ))

log_report "Всего проверок: $total_checks" "$BLUE"
log_report "Успешно: $ok_checks" "$GREEN"
log_report "Провалено: $fail_checks" "$RED"

if [[ $fail_checks -eq 0 && $total_checks -gt 0 ]]; then
    log_report "СТАТУС: ЗАДАНИЕ №3 ВЫПОЛНЕНО УСПЕШНО!" "$GREEN"
else
    log_report "СТАТУС: ОБНАРУЖЕНЫ ОШИБКИ (провалено проверок: ${fail_checks})" "$RED"
fi

log_report ""
log_report "Отчет сохранен в: $REPORT_FILE" "$YELLOW"
echo ""

