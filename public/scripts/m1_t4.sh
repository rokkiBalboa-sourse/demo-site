#!/bin/bash

# ============================================================
# ПРОВЕРКА ЗАДАНИЯ №4: VLAN на оборудовании (qm config)
# ============================================================

# Проверка прав root
if [ "$EUID" -ne 0 ]; then
    echo -e "\033[0;31mОшибка: Скрипт должен быть запущен с правами root (sudo)!\033[0m"
    exit 1
fi

# --- Настройки и пути ---
REPORT_DIR="/root/pve_reports"
TIMESTAMP=$(date +"%d-%m-%Y_%H-%M-%S")
REPORT_FILE="${REPORT_DIR}/Task4_Check_Report_${TIMESTAMP}.txt"

# ID виртуальных машин
HQ_SRV="10103"
HQ_CLI="10104"

# Отображаемые имена ВМ
declare -A VM_NAMES
VM_NAMES[$HQ_SRV]="HQ-SRV"
VM_NAMES[$HQ_CLI]="HQ-CLI"

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

# Проверка параметров в конфигурации ВМ (qm config)
check_vm_config() {
    local vm_id="$1"
    local description="$2"
    local search_pattern="$3"
    local vm_name
    vm_name=$(get_vm_name "$vm_id")

    # Проверка существования ВМ в Proxmox
    if ! qm status "$vm_id" &>/dev/null; then
        log_report "[ FAIL ] $vm_name (qm config): $description -> ВМ с ID $vm_id не найдена" "$RED"
        return 1
    fi

    local config_output
    config_output=$(qm config "$vm_id" 2>&1)
    
    local fact_data
    fact_data=$(echo "$config_output" | grep -E "$search_pattern" | head -1)
    
    if [[ -z "$fact_data" ]]; then
        fact_data=$(echo "$config_output" | grep -E "$(echo "$search_pattern" | sed 's/=.*//')" | head -1)
        [[ -z "$fact_data" ]] && fact_data="Параметр не найден в конфигурации"
    fi

    if echo "$config_output" | grep -E -q "$search_pattern"; then
        log_report "[ OK ] $vm_name (qm config): $description -> ${fact_data}" "$GREEN"
        return 0
    else
        log_report "[ FAIL ] $vm_name (qm config): $description -> Ошибка (Факт: ${fact_data})" "$RED"
        return 1
    fi
}

# Проверка VLAN тега на net6
check_vm_vlan_net6() {
    local vm_id="$1"
    local expected_tag="$2"
    local vm_name
    vm_name=$(get_vm_name "$vm_id")
    local net_interface="net6"
    local description="VLAN tag=${expected_tag} на интерфейсе ${net_interface}"
    
    if ! qm status "$vm_id" &>/dev/null; then
        log_report "[ FAIL ] $vm_name (qm config): $description -> ВМ с ID $vm_id не найдена" "$RED"
        return 1
    fi

    local config_output
    config_output=$(qm config "$vm_id" 2>&1)
    
    local interface_line
    interface_line=$(echo "$config_output" | grep "^${net_interface}:" | head -1)
    
    if [[ -z "$interface_line" ]]; then
        log_report "[ FAIL ] $vm_name (qm config): $description -> Интерфейс ${net_interface} не найден в конфигурации" "$RED"
        local all_nets
        all_nets=$(echo "$config_output" | grep "^net[0-9]:" | tr '\n' '; ')
        log_report "       Доступные интерфейсы: ${all_nets}" "$YELLOW"
        return 1
    fi
    
    local current_tag
    current_tag=$(echo "$interface_line" | grep -oP 'tag=\K[0-9]+' || echo "not_set")
    
    if [[ "$current_tag" == "$expected_tag" ]]; then
        log_report "[ OK ] $vm_name (qm config): $description -> tag=${current_tag}" "$GREEN"
        log_report "       ${interface_line}" "$BLUE"
        return 0
    elif [[ "$current_tag" == "not_set" ]]; then
        log_report "[ FAIL ] $vm_name (qm config): $description -> VLAN tag не установлен на ${net_interface}" "$RED"
        log_report "       Строка: ${interface_line}" "$YELLOW"
        return 1
    else
        log_report "[ FAIL ] $vm_name (qm config): $description -> Ошибка (Факт: tag=${current_tag})" "$RED"
        log_report "       Строка: ${interface_line}" "$YELLOW"
        return 1
    fi
}

# ============================================================
# ВЫПОЛНЕНИЕ ПРОВЕРОК
# ============================================================

echo "Отчет о проверке Задания №4 (VLAN на оборудовании net6)" > "$REPORT_FILE"
echo "Дата и время: $(date '+%Y-%m-%d %H:%M:%S')" >> "$REPORT_FILE"
echo "============================================================" >> "$REPORT_FILE"

log_report ""
log_report "=== НАЧАЛО ПРОВЕРКИ ЗАДАНИЯ №4 ===" "$YELLOW"
log_report ""

log_report "1. Проверка VLAN tag на net6:" "$BLUE"
check_vm_vlan_net6 "$HQ_SRV" "100"
check_vm_vlan_net6 "$HQ_CLI" "200"

log_report ""
log_report "2. Проверка наличия bridge на net6:" "$BLUE"
check_vm_config "$HQ_SRV" "Наличие bridge на интерфейсе net6" "net6.*bridge="
check_vm_config "$HQ_CLI" "Наличие bridge на интерфейсе net6" "net6.*bridge="

# ============================================================
# ИТОГОВАЯ СТАТИСТИКА
# ============================================================
log_report ""
log_report "=== СТАТИСТИКА ПРОВЕРКИ ЗАДАНИЯ №4 ===" "$YELLOW"

ok_checks=$(grep -c '^\[ OK \]' "$REPORT_FILE")
fail_checks=$(grep -c '^\[ FAIL \]' "$REPORT_FILE")
total_checks=$(( ok_checks + fail_checks ))

log_report "Всего проверок: $total_checks" "$BLUE"
log_report "Успешно: $ok_checks" "$GREEN"
log_report "Провалено: $fail_checks" "$RED"

if [[ $fail_checks -eq 0 && $total_checks -gt 0 ]]; then
    log_report "СТАТУС: ЗАДАНИЕ №4 ВЫПОЛНЕНО УСПЕШНО!" "$GREEN"
else
    log_report "СТАТУС: ОБНАРУЖЕНЫ ОШИБКИ (провалено проверок: ${fail_checks})" "$RED"
fi

log_report ""
log_report "Отчет сохранен в: $REPORT_FILE" "$YELLOW"
echo ""

