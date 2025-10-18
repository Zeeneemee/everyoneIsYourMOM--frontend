import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MapPin, Settings, ChevronLeft, Edit2, Coins, ShoppingBag, Sparkles, Package } from "lucide-react";

export function ProfileScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("preferences");
  
  const [user] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    location: "San Francisco, CA",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    stats: {
      points: 1240,
      orders: 45,
      cleanings: 12,
      exchanges: 8
    },
    preferences: {
      diet: ["Vegetarian", "Keto"],
      allergens: ["Dairy", "Nuts"],
      cuisines: ["Italian", "Asian", "Mediterranean"],
      healthGoals: ["Weight Loss", "More Energy"],
      cleaningFrequency: "Weekly",
      exchangeInterests: ["Books", "Tech", "Home Decor"]
    }
  });

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col">
      {/* Header */}
      <div className="bg-[#0F0F0F] px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-white hover:text-[#FF6B35] hover:bg-transparent p-0"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div className="flex-1 ml-4">
            <h1 className="text-white text-xl font-semibold">Profile</h1>
            <p className="text-gray-400 text-sm">Manage your account</p>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/settings')}
            className="text-white hover:text-[#FF6B35] hover:bg-transparent p-0"
          >
            <Settings className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 max-w-4xl mx-auto w-full pb-24">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1A1A1A] rounded-2xl p-6 mb-6 border border-[#2A2A2A]"
        >
          <div className="flex items-start gap-4 mb-6">
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div className="flex-1">
              <h2 className="text-white text-xl font-bold mb-1">{user.name}</h2>
              <p className="text-gray-400 text-sm mb-2">{user.email}</p>
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <MapPin className="w-4 h-4" />
                <span>{user.location}</span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="text-[#FF6B35] hover:text-[#FF6B35] hover:bg-transparent p-0"
            >
              <Edit2 className="w-5 h-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="w-full h-px bg-[#2A2A2A] mb-6"></div>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-[#FFB84D] text-xl font-bold mb-1">
                <Coins className="w-5 h-5" />
                <span>{user.stats.points}</span>
              </div>
              <div className="text-xs text-gray-400">Points</div>
            </div>
            <div className="text-center">
              <div className="text-white text-xl font-bold mb-1">{user.stats.orders}</div>
              <div className="text-xs text-gray-400">Orders</div>
            </div>
            <div className="text-center">
              <div className="text-white text-xl font-bold mb-1">{user.stats.cleanings}</div>
              <div className="text-xs text-gray-400">Cleanings</div>
            </div>
            <div className="text-center">
              <div className="text-white text-xl font-bold mb-1">{user.stats.exchanges}</div>
              <div className="text-xs text-gray-400">Exchanges</div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <button
            onClick={() => setActiveTab("preferences")}
            className={`py-3 rounded-xl font-medium transition-all ${
              activeTab === "preferences"
                ? "bg-[#5A3826] text-white"
                : "bg-transparent text-gray-400"
            }`}
          >
            Preferences
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`py-3 rounded-xl font-medium transition-all ${
              activeTab === "history"
                ? "bg-[#5A3826] text-white"
                : "bg-transparent text-gray-400"
            }`}
          >
            History
          </button>
        </motion.div>

        {/* Preferences Content */}
        {activeTab === "preferences" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Diet Preferences */}
            <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#2A2A2A]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg font-semibold">Diet Preferences</h3>
                <Button 
                  variant="ghost" 
                  className="text-[#FF6B35] hover:text-[#FF6B35] hover:bg-transparent p-0"
                >
                  <Edit2 className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.preferences.diet.map((item, idx) => (
                  <Badge 
                    key={idx}
                    className="bg-[#2A2A2A] text-white border-[#3A3A3A] px-3 py-1.5"
                  >
                    <span className="mr-2">{idx === 0 ? "🥗" : "🥑"}</span>
                    {item}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Allergens */}
            <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#2A2A2A]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg font-semibold">Allergens</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.preferences.allergens.map((item, idx) => (
                  <Badge 
                    key={idx}
                    className="bg-[#2A2A2A] text-white border-[#3A3A3A] px-3 py-1.5"
                  >
                    <span className="mr-2">⚠️</span>
                    <span className="mr-2">{idx === 0 ? "🥛" : "🥜"}</span>
                    {item}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Favorite Cuisines */}
            <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#2A2A2A]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg font-semibold">Favorite Cuisines</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.preferences.cuisines.map((item, idx) => (
                  <Badge 
                    key={idx}
                    className="bg-[#2A2A2A] text-white border-[#3A3A3A] px-3 py-1.5"
                  >
                    <span className="mr-2">
                      {idx === 0 ? "🍝" : idx === 1 ? "🍜" : "🥙"}
                    </span>
                    {item}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Health Goals */}
            <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#2A2A2A]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg font-semibold">Health Goals</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.preferences.healthGoals.map((item, idx) => (
                  <Badge 
                    key={idx}
                    className="bg-[#2A2A2A] text-white border-[#3A3A3A] px-3 py-1.5"
                  >
                    <span className="mr-2">{idx === 0 ? "⚖️" : "⚡"}</span>
                    {item}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Cleaning Frequency */}
            <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#2A2A2A]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg font-semibold">Cleaning Frequency</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-[#2A2A2A] text-white border-[#3A3A3A] px-3 py-1.5">
                  <span className="mr-2">✨</span>
                  {user.preferences.cleaningFrequency}
                </Badge>
              </div>
            </div>

            {/* Exchange Interests */}
            <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#2A2A2A]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg font-semibold">Exchange Interests</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.preferences.exchangeInterests.map((item, idx) => (
                  <Badge 
                    key={idx}
                    className="bg-[#2A2A2A] text-white border-[#3A3A3A] px-3 py-1.5"
                  >
                    <span className="mr-2">
                      {idx === 0 ? "📚" : idx === 1 ? "💻" : "🏠"}
                    </span>
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* History Content */}
        {activeTab === "history" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#2A2A2A]"
          >
            <p className="text-gray-400 text-center py-8">History coming soon...</p>
          </motion.div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

