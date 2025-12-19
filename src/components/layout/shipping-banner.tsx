"use client";

import { Globe, Sparkles } from "lucide-react";

export default function ShippingBanner() {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-3 px-4 shadow-lg border-b border-blue-500/20">
      {/* Animated shimmer overlay */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)]"
          style={{
            backgroundSize: '200% 100%',
            animation: 'shimmer 3s ease-in-out infinite'
          }}
        ></div>
      </div>
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
      
      <div className="relative max-w-7xl mx-auto flex items-center justify-center gap-3">
        {/* Animated globe icon with sparkle */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Globe className="h-5 w-5 drop-shadow-lg animate-pulse" />
            <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-300 drop-shadow-md animate-ping" style={{ animationDuration: '2s' }} />
          </div>
        </div>
        
        {/* Text with enhanced styling */}
        <p className="text-sm font-bold text-center tracking-wide drop-shadow-md">
          <span className="relative inline-block">
            Worldwide shipping from our Canada Warehouse! • Delivery within 2 days
            <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></span>
          </span>
        </p>
        
        {/* Decorative sparkle dots */}
        <div className="hidden sm:flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-yellow-300 shadow-sm animate-pulse" style={{ animationDelay: '0s' }}></div>
          <div className="h-1.5 w-1.5 rounded-full bg-yellow-300 shadow-sm animate-pulse" style={{ animationDelay: '0.3s' }}></div>
          <div className="h-1.5 w-1.5 rounded-full bg-yellow-300 shadow-sm animate-pulse" style={{ animationDelay: '0.6s' }}></div>
        </div>
      </div>
    </div>
  );
}

