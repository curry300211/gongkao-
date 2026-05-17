#!/bin/bash
# Usage: ./start.sh [dev]
cd "$(dirname "$0")"

if [ "$1" = "dev" ]; then
  echo "=== Dev Mode ==="
  npx next dev -p 3000
else
  echo "=== Building ==="
  npx next build

  # Get Windows-style absolute path for SQLite
  PROJECT_DIR="$(pwd -W 2>/dev/null || pwd)"

  echo "=== Starting Production (http://localhost:3000) ==="
  export DATABASE_URL="file:${PROJECT_DIR}/prisma/dev.db"
  export NODE_ENV=production
  node .next/standalone/server.js
fi
