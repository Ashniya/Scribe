import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';
import floralImage from '../assets/hand_painted_floral_watercolour_design_2801.jpg';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await sendPasswordResetEmail(auth, email);
            setSuccess(true);
        } catch (error) {
            console.error('Password reset error:', error);

            switch (error.code) {
                case 'auth/invalid-email':
                    setError('Please enter a valid email address.');
                    break;
                case 'auth/user-not-found':
                    setError('No account found with this email address.');
                    break;
                case 'auth/too-many-requests':
                    setError('Too many requests. Please try again later.');
                    break;
                default:
                    setError('Failed to send reset email. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Image */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${floralImage})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-scribe-sage/90 via-scribe-mint/80 to-scribe-green/90 backdrop-blur-sm" />
                </div>
                <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 w-full">
                    <h1 className="text-5xl font-bold mb-6 font-serif">Scribe</h1>
                    <p className="text-2xl text-center max-w-md leading-relaxed">
                        Reset your password and get back to writing
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/login')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to login
                    </button>

                    {!success ? (
                        <>
                            {/* Header */}
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
                                <p className="text-gray-600">
                                    Enter your email address and we'll send you a link to reset your password.
                                </p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-600 text-sm">{error}</p>
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                setError('');
                                            }}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-scribe-green focus:border-transparent outline-none transition"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-scribe-green to-scribe-sage text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {loading ? 'Sending...' : 'Send Reset Link'}
                                </button>
                            </form>
                        </>
                    ) : (
                        /* Success Message */
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
                            <p className="text-gray-600 mb-6">
                                We've sent a password reset link to<br />
                                <span className="font-semibold text-gray-900">{email}</span>
                            </p>
                            <p className="text-sm text-gray-500 mb-8">
                                Didn't receive the email? Check your spam folder or try again.
                            </p>
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full bg-gradient-to-r from-scribe-green to-scribe-sage text-white py-3 rounded-lg font-semibold hover:shadow-lg transition"
                            >
                                Back to Login
                            </button>
                        </div>
                    )}

                    {/* Footer */}
                    {!success && (
                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                Remember your password?{' '}
                                <Link to="/login" className="text-scribe-green font-semibold hover:underline">
                                    Log in
                                </Link>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
