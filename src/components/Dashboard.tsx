import React, { useState } from 'react';
import { 
  User, 
  Coins, 
  Trophy, 
  Recycle, 
  Leaf, 
  TrendingUp, 
  Gift, 
  Calendar,
  Target,
  Award,
  Settings,
  Bell,
  History,
  MapPin,
  Smartphone,
  CreditCard,
  Tv,
  Zap
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import RewardsModal from './RewardsModal';
import AdvancedDashboard from './AdvancedDashboard';

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);

  if (!user) return null;

  const recentActivities = [
    {
      id: 1,
      type: 'recycle',
      device: 'iPhone 12',
      coins: 150,
      date: '2024-01-20',
      location: 'Green Kiosk - Mall Road'
    },
    {
      id: 2,
      type: 'redeem',
      item: 'Netflix Premium',
      coins: -500,
      date: '2024-01-18',
      location: 'Online Redemption'
    },
    {
      id: 3,
      type: 'recycle',
      device: 'Laptop Charger',
      coins: 75,
      date: '2024-01-15',
      location: 'Green Kiosk - Tech Park'
    }
  ];

  const quickActions = [
    {
      icon: Recycle,
      title: 'Find Kiosk',
      description: 'Locate nearest recycling point',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: Gift,
      title: 'Redeem Rewards',
      description: 'Browse available rewards',
      color: 'from-purple-500 to-pink-600',
      onClick: () => setIsRewardsOpen(true)
    },
    {
      icon: Trophy,
      title: 'Challenges',
      description: 'View active challenges',
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: TrendingUp,
      title: 'Leaderboard',
      description: 'Check your ranking',
      color: 'from-blue-500 to-indigo-600'
    }
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp },
    { id: 'activity', name: 'Activity', icon: History },
    { id: 'rewards', name: 'Rewards', icon: Gift },
    { id: 'profile', name: 'Profile', icon: Settings }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-4">
            <Coins className="h-8 w-8" />
            <div className="text-right">
              <div className="text-2xl font-bold">{user.greenCoins.toLocaleString()}</div>
              <div className="text-emerald-100 text-sm">Green Coins</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <Recycle className="h-8 w-8 text-blue-500" />
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{user.totalRecycled}</div>
              <div className="text-gray-600 text-sm">Devices Recycled</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <Leaf className="h-8 w-8 text-green-500" />
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{user.co2Saved} kg</div>
              <div className="text-gray-600 text-sm">CO₂ Saved</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">Level {user.level}</div>
              <div className="text-gray-600 text-sm">Current Level</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.onClick}
                className="p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`bg-gradient-to-r ${action.color} p-3 rounded-lg mb-3 w-fit mx-auto`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{action.title}</h4>
                <p className="text-gray-600 text-sm">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Challenge */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 rounded-2xl text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Monthly Challenge</h3>
          <Target className="h-6 w-6" />
        </div>
        <p className="text-purple-100 mb-4">
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
  );

  const renderActivity = () => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
      <div className="space-y-4">
        {recentActivities.map((activity) => (
          <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-lg ${
                activity.type === 'recycle' ? 'bg-emerald-100' : 'bg-purple-100'
              }`}>
                {activity.type === 'recycle' ? (
                  <Recycle className={`h-5 w-5 ${
                    activity.type === 'recycle' ? 'text-emerald-600' : 'text-purple-600'
                  }`} />
                ) : (
                  <Gift className="h-5 w-5 text-purple-600" />
                )}
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  {activity.type === 'recycle' ? `Recycled ${activity.device}` : `Redeemed ${activity.item}`}
                </div>
                <div className="text-sm text-gray-600 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {activity.location}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`font-bold ${
                activity.coins > 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {activity.coins > 0 ? '+' : ''}{activity.coins} coins
              </div>
              <div className="text-sm text-gray-600">{activity.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRewards = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Available Rewards</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: Tv, name: 'Netflix Premium', coins: 500, category: 'OTT' },
            { icon: CreditCard, name: 'Metro Card', coins: 450, category: 'Transport' },
            { icon: Zap, name: 'EV Charging', coins: 300, category: 'Energy' },
            { icon: Gift, name: 'Amazon Voucher', coins: 900, category: 'Shopping' }
          ].map((reward, index) => {
            const Icon = reward.icon;
            return (
              <div key={index} className="p-4 border border-gray-200 rounded-xl hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-3">
                  <Icon className="h-6 w-6 text-emerald-600" />
                  <span className="text-sm text-gray-500">{reward.category}</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{reward.name}</h4>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-600 font-bold">{reward.coins} coins</span>
                  <button 
                    onClick={() => setIsRewardsOpen(true)}
                    className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                  >
                    Redeem →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Your Badges</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {user.badges.map((badge, index) => (
            <div key={index} className="text-center p-3 bg-emerald-50 rounded-xl">
              <Award className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
              <div className="text-xs font-medium text-emerald-800">{badge}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Profile Settings</h3>
      <div className="space-y-6">
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
          <div className="bg-emerald-500 p-3 rounded-full">
            <User className="h-8 w-8 text-white" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{user.name}</div>
            <div className="text-gray-600">{user.email}</div>
            <div className="text-sm text-gray-500">Member since {user.joinedDate}</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={user.name}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={user.email}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={user.phone}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Streak</label>
            <input
              type="text"
              value={`${user.currentStreak} days`}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
              readOnly
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">Notifications</h4>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" defaultChecked />
              <span className="ml-2 text-gray-700">Email notifications for new rewards</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" defaultChecked />
              <span className="ml-2 text-gray-700">Push notifications for challenges</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
              <span className="ml-2 text-gray-700">Weekly progress reports</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 rounded-2xl text-white mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
                <p className="text-emerald-100">
                  You're doing great! Keep recycling to earn more Green Coins.
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">{user.greenCoins.toLocaleString()}</div>
                <div className="text-emerald-100">Green Coins</div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white p-2 rounded-2xl shadow-lg border border-gray-100 mb-8">
            <div className="flex space-x-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-emerald-500 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'analytics' && <AdvancedDashboard />}
            {activeTab === 'activity' && renderActivity()}
            {activeTab === 'rewards' && renderRewards()}
            {activeTab === 'profile' && renderProfile()}
          </div>
        </div>
      </div>

      <RewardsModal isOpen={isRewardsOpen} onClose={() => setIsRewardsOpen(false)} />
    </>
  );
};

export default Dashboard;