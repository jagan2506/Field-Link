import React, { useState, useRef } from 'react';
import { Eye, Camera, Zap, ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import { CropHealthData } from '../utils/mockData';
import { useLanguage } from '../contexts/LanguageContext';
import { analyzeImageForDisease } from '../utils/imageAnalysis';

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
  const [pendingImageData, setPendingImageData] = useState<{data: string, index: number} | null>(null);
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
  
  const analyzeImage = async (imageData: string, imageIndex: number) => {
    setIsAnalyzing(true);
    
    try {
      // Analyze the actual captured image
      const analysisResults = await analyzeImageForDisease(imageData);
      
      const remedies = {
        'leaf spot': ['Apply Mancozeb 75% WP @ 2g/L', 'Remove affected leaves', 'Improve air circulation'],
        'blight': ['Spray Copper oxychloride @ 3g/L', 'Apply Metalaxyl + Mancozeb @ 2g/L', 'Ensure proper drainage'],
        'rust': ['Use Propiconazole 25% EC @ 1ml/L', 'Apply Tebuconazole @ 0.1%', 'Avoid overhead irrigation'],
        'powdery mildew': ['Spray Sulfur 80% WP @ 2g/L', 'Apply Carbendazim 50% WP @ 1g/L', 'Reduce humidity']
      };
      
      const finalResults = {
        ...analysisResults,
        urgency: analysisResults.severity === 'Severe' ? 'URGENT' : 
                analysisResults.severity === 'Moderate' ? 'Soon' : 'Monitor',
        remedies: analysisResults.diseaseDetected ? 
                 remedies[analysisResults.diseaseName.toLowerCase() as keyof typeof remedies] || [] : []
      };
      
      setAnalysisResults(prev => ({ ...prev, [imageIndex]: finalResults }));
    } catch (error) {
      console.error('Image analysis failed:', error);
    } finally {
      setIsLoading(false);
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
  
  const handleProceedAnalysis = async () => {
    if (pendingImageData) {
      setShowConfirmDialog(false);
      await analyzeImage(pendingImageData.data, pendingImageData.index);
      setPendingImageData(null);
    }
  };
  
  const handleGetRemedies = () => {
    if (currentAnalysis && onOpenChatBot) {
      const imageData = capturedImages[currentImage] || defaultImages[currentImage].url;
      const analysisData = {
        ndvi: currentAnalysis.ndvi,
        healthStatus: currentAnalysis.healthStatus,
        diseaseDetected: currentAnalysis.diseaseDetected,
        diseaseName: currentAnalysis.diseaseName,
        severity: currentAnalysis.severity,
        chlorophyll: currentAnalysis.chlorophyll,
        confidence: currentAnalysis.confidence,
        remedies: currentAnalysis.remedies || [],
        imageUrl: imageData
      };
      
      const remedyMessage = currentAnalysis.diseaseDetected 
        ? `Disease detected: ${currentAnalysis.diseaseName} with ${currentAnalysis.severity} severity. NDVI: ${currentAnalysis.ndvi}, Confidence: ${currentAnalysis.confidence}%. Please provide detailed treatment remedies, prevention steps, and care instructions for this plant disease.`
        : `Plant appears healthy with NDVI ${currentAnalysis.ndvi}. Please provide maintenance tips and preventive care suggestions to keep the plant healthy.`;
      
      onOpenChatBot(remedyMessage, analysisData);
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Viewer */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-video">
            <img
              src={images[currentImage].url}
              alt={`${images[currentImage].type} analysis`}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg">
              {images[currentImage].type}
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={prevImage}
              className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t.previous}</span>
            </button>
            
            <div className="flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentImage ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={nextImage}
              className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
            >
              <span>{t.next}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="mt-4 flex justify-center">
            <button
              onClick={openCamera}
              disabled={isAnalyzing}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
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
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
            <div className="flex items-center space-x-2 mb-4">
              <Camera className="w-5 h-5 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-800">{t.analysisResults}</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">{t.ndviIndex}</p>
                <p className="text-2xl font-bold text-green-600">
                  {currentAnalysis?.ndvi || cropHealth.ndvi}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">{t.overallHealth}</p>
                <p className={`text-2xl font-bold ${
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
                <p className="text-sm text-gray-600 mb-1">{t.chlorophyll}</p>
                <p className="text-2xl font-bold text-blue-600">
                  {currentAnalysis?.chlorophyll || cropHealth.chlorophyllLevel}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">{t.diseaseStatus}</p>
                <p className={`text-lg font-bold ${
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
            </div>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Zap className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-800">{t.keyInsights}</h4>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              {currentAnalysis ? (
                <>
                  <li>• AI analysis confidence: {currentAnalysis.confidence}%</li>
                  <li>• NDVI value of {currentAnalysis.ndvi} indicates {currentAnalysis.healthStatus.toLowerCase()} condition</li>
                  <li>• {currentAnalysis.diseaseDetected ? `Disease detected: ${currentAnalysis.diseaseName} (${currentAnalysis.severity} severity)` : 'No disease symptoms detected'}</li>
                  <li>• Chlorophyll level: {currentAnalysis.chlorophyll}</li>
                  {currentAnalysis.severity === 'Severe' && (
                    <li className="text-red-600 font-bold">⚠️ URGENT: Severe infection detected! Immediate treatment required within 24-48 hours to prevent crop loss.</li>
                  )}
                  {currentAnalysis.severity === 'Moderate' && (
                    <li className="text-orange-600 font-semibold">⚠️ Treatment needed soon (within 3-5 days) to prevent disease spread.</li>
                  )}
                  {currentAnalysis.severity === 'Mild' && (
                    <li className="text-yellow-600">• Monitor closely and consider preventive treatment.</li>
                  )}
                  {currentAnalysis.diseaseDetected && currentAnalysis.remedies && currentAnalysis.remedies.length > 0 && (
                    <>
                      <li className="font-semibold text-blue-600">Quick Treatment Remedies:</li>
                      {currentAnalysis.remedies.map((remedy: string, index: number) => (
                        <li key={index} className="ml-4">• {remedy}</li>
                      ))}
                    </>
                  )}
                </>
              ) : (
                <>
                  <li>• Multispectral analysis shows good vegetation coverage</li>
                  <li>• NDVI values indicate {cropHealth.status.toLowerCase()} crop condition</li>
                  <li>• Chlorophyll levels are within expected range</li>
                  <li>• Capture plant image for detailed AI analysis</li>
                </>
              )}
            </ul>
          </div>
          
          {/* Get Detailed Remedies Button */}
          {currentAnalysis && (
            <div className="mt-6 text-center">
              <button
                onClick={handleGetRemedies}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  currentAnalysis.diseaseDetected 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {currentAnalysis.diseaseDetected 
                  ? t.getDetailedTreatment
                  : t.getCareTips
                }
              </button>
              <p className="text-sm text-gray-600 mt-2">
                {currentAnalysis.diseaseDetected 
                  ? 'Get AI-powered treatment recommendations and step-by-step care instructions'
                  : 'Get personalized care tips to maintain optimal plant health'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CropHealthPanel;