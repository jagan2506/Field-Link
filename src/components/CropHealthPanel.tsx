import React, { useState } from 'react';
import { Eye, Camera, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { CropHealthData } from '../utils/mockData';

interface CropHealthPanelProps {
  cropHealth: CropHealthData;
}

const CropHealthPanel: React.FC<CropHealthPanelProps> = ({ cropHealth }) => {
  const [currentImage, setCurrentImage] = useState(0);
  
  const images = [
    { type: 'RGB', url: 'https://tse3.mm.bing.net/th/id/OIP.Mrr5l5w2inczfQ9Ue-MRjQHaE7?pid=Api&P=0&h=180' },
    { type: 'NDVI', url: 'https://debraleebaldwin.com/wp-content/uploads/00-Wind-9.20.20-1.20.21_R-768x510.jpg' },
    { type: 'False Color', url: 'https://tse3.mm.bing.net/th/id/OIP.dxFqZ8_tERZT9dnpyNblRgHaE8?pid=Api&P=0&h=180' }
  ];

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

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
                <p className="text-2xl font-bold text-green-600">{cropHealth.ndvi}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Overall Health</p>
                <p className={`text-2xl font-bold ${
                  cropHealth.status === 'Healthy' ? 'text-green-600' :
                  cropHealth.status === 'Moderate' ? 'text-orange-600' : 'text-red-600'
                }`}>
                  {cropHealth.status}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Chlorophyll</p>
                <p className="text-2xl font-bold text-blue-600">{cropHealth.chlorophyllLevel}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Coverage</p>
                <p className="text-2xl font-bold text-purple-600">{cropHealth.coverage}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Zap className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-800">Key Insights</h4>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Multispectral analysis shows good vegetation coverage</li>
              <li>• NDVI values indicate {cropHealth.status.toLowerCase()} crop condition</li>
              <li>• Chlorophyll levels are within expected range</li>
              <li>• Consider monitoring stress patterns in lower NDVI areas</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CropHealthPanel;