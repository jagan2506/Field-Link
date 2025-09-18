import React, { useState, useRef } from 'react';
import { Eye, Camera, Zap, ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import { CropHealthData } from '../utils/mockData';
import { useLanguage } from '../contexts/LanguageContext';
import { analyzeImageWithGemini } from '../utils/geminiImageAnalysis';

interface CropHealthPanelProps {
  cropHealth: CropHealthData;
  onOpenChatBot?: (message: string) => void;
}

const CropHealthPanel: React.FC<CropHealthPanelProps> = ({ cropHealth, onOpenChatBot }) => {
  const { t } = useLanguage();
  const [currentImage, setCurrentImage] = useState(0);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [analysisResults, setAnalysisResults] = useState<{[key: number]: any}>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [pendingImageData, setPendingImageData] = useState<{data: string, index: number} | null>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const defaultImages = [
    { type: 'RGB', url: 'https://tse3.mm.bing.net/th/id/OIP.Mrr5l5w2inczfQ9Ue-MRjQHaE7?pid=Api&P=0&h=180' },
    { type: 'NDVI', url: 'https://debraleebaldwin.com/wp-content/uploads/00-Wind-9.20.20-1.20.21_R-768x510.jpg' },
    { type: 'False Color', url: 'https://tse3.mm.bing.net/th/id/OIP.dxFqZ8_tERZT9dnpyNblRgHaE8?pid=Api&P=0&h=180' }
  ];
  
  const images = capturedImages.length > 0 
    ? capturedImages.map((url, index) => ({ type: `Captured ${index + 1}`, url }))
    : defaultImages;
    
  const currentAnalysis = analysisResults[currentImage];

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  
  const analyzeImage = async (imageData: string, imageIndex: number, selectedLang: string) => {
    setIsAnalyzing(true);
    
    try {
      // Analyze image using Gemini API
      const geminiResults = await analyzeImageWithGemini(imageData, selectedLang);
      
      // Process Gemini results
      const primaryDisease = geminiResults.diseases && geminiResults.diseases.length > 0 
        ? geminiResults.diseases[0] 
        : null;
      
      const finalResults = {
        diseaseDetected: geminiResults.diseaseDetected,
        diseaseName: primaryDisease ? primaryDisease.name : 'Healthy',
        severity: primaryDisease ? primaryDisease.severity : 'None',
        confidence: geminiResults.overallConfidence || '85',
        healthStatus: geminiResults.healthStatus,
        diseases: geminiResults.diseases || [],
        symptoms: primaryDisease ? primaryDisease.symptoms : [],
        remedies: primaryDisease ? primaryDisease.remedies : geminiResults.recommendations || [],
        allDiseases: geminiResults.diseases || [],
        recommendations: geminiResults.recommendations || []
      };
      
      setAnalysisResults(prev => ({ ...prev, [imageIndex]: finalResults }));
      
      // Auto-open ChatBot with comprehensive analysis
      if (onOpenChatBot) {
        const analysisData = {
          ...finalResults,
          imageUrl: imageData,
          imageBase64: imageData,
          pageLanguage: selectedLang
        };
        
        const remedyMessage = finalResults.diseaseDetected 
          ? `Multiple diseases detected in plant image. Primary: ${finalResults.diseaseName} at ${finalResults.severity} stage. Provide comprehensive treatment plan for all detected diseases.`
          : `Healthy plant detected. Provide preventive care and maintenance recommendations.`;
        
        onOpenChatBot(remedyMessage, analysisData);
      }
    } catch (error) {
      console.error('Gemini image analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleImageCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        const newIndex = capturedImages.length;
        setCapturedImages(prev => [...prev, imageData]);
        setCurrentImage(newIndex);
        setPendingImageData({ data: imageData, index: newIndex });
        setShowConfirmDialog(true);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleProceedAnalysis = () => {
    setShowConfirmDialog(false);
    setShowLanguageDialog(true);
  };
  
  const handleAnalysisWithLanguage = async (selectedLang: string) => {
    setShowLanguageDialog(false);
    
    if (pendingImageData) {
      await analyzeImage(pendingImageData.data, pendingImageData.index, selectedLang);
      setPendingImageData(null);
    }
  };
  

  
  const handleCancelAnalysis = () => {
    if (pendingImageData) {
      setCapturedImages(prev => prev.slice(0, -1));
      setCurrentImage(prev => Math.max(0, prev - 1));
    }
    setShowConfirmDialog(false);
    setPendingImageData(null);
  };
  
  const openCamera = () => {
    fileInputRef.current?.click();
  };

  return (
    <section className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center space-x-2 mb-6">
        <Eye className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">{t.cropHealthVisualInsights}</h2>
      </div>
      
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t.analyzeImage}</h3>
            <p className="text-gray-600 mb-6">
              Would you like to proceed with AI analysis to detect diseases and health conditions for this plant image?
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={handleCancelAnalysis}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleProceedAnalysis}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {t.proceedAnalysis}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Language Selection Dialog */}
      {showLanguageDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 lg:p-6 w-full max-w-sm lg:max-w-md">
            <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-3 lg:mb-4">Select Language for Voice Remedy</h3>
            <p className="text-sm lg:text-base text-gray-600 mb-4 lg:mb-6">
              Choose your preferred language for voice explanation:
            </p>
            <div className="grid grid-cols-2 gap-2 lg:gap-3 mb-4 lg:mb-6">
              <button
                onClick={() => handleAnalysisWithLanguage('english')}
                className="p-2 lg:p-3 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm lg:text-base"
              >
                English
              </button>
              <button
                onClick={() => handleAnalysisWithLanguage('tamil')}
                className="p-2 lg:p-3 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm lg:text-base"
              >
                தமிழ்
              </button>
              <button
                onClick={() => handleAnalysisWithLanguage('malayalam')}
                className="p-2 lg:p-3 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm lg:text-base"
              >
                മലയാളം
              </button>
              <button
                onClick={() => handleAnalysisWithLanguage('telugu')}
                className="p-2 lg:p-3 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm lg:text-base"
              >
                తెలుగు
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 lg:gap-8">
        {/* Image Viewer */}
        <div className="relative order-1">
          <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-video">
            <img
              src={images[currentImage].url}
              alt={`${images[currentImage].type} analysis`}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute top-2 left-2 lg:top-4 lg:left-4 bg-black bg-opacity-70 text-white px-2 py-1 lg:px-3 lg:py-1 rounded text-xs lg:text-sm">
              {images[currentImage].type}
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-2 lg:mt-4">
            <button
              onClick={prevImage}
              className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 px-2 py-1 lg:px-3 lg:py-2 rounded-lg transition-colors text-xs lg:text-sm"
            >
              <ChevronLeft className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="hidden sm:inline">{t.previous}</span>
            </button>
            
            <div className="flex space-x-1 lg:space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full transition-colors ${
                    index === currentImage ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={nextImage}
              className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 px-2 py-1 lg:px-3 lg:py-2 rounded-lg transition-colors text-xs lg:text-sm"
            >
              <span className="hidden sm:inline">{t.next}</span>
              <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4" />
            </button>
          </div>
          
          <div className="mt-2 lg:mt-4 flex justify-center">
            <button
              onClick={openCamera}
              disabled={isAnalyzing}
              className="flex items-center space-x-2 bg-green-600 text-white px-3 py-2 lg:px-4 lg:py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 text-sm lg:text-base"
            >
              <Camera className="w-4 h-4" />
              <span>{isAnalyzing ? t.analyzing : t.captureImage}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageCapture}
              className="hidden"
            />
          </div>
        </div>
        
        {/* Analysis Results */}
        <div className="space-y-4 lg:space-y-6 order-2">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 lg:p-6 rounded-lg">
            <div className="flex items-center space-x-2 mb-3 lg:mb-4">
              <Camera className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
              <h3 className="text-lg lg:text-xl font-semibold text-gray-800">{t.analysisResults}</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-2 lg:gap-4">
              <div className="text-center">
                <p className="text-xs lg:text-sm text-gray-600 mb-1">{t.overallHealth}</p>
                <p className={`text-lg lg:text-2xl font-bold ${
                  (currentAnalysis?.healthStatus || cropHealth.status) === 'Healthy' ? 'text-green-600' :
                  (currentAnalysis?.healthStatus || cropHealth.status) === 'Moderate' ? 'text-orange-600' : 'text-red-600'
                }`}>
                  {currentAnalysis?.healthStatus === 'Healthy' ? t.healthy : 
                   currentAnalysis?.healthStatus === 'Moderate' ? t.moderate : 
                   currentAnalysis?.healthStatus === 'Poor' ? t.poor : 
                   cropHealth.status === 'Healthy' ? t.healthy : 
                   cropHealth.status === 'Moderate' ? t.moderate : t.poor}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs lg:text-sm text-gray-600 mb-1">{t.diseaseStatus}</p>
                <p className={`text-sm lg:text-lg font-bold ${
                  (currentAnalysis?.healthStatus || cropHealth.status) === 'Healthy' ? 'text-green-600' :
                  (currentAnalysis?.healthStatus || cropHealth.status) === 'Moderate' ? 'text-orange-600' : 'text-red-600'
                }`}>
                  {currentAnalysis?.diseaseName || (cropHealth.status === 'Healthy' ? t.healthy : t.moderate)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 lg:p-6 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Zap className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
              <h4 className="text-sm lg:text-base font-semibold text-gray-800">{t.keyInsights}</h4>
            </div>
            <ul className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-700">
              {currentAnalysis ? (
                <>
                  <li>• AI confidence: {currentAnalysis.confidence}%</li>
                  <li>• {currentAnalysis.diseaseDetected ? `Disease: ${currentAnalysis.diseaseName} (${currentAnalysis.severity})` : 'No disease detected'}</li>
                  <li>• Health status: {currentAnalysis.healthStatus}</li>
                  {currentAnalysis.severity === 'Advanced' && (
                    <li className="text-red-600 font-bold text-xs lg:text-sm">⚠️ URGENT: Advanced infection! Immediate treatment required.</li>
                  )}
                  {currentAnalysis.severity === 'Moderate' && (
                    <li className="text-orange-600 font-semibold text-xs lg:text-sm">⚠️ Treatment needed within 3-5 days.</li>
                  )}
                  {currentAnalysis.severity === 'Early Stage' && (
                    <li className="text-yellow-600 text-xs lg:text-sm">• Early stage detected - preventive treatment recommended.</li>
                  )}
                  {currentAnalysis.diseaseDetected && currentAnalysis.remedies && currentAnalysis.remedies.length > 0 && (
                    <>
                      <li className="font-semibold text-blue-600 text-xs lg:text-sm mt-2">Treatment Remedies:</li>
                      {currentAnalysis.remedies.slice(0, 3).map((remedy: string, index: number) => (
                        <li key={index} className="ml-2 lg:ml-4 text-xs lg:text-sm">• {remedy}</li>
                      ))}
                    </>
                  )}
                </>
              ) :
                 
                <>
                  <li>• Multispectral analysis available</li>
                  <li>• Current status: {cropHealth.status.toLowerCase()}</li>
                  <li>• Capture image for AI analysis</li>
                </>
              )}
            </ul>
          </div>
,../,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,/        </div>
      </div>
    </section>
  );
};

export default CropHealthPanel;