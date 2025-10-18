import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, CheckCircle, MapPin, Package, Truck, Home } from "lucide-react";
import { Button } from "./ui/button";

export function OrderTrackingScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const food = location.state?.food;
  const [orderStatus, setOrderStatus] = useState("preparing");
  const [progress, setProgress] = useState(50);
  const [etaMinutes, setEtaMinutes] = useState(25);

  useEffect(() => {
    // Simulate order progress
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 2;
      });
      
      setEtaMinutes((prev) => {
        if (prev <= 0) return 0;
        return Math.max(0, prev - 0.5);
      });
    }, 3000);

    // Simulate status changes
    const statusTimer = setTimeout(() => {
      setOrderStatus("out-for-delivery");
      setProgress(75);
    }, 10000);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(statusTimer);
    };
  }, []);

  if (!food) {
    navigate("/food");
    return null;
  }

  const orderSteps = [
    {
      id: "placed",
      label: "Order Placed",
      icon: CheckCircle,
      status: "completed",
      time: "Just now",
    },
    {
      id: "preparing",
      label: "Preparing...",
      icon: Package,
      status: orderStatus === "preparing" ? "in-progress" : "completed",
      time: orderStatus === "preparing" ? "In progress" : "Completed",
    },
    {
      id: "out-for-delivery",
      label: "Out for Delivery",
      icon: Truck,
      status: orderStatus === "out-for-delivery" ? "in-progress" : "pending",
      time: orderStatus === "out-for-delivery" ? "In progress" : "Waiting...",
    },
    {
      id: "delivered",
      label: "Delivered",
      icon: Home,
      status: "pending",
      time: "Pending...",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#1A1A1A] to-[#0F0F0F] px-6 py-4 border-b border-[#FF6B35]/10 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate("/food")}
            className="w-10 h-10 rounded-full bg-[#2D2D2D] flex items-center justify-center hover:bg-[#3D3D3D] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-white text-xl font-bold">Order Tracking</h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center animate-pulse">
            <div className="w-3 h-3 bg-white rounded-full" />
          </div>
        </div>
        <p className="text-gray-400 text-sm text-center">Your meal is on the way!</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] rounded-3xl p-6 border border-[#FF6B35]/20"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FFB84D] flex items-center justify-center shrink-0">
              <span className="text-3xl">👩‍🍳</span>
            </div>
            <div className="flex-1">
              <h2 className="text-white text-lg font-bold mb-1">
                Mom is cooking your meal
              </h2>
              <p className="text-gray-400 text-sm">
                Order confirmed & in progress
              </p>
            </div>
          </div>

          {/* Order Steps */}
          <div className="space-y-4">
            {orderSteps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = step.status === "completed";
              const isInProgress = step.status === "in-progress";
              const isPending = step.status === "pending";

              return (
                <div key={step.id} className="flex items-center gap-4">
                  <div className="relative">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? "bg-gradient-to-br from-[#FF6B35] to-[#FFB84D]"
                          : isInProgress
                          ? "bg-gradient-to-br from-[#FF6B35] to-[#FFB84D] animate-pulse"
                          : "bg-[#2D2D2D]"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          isCompleted || isInProgress
                            ? "text-white"
                            : "text-gray-600"
                        }`}
                      />
                    </motion.div>
                    {index < orderSteps.length - 1 && (
                      <div
                        className={`absolute left-1/2 top-full w-0.5 h-8 -translate-x-1/2 ${
                          isCompleted
                            ? "bg-gradient-to-b from-[#FF6B35] to-[#FFB84D]"
                            : "bg-[#2D2D2D]"
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-semibold ${
                        isCompleted || isInProgress
                          ? "text-white"
                          : "text-gray-600"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p
                      className={`text-sm ${
                        isCompleted || isInProgress
                          ? "text-gray-400"
                          : "text-gray-700"
                      }`}
                    >
                      {step.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#1A1A1A] rounded-3xl p-6 border border-[#FF6B35]/10"
        >
          <h3 className="text-white font-bold text-lg mb-4">Order Details</h3>
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2D2D2D] to-[#1A1A1A] flex items-center justify-center overflow-hidden shrink-0">
              {food.image ? (
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl">🍽️</span>
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-white font-semibold mb-1">{food.name}</h4>
              <p className="text-gray-400 text-sm mb-2">by {food.house}</p>
              <p className="text-[#FFB84D] font-bold text-xl">{food.price}</p>
            </div>
          </div>
        </motion.div>

        {/* ETA Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-[#FF6B35]/10 to-[#FFB84D]/10 rounded-3xl p-6 border border-[#FF6B35]/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FFB84D] flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Estimated Time</p>
                <p className="text-white font-bold text-2xl">
                  ETA: {Math.round(etaMinutes)} mins
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm mb-1">Status</p>
              <div className="bg-gradient-to-r from-[#FF6B35] to-[#FFB84D] text-white text-sm font-semibold px-3 py-1 rounded-full">
                {orderStatus === "preparing" ? "Preparing" : "On the way"}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="h-2 bg-[#2D2D2D] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#FF6B35] to-[#FFB84D]"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-gray-400 text-xs mt-2 text-center">
              Your meal will be ready soon! 👨‍🍳
            </p>
          </div>
        </motion.div>

        {/* Live Delivery Tracking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#1A1A1A] rounded-3xl overflow-hidden border border-[#FF6B35]/10"
        >
          <div className="p-5 border-b border-gray-800">
            <h3 className="text-white font-bold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#FF6B35]" />
              Live Delivery Tracking 👩‍🍳
            </h3>
          </div>

          {/* Map Placeholder */}
          <div className="relative h-64 bg-gradient-to-br from-[#2D2D2D] to-[#1A1A1A] flex items-center justify-center">
            {/* Location Pin */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute"
              style={{ top: "40%", left: "50%" }}
            >
              <div className="relative -translate-x-1/2 -translate-y-full">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FFB84D] flex items-center justify-center shadow-2xl">
                  <span className="text-3xl">👩‍🍳</span>
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#FF6B35] rotate-45" />
              </div>
            </motion.div>

            {/* Destination */}
            <div className="absolute bottom-8 right-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/20 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">
                  Mom's Kitchen • {food.distance}
                </span>
              </div>
            </div>

            {/* Your Location */}
            <div className="absolute top-8 left-8">
              <div className="bg-green-500/20 backdrop-blur-sm rounded-2xl px-4 py-2 border border-green-500/50 flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-white text-sm font-medium">Your Location</span>
              </div>
            </div>

            {/* Animated Route Line */}
            <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
              <motion.line
                x1="20%"
                y1="30%"
                x2="50%"
                y2="40%"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeDasharray="8 4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF6B35" />
                  <stop offset="100%" stopColor="#FFB84D" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </motion.div>

        {/* Contact Button */}
        <Button
          className="w-full h-14 text-base font-semibold"
          variant="outline"
          onClick={() => alert("Contact feature coming soon!")}
          style={{
            background: "transparent",
            border: "2px solid #FF6B35",
            color: "white",
          }}
        >
          Contact Mom
        </Button>
      </div>
    </div>
  );
}

