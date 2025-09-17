import React from 'react';
import { Mail, Phone, MapPin, Award } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-gray-800 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Project Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Award className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-bold">{t.smartIndiaHackathon}</h3>
            </div>
            <p className="text-gray-300 mb-4">
              {t.footerDescription}
            </p>
            <div className="flex space-x-4">
              <div className="bg-green-100 px-3 py-1 rounded-full">
                <span className="text-green-700 text-sm font-medium">IoT Sensors</span>
              </div>
              <div className="bg-blue-100 px-3 py-1 rounded-full">
                <span className="text-blue-700 text-sm font-medium">AI Analysis</span>
              </div>
            </div>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t.supportContact}</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">support@fieldlink.agriculture</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">+91 90424 36256</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Rooted Harvest  Hub, India</span>
              </div>
            </div>
          </div>
          
          {/* Features */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t.systemFeatures}</h3>
            <ul className="space-y-2 text-gray-300">
              <li>{t.realtimeMonitoring}</li>
              <li>{t.multispectralAnalysis}</li>
              <li>{t.smartAlertSystem}</li>
              <li>{t.historicalTracking}</li>
              <li>{t.mobileResponsive}</li>
              <li>{t.automatedReporting}</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            {t.copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;