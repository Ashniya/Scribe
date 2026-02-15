import { db } from '../config/firebase.js';
import bcrypt from 'bcryptjs';

const usersCollection = db.collection('users');

export const createUser = async (userData) => {
    const { email, password, displayName, photoURL, provider, providerId } = userData;

    // Hash password if provided
    let hashedPassword = null;
    if (password) {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(password, salt);
    }

    const userDoc = {
        email,
        password: hashedPassword,
        displayName: displayName || email.split('@')[0],
        photoURL: photoURL || null,
        provider: provider || 'email',
        providerId: providerId || null,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const docRef = await usersCollection.add(userDoc);
    return {
        _id: docRef.id,
        ...userDoc,
        password: undefined // Don't return password
    };
};

export const findUserByEmail = async (email) => {
    const snapshot = await usersCollection.where('email', '==', email).limit(1).get();

    if (snapshot.empty) {
        return null;
    }

    const doc = snapshot.docs[0];
    return {
        _id: doc.id,
        ...doc.data()
    };
};

export const findUserById = async (userId) => {
    const doc = await usersCollection.doc(userId).get();

    if (!doc.exists) {
        return null;
    }

    const data = doc.data();
    return {
        _id: doc.id,
        ...data,
        password: undefined // Don't return password
    };
};

export const updateUser = async (userId, updateData) => {
    await usersCollection.doc(userId).update({
        ...updateData,
        updatedAt: new Date()
    });

    return findUserById(userId);
};

export const comparePassword = async (enteredPassword, hashedPassword) => {
    return await bcrypt.compare(enteredPassword, hashedPassword);
};
