import React, { useState, useEffect } from 'react';
import { Leaf, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'signin' | 'signup' }>({
    isOpen: false,
    mode: 'signin'
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: 'signin' });
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-2 rounded-lg">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Green Coins
            </span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {['How It Works', 'Features', 'Gamification', 'Tech Stack'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="text-gray-600 hover:text-emerald-600 transition-colors duration-200 font-medium"
              >
                {item}
              </a>
            ))}
          </nav>

          {isAuthenticated ? (
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-emerald-50 px-4 py-2 rounded-lg">
                <div className="bg-emerald-500 p-1 rounded-full">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                  <div className="text-xs text-emerald-600">{user?.greenCoins} Green Coins</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={() => openAuthModal('signin')}
                className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={() => openAuthModal('signup')}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 font-medium"
              >
                Get Started
              </button>
            </div>
          )}

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4">
            <nav className="flex flex-col space-y-4">
              {!isAuthenticated && (
                <>
                  {['How It Works', 'Features', 'Gamification', 'Tech Stack'].map((item) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase().replace(' ', '-')}`}
                      className="text-gray-600 hover:text-emerald-600 transition-colors px-4 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item}
                    </a>
                  ))}
                </>
              )}
              
              <div className="flex flex-col space-y-2 px-4 pt-4 border-t border-gray-100">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-3 bg-emerald-50 px-4 py-3 rounded-lg mb-2">
                      <div className="bg-emerald-500 p-1 rounded-full">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                        <div className="text-xs text-emerald-600">{user?.greenCoins} Green Coins</div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-red-600 hover:text-red-700 px-4 py-2 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => openAuthModal('signin')}
                      className="text-emerald-600 font-medium text-left"
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={() => openAuthModal('signup')}
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      Get Started
                    </button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
      </header>

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        initialMode={authModal.mode}
      />
    </>
  );
};

export default Header;