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

APP_DUMP="$DUMPS_DIR/$DATE-dump-db-app.sql"

echo "📦 Dumping application schema (public)..."
pg_dump \
  "$DATABASE_URL" \
  --schema=public \
  --format=plain \
  --no-owner \
  --no-acl \
  -f "$APP_DUMP"

echo "✅ Done! App dump: $APP_DUMP"
