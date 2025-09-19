import React from 'react';
import { Tv, CreditCard, Zap, ShoppingBag, Users, Leaf } from 'lucide-react';
import RewardsModal from './RewardsModal';

const Features = () => {
  const [isRewardsOpen, setIsRewardsOpen] = React.useState(false);

  const redemptionOptions = [
    {
      icon: Tv,
      title: "OTT Subscriptions",
      description: "Netflix, Prime, Spotify, Disney+ and more",
      color: "bg-red-500"
    },
    {
      icon: CreditCard,
      title: "Metro Cards",
      description: "Public transport passes for your daily commute",
      color: "bg-blue-500"
    },
    {
      icon: Zap,
      title: "EV Charging",
      description: "Credits for electric vehicle charging stations",
      color: "bg-yellow-500"
    },
    {
      icon: ShoppingBag,
      title: "Brand Coupons",
      description: "Exclusive discounts from partnered brands",
      color: "bg-purple-500"
    }
  ];

  const benefits = [
    {
      icon: Users,
      title: "Community Impact",
      description: "Join thousands of eco-warriors making a difference in your city.",
      stat: "10K+ Active Users"
    },
    {
      icon: Leaf,
      title: "Environmental Impact",
      description: "Every device recycled reduces electronic waste and saves the planet.",
      stat: "2.5 Tons CO₂ Saved"
    }
  ];

  return (
    <>
      <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Redeem Your Green Coins
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Turn your environmental consciousness into tangible rewards you use every day
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {redemptionOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <div 
                key={index}
                onClick={() => setIsRewardsOpen(true)}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 cursor-pointer"
              >
                <div className={`${option.color} p-3 rounded-xl mb-4 w-fit`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {option.title}
                </h3>
                
                <p className="text-gray-600 text-sm">
                  {option.description}
                </p>
                
                <div className="mt-4 text-emerald-600 text-sm font-medium">
                  Click to explore →
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div 
                key={index}
                className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 rounded-2xl text-white relative overflow-hidden"
              >
                <div className="relative z-10">
                  <Icon className="h-12 w-12 mb-4 opacity-90" />
                  
                  <h3 className="text-2xl font-bold mb-3">
                    {benefit.title}
                  </h3>
                  
                  <p className="text-emerald-100 mb-4 text-lg">
                    {benefit.description}
                  </p>
                  
                  <div className="text-3xl font-bold">
                    {benefit.stat}
                  </div>
                </div>
                
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full transform translate-x-8 -translate-y-8"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full transform -translate-x-6 translate-y-6"></div>
              </div>
            );
          })}
        </div>
      </div>
      </section>

      <RewardsModal isOpen={isRewardsOpen} onClose={() => setIsRewardsOpen(false)} />
    </>
  );
};

export default Features;