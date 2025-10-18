import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useVoiceAssistant } from "../contexts/VoiceAssistantContext";
import { BottomNav } from "./BottomNav";
import { Badge } from "./ui/badge";
import { Mic, Star, ShoppingCart, Sparkles, Settings } from "lucide-react";

export function HomeScreen() {
  const navigate = useNavigate();
  const { openVoiceAssistant, sharedRecommendations } = useVoiceAssistant();
  const recommendations = sharedRecommendations;

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#1A1A1A] to-[#0F0F0F] px-4 sm:px-6 py-4 border-b border-[#FF6B35]/10">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/profile')}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FFB84D] flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer"
            >
              <span className="text-xl">👤</span>
            </button>
            <div>
              <h2 className="text-white text-sm sm:text-base">AI Mom</h2>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-gray-400">Everyone is your Mom</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="text-white hover:text-[#FF6B35] transition-colors"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Voice Interface */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-8 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
        
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Please talk to your Mom
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 mb-2">
            Mom is ready to talk to you
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-500">Online and listening</span>
          </div>
        </motion.div>

        {/* Big Mic Button */}
        <motion.button
          onClick={openVoiceAssistant}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-[#FF6B35] via-[#FFB84D] to-[#FFC857] flex items-center justify-center shadow-2xl mb-8 relative group"
        >
          {/* Pulsing ring effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-[#FF6B35]/30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          <Mic className="w-24 h-24 sm:w-28 sm:h-28 text-white" />
        </motion.button>

        {/* Instruction Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-8"
        >
          <p className="text-gray-400 text-sm sm:text-base mb-4">
            Tap the mic to start talking
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 bg-[#FF6B35]/10 border border-[#FF6B35]/30 rounded-full text-xs text-[#FF6B35]">
              "What should I eat?"
            </span>
            <span className="px-3 py-1 bg-[#FF6B35]/10 border border-[#FF6B35]/30 rounded-full text-xs text-[#FF6B35]">
              "Find a cleaner"
            </span>
            <span className="px-3 py-1 bg-[#FF6B35]/10 border border-[#FF6B35]/30 rounded-full text-xs text-[#FF6B35]">
              "I need help"
            </span>
          </div>
        </motion.div>

        {/* Recommendation Bubbles */}
        <AnimatePresence mode="wait">
          {recommendations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl space-y-3"
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-[#FF6B35]" />
                <p className="text-white text-sm font-medium">
                  🍽️ Mom's Recommendations for You:
                </p>
              </div>
              
              {recommendations.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigate(`/${item.category || 'food'}`);
                    sessionStorage.setItem('selectedItem', JSON.stringify(item));
                  }}
                  className="w-full bg-gradient-to-r from-[#2D2D2D] to-[#1A1A1A] border border-[#FF6B35]/30 rounded-xl p-4 text-left hover:border-[#FF6B35]/60 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#FFB84D] rounded-lg flex items-center justify-center text-2xl shrink-0">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-semibold mb-1 group-hover:text-[#FF6B35] transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-400 mb-2">
                        From {item.house}
                      </p>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 text-[#FFB84D]">
                          <Star className="w-3 h-3 fill-current" />
                          {item.rating || 5.0}
                        </span>
                        <span className="text-[#FF6B35] font-semibold">
                          {item.price}
                        </span>
                        <span className="text-gray-500">
                          {item.eta}
                        </span>
                      </div>
                    </div>
                    <ShoppingCart className="w-5 h-5 text-[#FF6B35] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                </motion.button>
              ))}
              
              <p className="text-center text-xs text-gray-500 mt-3">
                Tap any dish to see details • Say "bye" to close
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Actions (Optional) */}
        {recommendations.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 mt-8"
          >
            <button
              onClick={() => navigate('/food')}
              className="px-6 py-3 bg-[#2D2D2D] hover:bg-[#3D3D3D] text-white rounded-xl border border-[#FF6B35]/30 transition-colors text-sm"
            >
              🍽️ Browse Food
            </button>
            <button
              onClick={() => navigate('/clean')}
              className="px-6 py-3 bg-[#2D2D2D] hover:bg-[#3D3D3D] text-white rounded-xl border border-[#FF6B35]/30 transition-colors text-sm"
            >
              ✨ Find Cleaners
            </button>
            <button
              onClick={() => navigate('/items')}
              className="px-6 py-3 bg-[#2D2D2D] hover:bg-[#3D3D3D] text-white rounded-xl border border-[#FF6B35]/30 transition-colors text-sm"
            >
              🎁 Exchange Items
            </button>
          </motion.div>
        )}

      </div>

      {/* Bottom Navigation */}
      <BottomNav />
      
      {/* Spacer for fixed nav */}
      <div className="h-20"></div>
    </div>
  );
}

