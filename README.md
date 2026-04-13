# DermaAI - Skincare Web Application

A modern AI-powered skincare analysis and recommendation platform built with React, TypeScript, and Vite. This is a monorepo project that includes a frontend application and API server.

---

## 📋 Prerequisites

Before running this project locally, ensure you have the following installed on your PC:

- **Node.js** v20 or later - [Download here](https://nodejs.org/)
- **pnpm** (package manager for monorepos) - Install globally via:
  ```powershell
  npm install -g pnpm
  ```

---

## 🚀 Quick Start

### 1. Clone or Copy the Project

If cloned from GitHub:
```powershell
git clone <repository-url>
cd "skincare web app"
```

Or if you have the project folder already, navigate to it.

### 2. Install Dependencies

In the project root directory, install all dependencies across the monorepo:

```powershell
pnpm install
```

This will install dependencies for:
- Frontend app (`artifacts/dermaai-app`)
- API server (`artifacts/api-server`)
- Shared libraries (`lib/` folder packages)

### 3. Run the Development Servers

#### Option A: Run Frontend Only (Recommended for UI Development)

```powershell
cd artifacts/dermaai-app
pnpm run dev
```

The frontend will start at: **http://localhost:5173/**

#### Option B: Run Both Frontend & API Server

**Terminal 1 - Start API Server:**
```powershell
cd artifacts/api-server
pnpm run dev
```

The API server will start at: **http://localhost:3000/**

**Terminal 2 - Start Frontend:**
```powershell
cd artifacts/dermaai-app
pnpm run dev
```

The frontend will start at: **http://localhost:5173/**

#### Option C: Run from Project Root (All Packages)

```powershell
pnpm run dev
```

This runs all dev scripts defined in the workspace packages.

---

## 📁 Project Structure

```
skincare-web-app/
├── artifacts/
│   ├── api-server/          # Node.js/Express API server
│   │   └── src/
│   │       ├── app.ts       # Express app configuration
│   │       ├── index.ts     # Server entry point
│   │       ├── routes/      # API endpoints
│   │       └── middlewares/ # Custom middleware
│   │
│   └── dermaai-app/         # React frontend application
│       └── src/
│           ├── pages/       # Page components
│           ├── components/  # Reusable UI components
│           ├── hooks/       # Custom React hooks
│           ├── lib/         # Utilities and helpers
│           └── App.tsx      # Main app component
│
├── lib/
│   ├── api-client-react/    # React API client library
│   ├── api-spec/            # OpenAPI specification
│   ├── api-zod/             # Zod schema validation
│   └── db/                  # Database schema & config
│
├── tsconfig.base.json       # Base TypeScript config
├── pnpm-workspace.yaml      # Monorepo workspace config
└── package.json             # Root package configuration
```

---

## 📝 Available Scripts

### At Project Root

- `pnpm install` - Install dependencies for all packages
- `pnpm run dev` - Start dev servers for all packages

### In `artifacts/dermaai-app` (Frontend)

- `pnpm run dev` - Start Vite dev server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint

### In `artifacts/api-server` (Backend)

- `pnpm run dev` - Start API server with hot reload
- `pnpm run build` - Build the server
- `pnpm run start` - Run the built server

---

## 🌐 Accessing the Application

Once everything is running:

- **Frontend UI**: http://localhost:5173/
- **API Server**: http://localhost:3000/

---

## 🔧 Configuration

### Environment Variables

If you need to configure environment variables:

- Create a `.env.local` file in `artifacts/dermaai-app/` for frontend variables
- Create a `.env.local` file in `artifacts/api-server/` for backend variables

Check existing `.env.example` files in each folder for reference.

---

## ⚠️ Troubleshooting

### Issue: Port Already in Use

If port 5173 or 3000 is already in use:

- Change the port in the dev server configuration
- Or kill the process using the port:
  ```powershell
  # Find process on port 5173
  netstat -ano | findstr :5173
  
  # Kill the process (replace PID with the process ID)
  taskkill /PID <PID> /F
  ```

### Issue: pnpm command not found

Make sure pnpm is installed globally:
```powershell
npm install -g pnpm
```

Verify installation:
```powershell
pnpm --version
```

### Issue: Dependencies not installing

Try clearing pnpm cache:
```powershell
pnpm store prune
pnpm install
```

### Issue: Port 8080 errors in API

Check if the API server is already running or if the port is configured differently. Check `artifacts/api-server/src/index.ts` for the port configuration.

---

## 📚 Development Workflow

1. **Frontend Development**: Work in `artifacts/dermaai-app/src/`
2. **Backend Development**: Work in `artifacts/api-server/src/`
3. **Shared Code**: Use packages in `lib/` folder for shared utilities
4. **Dependencies**: Always run `pnpm install` from project root after adding new packages

---

## 🎯 Next Steps

- Open the frontend at `http://localhost:5173/`
- Start building and enjoy! 🎉
- Check individual package `README.md` files for more detailed documentation
