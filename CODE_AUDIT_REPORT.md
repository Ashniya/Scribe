# Scribe Project - Complete Code Audit Report

## Date: February 11, 2026

## Executive Summary
This report provides a comprehensive audit of the Scribe project's backend and frontend code structure, identifying issues, inconsistencies, and providing recommendations.

---

## 🔴 CRITICAL ISSUES FOUND

### 1. **Field Name Inconsistency: `author` vs `authorId`**
**Severity:** HIGH  
**Location:** Backend service vs Frontend service vs Firebase schema

**Problem:**
- **Firebase Schema** (from screenshot): Uses `authorId` field
- **Backend** (`backend/src/services/blog.service.js`):
  - Line 30: Stores as `author` (not `authorId`)
  - Line 64: Queries using `author` field
- **Frontend** (`frontend/src/servicies/firestore.js`):
  - Line 24: Stores as `author` field
  - Line 64: Queries using `authorId` field

**Impact:** 
- Frontend and backend are querying different fields
- Data inconsistency between what's stored and what's queried
- User blogs won't be retrieved correctly

**Recommendation:** Standardize to use `authorId` everywhere to match Firebase schema

---

### 2. **Field Name Inconsistency: `likescount` vs `likes`**
**Severity:** MEDIUM  
**Location:** Firebase schema vs Backend implementation

**Problem:**
- **Firebase Schema**: Shows `likescount` (number) and `commentscount` (number)
- **Backend**: Uses `likes` (array) to store user IDs who liked the post

**Impact:**
- Schema mismatch between expected structure and implementation
- The backend stores an array of user IDs, but Firebase shows a count

**Recommendation:** Decide on one approach:
- Option A: Keep `likes` as array, add `likesCount` as computed field
- Option B: Change to `likescount` number and create separate `likedBy` collection

---

## ⚠️ MODERATE ISSUES

### 3. **Unused/Obsolete Dependencies**
**Location:** `frontend/package.json`

**Issues:**
- `bcryptjs` in frontend (line 14) - Should only be in backend
- `firebase-admin` in frontend (line 16) - Should only be in backend
- `lucide-react` in backend (line 16) - Should only be in frontend

**Recommendation:** Remove these from the wrong packages

---

### 4. **Backend .env File Issues**
**Location:** `backend/.env`

**Problems:**
- Line 1-7: Contains `VITE_` prefixed variables (these are for frontend only)
- Line 10: Contains `MONGODB_URI` but project uses Firebase (obsolete)

**Recommendation:** Clean up .env file to only contain backend-relevant variables

---

### 5. **Commented Out Code**
**Locations:**
- `backend/src/routes/auth.routes.js` (lines 1-9)
- `frontend/src/main.jsx` (lines 1-10)
- `frontend/src/App.jsx` (line 12)

**Recommendation:** Remove commented code to improve maintainability

---

## ✅ STRUCTURE ANALYSIS

### Backend Structure (/backend/src)
```
✅ config/
   ✅ firebase.js - Properly configured
   ⚠️ passport.js - May be unused (check if needed)

✅ controllers/
   ✅ auth.controller.js - Well structured
   ✅ blog.controller.js - Well structured

✅ middleware/
   ✅ auth.middleware.js - Properly implements Firebase auth
   ✅ error.middleware.js - Present

✅ routes/
   ✅ auth.routes.js - Properly configured
   ✅ blog.routes.js - Properly configured
   ✅ test.routes.js - Good for debugging

✅ services/
   ⚠️ blog.service.js - Has field name issues (see Critical #1)
   ⚠️ user.service.js - Recently fixed collection name

✅ utils/
   ✅ generateToken.js - Present
   ✅ sendOTP.js - Present

✅ server.js - Well configured
```

### Frontend Structure (/frontend/src)
```
✅ components/
   ✅ Editor.jsx
   ✅ LoginPromptModal.jsx
   ✅ Navbar.jsx
   ✅ ProfileSettings.jsx
   ✅ ProtectedRoute.jsx

✅ config/
   ✅ firebase.js - Properly configured

✅ context/
   ✅ AuthContext.jsx - Well implemented
   ✅ ThemeContext.jsx - Present

✅ pages/
   ✅ About.jsx
   ✅ Contact.jsx
   ✅ Dashboard.jsx
   ✅ ForgotPassword.jsx
   ✅ Landing.jsx
   ✅ Login.jsx

✅ servicies/ (Note: Typo in folder name - should be "services")
   ⚠️ api.js - Good implementation
   ⚠️ firestore.js - Has field name issues (see Critical #1)

✅ App.jsx - Well structured with proper routing
✅ main.jsx - Properly configured
```

---

## 📋 CONFIGURATION FILES AUDIT

### ✅ Backend package.json
- Type: module ✅
- Scripts: Properly configured ✅
- Dependencies: Appropriate (except lucide-react) ⚠️

### ✅ Frontend package.json
- Type: module ✅
- Scripts: Properly configured ✅
- Dependencies: Has unnecessary backend packages ⚠️

### ⚠️ Backend .env
- Contains frontend variables (VITE_*) ❌
- Contains obsolete MongoDB URI ❌
- Missing proper backend-only variables

### ✅ Frontend .env
- Properly configured ✅
- All VITE_ prefixed ✅
- API URL configured ✅

---

## 🔧 RECOMMENDED FIXES (Priority Order)

### Priority 1: Critical Field Name Issues

**Fix 1: Standardize author field to `authorId`**

Files to update:
1. `backend/src/services/blog.service.js` - Change `author` to `authorId`
2. `backend/src/controllers/blog.controller.js` - Change `author` to `authorId`
3. `frontend/src/servicies/firestore.js` - Ensure uses `authorId` consistently

**Fix 2: Standardize likes implementation**

Decide on schema and implement consistently across:
1. `backend/src/services/blog.service.js`
2. `frontend/src/servicies/firestore.js`

### Priority 2: Clean Up Dependencies

**Backend package.json:**
```json
Remove: "lucide-react": "^0.563.0"
```

**Frontend package.json:**
```json
Remove: 
  "bcryptjs": "^3.0.3"
  "firebase-admin": "^13.6.1"
```

### Priority 3: Clean Up Environment Files

**Backend .env should contain:**
```env
FIREBASE_PROJECT_ID=scribe-7b5b4
PORT=5000
FRONTEND_URL=http://localhost:5174
# Remove all VITE_* variables
# Remove MONGODB_URI
```

### Priority 4: Remove Commented Code

Clean up all commented code blocks in:
- `backend/src/routes/auth.routes.js`
- `frontend/src/main.jsx`
- `frontend/src/App.jsx`

### Priority 5: Rename Folder

Rename `frontend/src/servicies/` to `frontend/src/services/` (fix typo)

---

## 📊 FIELD MAPPING REFERENCE

### Current Firebase Schema (from screenshot):
```
blogs collection:
  - authorId: string
  - commentscount: number
  - content: string
  - createdAt: timestamp
  - likescount: number
  - published: boolean
  - title: string
  - updatedAt: timestamp

users collection:
  - createdAt: timestamp
  - email: string
  - name: string
  - uid: string
```

### Current Backend Implementation:
```javascript
// blog.service.js creates:
{
  title: string,
  content: string,
  excerpt: string,
  category: string,
  tags: array,
  coverImage: string,
  author: string,        // ❌ Should be authorId
  authorName: string,
  authorEmail: string,
  readTime: number,
  views: number,
  likes: array,          // ⚠️ Schema shows likescount (number)
  published: boolean,
  publishedAt: date,
  createdAt: date,
  updatedAt: date
}
```

### Recommended Schema:
```javascript
{
  title: string,
  content: string,
  excerpt: string,
  category: string,
  tags: array,
  coverImage: string,
  authorId: string,      // ✅ Matches Firebase
  authorName: string,
  authorEmail: string,
  readTime: number,
  views: number,
  likes: array,          // Array of user IDs
  likescount: number,    // ✅ Computed count
  commentscount: number, // ✅ Add this field
  published: boolean,
  publishedAt: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

---

## 🎯 OVERALL ASSESSMENT

### Strengths:
✅ Well-organized project structure  
✅ Proper separation of concerns  
✅ Firebase integration is mostly correct  
✅ Good use of middleware and services pattern  
✅ Protected routes properly implemented  
✅ Context API properly used for state management  

### Weaknesses:
❌ Field name inconsistencies between frontend/backend/Firebase  
❌ Dependency pollution (wrong packages in wrong places)  
❌ Environment variable confusion  
❌ Some obsolete code and comments  

### Overall Grade: B- (Good structure, needs cleanup)

---

## 📝 NEXT STEPS

1. **Immediate:** Fix the `author` → `authorId` field inconsistency
2. **Short-term:** Clean up dependencies and environment files
3. **Medium-term:** Implement proper likes/comments counting
4. **Long-term:** Add comprehensive error handling and logging

---

## 🔍 FILES CHECKED

### Backend (14 files):
- ✅ config/firebase.js
- ⚠️ config/passport.js
- ✅ controllers/auth.controller.js
- ⚠️ controllers/blog.controller.js
- ✅ middleware/auth.middleware.js
- ✅ middleware/error.middleware.js
- ⚠️ routes/auth.routes.js
- ✅ routes/blog.routes.js
- ✅ routes/test.routes.js
- ✅ server.js
- ⚠️ services/blog.service.js
- ✅ services/user.service.js
- ✅ utils/generateToken.js
- ✅ utils/sendOTP.js

### Frontend (19 files):
- ✅ App.jsx
- ✅ ProtectedRoute.jsx
- ✅ components/Editor.jsx
- ✅ components/LoginPromptModal.jsx
- ✅ components/Navbar.jsx
- ✅ components/ProfileSettings.jsx
- ✅ components/ProtectedRoute.jsx
- ✅ config/firebase.js
- ✅ context/AuthContext.jsx
- ✅ context/ThemeContext.jsx
- ⚠️ main.jsx
- ✅ pages/About.jsx
- ✅ pages/Contact.jsx
- ✅ pages/Dashboard.jsx
- ✅ pages/ForgotPassword.jsx
- ✅ pages/Landing.jsx
- ✅ pages/Login.jsx
- ✅ servicies/api.js
- ⚠️ servicies/firestore.js

### Configuration (4 files):
- ⚠️ backend/package.json
- ⚠️ frontend/package.json
- ⚠️ backend/.env
- ✅ frontend/.env

**Legend:**
- ✅ No issues found
- ⚠️ Minor issues or improvements needed
- ❌ Critical issues found
