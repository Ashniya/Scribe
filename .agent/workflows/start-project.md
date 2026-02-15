---
description: Start the Scribe project with Firebase
---

# Starting Scribe Project

## Prerequisites
1. Make sure you have `backend/firebase-key.json` (Firebase Admin Service Account)
2. Make sure you have `frontend/.env` with Firebase config
3. Firestore Database enabled in Firebase Console

## Start Backend Server

// turbo
1. Open Terminal 1 and run:
```powershell
cd backend
npm run dev
```
Expected output:
- ✅ Firebase Admin initialized with Firestore
- ✅ Server running on port 5000
- 📊 Using Firebase Firestore as database

Backend will run on: http://localhost:5000

## Start Frontend Server

// turbo
2. Open Terminal 2 and run:
```powershell
cd frontend
npm run dev
```
Expected output:
- VITE ready
- Local: http://localhost:5175

Frontend will run on: http://localhost:5175

## Verify Everything Works

3. Open browser to http://localhost:5175
4. Test:
   - Sign up with email/password or Google
   - Create a blog post
   - Check Firebase Console → Firestore to see data

## Troubleshooting

**Backend won't start:**
- Check if `backend/firebase-key.json` exists
- Check if Firestore is enabled in Firebase Console
- Check if port 5000 is available

**Frontend auth not working:**
- Check `frontend/.env` has correct Firebase credentials
- Make sure Firebase Auth is enabled in Firebase Console

**Database errors:**
- Ensure Firestore Database is created in Firebase Console
- Check Firestore Security Rules (use test mode for development)
