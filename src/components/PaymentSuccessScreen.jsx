import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export function PaymentSuccessScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showContent, setShowContent] = useState(false);
  const food = location.state?.food;

  useEffect(() => {
    // Show content after animation
    const timer = setTimeout(() => setShowContent(true), 500);
    
    // Auto-navigate to order tracking after 3 seconds
    const navTimer = setTimeout(() => {
      navigate('/order-tracking', { 
        state: { food },
        replace: true 
      });
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(navTimer);
    };
  }, [navigate, food]);

  // Confetti particles
  const confettiCount = 50;
  const confettiColors = ["#FF6B35", "#FFB84D", "#4CAF50", "#2196F3", "#9C27B0"];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Confetti Animation */}
      {showContent && (
        <>
          {[...Array(confettiCount)].map((_, i) => {
            const randomColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            const randomDelay = Math.random() * 0.5;
            const randomDuration = 2 + Math.random() * 2;
            const randomX = Math.random() * 100;
            const randomRotation = Math.random() * 360;
            
            return (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  backgroundColor: randomColor,
                  left: `${randomX}%`,
                  top: "-20px",
                }}
                initial={{ y: -20, opacity: 1, rotate: 0 }}
                animate={{
                  y: window.innerHeight + 50,
                  opacity: [1, 1, 0],
                  rotate: randomRotation,
                  x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50],
                }}
                transition={{
                  duration: randomDuration,
                  delay: randomDelay,
                  ease: "linear",
                }}
              />
            );
          })}
          
          {/* Floating stars */}
          {[...Array(10)].map((_, i) => {
            const randomX = Math.random() * 100;
            const randomY = Math.random() * 100;
            const randomDelay = Math.random() * 0.5;
            
            return (
              <motion.div
                key={`star-${i}`}
                className="absolute text-2xl"
                style={{
                  left: `${randomX}%`,
                  top: `${randomY}%`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1.2, 1],
                  opacity: [0, 1, 0],
                  y: [0, -30, -60],
                }}
                transition={{
                  duration: 2,
                  delay: randomDelay,
                  ease: "easeOut",
                }}
              >
                ⭐
              </motion.div>
            );
          })}

          {/* Floating emojis */}
          {["🎉", "💐", "&"].map((emoji, i) => {
            const positions = [
              { x: "15%", y: "50%" },
              { x: "85%", y: "65%" },
              { x: "50%", y: "80%" },
            ];
            
            return (
              <motion.div
                key={`emoji-${i}`}
                className="absolute text-4xl"
                style={{
                  left: positions[i].x,
                  top: positions[i].y,
                }}
                initial={{ scale: 0, opacity: 0, rotate: 0 }}
                animate={{ 
                  scale: [0, 1.2, 1],
                  opacity: [0, 1, 0.8],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 1.5,
                  delay: 0.3 + i * 0.2,
                  ease: "easeOut",
                }}
              >
                {emoji}
              </motion.div>
            );
          })}
        </>
      )}

      {/* Main Content */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring",
          damping: 15,
          stiffness: 200,
          delay: 0.2,
        }}
        className="relative z-10 text-center px-6"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            damping: 12,
            stiffness: 200,
            delay: 0.4,
          }}
          className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FFB84D] mb-8 shadow-2xl"
        >
          <CheckCircle className="w-20 h-20 text-white" strokeWidth={2.5} />
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h1 className="text-white text-3xl font-bold mb-3">
            Payment Successful! 🎉
          </h1>
          <motion.p
            className="text-gray-400 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Mom is preparing your meal with love
          </motion.p>

          {/* Loading dots */}
          <motion.div
            className="flex justify-center gap-2 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-[#FF6B35]"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Gradient background blur circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-[#FF6B35]/20 blur-3xl"
          style={{ top: "20%", left: "10%" }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-[#FFB84D]/20 blur-3xl"
          style={{ bottom: "20%", right: "10%" }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}

