// Test script to verify API connection
import { authAPI } from './services/api.js';

async function testLogin() {
  try {
    console.log('Testing employee login...');
    const response = await authAPI.login('employee@test.com', 'password123');
    console.log('✅ Login successful:', response);
  } catch (error) {
    console.error('❌ Login failed:', error.message);
  }
}

testLogin();