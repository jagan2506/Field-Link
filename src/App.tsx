import React, { useState, useEffect } from 'react';
import { Leaf, Thermometer, Droplets, FlaskConical, Download, Settings, Bell, TrendingUp } from 'lucide-react';
import Header from './components/Header';
import SensorCard from './components/SensorCard';
import CropHealthPanel from './components/CropHealthPanel';
import DataCharts from './components/DataCharts';
import AlertSection from './components/AlertSection';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import { generateMockData, SensorData } from './utils/mockData';

function App() {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

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

  if (!sensorData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Leaf className="w-8 h-8 text-green-600 animate-pulse" />
          <p className="text-lg text-gray-600">Loading farm data...</p>
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
            <h2 className="text-2xl font-bold text-gray-800">Current Field Conditions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SensorCard
              icon={<Thermometer className="w-8 h-8" />}
              title="Temperature"
              value={`${sensorData.temperature}°C`}
              status={sensorData.temperature > 30 ? 'warning' : sensorData.temperature < 15 ? 'error' : 'normal'}
              description="Optimal: 18-28°C"
            />
            <SensorCard
              icon={<Droplets className="w-8 h-8" />}
              title="Soil Moisture"
              value={`${sensorData.soilMoisture}%`}
              status={sensorData.soilMoisture < 30 ? 'error' : sensorData.soilMoisture < 50 ? 'warning' : 'normal'}
              description="Optimal: 50-70%"
            />
            <SensorCard
              icon={<FlaskConical className="w-8 h-8" />}
              title="pH Level"
              value={`${sensorData.phLevel}`}
              status={sensorData.phLevel < 6 || sensorData.phLevel > 7.5 ? 'warning' : 'normal'}
              description="Optimal: 6.0-7.5"
            />
            <SensorCard
              icon={<Leaf className="w-8 h-8" />}
              title="Crop Health"
              value={sensorData.cropHealth.status}
              status={sensorData.cropHealth.status === 'Healthy' ? 'normal' : 
                     sensorData.cropHealth.status === 'Moderate' ? 'warning' : 'error'}
              description={`NDVI: ${sensorData.cropHealth.ndvi}`}
            />
          </div>
        </section>

        {/* Alert Section */}
        <AlertSection sensorData={sensorData} />

        {/* Crop Health Visual Panel */}
        <CropHealthPanel cropHealth={sensorData.cropHealth} />

        {/* Data Visualization */}
        <DataCharts />

        {/* Action Buttons */}
        <section className="flex flex-wrap gap-4 justify-center">
          <button className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            <Download className="w-5 h-5" />
            <span>Download Report</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            <Settings className="w-5 h-5" />
            <span>Configure Alerts</span>
          </button>
          <button className="flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors">
            <Bell className="w-5 h-5" />
            <span>View All Alerts</span>
          </button>
        </section>
      </main>

      <Footer />
      <ChatBot />
    </div>
  );
}

export default App;