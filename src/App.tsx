import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Bell, User, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Product, CartItem } from './types';
import { FOOD_ITEMS, MARKET_ITEMS } from './data';
import StorefrontView from './components/Storefront/StorefrontView';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// --- Components ---

const Logo = () => (
  <div className="h-[85%] aspect-square relative flex items-center justify-center transition-all">
    <div className="bg-[#0038A8] w-full h-full flex items-center justify-center relative shadow-lg overflow-hidden border border-white/10">
      {/* The 7 in Source Sans 3 (Frutiger alternative) */}
      <span className="text-white text-[250%] font-[900] font-source leading-[1] select-none">
        7
      </span>
      {/* The MID with careful outline to not block the 7 */}
      <span 
        className="absolute text-[#CE1126] text-[80%] font-black font-montserrat tracking-tight top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none z-10"
        style={{ 
          textShadow: `
            -1px -1px 0 #fff,  
             1px -1px 0 #fff,
            -1px  1px 0 #fff,
             1px  1px 0 #fff,
             0 0 4px rgba(255,255,255,1)
          `,
          WebkitFontSmoothing: 'antialiased'
        }}
      >
        MID
      </span>
    </div>
  </div>
);

const GhostButton = ({ label, color, onClick }: { label: string; color: string; onClick?: () => void }) => {
  const hapticFeedback = () => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
  };

  return (
    <motion.button
      className="mt-6 px-10 py-3.5 bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/30 text-white text-[14px] font-semibold uppercase tracking-[2px] transition-all duration-300 relative overflow-hidden group rounded-sm shadow-xl min-h-[48px] min-w-[200px]"
      whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.2)" }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        hapticFeedback();
        onClick?.();
      }}
    >
      <span className="relative z-10 transition-colors duration-300 group-hover:text-white">{label}</span>
      <div 
        className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0 opacity-40"
        style={{ backgroundColor: color }}
      />
    </motion.button>
  );
};

const IconButton = ({ children, onClick, className = "", badge }: { children: React.ReactNode; onClick?: () => void; className?: string, badge?: number }) => (
  <button 
    onClick={onClick}
    className={`p-1.5 md:p-2 bg-white/10 dark:bg-black/10 backdrop-blur-md hover:bg-white/20 rounded-full transition-all duration-200 text-white border border-white/10 shadow-lg min-h-[44px] min-w-[44px] flex items-center justify-center relative ${className}`}
  >
    {children}
    {badge !== undefined && badge > 0 && (
      <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-red text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-black/20">
        {badge}
      </span>
    )}
  </button>
);

const SectionArrow = ({ direction }: { direction: 'up' | 'down' | 'left' | 'right' }) => {
  const isHorizontal = direction === 'left' || direction === 'right';
  
  return (
    <motion.div
      animate={
        isHorizontal 
          ? { x: direction === 'left' ? [0, -10, 0] : [0, 10, 0] }
          : { y: direction === 'up' ? [0, -10, 0] : [0, 10, 0] }
      }
      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      className="text-white flex items-center justify-center"
    >
      <div className={
        direction === 'up' ? 'rotate-180' : 
        direction === 'left' ? 'rotate-90' : 
        direction === 'right' ? '-rotate-90' : ''
      }>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m19 9-7 7-7-7"/></svg>
      </div>
    </motion.div>
  );
};

const Footer = ({ activeSection, onTabClick }: { activeSection: 'food' | 'market', onTabClick: (section: 'food' | 'market') => void }) => {
  const highlightClass = "absolute inset-x-0 bottom-0 h-full bg-gradient-to-t opacity-40";
  
  return (
    <footer className="fixed bottom-0 left-0 w-full h-[var(--h-footer)] footer-glass z-[110] flex before:absolute before:inset-0 before:bg-black/30 transition-all">
      <div className="flex w-full h-full relative z-10">
        <button 
          onClick={() => onTabClick('food')}
          className={`flex-1 flex flex-col items-center justify-center transition-all duration-500 relative overflow-hidden`}
        >
          <span className={`text-[8px] md:text-[9px] xl:text-xs font-bold tracking-[0.2em] uppercase transition-opacity duration-300 relative z-20 ${activeSection === 'food' ? 'text-white opacity-100' : 'text-white/30 opacity-60'}`}>Food</span>
          {activeSection === 'food' && (
            <>
              <motion.div 
                layoutId="footer-gradient" 
                className={`${highlightClass} from-brand-red to-transparent`} 
                initial={false}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
              <motion.div 
                layoutId="footer-accent" 
                className="absolute inset-x-0 bottom-0 h-0.5 xl:h-1 bg-brand-red shadow-[0_0_10px_#CE1126] z-20" 
                initial={false}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            </>
          )}
        </button>
        <button 
          onClick={() => onTabClick('market')}
          className={`flex-1 flex flex-col items-center justify-center transition-all duration-500 relative overflow-hidden`}
        >
          <span className={`text-[8px] md:text-[9px] xl:text-xs font-bold tracking-[0.2em] uppercase transition-opacity duration-300 relative z-20 ${activeSection === 'market' ? 'text-white opacity-100' : 'text-white/30 opacity-60'}`}>Market</span>
          {activeSection === 'market' && (
            <>
              <motion.div 
                layoutId="footer-gradient" 
                className={`${highlightClass} from-brand-blue to-transparent`} 
                initial={false}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
              <motion.div 
                layoutId="footer-accent" 
                className="absolute inset-x-0 bottom-0 h-0.5 xl:h-1 bg-brand-blue shadow-[0_0_10px_#0038A8] z-20" 
                initial={false}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            </>
          )}
        </button>
      </div>
    </footer>
  );
};

// --- Logic ---

const useBusinessStatus = () => {
  const [status, setStatus] = useState({ market: false, food: false });

  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      const hour = now.getHours();
      
      // Market: 10-7 (10:00 to 19:00)
      const isMarketOpen = hour >= 10 && hour < 19;
      // Food: 10-6 (10:00 to 18:00)
      const isFoodOpen = hour >= 10 && hour < 18;
      
      setStatus({ market: isMarketOpen, food: isFoodOpen });
    };

    checkStatus();
    const timer = setInterval(checkStatus, 60000); // Check every minute
    return () => clearInterval(timer);
  }, []);

  return status;
};

// --- Main App ---

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'food' | 'market'>('food');
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);
  const [view, setView] = useState<'landing' | 'food-store' | 'market-store'>('landing');
  const [cart, setCart] = useState<CartItem[]>([]);
  const { market: isMarketOpen, food: isFoodOpen } = useBusinessStatus();

  useEffect(() => {
    const handleResize = () => setIsPortrait(window.innerHeight > window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveTab(sectionId === 'food-section' ? 'food' : 'market');
    }
  };

  return (
    <div className={`h-[100dvh] font-montserrat transition-colors duration-500 overflow-hidden relative ${isDarkMode ? 'dark bg-black text-white' : 'bg-white text-black'}`}>
      {/* Visual Mask Overlays */}
      <div className={`mode-mask ${isDarkMode ? 'mode-mask-dark' : 'mode-mask-light'} z-40`} />
      
      {/* Header */}
      <header className="fixed top-0 left-0 w-full h-[var(--h-header)] px-4 xl:px-10 flex items-center z-[100] header-glass transition-all duration-300">
        <div className="flex items-center gap-2 xl:gap-8 w-[80px] xl:w-[250px] h-full">
          <IconButton onClick={() => setIsDarkMode(!isDarkMode)} className="min-h-[30px] min-w-[30px] xl:min-h-[36px] xl:min-w-[36px]">
            {isDarkMode ? <Sun size={10} className="xl:w-3.5" /> : <Moon size={10} className="xl:w-3.5" />}
          </IconButton>
        </div>

        <div className="flex-1 h-full flex items-center justify-center transition-all">
          <Logo />
        </div>

        <div className="flex items-center gap-2 xl:gap-8 w-[80px] xl:w-[250px] justify-end h-full">
          <IconButton badge={totalCartItems} className="min-h-[30px] min-w-[30px] xl:min-h-[36px] xl:min-w-[36px]">
            <ShoppingBag size={12} className="xl:w-3.5" />
          </IconButton>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {view === 'landing' ? (
          <motion.main 
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`h-full w-full overflow-hidden relative no-scrollbar`}
          >
            {/* Snap Scroll Container - Force one-page on all but very large screens (2xl) */}
            <div className={`h-full w-full overflow-auto snap-both snap-mandatory scroll-smooth no-scrollbar flex ${isPortrait ? 'flex-col' : 'flex-row xl:flex-row xl:overflow-hidden'}`}>
              {/* Center Divider - Only on Large Desktop */}
              <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/30 z-20 hidden xl:block" />

              {/* Food Section */}
              <section 
                id="food-section"
                className="relative min-w-full min-h-full xl:min-w-0 xl:flex-1 group overflow-hidden flex items-center justify-center snap-start flex-shrink-0"
              >
                <motion.div 
                  className="absolute inset-0 z-0 h-full w-full"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.8, ease: [0.165, 0.84, 0.44, 1] }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&q=80&w=2000" 
                    alt="MID7 Food - Philippine Cuisine"
                    className="object-cover w-full h-full brightness-[0.55]"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>

                <div className="relative z-10 flex flex-col items-center justify-center gap-3 xl:gap-8 px-10 text-center w-full max-w-2xl pt-14 xl:pt-20 pb-14 md:pb-16 xl:pb-20">
                  <motion.h2 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="text-white text-6xl xl:text-[96px] font-[900] tracking-[10px] xl:tracking-[18px] uppercase drop-shadow-2xl"
                  >
                    Food
                  </motion.h2>
                  
                  <div className="status-badge py-2 px-5 text-[12px] xl:text-[14px]">
                    <span className={`w-2.5 h-2.5 rounded-full bg-food-dot shadow-[0_0_12px_#FF4B2B] ${isFoodOpen ? 'animate-pulse' : 'bg-gray-400 shadow-none'}`} />
                    10-6 {isFoodOpen ? 'OPEN NOW' : 'CLOSED'}
                  </div>

                  <GhostButton label="Order Food" color="#CE1126" onClick={() => setView('food-store')} />
                </div>

                {/* Scroll/Slide Indicator to Market */}
                <button 
                  onClick={() => scrollToSection('market-section')}
                  className={`absolute xl:hidden flex items-center cursor-pointer z-30 transition-all duration-300 ${isPortrait ? 'flex-col gap-1 bottom-20 left-1/2 -translate-x-1/2' : 'flex-row gap-2 right-4 top-1/2 -translate-y-1/2'}`}
                >
                  {!isPortrait && <span className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold order-1 leading-none">Discover Market</span>}
                  {isPortrait && <span className="text-white/40 text-[9px] uppercase tracking-widest font-bold">Discover Market</span>}
                  <div className={!isPortrait ? "order-2 flex items-center" : ""}>
                    <SectionArrow direction={isPortrait ? 'down' : 'right'} />
                  </div>
                </button>
              </section>

              {/* Market Section */}
              <section 
                id="market-section"
                className="relative min-w-full min-h-full xl:min-w-0 xl:flex-1 group overflow-hidden flex items-center justify-center snap-start flex-shrink-0"
              >
                <motion.div 
                  className="absolute inset-0 z-0 h-full w-full"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.8, ease: [0.165, 0.84, 0.44, 1] }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=2000" 
                    alt="MID7 Market - Philippine Products"
                    className="object-cover w-full h-full brightness-[0.55]"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
                
                <div className="relative z-10 flex flex-col items-center justify-center gap-3 xl:gap-8 px-10 text-center w-full max-w-2xl pt-14 xl:pt-20 pb-14 md:pb-16 xl:pb-20">
                  <motion.h2 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="text-white text-6xl xl:text-[96px] font-[900] tracking-[10px] xl:tracking-[18px] uppercase drop-shadow-2xl"
                  >
                    Market
                  </motion.h2>
                  
                  <div className="status-badge py-2 px-5 text-[12px] xl:text-[14px]">
                    <span className={`w-2.5 h-2.5 rounded-full bg-market-dot shadow-[0_0_12px_#4A90E2] ${isMarketOpen ? 'animate-pulse' : 'bg-gray-400 shadow-none'}`} />
                    10-7 {isMarketOpen ? 'OPEN NOW' : 'CLOSED'}
                  </div>

                  <GhostButton label="Shop Market" color="#0038A8" onClick={() => setView('market-store')} />
                </div>

                {/* Scroll/Slide Indicator back to Food */}
                <button 
                  onClick={() => scrollToSection('food-section')}
                  className={`absolute xl:hidden flex items-center cursor-pointer z-30 transition-all duration-300 ${isPortrait ? 'flex-col gap-1 top-20 left-1/2 -translate-x-1/2' : 'flex-row gap-2 left-4 top-1/2 -translate-y-1/2'}`}
                >
                  <div className={!isPortrait ? "order-1 flex items-center" : ""}>
                    <SectionArrow direction={isPortrait ? 'up' : 'left'} />
                  </div>
                  <span className={`text-white/40 uppercase font-bold leading-none ${!isPortrait ? 'text-[10px] tracking-[0.2em] order-2' : 'text-[9px] tracking-widest order-2'}`}>Discover Food</span>
                </button>
              </section>
            </div>
          </motion.main>
        ) : (
          <motion.div
            key="storefront"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="h-full w-full"
          >
            <StorefrontView 
              type={view === 'food-store' ? 'food' : 'market'}
              items={view === 'food-store' ? FOOD_ITEMS : MARKET_ITEMS}
              allProducts={[...FOOD_ITEMS, ...MARKET_ITEMS]}
              onBack={() => setView('landing')}
              onTypeChange={(newType) => {
                setView(newType === 'food' ? 'food-store' : 'market-store');
                setActiveTab(newType);
              }}
              cart={cart}
              setCart={setCart}
              isDarkMode={isDarkMode}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer 
        activeSection={activeTab} 
        onTabClick={(tab) => {
          if (view !== 'landing') {
            setView(tab === 'food' ? 'food-store' : 'market-store');
            setActiveTab(tab);
          } else {
            scrollToSection(tab === 'food' ? 'food-section' : 'market-section');
          }
        }} 
      />
    </div>
  );
}
