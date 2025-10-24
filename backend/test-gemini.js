import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

console.log('Testing Gemini API...');
console.log('API Key:', process.env.GEMINI_API_KEY ? 'Set ✓' : 'Missing ✗');

// Try different model names
const modelsToTry = [
  'gemini-pro',
  'gemini-1.5-pro',
  'gemini-1.5-pro-latest',
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
  'models/gemini-pro',
  'models/gemini-1.5-pro'
];

async function testModel(modelName) {
  try {
    console.log(`\nTrying model: ${modelName}...`);
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent('Say hello');
    const response = await result.response;
    const text = response.text();
    console.log(`✓ SUCCESS with ${modelName}`);
    console.log(`Response: ${text.substring(0, 50)}...`);
    return modelName;
  } catch (error) {
    console.log(`✗ FAILED with ${modelName}: ${error.message}`);
    return null;
  }
}

async function runTests() {
  console.log('\n=== Testing Available Models ===\n');

  for (const modelName of modelsToTry) {
    const success = await testModel(modelName);
    if (success) {
      console.log(`\n🎉 WORKING MODEL FOUND: ${success}`);
      process.exit(0);
    }
  }

  console.log('\n❌ No working models found. Please check:');
  console.log('1. API key is valid');
  console.log('2. Gemini API is enabled in Google Cloud Console');
  console.log('3. Visit: https://ai.google.dev/gemini-api/docs/api-key');
  process.exit(1);
}

runTests();
