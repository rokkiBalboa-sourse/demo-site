#!/bin/bash

# ============================================================
# ПРОВЕРКА МОДУЛЬ 2 - ЗАДАНИЕ №1: Контроллер домена Samba DC
# ============================================================

# Проверка прав root
if [ "$EUID" -ne 0 ]; then
    echo -e "\033[0;31mОшибка: Скрипт должен быть запущен с правами root (sudo)!\033[0m"
    exit 1
fi

REPORT_DIR="/root/pve_reports"
TIMESTAMP=$(date +"%d-%m-%Y_%H-%M-%S")
REPORT_FILE="${REPORT_DIR}/M2_Task1_Check_Report_${TIMESTAMP}.txt"

ISP="10201"
HQ_RTR="10202"
HQ_SRV="10203"
HQ_CLI="10204"
BR_RTR="10205"
BR_SRV="10206"

declare -A VM_NAMES
VM_NAMES[$ISP]="ISP"
VM_NAMES[$HQ_RTR]="HQ-RTR"
VM_NAMES[$HQ_SRV]="HQ-SRV"
VM_NAMES[$HQ_CLI]="HQ-CLI"
VM_NAMES[$BR_RTR]="BR-RTR"
VM_NAMES[$BR_SRV]="BR-SRV"

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
    fact_data=$(echo "$fact_output" | grep -oP '"out-data"\s*:\s*"\K[^"]*' | sed 's/\\n/\n/g' | tr -d '\r' | sed -n '1p')
    
    [[ -z "$fact_data" ]] && fact_data=$(echo "$fact_output" | grep -oP '"err-data"\s*:\s*"\K[^"]*' | sed 's/\\n/\n/g' | tr -d '\r' | sed -n '1p')
    
    if [[ -z "$fact_data" ]]; then
        if [[ "$fact_exitcode" == "0" ]]; then
            fact_data="[OK]"
        elif [[ -z "$fact_exitcode" ]]; then
            log_report "[ FAIL ] $vm_name: $description -> нет ответа от QEMU Guest Agent" "$RED"
            return 1
        else
            log_report "[ FAIL ] $vm_name: $description -> exitcode: ${fact_exitcode}" "$RED"
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
        log_report "[ FAIL ] $vm_name: $description -> Ошибка (Факт: ${fact_data})" "$RED"
        return 1
    fi
}

check_service() {
    local vm_id="$1"
    local service_name="$2"
    local fact_cmd="systemctl is-active $service_name 2>/dev/null || echo 'inactive'"
    local check_cmd="systemctl is-active --quiet $service_name"
    check_task "$vm_id" "Сервис ${service_name}" "$check_cmd" "$fact_cmd"
}

# ============================================================
# НАЧАЛО ПРОВЕРКИ
# ============================================================
echo "Отчет о проверке Задания №1 Модуль 2 (Samba DC)" > "$REPORT_FILE"
echo "Дата и время: $(date '+%Y-%m-%d %H:%M:%S')" >> "$REPORT_FILE"
echo "============================================================" >> "$REPORT_FILE"

log_report ""
log_report "=== НАЧАЛО ПРОВЕРКИ ЗАДАНИЯ №1 (МОДУЛЬ 2) ===" "$YELLOW"
log_report "--- Samba DC (BR-SRV) ---" "$YELLOW"

# Служба Samba
check_service "$BR_SRV" "samba"

# DNS ресурсные записи
log_report ""
log_report "--- Проверка DNS записей домена au-team.irpo ---" "$YELLOW"
check_task "$BR_SRV" "DNS hq-srv -> 192.168.1.10" \
    "samba-tool dns query localhost au-team.irpo hq-srv A -U administrator%'P@ssw0rd' 2>/dev/null | grep -q '192.168.1.10'" \
    "samba-tool dns query localhost au-team.irpo hq-srv A -U administrator%'P@ssw0rd' 2>/dev/null | grep 'A:' | awk '{print \$2}' || echo 'not_found'"

check_task "$BR_SRV" "DNS hq-rtr -> 192.168.1.1" \
    "samba-tool dns query localhost au-team.irpo hq-rtr A -U administrator%'P@ssw0rd' 2>/dev/null | grep -q '192.168.1.1'" \
    "samba-tool dns query localhost au-team.irpo hq-rtr A -U administrator%'P@ssw0rd' 2>/dev/null | grep 'A:' | awk '{print \$2}' || echo 'not_found'"

check_task "$BR_SRV" "DNS br-rtr -> 192.168.3.1" \
    "samba-tool dns query localhost au-team.irpo br-rtr A -U administrator%'P@ssw0rd' 2>/dev/null | grep -q '192.168.3.1'" \
    "samba-tool dns query localhost au-team.irpo br-rtr A -U administrator%'P@ssw0rd' 2>/dev/null | grep 'A:' | awk '{print \$2}' || echo 'not_found'"

check_task "$BR_SRV" "DNS web -> 172.16.1.1" \
    "samba-tool dns query localhost au-team.irpo web A -U administrator%'P@ssw0rd' 2>/dev/null | grep -q '172.16.1.1'" \
    "samba-tool dns query localhost au-team.irpo web A -U administrator%'P@ssw0rd' 2>/dev/null | grep 'A:' | awk '{print \$2}' || echo 'not_found'"

check_task "$BR_SRV" "DNS docker -> 172.16.2.1" \
    "samba-tool dns query localhost au-team.irpo docker A -U administrator%'P@ssw0rd' 2>/dev/null | grep -q '172.16.2.1'" \
    "samba-tool dns query localhost au-team.irpo docker A -U administrator%'P@ssw0rd' 2>/dev/null | grep 'A:' | awk '{print \$2}' || echo 'not_found'"

# Пользователи Samba
log_report ""
log_report "--- Проверка пользователей Samba ---" "$YELLOW"
for i in {1..5}; do
    check_task "$BR_SRV" "User hquser$i" \
        "samba-tool user list 2>/dev/null | grep -q 'hquser$i'" \
        "samba-tool user list 2>/dev/null | grep 'hquser$i' || echo 'not_found'"
done

# Доменная группа hq
log_report ""
log_report "--- Проверка группы hq ---" "$YELLOW"
check_task "$BR_SRV" "Группа hq с пользователями" \
    "samba-tool group listmembers hq 2>/dev/null | grep -q 'hquser1'" \
    "samba-tool group listmembers hq 2>/dev/null | tr '\n' ' '"

# ============================================================
# СТАТИСТИКА
# ============================================================
log_report ""
log_report "=== СТАТИСТИКА ПРОВЕРКИ ЗАДАНИЯ №1 ===" "$YELLOW"
total=$(grep -c '^\[' "$REPORT_FILE")
ok=$(grep -c '^\[ OK \]' "$REPORT_FILE")
fail=$(grep -c '^\[ FAIL \]' "$REPORT_FILE")
log_report "Всего проверок: $total" "$BLUE"
log_report "Успешно: $ok" "$GREEN"
log_report "Провалено: $fail" "$RED"
[[ $fail -eq 0 && $total -gt 0 ]] && log_report "СТАТУС: ЗАДАНИЕ №1 ВЫПОЛНЕНО УСПЕШНО!" "$GREEN" || log_report "СТАТУС: ПРОБЛЕМ ($fail)" "$RED"

log_report ""
log_report "=== ПРОВЕРКА ЗАВЕРШЕНА ===" "$YELLOW"
log_report "Отчет сохранен в: $REPORT_FILE" "$YELLOW"
echo -e "${GREEN}Готово: $REPORT_FILE${NC}"
