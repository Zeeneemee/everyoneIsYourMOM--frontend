import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AIMomAvatar } from "./AIMomAvatar";
import { BottomNav } from "./BottomNav";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Mic, Send, Sparkles, ChefHat, Sparkle, Home, Package } from "lucide-react";

export function HomeScreen() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: "1",
      type: "mom",
      content: "Hi sweetie! 💝 How can Mom help you today?",
      timestamp: new Date(),
      emoji: "😊"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const suggestions = [
    {
      id: "1",
      title: "Hainanese Chicken Rice",
      description: "From Auntie Mei (Blk A-101) • $6.50 • 20 min",
      icon: "🍗",
      category: "food"
    },
    {
      id: "2",
      title: "Auntie Siew Available",
      description: "10AM-12PM today • Pet-friendly • $20/hr",
      icon: "✨",
      category: "cleaning"
    },
    {
      id: "3",
      title: "Rice Cooker - Free!",
      description: "From Blk A-304 • Good condition • Donate",
      icon: "🍚",
      category: "exchange"
    }
  ];

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const momMessage = {
        id: (Date.now() + 1).toString(),
        type: "mom",
        content: "I found some great options for you! Let me show you what I recommend based on your preferences. 🍽️",
        timestamp: new Date(),
        emoji: "🤗"
      };
      setMessages(prev => [...prev, momMessage]);
      setIsTyping(false);
    }, 1500);
  };

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
          <div className="flex items-center gap-2">
            <Badge className="bg-[#FFB84D]/20 text-[#FFB84D] border border-[#FFB84D]/30 text-xs hidden sm:flex">
              <Sparkle className="w-3 h-3 mr-1" />
              120 Mom Points
            </Badge>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 max-w-4xl mx-auto w-full">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-2 max-w-[85%] sm:max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-[#FF6B35] to-[#FFB84D] text-white"
                      : "bg-[#2D2D2D] text-white border border-[#FF6B35]/20"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <span className="text-xs opacity-60 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="bg-[#2D2D2D] rounded-2xl px-4 py-3 border border-[#FF6B35]/20">
              <div className="flex gap-1">
                <motion.div
                  className="w-2 h-2 bg-[#FF6B35] rounded-full"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
                <motion.div
                  className="w-2 h-2 bg-[#FFB84D] rounded-full"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                />
                <motion.div
                  className="w-2 h-2 bg-[#FFC857] rounded-full"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* AI Suggestions */}
        <div className="pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#FF6B35]" />
            <span className="text-sm text-gray-400">Mom recommends for you</span>
          </div>
          
          <div className="space-y-3">
            {suggestions.map((suggestion) => (
              <motion.div
                key={suggestion.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#1A1A1A] rounded-xl p-4 border border-[#FF6B35]/20 cursor-pointer hover:border-[#FF6B35]/50 transition-all"
                onClick={() => navigate(`/${suggestion.category === 'cleaning' ? 'clean' : suggestion.category === 'exchange' ? 'items' : suggestion.category}`)}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl sm:text-3xl">{suggestion.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white mb-1 text-sm sm:text-base truncate">{suggestion.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-400">{suggestion.description}</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className="bg-[#FF6B35]/10 text-[#FF6B35] border-[#FF6B35]/30 text-xs shrink-0"
                  >
                    {suggestion.category}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-[#1A1A1A] px-4 sm:px-6 py-4 border-t border-[#FF6B35]/10">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask Mom anything... 💝"
              className="bg-[#2D2D2D] border-gray-700 text-white placeholder:text-gray-500 pr-12 h-12"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF6B35]"
            >
              <Mic className="w-5 h-5" />
            </Button>
          </div>
          <Button
            onClick={handleSend}
            size="icon"
            className="h-12 w-12 shrink-0"
            style={{
              background: "linear-gradient(135deg, #FF6B35 0%, #FFB84D 100%)",
            }}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
      
      {/* Spacer for fixed nav */}
      <div className="h-20"></div>
    </div>
  );
}

