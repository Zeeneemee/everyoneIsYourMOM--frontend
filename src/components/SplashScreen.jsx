import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AIMomAvatar } from "./AIMomAvatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Mail, Phone, Chrome } from "lucide-react";

export function SplashScreen() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0F0F] via-[#1A1A1A] to-[#0F0F0F] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 right-10 w-32 h-32 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255, 107, 53, 0.1) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute bottom-32 left-10 w-24 h-24 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(0, 217, 255, 0.1) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: 1
        }}
      />

      {/* App Name */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-5xl mb-4 font-bold bg-gradient-to-r from-[#FF6B35] via-[#FFB84D] to-[#FFC857] bg-clip-text text-transparent"
      >
        Mom
      </motion.h1>

      {/* Tagline */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-xl text-gray-300 mb-2 text-center"
      >
        Everyone can be your Mom
      </motion.p>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="text-sm text-gray-500 mb-12 text-center max-w-xs"
      >
        AI-powered comfort on demand. Your personal assistant for food, cleaning, and everyday care. 💝
      </motion.p>

      {/* Login Options */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="w-full max-w-sm space-y-4"
      >
        {/* Email Input */}
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <Input
            type="email"
            placeholder="Enter your email"
            className="pl-10 h-12"
          />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
          <span className="text-sm text-gray-500">or continue with</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-12"
          >
            <Phone className="w-5 h-5 mr-2" />
            Phone
          </Button>
          <Button
            variant="outline"
            className="h-12"
          >
            <Chrome className="w-5 h-5 mr-2" />
            Google
          </Button>
        </div>

        {/* Main CTA */}
        <Button
          onClick={() => navigate('/home')}
          className="w-full h-14 mt-6 relative overflow-hidden group text-lg"
          style={{
            background: "linear-gradient(135deg, #FF6B35 0%, #FFB84D 100%)",
            border: "1px solid rgba(0, 217, 255, 0.3)",
          }}
        >
          <span className="flex items-center justify-center gap-2">
            <span>Call Mom</span>
            <span className="text-xl">📞</span>
          </span>
        </Button>

        {/* Terms */}
        <p className="text-xs text-gray-600 text-center mt-6">
          By continuing, you agree to Mom's Terms of Service and Privacy Policy
        </p>
      </motion.div>

      {/* Tech accent lines */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF6B35] to-transparent opacity-30" />
    </div>
  );
}

