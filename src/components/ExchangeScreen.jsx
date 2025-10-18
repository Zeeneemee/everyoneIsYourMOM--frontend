import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AIMomAvatar } from "./AIMomAvatar";
import { BottomNav } from "./BottomNav";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ArrowLeft, Search, Heart, MessageCircle, MapPin, Clock, ChefHat, Home, Sparkles, Package } from "lucide-react";

export function ExchangeScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Load exchange data from data.json
  const exchangeItems = [
    {
      id: "item_01",
      ownerBlock: "Blk A-304",
      item: "Rice Cooker 1.2L",
      status: "donate",
      condition: "good",
      image: "🍚"
    },
    {
      id: "item_02",
      ownerBlock: "Blk B-107",
      item: "Standing Fan",
      status: "exchange",
      condition: "fair",
      image: "🪭"
    },
    {
      id: "item_03",
      ownerBlock: "Blk C-502",
      item: "Yoga Mat",
      status: "donate",
      condition: "like new",
      image: "🧘"
    },
    {
      id: "item_04",
      ownerBlock: "Blk D-406",
      item: "Microwave Oven",
      status: "sell",
      price: "$40",
      condition: "good",
      image: "📦"
    },
    {
      id: "item_05",
      ownerBlock: "Blk E-208",
      item: "Mini Fridge",
      status: "exchange",
      condition: "good",
      image: "🧊"
    },
    {
      id: "item_06",
      ownerBlock: "Blk F-105",
      item: "Bookshelf (3-tier)",
      status: "donate",
      condition: "fair",
      image: "📚"
    },
    {
      id: "item_07",
      ownerBlock: "Blk G-402",
      item: "Electric Kettle",
      status: "sell",
      price: "$10",
      condition: "good",
      image: "☕"
    },
    {
      id: "item_08",
      ownerBlock: "Blk H-603",
      item: "Desk Lamp",
      status: "donate",
      condition: "good",
      image: "💡"
    },
    {
      id: "item_09",
      ownerBlock: "Blk I-310",
      item: "Blender",
      status: "exchange",
      condition: "good",
      image: "🫙"
    },
    {
      id: "item_10",
      ownerBlock: "Blk J-507",
      item: "Foldable Chair",
      status: "sell",
      price: "$15",
      condition: "good",
      image: "🪑"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#1A1A1A] to-[#0F0F0F] px-4 sm:px-6 py-4 border-b border-[#FF6B35]/10">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/profile')}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FFB84D] flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer shrink-0"
            >
              <span className="text-xl">👤</span>
            </button>
            <div className="flex items-center gap-2">
              <Package className="w-6 h-6 text-[#FF6B35]" />
              <h2 className="text-white text-lg font-semibold">Exchange</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 sm:px-6 py-4 border-b border-[#FF6B35]/10">
        <div className="max-w-4xl mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items to exchange..."
            className="pl-10 bg-[#2D2D2D] border-gray-700 text-white placeholder:text-gray-500 h-11"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Mom's Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1A1A1A] rounded-xl p-4 border border-[#FF6B35]/20 mb-6"
          >
            <div className="flex gap-3">
              <div className="flex-1">
                <p className="text-white text-sm mb-2">
                  See lah, always need something. Lucky ah — your neighbors got things to donate, exchange, or sell cheap. I message them for you?
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Badge className="bg-[#FFB84D]/20 text-[#FFB84D] border-[#FFB84D]/30 text-xs">
                    Matched to your interests
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Exchange Item Cards */}
          <div className="space-y-4">
            {exchangeItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#1A1A1A] rounded-xl p-4 border border-[#FF6B35]/20 cursor-pointer hover:border-[#FF6B35]/50 transition-all"
              >
                <div className="flex gap-4">
                  {/* Item Icon */}
                  <div className="text-5xl shrink-0">{item.image}</div>
                  
                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">{item.item}</h3>
                        <p className="text-gray-400 text-xs sm:text-sm">From: {item.ownerBlock}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs shrink-0 ${
                            item.status === 'donate' 
                              ? 'bg-green-500/10 text-green-400 border-green-500/30'
                              : item.status === 'exchange'
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                              : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                          }`}
                        >
                          {item.status === 'donate' ? '🎁 Free' : item.status === 'exchange' ? '🔄 Trade' : '💰 Sell'}
                        </Badge>
                        {item.price && (
                          <span className="text-[#FFB84D] font-semibold text-sm">{item.price}</span>
                        )}
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="outline" className="text-xs h-5">
                        {item.condition}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <MapPin className="w-3 h-3" />
                        <span>{item.ownerBlock}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 mt-3">
                      <Button 
                        size="sm"
                        className="h-8"
                        style={{
                          background: "linear-gradient(135deg, #FF6B35 0%, #FFB84D 100%)",
                        }}
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Contact Owner
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Add Item Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <Button 
              className="w-full h-12"
              style={{
                background: "linear-gradient(135deg, #FF6B35 0%, #FFB84D 100%)",
              }}
            >
              <Package className="w-5 h-5 mr-2" />
              List Your Item
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
      
      {/* Spacer for fixed nav */}
      <div className="h-20"></div>
    </div>
  );
}

