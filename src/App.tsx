import React, { useState, useEffect } from 'react';
import { Leaf, Thermometer, Droplets, FlaskConical, Download, Settings, Bell, TrendingUp } from 'lucide-react';
import Header from './components/Header';
import SensorCard from './components/SensorCard';
import CropHealthPanel from './components/CropHealthPanel';
import DataCharts from './components/DataCharts';
import AlertSection from './components/AlertSection';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import AlertConfigModal from './components/AlertConfigModal';
import AlertViewModal from './components/AlertViewModal';
import { generateMockData, SensorData } from './utils/mockData';
import { generatePDF } from './utils/pdfGenerator';
import { useLanguage } from './contexts/LanguageContext';

function App() {
  const { t } = useLanguage();
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [chatBotMessage, setChatBotMessage] = useState<string>('');
  const [chatBotAnalysisData, setChatBotAnalysisData] = useState<any>(null);
  const [shouldOpenChatBot, setShouldOpenChatBot] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertThresholds, setAlertThresholds] = useState({
    tempMin: 15,
    tempMax: 30,
    moistureMin: 30,
    moistureMax: 80,
    phMin: 6.0,
    phMax: 7.5
  });

  useEffect(() => {
    // Initialize with mock data
    setSensorData(generateMockData());
    
    // Simulate real-time updates every 30 seconds (instead of hourly for demo)
    const interval = setInterval(() => {
      setSensorData(generateMockData());
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleDownloadReport = () => {
    if (sensorData) {
      generatePDF(sensorData, t);
    }
  };

  const handleSaveThresholds = (newThresholds: typeof alertThresholds) => {
    setAlertThresholds(newThresholds);
  };

  if (!sensorData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Leaf className="w-8 h-8 text-green-600 animate-pulse" />
          <p className="text-lg text-gray-600">{t.loadingText}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header lastUpdate={lastUpdate} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Real-time Data Section */}
        <section>
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-800">{t.currentFieldConditions}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SensorCard
              icon={<Thermometer className="w-8 h-8" />}
              title={t.temperature}
              value={`${sensorData.temperature}°C`}
              status={sensorData.temperature > 30 ? 'warning' : sensorData.temperature < 15 ? 'error' : 'normal'}
              description={`${t.optimal} 18-28°C`}
            />
            <SensorCard
              icon={<Droplets className="w-8 h-8" />}
              title={t.soilMoisture}
              value={`${sensorData.soilMoisture}%`}
              status={sensorData.soilMoisture < 30 ? 'error' : sensorData.soilMoisture < 50 ? 'warning' : 'normal'}
              description={`${t.optimal} 50-70%`}
            />
            <SensorCard
              icon={<FlaskConical className="w-8 h-8" />}
              title={t.phLevel}
              value={`${sensorData.phLevel}`}
              status={sensorData.phLevel < 6 || sensorData.phLevel > 7.5 ? 'warning' : 'normal'}
              description={`${t.optimal} 6.0-7.5`}
            />
            <SensorCard
              icon={<Leaf className="w-8 h-8" />}
              title={t.cropHealth}
              value={sensorData.cropHealth.status === 'Healthy' ? t.healthy : sensorData.cropHealth.status === 'Moderate' ? t.moderate : t.poor}
              status={sensorData.cropHealth.status === 'Healthy' ? 'normal' : 
                     sensorData.cropHealth.status === 'Moderate' ? 'warning' : 'error'}
              description={`NDVI: ${sensorData.cropHealth.ndvi}`}
            />
          </div>
        </section>

        {/* Alert Section */}
        <AlertSection sensorData={sensorData} />

        {/* Crop Health Visual Panel */}
        <CropHealthPanel 
          cropHealth={sensorData.cropHealth} 
          onOpenChatBot={(message, analysisData) => {
            setChatBotMessage(message);
            setChatBotAnalysisData(analysisData);
            setShouldOpenChatBot(true);
          }}
        />

        {/* Data Visualization */}
        <DataCharts />

        {/* Action Buttons */}
        <section className="flex flex-wrap gap-4 justify-center">
          <button 
            onClick={handleDownloadReport}
            className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>{t.downloadReport}</span>
          </button>
          <button 
            onClick={() => setIsConfigModalOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>{t.configureAlerts}</span>
          </button>
          <button 
            onClick={() => setIsAlertModalOpen(true)}
            className="flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span>{t.viewAllAlerts}</span>
          </button>
        </section>
      </main>

      <Footer />
      <ChatBot 
        initialMessage={chatBotMessage}
        analysisData={chatBotAnalysisData}
        shouldOpen={shouldOpenChatBot}
        onClose={() => {
          setShouldOpenChatBot(false);
          setChatBotMessage('');
          setChatBotAnalysisData(null);
        }}
      />
      
      <AlertConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        thresholds={alertThresholds}
        onSave={handleSaveThresholds}
      />
      
      <AlertViewModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        sensorData={sensorData!}
      />
    </div>
  );
}

export default App;