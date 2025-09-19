import React from 'react';
import { Smartphone, Server, Database, Cpu, Camera, Wifi } from 'lucide-react';

const TechStack = () => {
  const techStack = [
    {
      category: "Frontend",
      icon: Smartphone,
      items: ["React Native", "Flutter", "TypeScript", "Tailwind CSS"],
      color: "from-blue-500 to-indigo-600"
    },
    {
      category: "Backend",
      icon: Server,
      items: ["Node.js", "Express.js", "RESTful APIs", "WebSocket"],
      color: "from-emerald-500 to-teal-600"
    },
    {
      category: "Database",
      icon: Database,
      items: ["MongoDB", "Firebase", "Redis Cache", "Blockchain"],
      color: "from-purple-500 to-pink-600"
    },
    {
      category: "IoT & Hardware",
      icon: Cpu,
      items: ["Smart Kiosks", "QR Scanners", "Weight Sensors", "Cloud Sync"],
      color: "from-orange-500 to-red-600"
    }
  ];

  const integrations = [
    {
      name: "Computer Vision",
      icon: Camera,
      description: "AI-powered device recognition and condition assessment"
    },
    {
      name: "IoT Connectivity",
      icon: Wifi,
      description: "Real-time data sync between kiosks and cloud platform"
    },
    {
      name: "Payment Gateways",
      icon: Server,
      description: "Secure integration with OTT, transport, and charging APIs"
    }
  ];

  return (
    <section id="tech-stack" className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Cutting-Edge Technology
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Built with modern, scalable technologies for seamless user experience and robust performance
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {techStack.map((tech, index) => {
            const Icon = tech.icon;
            return (
              <div 
                key={index}
                className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-gray-600 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`bg-gradient-to-r ${tech.color} p-3 rounded-xl mb-4 w-fit`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="text-xl font-bold mb-4">{tech.category}</h3>
                
                <ul className="space-y-2">
                  {tech.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-gray-300 text-sm flex items-center">
                      <div className="w-1 h-1 bg-emerald-400 rounded-full mr-2"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-8 rounded-2xl border border-gray-600">
          <h3 className="text-2xl font-bold mb-8 text-center">Advanced Integrations</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {integrations.map((integration, index) => {
              const Icon = integration.icon;
              return (
                <div 
                  key={index}
                  className="text-center p-6 bg-gray-900/50 rounded-xl border border-gray-600"
                >
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-full mb-4 w-fit mx-auto">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  
                  <h4 className="text-lg font-bold mb-2">{integration.name}</h4>
                  <p className="text-gray-300 text-sm">{integration.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 px-6 py-3 rounded-full border border-emerald-500/20">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="font-medium">Scalable • Secure • Future-Ready</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;