export type Language = 'en' | 'ta' | 'ml' | 'te';

export interface Translations {
  // Header
  appTitle: string;
  appSubtitle: string;
  lastUpdated: string;
  farm: string;
  loadingText: string;

  // Main sections
  currentFieldConditions: string;
  smartAlerts: string;
  cropHealthVisualInsights: string;
  dataTrendsAnalytics: string;

  // Sensor cards
  temperature: string;
  soilMoisture: string;
  phLevel: string;
  cropHealth: string;
  optimal: string;
  normal: string;
  warning: string;
  alert: string;

  // Buttons
  downloadReport: string;
  configureAlerts: string;
  viewAllAlerts: string;
  captureImage: string;
  analyzing: string;
  previous: string;
  next: string;

  // Crop health panel
  analysisResults: string;
  ndviIndex: string;
  overallHealth: string;
  chlorophyll: string;
  diseaseStatus: string;
  keyInsights: string;
  healthy: string;
  moderate: string;
  poor: string;
  notAnalyzed: string;
  getDetailedTreatment: string;
  getCareTips: string;
  analyzeImage: string;
  proceedAnalysis: string;
  cancel: string;

  // Data charts
  hours24: string;
  days7: string;
  current: string;
  analysisSummary: string;

  // Footer
  smartIndiaHackathon: string;
  supportContact: string;
  systemFeatures: string;
  footerDescription: string;
  copyrightText: string;

  // Features list
  realtimeMonitoring: string;
  multispectralAnalysis: string;
  smartAlertSystem: string;
  historicalTracking: string;
  mobileResponsive: string;
  automatedReporting: string;

  // Alert messages
  highTempAlert: string;
  lowTempAlert: string;
  criticalMoistureAlert: string;
  lowMoistureAlert: string;
  phAlert: string;
  poorCropAlert: string;
  moderateCropAlert: string;
  allNormalAlert: string;
  recommendedAction: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appTitle: "Field Link",
    appSubtitle: "Advanced Agricultural Intelligence System",
    lastUpdated: "Last updated:",
    farm: "FARM",
    loadingText: "Loading farm data...",

    currentFieldConditions: "Current Field Conditions",
    smartAlerts: "Smart Alerts & Recommendations",
    cropHealthVisualInsights: "Crop Health Visual Insights",
    dataTrendsAnalytics: "Data Trends & Analytics",

    temperature: "Temperature",
    soilMoisture: "Soil Moisture",
    phLevel: "pH Level",
    cropHealth: "Crop Health",
    optimal: "Optimal:",
    normal: "Normal",
    warning: "Warning",
    alert: "Alert",

    downloadReport: "Download Report",
    configureAlerts: "Configure Alerts",
    viewAllAlerts: "View All Alerts",
    captureImage: "Capture Plant Image",
    analyzing: "Analyzing...",
    previous: "Previous",
    next: "Next",

    analysisResults: "Analysis Results",
    ndviIndex: "NDVI Index",
    overallHealth: "Overall Health",
    chlorophyll: "Chlorophyll",
    diseaseStatus: "Disease Status",
    keyInsights: "Key Insights",
    healthy: "Healthy",
    moderate: "Moderate",
    poor: "Poor",
    notAnalyzed: "Not Analyzed",
    getDetailedTreatment: "🩺 Get Detailed Treatment Plan",
    getCareTips: "🌱 Get Care & Maintenance Tips",
    analyzeImage: "Analyze Plant Image",
    proceedAnalysis: "Proceed with Analysis",
    cancel: "Cancel",

    hours24: "24 Hours",
    days7: "7 Days",
    current: "Current",
    analysisSummary: "Analysis Summary",

    smartIndiaHackathon: "Smart India Hackathon",
    supportContact: "Support & Contact",
    systemFeatures: "System Features",
    footerDescription: "Developed for Smart India Hackathon - Smart Agriculture Monitoring. Empowering farmers with AI-driven insights and real-time field monitoring.",
    copyrightText: "© 2025 Smart Agriculture Monitoring System. Built with advanced IoT and AI technologies.",

    realtimeMonitoring: "• Real-time sensor monitoring",
    multispectralAnalysis: "• Multispectral crop analysis",
    smartAlertSystem: "• Smart alert system",
    historicalTracking: "• Historical data tracking",
    mobileResponsive: "• Mobile-responsive design",
    automatedReporting: "• Automated reporting",

    highTempAlert: "High temperature detected. Consider providing shade or additional irrigation.",
    lowTempAlert: "Temperature is too low for optimal crop growth.",
    criticalMoistureAlert: "Critical: Soil moisture is dangerously low. Immediate irrigation required.",
    lowMoistureAlert: "Soil moisture is below optimal levels. Plan irrigation soon.",
    phAlert: "Soil pH is outside optimal range (6.0-7.5).",
    poorCropAlert: "Crop health is poor. Immediate attention required.",
    moderateCropAlert: "Crop health is moderate. Monitor closely.",
    allNormalAlert: "All parameters are within optimal ranges. Crops are healthy!",
    recommendedAction: "Recommended Action:"
  },

  ta: {
    appTitle: "ஃபீல்ட் லிங்க்",
    appSubtitle: "மேம்பட்ட விவசாய புத்திசாலித்தனம் அமைப்பு",
    lastUpdated: "கடைசியாக புதுப்பிக்கப்பட்டது:",
    farm: "பண்ணை",
    loadingText: "பண்ணை தரவு ஏற்றுகிறது...",

    currentFieldConditions: "தற்போதைய வயல் நிலைமைகள்",
    smartAlerts: "ஸ்மார்ட் எச்சரிக்கைகள் & பரிந்துரைகள்",
    cropHealthVisualInsights: "பயிர் ஆரோக்கிய காட்சி நுண்ணறிவுகள்",
    dataTrendsAnalytics: "தரவு போக்குகள் & பகுப்பாய்வு",

    temperature: "வெப்பநிலை",
    soilMoisture: "மண் ஈரப்பதம்",
    phLevel: "pH அளவு",
    cropHealth: "பயிர் ஆரோக்கியம்",
    optimal: "உகந்த:",
    normal: "சாதாரண",
    warning: "எச்சரிக்கை",
    alert: "அலர்ட்",

    downloadReport: "அறிக்கை பதிவிறக்கம்",
    configureAlerts: "எச்சரிக்கைகளை கட்டமைக்கவும்",
    viewAllAlerts: "அனைத்து எச்சரிக்கைகளையும் பார்க்கவும்",
    captureImage: "தாவர படத்தை எடுக்கவும்",
    analyzing: "பகுப்பாய்வு செய்கிறது...",
    previous: "முந்தைய",
    next: "அடுத்த",

    analysisResults: "பகுப்பாய்வு முடிவுகள்",
    ndviIndex: "NDVI குறியீடு",
    overallHealth: "ஒட்டுமொத்த ஆரோக்கியம்",
    chlorophyll: "குளோரோபில்",
    diseaseStatus: "நோய் நிலை",
    keyInsights: "முக்கிய நுண்ணறிவுகள்",
    healthy: "ஆரோக்கியமான",
    moderate: "மிதமான",
    poor: "மோசமான",
    notAnalyzed: "பகுப்பாய்வு செய்யப்படவில்லை",
    getDetailedTreatment: "🩺 விரிவான சிகிச்சை திட்டம் பெறவும்",
    getCareTips: "🌱 பராமரிப்பு குறிப்புகள் பெறவும்",
    analyzeImage: "தாவர படத்தை பகுப்பாய்வு செய்யவும்",
    proceedAnalysis: "பகுப்பாய்வுடன் தொடரவும்",
    cancel: "ரத்து செய்",

    hours24: "24 மணி நேரம்",
    days7: "7 நாட்கள்",
    current: "தற்போதைய",
    analysisSummary: "பகுப்பாய்வு சுருக்கம்",

    smartIndiaHackathon: "ஸ்மார்ட் இந்தியா ஹேக்கத்தான்",
    supportContact: "ஆதரவு & தொடர்பு",
    systemFeatures: "அமைப்பு அம்சங்கள்",
    footerDescription: "ஸ்மார்ட் இந்தியா ஹேக்கத்தான் - ஸ்மார்ட் விவசாய கண்காணிப்புக்காக உருவாக்கப்பட்டது. AI-உந்துதல் நுண்ணறிவுகள் மற்றும் நிகழ்நேர வயல் கண்காணிப்புடன் விவசாயிகளை வலுப்படுத்துதல்.",
    copyrightText: "© 2025 ஸ்மார்ட் விவசாய கண்காணிப்பு அமைப்பு. மேம்பட்ட IoT மற்றும் AI தொழில்நுட்பங்களுடன் கட்டப்பட்டது.",

    realtimeMonitoring: "• நிகழ்நேர சென்சார் கண்காணிப்பு",
    multispectralAnalysis: "• பல்நிறமாலை பயிர் பகுப்பாய்வு",
    smartAlertSystem: "• ஸ்மார்ட் எச்சரிக்கை அமைப்பு",
    historicalTracking: "• வரலாற்று தரவு கண்காணிப்பு",
    mobileResponsive: "• மொபைல்-பதிலளிக்கும் வடிவமைப்பு",
    automatedReporting: "• தானியங்கு அறிக்கையிடல்",

    highTempAlert: "அதிக வெப்பநிலை கண்டறியப்பட்டது. நிழல் அல்லது கூடுதல் நீர்ப்பாசனம் வழங்குவதைக் கருத்தில் கொள்ளுங்கள்.",
    lowTempAlert: "உகந்த பயிர் வளர்ச்சிக்கு வெப்பநிலை மிகவும் குறைவாக உள்ளது.",
    criticalMoistureAlert: "முக்கியமான: மண் ஈரப்பதம் ஆபத்தான அளவில் குறைவாக உள்ளது. உடனடி நீர்ப்பாசனம் தேவை.",
    lowMoistureAlert: "மண் ஈரப்பதம் உகந்த அளவுக்கு கீழே உள்ளது. விரைவில் நீர்ப்பாசனம் திட்டமிடுங்கள்.",
    phAlert: "மண் pH உகந்த வரம்புக்கு (6.0-7.5) வெளியே உள்ளது.",
    poorCropAlert: "பயிர் ஆரோக்கியம் மோசமாக உள்ளது. உடனடி கவனம் தேவை.",
    moderateCropAlert: "பயிர் ஆரோக்கியம் மிதமானது. நெருக்கமாக கண்காணிக்கவும்.",
    allNormalAlert: "அனைத்து அளவுருக்களும் உகந்த வரம்புகளுக்குள் உள்ளன. பயிர்கள் ஆரோக்கியமாக உள்ளன!",
    recommendedAction: "பரிந்துரைக்கப்பட்ட நடவடிக்கை:"
  },

  ml: {
    appTitle: "ഫീൽഡ് ലിങ്ക്",
    appSubtitle: "വിപുലമായ കാർഷിക ബുദ്ധിമത്ത സംവിധാനം",
    lastUpdated: "അവസാനം അപ്‌ഡേറ്റ് ചെയ്തത്:",
    farm: "കൃഷിയിടം",
    loadingText: "കൃഷിയിട ഡാറ്റ ലോഡ് ചെയ്യുന്നു...",

    currentFieldConditions: "നിലവിലെ വയൽ അവസ്ഥകൾ",
    smartAlerts: "സ്മാർട്ട് അലേർട്ടുകളും ശുപാർശകളും",
    cropHealthVisualInsights: "വിള ആരോഗ്യ ദൃശ്യ ഉൾക്കാഴ്ചകൾ",
    dataTrendsAnalytics: "ഡാറ്റ ട്രെൻഡുകളും അനലിറ്റിക്സും",

    temperature: "താപനില",
    soilMoisture: "മണ്ണിന്റെ ഈർപ്പം",
    phLevel: "pH നില",
    cropHealth: "വിള ആരോഗ്യം",
    optimal: "അനുയോജ്യം:",
    normal: "സാധാരണ",
    warning: "മുന്നറിയിപ്പ്",
    alert: "അലേർട്ട്",

    downloadReport: "റിപ്പോർട്ട് ഡൗൺലോഡ് ചെയ്യുക",
    configureAlerts: "അലേർട്ടുകൾ കോൺഫിഗർ ചെയ്യുക",
    viewAllAlerts: "എല്ലാ അലേർട്ടുകളും കാണുക",
    captureImage: "ചെടിയുടെ ചിത്രം പകർത്തുക",
    analyzing: "വിശകലനം ചെയ്യുന്നു...",
    previous: "മുമ്പത്തെ",
    next: "അടുത്തത്",

    analysisResults: "വിശകലന ഫലങ്ങൾ",
    ndviIndex: "NDVI സൂചിക",
    overallHealth: "മൊത്തത്തിലുള്ള ആരോഗ്യം",
    chlorophyll: "ക്ലോറോഫിൽ",
    diseaseStatus: "രോഗ നില",
    keyInsights: "പ്രധാന ഉൾക്കാഴ്ചകൾ",
    healthy: "ആരോഗ്യകരം",
    moderate: "മിതമായ",
    poor: "മോശം",
    notAnalyzed: "വിശകലനം ചെയ്തിട്ടില്ല",
    getDetailedTreatment: "🩺 വിശദമായ ചികിത്സാ പദ്ധതി നേടുക",
    getCareTips: "🌱 പരിചരണ നുറുങ്ങുകൾ നേടുക",
    analyzeImage: "ചെടിയുടെ ചിത്രം വിശകലനം ചെയ്യുക",
    proceedAnalysis: "വിശകലനവുമായി മുന്നോട്ട് പോകുക",
    cancel: "റദ്ദാക്കുക",

    hours24: "24 മണിക്കൂർ",
    days7: "7 ദിവസം",
    current: "നിലവിലെ",
    analysisSummary: "വിശകലന സംഗ്രഹം",

    smartIndiaHackathon: "സ്മാർട്ട് ഇന്ത്യ ഹാക്കത്തൺ",
    supportContact: "പിന്തുണയും ബന്ധപ്പെടലും",
    systemFeatures: "സിസ്റ്റം സവിശേഷതകൾ",
    footerDescription: "സ്മാർട്ട് ഇന്ത്യ ഹാക്കത്തൺ - സ്മാർട്ട് കാർഷിക നിരീക്ഷണത്തിനായി വികസിപ്പിച്ചത്. AI-നയിക്കുന്ന ഉൾക്കാഴ്ചകളും തത്സമയ വയൽ നിരീക്ഷണവും ഉപയോഗിച്ച് കർഷകരെ ശാക്തീകരിക്കുന്നു.",
    copyrightText: "© 2025 സ്മാർട്ട് കാർഷിക നിരീക്ഷണ സംവിധാനം. വിപുലമായ IoT, AI സാങ്കേതികവിദ്യകൾ ഉപയോഗിച്ച് നിർമ്മിച്ചത്.",

    realtimeMonitoring: "• തത്സമയ സെൻസർ നിരീക്ഷണം",
    multispectralAnalysis: "• മൾട്ടിസ്പെക്ട്രൽ വിള വിശകലനം",
    smartAlertSystem: "• സ്മാർട്ട് അലേർട്ട് സിസ്റ്റം",
    historicalTracking: "• ചരിത്രപരമായ ഡാറ്റ ട്രാക്കിംഗ്",
    mobileResponsive: "• മൊബൈൽ-റെസ്പോൺസീവ് ഡിസൈൻ",
    automatedReporting: "• ഓട്ടോമേറ്റഡ് റിപ്പോർട്ടിംഗ്",

    highTempAlert: "ഉയർന്ന താപനില കണ്ടെത്തി. നിഴലോ അധിക ജലസേചനമോ നൽകുന്നത് പരിഗണിക്കുക.",
    lowTempAlert: "അനുയോജ്യമായ വിള വളർച്ചയ്ക്ക് താപനില വളരെ കുറവാണ്.",
    criticalMoistureAlert: "നിർണായകം: മണ്ണിന്റെ ഈർപ്പം അപകടകരമാംവിധം കുറവാണ്. ഉടനടി ജലസേചനം ആവശ്യം.",
    lowMoistureAlert: "മണ്ണിന്റെ ഈർപ്പം അനുയോജ്യമായ നിലവാരത്തിന് താഴെയാണ്. ഉടൻ ജലസേചനം ആസൂത്രണം ചെയ്യുക.",
    phAlert: "മണ്ണിന്റെ pH അനുയോജ്യമായ പരിധിക്ക് (6.0-7.5) പുറത്താണ്.",
    poorCropAlert: "വിള ആരോഗ്യം മോശമാണ്. ഉടനടി ശ്രദ്ധ ആവശ്യം.",
    moderateCropAlert: "വിള ആരോഗ്യം മിതമാണ്. സൂക്ഷ്മമായി നിരീക്ഷിക്കുക.",
    allNormalAlert: "എല്ലാ പാരാമീറ്ററുകളും അനുയോജ്യമായ പരിധിക്കുള്ളിലാണ്. വിളകൾ ആരോഗ്യകരമാണ്!",
    recommendedAction: "ശുപാർശ ചെയ്യുന്ന നടപടി:"
  },

  te: {
    appTitle: "ఫీల్డ్ లింక్",
    appSubtitle: "అధునాతన వ్యవసాయ మేధస్సు వ్యవస్థ",
    lastUpdated: "చివరిగా అప్‌డేట్ చేయబడింది:",
    farm: "వ్యవసాయ క్షేత్రం",
    loadingText: "వ్యవసాయ డేటా లోడ్ అవుతోంది...",

    currentFieldConditions: "ప్రస్తుత పొలం పరిస్థితులు",
    smartAlerts: "స్మార్ట్ హెచ్చరికలు & సిఫార్సులు",
    cropHealthVisualInsights: "పంట ఆరోగ్య దృశ్య అంతర్దృష్టులు",
    dataTrendsAnalytics: "డేటా ట్రెండ్స్ & అనలిటిక్స్",

    temperature: "ఉష్ణోగ్రత",
    soilMoisture: "మట్టి తేమ",
    phLevel: "pH స్థాయి",
    cropHealth: "పంట ఆరోగ్యం",
    optimal: "అనుకూలమైన:",
    normal: "సాధారణ",
    warning: "హెచ్చరిక",
    alert: "అలర్ట్",

    downloadReport: "రిపోర్ట్ డౌన్‌లోడ్ చేయండి",
    configureAlerts: "అలర్ట్‌లను కాన్ఫిగర్ చేయండి",
    viewAllAlerts: "అన్ని అలర్ట్‌లను చూడండి",
    captureImage: "మొక్క చిత్రాన్ని తీయండి",
    analyzing: "విశ్లేషిస్తోంది...",
    previous: "మునుపటి",
    next: "తదుపరి",

    analysisResults: "విశ్లేషణ ఫలితాలు",
    ndviIndex: "NDVI సూచిక",
    overallHealth: "మొత్తం ఆరోగ్యం",
    chlorophyll: "క్లోరోఫిల్",
    diseaseStatus: "వ్యాధి స్థితి",
    keyInsights: "ముఖ్య అంతర్దృష్టులు",
    healthy: "ఆరోగ్యకరమైన",
    moderate: "మధ్యస్థ",
    poor: "దయనీయ",
    notAnalyzed: "విశ్లేషించబడలేదు",
    getDetailedTreatment: "🩺 వివరణాత్మక చికిత్స ప్రణాళిక పొందండి",
    getCareTips: "🌱 సంరక్షణ చిట్కాలు పొందండి",
    analyzeImage: "మొక్క చిత్రాన్ని విశ్లేషించండి",
    proceedAnalysis: "విశ్లేషణతో కొనసాగండి",
    cancel: "రద్దు చేయండి",

    hours24: "24 గంటలు",
    days7: "7 రోజులు",
    current: "ప్రస్తుత",
    analysisSummary: "విశ్లేషణ సారాంశం",

    smartIndiaHackathon: "స్మార్ట్ ఇండియా హ్యాకథాన్",
    supportContact: "మద్దతు & సంప్రదింపులు",
    systemFeatures: "వ్యవస్థ లక్షణాలు",
    footerDescription: "స్మార్ట్ ఇండియా హ్యాకథాన్ - స్మార్ట్ వ్యవసాయ పర్యవేక్షణ కోసం అభివృద్ధి చేయబడింది. AI-నడిచే అంతర్దృష్టులు మరియు రియల్-టైమ్ పొలం పర్యవేక్షణతో రైతులను శక్తివంతం చేయడం.",
    copyrightText: "© 2025 స్మార్ట్ వ్యవసాయ పర్యవేక్షణ వ్యవస్థ. అధునాతన IoT మరియు AI సాంకేతికతలతో నిర్మించబడింది.",

    realtimeMonitoring: "• రియల్-టైమ్ సెన్సార్ పర్యవేక్షణ",
    multispectralAnalysis: "• మల్టిస్పెక్ట్రల్ పంట విశ్లేషణ",
    smartAlertSystem: "• స్మార్ట్ అలర్ట్ వ్యవస్థ",
    historicalTracking: "• చారిత్రక డేటా ట్రాకింగ్",
    mobileResponsive: "• మొబైల్-రెస్పాన్సివ్ డిజైన్",
    automatedReporting: "• ఆటోమేటెడ్ రిపోర్టింగ్",

    highTempAlert: "అధిక ఉష్ణోగ్రత గుర్తించబడింది. నీడ లేదా అదనపు నీటిపారుదల అందించడాన్ని పరిగణించండి.",
    lowTempAlert: "అనుకూలమైన పంట పెరుగుదలకు ఉష్ణోగ్రత చాలా తక్కువగా ఉంది.",
    criticalMoistureAlert: "క్రిటికల్: మట్టి తేమ ప్రమాదకరంగా తక్కువగా ఉంది. తక్షణ నీటిపారుదల అవసరం.",
    lowMoistureAlert: "మట్టి తేమ అనుకూల స్థాయిల కంటే తక్కువగా ఉంది. త్వరలో నీటిపారుదల ప్రణాళిక చేయండి.",
    phAlert: "మట్టి pH అనుకూల పరిధి (6.0-7.5) వెలుపల ఉంది.",
    poorCropAlert: "పంట ఆరోగ్యం దయనీయంగా ఉంది. తక్షణ దృష్టి అవసరం.",
    moderateCropAlert: "పంట ఆరోగ్యం మధ్యస్థంగా ఉంది. దగ్గరగా పర్యవేక్షించండి.",
    allNormalAlert: "అన్ని పారామీటర్లు అనుకూల పరిధుల్లో ఉన్నాయి. పంటలు ఆరోగ్యంగా ఉన్నాయి!",
    recommendedAction: "సిఫార్సు చేయబడిన చర్య:"
  }
};

export const languageNames: Record<Language, string> = {
  en: "English",
  ta: "தமிழ்",
  ml: "മലയാളം",
  te: "తెలుగు"
};