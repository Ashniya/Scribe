import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    displayName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        select: false
    },
    photoURL: {
        type: String
    },
    provider: {
        type: String,
        enum: ['email', 'google', 'github'],
        default: 'email'
    },
    providerId: {
        type: String
    }
}, {
    timestamps: true
});

export default mongoose.model('User', userSchema);
