import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Clock, MapPin, Heart, Flame, Users, ChefHat, Share2, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckoutModal } from './CheckoutModal';
import { getFoodById, getFoodCardByQuery, transformFoodData } from '../services/foodService';
import { useAuth } from '../contexts/AuthContext';
import { deslugify } from '../utils/slugify';

export function FoodDetailPage() {
  const { id, query } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [food, setFood] = useState(location.state?.food || null);
  const [loading, setLoading] = useState(!location.state?.food);
  const [error, setError] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    async function fetchFoodData() {
      if (food) return; // Already have data from navigation state

      try {
        setLoading(true);
        setError(null);

        let result;
        if (id) {
          // Let backend handle smart detection (itemId vs Convex _id)
          console.log('🔍 Fetching food by id:', id);
          result = await getFoodById(id);
          if (result.data) {
            setFood(transformFoodData(result.data));
          } else {
            setError('Food item not found');
          }
        } else if (query) {
          // Fetch by query name - convert slug back to searchable format
          // e.g., "hainanesechickenrice" → "hainanese chicken rice"
          const searchQuery = deslugify(query);
          console.log('🔍 Searching for food with deslugified query:', searchQuery, 'from slug:', query);
          result = await getFoodCardByQuery(searchQuery);
          if (result.data && result.data.length > 0) {
            setFood(transformFoodData(result.data[0]));
          } else {
            setError('Food item not found');
          }
        }
      } catch (err) {
        console.error('Error fetching food:', err);
        setError(err.message || 'Failed to load food details');
      } finally {
        setLoading(false);
      }
    }

    fetchFoodData();
  }, [id, query, food]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleOrderNow = () => {
    if (!food.available) {
      alert('Sorry, this item is not available right now.');
      return;
    }
    setShowCheckoutModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowCheckoutModal(false);
    navigate('/payment-success', { state: { food } });
  };

  const handleShare = async () => {
    const shareData = {
      title: food.name,
      text: `Check out ${food.name} from ${food.house}!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Save to backend/user preferences
  };

  // Helper function to ensure arrays
  const ensureArray = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') return [value];
    return [];
  };

  // Safely get diet, tags, and allergens as arrays
  const dietArray = food ? ensureArray(food.diet) : [];
  const tagsArray = food ? ensureArray(food.tags) : [];
  const allergensArray = food ? ensureArray(food.allergens) : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#FFB84D] animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading food details...</p>
        </div>
      </div>
    );
  }

  if (error || !food) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-white text-2xl font-bold mb-2">Food Not Found</h2>
          <p className="text-gray-400 mb-6">{error || "We couldn't find this food item."}</p>
          <Button onClick={handleBack} className="bg-gradient-to-r from-[#FF6B35] to-[#FFB84D]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Parse nutrition info
  const calories = food.calories?.replace(/[^0-9]/g, '') || '650';
  const protein = food.protein?.replace(/[^0-9]/g, '') || '28';
  const carbs = '72'; // Default
  const fat = '18'; // Default

  return (
    <div className="min-h-screen bg-[#0F0F0F] pb-20">
      {/* Header Image */}
      <div className="relative h-[60vh] bg-gradient-to-br from-[#2D2D2D] to-[#1A1A1A] flex items-center justify-center overflow-hidden">
        {food.image ? (
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="text-9xl opacity-40">🍽️</div>
        )}

        {/* Top Navigation Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <Share2 className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={toggleFavorite}
              className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </button>
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-20 left-4 flex gap-2">
          {tagsArray[0] && (
            <Badge className="bg-gradient-to-r from-[#FF6B35] to-[#FFB84D] text-white border-none px-3 py-1.5 text-sm">
              {tagsArray[0]}
            </Badge>
          )}
          {food.available ? (
            <Badge className="bg-green-500 text-white border-none px-3 py-1.5 text-sm">
              ✓ Available
            </Badge>
          ) : (
            <Badge className="bg-red-500/80 text-white border-none px-3 py-1.5 text-sm">
              ✗ Not Available
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="px-6 py-6 space-y-6"
      >
        {/* Title and Price */}
        <div>
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h1 className="text-white text-3xl font-bold mb-2">{food.name}</h1>
              <div className="flex items-center gap-2 text-gray-400">
                <ChefHat className="w-4 h-4" />
                <span className="text-sm">{food.house}</span>
              </div>
            </div>
            <div className="text-4xl font-bold text-[#FFB84D]">{food.price}</div>
          </div>

          {/* Quick Info */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-semibold">{food.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{food.eta}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>{food.distance}</span>
            </div>
          </div>
        </div>

        {/* Not Available Notice */}
        {!food.available && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🚫</span>
              <div>
                <h3 className="text-red-400 font-semibold mb-1">Currently Unavailable</h3>
                <p className="text-red-300/80 text-sm">
                  This item is not available for order at the moment. Please check back later or contact the vendor for more information.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        {food.description && (
          <div className="space-y-2">
            <h3 className="text-white text-lg font-semibold">About</h3>
            <p className="text-gray-400 leading-relaxed">{food.description}</p>
          </div>
        )}

        {/* Dietary Info */}
        {dietArray.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-white text-lg font-semibold">Dietary Info</h3>
            <div className="flex flex-wrap gap-2">
              {dietArray.map((dietType, index) => (
                <Badge key={index} className="bg-green-500/20 text-green-400 border-green-500/50">
                  {dietType}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Nutrition */}
        <div className="space-y-3">
          <h3 className="text-white text-lg font-semibold">Nutrition Facts</h3>
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-[#1A1A1A] rounded-xl p-4 text-center border border-[#2D2D2D]">
              <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <div className="text-white font-bold text-lg">{calories}</div>
              <div className="text-gray-500 text-xs">Calories</div>
            </div>
            <div className="bg-[#1A1A1A] rounded-xl p-4 text-center border border-[#2D2D2D]">
              <div className="text-2xl mb-2">🥩</div>
              <div className="text-white font-bold text-lg">{protein}g</div>
              <div className="text-gray-500 text-xs">Protein</div>
            </div>
            <div className="bg-[#1A1A1A] rounded-xl p-4 text-center border border-[#2D2D2D]">
              <div className="text-2xl mb-2">🍚</div>
              <div className="text-white font-bold text-lg">{carbs}g</div>
              <div className="text-gray-500 text-xs">Carbs</div>
            </div>
            <div className="bg-[#1A1A1A] rounded-xl p-4 text-center border border-[#2D2D2D]">
              <div className="text-2xl mb-2">🧈</div>
              <div className="text-white font-bold text-lg">{fat}g</div>
              <div className="text-gray-500 text-xs">Fat</div>
            </div>
          </div>
        </div>

        {/* Allergens */}
        {allergensArray.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <h3 className="text-red-400 font-semibold mb-2">⚠️ Allergen Information</h3>
            <div className="flex flex-wrap gap-2">
              {allergensArray.map((allergen, index) => (
                <Badge key={index} className="bg-red-500/20 text-red-400 border-red-500/50">
                  {allergen}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {tagsArray.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-white text-lg font-semibold">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tagsArray.map((tag, index) => (
                <Badge key={index} className="bg-[#1A1A1A] text-gray-400 border-[#2D2D2D]">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Location */}
        <div className="space-y-2">
          <h3 className="text-white text-lg font-semibold">Location</h3>
          <div className="bg-[#1A1A1A] rounded-xl p-4 border border-[#2D2D2D]">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#FFB84D] mt-1" />
              <div>
                <div className="text-white font-medium">{food.house}</div>
                <div className="text-gray-400 text-sm">{food.block}</div>
                <div className="text-gray-500 text-xs mt-1">{food.distance} away • {food.eta}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Fixed Bottom Order Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/95 to-transparent p-4 pb-6">
        <div className="max-w-md mx-auto">
          {food.available ? (
            <Button
              onClick={handleOrderNow}
              className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FFB84D] hover:from-[#FF8555] hover:to-[#FFC86D] text-white font-bold py-6 text-lg shadow-lg"
            >
              Order Now • {food.price}
            </Button>
          ) : (
            <Button
              disabled
              className="w-full bg-gray-600 text-gray-400 font-bold py-6 text-lg shadow-lg cursor-not-allowed opacity-50"
            >
              Not Available
            </Button>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && food.available && (
        <CheckoutModal
          food={food}
          onClose={() => setShowCheckoutModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}

