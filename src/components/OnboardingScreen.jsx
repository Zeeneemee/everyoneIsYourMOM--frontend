import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { mutateConvex } from '../lib/convex';

export function OnboardingScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Check if user has already completed onboarding
  useEffect(() => {
    if (user?.onboardingCompleted) {
      // User has already completed onboarding, redirect to home
      navigate('/home');
    }
  }, [user, navigate]);

  // Form state
  const [preferences, setPreferences] = useState({
    // Step 1: Dietary Restrictions
    dietaryRestrictions: [],
    allergens: [],
    
    // Step 2: Favorite Cuisines
    cuisines: [],
    
    // Step 3: Health & Home Goals
    healthGoals: [],
    cleaningFrequency: '',
    
    // Step 4: Exchange Interests
    exchangeInterests: [],
    additionalNotes: '',
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  // Step 1: Dietary Restrictions Options
  const dietaryOptions = [
    { id: 'vegetarian', emoji: '🥗', label: 'Vegetarian' },
    { id: 'vegan', emoji: '🌱', label: 'Vegan' },
    { id: 'halal', emoji: '☪️', label: 'Halal' },
    { id: 'kosher', emoji: '✡️', label: 'Kosher' },
    { id: 'gluten-free', emoji: '🌾', label: 'Gluten-Free' },
    { id: 'dairy-free', emoji: '🥛', label: 'Dairy-Free' },
  ];

  const allergenOptions = [
    { id: 'nuts', emoji: '🥜', label: 'Nuts' },
    { id: 'shellfish', emoji: '🦐', label: 'Shellfish' },
    { id: 'eggs', emoji: '🥚', label: 'Eggs' },
    { id: 'soy', emoji: '🫘', label: 'Soy' },
  ];

  // Step 2: Cuisine Options
  const cuisineOptions = [
    { id: 'italian', emoji: '🍝', label: 'Italian' },
    { id: 'asian', emoji: '🍜', label: 'Asian' },
    { id: 'mexican', emoji: '🌮', label: 'Mexican' },
    { id: 'indian', emoji: '🍛', label: 'Indian' },
    { id: 'american', emoji: '🍔', label: 'American' },
    { id: 'mediterranean', emoji: '🥙', label: 'Mediterranean' },
  ];

  // Step 3: Health Goals
  const healthGoalOptions = [
    { id: 'weight-loss', emoji: '⚖️', label: 'Weight Loss' },
    { id: 'muscle-gain', emoji: '💪', label: 'Muscle Gain' },
    { id: 'more-energy', emoji: '⚡', label: 'More Energy' },
    { id: 'general-health', emoji: '❤️', label: 'General Health' },
  ];

  const cleaningFrequencyOptions = [
    { id: 'weekly', label: 'Weekly' },
    { id: 'bi-weekly', label: 'Bi-weekly' },
    { id: 'monthly', label: 'Monthly' },
  ];

  // Step 4: Exchange Interests
  const exchangeInterestOptions = [
    { id: 'books', emoji: '📚', label: 'Books' },
    { id: 'kitchen', emoji: '🔍', label: 'Kitchen' },
    { id: 'home-decor', emoji: '🏠', label: 'Home Decor' },
    { id: 'sports', emoji: '⚽', label: 'Sports' },
    { id: 'tech', emoji: '⌨️', label: 'Tech' },
    { id: 'clothes', emoji: '👕', label: 'Clothes' },
  ];

  const toggleSelection = (category, value) => {
    setPreferences((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    navigate('/home');
  };

  const handleComplete = async () => {
    if (!user?.id) {
      console.error('No user ID found');
      return;
    }

    setLoading(true);
    try {
      // Save preferences to Convex
      await mutateConvex('users:updatePreferences', {
        userId: user.id,
        dietaryRestrictions: preferences.dietaryRestrictions,
        allergens: preferences.allergens,
        preferredTags: [
          ...preferences.cuisines,
          ...preferences.healthGoals,
          ...preferences.exchangeInterests,
        ],
        preferredTimeSlots: preferences.cleaningFrequency ? [preferences.cleaningFrequency] : [],
        petFriendly: false, // Default value
        maxDistance: 5.0, // Default value
        language: 'en', // Default value
        voiceEnabled: true, // Default value
        notificationsEnabled: true, // Default value
      });

      // Mark onboarding as completed
      await mutateConvex('users:completeOnboarding', {
        userId: user.id,
      });

      // Navigate to home
      navigate('/home');
    } catch (error) {
      console.error('Failed to save preferences:', error);
      // Still navigate even if save fails
      navigate('/home');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0F0F0F] border-b border-gray-800 px-4 py-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            disabled={currentStep === 1}
          >
            <ChevronLeft className={`w-6 h-6 ${currentStep === 1 ? 'opacity-30' : ''}`} />
          </button>

          {/* Title */}
          <div className="text-center flex-1">
            <h1 className="text-xl font-bold tracking-wide">Tell Mom About You</h1>
            <p className="text-sm text-gray-400 mt-0.5">Step {currentStep} of {totalSteps}</p>
          </div>

          {/* Mom Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FFB84D] flex items-center justify-center text-2xl">
            😊
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-1.5 bg-gray-800 rounded-full overflow-hidden max-w-md mx-auto">
          <motion.div
            className="h-full bg-gradient-to-r from-[#FF6B35] to-[#FFB84D] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-8 pb-32 max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {/* Step 1: Dietary Restrictions */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🍽️</div>
                <h2 className="text-2xl font-bold mb-2">Dietary Preferences?</h2>
                <p className="text-gray-400">Let Mom know how to feed you right</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-300">Dietary Restrictions</h3>
                <div className="grid grid-cols-2 gap-3">
                  {dietaryOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => toggleSelection('dietaryRestrictions', option.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        preferences.dietaryRestrictions.includes(option.id)
                          ? 'border-[#FF6B35] bg-[#FF6B35]/10'
                          : 'border-gray-700 bg-[#1A1A1A] hover:border-gray-600'
                      }`}
                    >
                      <div className="text-3xl mb-2">{option.emoji}</div>
                      <div className="text-sm font-medium">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 mt-8">
                <h3 className="text-lg font-semibold text-gray-300">Allergens to Avoid</h3>
                <div className="grid grid-cols-2 gap-3">
                  {allergenOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => toggleSelection('allergens', option.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        preferences.allergens.includes(option.id)
                          ? 'border-[#FF6B35] bg-[#FF6B35]/10'
                          : 'border-gray-700 bg-[#1A1A1A] hover:border-gray-600'
                      }`}
                    >
                      <div className="text-3xl mb-2">{option.emoji}</div>
                      <div className="text-sm font-medium">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Favorite Cuisines */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🌍</div>
                <h2 className="text-2xl font-bold mb-2">Favorite Cuisines?</h2>
                <p className="text-gray-400">Choose what you love to eat</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {cuisineOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => toggleSelection('cuisines', option.id)}
                    className={`p-5 rounded-xl border-2 transition-all ${
                      preferences.cuisines.includes(option.id)
                        ? 'border-[#FF6B35] bg-[#FF6B35]/10'
                        : 'border-gray-700 bg-[#1A1A1A] hover:border-gray-600'
                    }`}
                  >
                    <div className="text-4xl mb-3">{option.emoji}</div>
                    <div className="text-base font-medium">{option.label}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Health & Home Goals */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">💪</div>
                <h2 className="text-2xl font-bold mb-2">Health & Home Goals</h2>
                <p className="text-gray-400">Help Mom personalize your experience</p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-gray-300 mb-3">Health Goals</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {healthGoalOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => toggleSelection('healthGoals', option.id)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          preferences.healthGoals.includes(option.id)
                            ? 'border-[#FF6B35] bg-[#FF6B35]/10'
                            : 'border-gray-700 bg-[#1A1A1A] hover:border-gray-600'
                        }`}
                      >
                        <div className="text-3xl mb-2">{option.emoji}</div>
                        <div className="text-sm font-medium">{option.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-300 mb-3">Cleaning Frequency</h3>
                  <div className="flex gap-3">
                    {cleaningFrequencyOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() =>
                          setPreferences((prev) => ({
                            ...prev,
                            cleaningFrequency: option.id,
                          }))
                        }
                        className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all text-sm font-medium ${
                          preferences.cleaningFrequency === option.id
                            ? 'border-[#FF6B35] bg-[#FF6B35]/10'
                            : 'border-gray-700 bg-[#1A1A1A] hover:border-gray-600'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Exchange Interests */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🔄</div>
                <h2 className="text-2xl font-bold mb-2">Exchange Interests</h2>
                <p className="text-gray-400">What items interest you?</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {exchangeInterestOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => toggleSelection('exchangeInterests', option.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      preferences.exchangeInterests.includes(option.id)
                        ? 'border-[#FF6B35] bg-[#FF6B35]/10'
                        : 'border-gray-700 bg-[#1A1A1A] hover:border-gray-600'
                    }`}
                  >
                    <div className="text-3xl mb-2">{option.emoji}</div>
                    <div className="text-xs font-medium">{option.label}</div>
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="text-base font-semibold text-gray-300 mb-3">
                  Anything else Mom should know?
                </h3>
                <textarea
                  value={preferences.additionalNotes}
                  onChange={(e) =>
                    setPreferences((prev) => ({
                      ...prev,
                      additionalNotes: e.target.value,
                    }))
                  }
                  placeholder="Tell Mom about any other preferences, habits, or needs..."
                  className="w-full h-32 px-4 py-3 bg-[#1A1A1A] border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-[#FF6B35] focus:outline-none resize-none"
                />
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-[#FF6B35]/10 to-[#FFB84D]/10 border border-[#FF6B35]/30 rounded-xl">
                <p className="text-sm text-gray-300 text-center">
                  🎉 Almost done! Mom will use this to personalize your recommendations
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0F0F0F] border-t border-gray-800 px-4 py-6">
        <div className="max-w-md mx-auto space-y-3">
          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FFB84D] text-white hover:opacity-90 h-14 text-base font-semibold rounded-xl"
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FFB84D] text-white hover:opacity-90 h-14 text-base font-semibold rounded-xl"
            >
              {loading ? (
                'Saving...'
              ) : (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Complete Setup
                </>
              )}
            </Button>
          )}

          <button
            onClick={handleSkip}
            className="w-full text-gray-400 hover:text-white py-3 text-sm font-medium transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}

