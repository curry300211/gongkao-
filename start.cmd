@echo off
cd /d "%~dp0"

if "%1"=="dev" (
  echo === Dev Mode ===
  npx next dev -p 3000
) else (
  echo === Building ===
  call npx next build

  echo === Starting Production (http://localhost:3000) ===
  set DATABASE_URL=file:%~dp0prisma\dev.db
  set NODE_ENV=production
  node .next\standalone\server.js
)
