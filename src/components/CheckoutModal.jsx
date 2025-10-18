import { useState } from "react";
import { motion } from "framer-motion";
import { X, Wallet, CreditCard, Shield, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";

export function CheckoutModal({ food, onClose, onPaymentSuccess }) {
  const [selectedPayment, setSelectedPayment] = useState("wallet");
  const [processing, setProcessing] = useState(false);

  const handleConfirmPayment = async () => {
    // Safety check for availability
    if (!food.available) {
      alert('Sorry, this item is no longer available.');
      onClose();
      return;
    }

    setProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setProcessing(false);
    onPaymentSuccess();
  };

  if (!food) return null;
  
  // Double check availability
  if (!food.available) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-[#0F0F0F] w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FF6B35] to-[#FFB84D] px-6 py-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Wallet className="w-6 h-6 text-white" />
              <h2 className="text-white text-xl font-bold">Cash Out</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          <p className="text-white/90 text-sm">Complete your payment</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Total Amount */}
          <div className="bg-[#1A1A1A] rounded-2xl p-5 border border-[#FF6B35]/20">
            <p className="text-gray-400 text-sm mb-2">Total Amount</p>
            <p className="text-white text-4xl font-bold">{food.price}</p>
          </div>

          {/* Payment Methods */}
          <div>
            <p className="text-gray-400 text-sm mb-3">Select Payment Method</p>
            
            {/* MOM Wallet */}
            <button
              onClick={() => setSelectedPayment("wallet")}
              className={`w-full p-4 rounded-2xl border-2 transition-all mb-3 ${
                selectedPayment === "wallet"
                  ? "border-[#FF6B35] bg-[#FF6B35]/10"
                  : "border-gray-700 bg-[#1A1A1A]"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FFB84D] flex items-center justify-center shrink-0">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-semibold">MOM Wallet</p>
                  <p className="text-gray-400 text-sm">Balance: $125.00</p>
                </div>
                {selectedPayment === "wallet" && (
                  <div className="bg-[#FF6B35] text-white text-xs px-3 py-1 rounded-full">
                    Recommended
                  </div>
                )}
              </div>
            </button>

            {/* Credit/Debit Card */}
            <button
              onClick={() => setSelectedPayment("card")}
              className={`w-full p-4 rounded-2xl border-2 transition-all ${
                selectedPayment === "card"
                  ? "border-[#FF6B35] bg-[#FF6B35]/10"
                  : "border-gray-700 bg-[#1A1A1A]"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-semibold">Credit/Debit Card</p>
                  <p className="text-gray-400 text-sm">•••• 4242</p>
                </div>
              </div>
            </button>
          </div>

          {/* Secure Payment Notice */}
          <div className="bg-green-500/10 rounded-2xl p-4 border border-green-500/30">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-green-500 shrink-0" />
              <div>
                <p className="text-green-500 font-semibold text-sm">Secure Payment</p>
                <p className="text-green-500/80 text-xs">Protected by MOM Pay</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={processing}
              className="flex-1 h-14 text-base font-semibold bg-[#2D2D2D] border-gray-700 text-white hover:bg-[#3D3D3D]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmPayment}
              disabled={processing}
              className="flex-1 h-14 text-base font-semibold"
              style={{
                background: "linear-gradient(135deg, #FF6B35 0%, #FFB84D 100%)",
              }}
            >
              {processing ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                "Confirm Payment"
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

