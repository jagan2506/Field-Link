import React from 'react';
import { Leaf, Clock, User } from 'lucide-react';

interface HeaderProps {
  lastUpdate: Date;
}

const Header: React.FC<HeaderProps> = ({ lastUpdate }) => {
  return (
    <header className="bg-white shadow-md border-b-4 border-green-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Leaf className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Field Link</h1>
              <p className="text-gray-600 text-sm">Advanced Agricultural Intelligence System</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
              <User className="w-4 h-4 text-green-600" />
              <span className="text-green-700 font-medium">Green Valley Farm</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;