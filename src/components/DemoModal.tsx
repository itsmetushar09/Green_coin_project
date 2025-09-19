import React from 'react';
import { X, Play, Smartphone, QrCode, Coins, Gift } from 'lucide-react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const demoSteps = [
    {
      icon: Smartphone,
      title: "Drop Your Device",
      description: "Visit any Green Coins kiosk or partner store and drop off your old electronics",
      video: "Step 1: Device drop-off process"
    },
    {
      icon: QrCode,
      title: "Smart Scanning",
      description: "Our AI-powered system scans, weighs, and evaluates your device automatically",
      video: "Step 2: Automated device scanning"
    },
    {
      icon: Coins,
      title: "Earn Green Coins",
      description: "Instantly receive Green Coins based on device type, condition, and environmental impact",
      video: "Step 3: Coin crediting process"
    },
    {
      icon: Gift,
      title: "Redeem Rewards",
      description: "Use your coins for OTT subscriptions, metro cards, EV charging, and more",
      video: "Step 4: Reward redemption"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">How Green Coins Works</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Main Demo Video */}
          <div className="bg-gray-900 rounded-xl mb-8 relative overflow-hidden">
            <div className="aspect-video flex items-center justify-center">
              <div className="text-center text-white">
                <Play className="h-16 w-16 mx-auto mb-4 opacity-80" />
                <h3 className="text-xl font-semibold mb-2">Green Coins Platform Demo</h3>
                <p className="text-gray-300">Complete walkthrough of the recycling process</p>
              </div>
            </div>
            <button className="absolute inset-0 bg-black bg-opacity-20 hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
              <div className="bg-emerald-500 p-4 rounded-full hover:bg-emerald-600 transition-colors">
                <Play className="h-8 w-8 text-white" />
              </div>
            </button>
          </div>

          {/* Step-by-step breakdown */}
          <div className="grid md:grid-cols-2 gap-6">
            {demoSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="bg-gray-50 p-6 rounded-xl">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-emerald-500 p-2 rounded-lg">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900">{step.title}</h4>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  
                  <div className="bg-gray-200 rounded-lg p-4 text-center">
                    <Play className="h-8 w-8 mx-auto mb-2 text-gray-500" />
                    <p className="text-sm text-gray-600">{step.video}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 bg-gradient-to-r from-emerald-500 to-teal-600 p-6 rounded-xl text-white">
            <h3 className="text-xl font-bold mb-2">Ready to Get Started?</h3>
            <p className="mb-4">Join thousands of users who are already earning rewards while saving the planet.</p>
            <button className="bg-white text-emerald-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Download App Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoModal;