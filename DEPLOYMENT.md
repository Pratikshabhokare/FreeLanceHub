# Deployment Guide for FreeLanceHub

This guide explains how to deploy the FreeLanceHub application using Docker. This setup includes the Backend (Spring Boot), Frontend (React/Vite served by Nginx), and Database (MySQL).

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

## Local Deployment

1.  **Environment Configuration**:
    - Build arguments in `docker-compose.yml` are set to `http://localhost:8082` by default for local development.
    - If you need to change database credentials or ports, modify `docker-compose.yml` directly or use a `.env` file.

2.  **Run the Application**:
    Open a terminal in the project root (where `docker-compose.yml` is located) and run:
    ```bash
    docker-compose up --build
    ```
    - The `--build` flag ensures that the latest code changes are compiled into the Docker images.

3.  **Access the Application**:
    - **Frontend**: [http://localhost:5173](http://localhost:5173) (Mapped from container port 80)
    - **Backend API**: [http://localhost:8082](http://localhost:8082)
    - **Database**: Port 3306 (User: `root`, Password: `root`, Database: `freeLanceHub`)

4.  **Stop the Application**:
    Press `Ctrl+C` in the terminal or run:
    ```bash
    docker-compose down
    ```

## Production Deployment (VPS)

To deploy on a Virtual Private Server (e.g., DigitalOcean, AWS EC2, Linode):

1.  **Install Docker & Docker Compose** on your serve.
2.  **Copy Project Files**:
    Transfer your project files to the server. You key files are:
    - `docker-compose.yml`
    - `FreeLanceHub_Backend/` (Source code + Dockerfile)
    - `FreeLanceHub_Frontend/` (Source code + Dockerfile + nginx.conf)
    
3.  **Configure for Production**:
    - Update `docker-compose.yml` -> `frontend` -> `build` -> `args`:
      - Set `VITE_API_URL` to your production backend URL (e.g., `https://api.yourdomain.com` or `http://YOUR_SERVER_IP:8082`).
    - **Important**: Security
      - Change `MYSQL_ROOT_PASSWORD` and `DB_PASSWORD` to a strong password.
      - Add your OAuth Client IDs and Secrets as environment variables in `docker-compose.yml` or a `.env` file.

4.  **Run in Background**:
    ```bash
    docker-compose up -d --build
    ```

## Cloud Platform Deployment (Alternative)

If you prefer managed platforms like **Railway**, **Render**, or **Vercel**:

### Frontend (Vercel / Netlify)
1.  Connect your repository.
2.  Set Build Command: `npm run build`
3.  Set Output Directory: `dist`
4.  Add Environment Variable: `VITE_API_URL` -> URL of your deployed backend.

### Backend (Railway / Render)
1.  Connect your repository.
2.  Set Root Directory to `FreeLanceHub_Backend/FreeLanceHub`.
3.  Add Environment Variables:
    - `DB_URL`: JDBC URL provided by the platform's database service.
    - `DB_USERNAME`, `DB_PASSWORD`: From platform.
    - `PORT`: 8080 (or as required by platform).
