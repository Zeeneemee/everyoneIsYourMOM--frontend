import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1A1A1A] px-4 sm:px-6 py-4 border-t border-[#FF6B35]/10 z-50">
      <div className="flex items-center justify-around max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          className={`flex flex-col items-center gap-1 ${
            isActive('/home') 
              ? 'text-[#FF6B35] hover:bg-[#FF6B35]/10' 
              : 'text-white hover:text-[#FF6B35] hover:bg-[#FF6B35]/10'
          } min-w-[60px]`}
          onClick={() => navigate('/home')}
        >
          <div className="flex items-center justify-center w-8 h-8">
            <span className="text-xl">🏠</span>
          </div>
          <span className="text-xs font-medium">Home</span>
        </Button>
        <Button 
          variant="ghost" 
          className={`flex flex-col items-center gap-1 ${
            isActive('/food') 
              ? 'text-[#FF6B35] hover:bg-[#FF6B35]/10' 
              : 'text-white hover:text-[#FF6B35] hover:bg-[#FF6B35]/10'
          } min-w-[60px]`}
          onClick={() => navigate('/food')}
        >
          <div className="flex items-center justify-center w-8 h-8">
            <span className="text-xl">🍽️</span>
          </div>
          <span className="text-xs font-medium">Food</span>
        </Button>
        <Button 
          variant="ghost" 
          className={`flex flex-col items-center gap-1 ${
            isActive('/clean') 
              ? 'text-[#FF6B35] hover:bg-[#FF6B35]/10' 
              : 'text-white hover:text-[#FF6B35] hover:bg-[#FF6B35]/10'
          } min-w-[60px]`}
          onClick={() => navigate('/clean')}
        >
          <div className="flex items-center justify-center w-8 h-8">
            <span className="text-xl">✨</span>
          </div>
          <span className="text-xs font-medium">Clean</span>
        </Button>
        <Button 
          variant="ghost" 
          className={`flex flex-col items-center gap-1 ${
            isActive('/items') 
              ? 'text-[#FF6B35] hover:bg-[#FF6B35]/10' 
              : 'text-white hover:text-[#FF6B35] hover:bg-[#FF6B35]/10'
          } min-w-[60px]`}
          onClick={() => navigate('/items')}
        >
          <div className="flex items-center justify-center w-8 h-8">
            <span className="text-xl">📦</span>
          </div>
          <span className="text-xs font-medium">Items</span>
        </Button>
      </div>
    </div>
  );
}

