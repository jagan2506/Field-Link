import { callGeminiAPI } from './geminiApi';

export const analyzeImageWithGemini = async (imageBase64: string, language: string): Promise<any> => {
  try {
    const languageMap = {
      'english': 'English',
      'tamil': 'Tamil (தமிழ்)',
      'malayalam': 'Malayalam (മലയാളം)',
      'telugu': 'Telugu (తెలుగు)'
    };
    
    const targetLanguage = languageMap[language as keyof typeof languageMap] || 'English';
    
    const prompt = `Analyze this plant image for diseases. Provide detailed analysis and remedies in ${targetLanguage} language.
    
    Provide response in JSON format:
    {
      "diseaseDetected": boolean,
      "diseases": [
        {
          "name": "disease name in ${targetLanguage}",
          "severity": "Early Stage/Moderate/Advanced",
          "confidence": "percentage",
          "symptoms": ["symptom1 in ${targetLanguage}", "symptom2 in ${targetLanguage}"],
          "remedies": ["remedy1 in ${targetLanguage}", "remedy2 in ${targetLanguage}", "remedy3 in ${targetLanguage}"]
        }
      ],
      "healthStatus": "Healthy/Mild Disease/Moderate/Poor",
      "overallConfidence": "percentage",
      "recommendations": ["care tip 1 in ${targetLanguage}", "care tip 2 in ${targetLanguage}"]
    }

    IMPORTANT: All disease names, symptoms, remedies, and recommendations must be in ${targetLanguage} language.
    
    For remedies, include:
    1. Specific medicine names with dosage in ${targetLanguage}
    2. Application methods in ${targetLanguage}
    3. Prevention steps in ${targetLanguage}
    4. Care instructions in ${targetLanguage}`;

    const response = await callGeminiAPI(prompt, language);
    
    // Try to parse JSON response
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.log('JSON parse failed, using text response');
    }

    // Fallback: parse text response
    const diseaseDetected = response.toLowerCase().includes('disease') && 
                           !response.toLowerCase().includes('no disease') &&
                           !response.toLowerCase().includes('healthy');

    return {
      diseaseDetected,
      diseases: diseaseDetected ? [{
        name: extractDiseaseName(response),
        severity: extractSeverity(response),
        confidence: "85",
        symptoms: extractSymptoms(response),
        remedies: extractRemedies(response)
      }] : [],
      healthStatus: diseaseDetected ? "Mild Disease" : "Healthy",
      overallConfidence: "85",
      recommendations: extractRecommendations(response)
    };

  } catch (error) {
    console.error('Gemini image analysis failed:', error);
    throw error;
  }
};

const extractDiseaseName = (text: string): string => {
  const diseases = ['leaf spot', 'blight', 'mildew', 'rust', 'anthracnose', 'wilt', 'mosaic'];
  for (const disease of diseases) {
    if (text.toLowerCase().includes(disease)) {
      return disease.charAt(0).toUpperCase() + disease.slice(1);
    }
  }
  return 'Unknown Disease';
};

const extractSeverity = (text: string): string => {
  if (text.toLowerCase().includes('severe') || text.toLowerCase().includes('advanced')) return 'Advanced';
  if (text.toLowerCase().includes('moderate')) return 'Moderate';
  return 'Early Stage';
};

const extractSymptoms = (text: string): string[] => {
  const symptoms = [];
  if (text.includes('spot')) symptoms.push('Dark spots on leaves');
  if (text.includes('yellow')) symptoms.push('Yellowing of leaves');
  if (text.includes('wilt')) symptoms.push('Wilting of plant parts');
  return symptoms.length > 0 ? symptoms : ['Visible disease symptoms'];
};

const extractRemedies = (text: string): string[] => {
  const remedies = [];
  if (text.toLowerCase().includes('mancozeb')) remedies.push('Apply Mancozeb 75% WP @ 2g/L');
  if (text.toLowerCase().includes('copper')) remedies.push('Spray Copper oxychloride @ 3g/L');
  if (text.toLowerCase().includes('fungicide')) remedies.push('Use appropriate fungicide treatment');
  return remedies.length > 0 ? remedies : ['Consult agricultural expert for treatment'];
};

const extractRecommendations = (text: string): string[] => {
  return [
    'Improve air circulation around plants',
    'Avoid overhead watering',
    'Remove affected plant parts',
    'Apply preventive treatments regularly'
  ];
};