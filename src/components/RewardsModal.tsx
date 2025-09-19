import React, { useState } from 'react';
import { X, Tv, CreditCard, Zap, ShoppingBag, Gift, Star, Clock } from 'lucide-react';

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RewardsModal: React.FC<RewardsModalProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', name: 'All Rewards', icon: Gift },
    { id: 'ott', name: 'OTT Subscriptions', icon: Tv },
    { id: 'transport', name: 'Transport', icon: CreditCard },
    { id: 'ev', name: 'EV Charging', icon: Zap },
    { id: 'shopping', name: 'Shopping', icon: ShoppingBag }
  ];

  const rewards = [
    {
      id: 1,
      category: 'ott',
      name: 'Netflix Premium',
      description: '1 Month Subscription',
      coins: 500,
      originalPrice: '₹649',
      image: '🎬',
      popular: true,
      timeLeft: '2 days'
    },
    {
      id: 2,
      category: 'ott',
      name: 'Spotify Premium',
      description: '3 Months Subscription',
      coins: 400,
      originalPrice: '₹399',
      image: '🎵',
      popular: false,
      timeLeft: '5 days'
    },
    {
      id: 3,
      category: 'transport',
      name: 'Delhi Metro Card',
      description: '₹500 Balance',
      coins: 450,
      originalPrice: '₹500',
      image: '🚇',
      popular: true,
      timeLeft: '1 day'
    },
    {
      id: 4,
      category: 'ev',
      name: 'EV Charging Credits',
      description: '10 kWh Charging',
      coins: 300,
      originalPrice: '₹120',
      image: '⚡',
      popular: false,
      timeLeft: '3 days'
    },
    {
      id: 5,
      category: 'shopping',
      name: 'Amazon Voucher',
      description: '₹1000 Gift Card',
      coins: 900,
      originalPrice: '₹1000',
      image: '🛒',
      popular: true,
      timeLeft: '4 days'
    },
    {
      id: 6,
      category: 'ott',
      name: 'Disney+ Hotstar',
      description: '1 Year Super Plan',
      coins: 1200,
      originalPrice: '₹1499',
      image: '🏰',
      popular: false,
      timeLeft: '6 days'
    }
  ];

  const filteredRewards = selectedCategory === 'all' 
    ? rewards 
    : rewards.filter(reward => reward.category === selectedCategory);

  const userCoins = 1245; // Mock user balance

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Redeem Rewards</h2>
            <p className="text-emerald-600 font-semibold">Your Balance: {userCoins.toLocaleString()} Green Coins</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex">
          {/* Categories Sidebar */}
          <div className="w-64 bg-gray-50 p-4 border-r border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rewards Grid */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid md:grid-cols-2 gap-4">
              {filteredRewards.map((reward) => (
                <div
                  key={reward.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 relative"
                >
                  {reward.popular && (
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <Star className="h-3 w-3 mr-1" />
                      Popular
                    </div>
                  )}

                  <div className="flex items-start space-x-4">
                    <div className="text-4xl">{reward.image}</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-1">{reward.name}</h4>
                      <p className="text-gray-600 text-sm mb-2">{reward.description}</p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-emerald-600">
                            {reward.coins} Coins
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            {reward.originalPrice}
                          </span>
                        </div>
                        <div className="flex items-center text-orange-600 text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {reward.timeLeft} left
                        </div>
                      </div>

                      <button
                        disabled={userCoins < reward.coins}
                        className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                          userCoins >= reward.coins
                            ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {userCoins >= reward.coins ? 'Redeem Now' : 'Insufficient Coins'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredRewards.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎁</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No rewards found</h3>
                <p className="text-gray-600">Try selecting a different category</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              💡 <strong>Tip:</strong> Recycle more devices to earn additional coins!
            </div>
            <button className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm">
              View Earning History →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsModal;