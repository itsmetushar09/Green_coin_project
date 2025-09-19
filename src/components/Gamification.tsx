import React from 'react';
import { Trophy, Medal, Target, TrendingUp, Star, Crown } from 'lucide-react';

const Gamification = () => {
  const badges = [
    {
      icon: Medal,
      title: "Eco Warrior",
      description: "Recycle 10+ devices",
      color: "from-yellow-400 to-orange-500",
      earned: true
    },
    {
      icon: Crown,
      title: "Planet Saver",
      description: "Save 1 ton of CO₂",
      color: "from-purple-400 to-pink-500",
      earned: true
    },
    {
      icon: Star,
      title: "Green Champion",
      description: "Top 100 recyclers",
      color: "from-emerald-400 to-teal-500",
      earned: false
    },
    {
      icon: Target,
      title: "Monthly Master",
      description: "Complete all challenges",
      color: "from-blue-400 to-indigo-500",
      earned: false
    }
  ];

  const leaderboard = [
    { rank: 1, name: "Alex Chen", coins: 2840, badge: "🏆" },
    { rank: 2, name: "Sarah Kim", coins: 2650, badge: "🥈" },
    { rank: 3, name: "Mike Rodriguez", coins: 2180, badge: "🥉" },
    { rank: 4, name: "You", coins: 1245, badge: "🌟", highlight: true },
    { rank: 5, name: "Emma Wilson", coins: 1120, badge: "⭐" }
  ];

  return (
    <section id="gamification" className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Level Up Your Impact
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Earn badges, climb leaderboards, and complete challenges while saving the planet
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Badges & Achievements */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <h3 className="text-2xl font-bold text-gray-900">Your Badges</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {badges.map((badge, index) => {
                  const Icon = badge.icon;
                  return (
                    <div 
                      key={index}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        badge.earned 
                          ? 'border-emerald-200 bg-emerald-50 transform hover:scale-105' 
                          : 'border-gray-200 bg-gray-50 opacity-60'
                      }`}
                    >
                      <div className={`bg-gradient-to-r ${badge.color} p-2 rounded-lg mb-3 w-fit ${
                        !badge.earned ? 'grayscale' : ''
                      }`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      
                      <h4 className="font-bold text-gray-900 text-sm mb-1">
                        {badge.title}
                      </h4>
                      
                      <p className="text-gray-600 text-xs">
                        {badge.description}
                      </p>
                      
                      {badge.earned && (
                        <div className="mt-2 text-emerald-600 text-xs font-medium">
                          ✓ Earned
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Current Challenge */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 rounded-2xl text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Monthly Challenge</h3>
                <Target className="h-6 w-6" />
              </div>
              
              <p className="text-emerald-100 mb-4">
                Recycle 3 devices this month to unlock 500 bonus coins!
              </p>
              
              <div className="bg-white/20 rounded-full h-3 mb-2">
                <div className="bg-white rounded-full h-3 w-1/3"></div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>1 of 3 devices</span>
                <span>22 days left</span>
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <h3 className="text-2xl font-bold text-gray-900">City Leaderboard</h3>
            </div>
            
            <div className="space-y-4">
              {leaderboard.map((user) => (
                <div 
                  key={user.rank}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                    user.highlight 
                      ? 'bg-gradient-to-r from-emerald-100 to-teal-100 border-2 border-emerald-200 transform scale-105' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      user.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                      user.rank === 2 ? 'bg-gray-100 text-gray-800' :
                      user.rank === 3 ? 'bg-orange-100 text-orange-800' :
                      user.highlight ? 'bg-emerald-100 text-emerald-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {user.rank}
                    </div>
                    
                    <div>
                      <div className={`font-semibold ${user.highlight ? 'text-emerald-900' : 'text-gray-900'}`}>
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {user.coins.toLocaleString()} Green Coins
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-2xl">
                    {user.badge}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
              <div className="text-center">
                <p className="text-sm text-blue-800 mb-2">
                  🎯 <strong>Climb higher!</strong> Recycle more devices to boost your ranking
                </p>
                <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                  View Full Leaderboard →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gamification;