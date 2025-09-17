import React, { useState, useRef } from 'react';
import { Eye, Camera, Zap, ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import { CropHealthData } from '../utils/mockData';

interface CropHealthPanelProps {
  cropHealth: CropHealthData;
}

const CropHealthPanel: React.FC<CropHealthPanelProps> = ({ cropHealth }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [analysisResults, setAnalysisResults] = useState<{[key: number]: any}>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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
    
    // Simulate multispectral analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate more realistic analysis based on image content simulation
    const greenPixels = Math.random(); // Simulate green pixel analysis
    const leafHealth = greenPixels > 0.6 ? 'Healthy' : greenPixels > 0.3 ? 'Moderate' : 'Poor';
    const diseaseProb = leafHealth === 'Poor' ? 0.8 : leafHealth === 'Moderate' ? 0.4 : 0.1;
    
    const diseaseDetected = Math.random() < diseaseProb;
    const diseases = ['Leaf Spot', 'Blight', 'Rust', 'Powdery Mildew'];
    const selectedDisease = diseases[Math.floor(Math.random() * diseases.length)];
    const severity = leafHealth === 'Poor' && diseaseDetected ? (Math.random() > 0.5 ? 'Severe' : 'Moderate') : 
                     leafHealth === 'Moderate' && diseaseDetected ? 'Mild' : 'None';
    
    const mockResults = {
      ndvi: leafHealth === 'Healthy' ? (0.7 + Math.random() * 0.2).toFixed(2) : 
            leafHealth === 'Moderate' ? (0.4 + Math.random() * 0.3).toFixed(2) : 
            (0.2 + Math.random() * 0.2).toFixed(2),
      diseaseDetected,
      diseaseName: diseaseDetected ? selectedDisease : 'Healthy',
      severity,
      confidence: (Math.random() * 20 + 80).toFixed(1), // 80-100%
      chlorophyll: leafHealth === 'Healthy' ? 'High' : leafHealth === 'Moderate' ? 'Medium' : 'Low',
      healthStatus: leafHealth,
      urgency: severity === 'Severe' ? 'URGENT' : severity === 'Moderate' ? 'Soon' : 'Monitor'
    };
    
    setAnalysisResults(prev => ({ ...prev, [imageIndex]: mockResults }));
    setIsAnalyzing(false);
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
        analyzeImage(imageData, newIndex);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const openCamera = () => {
    fileInputRef.current?.click();
  };

  return (
    <section className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center space-x-2 mb-6">
        <Eye className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Crop Health Visual Insights</h2>
      </div>
      
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
              <span>Previous</span>
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
              <span>Next</span>
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
              <span>{isAnalyzing ? 'Analyzing...' : 'Capture Plant Image'}</span>
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
              <h3 className="text-xl font-semibold text-gray-800">Analysis Results</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">NDVI Index</p>
                <p className="text-2xl font-bold text-green-600">
                  {currentAnalysis?.ndvi || cropHealth.ndvi}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Overall Health</p>
                <p className={`text-2xl font-bold ${
                  (currentAnalysis?.healthStatus || cropHealth.status) === 'Healthy' ? 'text-green-600' :
                  (currentAnalysis?.healthStatus || cropHealth.status) === 'Moderate' ? 'text-orange-600' : 'text-red-600'
                }`}>
                  {currentAnalysis?.healthStatus || cropHealth.status}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Chlorophyll</p>
                <p className="text-2xl font-bold text-blue-600">
                  {currentAnalysis?.chlorophyll || cropHealth.chlorophyllLevel}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Disease Status</p>
                <p className={`text-lg font-bold ${
                  currentAnalysis?.severity === 'Severe' ? 'text-red-600' :
                  currentAnalysis?.severity === 'Moderate' ? 'text-orange-600' :
                  currentAnalysis?.diseaseDetected ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {currentAnalysis ? (currentAnalysis.diseaseDetected ? `${currentAnalysis.diseaseName} (${currentAnalysis.severity})` : 'Healthy') : 'Not Analyzed'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Zap className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-800">Key Insights</h4>
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
                  {currentAnalysis.diseaseDetected && currentAnalysis.severity !== 'Mild' && (
                    <li>• Recommended action: {currentAnalysis.urgency === 'URGENT' ? 'Apply fungicide immediately, isolate affected plants' : 'Schedule treatment application, increase monitoring frequency'}</li>
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
        </div>
      </div>
    </section>
  );
};

export default CropHealthPanel;