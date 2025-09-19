import React from 'react';
import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Linkedin, href: "#" }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-2 rounded-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Green Coins
              </span>
            </div>
            
            <p className="text-gray-400 leading-relaxed">
              Transforming e-waste into valuable rewards while building a sustainable future for our planet.
            </p>
            
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a 
                    key={index}
                    href={social.href}
                    className="bg-gray-800 p-2 rounded-lg hover:bg-emerald-600 transition-colors duration-200"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-3">
              {['How It Works', 'Features', 'Gamification', 'Tech Stack', 'About Us'].map((link) => (
                <li key={link}>
                  <a 
                    href={`#${link.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-400 hover:text-emerald-400 transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-3">
              {['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service', 'FAQs'].map((link) => (
                <li key={link}>
                  <a 
                    href="#"
                    className="text-gray-400 hover:text-emerald-400 transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-emerald-400" />
                <span className="text-gray-400">hello@greencoins.com</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-emerald-400" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-emerald-400" />
                <span className="text-gray-400">San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            © 2025 Green Coins. All rights reserved.
          </div>
          
          <div className="flex space-x-6 text-sm text-gray-400 mt-4 md:mt-0">
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;