const fetch = require('node-fetch');

async function testAuth() {
    console.log('Testing TradePilot Authentication...');
    console.log('=====================================');
    
    // Test registration
    console.log('\n1. Testing Registration:');
    try {
        const regResponse = await fetch('http://localhost:3001/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'testuser@example.com',
                password: 'password123'
            })
        });
        
        const regData = await regResponse.text();
        console.log(`Status: ${regResponse.status}`);
        console.log(`Response: ${regData}`);
        
        if (regResponse.status === 200 || regResponse.status === 201 || regResponse.status === 409) {
            console.log('✅ Registration endpoint working');
        } else {
            console.log('❌ Registration failed');
        }
    } catch (error) {
        console.log(`❌ Registration error: ${error.message}`);
    }
    
    // Test login
    console.log('\n2. Testing Login:');
    try {
        const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'testuser@example.com',
                password: 'password123'
            })
        });
        
        const loginData = await loginResponse.text();
        console.log(`Status: ${loginResponse.status}`);
        
        if (loginResponse.status === 200) {
            const parsed = JSON.parse(loginData);
            if (parsed.token) {
                console.log(`✅ Login successful! Token: ${parsed.token.substring(0, 50)}...`);
                
                // Test broker endpoints
                await testBrokerEndpoints(parsed.token);
            } else {
                console.log('❌ No token in response');
            }
        } else {
            console.log(`❌ Login failed: ${loginData}`);
        }
    } catch (error) {
        console.log(`❌ Login error: ${error.message}`);
    }
}

async function testBrokerEndpoints(token) {
    console.log('\n3. Testing NEW Broker Endpoints:');
    
    // Test get accounts
    try {
        const accountsResponse = await fetch('http://localhost:3001/api/broker/accounts', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const accountsData = await accountsResponse.text();
        console.log(`Get Accounts Status: ${accountsResponse.status}`);
        
        if (accountsResponse.status === 200) {
            console.log('✅ Broker accounts endpoint working');
            console.log(`Response: ${accountsData}`);
        } else {
            console.log(`❌ Broker accounts failed: ${accountsData}`);
        }
    } catch (error) {
        console.log(`❌ Broker accounts error: ${error.message}`);
    }
    
    // Test OANDA setup
    try {
        const oandaResponse = await fetch('http://localhost:3001/api/broker/oanda/setup', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({
                accountId: '101-004-37953533-001',
                apiToken: 'test-token-123',
                environment: 'practice'
            })
        });
        
        const oandaData = await oandaResponse.text();
        console.log(`OANDA Setup Status: ${oandaResponse.status}`);
        console.log(`OANDA Response: ${oandaData}`);
        
        if (oandaResponse.status === 200 || oandaResponse.status === 201) {
            console.log('✅ OANDA broker setup working');
        } else {
            console.log('⚠️  OANDA setup endpoint exists but validation failed (expected)');
        }
    } catch (error) {
        console.log(`❌ OANDA setup error: ${error.message}`);
    }
}

testAuth().catch(console.error);