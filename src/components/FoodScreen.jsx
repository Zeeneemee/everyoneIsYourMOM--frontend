import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useVoiceAssistant } from "../contexts/VoiceAssistantContext";
import { useConvexQuery, useConvexMutation } from "../hooks/useConvexQuery";
import { AIMomAvatar } from "./AIMomAvatar";
import { BottomNav } from "./BottomNav";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { ArrowLeft, Search, Star, Clock, MapPin, Heart, MessageCircle, ChefHat, Home, Sparkles, Package, Flame, Beef, Plus, Loader2, Mic } from "lucide-react";

export function FoodScreen() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { openVoiceAssistant } = useVoiceAssistant();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [newOffering, setNewOffering] = useState({
    name: "",
    description: "",
    price: "",
    servings: "",
    dietType: ""
  });

  // Fetch ALL food data from Convex (we'll paginate client-side after filtering)
  const { data: allFoods, loading: loadingFoods, error: foodError } = useConvexQuery('foods:getAll', { 
    available: true 
  });
  
  // Mutation for creating new food offering
  const { mutate: createFood, loading: creatingFood } = useConvexMutation('foods:create');

  const convexFoods = allFoods || [];
  const pageSize = 6;

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  // Auto scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const filters = [
    { name: "All", emoji: "🍽️", key: "all" },
    { name: "Italian", emoji: "🍝", key: "italian" },
    { name: "Healthy", emoji: "🥗", key: "healthy" },
    { name: "Asian", emoji: "🍜", key: "asian" },
    { name: "Halal", emoji: "🕌", key: "halal" },
    { name: "Spicy", emoji: "🌶️", key: "spicy" },
    { name: "Comfort", emoji: "🤗", key: "comfort" },
    { name: "Seafood", emoji: "🦐", key: "seafood" }
  ];

  // Transform Convex data to match expected format
  const transformFoodData = (food) => ({
    id: food.itemId || food._id,
    name: food.dish,
    house: food.house,
    block: food.block,
    tags: food.tags || [],
    diet: Array.isArray(food.diet) ? food.diet.join(', ') : (food.diet || ''),
    allergens: food.allergens || [],
    price: food.price,
    eta: food.eta || "30 min",
    distance: food.distance || "0.5 km",
    rating: food.rating || 5.0,
    calories: food.calories || "500 cal",
    protein: food.protein || "20g protein",
    momMessage: food.description || `${food.house} always cook nice one! You try lah.`,
    image: food.image ? food.image.replace(/['"]/g, '') : null
  });

  // Use Convex data if available, otherwise show loading/empty state
  const foodRecommendations = convexFoods ? convexFoods.map(transformFoodData) : [];

  // Filter food based on active filter
  const allFilteredFoods = foodRecommendations.filter((food) => {
    if (activeFilter === "All") return true;
    
    const filterKey = activeFilter.toLowerCase();
    
    // Check diet field
    if (food.diet && food.diet.toLowerCase().includes(filterKey)) return true;
    
    // Check tags array
    if (food.tags.some(tag => tag.toLowerCase().includes(filterKey))) return true;
    
    // Special cases for cuisine types
    if (filterKey === "italian") {
      return food.name.toLowerCase().includes("pasta") || 
             food.name.toLowerCase().includes("italian") ||
             food.tags.some(tag => tag.toLowerCase().includes("italian"));
    }
    
    if (filterKey === "asian") {
      return food.name.toLowerCase().includes("chicken rice") || 
             food.name.toLowerCase().includes("laksa") ||
             food.name.toLowerCase().includes("noodle") ||
             food.name.toLowerCase().includes("ramen") ||
             food.tags.some(tag => tag.toLowerCase().includes("asian"));
    }
    
    if (filterKey === "healthy") {
      return food.tags.some(tag => 
        tag.toLowerCase().includes("vegetarian") || 
        tag.toLowerCase().includes("light") ||
        tag.toLowerCase().includes("no oil") ||
        parseInt(food.calories) < 550
      );
    }
    
    return false;
  });

  // Calculate pagination values based on filtered data
  const totalFilteredItems = allFilteredFoods.length;
  const totalPages = Math.ceil(totalFilteredItems / pageSize);
  const startItem = totalFilteredItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, totalFilteredItems);

  // Paginate the filtered results
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const filteredFoods = allFilteredFoods.slice(startIndex, endIndex);

  // Calculate visible page numbers (max 5 pages)
  const getVisiblePages = () => {
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust startPage if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Add one more page after current if possible (per user request)
    if (currentPage < totalPages && endPage < totalPages) {
      endPage = Math.min(totalPages, endPage + 1);
    }
    
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#1A1A1A] to-[#0F0F0F] px-4 sm:px-6 py-4 border-b border-[#FF6B35]/10 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-4 max-w-4xl mx-auto">
          <button 
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FFB84D] flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer shrink-0"
          >
            <span className="text-xl">👤</span>
          </button>
          <div className="flex-1">
            <h2 className="text-white text-xl font-bold">Food Recommendations</h2>
            <p className="text-xs text-gray-400">Personalized by Mom AI</p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-[#FF6B35] to-[#FFB84D] text-white hover:opacity-90"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Offer
                </Button>
              </DialogTrigger>
            <DialogContent className="bg-[#1A1A1A] border-[#FF6B35]/20 text-white max-w-sm">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-[#FF6B35]" />
                  Post Food Offering
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="food-name" className="text-white">Dish Name</Label>
                  <Input
                    id="food-name"
                    value={newOffering.name}
                    onChange={(e) => setNewOffering({ ...newOffering, name: e.target.value })}
                    placeholder="e.g., Homemade Lasagna"
                    className="bg-[#2D2D2D] border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="food-description" className="text-white">Description</Label>
                  <Textarea
                    id="food-description"
                    value={newOffering.description}
                    onChange={(e) => setNewOffering({ ...newOffering, description: e.target.value })}
                    placeholder="Tell people about your dish..."
                    className="bg-[#2D2D2D] border-gray-700 text-white min-h-20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="food-price" className="text-white">Price</Label>
                    <Input
                      id="food-price"
                      value={newOffering.price}
                      onChange={(e) => setNewOffering({ ...newOffering, price: e.target.value })}
                      placeholder="$15.00"
                      className="bg-[#2D2D2D] border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="food-servings" className="text-white">Servings</Label>
                    <Input
                      id="food-servings"
                      value={newOffering.servings}
                      onChange={(e) => setNewOffering({ ...newOffering, servings: e.target.value })}
                      placeholder="4"
                      className="bg-[#2D2D2D] border-gray-700 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Cuisine Type (Optional)</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Italian", "Asian", "Mexican", "American", "Halal", "Vegetarian"].map((type) => (
                      <Button
                        key={type}
                        variant={newOffering.dietType === type ? "default" : "outline"}
                        size="sm"
                        type="button"
                        className={newOffering.dietType === type 
                          ? "bg-gradient-to-r from-[#FF6B35] to-[#FFB84D] text-white border-none" 
                          : "bg-[#2D2D2D] border-gray-700 text-gray-300 hover:bg-[#3D3D3D]"}
                        onClick={() => setNewOffering({ ...newOffering, dietType: type })}
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="bg-gradient-to-r from-[#FF6B35]/10 to-[#FFB84D]/10 rounded-lg p-3 border border-[#FF6B35]/30">
                  <p className="text-xs text-gray-300">
                    💝 Mom will help match your offering with people who'll love it!
                  </p>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FFB84D] text-white hover:opacity-90"
                  disabled={creatingFood || !newOffering.name || !newOffering.price}
                  onClick={async () => {
                    if (!isAuthenticated) {
                      alert("Please login to post an offering");
                      navigate('/login');
                      return;
                    }

                    // Generate unique ID
                    const itemId = `food_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    
                    // Derive tags from dietType
                    const tags = newOffering.dietType ? [newOffering.dietType.toLowerCase()] : [];
                    const diet = newOffering.dietType ? [newOffering.dietType.toLowerCase()] : [];

                    const result = await createFood({
                      itemId,
                      house: user?.fullName || user?.email || "Home Cook",
                      block: user?.block || "Your Block",
                      dish: newOffering.name,
                      description: newOffering.description || `Delicious ${newOffering.name}`,
                      tags,
                      diet,
                      allergens: [],
                      price: newOffering.price.startsWith('$') ? newOffering.price : `$${newOffering.price}`,
                      eta: "30 min",
                      available: true,
                      userId: user?.id,
                    });

                    if (result.success) {
                      setIsPostDialogOpen(false);
                      setNewOffering({ name: "", description: "", price: "", servings: "", dietType: "" });
                      // Optionally show success message
                      alert("Food offering posted successfully! 🎉");
                      // Refresh the page to show new item
                      window.location.reload();
                    } else {
                      alert("Failed to post offering. Please try again.");
                    }
                  }}
                >
                  {creatingFood ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    "Post Offering"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <button
            onClick={openVoiceAssistant}
            className="text-white hover:text-[#FF6B35] transition-colors p-2 hover:bg-white/10 rounded-lg"
            title="Voice Assistant"
          >
            <Mic className="w-6 h-6" />
          </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 sm:px-6 py-4 bg-[#0F0F0F]">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {filters.map((filter) => (
              <Button
                key={filter.key}
                onClick={() => setActiveFilter(filter.name)}
                className={`shrink-0 rounded-full h-12 px-6 font-medium transition-all ${
                  activeFilter === filter.name
                    ? 'bg-gradient-to-r from-[#FF6B35] to-[#FFB84D] text-white hover:opacity-90 border-none'
                    : 'bg-[#2D2D2D] text-gray-300 hover:bg-[#3D3D3D] border-none'
                }`}
              >
                <span className="text-lg">{filter.emoji}</span>
                <span className="ml-2">{filter.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Error Message */}
          {foodError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 mb-6"
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">⚠️</div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-2">Aiyo! Something went wrong lah</h3>
                  <p className="text-gray-300 text-sm">
                    Cannot load food menu now. Check your connection and try again later, can?
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Why Mom chose these */}
          {!foodError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] rounded-2xl p-5 border border-[#FF6B35]/20 mb-6"
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">💝</div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                    Why Mom chose these for you
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Based on your preference for high protein and comfort food, I'm prioritizing nearby neighbors with fresh cooking today! All within walking distance. 👟
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {loadingFoods && (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#1A1A1A] rounded-3xl overflow-hidden border border-[#FF6B35]/20 animate-pulse">
                  <div className="h-64 bg-[#2D2D2D]"></div>
                  <div className="p-5 space-y-4">
                    <div className="h-6 bg-[#2D2D2D] rounded w-3/4"></div>
                    <div className="h-4 bg-[#2D2D2D] rounded w-1/2"></div>
                    <div className="h-20 bg-[#2D2D2D] rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results Count */}
          {!loadingFoods && !foodError && (
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm">
                {totalFilteredItems > 0 ? (
                  <>
                    Showing <span className="text-[#FF6B35] font-semibold">{startItem}-{endItem}</span> from <span className="text-white font-semibold">{totalFilteredItems}</span> {activeFilter !== "All" ? activeFilter.toLowerCase() : ''} {totalFilteredItems === 1 ? 'dish' : 'dishes'}
                    {activeFilter !== "All" && <span className="text-[#FF6B35] ml-1">• {activeFilter}</span>}
                  </>
                ) : (
                  <>
                    No dishes found
                    {activeFilter !== "All" && <span className="text-[#FF6B35] ml-1">• {activeFilter}</span>}
                  </>
                )}
              </p>
            </div>
          )}

          {/* Food Cards - Large Visual Design */}
          {!loadingFoods && !foodError && (
            <>
            <div className="space-y-6">
              {filteredFoods.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1A1A1A] rounded-3xl p-12 border border-[#FF6B35]/20 text-center"
              >
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-white text-lg font-semibold mb-2">No dishes found</h3>
                <p className="text-gray-400 text-sm">
                  Aiyo! No matches for "{activeFilter}" lah. Try another filter!
                </p>
              </motion.div>
            ) : (
              filteredFoods.map((food, index) => (
                <motion.div
                key={food.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1A1A1A] rounded-3xl overflow-hidden border border-[#FF6B35]/20 hover:border-[#FF6B35]/50 transition-all"
              >
                {/* Food Image with overlay */}
                <div className="relative h-56 sm:h-64 bg-gradient-to-br from-[#2D2D2D] to-[#1A1A1A] flex items-center justify-center overflow-hidden">
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
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className="bg-black/60 backdrop-blur-sm text-white border-none">
                      <Star className="w-3 h-3 mr-1 fill-yellow-500 text-yellow-500" />
                      {food.rating}
                    </Badge>
                    {food.diet && (
                      <Badge className="bg-green-500/80 backdrop-blur-sm text-white border-none">
                        {food.diet}
                      </Badge>
                    )}
                  </div>

                  {/* Heart icon */}
                  <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors">
                    <Heart className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Title and Price */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-white text-lg font-bold mb-1">{food.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {food.eta}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {food.distance}
                        </div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-[#FFB84D]">{food.price}</div>
                  </div>

                  {/* Mom's Message */}
                  <div className="bg-[#2D2D2D] rounded-xl p-3 mb-4">
                    <p className="text-sm text-gray-300">
                      😊 {food.momMessage}
                    </p>
                  </div>

                  {/* Food Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {food.tags.map((tag, idx) => (
                      <Badge 
                        key={idx}
                        variant="outline" 
                        className="bg-[#2D2D2D] text-gray-400 border-gray-700 text-xs capitalize"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Nutritional Info */}
                  <div className="flex gap-3 mb-4">
                    <Badge variant="outline" className="bg-[#FF6B35]/10 text-[#FF6B35] border-[#FF6B35]/30 text-xs">
                      <Flame className="w-3 h-3 mr-1" />
                      {food.calories}
                    </Badge>
                    <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30 text-xs">
                      <Beef className="w-3 h-3 mr-1" />
                      {food.protein}
                    </Badge>
                  </div>

                  {/* Allergen Warning */}
                  {food.allergens.length > 0 && (
                    <div className="flex items-start gap-2 mb-4 text-xs">
                      <span className="text-yellow-500">⚠️</span>
                      <span className="text-yellow-500/80">
                        Contains: {food.allergens.join(", ")}
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 h-11 text-base font-semibold"
                      style={{
                        background: "linear-gradient(135deg, #FF6B35 0%, #FFB84D 100%)",
                      }}
                    >
                      Order Now
                    </Button>
                    <Button 
                      variant="outline"
                      className="h-11 px-4 bg-[#2D2D2D] border-gray-700 text-white hover:bg-[#3D3D3D]"
                    >
                      Details
                    </Button>
                    <Button 
                      variant="outline"
                      size="icon"
                      className="h-11 w-11 bg-[#2D2D2D] border-gray-700 text-white hover:bg-[#3D3D3D]"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Vendor Info */}
                  <div className="mt-3 pt-3 border-t border-gray-800 flex items-center justify-between text-xs text-gray-400">
                    <span>From: {food.house}</span>
                    <span>{food.block}</span>
                  </div>
                </div>
              </motion.div>
              ))
            )}
            </div>

            {/* Pagination Controls */}
            {filteredFoods.length > 0 && totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="bg-[#2D2D2D] border-gray-700 text-white hover:bg-[#3D3D3D] disabled:opacity-50"
                >
                  Previous
                </Button>
                
                <div className="flex gap-1">
                  {getVisiblePages().map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page 
                        ? "bg-gradient-to-r from-[#FF6B35] to-[#FFB84D] text-white" 
                        : "bg-[#2D2D2D] border-gray-700 text-white hover:bg-[#3D3D3D]"
                      }
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="bg-[#2D2D2D] border-gray-700 text-white hover:bg-[#3D3D3D] disabled:opacity-50"
                >
                  Next
                </Button>
              </div>
            )}
            </>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
      
      {/* Spacer for fixed nav */}
      <div className="h-20"></div>
    </div>
  );
}

