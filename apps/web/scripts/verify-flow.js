const API_URL = 'http://localhost:3004/api';

async function run() {
    console.log('🚀 Starting Frontend-Backend Verification Flow...');

    // 1. Register Creator
    const username = `user_${Date.now().toString().slice(-6)}`;
    const email = `${username}@example.com`;
    const password = 'password123';

    console.log(`\n1. Registering creator: ${username}...`);
    const registerRes = await fetch(`${API_URL}/creators/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username,
            email,
            password,
            displayName: 'Test Creator',
            bio: 'I am a test creator',
        }),
    });
    const registerData = await registerRes.json();
    if (!registerData.success) throw new Error(`Registration failed: ${JSON.stringify(registerData)}`);
    console.log('✅ Registration successful');
    const token = registerData.data.token;

    // 2. Create Tier
    console.log('\n2. Creating Tier...');
    const tierRes = await fetch(`${API_URL}/creators/tiers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name: 'Supporter',
            description: 'Basic support tier',
            amountZEC: 0.1,
            benefits: ['Access to content'],
        }),
    });
    const tierData = await tierRes.json();
    if (!tierData.success) throw new Error(`Tier creation failed: ${JSON.stringify(tierData)}`);
    console.log('✅ Tier created');
    const tierId = tierData.data.id;
    const creatorId = tierData.data.creatorId;

    // 2.5 Create Content (Locked)
    console.log('\n2.5 Creating Locked Content...');
    const contentRes = await fetch(`${API_URL}/creators/content`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            title: 'Exclusive Update',
            description: 'This is for supporters only.',
            tierId: tierId,
            contentType: 'ARTICLE',
            storageProvider: 'IPFS',
            storageHash: 'QmHash123',
            isPublic: false
        }),
    });
    const contentDataRes = await contentRes.json();
    if (!contentDataRes.success) throw new Error(`Content creation failed: ${JSON.stringify(contentDataRes)}`);
    console.log('✅ Locked Content created');

    // 3. Discover Creators (Public)
    console.log('\n3. Fetching All Creators (Discover)...');
    const discoverRes = await fetch(`${API_URL}/creators`);
    const discoverData = await discoverRes.json();
    if (!discoverData.success) throw new Error(`Discover failed: ${JSON.stringify(discoverData)}`);
    const found = discoverData.data.find(c => c.username === username);
    if (!found) throw new Error('Newly registered creator not found in discover list');
    console.log('✅ Creator found in Discover list');

    // 4. Get Profile (Public)
    console.log(`\n4. Fetching Profile for ${username}...`);
    const profileRes = await fetch(`${API_URL}/creators/${username}`);
    const profileData = await profileRes.json();
    if (!profileData.success) throw new Error(`Profile fetch failed: ${JSON.stringify(profileData)}`);
    console.log('✅ Profile fetched');

    // 5. Initiate Payment
    console.log('\n5. Initiating Payment...');
    const paymentRes = await fetch(`${API_URL}/payments/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            creatorId,
            tierId,
        }),
    });
    const paymentData = await paymentRes.json();
    if (!paymentData.success) throw new Error(`Payment initiation failed: ${JSON.stringify(paymentData)}`);
    console.log('✅ Payment initiated');
    const { memoTemplate } = paymentData.data;

    // 6. Simulate Payment Webhook (Zcash Monitor)
    console.log('\n6. Simulating Payment Webhook...');
    const crypto = require('crypto');
    const secret = crypto.randomBytes(32).toString('hex');
    const commitment = crypto.createHash('sha256').update(secret).digest('hex');

    const memoData = {
        version: 1,
        tierId: tierId,
        timestamp: new Date().toISOString(),
        commitment: commitment
    };
    const memoHex = Buffer.from(JSON.stringify(memoData)).toString('hex');
    const txHash = `tx_${Date.now()}`;

    const webhookRes = await fetch(`${API_URL}/payments/webhook/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            txHash,
            creatorId,
            encryptedMemo: memoHex,
            amountZEC: 0.1
        }),
    });
    const webhookData = await webhookRes.json();
    if (!webhookData.success) throw new Error(`Webhook failed: ${JSON.stringify(webhookData)}`);
    console.log('✅ Payment processed via webhook');

    // 7. Verify Access
    console.log('\n7. Verifying Access...');
    const verifyRes = await fetch(`${API_URL}/payments/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            commitment,
            creatorId
        }),
    });
    const verifyData = await verifyRes.json();
    if (!verifyData.success || !verifyData.data.valid) throw new Error(`Access verification failed: ${JSON.stringify(verifyData)}`);
    console.log('✅ Access verified');

    // 8. List Content (with Access)
    console.log('\n8. Listing Content (with Access)...');
    const listContentRes = await fetch(`${API_URL}/content?creatorId=${creatorId}`);
    const listContentData = await listContentRes.json();
    if (!listContentData.success) throw new Error(`Content list failed: ${JSON.stringify(listContentData)}`);
    console.log('✅ Content listed');

    if (listContentData.data.length > 0) {
        const contentId = listContentData.data[0].id;
        console.log(`\n9. Proving Access for Content ${contentId}...`);

        const accessRes = await fetch(`${API_URL}/payments/access/${commitment}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contentId,
                creatorId
            }),
        });
        const accessData = await accessRes.json();
        if (!accessData.success) throw new Error(`Prove access failed: ${JSON.stringify(accessData)}`);

        if (!accessData.data.decryptionKey) throw new Error('Decryption key missing in response');
        console.log('✅ Access proved, decryption key received');
    } else {
        throw new Error('No content found to prove access against');
    }

    console.log('\n🎉 Verification Flow Complete!');
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
