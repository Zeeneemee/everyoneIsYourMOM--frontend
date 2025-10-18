import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AIMomAvatar } from "./AIMomAvatar";
import { BottomNav } from "./BottomNav";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { ArrowLeft, Search, Star, MapPin, Calendar, Users, ChefHat, Home, Sparkles, Package, MessageCircle, Clock, Plus, User } from "lucide-react";

export function CleaningScreen() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [newOffering, setNewOffering] = useState({
    name: "",
    description: "",
    price: "",
    availability: "",
    serviceTypes: []
  });

  // Toggle service type selection
  const toggleServiceType = (type) => {
    setNewOffering(prev => ({
      ...prev,
      serviceTypes: prev.serviceTypes.includes(type)
        ? prev.serviceTypes.filter(t => t !== type)
        : [...prev.serviceTypes, type]
    }));
  };

  // Load cleaning data from data.json
  const allCleaningServices = [
    {
      id: "clean_01",
      name: "Sarah Johnson",
      experience: "8 years experience",
      rating: 4.9,
      reviews: 156,
      price: 35,
      distance: "0.5 km away",
      replyTime: "< 5 min",
      availability: "Available today",
      services: ["Deep Cleaning", "Regular Cleaning", "Move-in/out"],
      highlight: "Top-rated in your area with excellent deep cleaning reviews!",
      image: "👩‍🦰",
      verified: true
    },
    {
      id: "clean_02",
      name: "Maria Garcia",
      experience: "10 years experience",
      rating: 4.8,
      reviews: 203,
      price: 40,
      distance: "1.2 km away",
      replyTime: "< 10 min",
      availability: "Tomorrow 9 AM",
      services: ["Deep Cleaning", "Office Cleaning", "Eco-friendly"],
      highlight: "Eco-friendly specialist - perfect for your green lifestyle!",
      image: "👩‍🔧",
      verified: true
    },
    {
      id: "clean_03",
      name: "Auntie Siew",
      experience: "15 years experience",
      rating: 4.9,
      reviews: 312,
      price: 30,
      distance: "0.8 km away",
      replyTime: "< 15 min",
      availability: "Available today",
      services: ["Regular Cleaning", "Pet-friendly", "Ironing"],
      highlight: "Pet-friendly expert - your furry friends will love her!",
      image: "👵",
      verified: true
    },
    {
      id: "clean_04",
      name: "Jenny Tan",
      experience: "6 years experience",
      rating: 4.7,
      reviews: 89,
      price: 32,
      distance: "1.5 km away",
      replyTime: "< 20 min",
      availability: "Tomorrow 2 PM",
      services: ["Deep Cleaning", "Regular Cleaning", "Windows"],
      highlight: "Window cleaning specialist - crystal clear results!",
      image: "👩",
      verified: true
    },
    {
      id: "clean_05",
      name: "Lily Wong",
      experience: "5 years experience",
      rating: 4.6,
      reviews: 67,
      price: 28,
      distance: "2.0 km away",
      replyTime: "< 30 min",
      availability: "Available today",
      services: ["Regular Cleaning", "Laundry", "Organization"],
      highlight: "Organization expert - she'll make your home sparkle!",
      image: "👩‍🦱",
      verified: true
    },
    {
      id: "clean_06",
      name: "Uncle Raj",
      experience: "12 years experience",
      rating: 4.8,
      reviews: 145,
      price: 38,
      distance: "1.0 km away",
      replyTime: "< 15 min",
      availability: "Tomorrow 10 AM",
      services: ["Deep Cleaning", "Post-renovation", "Commercial"],
      highlight: "Post-renovation specialist - tackles the toughest jobs!",
      image: "👨‍🔧",
      verified: true
    }
  ];

  // Filter cleaning services based on selected filter
  const cleaningServices = allCleaningServices.filter((service) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "deep") {
      return service.services.some(s => s.toLowerCase().includes("deep"));
    }
    if (selectedFilter === "regular") {
      return service.services.some(s => s.toLowerCase().includes("regular"));
    }
    return true;
  });

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
                    onClick={() => {
                      // Handle posting
                      setIsOfferDialogOpen(false);
                      setNewOffering({ name: "", description: "", price: "", availability: "", serviceTypes: [] });
                    }}
                  >
                    Post Service
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
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
            {cleaningServices.length} cleaner{cleaningServices.length !== 1 ? 's' : ''} available
          </motion.p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Quick Booking Suggestion - Only show for "all" or "deep" filters */}
          {(selectedFilter === "all" || selectedFilter === "deep") && (
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
          {cleaningServices.length === 0 && (
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
          {cleaningServices.map((service, index) => (
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
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FFB84D] flex items-center justify-center text-3xl">
                    {service.image}
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
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
      
      {/* Spacer for fixed nav */}
      <div className="h-20"></div>
    </div>
  );
}

