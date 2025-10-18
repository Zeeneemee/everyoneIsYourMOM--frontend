import { motion } from "framer-motion";
import { X, Star, Clock, MapPin, Heart, Flame, Users, ChefHat } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export function FoodDetailModal({ food, onClose, onOrderNow }) {
  if (!food) return null;

  // Parse nutrition info
  const calories = food.calories?.replace(/[^0-9]/g, '') || '650';
  const protein = food.protein?.replace(/[^0-9]/g, '') || '28';
  const carbs = food.carbs || '72';
  const fat = food.fat || '18';

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
        className="bg-[#0F0F0F] w-full max-w-md max-h-[95vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="relative h-80 bg-gradient-to-br from-[#2D2D2D] to-[#1A1A1A] flex items-center justify-center overflow-hidden">
          {food.image ? (
            <img 
              src={food.image} 
              alt={food.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML += '<div class="text-9xl opacity-40">🍽️</div>';
              }}
            />
          ) : (
            <div className="text-9xl opacity-40">🍽️</div>
          )}
          
          {/* Top overlay badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="flex gap-2">
              {food.tags && food.tags[0] && (
                <Badge className="bg-gradient-to-r from-[#FF6B35] to-[#FFB84D] text-white border-none px-3 py-1">
                  {food.tags[0]}
                </Badge>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Heart icon */}
          <button className="absolute top-4 right-16 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors">
            <Heart className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title and Price */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-white text-2xl font-bold flex-1">{food.name}</h2>
              <div className="text-3xl font-bold text-[#FFB84D]">{food.price}</div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {food.eta}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {food.distance}
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                {food.rating}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gradient-to-br from-[#FF6B35]/10 to-[#FFB84D]/10 rounded-2xl p-4 border border-[#FF6B35]/20">
            <div className="flex gap-3">
              <div className="text-2xl shrink-0">😊</div>
              <div>
                <h3 className="text-white font-semibold mb-1 flex items-center gap-2">
                  Why Mom chose this for you
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {food.momMessage || `${food.house} makes this really well! You'll love it.`}
                </p>
              </div>
            </div>
          </div>

          {/* Nutrition Information */}
          <div className="bg-[#1A1A1A] rounded-2xl p-5 border border-[#FF6B35]/10">
            <h3 className="text-white font-semibold mb-4">Nutrition Information</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-2">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-400 text-xs mb-1">Calories</p>
                <p className="text-white font-semibold">{calories}</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-400 text-xs mb-1">Protein</p>
                <p className="text-white font-semibold">{protein}g</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center mb-2">
                  <ChefHat className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-400 text-xs mb-1">Carbs</p>
                <p className="text-white font-semibold">{carbs}g</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-2">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-400 text-xs mb-1">Fat</p>
                <p className="text-white font-semibold">{fat}g</p>
              </div>
            </div>
          </div>

          {/* Vendor Info */}
          <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-[#FF6B35]/10">
            <h3 className="text-white font-semibold mb-3">Mom's Portfolio</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FFB84D] flex items-center justify-center">
                <span className="text-2xl">👩‍🍳</span>
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{food.house}</p>
                <p className="text-gray-400 text-sm">{food.block}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-yellow-500" />
                  <span className="text-white font-semibold">{food.rating}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Allergen Warning */}
          {food.allergens && food.allergens.length > 0 && (
            <div className="flex items-start gap-2 p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/30">
              <span className="text-yellow-500 text-xl">⚠️</span>
              <div>
                <p className="text-yellow-500 font-semibold text-sm">Allergen Warning</p>
                <p className="text-yellow-500/80 text-sm">
                  Contains: {food.allergens.join(", ")}
                </p>
              </div>
            </div>
          )}

          {/* Order Button */}
          <Button 
            onClick={onOrderNow}
            className="w-full h-14 text-lg font-semibold"
            style={{
              background: "linear-gradient(135deg, #FF6B35 0%, #FFB84D 100%)",
            }}
          >
            Order Now
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

