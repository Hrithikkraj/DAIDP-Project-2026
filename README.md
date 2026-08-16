# DermaAI - Skin Analysis Project

DermaAI is a monorepo with a React frontend and a Python FastAPI backend for skin analysis and recommendations.

---

## Prerequisites

Install these first:

- Node.js 20+
- pnpm
- Python 3.11+

Install pnpm (if needed):

```powershell
npm install -g pnpm
```

---

## One-Time Setup (Windows PowerShell)

Run from project root:

```powershell
cd "C:\Users\lenovo\Desktop\IIIT\sem 6\DAIDP\Project\Derma-AI---Skin-analysis"
pnpm install
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install fastapi uvicorn pillow torch torchvision pandas pydantic python-multipart
```

Note: If your terminal already shows `(.venv)`, the environment is active and this is normal.

---

## Run the Project (2 Terminals)

### Terminal 1: Start Python Backend

```powershell
cd "C:\Users\lenovo\Desktop\IIIT\sem 6\DAIDP\Project\Derma-AI---Skin-analysis"
python backend\main.py
```

If Python is not picked from `.venv`, use:

```powershell
.\.venv\Scripts\python.exe backend\main.py
```

Backend URL:

- http://127.0.0.1:8000
- API docs: http://127.0.0.1:8000/docs

### Terminal 2: Start Frontend

```powershell
cd "C:\Users\lenovo\Desktop\IIIT\sem 6\DAIDP\Project\Derma-AI---Skin-analysis"
pnpm --dir artifacts\dermaai-app run dev
```

Frontend URL:

- Usually http://localhost:5173
- If 5173 is busy, Vite auto-selects another port (for example 5174). Use the URL printed in terminal.

---

## Current Backend Behavior Without Model Files

The backend now supports fallback mode.

If these files are missing:

- `best_skin_model_weights.pth`
- `best_skin_model.pth`
- `best_severity_model.pth`
- `backend/skincare_products/Skinpro.csv`

the server still starts and returns demo analysis/recommendation responses, so the full UI flow works for development/testing.

---

## Optional: Real Model/Data Files

When available, place files at:

- `backend/best_skin_model_weights.pth`
- `backend/best_skin_model.pth`
- `backend/best_severity_model.pth`
- `backend/skincare_products/Skinpro.csv`

Then restart the backend.

---

## Troubleshooting

### 1) `pip` installs to wrong location

Use venv Python explicitly:

```powershell
.\.venv\Scripts\python.exe -m pip install fastapi uvicorn pillow torch torchvision pandas pydantic python-multipart
```

### 2) Port already in use

Check and kill process:

```powershell
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

Or just use the new frontend URL Vite prints.

### 3) VS Code auto-activates venv

This is expected behavior. If you want to disable it:

- VS Code setting: `python.terminal.activateEnvironment = false`

---

## What to Open

After both terminals are running:

- Frontend: URL shown by Vite (for example http://localhost:5174)
- Backend docs: http://127.0.0.1:8000/docs
