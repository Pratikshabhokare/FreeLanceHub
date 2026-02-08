# Free Tier Deployment Guide

This guide will help you deploy your full-stack application (Frontend + Backend + Database) to the internet for **FREE**.

We will use:
- **TiDB Cloud** (Free MySQL Database)
- **Render** (Free Backend Hosting)
- **Vercel** (Free Frontend Hosting)

## Step 1: Push Your Code to GitHub (Crucial First Step)
Before deploying, your code must be on GitHub. If you haven't done this yet:
1. Create a **New Repository** on GitHub.
2. Push your project to it:
   ```bash
   git init
   git add .
   git commit -m "Deployment ready"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

---

## Step 2: Create a Free Database (TiDB Cloud)
1. Go to [TiDB Cloud](https://tidbcloud.com/) and sign up (it's free, no credit card required).
2. Click **Create Cluster** -> Select **Serverless** (Free).
3. Once created, click **Connect** to get your connection details.
4. You will get a JDBC URL that looks like `jdbc:mysql://gateway01.us-west-2.prod.aws.tidbcloud.com:4000/test?user=...&password=...`.
5. Keep this URL safe; you will need it for the Backend deployment.

---

## Step 3: Deploy Backend (Render)
1. Go to [Render.com](https://render.com/) and sign up.
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Select the `FreeLanceHub_Backend/FreeLanceHub` folder as the **Root Directory** (you might need to specify this in settings if the repo has multiple projects, or just deploy the whole repo and set the `Root Directory` in the build settings).
   - **Name**: `freelancehub-api` (or similar)
   - **Runtime**: `Docker`
   - **Region**: Pick one close to you (e.g., Singapore, Frankfurt, Oregon).
   - **Branch**: `main`
   - **Root Directory**: `FreeLanceHub_Backend/FreeLanceHub` (Very important!)

5. Scroll down to **Environment Variables** and add these:
   - `PORT`: `8080`
   - `DB_URL`: The JDBC URL from TiDB (Step 2).
   - `DB_USERNAME`: The user from TiDB.
   - `DB_PASSWORD`: The password from TiDB.
   - `GOOGLE_CLIENT_ID`: Your Google OAuth ID (if you have one).
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth Secret.
   *Note: If you don't have OAuth keys yet, the app might start but login won't work.*

6. Click **Create Web Service**.
7. Wait for the build to finish. Once done, copy your backend URL (e.g., `https://freelancehub-api.onrender.com`).

---

## Step 4: Deploy Frontend (Vercel)
1. Go to [Vercel.com](https://vercel.com/) and sign up.
2. Click **Add New** -> **Project**.
3. Import your GitHub repository.
4. Configure the settings:
   - **Framework Preset**: Vite
   - **Root Directory**: Click `Edit` and select `FreeLanceHub_Frontend`.
5. Open **Environment Variables** and add:
   - `VITE_API_URL`: The Backend URL from Step 3 (e.g., `https://freelancehub-api.onrender.com`).
   *Note: Do NOT add a trailing slash `/` at the end.*

6. Click **Deploy**.

---

## Step 5: Final Connection Check
1. Once Vercel finishes, open your new website URL (e.g., `https://freelancehub.vercel.app`).
2. Try to log in or register.
   - If it works, congratulations! 🚀
   - If you see errors, check the **Console** (F12 -> Console) in your browser.
     - "Network Error": Usually means Backend is sleeping (Render free tier sleeps after 15 mins). Refresh and wait 1 minute.
     - "CORS Error": Check if your Backend URL is correctly set in Vercel.

You are now live! 🎉
