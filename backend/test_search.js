
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

async function testSearch() {
    console.log('--- Listing All Users ---');
    // We don't have a list users endpoint readily available without auth usually, 
    // but let's try suggested users or just skip to what we can access.
    // Actually, let's just use MongoDB directly if we can, but via API is safer.
    // Let's try to search for "a" which should match most things if regex works

    const query = 'Ashniya ';
    console.log(`Testing search with query: "${query}"`);

    try {
        // Test User Search
        console.log('\n--- User Search (q="a") ---');
        const userRes = await fetch(`${BASE_URL}/users/search?q=${query}`);
        const userData = await userRes.json();
        console.log('Status:', userRes.status);
        console.log('Result Count:', userData.users ? userData.users.length : 0);
        if (userData.users && userData.users.length > 0) {
            console.log('Sample User:', userData.users[0].username);
        } else {
            console.log('No users found with "a"');
        }

        // Test Blog Search
        console.log('\n--- Blog Search (q="a") ---');
        const blogRes = await fetch(`${BASE_URL}/blogs?q=${query}`);
        const blogData = await blogRes.json();
        console.log('Status:', blogRes.status);
        console.log('Result Count:', blogData.data ? blogData.data.length : 0);
        if (blogData.data && blogData.data.length > 0) {
            console.log('Sample Blog:', blogData.data[0].title);
        } else {
            console.log('No blogs found with "a"');
        }

    } catch (error) {
        console.error('Test failed:', error);
    }
}

testSearch();
