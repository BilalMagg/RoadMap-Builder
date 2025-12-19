#!/usr/bin/env bash

set -e

REVERSE=false

# Parse options
while getopts "r" opt; do
  case $opt in
    r) REVERSE=true ;;
  esac
done

SYNC_ENV() {
  SOURCE="$1"
  TARGET="$2"

  if [ ! -f "$SOURCE" ]; then
    echo "❌ Missing $SOURCE"
    return
  fi

  if [ ! -f "$TARGET" ]; then
    touch "$TARGET"
    echo "📄 Created $TARGET"
  fi

  while IFS= read -r line || [ -n "$line" ]; do
    [[ -z "$line" || "$line" =~ ^# ]] && continue

    KEY="${line%%=*}"

    if grep -qE "^${KEY}=" "$TARGET"; then
      continue
    fi

    echo "${KEY}=" >> "$TARGET"
    echo "➕ Added $KEY to $TARGET"

  done < "$SOURCE"
}

run_pair() {
  local ENV="$1"
  local EXAMPLE="$2"
  local NAME="$3"

  if $REVERSE; then
    echo "🔁 Reverse syncing $NAME (.env → .env.example)"
    SYNC_ENV "$ENV" "$EXAMPLE"
  else
    echo "🔄 Syncing $NAME (.env.example → .env)"
    SYNC_ENV "$EXAMPLE" "$ENV"
  fi
}

run_pair "../backend/.env" "../backend/.env.example" "backend"
run_pair "../frontend/.env" "../frontend/.env.example" "frontend"

echo "✅ Environment files synchronized"
