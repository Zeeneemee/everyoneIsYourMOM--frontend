import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AIMomAvatar } from "./AIMomAvatar";
import { BottomNav } from "./BottomNav";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { User, MapPin, Phone, Mail, Sparkle, Settings, LogOut, Trophy, Heart } from "lucide-react";

export function ProfileScreen() {
  const navigate = useNavigate();
  const [user] = useState({
    name: "Sarah Chen",
    location: "Block A, #05-101",
    phone: "+65 8123 4567",
    email: "sarah.chen@email.com",
    momPoints: 120,
    level: "Super Mom",
    joinedDate: "January 2024",
    stats: {
      foodShared: 24,
      helpGiven: 18,
      itemsExchanged: 12
    }
  });

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#1A1A1A] to-[#0F0F0F] px-4 sm:px-6 py-4 border-b border-[#FF6B35]/10">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-white hover:text-[#FF6B35]"
          >
            ← Back
          </Button>
          <h1 className="text-white text-lg font-semibold">Profile</h1>
          <Button 
            variant="ghost" 
            className="text-white hover:text-[#FF6B35]"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 max-w-4xl mx-auto w-full pb-24">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#FF6B35] to-[#FFB84D] rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <h2 className="text-white text-xl font-bold mb-1">{user.name}</h2>
              <div className="flex items-center gap-1 text-white/80 text-sm mb-2">
                <MapPin className="w-4 h-4" />
                <span>{user.location}</span>
              </div>
              <Badge className="bg-white/20 text-white border-white/30 text-xs">
                <Trophy className="w-3 h-3 mr-1" />
                {user.level}
              </Badge>
            </div>
          </div>

          {/* Mom Points */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkle className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">Mom Points</span>
              </div>
              <span className="text-2xl font-bold text-white">{user.momPoints}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-500"
                style={{ width: `${(user.momPoints / 200) * 100}%` }}
              />
            </div>
            <p className="text-white/70 text-xs mt-2">{200 - user.momPoints} points to next level</p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <div className="bg-[#1A1A1A] rounded-xl p-4 border border-[#FF6B35]/20">
            <div className="text-2xl mb-2">🍽️</div>
            <div className="text-2xl font-bold text-white mb-1">{user.stats.foodShared}</div>
            <div className="text-xs text-gray-400">Food Shared</div>
          </div>
          <div className="bg-[#1A1A1A] rounded-xl p-4 border border-[#FF6B35]/20">
            <div className="text-2xl mb-2">✨</div>
            <div className="text-2xl font-bold text-white mb-1">{user.stats.helpGiven}</div>
            <div className="text-xs text-gray-400">Help Given</div>
          </div>
          <div className="bg-[#1A1A1A] rounded-xl p-4 border border-[#FF6B35]/20">
            <div className="text-2xl mb-2">📦</div>
            <div className="text-2xl font-bold text-white mb-1">{user.stats.itemsExchanged}</div>
            <div className="text-xs text-gray-400">Items Shared</div>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#1A1A1A] rounded-xl p-4 border border-[#FF6B35]/20 mb-6"
        >
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-[#FF6B35]" />
            Contact Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-300">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{user.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Heart className="w-4 h-4 text-gray-400" />
              <span className="text-sm">Member since {user.joinedDate}</span>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <Button 
            variant="outline" 
            className="w-full bg-[#1A1A1A] border-[#FF6B35]/20 text-white hover:bg-[#FF6B35]/10 hover:border-[#FF6B35]/50"
          >
            <Settings className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
          <Button 
            variant="outline" 
            className="w-full bg-[#1A1A1A] border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
      
      {/* Spacer for fixed nav */}
      <div className="h-20"></div>
    </div>
  );
}

