#!/usr/bin/env bash
set -e

# Загружаем переменные из .env
export $(grep -v '^#' .env | xargs)

# Проверка
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL is not set"
  exit 1
fi

# Дата
DATE=$(date +"%Y.%m.%d")

# Папка для дампов
DUMPS_DIR="dump"
mkdir -p "$DUMPS_DIR"

SYSTEM_DUMP="$DUMPS_DIR/$DATE-dump-db-system.sql"

echo "📦 Dumping Supabase system schemas..."
pg_dump \
  "$DATABASE_URL" \
  --exclude-schema=public \
  --format=plain \
  --no-owner \
  --no-acl \
  -f "$SYSTEM_DUMP"

echo "✅ Done! System dump: $SYSTEM_DUMP"
