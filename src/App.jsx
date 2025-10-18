import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SplashScreen } from './components/SplashScreen'
import { HomeScreen } from './components/HomeScreen'
import { FoodScreen } from './components/FoodScreen'
import { CleaningScreen } from './components/CleaningScreen'
import { ExchangeScreen } from './components/ExchangeScreen'
import { ProfileScreen } from './components/ProfileScreen'

function App() {
  return (
    <Router>
      <div className="w-full min-h-screen bg-[#0F0F0F] overflow-hidden">
        <div className="max-w-md mx-auto min-h-screen relative bg-[#0F0F0F] shadow-2xl">
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/home" element={<HomeScreen />} />
            <Route path="/food" element={<FoodScreen />} />
            <Route path="/clean" element={<CleaningScreen />} />
            <Route path="/items" element={<ExchangeScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Device Frame Decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-50 hidden sm:block" />
        </div>
      </div>
    </Router>
  )
}

export default App

