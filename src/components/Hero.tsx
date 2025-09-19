import React from 'react';
import { ArrowRight, Recycle, Coins, Smartphone } from 'lucide-react';
import DemoModal from './DemoModal';
import AuthModal from './AuthModal';

const Hero = () => {
  const [isDemoOpen, setIsDemoOpen] = React.useState(false);
  const [isAuthOpen, setIsAuthOpen] = React.useState(false);

  return (
    <>
      <section className="pt-16 pb-20 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
                <Recycle className="h-4 w-4" />
                <span>Sustainable Innovation</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Turn Your <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">E-Waste</span> Into Daily Rewards
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Gamify recycling with Green Coins! Earn digital rewards for every old device you recycle, 
                then redeem them for OTT subscriptions, metro cards, EV charging, and more.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={() => setIsAuthOpen(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2"
              >
                <span>Start Recycling</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              
              <button 
                onClick={() => setIsDemoOpen(true)}
                className="border-2 border-emerald-500 text-emerald-600 px-8 py-4 rounded-lg hover:bg-emerald-50 transition-all duration-300 font-semibold text-lg"
              >
                Watch Demo
              </button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">50K+</div>
                <div className="text-gray-600 text-sm">Devices Recycled</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">2M+</div>
                <div className="text-gray-600 text-sm">Green Coins Earned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">10K+</div>
                <div className="text-gray-600 text-sm">Active Users</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative bg-gradient-to-br from-emerald-400 to-teal-500 p-8 rounded-3xl shadow-2xl transform rotate-3">
              <div className="bg-white p-6 rounded-2xl transform -rotate-3">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">Your Green Wallet</h3>
                    <div className="bg-emerald-100 p-2 rounded-full">
                      <Coins className="h-6 w-6 text-emerald-600" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 rounded-xl text-white">
                    <div className="text-sm opacity-90">Total Balance</div>
                    <div className="text-3xl font-bold">1,245 Green Coins</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="h-5 w-5 text-gray-600" />
                        <span className="font-medium">Old iPhone 12</span>
                      </div>
                      <span className="text-emerald-600 font-bold">+150</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-5 w-5 bg-gray-400 rounded"></div>
                        <span className="font-medium">Laptop Charger</span>
                      </div>
                      <span className="text-emerald-600 font-bold">+75</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-4 -right-4 bg-yellow-400 p-3 rounded-full shadow-lg animate-bounce">
              <div className="text-2xl">🏆</div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-green-400 p-3 rounded-full shadow-lg animate-pulse">
              <div className="text-2xl">♻️</div>
            </div>
          </div>
        </div>
      </div>
      </section>

      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} initialMode="signup" />
    </>
  );
};

export default Hero;