import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mic, MicOff, ShoppingCart, Star } from "lucide-react";
import { useVoiceAssistant } from "../contexts/VoiceAssistantContext";
import { useConversation } from "@elevenlabs/react";

export function VoiceAssistantModal() {
  const { isOpen, openVoiceAssistant, closeVoiceAssistant, handleNavigation, updateRecommendations, clearRecommendations, sharedRecommendations } = useVoiceAssistant();
  const recommendations = sharedRecommendations;
  const [selectedIndex, setSelectedIndex] = useState(null);
  const cardRefs = useRef([]);

  // Get agent ID from environment variable
  const agentId = import.meta.env.VITE_ELEVENLABS_AGENT_ID;

  // Function to parse voice selection commands (by number or name)
  const parseSelectionCommand = (messageText) => {
    if (!messageText || typeof messageText !== 'string') return null;
    
    const textLower = messageText.toLowerCase();
    console.log("🎯 Parsing selection from:", textLower);
    
    // Check if this is a selection command
    const selectionKeywords = ['choose', 'select', 'want', 'pick', 'take', 'go with', 'book', 'order', 'get', 'i\'ll', 'give me', 'show me'];
    const hasSelectionKeyword = selectionKeywords.some(keyword => textLower.includes(keyword));
    
    console.log("Has selection keyword:", hasSelectionKeyword);
    
    // PRIORITY 1: Parse ordinal numbers (first, second, third)
    if (textLower.includes('first') || textLower.includes('1st')) {
      console.log("✅ Found 'first' - returning index 0");
      return { type: 'index', value: 0 };
    }
    if (textLower.includes('second') || textLower.includes('2nd')) {
      console.log("✅ Found 'second' - returning index 1");
      return { type: 'index', value: 1 };
    }
    if (textLower.includes('third') || textLower.includes('3rd')) {
      console.log("✅ Found 'third' - returning index 2");
      return { type: 'index', value: 2 };
    }
    
    // PRIORITY 2: Parse cardinal numbers (one, two, three)
    if ((textLower.includes('number one') || textLower.includes('number 1')) || 
        (hasSelectionKeyword && textLower.match(/\bone\b/))) {
      console.log("✅ Found 'one' - returning index 0");
      return { type: 'index', value: 0 };
    }
    if ((textLower.includes('number two') || textLower.includes('number 2')) || 
        (hasSelectionKeyword && textLower.match(/\btwo\b/))) {
      console.log("✅ Found 'two' - returning index 1");
      return { type: 'index', value: 1 };
    }
    if ((textLower.includes('number three') || textLower.includes('number 3')) || 
        (hasSelectionKeyword && textLower.match(/\bthree\b/))) {
      console.log("✅ Found 'three' - returning index 2");
      return { type: 'index', value: 2 };
    }
    
    // PRIORITY 3: Check for simple digits with selection keywords
    if (hasSelectionKeyword) {
      const digitMatch = textLower.match(/[^0-9]([123])[^0-9]/) || textLower.match(/([123])$/);
      if (digitMatch) {
        const digit = parseInt(digitMatch[1]);
        console.log("✅ Found digit match:", digit, "- returning index", digit - 1);
        return { type: 'index', value: digit - 1 };
      }
    }
    
    // PRIORITY 4: Check for "top one", "top option"
    if ((textLower.includes('top') || textLower.includes('best')) && 
        (textLower.includes('one') || textLower.includes('option') || textLower.includes('choice'))) {
      console.log("✅ Found 'top/best' - returning index 0");
      return { type: 'index', value: 0 };
    }
    
    // PRIORITY 5: Check for food name match (if selection keyword exists)
    if (hasSelectionKeyword && recommendations.length > 0) {
      console.log("🔍 Searching for food name match in recommendations...");
      
      for (let i = 0; i < recommendations.length; i++) {
        const food = recommendations[i];
        const foodName = (food.name || food.dish || '').toLowerCase();
        
        // Check if the food name is mentioned in the message
        if (foodName && textLower.includes(foodName)) {
          console.log(`✅ Found food name match: "${foodName}" at index ${i}`);
          return { type: 'index', value: i };
        }
        
        // Check for partial matches (e.g., "chicken" matches "Hainanese Chicken Rice")
        const foodWords = foodName.split(' ');
        let matchCount = 0;
        for (const word of foodWords) {
          if (word.length > 3 && textLower.includes(word)) {
            matchCount++;
          }
        }
        
        // If multiple words match, it's likely this food
        if (matchCount >= 2) {
          console.log(`✅ Found partial match: "${foodName}" at index ${i} (${matchCount} words matched)`);
          return { type: 'index', value: i };
        }
      }
      
      console.log("❌ No food name match found");
    }
    
    console.log("❌ No selection pattern matched");
    return null;
  };

  // Function to handle voice selection - programmatically triggers card onClick
  const handleVoiceSelection = (selectionIndex) => {
    if (selectionIndex === null || selectionIndex < 0 || selectionIndex >= recommendations.length) {
      console.log("❌ Invalid selection index:", selectionIndex);
      return;
    }
    
    const selectedItem = recommendations[selectionIndex];
    console.log('🎉 Voice selection confirmed:', { 
      index: selectionIndex, 
      item: selectedItem 
    });
    
    // Show visual feedback
    setSelectedIndex(selectionIndex);
    
    // Programmatically trigger card click after brief delay for visual feedback
    setTimeout(() => {
      const cardElement = cardRefs.current[selectionIndex];
      if (cardElement) {
        console.log('🖱️ Programmatically clicking card', selectionIndex);
        cardElement.click();
      } else {
        console.warn('⚠️ Card ref not found, falling back to direct navigation');
        // Fallback: navigate directly using itemId or id
        const itemIdOrId = selectedItem.itemId || selectedItem.id;
        if (itemIdOrId) {
          const detailRoute = `/food/${itemIdOrId}`;
          console.log('🚀 Navigating to food detail:', detailRoute);
          handleNavigation(detailRoute);
        }
      }
      
      // Close voice assistant after navigation
      setTimeout(() => {
        setSelectedIndex(null);
        closeVoiceAssistant();
      }, 500);
    }, 400);
  };

  // Function to extract food names from Mom's speech and fetch matching items
  const parseAndFetchFoodMentions = async (messageText) => {
    if (!messageText || typeof messageText !== 'string') return;
    
    console.log("Parsing Mom's message for food mentions:", messageText);
    
    // Common food-related keywords that indicate recommendations or food offerings
    const recommendationPatterns = [
      /recommend/i,
      /suggest/i,
      /try/i,
      /how about/i,
      /top \d+/i,
      /here are/i,
      /found/i,
      /got.*(?:chicken|rice|noodle|fish|meat|tofu|veggie|vegetable|soup|curry|salad|pasta|bread|egg)/i,
      /(?:auntie|uncle|chef|house).*got/i,
      /which one you (?:prefer|want|like)/i,
      /or.*got/i,
      /can (?:try|eat|order)/i,
      /available/i,
      /serve/i,
      /menu/i,
      /dish/i,
    ];

    const hasRecommendation = recommendationPatterns.some(pattern => pattern.test(messageText));
    
    if (!hasRecommendation) {
      console.log("No recommendation pattern detected");
      return;
    }

    try {
      // Call backend to search for food items mentioned in the text
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/voice-agent/parse-food-mentions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: messageText,
          limit: 3
        }),
      });

      if (!response.ok) {
        console.error("Failed to parse food mentions:", response.status);
        return;
      }

      const data = await response.json();
      console.log("Parsed food mentions result:", data);

      if (data.success && data.items && data.items.length > 0) {
        console.log("Found matching food items:", data.items);
        updateRecommendations(data.items);
      }
    } catch (error) {
      console.error("Error parsing food mentions:", error);
    }
  };

  // Initialize ElevenLabs conversation
  const conversation = useConversation({
    onConnect: () => {
      console.log("Voice Assistant Connected");
    },
    onDisconnect: () => {
      console.log("Voice Assistant Disconnected");
    },
    onMessage: (message) => {
      console.log("Voice Assistant Message:", message);
      
      // Get the raw message text
      const messageText = typeof message.message === 'string' ? message.message : '';
      const messageTextLower = messageText.toLowerCase();
      
      // Check for goodbye/close keywords
      if (messageTextLower.includes('bye') || messageTextLower.includes('goodbye') || messageTextLower.includes('see you') || messageTextLower.includes('close')) {
        console.log("Detected goodbye, closing modal...");
        setTimeout(() => {
          handleClose();
        }, 1500); // Small delay so user hears the goodbye response
        return;
      }
      
      // PRIORITY 1: Check if user is making a selection (when recommendations are showing)
      if (messageText && recommendations.length > 0) {
        console.log("📋 Checking for selection command (", recommendations.length, "items available)");
        const selectionResult = parseSelectionCommand(messageText);
        if (selectionResult !== null) {
          console.log(`🎯 Selection detected! Type: ${selectionResult.type}, Index: ${selectionResult.value}`);
          handleVoiceSelection(selectionResult.value);
          return; // Stop processing to avoid conflicts
        }
      }
      
      // PRIORITY 2: Parse Mom's speech for food mentions (when she talks about specific dishes)
      if (message.source === 'ai' && messageText) {
        parseAndFetchFoodMentions(messageText);
      }
      
      // Handle all message types
      try {
        let data = message.message;
        
        // Try to parse if it's a string
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch (e) {
            // Not JSON, that's okay - already handled above
          }
        }
        
        // Check if this is recommendations (structured data from agent)
        if (data?.items && Array.isArray(data.items) && data.items.length > 0) {
          console.log("Found recommendations in message:", data.items);
          
          // Format items for display
          const formattedItems = data.items.slice(0, 3).map(item => ({
            id: item.id,
            name: item.name || item.dish || item.item || 'Item',
            house: item.house || item.cleaner || item.ownerBlock || 'Available',
            price: item.price || 'Free',
            eta: item.eta || item.time || item.date || item.condition || '30 min',
            rating: item.rating || 5.0,
          }));
          
          updateRecommendations(formattedItems);
        }
        
        // Handle navigation
        if (data?.route) {
          console.log("Navigating to:", data.route);
          handleNavigation(data.route);
        }
      } catch (e) {
        console.error("Error parsing message:", e);
      }
    },
    onAgentToolResponse: (response) => {
      console.log("🔧 Agent Tool Response (raw):", JSON.stringify(response, null, 2));
      
      // Extract tool response data - ElevenLabs wraps it in different ways
      try {
        // Try multiple ways to extract the data
        let toolData = response;
        
        // Check common ElevenLabs response wrappers
        if (response.return_value) {
          console.log("Found return_value wrapper");
          toolData = typeof response.return_value === 'string' ? JSON.parse(response.return_value) : response.return_value;
        } else if (response.result) {
          console.log("Found result wrapper");
          toolData = typeof response.result === 'string' ? JSON.parse(response.result) : response.result;
        } else if (response.output) {
          console.log("Found output wrapper");
          try {
            toolData = typeof response.output === 'string' ? JSON.parse(response.output) : response.output;
          } catch (e) {
            toolData = response.output;
          }
        }
        
        console.log("✅ Extracted tool data:", toolData);
        
        // Check if this has items array (food, cleaning, or exchange)
        if (toolData?.items && Array.isArray(toolData.items) && toolData.items.length > 0) {
          const items = toolData.items.slice(0, 3);
          
          // Format items to ensure they have the required fields for display
          const formattedItems = items.map(item => {
            // If it's already properly formatted (has 'name' field)
            if (item.name) {
              return {
                ...item,
                name: item.name,
                house: item.house || item.cleaner || item.ownerBlock || 'Available',
                price: item.price || 'Free',
                eta: item.eta || item.time || item.date || '30 min',
                rating: item.rating || 5.0,
              };
            }
            
            // For cleaning slots
            if (item.cleaner) {
              return {
                id: item.id,
                name: `Cleaning Service - ${item.time}`,
                house: item.cleaner,
                price: item.price,
                eta: item.date || 'Today',
                rating: 5.0,
              };
            }
            
            // For exchange items (if item.name exists but refers to exchange item name)
            if (item.ownerBlock) {
              return {
                id: item.id,
                name: item.name || item.item,
                house: `Block ${item.ownerBlock}`,
                price: item.price || 'Free',
                eta: item.condition || 'Good condition',
                rating: 4.5,
              };
            }
            
            return item;
          });
          
          console.log("🎉 Formatted items for display:", formattedItems);
          console.log("📋 Number of recommendations to show:", formattedItems.length);
          updateRecommendations(formattedItems);
          console.log("✅ Recommendations updated! Cards should now be visible.");
        } else {
          console.log("❌ No items found in tool data or items array is empty");
        }
      } catch (e) {
        console.error("❌ Error parsing tool response:", e);
      }
    },
    onError: (error) => {
      console.error("Voice Assistant Error:", error);
    },
    onStatusChange: (status) => {
      console.log("Voice Assistant Status:", status);
    },
    onDebug: (debug) => {
      console.log("Voice Assistant Debug:", debug);
    },
  });

  useEffect(() => {
    // Handle escape key to close modal
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  useEffect(() => {
    // Start session when modal opens
    if (isOpen && agentId && conversation.status === "disconnected") {
      conversation.startSession({ agentId }).catch((error) => {
        console.error("Failed to start conversation:", error);
      });
    }
    
    // End session when modal closes
    if (!isOpen && conversation.status === "connected") {
      conversation.endSession().catch((error) => {
        console.error("Failed to end conversation:", error);
      });
      // Don't clear recommendations when closing - keep them visible on home screen
    }
  }, [isOpen, agentId, conversation.status]);

  const handleClose = () => {
    if (conversation.status === "connected") {
      conversation.endSession().catch(console.error);
    }
    closeVoiceAssistant();
  };

  const toggleMic = () => {
    // The mic is controlled by the conversation state
    // For now, we'll just show status
    console.log("Mic status:", conversation.micMuted ? "Muted" : "Active");
  };

  if (!agentId) {
    console.error("VITE_ELEVENLABS_AGENT_ID is not set");
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={closeVoiceAssistant}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, type: "spring", damping: 25 }}
              className="fixed inset-4 sm:inset-10 md:inset-20 bg-gradient-to-b from-[#1A1A1A] to-[#0F0F0F] rounded-3xl border border-[#FF6B35]/20 shadow-2xl z-50 flex flex-col overflow-hidden"
            >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#FF6B35]/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FFB84D] flex items-center justify-center">
                  <span className="text-2xl">🎤</span>
                </div>
                <div>
                  <h2 className="text-white text-lg font-semibold">
                    AI Mom Voice Assistant
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-gray-400">
                      Ready to help you
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={closeVoiceAssistant}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Voice Assistant Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden">
              {/* Animated Avatar */}
              <motion.div
                animate={{
                  scale: conversation.isSpeaking ? [1, 1.1, 1] : [1, 1.05, 1],
                  boxShadow: conversation.isSpeaking
                    ? [
                        "0 0 0 0 rgba(255, 107, 53, 0.7)",
                        "0 0 0 30px rgba(255, 107, 53, 0)",
                        "0 0 0 0 rgba(255, 107, 53, 0.7)",
                      ]
                    : [
                        "0 0 0 0 rgba(255, 107, 53, 0.4)",
                        "0 0 0 20px rgba(255, 107, 53, 0)",
                        "0 0 0 0 rgba(255, 107, 53, 0.4)",
                      ],
                }}
                transition={{
                  duration: conversation.isSpeaking ? 1 : 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-[#FF6B35] via-[#FFB84D] to-[#FFC857] mb-8 flex items-center justify-center"
              >
                <span className="text-6xl sm:text-7xl">👩</span>
              </motion.div>

              {/* Status Display */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2D2D2D] rounded-full border border-[#FF6B35]/20">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      conversation.status === "connected"
                        ? "bg-green-500 animate-pulse"
                        : conversation.status === "connecting"
                        ? "bg-yellow-500 animate-pulse"
                        : "bg-gray-500"
                    }`}
                  />
                  <span className="text-sm text-white">
                    {conversation.status === "connected" && "Listening..."}
                    {conversation.status === "connecting" && "Connecting..."}
                    {conversation.status === "disconnected" && "Ready"}
                  </span>
                  {conversation.isSpeaking && (
                    <span className="text-xs text-[#FF6B35]">Speaking</span>
                  )}
                </div>
              </div>

              {/* Mic Control */}
              <button
                onClick={toggleMic}
                disabled={conversation.status !== "connected"}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all mb-6 ${
                  conversation.status === "connected"
                    ? "bg-gradient-to-br from-[#FF6B35] to-[#FFB84D] hover:opacity-90 cursor-pointer"
                    : "bg-gray-600 cursor-not-allowed opacity-50"
                }`}
              >
                {conversation.micMuted ? (
                  <MicOff className="w-8 h-8 text-white" />
                ) : (
                  <Mic className="w-8 h-8 text-white" />
                )}
              </button>

              {/* Food Recommendations Bubbles */}
              <AnimatePresence mode="wait">
                {recommendations.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-lg space-y-3 mb-4"
                  >
                    <p className="text-center text-white text-sm mb-2">
                      🍽️ Mom's Recommendations for You:
                    </p>
                     {recommendations.map((food, index) => (
                      <motion.button
                        key={food.id || index}
                        ref={(el) => (cardRefs.current[index] = el)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ 
                          opacity: 1, 
                          x: 0,
                          scale: selectedIndex === index ? 1.05 : 1
                        }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          // Navigate to food detail page using itemId or id
                          const itemIdOrId = food.itemId || food.id;
                          const detailRoute = `/food/${itemIdOrId}`;
                          console.log('🍽️ Card clicked - navigating to food detail:', detailRoute);
                          console.log('Food data:', { itemId: food.itemId, id: food.id, name: food.name });
                          handleNavigation(detailRoute);
                          // Close voice assistant after navigation
                          setTimeout(() => {
                            closeVoiceAssistant();
                          }, 300);
                        }}
                        className={`w-full bg-gradient-to-r from-[#2D2D2D] to-[#1A1A1A] border rounded-xl p-4 text-left transition-all group ${
                          selectedIndex === index 
                            ? 'border-green-500 shadow-lg shadow-green-500/30 ring-2 ring-green-500/50' 
                            : 'border-[#FF6B35]/30 hover:border-[#FF6B35]/60'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#FFB84D] rounded-lg flex items-center justify-center text-2xl shrink-0">
                            {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-semibold mb-1 group-hover:text-[#FF6B35] transition-colors">
                              {food.name}
                            </h4>
                            <p className="text-xs text-gray-400 mb-2">
                              From {food.house}
                            </p>
                            <div className="flex items-center gap-3 text-xs">
                              <span className="flex items-center gap-1 text-[#FFB84D]">
                                <Star className="w-3 h-3 fill-current" />
                                {food.rating || 5.0}
                              </span>
                              <span className="text-[#FF6B35] font-semibold">
                                {food.price}
                              </span>
                              <span className="text-gray-500">
                                {food.eta}
                              </span>
                            </div>
                          </div>
                            {selectedIndex === index ? (
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shrink-0 animate-pulse">
                                <span className="text-white text-xl">✓</span>
                              </div>
                            ) : (
                              <ShoppingCart className="w-5 h-5 text-[#FF6B35] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                            )}
                        </div>
                      </motion.button>
                    ))}
                     <p className="text-center text-xs text-gray-500 mt-3">
                      💬 Say "I want chicken rice" or "the first one" or tap any dish
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Instructions */}
              <div className="mt-4 text-center max-w-lg">
                <p className="text-white text-sm mb-3">
                  {conversation.status === "connected"
                    ? recommendations.length > 0
                      ? "Tell me which one you want, or ask for something else!"
                      : "Start talking - I'm listening!"
                    : conversation.status === "connecting"
                    ? "Connecting to Mom AI..."
                    : "Click the mic icon above to connect"}
                </p>
                {recommendations.length === 0 && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap justify-center gap-2">
                      <span className="px-3 py-1 bg-[#FF6B35]/10 border border-[#FF6B35]/30 rounded-full text-xs text-[#FF6B35]">
                        "What should I eat?"
                      </span>
                      <span className="px-3 py-1 bg-[#FF6B35]/10 border border-[#FF6B35]/30 rounded-full text-xs text-[#FF6B35]">
                        "I want chicken rice"
                      </span>
                      <span className="px-3 py-1 bg-[#FF6B35]/10 border border-[#FF6B35]/30 rounded-full text-xs text-[#FF6B35]">
                        "Show me the laksa"
                      </span>
                    </div>
                    {/* Test button to show sample recommendations */}
                    <button
                      onClick={() => {
                        updateRecommendations([
                          {
                            id: "test1",
                            name: "Hainanese Chicken Rice",
                            house: "Auntie Mei",
                            price: "$6.50",
                            eta: "20 min",
                            distance: "0.5 km",
                            rating: 5.0,
                          },
                          {
                            id: "test2",
                            name: "Nasi Lemak",
                            house: "Uncle Wong",
                            price: "$5.00",
                            eta: "15 min",
                            distance: "0.3 km",
                            rating: 4.8,
                          },
                          {
                            id: "test3",
                            name: "Laksa",
                            house: "Auntie Siti",
                            price: "$7.00",
                            eta: "25 min",
                            distance: "0.8 km",
                            rating: 4.9,
                          },
                        ]);
                      }}
                      className="px-4 py-2 bg-[#2D2D2D] hover:bg-[#3D3D3D] text-white text-xs rounded-full border border-[#FF6B35]/30 transition-colors"
                    >
                      👀 Preview Food Cards
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Footer hint */}
            <div className="p-4 text-center border-t border-[#FF6B35]/10">
              <p className="text-xs text-gray-500">
                Press ESC or click outside to close • Powered by ElevenLabs
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

