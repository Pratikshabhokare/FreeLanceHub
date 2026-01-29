# How to Fix Social Login (Google & GitHub)

The error "401: invalid_client" happens because the project is using placeholder keys. You need to generate your own FREE keys.

## 1. Google Setup (Takes 2 minutes)
1. Go to **[Google Cloud Console](https://console.cloud.google.com/)**.
2. Create a new Project (name it "FreeLanceHub").
3. Go to **APIs & Services > Credentials**.
4. Click **Create Credentials > OAuth client ID**.
5. Application Type: **Web application**.
6. **IMPORTANT**: Add this to "Authorized redirect URIs":
   `http://localhost:8082/login/oauth2/code/google`
   *(Note: It must check port 8082 exactly)*.
7. Click **Create**.
8. Copy the **Client ID** and **Client Secret**.

## 2. GitHub Setup (Takes 1 minute)
1. Go to **[GitHub Developer Settings](https://github.com/settings/applications/new)**.
2. Application Name: "FreeLanceHub".
3. Homepage URL: `http://localhost:5173`.
4. **IMPORTANT**: Authorization callback URL:
   `http://localhost:8082/login/oauth2/code/github`
5. Click **Register application**.
6. Copy the **Client ID**.
7. Click "Generate a new client secret" and copy it.

## 3. Where to paste them
Open `FreeLanceHub_Backend/FreeLanceHub/src/main/resources/application.properties` and replace the text `PASTE_GOOGLE_CLIENT_ID_HERE` etc.
