import { db, auth } from '../config/firebase.js';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';

// Create a new blog post
export const createBlog = async (blogData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const docRef = await addDoc(collection(db, 'blogs'), {
      ...blogData,
      authorId: user.uid,
      authorEmail: user.email,
      authorName: user.displayName || user.email.split('@')[0],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      views: 0,
      likes: [],
      likescount: 0,
      commentscount: 0
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
};

// Get all published blogs
export const getAllBlogs = async () => {
  try {
    const q = query(
      collection(db, 'blogs'),
      where('published', '==', true),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};

// Get user's blogs
export const getUserBlogs = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const q = query(
      collection(db, 'blogs'),
      where('authorId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching user blogs:', error);
    throw error;
  }
};

// Get single blog
export const getBlog = async (id) => {
  try {
    const docRef = doc(db, 'blogs', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Blog not found');
    }
  } catch (error) {
    console.error('Error fetching blog:', error);
    throw error;
  }
};

// Update blog
export const updateBlog = async (id, updates) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const blogRef = doc(db, 'blogs', id);
    const blogSnap = await getDoc(blogRef);

    if (blogSnap.data().authorId !== user.uid) {
      throw new Error('Not authorized to update this blog');
    }

    await updateDoc(blogRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
};

// Delete blog
export const deleteBlog = async (id) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const blogRef = doc(db, 'blogs', id);
    const blogSnap = await getDoc(blogRef);

    if (blogSnap.data().authorId !== user.uid) {
      throw new Error('Not authorized to delete this blog');
    }

    await deleteDoc(blogRef);
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
};

// Like/Unlike blog
export const likeBlog = async (id) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const blogRef = doc(db, 'blogs', id);
    const blogSnap = await getDoc(blogRef);
    const likes = blogSnap.data().likes || [];

    const likeIndex = likes.indexOf(user.uid);
    if (likeIndex > -1) {
      likes.splice(likeIndex, 1);
    } else {
      likes.push(user.uid);
    }

    await updateDoc(blogRef, { likes });
  } catch (error) {
    console.error('Error liking blog:', error);
    throw error;
  }
};