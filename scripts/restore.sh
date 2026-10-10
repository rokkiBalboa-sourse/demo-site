#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# SudoStudy Restore Tool
# Восстановление базы данных, пользователей и конфигурации из резервной копии
# =============================================================================

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [ $# -lt 1 ]; then
    echo "Использование: bash scripts/restore.sh <путь_к_архиву_tar.gz>"
    echo "Пример: bash scripts/restore.sh backups/sudostudy_backup_YYYYMMDD_HHMMSS.tar.gz"
    exit 1
fi

ARCHIVE_FILE="$1"

if [ ! -f "${ARCHIVE_FILE}" ]; then
    echo "Ошибка: Файл архива '${ARCHIVE_FILE}' не найден!"
    exit 1
fi

TEMP_RESTORE_DIR="/tmp/sudostudy_restore_$$"
mkdir -p "${TEMP_RESTORE_DIR}"
trap 'rm -rf "${TEMP_RESTORE_DIR}"' EXIT

echo "=========================================================="
echo " Начинаем восстановление из архива: ${ARCHIVE_FILE}"
echo "=========================================================="

tar -xzf "${ARCHIVE_FILE}" -C "${TEMP_RESTORE_DIR}"
EXTRACTED_DIR=$(find "${TEMP_RESTORE_DIR}" -mindepth 1 -maxdepth 1 -type d | head -1)

if [ -z "${EXTRACTED_DIR}" ]; then
    echo "Ошибка: В архиве не найдена директория бэкапа."
    exit 1
fi

# 1. Восстановление .data/store.json
if [ -d "${EXTRACTED_DIR}/data_store" ]; then
    echo "[+] Восстановление хранилища .data/..."
    mkdir -p "${PROJECT_ROOT}/.data"
    cp -r "${EXTRACTED_DIR}/data_store/"* "${PROJECT_ROOT}/.data/"
    echo "    Хранилище .data/ успешно восстановлено."
fi

# 2. Восстановление .env
if [ -f "${EXTRACTED_DIR}/env_backup.env" ]; then
    if [ ! -f "${PROJECT_ROOT}/.env" ]; then
        echo "[+] Восстановление файла .env..."
        cp "${EXTRACTED_DIR}/env_backup.env" "${PROJECT_ROOT}/.env"
    else
        echo "[!] Файл .env уже существует. Сохранен как .env.restored_copy"
        cp "${EXTRACTED_DIR}/env_backup.env" "${PROJECT_ROOT}/.env.restored_copy"
    fi
fi

# 3. Восстановление PostgreSQL дампа (если был и если контейнер запущен)
if [ -f "${EXTRACTED_DIR}/postgres_dump.sql" ]; then
    if command -v docker &> /dev/null && docker ps --format '{{.Names}}' 2>/dev/null | grep -q "^sudostudy_db$"; then
        echo "[+] Импорт дампа PostgreSQL в контейнер sudostudy_db..."
        docker exec -i sudostudy_db psql -U sudostudy_user -d sudostudy_reports < "${EXTRACTED_DIR}/postgres_dump.sql"
        echo "    Дамп PostgreSQL успешно импортирован."
    else
        echo "[!] Обнаружен postgres_dump.sql, но контейнер sudostudy_db не запущен."
    fi
fi

echo "=========================================================="
echo " Восстановление успешно завершено!"
echo "=========================================================="
