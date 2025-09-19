import React from 'react';
import { ArrowRight, Download, PlayCircle } from 'lucide-react';
import AppDownloadModal from './AppDownloadModal';
import DemoModal from './DemoModal';

const CTA = () => {
  const [isDownloadOpen, setIsDownloadOpen] = React.useState(false);
  const [isDemoOpen, setIsDemoOpen] = React.useState(false);

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Start Earning?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Download the Green Coins app today and turn your old electronics into valuable rewards. 
              Join thousands of users who are already making a positive impact.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button 
              onClick={() => setIsDownloadOpen(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2"
            >
              <Download className="h-5 w-5" />
              <span>Download App</span>
            </button>
            
            <button 
              onClick={() => setIsDemoOpen(true)}
              className="border-2 border-emerald-500 text-emerald-400 px-8 py-4 rounded-lg hover:bg-emerald-500 hover:text-white transition-all duration-300 font-semibold text-lg flex items-center space-x-2"
            >
              <PlayCircle className="h-5 w-5" />
              <span>Watch Demo</span>
            </button>
          </div>

          <div className="pt-8">
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-12 text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span>Free to Download</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span>Instant Rewards</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span>Eco-Friendly Impact</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-8 rounded-2xl border border-emerald-500/20">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-emerald-400 mb-2">4.8/5</div>
              <div className="text-gray-300">App Store Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-400 mb-2">50K+</div>
              <div className="text-gray-300">Downloads</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-400 mb-2">24/7</div>
              <div className="text-gray-300">Support Available</div>
            </div>
          </div>
        </div>
      </div>
      </section>

      <AppDownloadModal isOpen={isDownloadOpen} onClose={() => setIsDownloadOpen(false)} />
      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </>
  );
};

export default CTA;