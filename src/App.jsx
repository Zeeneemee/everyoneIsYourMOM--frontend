import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthProvider } from './contexts/AuthContext'
import { VoiceAssistantProvider } from './contexts/VoiceAssistantContext'
import { VoiceAssistantModal } from './components/VoiceAssistantModal'
import { SplashScreen } from './components/SplashScreen'
import { HomeScreen } from './components/HomeScreen'
import { FoodScreen } from './components/FoodScreen'
import { FoodDetailPage } from './components/FoodDetailPage'
import { CleaningScreen } from './components/CleaningScreen'
import { ExchangeScreen } from './components/ExchangeScreen'
import { ProfileScreen } from './components/ProfileScreen'
import { SettingsScreen } from './components/SettingsScreen'
import { LoginScreen } from './components/LoginScreen'
import { RegisterScreen } from './components/RegisterScreen'
import { OnboardingScreen } from './components/OnboardingScreen'
import { PaymentSuccessScreen } from './components/PaymentSuccessScreen'
import { OrderTrackingScreen } from './components/OrderTrackingScreen'
import { seedConvexData, isDataSeeded } from './utils/dataSeed'

function App() {
  const [seedingStatus, setSeedingStatus] = useState('idle')

  // Initialize data seeding on app load
  useEffect(() => {
    async function initializeSeed() {
      if (!isDataSeeded()) {
        setSeedingStatus('seeding')
        try {
          const result = await seedConvexData()
          console.log('Seeding completed:', result)
          setSeedingStatus('completed')
        } catch (error) {
          console.error('Seeding failed:', error)
          setSeedingStatus('error')
        }
      } else {
        setSeedingStatus('completed')
      }
    }

    // Small delay to allow splash screen to show
    const timer = setTimeout(() => {
      initializeSeed()
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <Router>
      <AuthProvider>
        <VoiceAssistantProvider>
          <div className="w-full min-h-screen bg-[#0F0F0F] overflow-hidden">
            <div className="max-w-md mx-auto min-h-screen relative bg-[#0F0F0F] shadow-2xl">
              <Routes>
                <Route path="/" element={<SplashScreen />} />
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/register" element={<RegisterScreen />} />
                <Route path="/onboarding" element={<OnboardingScreen />} />
                <Route path="/home" element={<HomeScreen />} />
                <Route path="/food" element={<FoodScreen />} />
                <Route path="/food/card/:query" element={<FoodDetailPage />} />
                <Route path="/food/:id" element={<FoodDetailPage />} />
                <Route path="/clean" element={<CleaningScreen />} />
                <Route path="/items" element={<ExchangeScreen />} />
                <Route path="/profile" element={<ProfileScreen />} />
                <Route path="/settings" element={<SettingsScreen />} />
                <Route path="/payment-success" element={<PaymentSuccessScreen />} />
                <Route path="/order-tracking" element={<OrderTrackingScreen />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>

              {/* Device Frame Decoration */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-50 hidden sm:block" />
            </div>
          </div>

          {/* Voice Assistant Modal */}
          <VoiceAssistantModal />
        </VoiceAssistantProvider>
      </AuthProvider>
    </Router>
  )
}

export default App

