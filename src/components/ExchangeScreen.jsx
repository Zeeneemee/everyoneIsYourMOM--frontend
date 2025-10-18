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
import { ArrowLeft, Search, Heart, MessageCircle, MapPin, Clock, ChefHat, Home, Sparkles, Package, Plus, Loader2, Mic } from "lucide-react";

export function ExchangeScreen() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { openVoiceAssistant } = useVoiceAssistant();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isListDialogOpen, setIsListDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    status: "donate",
    condition: "good",
    price: "",
    category: ""
  });

  // Fetch ALL exchange items from Convex (we'll paginate client-side after filtering)
  const { data: allItems, loading: loadingItems, error: itemsError } = useConvexQuery('exchange:getAll', { 
    available: true 
  });
  
  // Mutation for creating new exchange item
  const { mutate: createItem, loading: creatingItem } = useConvexMutation('exchange:create');

  const convexItems = allItems || [];
  const pageSize = 12;

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  // Auto scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Transform Convex data to match expected format
  const transformItemData = (item) => ({
    id: item.itemId || item._id,
    ownerBlock: item.ownerBlock,
    item: item.item,
    status: item.status,
    condition: item.condition,
    price: item.price,
    image: getItemEmoji(item.item)
  });

  // Helper function to get emoji based on item name
  const getItemEmoji = (itemName) => {
    const name = itemName.toLowerCase();
    if (name.includes('rice') || name.includes('cooker')) return '🍚';
    if (name.includes('fan')) return '🪭';
    if (name.includes('yoga') || name.includes('mat')) return '🧘';
    if (name.includes('microwave')) return '📦';
    if (name.includes('fridge')) return '🧊';
    if (name.includes('book')) return '📚';
    if (name.includes('kettle') || name.includes('coffee')) return '☕';
    if (name.includes('lamp')) return '💡';
    if (name.includes('blender')) return '🫙';
    if (name.includes('chair')) return '🪑';
    return '📦';
  };

  // Use Convex data if available, otherwise show loading/empty state
  const allExchangeItems = convexItems ? convexItems.map(transformItemData) : [];

  // Filter exchange items based on active filter
  const allFilteredItems = allExchangeItems.filter((item) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "donate") return item.status.toLowerCase() === "donate";
    if (activeFilter === "exchange") return item.status.toLowerCase() === "exchange";
    if (activeFilter === "sell") return item.status.toLowerCase() === "sell";
    return true;
  });

  // Calculate pagination values based on filtered data
  const totalFilteredItems = allFilteredItems.length;
  const totalPages = Math.ceil(totalFilteredItems / pageSize);
  const startItem = totalFilteredItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, totalFilteredItems);

  // Paginate the filtered results
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const exchangeItems = allFilteredItems.slice(startIndex, endIndex);

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
      <div className="bg-gradient-to-b from-[#1A1A1A] to-[#0F0F0F] px-4 sm:px-6 py-4 border-b border-[#FF6B35]/10">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/profile')}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FFB84D] flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer shrink-0"
            >
              <span className="text-xl">👤</span>
            </button>
            <div className="flex items-center gap-2">
              <Package className="w-6 h-6 text-[#FF6B35]" />
              <h2 className="text-white text-lg font-semibold">Exchange</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
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

      {/* Search Bar */}
      <div className="px-4 sm:px-6 py-4 border-b border-[#FF6B35]/10">
        <div className="max-w-4xl mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items to exchange..."
            className="pl-10 bg-[#2D2D2D] border-gray-700 text-white placeholder:text-gray-500 h-11"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 sm:px-6 py-4 bg-[#0F0F0F]">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { name: "All", key: "all", emoji: "📦" },
              { name: "Donate", key: "donate", emoji: "💝" },
              { name: "Exchange", key: "exchange", emoji: "🔄" },
              { name: "Sell", key: "sell", emoji: "💰" }
            ].map((filter) => (
              <Button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`shrink-0 rounded-full h-10 px-5 font-medium transition-all ${
                  activeFilter === filter.key
                    ? 'bg-gradient-to-r from-[#FF6B35] to-[#FFB84D] text-white hover:opacity-90 border-none'
                    : 'bg-[#2D2D2D] text-gray-300 hover:bg-[#3D3D3D] border-none'
                }`}
              >
                <span className="text-base">{filter.emoji}</span>
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
          {itemsError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6"
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">⚠️</div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-2">Aiyo! Something wrong lah</h3>
                  <p className="text-gray-300 text-sm">
                    Cannot load exchange items now. Try again later, can?
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {loadingItems && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#1A1A1A] rounded-xl p-4 border border-[#FF6B35]/20 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-[#2D2D2D] rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-[#2D2D2D] rounded w-2/3"></div>
                      <div className="h-4 bg-[#2D2D2D] rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results Count */}
          {!loadingItems && !itemsError && (
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm">
                {totalFilteredItems > 0 ? (
                  <>
                    Showing <span className="text-[#FF6B35] font-semibold">{startItem}-{endItem}</span> from <span className="text-white font-semibold">{totalFilteredItems}</span> {activeFilter !== "all" ? activeFilter : ''} {totalFilteredItems === 1 ? 'item' : 'items'}
                    {activeFilter !== "all" && <span className="text-[#FF6B35] ml-1">• {activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}</span>}
                  </>
                ) : (
                  <>
                    No items found
                    {activeFilter !== "all" && <span className="text-[#FF6B35] ml-1">• {activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}</span>}
                  </>
                )}
              </p>
            </div>
          )}

          {/* Mom's Message */}
          {!loadingItems && !itemsError && totalFilteredItems > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1A1A1A] rounded-xl p-4 border border-[#FF6B35]/20 mb-6"
            >
              <div className="flex gap-3">
                <div className="flex-1">
                  <p className="text-white text-sm mb-2">
                    See lah, always need something. Lucky ah — your neighbors got things to donate, exchange, or sell cheap. I message them for you?
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <Badge className="bg-[#FFB84D]/20 text-[#FFB84D] border-[#FFB84D]/30 text-xs">
                      Matched to your interests
                    </Badge>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* No Items Message */}
          {!loadingItems && !itemsError && exchangeItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1A1A1A] rounded-xl p-8 border border-[#FF6B35]/20 text-center"
            >
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-white font-semibold text-lg mb-2">No items yet</h3>
              <p className="text-gray-400 text-sm">
                Be the first to list an item for exchange!
              </p>
            </motion.div>
          )}

          {/* Exchange Item Cards */}
          {!loadingItems && !itemsError && exchangeItems.length > 0 && (
            <div className="space-y-4">
              {exchangeItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#1A1A1A] rounded-xl p-4 border border-[#FF6B35]/20 cursor-pointer hover:border-[#FF6B35]/50 transition-all"
              >
                <div className="flex gap-4">
                  {/* Item Icon */}
                  <div className="text-5xl shrink-0">{item.image}</div>
                  
                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">{item.item}</h3>
                        <p className="text-gray-400 text-xs sm:text-sm">From: {item.ownerBlock}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs shrink-0 ${
                            item.status === 'donate' 
                              ? 'bg-green-500/10 text-green-400 border-green-500/30'
                              : item.status === 'exchange'
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                              : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                          }`}
                        >
                          {item.status === 'donate' ? '🎁 Free' : item.status === 'exchange' ? '🔄 Trade' : '💰 Sell'}
                        </Badge>
                        {item.price && (
                          <span className="text-[#FFB84D] font-semibold text-sm">{item.price}</span>
                        )}
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="outline" className="text-xs h-5">
                        {item.condition}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <MapPin className="w-3 h-3" />
                        <span>{item.ownerBlock}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 mt-3">
                      <Button 
                        size="sm"
                        className="h-8"
                        style={{
                          background: "linear-gradient(135deg, #FF6B35 0%, #FFB84D 100%)",
                        }}
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Contact Owner
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
              ))}
            </div>
          )}

          {/* Add Item Button */}
          {!loadingItems && !itemsError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6"
            >
              <Dialog open={isListDialogOpen} onOpenChange={setIsListDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full h-12"
                    style={{
                      background: "linear-gradient(135deg, #FF6B35 0%, #FFB84D 100%)",
                    }}
                  >
                    <Package className="w-5 h-5 mr-2" />
                    List Your Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#1A1A1A] border-[#FF6B35]/20 text-white max-w-sm">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-[#FF6B35]" />
                      List Exchange Item
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="item-name" className="text-white">Item Name *</Label>
                      <Input
                        id="item-name"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        placeholder="e.g., Rice Cooker"
                        className="bg-[#2D2D2D] border-gray-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="item-description" className="text-white">Description</Label>
                      <Textarea
                        id="item-description"
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        placeholder="Describe your item..."
                        className="bg-[#2D2D2D] border-gray-700 text-white min-h-20"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-white">Status *</Label>
                        <div className="space-y-1">
                          {["donate", "exchange", "sell"].map((status) => (
                            <Button
                              key={status}
                              variant={newItem.status === status ? "default" : "outline"}
                              size="sm"
                              type="button"
                              className={newItem.status === status
                                ? "w-full bg-gradient-to-r from-[#FF6B35] to-[#FFB84D] text-white border-none" 
                                : "w-full bg-[#2D2D2D] border-gray-700 text-gray-300 hover:bg-[#3D3D3D]"}
                              onClick={() => setNewItem({ ...newItem, status })}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Condition *</Label>
                        <div className="space-y-1">
                          {["like new", "good", "fair"].map((cond) => (
                            <Button
                              key={cond}
                              variant={newItem.condition === cond ? "default" : "outline"}
                              size="sm"
                              type="button"
                              className={newItem.condition === cond
                                ? "w-full bg-gradient-to-r from-[#FF6B35] to-[#FFB84D] text-white border-none text-xs" 
                                : "w-full bg-[#2D2D2D] border-gray-700 text-gray-300 hover:bg-[#3D3D3D] text-xs"}
                              onClick={() => setNewItem({ ...newItem, condition: cond })}
                            >
                              {cond.charAt(0).toUpperCase() + cond.slice(1)}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                    {newItem.status === "sell" && (
                      <div className="space-y-2">
                        <Label htmlFor="item-price" className="text-white">Price</Label>
                        <Input
                          id="item-price"
                          value={newItem.price}
                          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                          placeholder="$20"
                          className="bg-[#2D2D2D] border-gray-700 text-white"
                        />
                      </div>
                    )}
                    <div className="bg-gradient-to-r from-[#FF6B35]/10 to-[#FFB84D]/10 rounded-lg p-3 border border-[#FF6B35]/30">
                      <p className="text-xs text-gray-300">
                        💝 Mom will help connect you with neighbors who need your item!
                      </p>
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FFB84D] text-white hover:opacity-90"
                      disabled={creatingItem || !newItem.name}
                      onClick={async () => {
                        if (!isAuthenticated) {
                          alert("Please login to list an item");
                          navigate('/login');
                          return;
                        }

                        const itemId = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                        
                        const result = await createItem({
                          itemId,
                          ownerBlock: user?.block || "Your Block",
                          item: newItem.name,
                          description: newItem.description || `${newItem.name} in ${newItem.condition} condition`,
                          status: newItem.status,
                          condition: newItem.condition,
                          price: newItem.status === "sell" ? (newItem.price.startsWith('$') ? newItem.price : `$${newItem.price}`) : null,
                          category: newItem.category,
                          images: [],
                          userId: user?.id,
                          available: true,
                        });

                        if (result.success) {
                          setIsListDialogOpen(false);
                          setNewItem({ name: "", description: "", status: "donate", condition: "good", price: "", category: "" });
                          alert("Item listed successfully! 🎉");
                          window.location.reload();
                        } else {
                          alert("Failed to list item. Please try again.");
                        }
                      }}
                    >
                      {creatingItem ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Listing...
                        </>
                      ) : (
                        "List Item"
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          )}

          {/* Pagination Controls */}
          {!loadingItems && exchangeItems.length > 0 && totalPages > 1 && (
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
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
      
      {/* Spacer for fixed nav */}
      <div className="h-20"></div>
    </div>
  );
}

