// MOCK MODE - For testing UI without API calls
const USE_MOCK = false; // Set to false when API is working

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
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

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

    const prompt = `You are an advanced medical symptom analyzer assistant for HealthMate application. Provide comprehensive, structured analysis.

IMPORTANT INSTRUCTIONS:
- Recommend SPECIALTY ONLY (e.g., "Cardiology", "Dermatology", "General Medicine", "Neurology", etc.)
- NEVER recommend specific doctors or medical professionals
- Consider symptom severity and duration when determining urgency
- Detect emergency situations and flag them clearly
- Provide detailed, educational information
- Always include a medical disclaimer
- Be empathetic and supportive in tone

USER INFORMATION:
- Age: ${age || 'Not specified'}
- Gender: ${gender || 'Not specified'}
- Symptoms: ${symptoms}
- Duration: ${duration || 'Not specified'}
- Severity: ${severity || 'Moderate'}

Please respond in the following JSON format:
{
  "specialty": "Name of recommended medical specialty (in English)",
  "urgency": "emergency" | "urgent" | "routine",
  "symptomSummary": "Clear summary of the reported symptoms (1-2 sentences)",
  "possibleCauses": [
    "Cause 1: Brief explanation",
    "Cause 2: Brief explanation",
    "Cause 3: Brief explanation"
  ],
  "relatedConditions": [
    "Related condition or complication 1",
    "Related condition or complication 2"
  ],
  "reasoning": "Detailed explanation of why this specialty is recommended, considering age, gender, duration, and severity (3-4 sentences)",
  "medicalInfo": "Relevant medical fact, statistic, or research finding related to these symptoms (e.g., 'According to medical research, approximately X% of people with these symptoms...')",
  "emergencyWarning": "Warning message if emergency - use Vietnamese: 'Vui lòng gọi 115 (cấp cứu Việt Nam) ngay lập tức.' (or null if not emergency)",
  "immediateActions": [
    "Immediate self-care step 1",
    "Immediate self-care step 2",
    "When to seek medical attention"
  ],
  "additionalAdvice": "Preventive measures and lifestyle recommendations (2-3 sentences)",
  "disclaimer": "Standard medical disclaimer in Vietnamese"
}

SEVERITY ASSESSMENT GUIDELINES:
- Mild symptoms: Suggest routine consultation
- Moderate symptoms lasting >1 week: Suggest urgent consultation
- Severe symptoms or rapid onset: May indicate emergency
- Consider age and duration in urgency assessment

EMERGENCY KEYWORDS TO WATCH FOR:
HIGH PRIORITY (set urgency to "emergency"):
- Chest pain (đau ngực), difficulty breathing (khó thở), can't breathe
- Severe bleeding (chảy máu nghiêm trọng), hemorrhage
- Loss of consciousness (bất tỉnh), fainting, passed out
- Stroke symptoms: facial drooping, arm weakness, slurred speech, sudden confusion
- Heart attack symptoms: chest pressure, pain radiating to arm/jaw, cold sweats
- Severe allergic reaction: swelling of face/throat, difficulty swallowing
- Severe head injury, skull fracture, brain trauma
- Poisoning, overdose
- Severe burns covering large area
- Seizures, convulsions
- Sudden severe abdominal pain
- Coughing up blood, vomiting blood

MEDIUM PRIORITY (set urgency to "urgent"):
- High fever (>39°C) lasting >3 days
- Persistent vomiting/diarrhea causing dehydration
- Severe pain (8-10/10) lasting >24 hours
- Sudden vision loss or double vision
- Signs of infection with fever
- Unexplained weight loss
- Persistent cough with blood traces

If emergency keywords detected:
- Set urgency to "emergency"
- emergencyWarning must include: "🚨 CẢNH BÁO KHẨN CẤP: Đây là tình huống nguy hiểm đến tính mạng. Vui lòng gọi 115 (cấp cứu Việt Nam) ngay lập tức. Không tự lái xe đến bệnh viện."
- Explain why this is life-threatening

RESPONSE QUALITY REQUIREMENTS:
- possibleCauses: List 3-5 potential causes from most to least likely
- medicalInfo: Include specific percentages or research findings when possible
- Be specific and educational, not vague
- Use professional medical terminology but explain in layman's terms
- Be culturally appropriate for Vietnamese healthcare context`;

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

    const userName = userProfile?.name || 'bạn';

    const prompt = `You are HealthMate Assistant (Trợ lý y tế ảo của HealthMate), a helpful and empathetic health chatbot for Vietnamese users.

YOUR IDENTITY:
- Greet user warmly: "Chào anh/chị ${userName}, tôi là trợ lý y tế ảo của HealthMate."
- Be professional yet friendly and approachable
- Show empathy and understanding

YOUR CAPABILITIES:
- Answer general health questions with detailed, structured information
- Provide medication information and explain interactions
- Recommend MEDICAL SPECIALTIES when appropriate (NEVER specific doctors)
- Suggest using the symptom checker for complex symptom analysis
- Remind users to book appointments for serious health concerns
- Provide lifestyle and wellness tips
- Cite medical facts and statistics when relevant

RESPONSE STRUCTURE (when discussing health issues):
Use this format for comprehensive responses:

**Mô tả triệu chứng:**
- Summarize user's symptoms clearly

**Nguyên nhân có thể:**
1. [Cause 1] - Brief explanation
2. [Cause 2] - Brief explanation
3. [Cause 3] - Brief explanation
(List 3-5 possible causes)

**Các bệnh liên quan:**
- [Related condition 1]
- [Related condition 2]

**Thông tin y tế:**
Include relevant medical statistics or research findings when possible (e.g., "Theo nghiên cứu của [source], khoảng X% người...")

**Điều trị/Quản lý:**
- Immediate self-care steps
- When to see a doctor
- Preventive measures
- **Quan trọng nhất: [Most important action]**

**Call-to-action:**
End with: "Tôi sẽ tìm kiếm các bác sĩ chuyên khoa phù hợp để anh/chị có thể tham khảo và đặt lịch hẹn. Anh/chị có muốn tôi tìm kiếm bác sĩ ngay bây giờ không?"

YOUR LIMITATIONS:
- You are NOT a replacement for professional medical advice
- Always include appropriate medical disclaimers
- Direct users to emergency services for urgent situations (115 in Vietnam)
- Don't diagnose specific conditions - only suggest possibilities

${contextInfo}

CHAT HISTORY:
${historyText}

USER MESSAGE: ${message}

IMPORTANT GUIDELINES:
1. If first message or greeting: Use warm introduction with user's name
2. For simple questions: Keep concise (2-4 sentences)
3. For health concerns/symptoms: Use the structured format above
4. For emergency symptoms (chest pain, severe bleeding, difficulty breathing, stroke signs):
   - Immediately state "🚨 CẢNH BÁO KHẨN CẤP"
   - Advise to call 115 (Vietnam emergency) immediately
   - Explain this is potentially life-threatening
5. Always be respectful and use "anh/chị" when addressing user
6. Mix Vietnamese and English naturally when appropriate
7. Reference user's health profile when relevant

EMERGENCY KEYWORDS TO WATCH:
- Chest pain (đau ngực), difficulty breathing (khó thở)
- Severe bleeding (chảy máu nghiêm trọng), loss of consciousness (bất tỉnh)
- Stroke symptoms (đột quỵ): facial drooping, arm weakness, slurred speech
- Severe allergic reaction (phản ứng dị ứng nghiêm trọng)
- Severe head injury (chấn thương đầu nghiêm trọng)

Respond now:`;

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
