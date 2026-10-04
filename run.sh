#!/usr/bin/env bash
# ==============================================================================
# CMPDI / CIL AI Data Intelligence Platform - Unified Startup Runner
# Starts both the FastAPI Backend (Port 8000) and Next.js Frontend (Port 3000)
# ==============================================================================

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

echo "======================================================================"
echo " Starting CMPDI / CIL AI Data Intelligence Platform"
echo " Ministry of Coal • Coal India Limited • Government of India"
echo "======================================================================"

# Function to cleanly stop child processes on exit/ctrl+c
cleanup() {
    echo ""
    echo " Shutting down CMPDI / CIL Platform services..."
    if [ -n "$BACKEND_PID" ]; then
        kill "$BACKEND_PID" 2>/dev/null || true
    fi
    if [ -n "$FRONTEND_PID" ]; then
        kill "$FRONTEND_PID" 2>/dev/null || true
    fi
    wait 2>/dev/null || true
    echo " All services terminated cleanly."
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# 1. Start Backend Service
echo "[1/2] Launching FastAPI Backend on http://127.0.0.1:8000..."
cd "$PROJECT_ROOT"
PYTHONPATH="$BACKEND_DIR:." "$BACKEND_DIR/venv/bin/python3" -m uvicorn app.main:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

# Wait briefly for backend port
sleep 2

# 2. Start Frontend Dev Service
echo "[2/2] Launching Next.js Frontend on http://localhost:3000..."
cd "$FRONTEND_DIR"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "======================================================================"
echo " Both Services Are Running!"
echo "----------------------------------------------------------------------"
echo "  Frontend Dashboard : http://localhost:3000"
echo "  Backend API Server : http://127.0.0.1:8000"
echo "  Interactive API Docs: http://127.0.0.1:8000/docs"
echo "  Health Check       : http://127.0.0.1:8000/api/health"
echo "----------------------------------------------------------------------"
echo "  Press [CTRL+C] at any time to stop all services."
echo "======================================================================"

# Wait indefinitely for both processes
wait
