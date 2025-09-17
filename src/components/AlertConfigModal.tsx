import React, { useState } from 'react';
import { X, Settings } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface AlertThresholds {
  tempMin: number;
  tempMax: number;
  moistureMin: number;
  moistureMax: number;
  phMin: number;
  phMax: number;
}

interface AlertConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  thresholds: AlertThresholds;
  onSave: (thresholds: AlertThresholds) => void;
}

const AlertConfigModal: React.FC<AlertConfigModalProps> = ({ isOpen, onClose, thresholds, onSave }) => {
  const { t } = useLanguage();
  const [config, setConfig] = useState<AlertThresholds>(thresholds);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">{t.configureAlerts}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.temperature} (°C)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={config.tempMin}
                onChange={(e) => setConfig({...config, tempMin: Number(e.target.value)})}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              />
              <input
                type="number"
                placeholder="Max"
                value={config.tempMax}
                onChange={(e) => setConfig({...config, tempMax: Number(e.target.value)})}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.soilMoisture} (%)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={config.moistureMin}
                onChange={(e) => setConfig({...config, moistureMin: Number(e.target.value)})}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              />
              <input
                type="number"
                placeholder="Max"
                value={config.moistureMax}
                onChange={(e) => setConfig({...config, moistureMax: Number(e.target.value)})}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.phLevel}</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                step="0.1"
                placeholder="Min"
                value={config.phMin}
                onChange={(e) => setConfig({...config, phMin: Number(e.target.value)})}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              />
              <input
                type="number"
                step="0.1"
                placeholder="Max"
                value={config.phMax}
                onChange={(e) => setConfig({...config, phMax: Number(e.target.value)})}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t.save}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertConfigModal;