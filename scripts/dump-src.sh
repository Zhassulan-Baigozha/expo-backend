# scripts/dump-src.sh
#!/usr/bin/env bash
set -e

OUT="src_all.txt"
> "$OUT"

dump_file () {
  local file="$1"
  echo "===== $file =====" >> "$OUT"
  cat "$file" >> "$OUT"
  echo "" >> "$OUT"
}

dump_dir () {
  local dir="$1"
  find "$dir" -type f | sort | while read -r file; do
    dump_file "$file"
  done
}

# 📦 package.json
[ -f package.json ] && dump_file "package.json"

# ⚙️ tsconfig.json
[ -f tsconfig.json ] && dump_file "tsconfig.json"

# 📄 .env
[ -f .env ] && dump_file ".env"

# 📂 src
[ -d src ] && dump_dir "src"

# 📂 scripts
[ -d scripts ] && dump_dir "scripts"

echo "✔ dumped: package.json, tsconfig.json, .env, src/, scripts/ → $OUT"
