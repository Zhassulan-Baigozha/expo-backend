# scripts/dump-files.sh
#!/usr/bin/env bash
set -e

# 📁 Папка для дампов
DUMPS_DIR="dump"
mkdir -p "$DUMPS_DIR"

# 📅 Дата в формате YYYY.MM.DD
DATE=$(date +"%Y.%m.%d")

# 📄 Итоговый файл
OUT="$DUMPS_DIR/${DATE}-dump-files.txt"
> "$OUT"

dump_file () {
  local file="$1"
  echo "===== $file =====" >> "$OUT"
  cat "$file" >> "$OUT"
  echo "" >> "$OUT"
}

dump_dir () {
  local dir="$1"
  local exclude="$2"

  if [ -n "$exclude" ]; then
    find "$dir" \
      -path "$exclude" -prune -o \
      -type f -print
  else
    find "$dir" -type f -print
  fi \
  | sort | while read -r file; do
      dump_file "$file"
    done
}

# 📦 README.md
[ -f README.md ] && dump_file "README.md"

# 📦 package.json
[ -f package.json ] && dump_file "package.json"

# ⚙️ tsconfig.json
[ -f tsconfig.json ] && dump_file "tsconfig.json"

# 📄 .env
[ -f .env ] && dump_file ".env"

# 📂 scripts
[ -d scripts ] && dump_dir "scripts"

# 📂 prisma
[ -d prisma ] && dump_dir "prisma"

# 📂 src (исключаем Prisma client)
[ -d src ] && dump_dir "src" "src/generated/prisma"

echo "✔ dumped: files → $OUT"
