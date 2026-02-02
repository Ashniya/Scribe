# Firebase Setup Instructions for Scribe

## Current Status
⚠️ Your app is running with placeholder Firebase credentials. To enable authentication features (login, signup, forgot password), you need to configure Firebase properly.

## Steps to Configure Firebase

### 1. Create a Firebase Project (if you don't have one)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `Scribe` (or any name you prefer)
4. Follow the setup wizard (you can disable Google Analytics if you don't need it)

### 2. Enable Authentication

1. In your Firebase project, click **"Authentication"** in the left sidebar
2. Click **"Get started"**
3. Click on the **"Sign-in method"** tab
4. Enable **"Email/Password"** provider:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

### 3. Register a Web App

1. Click on the **gear icon** ⚙️ next to "Project Overview"
2. Select **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **web icon** (`</>`) to add a web app
5. Register app:
   - App nickname: `Scribe Web`
   - ✅ Check **"Also set up Firebase Hosting"** (optional)
   - Click **"Register app"**

### 4. Copy Firebase Configuration

You'll see a `firebaseConfig` object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC_example_key_12345",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

### 5. Update Your .env File

1. Open `frontend/.env` in your editor
2. Replace the placeholder values with your actual Firebase credentials:

```env
VITE_FIREBASE_API_KEY=AIzaSyC_example_key_12345
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

3. Save the file

### 6. Restart the Development Server

**IMPORTANT:** Vite doesn't watch `.env` files for changes. You must restart:

1. In your terminal, press `Ctrl + C` to stop the dev server
2. Run `npm run dev` again
3. Refresh your browser

## Verify It's Working

1. Open your browser's Developer Console (F12)
2. You should see Firebase initialization messages
3. Try navigating to `/login` - you should see the login page
4. Authentication features should now work!

## Security Note

- The `.env` file is already in `.gitignore` ✅
- Your Firebase credentials won't be committed to GitHub
- Keep your Firebase API key secure

## Troubleshooting

### "User is signed out" in console
✅ This is normal - means Firebase is working but no one is logged in

### "Firebase auth initialization timeout"
❌ Your Firebase config is still using placeholder values - update `.env`

### Build errors about Firebase
- Make sure you've run `npm install firebase`
- Restart the dev server after updating `.env`

## Need Help?

- [Firebase Documentation](https://firebase.google.com/docs/web/setup)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth/web/start)
