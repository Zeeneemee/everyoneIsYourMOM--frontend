import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function AIMomAvatar({ 
  size = "md", 
  animate = true,
  emotion = "neutral" 
}) {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32"
  };

  const glowSize = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-28 h-28",
    xl: "w-36 h-36"
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Animated glow effect */}
      {animate && (
        <motion.div
          className={`absolute ${glowSize[size]} rounded-full`}
          style={{
            background: "radial-gradient(circle, rgba(255, 107, 53, 0.3) 0%, rgba(255, 184, 77, 0.1) 50%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      {/* Avatar container */}
      <motion.div
        className={`relative ${sizeClasses[size]} rounded-full overflow-hidden`}
        style={{
          background: "linear-gradient(135deg, #FF6B35 0%, #FFB84D 50%, #FFC857 100%)",
          border: "2px solid rgba(0, 217, 255, 0.3)",
          boxShadow: "0 0 20px rgba(255, 107, 53, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.1)"
        }}
        animate={animate ? {
          rotate: emotion === "excited" ? [0, 5, -5, 0] : 0,
        } : {}}
        transition={{
          duration: 0.5,
          repeat: emotion === "excited" ? Infinity : 0,
          repeatDelay: 1
        }}
      >
        {/* Mom icon/emoji */}
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <span className={`${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-2xl' : size === 'lg' ? 'text-4xl' : 'text-5xl'}`}>
            {emotion === "happy" ? "😊" : emotion === "excited" ? "🤗" : emotion === "thinking" ? "🤔" : "💝"}
          </span>
        </div>

        {/* Sparkle effect */}
        {animate && (
          <motion.div
            className="absolute top-0 right-0"
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 2
            }}
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
          </motion.div>
        )}
      </motion.div>

      {/* Tech accent ring */}
      {animate && (
        <motion.div
          className={`absolute ${sizeClasses[size]} rounded-full border-2 border-cyan-400`}
          style={{
            opacity: 0.3
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
      )}
    </div>
  );
}

