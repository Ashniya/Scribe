// Quick Diagnostic Script for Scribe Authentication
// Run this in the browser console on http://localhost:5174

console.log('🔍 Starting Authentication Diagnostic...\n');

// Check 1: Firebase Auth Status
import { auth } from './src/config/firebase.js';

auth.onAuthStateChanged(async (user) => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1️⃣ FIREBASE AUTH STATUS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    if (user) {
        console.log('✅ User is authenticated');
        console.log('   Email:', user.email);
        console.log('   UID:', user.uid);
        console.log('   Display Name:', user.displayName);
        console.log('   Photo URL:', user.photoURL);

        // Check 2: Get ID Token
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('2️⃣ FIREBASE ID TOKEN');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        try {
            const token = await user.getIdToken();
            console.log('✅ Token generated successfully');
            console.log('   Token length:', token.length);
            console.log('   Token preview:', token.substring(0, 50) + '...');

            // Check 3: Test Backend API
            console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('3️⃣ BACKEND API TEST');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

            const response = await fetch('http://localhost:5000/api/blogs', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: 'Diagnostic Test Article',
                    content: 'This is a test to verify authentication',
                    category: 'General',
                    tags: [],
                    published: false
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log('✅ API call successful!');
                console.log('   Status:', response.status);
                console.log('   Response:', data);
            } else {
                console.log('❌ API call failed');
                console.log('   Status:', response.status);
                console.log('   Error:', data);
                console.log('\n💡 NEXT STEPS:');
                console.log('   1. Check the backend terminal for detailed error logs');
                console.log('   2. Verify firebase-key.json exists in backend folder');
                console.log('   3. Ensure Firebase project IDs match in frontend and backend');
            }

        } catch (tokenError) {
            console.log('❌ Error getting token:', tokenError.message);
        }

    } else {
        console.log('❌ No user is authenticated');
        console.log('\n💡 SOLUTION:');
        console.log('   Please log in to the application first');
        console.log('   Navigate to the login page and authenticate with Google');
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🏁 Diagnostic Complete');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
});
