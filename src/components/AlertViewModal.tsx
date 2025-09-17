import React from 'react';
import { X, AlertTriangle, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { SensorData } from '../utils/mockData';

interface Alert {
  id: string;
  type: 'error' | 'warning' | 'success';
  message: string;
  timestamp: Date;
  sensor: string;
}

interface AlertViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  sensorData: SensorData;
}

const AlertViewModal: React.FC<AlertViewModalProps> = ({ isOpen, onClose, sensorData }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const generateAllAlerts = (): Alert[] => {
    const alerts: Alert[] = [];
    const now = new Date();

    // Temperature alerts
    if (sensorData.temperature > 30) {
      alerts.push({
        id: 'temp-high',
        type: 'warning',
        message: t.highTempAlert,
        timestamp: new Date(now.getTime() - Math.random() * 3600000),
        sensor: t.temperature
      });
    } else if (sensorData.temperature < 15) {
      alerts.push({
        id: 'temp-low',
        type: 'error',
        message: t.lowTempAlert,
        timestamp: new Date(now.getTime() - Math.random() * 3600000),
        sensor: t.temperature
      });
    }

    // Moisture alerts
    if (sensorData.soilMoisture < 30) {
      alerts.push({
        id: 'moisture-critical',
        type: 'error',
        message: t.criticalMoistureAlert,
        timestamp: new Date(now.getTime() - Math.random() * 1800000),
        sensor: t.soilMoisture
      });
    } else if (sensorData.soilMoisture < 50) {
      alerts.push({
        id: 'moisture-low',
        type: 'warning',
        message: t.lowMoistureAlert,
        timestamp: new Date(now.getTime() - Math.random() * 3600000),
        sensor: t.soilMoisture
      });
    }

    // pH alerts
    if (sensorData.phLevel < 6 || sensorData.phLevel > 7.5) {
      alerts.push({
        id: 'ph-range',
        type: 'warning',
        message: `${t.phAlert} (${sensorData.phLevel})`,
        timestamp: new Date(now.getTime() - Math.random() * 7200000),
        sensor: t.phLevel
      });
    }

    // Crop health alerts
    if (sensorData.cropHealth.status === 'Poor') {
      alerts.push({
        id: 'crop-poor',
        type: 'error',
        message: `${t.poorCropAlert} (NDVI: ${sensorData.cropHealth.ndvi})`,
        timestamp: new Date(now.getTime() - Math.random() * 1800000),
        sensor: t.cropHealth
      });
    } else if (sensorData.cropHealth.status === 'Moderate') {
      alerts.push({
        id: 'crop-moderate',
        type: 'warning',
        message: `${t.moderateCropAlert} (NDVI: ${sensorData.cropHealth.ndvi})`,
        timestamp: new Date(now.getTime() - Math.random() * 3600000),
        sensor: t.cropHealth
      });
    }

    // Add some historical alerts
    alerts.push({
      id: 'system-check',
      type: 'success',
      message: 'System health check completed successfully',
      timestamp: new Date(now.getTime() - 7200000),
      sensor: 'System'
    });

    return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const alerts = generateAllAlerts();

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getAlertBg = (type: string) => {
    switch (type) {
      case 'error': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-orange-50 border-orange-200';
      case 'success': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{t.viewAllAlerts}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[60vh] space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
              <p>{t.allNormalAlert}</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`border rounded-lg p-4 ${getAlertBg(alert.type)}`}
              >
                <div className="flex items-start space-x-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-600">{alert.sensor}</span>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{alert.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-800">{alert.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 pt-4 border-t">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertViewModal;