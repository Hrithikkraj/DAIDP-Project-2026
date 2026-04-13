# DAIDP-Project-2026
# steps to run this on your PC:

**Step 1: Copy the project folder**
- Send them the entire AI-Asset-Manager folder (or upload it to GitHub/cloud storage)

**Step 2: Install Node.js and pnpm**
They need to install:
- [Node.js](https://nodejs.org/) (v20 or later)
- pnpm: Open PowerShell and run:
  ```powershell
  npm install -g pnpm
  ```

**Step 3: Install dependencies**
In the project root, run:
```powershell
cd D:\AI-Asset-Manager\AI-Asset-Manager
pnpm install
```

**Step 4: Start the dev server**
```powershell
cd artifacts/dermaai-app
pnpm run dev
```

**Step 5: Open in browser**
Go to: **http://localhost:5173/**

**That's it!** The `.env.local` file you created is already included in the project folder, so they don't need to create it again.

---

**Optional: If you want to share via GitHub**
1. Upload your project to GitHub
2. They just need to clone it and run `pnpm install` then `pnpm run dev`

The project is now portable and anyone can run it on their PC!
