import React from 'react';
import { Mail, Phone, MapPin, Award } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Project Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Award className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-bold">Smart India Hackathon</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Developed for Smart India Hackathon - Smart Agriculture Monitoring. 
              Empowering farmers with AI-driven insights and real-time field monitoring.
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
            <h3 className="text-xl font-bold mb-4">Support & Contact</h3>
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
            <h3 className="text-xl font-bold mb-4">System Features</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Real-time sensor monitoring</li>
              <li>• Multispectral crop analysis</li>
              <li>• Smart alert system</li>
              <li>• Historical data tracking</li>
              <li>• Mobile-responsive design</li>
              <li>• Automated reporting</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 Smart Agriculture Monitoring System. Built with advanced IoT and AI technologies.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;