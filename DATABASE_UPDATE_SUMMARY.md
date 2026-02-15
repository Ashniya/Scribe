# Database Collection Name Updates

## Date: February 11, 2026

## Summary
Updated backend service files to use the correct Firestore collection names that match the actual Firebase database structure.

## Changes Made

### 1. Blog Service (`backend/src/services/blog.service.js`)
- **Line 3**: Changed collection name from `'usersscribe'` to `'blogs'`
- **Reason**: The collection was incorrectly named. Based on Firebase console, blogs should be stored in the `blogs` collection.

```javascript
// Before
const blogsCollection = db.collection('usersscribe');

// After
const blogsCollection = db.collection('blogs');
```

### 2. User Service (`backend/src/services/user.service.js`)
- **Line 4**: Changed collection name from `'usersscribe'` to `'users'`
- **Reason**: The collection was incorrectly named. Based on Firebase console, users should be stored in the `users` collection.

```javascript
// Before
const usersCollection = db.collection('usersscribe');

// After
const usersCollection = db.collection('users');
```

## Firebase Database Structure

Based on the Firebase console screenshots, the correct structure is:

### Collections:
1. **`blogs`** - Stores blog posts with fields:
   - `authorId` (string)
   - `commentscount` (number)
   - `content` (string)
   - `createdAt` (timestamp)
   - `likescount` (number)
   - `published` (boolean)
   - `title` (string)
   - `updatedAt` (timestamp)

2. **`users`** - Stores user information with fields:
   - `createdAt` (timestamp)
   - `email` (string)
   - `name` (string)
   - `uid` (string)

## Files Verified (No Changes Needed)

### Frontend:
- ✅ `frontend/src/servicies/firestore.js` - Already using `'blogs'` collection correctly
- ✅ `frontend/src/config/firebase.js` - Configuration is correct

### Backend:
- ✅ `backend/src/routes/test.routes.js` - Already using `'users'` collection correctly
- ✅ `backend/src/config/firebase.js` - Configuration is correct

## Impact

These changes ensure that:
1. Blog operations (create, read, update, delete) interact with the correct `blogs` collection
2. User operations (create, find, update) interact with the correct `users` collection
3. The backend code aligns with the actual Firebase database structure
4. No data loss or migration is needed as the collections were empty or the correct data is already in the right collections

## Next Steps

1. **Restart the backend server** to apply these changes
2. **Test blog creation** to ensure blogs are saved to the `blogs` collection
3. **Test user authentication** to ensure users are saved to the `users` collection
4. **Verify in Firebase Console** that new documents appear in the correct collections

## Notes

- The frontend was already using the correct collection names
- No database migration is required
- These were configuration-level changes only
