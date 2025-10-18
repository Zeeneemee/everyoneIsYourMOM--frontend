import { createContext, useContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const VoiceAssistantContext = createContext(null);

export function VoiceAssistantProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [sharedRecommendations, setSharedRecommendations] = useState([]);
  const navigate = useNavigate();

  const openVoiceAssistant = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeVoiceAssistant = useCallback(() => {
    setIsOpen(false);
  }, []);

  const updateRecommendations = useCallback((recommendations) => {
    console.log("🔄 VoiceAssistantContext - Updating recommendations:", recommendations);
    console.log("📊 Number of items:", recommendations?.length || 0);
    setSharedRecommendations(recommendations);
    console.log("✅ Recommendations state updated");
  }, []);

  const clearRecommendations = useCallback(() => {
    setSharedRecommendations([]);
  }, []);

  const handleNavigation = useCallback(
    (route) => {
      console.log("Voice Assistant - Navigating to:", route);
      navigate(route);
      // Modal closing is handled by the component that calls this
    },
    [navigate]
  );

  const handleToolCall = useCallback(
    (toolName, toolArgs) => {
      console.log("Voice Assistant - Tool Called:", toolName, toolArgs);

      // Handle navigation commands
      if (toolName === "navigate" && toolArgs.route) {
        handleNavigation(toolArgs.route);
      }
    },
    [handleNavigation]
  );

  const value = {
    isOpen,
    openVoiceAssistant,
    closeVoiceAssistant,
    currentPage,
    setCurrentPage,
    handleNavigation,
    handleToolCall,
    sharedRecommendations,
    updateRecommendations,
    clearRecommendations,
  };

  return (
    <VoiceAssistantContext.Provider value={value}>
      {children}
    </VoiceAssistantContext.Provider>
  );
}

export function useVoiceAssistant() {
  const context = useContext(VoiceAssistantContext);
  if (!context) {
    throw new Error(
      "useVoiceAssistant must be used within a VoiceAssistantProvider"
    );
  }
  return context;
}

