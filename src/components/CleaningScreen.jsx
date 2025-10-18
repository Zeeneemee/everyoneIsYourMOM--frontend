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
import { ArrowLeft, Search, Star, MapPin, Calendar, Users, ChefHat, Home, Sparkles, Package, MessageCircle, Clock, Plus, User, Loader2, Mic } from "lucide-react";

export function CleaningScreen() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { openVoiceAssistant } = useVoiceAssistant();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [newOffering, setNewOffering] = useState({
    name: "",
    description: "",
    price: "",
    availability: "",
    serviceTypes: []
  });

  // Fetch ALL cleaning slots from Convex (we'll paginate client-side after filtering)
  const { data: allSlots, loading: loadingSlots, error: slotsError } = useConvexQuery('cleaning:getAllSlots', { 
    available: true 
  });
  
  // Mutation for creating new cleaning service
  const { mutate: createSlot, loading: creatingSlot } = useConvexMutation('cleaning:createSlot');

  const convexSlots = allSlots || [];
  const pageSize = 12;

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter]);

  // Auto scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Toggle service type selection
  const toggleServiceType = (type) => {
    setNewOffering(prev => ({
      ...prev,
      serviceTypes: prev.serviceTypes.includes(type)
        ? prev.serviceTypes.filter(t => t !== type)
        : [...prev.serviceTypes, type]
    }));
  };

  // Transform Convex data to match expected format
  const transformSlotData = (slot) => ({
    id: slot.slotId || slot._id,
    name: slot.availableCleaner,
    experience: `${slot.duration || 2} hours available`,
    rating: 4.8,
    reviews: 100,
    price: parseInt(slot.price.replace(/[^0-9]/g, '')) || 30,
    distance: "1.0 km away",
    replyTime: "< 15 min",
    availability: slot.time || "Available today",
    services: slot.petFriendly ? ["Regular Cleaning", "Pet-friendly"] : ["Regular Cleaning"],
    highlight: slot.description || `${slot.availableCleaner} is experienced and reliable!`,
    image: slot.image ? slot.image.replace(/['"]/g, '') : null,
    verified: true,
    petFriendly: slot.petFriendly
  });

  // Use Convex data if available, otherwise show loading/empty state
  const allCleaningServices = convexSlots ? convexSlots.map(transformSlotData) : [];

  // Filter cleaning services based on selected filter
  const allFilteredServices = allCleaningServices.filter((service) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "deep") {
      return service.services.some(s => s.toLowerCase().includes("deep"));
    }
    if (selectedFilter === "regular") {
      return service.services.some(s => s.toLowerCase().includes("regular"));
    }
    if (selectedFilter === "pet-friendly") {
      return service.petFriendly === true;
    }
    return true;
  });

  // Calculate pagination values based on filtered data
  const totalFilteredItems = allFilteredServices.length;
  const totalPages = Math.ceil(totalFilteredItems / pageSize);
  const startItem = totalFilteredItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, totalFilteredItems);

  // Paginate the filtered results
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const cleaningServices = allFilteredServices.slice(startIndex, endIndex);

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
            <div>
              <h2 className="text-white text-xl font-semibold">Cleaning Services</h2>
              <p className="text-gray-400 text-sm">Verified cleaners near you</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isOfferDialogOpen} onOpenChange={setIsOfferDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white rounded-full px-4 py-2 text-sm font-medium flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Offer
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1A1A1A] border-[#FF6B35]/20 text-white max-w-sm max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#FF6B35]" />
                    Post Cleaning Service
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="service-name" className="text-white">Your Name</Label>
                    <Input
                      id="service-name"
                      value={newOffering.name}
                      onChange={(e) => setNewOffering({ ...newOffering, name: e.target.value })}
                      placeholder="e.g., Sarah Johnson"
                      className="bg-[#2D2D2D] border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service-description" className="text-white">Description</Label>
                    <Textarea
                      id="service-description"
                      value={newOffering.description}
                      onChange={(e) => setNewOffering({ ...newOffering, description: e.target.value })}
                      placeholder="Tell people about your cleaning services..."
                      className="bg-[#2D2D2D] border-gray-700 text-white min-h-20"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="service-price" className="text-white">Price/Hour</Label>
                      <Input
                        id="service-price"
                        value={newOffering.price}
                        onChange={(e) => setNewOffering({ ...newOffering, price: e.target.value })}
                        placeholder="$30"
                        className="bg-[#2D2D2D] border-gray-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="service-availability" className="text-white">Availability</Label>
                      <Input
                        id="service-availability"
                        value={newOffering.availability}
                        onChange={(e) => setNewOffering({ ...newOffering, availability: e.target.value })}
                        placeholder="Today"
                        className="bg-[#2D2D2D] border-gray-700 text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Services Offered</Label>
                    <div className="flex flex-wrap gap-2">
                      {["Deep Cleaning", "Regular Cleaning", "Move-in/out", "Pet-friendly", "Office Cleaning", "Eco-friendly"].map((type) => (
                        <Button
                          key={type}
                          variant={newOffering.serviceTypes.includes(type) ? "default" : "outline"}
                          size="sm"
                          type="button"
                          className={newOffering.serviceTypes.includes(type)
                            ? "bg-gradient-to-r from-[#FF6B35] to-[#FFB84D] text-white border-none" 
                            : "bg-[#2D2D2D] border-gray-700 text-gray-300 hover:bg-[#3D3D3D]"}
                          onClick={() => toggleServiceType(type)}
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-[#FF6B35]/10 to-[#FFB84D]/10 rounded-lg p-3 border border-[#FF6B35]/30">
                    <p className="text-xs text-gray-300">
                      💝 Mom will help match your service with people who need it!
                    </p>
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FFB84D] text-white hover:opacity-90"
                    disabled={creatingSlot || !newOffering.name || !newOffering.price}
                    onClick={async () => {
                      if (!isAuthenticated) {
                        alert("Please login to post a service");
                        navigate('/login');
                        return;
                      }

                      // Generate unique ID
                      const slotId = `clean_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                      
                      const result = await createSlot({
                        slotId,
                        time: newOffering.availability || "Flexible",
                        availableCleaner: newOffering.name,
                        petFriendly: newOffering.serviceTypes.includes("Pet-friendly"),
                        price: newOffering.price.includes('/hr') ? newOffering.price : `$${newOffering.price}/hr`,
                        duration: 2,
                        description: newOffering.description || `Professional cleaning service by ${newOffering.name}`,
                        available: true,
                      });

                      if (result.success) {
                        setIsOfferDialogOpen(false);
                        setNewOffering({ name: "", description: "", price: "", availability: "", serviceTypes: [] });
                        alert("Cleaning service posted successfully! 🎉");
                        window.location.reload();
                      } else {
                        alert("Failed to post service. Please try again.");
                      }
                    }}
                  >
                    {creatingSlot ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      "Post Service"
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

      {/* Filter Buttons */}
      <div className="px-4 sm:px-6 py-4 border-b border-[#FF6B35]/10">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 overflow-x-auto pb-2">
            <Button
              onClick={() => setSelectedFilter("all")}
              className={`rounded-full px-5 py-2 text-sm font-medium whitespace-nowrap transition-all ${
                selectedFilter === "all"
                  ? "bg-[#FF6B35] text-white hover:bg-[#FF6B35]/90"
                  : "bg-[#2D2D2D] text-gray-300 hover:bg-[#3D3D3D]"
              }`}
            >
              🏠 All Services
            </Button>
            <Button
              onClick={() => setSelectedFilter("deep")}
              className={`rounded-full px-5 py-2 text-sm font-medium whitespace-nowrap transition-all ${
                selectedFilter === "deep"
                  ? "bg-[#FF6B35] text-white hover:bg-[#FF6B35]/90"
                  : "bg-[#2D2D2D] text-gray-300 hover:bg-[#3D3D3D]"
              }`}
            >
              ✨ Deep Clean
            </Button>
            <Button
              onClick={() => setSelectedFilter("regular")}
              className={`rounded-full px-5 py-2 text-sm font-medium whitespace-nowrap transition-all ${
                selectedFilter === "regular"
                  ? "bg-[#FF6B35] text-white hover:bg-[#FF6B35]/90"
                  : "bg-[#2D2D2D] text-gray-300 hover:bg-[#3D3D3D]"
              }`}
            >
              🧹 Regular
            </Button>
          </div>
          {/* Results Counter */}
          <motion.p
            key={selectedFilter}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-400 text-sm mt-2"
          >
            {totalFilteredItems > 0 ? (
              <>
                Showing <span className="text-[#FF6B35] font-semibold">{startItem}-{endItem}</span> from <span className="text-white font-semibold">{totalFilteredItems}</span> {selectedFilter !== "all" ? selectedFilter : ''} {totalFilteredItems === 1 ? 'cleaner' : 'cleaners'}
                {selectedFilter !== "all" && <span className="text-[#FF6B35] ml-1">• {selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}</span>}
              </>
            ) : (
              <>
                No cleaners found
                {selectedFilter !== "all" && <span className="text-[#FF6B35] ml-1">• {selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}</span>}
              </>
            )}
          </motion.p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Error Message */}
          {slotsError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5"
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">⚠️</div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-2">Aiyo! Cannot load cleaners lah</h3>
                  <p className="text-gray-300 text-sm">
                    Something went wrong. Check your connection and try again, can?
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {loadingSlots && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#1A1A1A] rounded-2xl p-5 border border-[#FF6B35]/20 animate-pulse">
                  <div className="flex gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-[#2D2D2D]"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-6 bg-[#2D2D2D] rounded w-1/2"></div>
                      <div className="h-4 bg-[#2D2D2D] rounded w-1/3"></div>
                    </div>
                  </div>
                  <div className="h-20 bg-[#2D2D2D] rounded"></div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Booking Suggestion - Only show for "all" or "deep" filters */}
          {!loadingSlots && !slotsError && (selectedFilter === "all" || selectedFilter === "deep") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-br from-[#2D2D2D] to-[#1A1A1A] rounded-2xl p-5 border border-[#FF6B35]/30"
            >
              <div className="flex items-start gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-[#FF6B35] shrink-0" />
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-2">Quick booking suggestion</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Sarah is available today and has great reviews for deep cleaning. Want me to book her for you? 🪄
                  </p>
                </div>
              </div>
              <Button className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white rounded-xl px-6 py-2 font-medium">
                Book Sarah Now
              </Button>
            </motion.div>
          )}

          {/* No Results Message */}
          {!loadingSlots && !slotsError && cleaningServices.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1A1A1A] rounded-2xl p-8 border border-[#FF6B35]/20 text-center"
            >
              <div className="text-6xl mb-4">😢</div>
              <h3 className="text-white font-semibold text-lg mb-2">No cleaners found</h3>
              <p className="text-gray-400 text-sm">
                Try selecting a different filter or check back later.
              </p>
            </motion.div>
          )}

          {/* Cleaning Service Cards */}
          {!loadingSlots && !slotsError && cleaningServices.map((service, index) => (
            <motion.div
              key={`${selectedFilter}-${service.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
              className="bg-[#1A1A1A] rounded-2xl p-5 border border-[#FF6B35]/20 hover:border-[#FF6B35]/40 transition-all"
            >
              {/* Top Section: Profile and Basic Info */}
              <div className="flex gap-4 mb-4">
                {/* Profile Picture */}
                <div className="relative shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FFB84D] flex items-center justify-center text-3xl overflow-hidden">
                    {service.image ? (
                      <img 
                        src={service.image} 
                        alt={service.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '👨‍🔧';
                        }}
                      />
                    ) : (
                      <span className="text-3xl">👨‍🔧</span>
                    )}
                  </div>
                  {service.verified && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-[#1A1A1A]">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>

                {/* Name and Price */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{service.name}</h3>
                      <p className="text-gray-400 text-sm">{service.experience}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[#FFB84D] font-bold text-xl">${service.price}</div>
                      <div className="text-gray-400 text-xs">per hour</div>
                    </div>
                  </div>

                  {/* Rating and Availability */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-[#FFB84D] text-[#FFB84D]" />
                      <span className="text-white font-semibold text-sm">{service.rating}</span>
                      <span className="text-gray-400 text-sm">({service.reviews} reviews)</span>
                    </div>
                    <span className="text-green-400 text-sm font-medium">{service.availability}</span>
                  </div>
                </div>
              </div>

              {/* Distance and Reply Time */}
              <div className="flex items-center gap-4 mb-4 text-gray-400 text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{service.distance}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Replies in {service.replyTime}</span>
                </div>
              </div>

              {/* Services Tags */}
              <div className="mb-4">
                <p className="text-gray-400 text-xs mb-2">Services:</p>
                <div className="flex flex-wrap gap-2">
                  {service.services.map((tag, idx) => (
                    <Badge
                      key={idx}
                      className="bg-[#2D2D2D] text-gray-300 border-gray-700 text-xs px-3 py-1"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Highlight Section */}
              <div className="bg-gradient-to-r from-[#2D2D2D] to-[#1A1A1A] rounded-xl p-3 mb-4">
                <p className="text-sm text-gray-300">
                  💝 {service.highlight}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white rounded-xl py-6 font-medium flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Book Now
                </Button>
                <Button
                  variant="outline"
                  className="bg-[#2D2D2D] hover:bg-[#3D3D3D] text-gray-300 border-gray-700 rounded-xl px-6 py-6 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination Controls */}
        {!loadingSlots && cleaningServices.length > 0 && totalPages > 1 && (
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

      {/* Bottom Navigation */}
      <BottomNav />
      
      {/* Spacer for fixed nav */}
      <div className="h-20"></div>
    </div>
  );
}

