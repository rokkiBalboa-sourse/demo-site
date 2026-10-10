#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# SudoStudy Backup Tool
# Создание резервной копии базы данных, пользователей, сдач и конфигурации
# =============================================================================

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_DIR="${PROJECT_ROOT}/backups"
TIMESTAMP="$(date +"%Y%m%d_%H%M%S")"
BACKUP_TARGET="${BACKUP_DIR}/sudostudy_backup_${TIMESTAMP}"
ARCHIVE_NAME="sudostudy_backup_${TIMESTAMP}.tar.gz"

mkdir -p "${BACKUP_TARGET}"

echo "=========================================================="
echo " Начинаем создание резервной копии SudoStudy..."
echo " Время: $(date '+%Y-%m-%d %H:%M:%S')"
echo " Директория: ${BACKUP_TARGET}"
echo "=========================================================="

# 1. Резервная копия JSON-хранилища (.data/store.json)
if [ -d "${PROJECT_ROOT}/.data" ] && [ -f "${PROJECT_ROOT}/.data/store.json" ]; then
    echo "[+] Копирование локального хранилища .data/store.json..."
    cp -r "${PROJECT_ROOT}/.data" "${BACKUP_TARGET}/data_store"
    STORE_SIZE=$(du -sh "${PROJECT_ROOT}/.data/store.json" | cut -f1)
    echo "    Размер store.json: ${STORE_SIZE}"
else
    echo "[-] Каталог .data/store.json не найден (возможно, чистая установка)."
fi

# 2. Резервная копия конфигурационного файла .env (если есть)
if [ -f "${PROJECT_ROOT}/.env" ]; then
    echo "[+] Копирование файла конфигурации .env..."
    cp "${PROJECT_ROOT}/.env" "${BACKUP_TARGET}/env_backup.env"
fi

# 3. Резервная копия PostgreSQL (если запущен контейнер sudostudy_db)
if command -v docker &> /dev/null && docker ps --format '{{.Names}}' 2>/dev/null | grep -q "^sudostudy_db$"; then
    echo "[+] Обнаружен контейнер PostgreSQL (sudostudy_db). Создание дампа pg_dump..."
    docker exec -t sudostudy_db pg_dump -U sudostudy_user -d sudostudy_reports > "${BACKUP_TARGET}/postgres_dump.sql" 2>/dev/null || true
    if [ -s "${BACKUP_TARGET}/postgres_dump.sql" ]; then
        echo "    Дамп PostgreSQL успешно создан: $(du -sh "${BACKUP_TARGET}/postgres_dump.sql" | cut -f1)"
    else
        rm -f "${BACKUP_TARGET}/postgres_dump.sql"
        echo "    База данных PostgreSQL пуста или не инициализирована."
    fi
fi

# 4. Сохранение метаданных бэкапа
cat << EOF > "${BACKUP_TARGET}/meta.json"
{
  "timestamp": "${TIMESTAMP}",
  "created_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "version": "0.1.0",
  "project": "demo-practics"
}
EOF

# 5. Упаковка в сжатый tar.gz архив
cd "${BACKUP_DIR}"
tar -czf "${ARCHIVE_NAME}" -C "${BACKUP_DIR}" "sudostudy_backup_${TIMESTAMP}"
rm -rf "${BACKUP_TARGET}"

ARCHIVE_PATH="${BACKUP_DIR}/${ARCHIVE_NAME}"
ARCHIVE_SIZE=$(du -sh "${ARCHIVE_PATH}" | cut -f1)

echo "=========================================================="
echo " Резервная копия успешно создана!"
echo " Файл архива: ${ARCHIVE_PATH}"
echo " Размер: ${ARCHIVE_SIZE}"
echo "=========================================================="
echo ""
echo "Для восстановления выполните команду:"
echo "bash scripts/restore.sh ${ARCHIVE_PATH}"
