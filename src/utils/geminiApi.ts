const GEMINI_API_KEY = 'AIzaSyCFB9YVaXC_xZ2pkBtqY7ZHiw_UelJTOMo'; // Replace with your actual API key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export const callGeminiAPI = async (prompt: string, language: string): Promise<string> => {
  const languageMap = {
    english: 'English',
    tamil: 'Tamil',
    telugu: 'Telugu', 
    malayalam: 'Malayalam'
  };
  
  const targetLanguage = languageMap[language as keyof typeof languageMap] || 'English';
  
  const agriculturalContext = `
You are an expert agricultural assistant for Indian farmers. 
Provide practical advice in ${targetLanguage} language only.
Focus on: crop diseases, remedies, cultivation, soil, pest control, fertilizers, irrigation, harvest, market.
Be concise. Include chemical names and dosages for treatments.
Format responses for text-to-speech: use plain, speakable text only. No markdown, asterisks, bullets, dashes, or special formatting characters.
Write in natural conversational style suitable for voice synthesis.
`;

  const fullPrompt = `${agriculturalContext}\n\nFarmer's question: ${prompt}`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 512,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    
    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('No response from Gemini API');
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    return getFallbackResponse(prompt, language);
  }
};

const getFallbackResponse = (prompt: string, language: string): string => {
  const fallbackResponses = {
    english: "I'm here to help with your agricultural questions. Please try asking about crops, diseases, weather, or farming practices.",
    tamil: "உங்கள் விவசாய கேள்விகளுக்கு உதவ நான் இங்கே இருக்கிறேன். பயிர்கள், நோய்கள், வானிலை அல்லது விவசாய முறைகளைப் பற்றி கேட்க முயற்சிக்கவும்.",
    telugu: "మీ వ్యవసాయ ప్రశ్నలకు సహాయం చేయడానికి నేను ఇక్కడ ఉన్నాను. పంటలు, వ్యాధులు, వాతావరణం లేదా వ్యవసాయ పద్ధతుల గురించి అడగడానికి ప్రయత్నించండి.",
    malayalam: "നിങ്ങളുടെ കാർഷിക ചോദ്യങ്ങളിൽ സഹായിക്കാൻ ഞാൻ ഇവിടെയുണ്ട്. വിളകൾ, രോഗങ്ങൾ, കാലാവസ്ഥ അല്ലെങ്കിൽ കൃഷി രീതികളെക്കുറിച്ച് ചോദിക്കാൻ ശ്രമിക്കുക."
  };
  
  return fallbackResponses[language as keyof typeof fallbackResponses] || fallbackResponses.english;
};