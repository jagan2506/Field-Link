// Medicine database for agricultural treatments
const medicineDatabase = {
  'leaf spot': {
    en: ['Mancozeb 75% WP @ 2g/L', 'Copper Oxychloride @ 3g/L', 'Carbendazim 50% WP @ 1g/L'],
    ta: ['மான்கோசெப் 75% WP @ 2g/L', 'காப்பர் ஆக்சிக்ளோரைடு @ 3g/L', 'கார்பென்டாசிம் 50% WP @ 1g/L'],
    ml: ['മാൻകോസെബ് 75% WP @ 2g/L', 'കോപ്പർ ഓക്സിക്ലോറൈഡ് @ 3g/L', 'കാർബെൻഡാസിം 50% WP @ 1g/L'],
    te: ['మాంకోజెబ్ 75% WP @ 2g/L', 'కాపర్ ఆక్సిక్లోరైడ్ @ 3g/L', 'కార్బెండాజిమ్ 50% WP @ 1g/L']
  },
  'blight': {
    en: ['Metalaxyl + Mancozeb @ 2g/L', 'Copper Sulphate @ 2.5g/L', 'Bordeaux Mixture @ 1%'],
    ta: ['மெட்டலாக்சில் + மான்கோசெப் @ 2g/L', 'காப்பர் சல்பேட் @ 2.5g/L', 'போர்டியாக்ஸ் கலவை @ 1%'],
    ml: ['മെറ്റലാക്സിൽ + മാൻകോസെബ് @ 2g/L', 'കോപ്പർ സൾഫേറ്റ് @ 2.5g/L', 'ബോർഡോ മിശ്രിതം @ 1%'],
    te: ['మెటలాక్సిల్ + మాంకోజెబ్ @ 2g/L', 'కాపర్ సల్ఫేట్ @ 2.5g/L', 'బోర్డో మిశ్రమం @ 1%']
  },
  'rust': {
    en: ['Propiconazole 25% EC @ 1ml/L', 'Tebuconazole @ 0.1%', 'Triadimefon @ 1g/L'],
    ta: ['ப்ரோபிகோனசோல் 25% EC @ 1ml/L', 'டெபுகோனசோல் @ 0.1%', 'ட்ரையாடிமெஃபான் @ 1g/L'],
    ml: ['പ്രോപിക്കോണസോൾ 25% EC @ 1ml/L', 'ടെബുക്കോണസോൾ @ 0.1%', 'ട്രയാഡിമെഫോൺ @ 1g/L'],
    te: ['ప్రోపికోనజోల్ 25% EC @ 1ml/L', 'టెబుకోనజోల్ @ 0.1%', 'ట్రయాడిమెఫోన్ @ 1g/L']
  },
  'powdery mildew': {
    en: ['Sulfur 80% WP @ 2g/L', 'Carbendazim 50% WP @ 1g/L', 'Myclobutanil @ 1ml/L'],
    ta: ['கந்தகம் 80% WP @ 2g/L', 'கார்பென்டாசிம் 50% WP @ 1g/L', 'மைக்லோபுட்டானில் @ 1ml/L'],
    ml: ['സൾഫർ 80% WP @ 2g/L', 'കാർബെൻഡാസിം 50% WP @ 1g/L', 'മൈക്ലോബുട്ടാനിൽ @ 1ml/L'],
    te: ['సల్ఫర్ 80% WP @ 2g/L', 'కార్బెండాజిమ్ 50% WP @ 1g/L', 'మైక్లోబుట్టానిల్ @ 1ml/L']
  },
  'aphids': {
    en: ['Imidacloprid 17.8% SL @ 0.3ml/L', 'Thiamethoxam 25% WG @ 0.2g/L', 'Acetamiprid 20% SP @ 0.2g/L'],
    ta: ['இமிடாக்ளோப்ரிட் 17.8% SL @ 0.3ml/L', 'தியாமெத்தாக்சம் 25% WG @ 0.2g/L', 'அசெட்டாமிப்ரிட் 20% SP @ 0.2g/L'],
    ml: ['ഇമിഡാക്ലോപ്രിഡ് 17.8% SL @ 0.3ml/L', 'തിയാമെത്തോക്സാം 25% WG @ 0.2g/L', 'അസെറ്റാമിപ്രിഡ് 20% SP @ 0.2g/L'],
    te: ['ఇమిడాక్లోప్రిడ్ 17.8% SL @ 0.3ml/L', 'థియామెథాక్సమ్ 25% WG @ 0.2g/L', 'అసెటామిప్రిడ్ 20% SP @ 0.2g/L']
  }
};

export const detectLanguageFromText = (text: string): string => {
  // Tamil detection
  if (/[\u0B80-\u0BFF]/.test(text)) return 'tamil';
  // Malayalam detection  
  if (/[\u0D00-\u0D7F]/.test(text)) return 'malayalam';
  // Telugu detection
  if (/[\u0C00-\u0C7F]/.test(text)) return 'telugu';
  // Default to English
  return 'english';
};

export const getMedicineRecommendations = (disease: string, language: string): string[] => {
  const normalizedDisease = disease.toLowerCase();
  const langCode = language === 'tamil' ? 'ta' : 
                   language === 'malayalam' ? 'ml' : 
                   language === 'telugu' ? 'te' : 'en';
  
  // Find matching disease
  for (const [key, medicines] of Object.entries(medicineDatabase)) {
    if (normalizedDisease.includes(key)) {
      return medicines[langCode as keyof typeof medicines] || medicines.en;
    }
  }
  
  // Default medicines for general issues
  return medicineDatabase['leaf spot'][langCode as keyof typeof medicineDatabase['leaf spot']] || 
         medicineDatabase['leaf spot'].en;
};

export const formatMedicineResponse = (medicines: string[], language: string): string => {
  const headers = {
    english: 'Recommended Medicines:',
    tamil: 'பரிந்துரைக்கப்பட்ட மருந்துகள்:',
    malayalam: 'ശുപാർശ ചെയ്യുന്ന മരുന്നുകൾ:',
    telugu: 'సిఫార్సు చేయబడిన మందులు:'
  };
  
  const header = headers[language as keyof typeof headers] || headers.english;
  const medicineList = medicines.map((med, index) => `${index + 1}. ${med}`).join('\n');
  
  return `${header}\n\n${medicineList}`;
};