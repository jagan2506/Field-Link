import React, { useState } from 'react';
import { BarChart3, Calendar, TrendingUp } from 'lucide-react';
import { generateHistoricalData } from '../utils/mockData';

const DataCharts: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d'>('24h');
  const historicalData = generateHistoricalData(timeRange);

  const chartData = {
    '24h': {
      labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      datasets: historicalData
    },
    '7d': {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: historicalData
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Data Trends & Analytics</h2>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('24h')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              timeRange === '24h'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            24 Hours
          </button>
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              timeRange === '7d'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            7 Days
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Temperature Chart */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <h3 className="font-semibold text-gray-800">Temperature (°C)</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Current</span>
              <span className="font-medium">{historicalData.temperature[historicalData.temperature.length - 1]}°C</span>
            </div>
            <div className="h-32 bg-white rounded relative overflow-hidden">
              <div className="absolute inset-0 flex items-end justify-around p-2">
                {historicalData.temperature.slice(-8).map((value, index) => (
                  <div
                    key={index}
                    className="bg-red-400 w-4 rounded-t transition-all duration-300 hover:bg-red-500"
                    style={{ height: `${(value / 40) * 100}%` }}
                    title={`${value}°C`}
                  ></div>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-green-600 font-medium">+2.3°C from yesterday</span>
            </div>
          </div>
        </div>
        
        {/* Soil Moisture Chart */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <h3 className="font-semibold text-gray-800">Soil Moisture (%)</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Current</span>
              <span className="font-medium">{historicalData.soilMoisture[historicalData.soilMoisture.length - 1]}%</span>
            </div>
            <div className="h-32 bg-white rounded relative overflow-hidden">
              <div className="absolute inset-0 flex items-end justify-around p-2">
                {historicalData.soilMoisture.slice(-8).map((value, index) => (
                  <div
                    key={index}
                    className="bg-blue-400 w-4 rounded-t transition-all duration-300 hover:bg-blue-500"
                    style={{ height: `${value}%` }}
                    title={`${value}%`}
                  ></div>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />
              <span className="text-red-600 font-medium">-5.2% from yesterday</span>
            </div>
          </div>
        </div>
        
        {/* pH Level Chart */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <h3 className="font-semibold text-gray-800">pH Level</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Current</span>
              <span className="font-medium">{historicalData.phLevel[historicalData.phLevel.length - 1]}</span>
            </div>
            <div className="h-32 bg-white rounded relative overflow-hidden">
              <div className="absolute inset-0 flex items-end justify-around p-2">
                {historicalData.phLevel.slice(-8).map((value, index) => (
                  <div
                    key={index}
                    className="bg-green-400 w-4 rounded-t transition-all duration-300 hover:bg-green-500"
                    style={{ height: `${(value / 14) * 100}%` }}
                    title={`${value}`}
                  ></div>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="text-gray-600 font-medium">Stable over time</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">Analysis Summary</h4>
        <p className="text-sm text-gray-600">
          Over the last {timeRange === '24h' ? '24 hours' : '7 days'}, soil moisture has decreased while temperature has increased. 
          pH levels remain stable. Consider irrigation to maintain optimal growing conditions.
        </p>
      </div>
    </section>
  );
};

export default DataCharts;