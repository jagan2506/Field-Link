import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Mic, Volume2, X, Globe } from 'lucide-react';
import { plantsDatabase, getWeatherForecast, findPlantByName, findDiseaseRemedies } from '../utils/agricultureDatabase';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const languages = {
    english: { name: 'English', code: 'en-US' },
    tamil: { name: 'தமிழ்', code: 'ta-IN' },
    telugu: { name: 'తెలుగు', code: 'te-IN' },
    malayalam: { name: 'മലയാളം', code: 'ml-IN' }
  };

  const responses = {
    english: {
      greeting: "Hello! I'm your agricultural assistant. How can I help you today?",
      cropHealth: "Your crops show healthy growth with NDVI 0.75. Green leaves indicate good chlorophyll levels.",
      weather: "Temperature 24°C, humidity 65%. Perfect conditions for crop growth today.",
      irrigation: "Soil moisture at 45%. Water needed in 2 hours for optimal growth.",
      fertilizer: "NPK levels are balanced. Consider organic compost for better soil health.",
      pests: "No pest activity detected. Continue regular monitoring for early detection.",
      harvest: "Crops will be ready for harvest in 3-4 weeks based on current growth rate.",
      soil: "Soil pH is 6.8 - ideal for most crops. Maintain current soil management.",
      seeds: "Use certified seeds for better yield. Soak seeds 12 hours before planting.",
      market: "Current market price for your crop is ₹25/kg. Good time to plan harvest.",
      default: "I'm here to help with crops, weather, irrigation, fertilizers, pests, harvest, soil, seeds, and market prices!"
    },
    tamil: {
      greeting: "வணக்கம்! நான் உங்கள் விவசாய உதவியாளர். இன்று நான் எப்படி உதவ முடியும்?",
      cropHealth: "உங்கள் பயிர்கள் NDVI 0.75 உடன் ஆரோக்கியமான வளர்ச்சி. பச்சை இலைகள் நல்ல குளோரோபில் அளவைக் காட்டுகின்றன.",
      weather: "வெப்பநிலை 24°C, ஈரப்பதம் 65%. இன்று பயிர் வளர்ச்சிக்கு சரியான சூழல்.",
      irrigation: "மண் ஈரப்பதம் 45%. சிறந்த வளர்ச்சிக்கு 2 மணி நேரத்தில் நீர் தேவை.",
      fertilizer: "NPK அளவுகள் சமநிலையில் உள்ளன. மண் ஆரோக்கியத்திற்கு இயற்கை உரம் பயன்படுத்துங்கள்.",
      pests: "பூச்சி தாக்குதல் இல்லை. ஆரம்ப கண்டறிதலுக்கு தொடர்ந்து கண்காணிக்கவும்.",
      harvest: "தற்போதைய வளர்ச்சி விகிதத்தின் அடிப்படையில் 3-4 வாரங்களில் அறுவடை தயார்.",
      soil: "மண் pH 6.8 - பெரும்பாலான பயிர்களுக்கு ஏற்றது. தற்போதைய மண் நிர்வாகத்தை தொடரவும்.",
      seeds: "அதிக மகசூலுக்கு சான்றிதழ் பெற்ற விதைகளைப் பயன்படுத்துங்கள். நடவுக்கு முன் 12 மணி நேரம் ஊறவைக்கவும்.",
      market: "உங்கள் பயிருக்கு தற்போதைய சந்தை விலை ₹25/கிலோ. அறுவடை திட்டமிட நல்ல நேரம்.",
      default: "பயிர்கள், வானிலை, நீர்ப்பாசனம், உரங்கள், பூச்சிகள், அறுவடை, மண், விதைகள், சந்தை விலைகளில் உதவ நான் இங்கே இருக்கிறேன்!"
    },
    telugu: {
      greeting: "నమస్కారం! నేను మీ వ్యవసాయ సహాయకుడను. ఈరోజు నేను ఎలా సహాయం చేయగలను?",
      cropHealth: "మీ పంటలు NDVI 0.75తో ఆరోగ్యకరమైన పెరుగుదల. ఆకుపచ్చ ఆకులు మంచి క్లోరోఫిల్ స్థాయిలను చూపుతున్నాయి.",
      weather: "ఉష్ణోగ్రత 24°C, తేమ 65%. ఈరోజు పంట పెరుగుదలకు అనుకూల పరిస్థితులు.",
      irrigation: "మట్టి తేమ 45%. మంచి పెరుగుదలకు 2 గంటల్లో నీరు అవసరం.",
      fertilizer: "NPK స్థాయిలు సమతుల్యంగా ఉన్నాయి. మట్టి ఆరోగ్యం కోసం సేంద్రీయ ఎరువులు వాడండి.",
      pests: "చీడపీడల కార్యకలాపాలు లేవు. ముందస్తు గుర్తింపు కోసం క్రమం తప్పకుండా పర్యవేక్షించండి.",
      harvest: "ప్రస్తుత పెరుగుదల రేటు ఆధారంగా 3-4 వారాల్లో పంటలు కోతకు సిద్ధం.",
      soil: "మట్టి pH 6.8 - చాలా పంటలకు అనువైనది. ప్రస్తుత మట్టి నిర్వహణను కొనసాగించండి.",
      seeds: "మంచి దిగుబడి కోసం ధృవీకరించబడిన విత్తనాలు వాడండి. నాటడానికి ముందు 12 గంటలు నానబెట్టండి.",
      market: "మీ పంటకు ప్రస్తుత మార్కెట్ ధర ₹25/కిలో. కోత ప్లాన్ చేయడానికి మంచి సమయం.",
      default: "పంటలు, వాతావరణం, నీటిపారుదల, ఎరువులు, చీడపీడలు, కోత, మట్టి, విత్తనాలు, మార్కెట్ ధరలలో సహాయం చేయడానికి నేను ఇక్కడ ఉన్నాను!"
    },
    malayalam: {
      greeting: "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ കാർഷിക സഹായിയാണ്. ഇന്ന് എനിക്ക് എങ്ങനെ സഹായിക്കാം?",
      cropHealth: "നിങ്ങളുടെ വിളകൾ NDVI 0.75 ഉം ആരോഗ്യകരമായ വളർച്ച കാണിക്കുന്നു. പച്ച ഇലകൾ നല്ല ക്ലോറോഫിൽ അളവ് സൂചിപ്പിക്കുന്നു.",
      weather: "താപനില 24°C, ആർദ്രത 65%. ഇന്ന് വിള വളർച്ചയ്ക്ക് അനുയോജ്യമായ അവസ്ഥകൾ.",
      irrigation: "മണ്ണിന്റെ ഈർപ്പം 45%. മികച്ച വളർച്ചയ്ക്ക് 2 മണിക്കൂറിനുള്ളിൽ വെള്ളം ആവശ്യം.",
      fertilizer: "NPK അളവുകൾ സമതുലിതമാണ്. മണ്ണിന്റെ ആരോഗ്യത്തിന് ജൈവ കമ്പോസ്റ്റ് ഉപയോഗിക്കുക.",
      pests: "കീടങ്ങളുടെ പ്രവർത്തനം കണ്ടെത്തിയില്ല. നേരത്തെ കണ്ടെത്തുന്നതിന് പതിവ് നിരീക്ഷണം തുടരുക.",
      harvest: "നിലവിലെ വളർച്ചാ നിരക്ക് അടിസ്ഥാനമാക്കി 3-4 ആഴ്ചകൾക്കുള്ളിൽ വിളകൾ വിളവെടുപ്പിന് തയ്യാറാകും.",
      soil: "മണ്ണിന്റെ pH 6.8 - മിക്ക വിളകൾക്കും അനുയോജ്യം. നിലവിലെ മണ്ണ് പരിപാലനം തുടരുക.",
      seeds: "മികച്ച വിളവിനായി സാക്ഷ്യപ്പെടുത്തിയ വിത്തുകൾ ഉപയോഗിക്കുക. നടുന്നതിന് മുമ്പ് 12 മണിക്കൂർ കുതിർക്കുക.",
      market: "നിങ്ങളുടെ വിളയുടെ നിലവിലെ വിപണി വില ₹25/കിലോ. വിളവെടുപ്പ് ആസൂത്രണം ചെയ്യാൻ നല്ല സമയം.",
      default: "വിളകൾ, കാലാവസ്ഥ, ജലസേചനം, വളങ്ങൾ, കീടങ്ങൾ, വിളവെടുപ്പ്, മണ്ണ്, വിത്തുകൾ, വിപണി വിലകൾ എന്നിവയിൽ സഹായിക്കാൻ ഞാൻ ഇവിടെയുണ്ട്!"
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = languages[selectedLanguage as keyof typeof languages].code;
      
      const voices = speechSynthesis.getVoices();
      const targetLang = languages[selectedLanguage as keyof typeof languages].code;
      
      // Find Indian female voice or closest match
      const indianFemaleVoice = voices.find(voice => 
        (voice.lang === targetLang || voice.lang.startsWith(targetLang.split('-')[0])) &&
        (voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('woman') || 
         voice.name.toLowerCase().includes('indian') || voice.name.toLowerCase().includes('hindi'))
      ) || voices.find(voice => 
        voice.lang === targetLang || voice.lang.startsWith(targetLang.split('-')[0])
      );
      
      if (indianFemaleVoice) {
        utterance.voice = indianFemaleVoice;
      }
      
      utterance.rate = 0.7;
      utterance.pitch = 1.3;
      utterance.volume = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  const getResponse = (input: string): string => {
    const lang = selectedLanguage as keyof typeof responses;
    const lowerInput = input.toLowerCase();
    
    // Weather and rain queries
    if (lowerInput.includes('weather') || lowerInput.includes('rain') || lowerInput.includes('climate') || 
        lowerInput.includes('வானிலை') || lowerInput.includes('மழை') || lowerInput.includes('వాతావరణం') || 
        lowerInput.includes('వర్షం') || lowerInput.includes('കാലാവസ്ഥ') || lowerInput.includes('മഴ')) {
      const weather = getWeatherForecast();
      const weatherResponses = {
        english: `Today's forecast: ${weather.rainProbability}% rain probability, ${weather.temperature}°C temperature, ${weather.humidity}% humidity. ${weather.recommendation}`,
        tamil: `இன்றைய வானிலை: ${weather.rainProbability}% மழை வாய்ப்பு, ${weather.temperature}°C வெப்பநிலை, ${weather.humidity}% ஈரப்பதம். ${weather.recommendation}`,
        telugu: `నేటి వాతావరణం: ${weather.rainProbability}% వర్షం అవకాశం, ${weather.temperature}°C ఉష్ణోగ్రత, ${weather.humidity}% తేమ. ${weather.recommendation}`,
        malayalam: `ഇന്നത്തെ കാലാവസ്ഥ: ${weather.rainProbability}% മഴയ്ക്ക് സാധ്യത, ${weather.temperature}°C താപനില, ${weather.humidity}% ആർദ്രത. ${weather.recommendation}`
      };
      return weatherResponses[lang];
    }
    
    // Plant cultivation duration queries
    const plantNames = ['rice', 'wheat', 'tomato', 'cotton', 'sugarcane', 'maize', 'potato', 'onion', 'chili', 'banana',
                       'நெல்', 'கோதுமை', 'தக்காளி', 'பருத்தி', 'கரும்பு', 'மக்காச்சோளம்', 'உருளைக்கிழங்கு', 'வெங்காயம்', 'மிளகாய்', 'வாழை',
                       'వరి', 'గోధుమ', 'టమాటో', 'పత్తి', 'చెరకు', 'మొక్కజొన్న', 'బంగాళాదుంప', 'ఉల్లిపాయ', 'మిర్చి', 'అరటి',
                       'നെല്ല്', 'ഗോതമ്പ്', 'തക്കാളി', 'പരുത്തി', 'കരിമ്പ്', 'ചോളം', 'ഉരുളക്കിഴങ്ങ്', 'ഉള്ളി', 'മുളക്', 'വാഴ'];
    
    for (const plantName of plantNames) {
      if (lowerInput.includes(plantName)) {
        const plant = findPlantByName(plantName);
        if (plant) {
          const plantResponses = {
            english: `${plant.name} cultivation takes ${plant.cultivationDuration}. Best seasons: ${plant.seasons.join(', ')}. Main diseases: ${plant.diseases.map(d => d.name).join(', ')}.`,
            tamil: `${plant.name} சாகுபடி ${plant.cultivationDuration} எடுக்கும். சிறந்த பருவங்கள்: ${plant.seasons.join(', ')}. முக்கிய நோய்கள்: ${plant.diseases.map(d => d.name).join(', ')}.`,
            telugu: `${plant.name} సాగు ${plant.cultivationDuration} పడుతుంది. మంచి సీజన్లు: ${plant.seasons.join(', ')}. ముఖ్య వ్యాధులు: ${plant.diseases.map(d => d.name).join(', ')}.`,
            malayalam: `${plant.name} കൃഷി ${plant.cultivationDuration} എടുക്കും. നല്ല സീസണുകൾ: ${plant.seasons.join(', ')}. പ്രധാന രോഗങ്ങൾ: ${plant.diseases.map(d => d.name).join(', ')}.`
          };
          return plantResponses[lang];
        }
      }
    }
    
    // Disease remedy queries
    const diseaseNames = ['blast', 'blight', 'rust', 'wilt', 'rot', 'spot', 'bollworm', 'anthracnose', 'panama',
                         'நோய்', 'பூஞ்சை', 'வாடல்', 'புள்ளி', 'కుళ్ళు', 'వ్యాధి', 'తెగులు', 'രോഗം', 'പുള്ളി', 'വാടൽ'];
    
    for (const diseaseName of diseaseNames) {
      if (lowerInput.includes(diseaseName)) {
        const diseases = findDiseaseRemedies(diseaseName);
        if (diseases.length > 0) {
          const disease = diseases[0];
          const diseaseResponses = {
            english: `${disease.name} symptoms: ${disease.symptoms.join(', ')}. Remedies: ${disease.remedies.join(', ')}. Prevention: ${disease.prevention.join(', ')}.`,
            tamil: `${disease.name} அறிகுறிகள்: ${disease.symptoms.join(', ')}. தீர்வுகள்: ${disease.remedies.join(', ')}. தடுப்பு: ${disease.prevention.join(', ')}.`,
            telugu: `${disease.name} లక్షణాలు: ${disease.symptoms.join(', ')}. చికిత్సలు: ${disease.remedies.join(', ')}. నివారణ: ${disease.prevention.join(', ')}.`,
            malayalam: `${disease.name} ലക്ഷണങ്ങൾ: ${disease.symptoms.join(', ')}. പരിഹാരങ്ങൾ: ${disease.remedies.join(', ')}. പ്രതിരോധം: ${disease.prevention.join(', ')}.`
          };
          return diseaseResponses[lang];
        }
      }
    }
    
    // Default responses for other queries
    if (lowerInput.includes('crop') || lowerInput.includes('health') || lowerInput.includes('பயிர்') || lowerInput.includes('పంట') || lowerInput.includes('വിള')) {
      return responses[lang].cropHealth;
    }
    if (lowerInput.includes('water') || lowerInput.includes('irrigation') || lowerInput.includes('நீர்') || lowerInput.includes('నీరు') || lowerInput.includes('വെള്ളം')) {
      return responses[lang].irrigation;
    }
    if (lowerInput.includes('fertilizer') || lowerInput.includes('nutrient') || lowerInput.includes('உரம்') || lowerInput.includes('ఎరువు') || lowerInput.includes('വള')) {
      return responses[lang].fertilizer;
    }
    if (lowerInput.includes('pest') || lowerInput.includes('insect') || lowerInput.includes('பூச்சி') || lowerInput.includes('చీడ') || lowerInput.includes('കീട')) {
      return responses[lang].pests;
    }
    if (lowerInput.includes('harvest') || lowerInput.includes('yield') || lowerInput.includes('அறுவடை') || lowerInput.includes('కోత') || lowerInput.includes('വിളവെടുപ്പ്')) {
      return responses[lang].harvest;
    }
    if (lowerInput.includes('soil') || lowerInput.includes('ph') || lowerInput.includes('மண்') || lowerInput.includes('మట్టి') || lowerInput.includes('മണ്ണ്')) {
      return responses[lang].soil;
    }
    if (lowerInput.includes('seed') || lowerInput.includes('plant') || lowerInput.includes('விதை') || lowerInput.includes('విత్తన') || lowerInput.includes('വിത്ത്')) {
      return responses[lang].seeds;
    }
    if (lowerInput.includes('market') || lowerInput.includes('price') || lowerInput.includes('சந்தை') || lowerInput.includes('మార్కెట్') || lowerInput.includes('വിപണി')) {
      return responses[lang].market;
    }
    return responses[lang].default;
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;
    
    const userMessage: Message = {
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    setTimeout(() => {
      const botResponse = getResponse(inputText);
      const botMessage: Message = {
        text: botResponse,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      speakText(botResponse);
    }, 1000);
    
    setInputText('');
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      // Stop any ongoing speech synthesis
      speechSynthesis.cancel();
      
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = languages[selectedLanguage as keyof typeof languages].code;
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        // Auto-send the message after speech recognition
        setTimeout(() => {
          if (transcript.trim()) {
            const userMessage: Message = {
              text: transcript,
              isUser: true,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, userMessage]);
            
            setTimeout(() => {
              const botResponse = getResponse(transcript);
              const botMessage: Message = {
                text: botResponse,
                isUser: false,
                timestamp: new Date()
              };
              setMessages(prev => [...prev, botMessage]);
              speakText(botResponse);
            }, 500);
          }
        }, 100);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = responses[selectedLanguage as keyof typeof responses].greeting;
      setMessages([{
        text: greeting,
        isUser: false,
        timestamp: new Date()
      }]);
      speakText(greeting);
    }
  }, [isOpen, selectedLanguage]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-96 bg-white rounded-lg shadow-xl border z-50">
          <div className="flex items-center justify-between p-4 border-b bg-green-600 text-white rounded-t-lg">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-green-700 text-white rounded px-2 py-1 text-sm"
              >
                {Object.entries(languages).map(([key, lang]) => (
                  <option key={key} value={key}>{lang.name}</option>
                ))}
              </select>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-4 h-64 overflow-y-auto">
            {messages.map((message, index) => (
              <div key={index} className={`mb-3 ${message.isUser ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-2 rounded-lg max-w-xs ${
                  message.isUser ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'
                }`}>
                  {message.text}
                  {!message.isUser && (
                    <button
                      onClick={() => speakText(message.text)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <Volume2 className="w-3 h-3 inline" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 border rounded-lg px-3 py-2 text-sm"
              />
              <button
                onClick={startListening}
                className={`p-2 rounded-lg ${isListening ? 'bg-red-600' : 'bg-blue-600'} text-white`}
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                onClick={sendMessage}
                className="p-2 bg-green-600 text-white rounded-lg"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;