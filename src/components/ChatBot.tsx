import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Mic, Volume2, X, Globe } from 'lucide-react';

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
      cropHealth: "Your crops are showing healthy growth with good NDVI values.",
      weather: "Current weather conditions are favorable for your crops.",
      irrigation: "Soil moisture levels suggest watering in 2-3 hours.",
      default: "I'm here to help with your farming questions!"
    },
    tamil: {
      greeting: "வணக்கம்! நான் உங்கள் விவசாய உதவியாளர். இன்று நான் எப்படி உதவ முடியும்?",
      cropHealth: "உங்கள் பயிர்கள் நல்ல NDVI மதிப்புகளுடன் ஆரோக்கியமான வளர்ச்சியைக் காட்டுகின்றன.",
      weather: "தற்போதைய வானிலை நிலைமைகள் உங்கள் பயிர்களுக்கு சாதகமாக உள்ளன.",
      irrigation: "மண்ணின் ஈரப்பதம் 2-3 மணி நேரத்தில் நீர்ப்பாசனம் தேவை என்று கூறுகிறது.",
      default: "உங்கள் விவசாய கேள்விகளுக்கு உதவ நான் இங்கே இருக்கிறேன்!"
    },
    telugu: {
      greeting: "నమస్కారం! నేను మీ వ్యవసాయ సహాయకుడను. ఈరోజు నేను ఎలా సహాయం చేయగలను?",
      cropHealth: "మీ పంటలు మంచి NDVI విలువలతో ఆరోగ్యకరమైన పెరుగుదలను చూపిస్తున్నాయి.",
      weather: "ప్రస్తుత వాతావరణ పరిస్థితులు మీ పంటలకు అనుకూలంగా ఉన్నాయి.",
      irrigation: "మట్టి తేమ స్థాయిలు 2-3 గంటల్లో నీటిపారుదల అవసరమని సూచిస్తున్నాయి.",
      default: "మీ వ్యవసాయ ప్రశ్నలకు సహాయం చేయడానికి నేను ఇక్కడ ఉన్నాను!"
    },
    malayalam: {
      greeting: "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ കാർഷിക സഹായിയാണ്. ഇന്ന് എനിക്ക് എങ്ങനെ സഹായിക്കാം?",
      cropHealth: "നിങ്ങളുടെ വിളകൾ നല്ല NDVI മൂല്യങ്ങളോടെ ആരോഗ്യകരമായ വളർച്ച കാണിക്കുന്നു.",
      weather: "നിലവിലെ കാലാവസ്ഥാ സാഹചര്യങ്ങൾ നിങ്ങളുടെ വിളകൾക്ക് അനുകൂലമാണ്.",
      irrigation: "മണ്ണിന്റെ ഈർപ്പം 2-3 മണിക്കൂറിനുള്ളിൽ നനയ്ക്കേണ്ടതുണ്ടെന്ന് സൂചിപ്പിക്കുന്നു.",
      default: "നിങ്ങളുടെ കാർഷിക ചോദ്യങ്ങളിൽ സഹായിക്കാൻ ഞാൻ ഇവിടെയുണ്ട്!"
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.lang.startsWith(languages[selectedLanguage as keyof typeof languages].code.split('-')[0]) && 
        voice.name.toLowerCase().includes('female')
      ) || voices.find(voice => voice.lang.startsWith(languages[selectedLanguage as keyof typeof languages].code.split('-')[0]));
      
      if (femaleVoice) utterance.voice = femaleVoice;
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      speechSynthesis.speak(utterance);
    }
  };

  const getResponse = (input: string): string => {
    const lang = selectedLanguage as keyof typeof responses;
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('crop') || lowerInput.includes('health') || lowerInput.includes('பயிர்') || lowerInput.includes('పంట') || lowerInput.includes('വിള')) {
      return responses[lang].cropHealth;
    }
    if (lowerInput.includes('weather') || lowerInput.includes('வானிலை') || lowerInput.includes('వాతావరణం') || lowerInput.includes('കാലാവസ്ഥ')) {
      return responses[lang].weather;
    }
    if (lowerInput.includes('water') || lowerInput.includes('irrigation') || lowerInput.includes('நீர்') || lowerInput.includes('నీరు') || lowerInput.includes('വെള്ളം')) {
      return responses[lang].irrigation;
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
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = languages[selectedLanguage as keyof typeof languages].code;
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        setInputText(event.results[0][0].transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
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