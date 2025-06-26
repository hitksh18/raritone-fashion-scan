
'use client';

import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SearchOverlay from '@/components/SearchOverlay';
import ChatWidget from '@/components/ChatWidget';

const Index = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  
  const logoY = useTransform(scrollY, [0, 300], [0, -100]);
  const logoOpacity = useTransform(scrollY, [0, 200], [1, 0]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <Navbar 
        onSearchOpen={() => setIsSearchOpen(true)}
        onCartOpen={() => setIsCartOpen(true)}
      />

      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
            alt="Luxury Fashion Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Logo */}
        <motion.div
          style={{ y: logoY, opacity: logoOpacity }}
          className="relative z-10 text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <img
              src="/lovable-uploads/2a9db097-46df-4a0b-af29-359a1298bdf2.png"
              alt="RARITONE"
              width={300}
              height={100}
              className="mx-auto mb-6"
            />
          </motion.div>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl font-light mb-8 text-white/90"
          >
            Fashion Meets Technology
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-black px-8 py-3 font-medium hover:bg-gray-100 transition-colors"
              onClick={() => navigate('/scan')}
            >
              Start Body Scan
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border border-white text-white px-8 py-3 font-medium hover:bg-white hover:text-black transition-colors"
              onClick={() => navigate('/catalog')}
            >
              Browse Collection
            </motion.button>
          </motion.div>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="text-sm text-white/70 mt-8 max-w-md mx-auto"
          >
            This site uses webcam access to enable AI-powered try-ons. Your camera data is never stored or shared.
          </motion.p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2" />
          </div>
        </motion.div>
      </div>

      {/* Featured Collections Preview */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="py-20 px-4 bg-white text-black"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-light mb-4">Curated by the House</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our latest collections, meticulously crafted and designed for the modern luxury connoisseur.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item, index) => (
              <motion.div
                key={item}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
                onClick={() => navigate('/catalog')}
              >
                <div className="aspect-[3/4] relative overflow-hidden mb-4">
                  <img
                    src={`https://images.unsplash.com/photo-158109122682${index + 5}-a6a2a5aee158`}
                    alt={`Collection ${item}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <h3 className="text-lg font-medium mb-2">New Collection {item}</h3>
                <p className="text-gray-600 text-sm">From ₹2,999</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Search Overlay */}
      <SearchOverlay 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
};

export default Index;
