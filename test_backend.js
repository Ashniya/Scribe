async function testEndpoints() {
    const endpoints = [
        'http://localhost:5000/',
        'http://localhost:5000/api/health',
        'http://localhost:5000/api/blogs'
    ];

    for (const url of endpoints) {
        console.log(`Testing ${url}...`);
        const start = Date.now();
        try {
            const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
            const data = await res.json();
            console.log(`✅ ${url} responded in ${Date.now() - start}ms:`, JSON.stringify(data).substring(0, 100));
        } catch (err) {
            console.log(`❌ ${url} failed in ${Date.now() - start}ms: ${err.message}`);
        }
    }
}

testEndpoints();
