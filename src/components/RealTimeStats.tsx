import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Recycle, Coins, Globe, Zap, Award, Target } from 'lucide-react';

const RealTimeStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 10247,
    devicesRecycled: 52891,
    coinsDistributed: 2847392,
    co2Saved: 1247.8,
    activeKiosks: 12,
    citiesCovered: 8,
    partnersConnected: 45,
    rewardsRedeemed: 18394
  });

  const [recentActivities, setRecentActivities] = useState([
    { user: "Alex M.", action: "recycled iPhone 12", coins: 150, time: "2 min ago", location: "Delhi" },
    { user: "Sarah K.", action: "redeemed Netflix subscription", coins: -500, time: "5 min ago", location: "Mumbai" },
    { user: "Raj P.", action: "recycled laptop charger", coins: 75, time: "8 min ago", location: "Bangalore" },
    { user: "Priya S.", action: "earned Eco Warrior badge", coins: 100, time: "12 min ago", location: "Pune" },
    { user: "Mike R.", action: "recycled smartwatch", coins: 200, time: "15 min ago", location: "Chennai" }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 3),
        devicesRecycled: prev.devicesRecycled + Math.floor(Math.random() * 2),
        coinsDistributed: prev.coinsDistributed + Math.floor(Math.random() * 100),
        co2Saved: prev.co2Saved + Math.random() * 0.5
      }));

      // Occasionally add new activity
      if (Math.random() > 0.7) {
        const newActivities = [
          { user: "John D.", action: "recycled tablet", coins: 120, time: "just now", location: "Delhi" },
          { user: "Lisa W.", action: "redeemed metro card", coins: -300, time: "just now", location: "Mumbai" },
          { user: "Tom B.", action: "recycled headphones", coins: 80, time: "just now", location: "Bangalore" }
        ];
        
        setRecentActivities(prev => [
          newActivities[Math.floor(Math.random() * newActivities.length)],
          ...prev.slice(0, 4)
        ]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      icon: Users,
      label: "Active Users",
      value: stats.totalUsers.toLocaleString(),
      change: "+12%",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: Recycle,
      label: "Devices Recycled",
      value: stats.devicesRecycled.toLocaleString(),
      change: "+8%",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: Coins,
      label: "Coins Distributed",
      value: (stats.coinsDistributed / 1000000).toFixed(1) + "M",
      change: "+15%",
      color: "from-yellow-500 to-orange-600"
    },
    {
      icon: Globe,
      label: "CO₂ Saved (tons)",
      value: stats.co2Saved.toFixed(1),
      change: "+6%",
      color: "from-green-500 to-emerald-600"
    }
  ];

  const networkStats = [
    { icon: Zap, label: "Active Kiosks", value: stats.activeKiosks, total: 15 },
    { icon: Globe, label: "Cities Covered", value: stats.citiesCovered, total: 10 },
    { icon: Award, label: "Partner Brands", value: stats.partnersConnected, total: 50 },
    { icon: Target, label: "Rewards Redeemed", value: stats.rewardsRedeemed.toLocaleString(), total: null }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span>Live Data</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Real-Time Platform Analytics
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Watch our community's environmental impact grow in real-time
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-xl`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-emerald-600 text-sm font-semibold bg-emerald-50 px-2 py-1 rounded-full">
                    {stat.change}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Network Status */}
          <div className="bg-gray-50 p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Network Status</h3>
            <div className="space-y-4">
              {networkStats.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-emerald-600" />
                      <span className="text-gray-700">{item.label}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{item.value}</div>
                      {item.total && (
                        <div className="text-xs text-gray-500">of {item.total}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Activity Feed */}
          <div className="lg:col-span-2 bg-gray-50 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Live Activity Feed</h3>
              <div className="flex items-center space-x-2 text-emerald-600">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Live</span>
              </div>
            </div>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {recentActivities.map((activity, index) => (
                <div key={index} className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {activity.user.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          <span className="font-semibold">{activity.user}</span> {activity.action}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center space-x-2">
                          <span>{activity.time}</span>
                          <span>•</span>
                          <span>{activity.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`font-bold text-sm ${
                      activity.coins > 0 ? 'text-emerald-600' : 'text-purple-600'
                    }`}>
                      {activity.coins > 0 ? '+' : ''}{activity.coins} coins
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Global Impact Visualization */}
        <div className="mt-12 bg-gradient-to-r from-emerald-500 to-teal-600 p-8 rounded-2xl text-white">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Global Environmental Impact</h3>
            <p className="text-emerald-100">Our community's collective contribution to a sustainable future</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🌍</div>
              <div className="text-2xl font-bold">{stats.citiesCovered}</div>
              <div className="text-emerald-100 text-sm">Cities Impacted</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">♻️</div>
              <div className="text-2xl font-bold">{(stats.devicesRecycled / 1000).toFixed(1)}K</div>
              <div className="text-emerald-100 text-sm">Devices Saved</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🌱</div>
              <div className="text-2xl font-bold">{stats.co2Saved.toFixed(0)}</div>
              <div className="text-emerald-100 text-sm">Tons CO₂ Reduced</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🏆</div>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <div className="text-emerald-100 text-sm">Eco Warriors</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RealTimeStats;