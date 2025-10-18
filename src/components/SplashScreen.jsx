import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Mail, Lock, Chrome, Loader2, LogIn } from "lucide-react";
import { useState } from "react";

export function SplashScreen() {
  const navigate = useNavigate();
  const { login, error: authError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        navigate('/home');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    // TODO: Implement Google OAuth
    // This will need to be connected to your backend Google OAuth endpoint
    setError("Google authentication coming soon!");
  };

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

      {/* Login Form */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="w-full max-w-sm space-y-4"
      >
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12 bg-[#2D2D2D] border-gray-700 text-white"
              required
              disabled={loading}
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12 bg-[#2D2D2D] border-gray-700 text-white"
              required
              disabled={loading}
            />
          </div>

          {/* Error Message */}
          {(error || authError) && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error || authError}</p>
            </div>
          )}

          {/* Login Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 relative overflow-hidden group text-lg"
            style={{
              background: "linear-gradient(135deg, #FF6B35 0%, #FFB84D 100%)",
              border: "1px solid rgba(0, 217, 255, 0.3)",
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Logging in...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <LogIn className="w-5 h-5" />
                <span>Call Mom</span>
                <span className="text-xl">📞</span>
              </span>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
          <span className="text-sm text-gray-500">or continue with</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
        </div>

        {/* Google Auth Button */}
        <Button
          type="button"
          onClick={handleGoogleAuth}
          variant="outline"
          className="w-full h-12 border-gray-700 hover:bg-[#2D2D2D] hover:border-[#FF6B35]/50 transition-all"
          disabled={loading}
        >
          <Chrome className="w-5 h-5 mr-2" />
          <span className="text-white">Continue with Google</span>
        </Button>

        {/* Register Link */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-[#FF6B35] hover:text-[#FFB84D] font-semibold transition-colors"
            >
              Register here
            </Link>
          </p>
        </div>

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

