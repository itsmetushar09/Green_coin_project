import React from 'react';
import { X, Download, Smartphone, Apple, PlayCircle } from 'lucide-react';

interface AppDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AppDownloadModal: React.FC<AppDownloadModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const features = [
    "📱 Easy device scanning with camera",
    "💰 Real-time Green Coins tracking",
    "🏆 Leaderboards and achievements",
    "🎁 Instant reward redemption",
    "📍 Find nearby kiosks and partners",
    "🔔 Notifications for new challenges"
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Download Green Coins App</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 rounded-2xl w-fit mx-auto mb-4">
              <Smartphone className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Start Earning Green Coins Today!
            </h3>
            <p className="text-gray-600">
              Download our mobile app and turn your old electronics into valuable rewards
            </p>
          </div>

          {/* App Preview */}
          <div className="bg-gray-100 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="w-full h-32 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-white font-bold">Green Coins</span>
                </div>
                <p className="text-sm text-gray-600 text-center">iOS & Android</p>
              </div>
              <div className="space-y-3">
                <div className="bg-emerald-50 p-2 rounded text-center">
                  <div className="text-lg font-bold text-emerald-600">4.8★</div>
                  <div className="text-xs text-gray-600">App Rating</div>
                </div>
                <div className="bg-blue-50 p-2 rounded text-center">
                  <div className="text-lg font-bold text-blue-600">50K+</div>
                  <div className="text-xs text-gray-600">Downloads</div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">App Features:</h4>
            <div className="grid grid-cols-1 gap-2">
              {features.map((feature, index) => (
                <div key={index} className="text-sm text-gray-600">
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Download Buttons */}
          <div className="space-y-3">
            <button className="w-full bg-black text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-3 hover:bg-gray-800 transition-colors">
              <Apple className="h-6 w-6" />
              <div className="text-left">
                <div className="text-xs">Download on the</div>
                <div className="font-semibold">App Store</div>
              </div>
            </button>

            <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-3 hover:bg-green-700 transition-colors">
              <PlayCircle className="h-6 w-6" />
              <div className="text-left">
                <div className="text-xs">Get it on</div>
                <div className="font-semibold">Google Play</div>
              </div>
            </button>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="font-semibold text-emerald-800">Limited Time Offer</span>
            </div>
            <p className="text-sm text-emerald-700">
              Download now and get <strong>100 bonus Green Coins</strong> + exclusive early access to premium features!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppDownloadModal;