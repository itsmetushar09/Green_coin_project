import React from 'react';
import { Smartphone, QrCode, Coins, Gift } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Smartphone,
      title: "Bring Your E-Waste",
      description: "Drop off old devices at smart kiosks or partner stores. Phones, chargers, laptops - we accept it all!",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: QrCode,
      title: "Scan & Verify",
      description: "Our smart system scans your device, weighs it, and verifies its type and condition automatically.",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Coins,
      title: "Earn Green Coins",
      description: "Get instant Green Coins credited to your wallet based on device value, weight, and environmental impact.",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: Gift,
      title: "Redeem Rewards",
      description: "Use your Green Coins for OTT subscriptions, metro cards, EV charging, and exclusive brand discounts.",
      color: "from-orange-500 to-red-600"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your old electronics into valuable rewards in just four simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div 
                key={index} 
                className="relative group"
              >
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                  <div className={`bg-gradient-to-r ${step.color} p-4 rounded-2xl mb-6 w-fit mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="absolute -top-2 -left-2 bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-emerald-300 to-teal-300"></div>
                    <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;