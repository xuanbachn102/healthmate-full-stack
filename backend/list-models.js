import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    const models = await genAI.listModels();
    console.log('Available models:');
    for await (const model of models) {
      console.log(`- ${model.name}`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listModels();
