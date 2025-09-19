import React, { useState } from 'react';
import { Users, MessageCircle, Share2, Heart, Trophy, Camera, MapPin, Calendar } from 'lucide-react';

const SocialFeatures = () => {
  const [selectedPost, setSelectedPost] = useState<number | null>(null);

  const communityPosts = [
    {
      id: 1,
      user: {
        name: "Alex Chen",
        avatar: "AC",
        level: 12,
        badge: "Eco Champion"
      },
      content: "Just recycled my old iPhone 11 and earned 150 Green Coins! 📱♻️ Every small action counts towards a greener future. Who's joining the challenge this month?",
      image: "📱",
      location: "Delhi Tech Park",
      timestamp: "2 hours ago",
      likes: 24,
      comments: 8,
      shares: 3,
      coins: 150,
      challenge: "Monthly Recycling Challenge"
    },
    {
      id: 2,
      user: {
        name: "Sarah Kim",
        avatar: "SK",
        level: 8,
        badge: "Planet Saver"
      },
      content: "Reached 1000 Green Coins milestone! 🎉 Redeemed Netflix Premium and still have coins left for metro cards. This platform is amazing! #GreenCoins #Sustainability",
      image: "🏆",
      location: "Mumbai Central",
      timestamp: "5 hours ago",
      likes: 42,
      comments: 15,
      shares: 7,
      coins: 1000,
      challenge: null
    },
    {
      id: 3,
      user: {
        name: "Raj Patel",
        avatar: "RP",
        level: 15,
        badge: "Green Warrior"
      },
      content: "Team recycling day at our office! 💼 Collected 25 old devices and earned 2000+ coins together. Building a sustainable workplace culture one device at a time.",
      image: "🏢",
      location: "Bangalore IT Hub",
      timestamp: "1 day ago",
      likes: 67,
      comments: 23,
      shares: 12,
      coins: 2150,
      challenge: "Corporate Challenge"
    }
  ];

  const challenges = [
    {
      id: 1,
      title: "Earth Day Special",
      description: "Recycle 5 devices this week",
      participants: 1247,
      reward: "500 bonus coins + exclusive badge",
      timeLeft: "3 days",
      progress: 68
    },
    {
      id: 2,
      title: "Campus Green Drive",
      description: "Students recycling competition",
      participants: 892,
      reward: "Scholarship vouchers",
      timeLeft: "1 week",
      progress: 45
    },
    {
      id: 3,
      title: "Corporate Sustainability",
      description: "Office teams recycling challenge",
      participants: 156,
      reward: "Team outing vouchers",
      timeLeft: "2 weeks",
      progress: 72
    }
  ];

  const topContributors = [
    { name: "Mike Rodriguez", coins: 3450, devices: 23, badge: "🏆" },
    { name: "Emma Wilson", coins: 3200, devices: 21, badge: "🥈" },
    { name: "David Lee", coins: 2890, devices: 19, badge: "🥉" },
    { name: "Lisa Zhang", coins: 2650, devices: 18, badge: "⭐" },
    { name: "Tom Brown", coins: 2400, devices: 16, badge: "🌟" }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Community & Social Impact
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of eco-warriors sharing their recycling journey and inspiring others
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Community Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <MessageCircle className="h-6 w-6 text-emerald-600" />
                <h3 className="text-xl font-bold text-gray-900">Community Feed</h3>
              </div>

              <div className="space-y-6">
                {communityPosts.map((post) => (
                  <div key={post.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                    <div className="flex items-start space-x-4">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-2 rounded-full">
                        <span className="text-white font-bold text-sm">{post.user.avatar}</span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-gray-900">{post.user.name}</span>
                          <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                            Level {post.user.level}
                          </span>
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                            {post.user.badge}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 mb-3">{post.content}</p>
                        
                        {post.challenge && (
                          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-3 rounded-lg mb-3 border border-emerald-200">
                            <div className="flex items-center space-x-2">
                              <Trophy className="h-4 w-4 text-emerald-600" />
                              <span className="text-emerald-800 font-medium text-sm">{post.challenge}</span>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{post.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{post.timestamp}</span>
                          </div>
                          <div className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                            +{post.coins} coins
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors">
                            <Heart className="h-4 w-4" />
                            <span className="text-sm">{post.likes}</span>
                          </button>
                          <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
                            <MessageCircle className="h-4 w-4" />
                            <span className="text-sm">{post.comments}</span>
                          </button>
                          <button className="flex items-center space-x-2 text-gray-600 hover:text-emerald-500 transition-colors">
                            <Share2 className="h-4 w-4" />
                            <span className="text-sm">{post.shares}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Active Challenges */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <Trophy className="h-6 w-6 text-yellow-500" />
                <h3 className="text-lg font-bold text-gray-900">Active Challenges</h3>
              </div>
              
              <div className="space-y-4">
                {challenges.map((challenge) => (
                  <div key={challenge.id} className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-1">{challenge.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span>{challenge.participants.toLocaleString()} participants</span>
                      <span>{challenge.timeLeft} left</span>
                    </div>
                    
                    <div className="bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full"
                        style={{ width: `${challenge.progress}%` }}
                      ></div>
                    </div>
                    
                    <div className="text-xs text-emerald-600 font-medium">
                      🎁 {challenge.reward}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Contributors */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <Users className="h-6 w-6 text-blue-500" />
                <h3 className="text-lg font-bold text-gray-900">Top Contributors</h3>
              </div>
              
              <div className="space-y-3">
                {topContributors.map((contributor, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{contributor.badge}</div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{contributor.name}</div>
                        <div className="text-xs text-gray-600">{contributor.devices} devices</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-600 text-sm">
                        {contributor.coins.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">coins</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Share Your Story */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 rounded-2xl text-white">
              <div className="flex items-center space-x-3 mb-4">
                <Camera className="h-6 w-6" />
                <h3 className="text-lg font-bold">Share Your Story</h3>
              </div>
              <p className="text-emerald-100 text-sm mb-4">
                Inspire others by sharing your recycling journey and environmental impact!
              </p>
              <button className="bg-white text-emerald-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm">
                Create Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialFeatures;