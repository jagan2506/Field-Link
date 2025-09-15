import React from 'react';
import { AlertTriangle, Info, CheckCircle, AlertCircle } from 'lucide-react';
import { SensorData } from '../utils/mockData';

interface AlertSectionProps {
  sensorData: SensorData;
}

const AlertSection: React.FC<AlertSectionProps> = ({ sensorData }) => {
  const generateAlerts = () => {
    const alerts = [];
    
    // Temperature alerts
    if (sensorData.temperature > 30) {
      alerts.push({
        type: 'warning',
        icon: <AlertTriangle className="w-5 h-5" />,
        message: 'High temperature detected. Consider providing shade or additional irrigation.',
        action: 'Monitor temperature closely and ensure adequate water supply.'
      });
    } else if (sensorData.temperature < 15) {
      alerts.push({
        type: 'error',
        icon: <AlertCircle className="w-5 h-5" />,
        message: 'Temperature is too low for optimal crop growth.',
        action: 'Consider frost protection measures if temperature continues to drop.'
      });
    }
    
    // Soil moisture alerts
    if (sensorData.soilMoisture < 30) {
      alerts.push({
        type: 'error',
        icon: <AlertCircle className="w-5 h-5" />,
        message: 'Critical: Soil moisture is dangerously low. Immediate irrigation required.',
        action: 'Start irrigation system immediately to prevent crop stress.'
      });
    } else if (sensorData.soilMoisture < 50) {
      alerts.push({
        type: 'warning',
        icon: <AlertTriangle className="w-5 h-5" />,
        message: 'Soil moisture is below optimal levels. Plan irrigation soon.',
        action: 'Schedule irrigation within the next 6-12 hours.'
      });
    }
    
    // pH alerts
    if (sensorData.phLevel < 6 || sensorData.phLevel > 7.5) {
      alerts.push({
        type: 'warning',
        icon: <AlertTriangle className="w-5 h-5" />,
        message: `Soil pH (${sensorData.phLevel}) is outside optimal range (6.0-7.5).`,
        action: 'Consider soil amendment to adjust pH levels for better nutrient uptake.'
      });
    }
    
    // Crop health alerts
    if (sensorData.cropHealth.status === 'Poor') {
      alerts.push({
        type: 'error',
        icon: <AlertCircle className="w-5 h-5" />,
        message: `Crop health is poor (NDVI: ${sensorData.cropHealth.ndvi}). Immediate attention required.`,
        action: 'Investigate potential diseases, pests, or nutrient deficiencies.'
      });
    } else if (sensorData.cropHealth.status === 'Moderate') {
      alerts.push({
        type: 'warning',
        icon: <AlertTriangle className="w-5 h-5" />,
        message: `Crop health is moderate (NDVI: ${sensorData.cropHealth.ndvi}). Monitor closely.`,
        action: 'Consider nutrient supplementation or pest management strategies.'
      });
    }
    
    // If no alerts, show success message
    if (alerts.length === 0) {
      alerts.push({
        type: 'success',
        icon: <CheckCircle className="w-5 h-5" />,
        message: 'All parameters are within optimal ranges. Crops are healthy!',
        action: 'Continue current management practices.'
      });
    }
    
    return alerts;
  };

  const alerts = generateAlerts();

  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-red-600';
      case 'warning': return 'text-orange-600';
      case 'success': return 'text-green-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center space-x-2 mb-6">
        <Info className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Smart Alerts & Recommendations</h2>
      </div>
      
      <div className="space-y-4">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`border-2 rounded-lg p-6 transition-all duration-300 hover:shadow-md ${getAlertStyle(alert.type)}`}
          >
            <div className="flex items-start space-x-4">
              <div className={`${getIconColor(alert.type)} mt-1`}>
                {alert.icon}
              </div>
              <div className="flex-1">
                <p className="font-semibold mb-2">{alert.message}</p>
                <div className="flex items-start space-x-2">
                  <span className="text-sm font-medium">Recommended Action:</span>
                  <p className="text-sm flex-1">{alert.action}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AlertSection;