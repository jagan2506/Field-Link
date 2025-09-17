import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface SensorCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  status: 'normal' | 'warning' | 'error';
  description: string;
}

const SensorCard: React.FC<SensorCardProps> = ({ icon, title, value, status, description }) => {
  const { t } = useLanguage();
  const getStatusColor = () => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getIconColor = () => {
    switch (status) {
      case 'normal': return 'text-green-600';
      case 'warning': return 'text-orange-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className={`bg-white rounded-xl border-2 p-6 hover:shadow-lg transition-all duration-300 ${getStatusColor()}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`${getIconColor()}`}>{icon}</div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          status === 'normal' ? 'bg-green-100 text-green-700' :
          status === 'warning' ? 'bg-orange-100 text-orange-700' :
          'bg-red-100 text-red-700'
        }`}>
          {status === 'normal' ? t.normal : status === 'warning' ? t.warning : t.alert}
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default SensorCard;