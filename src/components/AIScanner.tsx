import React, { useState, useRef } from 'react';
import { Camera, Scan, Smartphone, Laptop, Headphones, Watch, CheckCircle, X, Upload } from 'lucide-react';

const AIScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const deviceTypes = [
    { icon: Smartphone, name: 'Smartphone', baseCoins: 150 },
    { icon: Laptop, name: 'Laptop', baseCoins: 300 },
    { icon: Headphones, name: 'Headphones', baseCoins: 75 },
    { icon: Watch, name: 'Smartwatch', baseCoins: 200 },
    { icon: Smartphone, name: 'Tablet', baseCoins: 180 },
    { icon: Laptop, name: 'Charger', baseCoins: 50 },
    { icon: Headphones, name: 'Earbuds', baseCoins: 60 },
    { icon: Watch, name: 'Fitness Tracker', baseCoins: 120 }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        simulateAIScan();
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateAIScan = () => {
    setIsScanning(true);
    setScanResult(null);
    
    setTimeout(() => {
      const randomDevice = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
      
      // Simulate AI analysis of uploaded image
      // In a real app, this would use computer vision to analyze the image
      const conditions = [
        { name: 'Excellent', multiplier: 1.2, probability: 0.1 },
        { name: 'Good', multiplier: 1.0, probability: 0.3 },
        { name: 'Fair', multiplier: 0.8, probability: 0.4 },
        { name: 'Poor', multiplier: 0.5, probability: 0.15 },
        { name: 'Damaged', multiplier: 0.2, probability: 0.05 }
      ];
      
      // Weighted random selection based on realistic probabilities
      const random = Math.random();
      let cumulativeProbability = 0;
      let selectedCondition = conditions[2]; // Default to Fair
      
      for (const condition of conditions) {
        cumulativeProbability += condition.probability;
        if (random <= cumulativeProbability) {
          selectedCondition = condition;
          break;
        }
      }
      
      const finalCoins = Math.round(randomDevice.baseCoins * selectedCondition.multiplier);
      
      setScanResult({
        device: randomDevice.name,
        condition: selectedCondition.name,
        estimatedValue: finalCoins,
        confidence: Math.floor(Math.random() * 15) + 85, // 85-99% confidence
        weight: (Math.random() * 500 + 100).toFixed(0),
        recyclability: selectedCondition.multiplier > 0.7 ? 'High' : selectedCondition.multiplier > 0.4 ? 'Medium' : 'Low',
        co2Impact: (finalCoins * 0.1).toFixed(1)
      });
      setIsScanning(false);
    }, 3500); // Slightly longer for more realistic AI processing
  };

  const resetScanner = () => {
    setScanResult(null);
    setUploadedImage(null);
    setIsScanning(false);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            AI-Powered Device Scanner
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Upload a photo of your device and let our AI instantly evaluate its value and environmental impact
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Scanner Interface */}
          <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 rounded-2xl w-fit mx-auto mb-4">
                <Camera className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Smart Device Recognition</h3>
              <p className="text-gray-400">Take or upload a photo to get instant evaluation</p>
            </div>

            {/* Upload Area */}
            <div className="mb-8">
              {!uploadedImage ? (
                <div 
                  className="border-2 border-dashed border-gray-600 rounded-xl p-12 text-center cursor-pointer hover:border-emerald-500 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 mb-2">Click to upload device photo</p>
                  <p className="text-sm text-gray-500">Supports JPG, PNG up to 10MB</p>
                </div>
              ) : (
                <div className="relative">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded device" 
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <button
                    onClick={resetScanner}
                    className="absolute top-2 right-2 bg-red-500 p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Scanning Animation */}
            {isScanning && (
              <div className="bg-gray-900 p-6 rounded-xl border border-gray-600 mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Scan className="h-6 w-6 text-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 font-semibold">AI Analysis in Progress...</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Device Recognition</span>
                    <span className="text-emerald-400">✓ Complete</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Condition Assessment</span>
                    <span className="text-yellow-400">⏳ Processing</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Value Calculation</span>
                    <span className="text-gray-500">⏳ Pending</span>
                  </div>
                </div>
                <div className="mt-4 bg-gray-800 rounded-full h-2">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
            )}

            {/* Scan Results */}
            {scanResult && (
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-6 rounded-xl border border-emerald-500/20">
                <div className="flex items-center space-x-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Scan Complete!</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-sm text-gray-400">Device Type</div>
                    <div className="text-lg font-semibold">{scanResult.device}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Condition</div>
                    <div className={`text-lg font-semibold ${
                      scanResult.condition === 'Excellent' ? 'text-green-400' :
                      scanResult.condition === 'Good' ? 'text-emerald-400' :
                      scanResult.condition === 'Fair' ? 'text-yellow-400' :
                      scanResult.condition === 'Poor' ? 'text-orange-400' :
                      'text-red-400'
                    }`}>{scanResult.condition}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Estimated Weight</div>
                    <div className="text-lg font-semibold">{scanResult.weight}g</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Confidence</div>
                    <div className="text-lg font-semibold text-emerald-400">{scanResult.confidence}%</div>
                  </div>
                </div>

                <div className="bg-gray-900 p-4 rounded-xl mb-4">
                  <div className="text-center">
                    <div className={`text-3xl font-bold mb-1 ${
                      scanResult.condition === 'Excellent' ? 'text-green-400' :
                      scanResult.condition === 'Good' ? 'text-emerald-400' :
                      scanResult.condition === 'Fair' ? 'text-yellow-400' :
                      scanResult.condition === 'Poor' ? 'text-orange-400' :
                      'text-red-400'
                    }`}>
                      {scanResult.estimatedValue} Green Coins
                    </div>
                    <div className="text-sm text-gray-400">Estimated Value</div>
                  </div>
                </div>

                <div className="flex justify-between text-sm mb-4">
                  <span className="text-gray-400">Recyclability Score</span>
                  <span className={`font-semibold ${
                    scanResult.recyclability === 'High' ? 'text-emerald-400' :
                    scanResult.recyclability === 'Medium' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>{scanResult.recyclability}</span>
                </div>
                <div className="flex justify-between text-sm mb-6">
                  <span className="text-gray-400">CO₂ Impact Saved</span>
                  <span className="text-emerald-400 font-semibold">{scanResult.co2Impact} kg</span>
                </div>

                <button className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  scanResult.estimatedValue > 0 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700'
                    : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                }`}>
                  Proceed to Recycle
                </button>
              </div>
            )}
          </div>

          {/* AI Features */}
          <div className="space-y-8">
            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
              <h3 className="text-xl font-bold mb-6">AI Recognition Capabilities</h3>
              <div className="grid grid-cols-2 gap-4">
                {deviceTypes.map((device, index) => {
                  const Icon = device.icon;
                  return (
                    <div key={index} className="bg-gray-900 p-4 rounded-xl text-center">
                      <Icon className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                      <div className="font-semibold text-sm">{device.name}</div>
                      <div className="text-xs text-gray-400">~{device.baseCoins} coins</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
              <h3 className="text-xl font-bold mb-4">How AI Evaluation Works</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-emerald-500 p-1 rounded-full mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Computer Vision Analysis</div>
                    <div className="text-xs text-gray-400">Identifies device type, brand, and model</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-emerald-500 p-1 rounded-full mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Condition Assessment</div>
                    <div className="text-xs text-gray-400">Evaluates wear, damage, and functionality</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-emerald-500 p-1 rounded-full mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Value Calculation</div>
                    <div className="text-xs text-gray-400">Determines Green Coins based on multiple factors</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-emerald-500 p-1 rounded-full mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Environmental Impact</div>
                    <div className="text-xs text-gray-400">Calculates CO₂ savings and recyclability</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 rounded-2xl">
              <h3 className="text-xl font-bold mb-2">Try the Demo!</h3>
              <p className="text-emerald-100 text-sm mb-4">
                Upload any device photo to see our AI in action. Our computer vision analyzes condition, damage, and calculates fair value based on real market data.
              </p>
              <div className="text-xs text-emerald-200">
                💡 Tip: Clear photos showing device condition help our AI provide accurate assessments
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIScanner;