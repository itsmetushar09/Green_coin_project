import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Users, Zap, CheckCircle } from 'lucide-react';

const LiveMap = () => {
  const [selectedKiosk, setSelectedKiosk] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  const kiosks = [
    {
      id: 1,
      name: "Green Kiosk - Tech Park",
      address: "Sector 62, Noida",
      distance: "0.8 km",
      status: "active",
      waitTime: "2 min",
      todayRecycled: 45,
      coordinates: { lat: 28.6139, lng: 77.2090 },
      rewards: "2x coins today!"
    },
    {
      id: 2,
      name: "EcoPoint - Mall Road",
      address: "Connaught Place, Delhi",
      distance: "1.2 km",
      status: "busy",
      waitTime: "8 min",
      todayRecycled: 78,
      coordinates: { lat: 28.6304, lng: 77.2177 },
      rewards: "Standard rates"
    },
    {
      id: 3,
      name: "Green Station - Metro",
      address: "Rajiv Chowk Metro Station",
      distance: "2.1 km",
      status: "maintenance",
      waitTime: "Offline",
      todayRecycled: 0,
      coordinates: { lat: 28.6330, lng: 77.2194 },
      rewards: "Temporarily closed"
    },
    {
      id: 4,
      name: "Recycle Hub - University",
      address: "DU North Campus",
      distance: "3.5 km",
      status: "active",
      waitTime: "1 min",
      todayRecycled: 23,
      coordinates: { lat: 28.6967, lng: 77.2167 },
      rewards: "Student bonus: +50 coins"
    }
  ];

  useEffect(() => {
    // Simulate getting user location
    navigator.geolocation?.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      () => {
        // Fallback to Delhi coordinates
        setUserLocation({ lat: 28.6139, lng: 77.2090 });
      }
    );
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'maintenance': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Available';
      case 'busy': return 'Busy';
      case 'maintenance': return 'Offline';
      default: return 'Unknown';
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Find Nearby Kiosks
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Locate the nearest Green Coins kiosk and check real-time availability
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="h-96 bg-gradient-to-br from-emerald-100 to-teal-100 relative">
                {/* Simulated Map */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Interactive Map</h3>
                    <p className="text-gray-600">Real-time kiosk locations and status</p>
                  </div>
                </div>

                {/* Kiosk Markers */}
                {kiosks.map((kiosk, index) => (
                  <div
                    key={kiosk.id}
                    className={`absolute w-4 h-4 rounded-full cursor-pointer transform -translate-x-2 -translate-y-2 ${getStatusColor(kiosk.status)}`}
                    style={{
                      left: `${20 + index * 20}%`,
                      top: `${30 + index * 15}%`
                    }}
                    onClick={() => setSelectedKiosk(kiosk.id)}
                  >
                    <div className="absolute inset-0 rounded-full animate-ping opacity-75"></div>
                  </div>
                ))}

                {/* User Location */}
                {userLocation && (
                  <div className="absolute w-3 h-3 bg-blue-600 rounded-full" style={{ left: '45%', top: '55%' }}>
                    <div className="absolute inset-0 bg-blue-400 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors">
                      <Navigation className="h-4 w-4" />
                      <span>Get Directions</span>
                    </button>
                    <button className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700">
                      <Zap className="h-4 w-4" />
                      <span>Quick Route</span>
                    </button>
                  </div>
                  <div className="text-sm text-gray-600">
                    📍 Your location detected
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kiosk List */}
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Nearby Locations</h3>
              <div className="space-y-3">
                {kiosks.map((kiosk) => (
                  <div
                    key={kiosk.id}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedKiosk === kiosk.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedKiosk(kiosk.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">{kiosk.name}</h4>
                        <p className="text-xs text-gray-600">{kiosk.address}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(kiosk.status)}`}></div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-600 font-medium">{kiosk.distance}</span>
                      <span className="text-gray-600">{getStatusText(kiosk.status)}</span>
                    </div>

                    {kiosk.status === 'active' && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3 text-gray-500" />
                            <span className="text-gray-600">{kiosk.waitTime} wait</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3 text-gray-500" />
                            <span className="text-gray-600">{kiosk.todayRecycled} today</span>
                          </div>
                        </div>
                        <div className="mt-1 text-xs text-emerald-600 font-medium">
                          {kiosk.rewards}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Live Stats */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 rounded-xl text-white">
              <h3 className="font-bold mb-3">Live Network Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Active Kiosks</span>
                  <span className="font-semibold">12/15</span>
                </div>
                <div className="flex justify-between">
                  <span>Today's Recycling</span>
                  <span className="font-semibold">1,247 devices</span>
                </div>
                <div className="flex justify-between">
                  <span>Coins Distributed</span>
                  <span className="font-semibold">45,890</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveMap;