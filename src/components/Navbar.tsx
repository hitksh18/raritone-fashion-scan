
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/LoginModal';

interface NavbarProps {
  onSearchOpen: () => void;
  onCartOpen: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearchOpen, onCartOpen }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user, cart } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleProfileClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left - Menu */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 text-gray-900 hover:text-gray-600 transition-colors"
              >
                <motion.div
                  animate={{ rotate: isMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </motion.div>
                <span className="text-sm font-medium">
                  {isMenuOpen ? 'Close' : 'Menu'}
                </span>
              </button>
            </div>

            {/* Center - Logo */}
            <div className="flex-1 flex justify-center">
              <img
                src="/lovable-uploads/2a9db097-46df-4a0b-af29-359a1298bdf2.png"
                alt="RARITONE"
                width={120}
                height={40}
                className="h-8 w-auto cursor-pointer"
                onClick={() => navigate('/')}
              />
            </div>

            {/* Right - Icons */}
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate('/cart')}
                className="relative text-gray-900 hover:text-gray-600 transition-colors"
              >
                <ShoppingBag size={20} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>
              
              <button
                onClick={onSearchOpen}
                className="text-gray-900 hover:text-gray-600 transition-colors"
              >
                <Search size={20} />
              </button>
              
              <button 
                onClick={handleProfileClick}
                className="text-gray-900 hover:text-gray-600 transition-colors"
              >
                <User size={20} />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Full Screen Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white"
          >
            <div className="flex flex-col items-center justify-center min-h-screen space-y-8 text-center">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <button 
                  onClick={() => { navigate('/catalog'); setIsMenuOpen(false); }}
                  className="text-4xl font-light text-gray-900 hover:text-gray-600 transition-colors"
                >
                  Shop
                </button>
              </motion.div>
              
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <button 
                  onClick={() => { navigate('/scan'); setIsMenuOpen(false); }}
                  className="text-4xl font-light text-gray-900 hover:text-gray-600 transition-colors"
                >
                  Body Scan
                </button>
              </motion.div>
              
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <button 
                  onClick={() => { handleProfileClick(); setIsMenuOpen(false); }}
                  className="text-4xl font-light text-gray-900 hover:text-gray-600 transition-colors"
                >
                  Profile
                </button>
              </motion.div>
              
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <button className="text-4xl font-light text-gray-900 hover:text-gray-600 transition-colors">
                  Support
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
