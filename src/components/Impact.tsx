import React from 'react';
import { Leaf, Users, Recycle, TrendingUp } from 'lucide-react';

const Impact = () => {
  const stats = [
    {
      icon: Leaf,
      number: "2.5 Tons",
      label: "CO₂ Emissions Saved",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Users,
      number: "10,000+",
      label: "Active Eco-Warriors",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: Recycle,
      number: "50,000+",
      label: "Devices Recycled",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: TrendingUp,
      number: "2M+",
      label: "Green Coins Distributed",
      color: "from-orange-500 to-red-600"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Our Environmental Impact
          </h2>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            Together, we're building a sustainable future one device at a time
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="text-center group"
              >
                <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
                  <div className={`bg-gradient-to-r ${stat.color} p-4 rounded-2xl mb-6 w-fit mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="text-4xl font-bold mb-2">
                    {stat.number}
                  </div>
                  
                  <div className="text-emerald-100 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 max-w-4xl mx-auto">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-2xl font-bold mb-4">
              Join the Green Revolution
            </h3>
            <p className="text-emerald-100 text-lg leading-relaxed">
              Every device you recycle through Green Coins helps reduce electronic waste, 
              saves valuable resources, and contributes to a cleaner, more sustainable planet. 
              Your small actions create a big environmental impact.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Impact;