import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Target, 
  Award, 
  Zap,
  MapPin,
  Clock,
  Users,
  Leaf,
  Coins,
  Trophy,
  Star,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdvancedDashboard = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  if (!user) return null;

  const chartData = {
    week: [
      { day: 'Mon', coins: 45, devices: 1 },
      { day: 'Tue', coins: 0, devices: 0 },
      { day: 'Wed', coins: 120, devices: 2 },
      { day: 'Thu', coins: 75, devices: 1 },
      { day: 'Fri', coins: 200, devices: 3 },
      { day: 'Sat', coins: 150, devices: 2 },
      { day: 'Sun', coins: 90, devices: 1 }
    ],
    month: [
      { period: 'Week 1', coins: 320, devices: 4 },
      { period: 'Week 2', coins: 480, devices: 6 },
      { period: 'Week 3', coins: 290, devices: 3 },
      { period: 'Week 4', coins: 155, devices: 2 }
    ],
    year: [
      { period: 'Q1', coins: 1200, devices: 15 },
      { period: 'Q2', coins: 1800, devices: 22 },
      { period: 'Q3', coins: 2100, devices: 28 },
      { period: 'Q4', coins: 1245, devices: 16 }
    ]
  };

  const achievements = [
    {
      title: "First Recycler",
      description: "Recycled your first device",
      icon: "🎯",
      earned: true,
      date: "Jan 15, 2024"
    },
    {
      title: "Eco Warrior",
      description: "Recycled 10+ devices",
      icon: "⚔️",
      earned: true,
      date: "Feb 20, 2024"
    },
    {
      title: "Planet Saver",
      description: "Saved 50kg CO₂",
      icon: "🌍",
      earned: true,
      date: "Mar 10, 2024"
    },
    {
      title: "Green Champion",
      description: "Top 100 recyclers",
      icon: "🏆",
      earned: false,
      progress: 75
    },
    {
      title: "Streak Master",
      description: "30-day recycling streak",
      icon: "🔥",
      earned: false,
      progress: 23
    },
    {
      title: "Community Leader",
      description: "Referred 10 friends",
      icon: "👥",
      earned: false,
      progress: 40
    }
  ];

  const nearbyOpportunities = [
    {
      type: "2x Coins Event",
      location: "Tech Park Kiosk",
      distance: "0.8 km",
      timeLeft: "2 hours",
      description: "Double coins for smartphones today!"
    },
    {
      type: "New Kiosk",
      location: "Metro Station",
      distance: "1.2 km",
      timeLeft: "Just opened",
      description: "Brand new kiosk with bonus rewards"
    },
    {
      type: "Community Challenge",
      location: "University Campus",
      distance: "2.1 km",
      timeLeft: "3 days",
      description: "Student recycling competition"
    }
  ];

  const personalGoals = [
    {
      title: "Monthly Target",
      current: 3,
      target: 5,
      unit: "devices",
      reward: "500 bonus coins",
      progress: 60
    },
    {
      title: "CO₂ Impact Goal",
      current: 45.6,
      target: 100,
      unit: "kg saved",
      reward: "Eco Champion badge",
      progress: 46
    },
    {
      title: "Coin Collection",
      current: 1245,
      target: 2000,
      unit: "coins",
      reward: "Premium rewards unlock",
      progress: 62
    }
  ];

  const maxCoins = Math.max(...chartData[selectedPeriod as keyof typeof chartData].map(d => d.coins));

  return (
    <div className="space-y-8">
      {/* Advanced Analytics */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-6 w-6 text-emerald-600" />
            <h3 className="text-xl font-bold text-gray-900">Your Impact Analytics</h3>
          </div>
          <div className="flex space-x-2">
            {['week', 'month', 'year'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="mb-6">
          <div className="flex items-end space-x-2 h-64">
            {chartData[selectedPeriod as keyof typeof chartData].map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '200px' }}>
                  <div 
                    className="bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg absolute bottom-0 w-full transition-all duration-500"
                    style={{ height: `${(data.coins / maxCoins) * 100}%` }}
                  ></div>
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white font-bold text-sm">
                    {data.coins}
                  </div>
                </div>
                <div className="mt-2 text-sm font-medium text-gray-600">
                  {'day' in data ? data.day : data.period}
                </div>
                <div className="text-xs text-gray-500">
                  {data.devices} device{data.devices !== 1 ? 's' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-emerald-50 p-4 rounded-xl">
            <div className="text-2xl font-bold text-emerald-600">
              {chartData[selectedPeriod as keyof typeof chartData].reduce((sum, d) => sum + d.coins, 0)}
            </div>
            <div className="text-sm text-emerald-700">Total Coins Earned</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl">
            <div className="text-2xl font-bold text-blue-600">
              {chartData[selectedPeriod as keyof typeof chartData].reduce((sum, d) => sum + d.devices, 0)}
            </div>
            <div className="text-sm text-blue-700">Devices Recycled</div>
          </div>
          <div className="bg-green-50 p-4 rounded-xl">
            <div className="text-2xl font-bold text-green-600">
              {(chartData[selectedPeriod as keyof typeof chartData].reduce((sum, d) => sum + d.devices, 0) * 2.3).toFixed(1)}
            </div>
            <div className="text-sm text-green-700">kg CO₂ Saved</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl">
            <div className="text-2xl font-bold text-purple-600">
              #{Math.floor(Math.random() * 100) + 1}
            </div>
            <div className="text-sm text-purple-700">City Ranking</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Personal Goals */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <Target className="h-6 w-6 text-orange-500" />
            <h3 className="text-xl font-bold text-gray-900">Personal Goals</h3>
          </div>
          
          <div className="space-y-4">
            {personalGoals.map((goal, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                  <span className="text-sm text-gray-600">
                    {goal.current}/{goal.target} {goal.unit}
                  </span>
                </div>
                
                <div className="bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
                
                <div className="text-xs text-orange-600 font-medium">
                  🎁 Reward: {goal.reward}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Gallery */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <Award className="h-6 w-6 text-yellow-500" />
            <h3 className="text-xl font-bold text-gray-900">Achievement Gallery</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-xl border-2 transition-all ${
                  achievement.earned 
                    ? 'border-emerald-200 bg-emerald-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="text-center">
                  <div className={`text-3xl mb-2 ${!achievement.earned ? 'grayscale opacity-50' : ''}`}>
                    {achievement.icon}
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">
                    {achievement.title}
                  </h4>
                  <p className="text-xs text-gray-600 mb-2">
                    {achievement.description}
                  </p>
                  
                  {achievement.earned ? (
                    <div className="text-xs text-emerald-600 font-medium">
                      ✓ Earned {achievement.date}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-teal-600 h-1 rounded-full"
                          style={{ width: `${achievement.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {achievement.progress}% complete
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nearby Opportunities */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <Zap className="h-6 w-6 text-purple-500" />
          <h3 className="text-xl font-bold text-gray-900">Nearby Opportunities</h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          {nearbyOpportunities.map((opportunity, index) => (
            <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                  {opportunity.type}
                </span>
                <span className="text-xs text-gray-600">{opportunity.distance}</span>
              </div>
              
              <h4 className="font-semibold text-gray-900 mb-1">{opportunity.location}</h4>
              <p className="text-sm text-gray-600 mb-2">{opportunity.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-xs text-purple-600">
                  <Clock className="h-3 w-3" />
                  <span>{opportunity.timeLeft}</span>
                </div>
                <button className="text-purple-600 hover:text-purple-700">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvancedDashboard;