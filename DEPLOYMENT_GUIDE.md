# Firebase Deployment Guide for Scribe

## Prerequisites Checklist

Before deploying, make sure:
- ✅ Firebase CLI is installed (`npm install -g firebase-tools`)
- ✅ You've enabled Email/Password authentication in Firebase Console
- ✅ The app works correctly locally (run `npm run dev` and test it)
- ✅ Backend server is configured properly
- ⚠️ **IMPORTANT**: Test the app locally before deploying!

---

## Step-by-Step Deployment Process

### 1. Login to Firebase

```bash
firebase login
```

This will:
- Open your browser for authentication
- Ask you to sign in with your Google account
- Grant Firebase CLI access to your projects

### 2. Initialize Firebase in Your Project

```bash
firebase init
```

You'll be prompted with several questions. Here's what to choose:

#### **Which Firebase features do you want to set up?**
- ☑️ **Hosting** - Configure files for Firebase Hosting
- Press `Space` to select, `Enter` to continue

#### **Please select an option:**
- ➜ **Use an existing project**

#### **Select a project:**
- ➜ **scribe-7b5b4** (your project)

#### **What do you want to use as your public directory?**
- Type: `frontend/dist`
- This is where Vite builds your production files

#### **Configure as a single-page app (rewrite all urls to /index.html)?**
- ➜ **Yes** (important for React Router to work)

#### **Set up automatic builds and deploys with GitHub?**
- ➜ **No** (or Yes if you want CI/CD)

#### **File frontend/dist/index.html already exists. Overwrite?**
- ➜ **No** (if it appears after building)

---

### 3. Build Your Frontend

Before deploying, you need to build the production version:

```bash
cd frontend
npm run build
```

This creates optimized production files in `frontend/dist/`

**Verify the build:**
- Check that `frontend/dist/` folder exists
- Should contain `index.html`, `assets/`, etc.

---

### 4. Deploy to Firebase Hosting

```bash
firebase deploy
```

Or to deploy only hosting (faster):

```bash
firebase deploy --only hosting
```

---

### 5. Access Your Deployed App

After successful deployment, Firebase will show you the hosting URL:

```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/scribe-7b5b4/overview
Hosting URL: https://scribe-7b5b4.web.app
```

Your app will be live at: **https://scribe-7b5b4.web.app**

---

## Important Notes

### Backend Deployment

⚠️ **Firebase Hosting only serves the frontend!** 

Your backend (`backend/`) needs to be deployed separately. Options:

1. **Firebase Cloud Functions** (Recommended)
   - Run `firebase init functions`
   - Migrate your Express backend to Cloud Functions
   
2. **Heroku / Render / Railway**
   - Deploy backend separately
   - Update frontend API URLs to point to deployed backend

3. **Google Cloud Run / App Engine**
   - Deploy as a containerized service

### Environment Variables in Production

Your `.env` file is NOT deployed (it's in `.gitignore`).

For production:
- Firebase will use the same `.env` values during build
- Make sure your `.env` is configured before running `npm run build`

### Update Frontend to Point to Production Backend

In your frontend code, you'll need to configure the API URL:

1. Create `frontend/.env.production`:
```env
VITE_API_URL=https://your-backend-url.com
VITE_FIREBASE_API_KEY=AIzaSyDY4jI6cuHoQ9bWcO_HLm3syA6HKtGb-Ts
VITE_FIREBASE_AUTH_DOMAIN=scribe-7b5b4.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=scribe-7b5b4
VITE_FIREBASE_STORAGE_BUCKET=scribe-7b5b4.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=173117756726
VITE_FIREBASE_APP_ID=1:173117756726:web:d45576d75d777065ef8f97
VITE_FIREBASE_MEASUREMENT_ID=G-TB1EHLY7KM
```

---

## Quick Command Reference

```bash
# 1. Login
firebase login

# 2. Initialize (only needed once)
firebase init

# 3. Build frontend
cd frontend
npm run build
cd ..

# 4. Deploy
firebase deploy

# 5. View deployment (opens browser)
firebase open hosting:site
```

---

## Troubleshooting

### "Command not found: firebase"
- Firebase CLI not installed
- Run: `npm install -g firebase-tools`
- Restart your terminal

### "Build fails with Firebase errors"
- Make sure `.env` file exists with correct Firebase credentials
- Run `npm run build` locally to test

### "404 Not Found on refresh"
- Make sure you selected "Yes" for single-page app during `firebase init`
- Check `firebase.json` has: `"rewrites": [{"source": "**", "destination": "/index.html"}]`

### "Backend API calls fail"
- Backend is not deployed or URL is wrong
- Update API URL in frontend code
- Check CORS settings on backend

---

## Best Practices

1. **Always test locally first!**
   - Run `npm run dev` (frontend)
   - Run `npm start` (backend)
   - Test all features

2. **Build before deploy**
   - `npm run build` creates optimized production bundle
   - Check for build errors

3. **Preview before deploying**
   ```bash
   firebase emulators:start --only hosting
   ```

4. **Use Firebase Hosting channels for staging**
   ```bash
   firebase hosting:channel:deploy preview
   ```

---

## Next Steps After Deployment

1. ✅ Test your deployed app thoroughly
2. ✅ Set up custom domain (optional)
3. ✅ Configure Firebase Security Rules
4. ✅ Set up analytics and monitoring
5. ✅ Deploy backend to production

---

## Need Help?

- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Vite Production Build Guide](https://vitejs.dev/guide/build.html)
- [Deploy Vite App to Firebase](https://firebase.google.com/codelabs/firebase-hosting)
