import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  greenCoins: number;
  level: number;
  totalRecycled: number;
  co2Saved: number;
  joinedDate: string;
  badges: string[];
  currentStreak: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem('greenCoinsUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data - in real app, this would come from your backend
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email: email,
      phone: '+1 (555) 123-4567',
      greenCoins: 1245,
      level: 5,
      totalRecycled: 23,
      co2Saved: 45.6,
      joinedDate: '2024-01-15',
      badges: ['Eco Warrior', 'Planet Saver', 'First Recycler'],
      currentStreak: 7
    };

    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('greenCoinsUser', JSON.stringify(mockUser));
  };

  const signup = async (userData: any) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      greenCoins: 100, // Welcome bonus
      level: 1,
      totalRecycled: 0,
      co2Saved: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      badges: ['Welcome Bonus'],
      currentStreak: 0
    };

    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('greenCoinsUser', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('greenCoinsUser');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('greenCoinsUser', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      signup,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};