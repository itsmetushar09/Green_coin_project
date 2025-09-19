import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import Gamification from './components/Gamification';
import LiveMap from './components/LiveMap';
import AIScanner from './components/AIScanner';
import RealTimeStats from './components/RealTimeStats';
import SocialFeatures from './components/SocialFeatures';
import TechStack from './components/TechStack';
import Impact from './components/Impact';
import CTA from './components/CTA';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <Dashboard />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <HowItWorks />
      <Features />
      <LiveMap />
      <AIScanner />
      <RealTimeStats />
      <Gamification />
      <SocialFeatures />
      <TechStack />
      <Impact />
      <CTA />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;