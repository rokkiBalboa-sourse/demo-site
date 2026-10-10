#!/bin/bash

# ============================================================
# ПРОВЕРКА МОДУЛЬ 3 - ЗАДАНИЕ №2: Центр сертификации ГОСТ и HTTPS в Nginx (ISP)
# ============================================================

# Проверка прав root
if [ "$EUID" -ne 0 ]; then
    echo -e "\033[0;31mОшибка: Скрипт должен быть запущен с правами root (sudo)!\033[0m"
    exit 1
fi

REPORT_DIR="/root/pve_reports"
TIMESTAMP=$(date +"%d-%m-%Y_%H-%M-%S")
REPORT_FILE="${REPORT_DIR}/M3_Task2_Check_Report_${TIMESTAMP}.txt"

ISP="10301"
HQ_RTR="10302"
HQ_SRV="10303"
HQ_CLI="10304"
BR_RTR="10305"
BR_SRV="10306"

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

check_file() {
    local vm_id="$1"
    local file_path="$2"
    local description="$3"
    local fact_cmd="ls -la '$file_path' 2>/dev/null | awk '{print \$5, \$9}' || echo 'not found'"
    local check_cmd="test -f '$file_path'"
    check_task "$vm_id" "$description" "$check_cmd" "$fact_cmd"
}

check_port() {
    local vm_id="$1"
    local port="$2"
    local description="$3"
    local fact_cmd="ss -ltnp 2>/dev/null | grep ':$port ' | head -1 | sed 's/  */ /g' | cut -c1-100 || echo 'port $port not listening'"
    local check_cmd="ss -ltnp 2>/dev/null | grep -q ':$port ' || netstat -ltnp 2>/dev/null | grep -q ':$port '"
    check_task "$vm_id" "$description" "$check_cmd" "$fact_cmd"
}

check_directory() {
    local vm_id="$1"
    local dir_path="$2"
    local description="$3"
    local fact_cmd="ls -ld '$dir_path' 2>/dev/null | head -1 || echo 'not found'"
    local check_cmd="test -d '$dir_path'"
    check_task "$vm_id" "$description" "$check_cmd" "$fact_cmd"
}

# ============================================================
# НАЧАЛО ПРОВЕРКИ
# ============================================================
echo "Отчет о проверке Задания №2 Модуль 3 (Центр сертификации ГОСТ и Nginx HTTPS)" > "$REPORT_FILE"
echo "Дата и время: $(date '+%Y-%m-%d %H:%M:%S')" >> "$REPORT_FILE"
echo "============================================================" >> "$REPORT_FILE"

log_report ""
log_report "=== НАЧАЛО ПРОВЕРКИ ЗАДАНИЯ №2 (МОДУЛЬ 3) ===" "$YELLOW"
log_report "--- Центр сертификации и Nginx (ISP) ---" "$YELLOW"

# Проверка сертификатов и ключей на ISP
check_file "$ISP" "/root/ca.crt" "Корневой сертификат CA"
check_file "$ISP" "/root/ca.key" "Закрытый ключ CA"
check_file "$ISP" "/root/web.au-team.irpo.crt" "Сертификат web.au-team.irpo"
check_file "$ISP" "/root/web.au-team.irpo.key" "Ключ web.au-team.irpo"
check_file "$ISP" "/root/docker.au-team.irpo.crt" "Сертификат docker.au-team.irpo"
check_file "$ISP" "/root/docker.au-team.irpo.key" "Ключ docker.au-team.irpo"

# Служба Nginx и прослушивание HTTPS 443
check_service "$ISP" "nginx"
check_port "$ISP" "443" "Nginx слушает порт 443 (HTTPS)"

# Проверка конфигурации ГОСТ-шифров в Nginx
check_task "$ISP" "Конфигурация ГОСТ-шифров в Nginx" \
    "grep -qi 'GOST2012' /etc/nginx/sites-available.d/r-proxy.conf 2>/dev/null" \
    "grep -i 'ssl_ciphers' /etc/nginx/sites-available.d/r-proxy.conf 2>/dev/null | head -1"

# Проверка доверенного корневого сертификата на HQ-CLI
check_task "$HQ_CLI" "Корневой CA импортирован в ca-trust на HQ-CLI" \
    "test -f /etc/pki/ca-trust/source/anchors/ca.crt" \
    "ls -l /etc/pki/ca-trust/source/anchors/ca.crt 2>/dev/null || echo 'not_found'"

# ============================================================
# СТАТИСТИКА
# ============================================================
log_report ""
log_report "=== СТАТИСТИКА ПРОВЕРКИ ЗАДАНИЯ №2 ===" "$YELLOW"
total=$(grep -c '^[' "$REPORT_FILE")
ok=$(grep -c '^[ OK ]' "$REPORT_FILE")
fail=$(grep -c '^[ FAIL ]' "$REPORT_FILE")
log_report "Всего проверок: $total" "$BLUE"
log_report "Успешно: $ok" "$GREEN"
log_report "Провалено: $fail" "$RED"
[[ $fail -eq 0 && $total -gt 0 ]] && log_report "СТАТУС: ЗАДАНИЕ №2 ВЫПОЛНЕНО УСПЕШНО!" "$GREEN" || log_report "СТАТУС: ПРОБЛЕМ ($fail)" "$RED"

log_report ""
log_report "=== ПРОВЕРКА ЗАВЕРШЕНА ===" "$YELLOW"
log_report "Отчет сохранен в: $REPORT_FILE" "$YELLOW"
echo -e "${GREEN}Готово: $REPORT_FILE${NC}"
