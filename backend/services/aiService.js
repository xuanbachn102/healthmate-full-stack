// MOCK MODE - For testing UI without API calls
const USE_MOCK = true; // Set to false when API is working

/**
 * Mock chatbot responses for testing
 */
function getMockChatResponse(message) {
  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
    return "Hello! I'm HealthMate Assistant. I'm here to help answer your health questions, provide medication information, and guide you to the right medical specialty. How can I assist you today?";
  }

  if (lowerMsg.includes('headache') || lowerMsg.includes('pain')) {
    return "I understand you're experiencing pain. For persistent headaches, I'd recommend consulting with a Neurology specialist. In the meantime, ensure you're staying hydrated and getting adequate rest. If the pain is severe or accompanied by vision changes, please seek immediate medical attention.";
  }

  if (lowerMsg.includes('appointment') || lowerMsg.includes('book')) {
    return "I can help you find the right specialist! Based on your symptoms, I can recommend a medical specialty. Would you like to use our Symptom Checker for a detailed analysis, or tell me about your specific health concern?";
  }

  if (lowerMsg.includes('allergy') || lowerMsg.includes('allergies')) {
    return "Allergies should be taken seriously. An Allergist or Immunologist can help diagnose and manage your allergies. Common treatments include antihistamines, but it's important to get a proper diagnosis. Would you like help booking an appointment?";
  }

  // Default response
  return "I'm here to help with your health questions! I can provide general health information, recommend medical specialties, and guide you through booking appointments. Please remember that I'm not a substitute for professional medical advice. What would you like to know?";
}

/**
 * Mock symptom analysis for testing
 */
function getMockSymptomAnalysis(symptoms) {
  const lowerSymptoms = symptoms.toLowerCase();

  // Emergency detection
  if (lowerSymptoms.includes('chest pain') || lowerSymptoms.includes('can\'t breathe') || lowerSymptoms.includes('difficulty breathing')) {
    return {
      specialty: "Emergency Medicine",
      urgency: "emergency",
      reasoning: "Your symptoms suggest a potentially serious condition that requires immediate medical attention. Chest pain and breathing difficulties can indicate cardiac or respiratory emergencies.",
      emergencyWarning: "CALL 911 IMMEDIATELY. Do not wait. These symptoms require emergency medical care.",
      additionalAdvice: "While waiting for emergency services, sit in a comfortable position and try to stay calm. Do not drive yourself to the hospital.",
      disclaimer: "This is NOT a medical diagnosis. Always consult with qualified healthcare professionals for medical advice."
    };
  }

  // Headache/Neurological
  if (lowerSymptoms.includes('headache') || lowerSymptoms.includes('dizzy') || lowerSymptoms.includes('nausea')) {
    return {
      specialty: "Neurology",
      urgency: "routine",
      reasoning: "Your symptoms of headache and dizziness suggest a neurological consultation would be beneficial. These symptoms could have various causes, from tension headaches to more complex issues.",
      emergencyWarning: null,
      additionalAdvice: "Keep a symptom diary noting when headaches occur, their intensity, and any triggers. Stay hydrated and maintain regular sleep patterns.",
      disclaimer: "This is NOT a medical diagnosis. Always consult with qualified healthcare professionals for medical advice."
    };
  }

  // Skin issues
  if (lowerSymptoms.includes('rash') || lowerSymptoms.includes('skin') || lowerSymptoms.includes('itch')) {
    return {
      specialty: "Dermatology",
      urgency: "routine",
      reasoning: "Skin-related symptoms are best evaluated by a Dermatologist who can examine the affected area and provide appropriate treatment.",
      emergencyWarning: null,
      additionalAdvice: "Avoid scratching the affected area and keep it clean. Take photos to track any changes.",
      disclaimer: "This is NOT a medical diagnosis. Always consult with qualified healthcare professionals for medical advice."
    };
  }

  // Default - General Medicine
  return {
    specialty: "General Medicine",
    urgency: "routine",
    reasoning: "Based on your symptoms, starting with a General Practitioner would be appropriate. They can provide an initial assessment and refer you to a specialist if needed.",
    emergencyWarning: null,
    additionalAdvice: "Keep track of your symptoms, including when they started and any factors that make them better or worse.",
    disclaimer: "This is NOT a medical diagnosis. Always consult with qualified healthcare professionals for medical advice."
  };
}

/**
 * Call Gemini API directly using v1 endpoint
 */
async function callGeminiAPI(prompt) {
  // MOCK MODE - Return mock data
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    return "Mock response: This is a simulated AI response for testing purposes.";
  }

  // Real API call (when USE_MOCK = false)
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

/**
 * Analyze symptoms and recommend medical specialty
 * @param {Object} symptomData - User's symptom information
 * @returns {Object} Analysis result with specialty recommendation
 */
export const analyzeSymptoms = async (symptomData) => {
  try {
    const { symptoms, duration, severity, age, gender } = symptomData;

    // MOCK MODE - Return mock analysis
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      const mockAnalysis = getMockSymptomAnalysis(symptoms);
      return {
        success: true,
        data: mockAnalysis
      };
    }

    // Real API call (when USE_MOCK = false)

    const prompt = `You are a medical symptom analyzer assistant. Analyze the following symptoms and provide a specialty recommendation.

IMPORTANT INSTRUCTIONS:
- Recommend SPECIALTY ONLY (e.g., "Cardiology", "Dermatology", "General Medicine", "Neurology", etc.)
- NEVER recommend specific doctors or medical professionals
- Consider symptom severity and duration when determining urgency
- Detect emergency situations and flag them clearly
- Always include a medical disclaimer

USER INFORMATION:
- Age: ${age || 'Not specified'}
- Gender: ${gender || 'Not specified'}
- Symptoms: ${symptoms}
- Duration: ${duration || 'Not specified'}
- Severity: ${severity || 'Moderate'}

Please respond in the following JSON format:
{
  "specialty": "Name of recommended medical specialty",
  "urgency": "emergency" | "urgent" | "routine",
  "reasoning": "Brief explanation of why this specialty is recommended (2-3 sentences)",
  "emergencyWarning": "Warning message if emergency (or null if not emergency)",
  "additionalAdvice": "Any additional health advice or precautions",
  "disclaimer": "Medical disclaimer message"
}

EMERGENCY KEYWORDS TO WATCH FOR:
- Chest pain, difficulty breathing, severe bleeding, loss of consciousness
- Severe head injury, stroke symptoms, heart attack symptoms
- Severe allergic reaction, poisoning, severe burns

If any emergency keywords are detected, set urgency to "emergency" and provide clear warning.`;

    const text = await callGeminiAPI(prompt);

    // Parse JSON response
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const analysis = JSON.parse(jsonText);

    return {
      success: true,
      data: analysis
    };

  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    return {
      success: false,
      message: 'Failed to analyze symptoms. Please try again.',
      error: error.message
    };
  }
};

/**
 * Chat with health assistant bot
 * @param {Object} chatData - Chat context and message
 * @returns {Object} Bot response
 */
export const chatWithBot = async (chatData) => {
  try {
    const { message, chatHistory, userProfile } = chatData;

    // MOCK MODE - Return mock response
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      const mockResponse = getMockChatResponse(message);
      return {
        success: true,
        data: {
          message: mockResponse,
          timestamp: new Date()
        }
      };
    }

    // Real API call (when USE_MOCK = false)
    const contextInfo = userProfile ? `
USER HEALTH PROFILE:
- Allergies: ${userProfile.allergies?.join(', ') || 'None specified'}
- Current Medications: ${userProfile.medications?.join(', ') || 'None specified'}
- Known Conditions: ${userProfile.diseases?.join(', ') || 'None specified'}
- Blood Type: ${userProfile.bloodType || 'Not specified'}
` : '';

    const historyText = chatHistory && chatHistory.length > 0
      ? chatHistory.slice(-10).map(msg => `${msg.role}: ${msg.content}`).join('\n')
      : 'No previous conversation';

    const prompt = `You are HealthMate Assistant, a helpful and empathetic health chatbot.

YOUR CAPABILITIES:
- Answer general health questions clearly and concisely
- Provide medication information and explain interactions
- Recommend MEDICAL SPECIALTIES when appropriate (NEVER specific doctors)
- Suggest using the symptom checker for complex symptom analysis
- Remind users to book appointments for serious health concerns
- Provide lifestyle and wellness tips
- Be supportive and understanding

YOUR LIMITATIONS:
- You are NOT a replacement for professional medical advice
- Always include appropriate medical disclaimers
- Direct users to emergency services for urgent situations
- Don't diagnose specific conditions

${contextInfo}

CHAT HISTORY:
${historyText}

USER MESSAGE: ${message}

Please respond in a helpful, empathetic manner. Keep responses concise (2-4 sentences unless more detail is specifically requested). If the user's question relates to their health profile, reference it naturally.

IMPORTANT: If you detect emergency symptoms or urgent situations, immediately advise the user to seek emergency medical care.`;

    const botReply = await callGeminiAPI(prompt);

    return {
      success: true,
      data: {
        message: botReply,
        timestamp: new Date()
      }
    };

  } catch (error) {
    console.error('Error in chatbot:', error);
    return {
      success: false,
      message: 'Failed to get response from chatbot. Please try again.',
      error: error.message
    };
  }
};
