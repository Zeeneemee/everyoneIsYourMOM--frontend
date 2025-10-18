import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { 
  ChevronLeft, 
  LogOut, 
  Bell, 
  Lock, 
  Globe, 
  Palette,
  HelpCircle,
  Shield,
  ChevronRight,
  Moon,
  Sun
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";

export function SettingsScreen() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const settingsGroups = [
    {
      title: "Preferences",
      items: [
        {
          icon: notifications ? Bell : Bell,
          label: "Notifications",
          description: "Push notifications and alerts",
          action: () => setNotifications(!notifications),
          showToggle: true,
          toggleValue: notifications,
        },
        {
          icon: darkMode ? Moon : Sun,
          label: "Dark Mode",
          description: "App appearance",
          action: () => setDarkMode(!darkMode),
          showToggle: true,
          toggleValue: darkMode,
        },
        {
          icon: Globe,
          label: "Language",
          description: "English",
          action: () => console.log("Language settings"),
          showChevron: true,
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          icon: Lock,
          label: "Privacy & Security",
          description: "Manage your privacy settings",
          action: () => console.log("Privacy settings"),
          showChevron: true,
        },
        {
          icon: Shield,
          label: "Account Security",
          description: "Password and authentication",
          action: () => console.log("Security settings"),
          showChevron: true,
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: HelpCircle,
          label: "Help & Support",
          description: "Get help with the app",
          action: () => console.log("Help"),
          showChevron: true,
        },
        {
          icon: Palette,
          label: "About",
          description: "Version 1.0.0",
          action: () => console.log("About"),
          showChevron: true,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col">
      {/* Header */}
      <div className="bg-[#0F0F0F] px-4 sm:px-6 py-4 border-b border-[#2A2A2A]">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-white hover:text-[#FF6B35] hover:bg-transparent p-0"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div className="flex-1 ml-4">
            <h1 className="text-white text-xl font-semibold">Settings</h1>
            <p className="text-gray-400 text-sm">Manage your preferences</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 max-w-4xl mx-auto w-full pb-24">
        {/* Settings Groups */}
        {settingsGroups.map((group, groupIdx) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIdx * 0.1 }}
            className="mb-6"
          >
            <h2 className="text-gray-400 text-sm font-medium mb-3 px-2">
              {group.title}
            </h2>
            <div className="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] overflow-hidden">
              {group.items.map((item, itemIdx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className={`w-full flex items-center justify-between p-4 hover:bg-[#2A2A2A] transition-colors ${
                      itemIdx !== group.items.length - 1 ? 'border-b border-[#2A2A2A]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-[#2A2A2A] flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[#FF6B35]" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-white font-medium">{item.label}</div>
                        <div className="text-gray-400 text-sm">{item.description}</div>
                      </div>
                    </div>
                    {item.showToggle && (
                      <div className={`w-12 h-6 rounded-full transition-colors ${
                        item.toggleValue ? 'bg-[#FF6B35]' : 'bg-[#2A2A2A]'
                      }`}>
                        <div className={`w-5 h-5 rounded-full bg-white transform transition-transform mt-0.5 ${
                          item.toggleValue ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </div>
                    )}
                    {item.showChevron && (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={() => setShowLogoutDialog(true)}
            className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-2xl h-14 font-medium"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </motion.div>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Logout</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to logout? You'll need to sign in again to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
              className="flex-1 bg-transparent border-[#2A2A2A] text-white hover:bg-[#2A2A2A] hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogout}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

