import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Inbox, Search, ChevronDown, Check, MapPin, X } from 'lucide-react';
import { Product, CartItem } from '../../types';
import ProductCard from './ProductCard';

interface StorefrontViewProps {
  type: 'food' | 'market';
  items: Product[];
  allProducts?: Product[]; // For cross-storefront search
  onBack: () => void;
  onTypeChange: (newType: 'food' | 'market', initialCategory?: string) => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  isDarkMode: boolean;
}

const StorefrontView: React.FC<StorefrontViewProps> = ({ type, items, allProducts = [], onBack, onTypeChange, cart, setCart, isDarkMode }) => {
  const [query, setQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('ALL');
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Reset category if switching storefront and previous category is not valid
  useEffect(() => {
    const validCats = Array.from(new Set(items.map(i => i.category)));
    if (activeCategory !== 'ALL' && !validCats.includes(activeCategory)) {
      setActiveCategory('ALL');
    }
  }, [type, items, activeCategory]);

  // Split categories and prioritize based on current store type
  const categories = useMemo(() => {
    const currentTypeCats = Array.from(new Set(items.map(i => i.category)));
    const otherTypeItems = allProducts.filter(i => i.type !== type);
    const otherTypeCats = Array.from(new Set(otherTypeItems.map(i => i.category)));
    
    return {
      current: currentTypeCats.sort(),
      other: otherTypeCats.sort()
    };
  }, [items, allProducts, type]);

  // Enhanced search logic with fuzzy matching, item prioritization, and cross-storefront recs
  const searchResults = useMemo(() => {
    if (!query) {
      return {
        exact: items.filter(item => activeCategory === 'ALL' || item.category === activeCategory),
        relevant: [],
        crossStore: []
      };
    }

    const lowerQuery = query.toLowerCase();
    
    const exactMatches: Product[] = [];
    const relevantMatches: Product[] = [];
    const crossStoreMatches: Product[] = [];

    // Search in current storefront first
    items.forEach(item => {
      const name = item.name.toLowerCase();
      const desc = (item.description || '').toLowerCase();
      const cat = item.category.toLowerCase();

      // Category filter check first
      if (activeCategory !== 'ALL' && item.category !== activeCategory) return;

      if (name.includes(lowerQuery)) {
        exactMatches.push(item);
      } else if (desc.includes(lowerQuery) || cat.includes(lowerQuery) || 
                 lowerQuery.split(' ').some(word => word.length > 2 && (name.includes(word) || desc.includes(word)))) {
        relevantMatches.push(item);
      }
    });

    // Search in OTHER storefront for recommendations
    allProducts.filter(p => p.type !== type).forEach(item => {
      const name = item.name.toLowerCase();
      const desc = (item.description || '').toLowerCase();
      const cat = item.category.toLowerCase();

      if (name.includes(lowerQuery) || desc.includes(lowerQuery) || cat.includes(lowerQuery)) {
        crossStoreMatches.push(item);
      }
    });

    return { 
      exact: exactMatches, 
      relevant: relevantMatches,
      crossStore: crossStoreMatches 
    };
  }, [items, allProducts, query, activeCategory, type]);

  const updateQuantity = (product: Product, newQty: number) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(x => x.id === product.id);
      if (existingIndex > -1) {
        if (newQty === 0) return prev.filter((_, i) => i !== existingIndex);
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      }
      if (newQty > 0) return [...prev, { ...product, quantity: newQty }];
      return prev;
    });
  };

  const getItemQuantity = (productId: string) => cart.find(x => x.id === productId)?.quantity || 0;

  const hapticFeedback = () => {
    if (window.navigator.vibrate) window.navigator.vibrate(10);
  };

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#0a0a0a] transition-colors duration-500 relative z-[80] overflow-hidden pt-[calc(var(--h-header)+var(--h-subheader))]">
      
      {/* Sticky Navigation Layer */}
      <div className="fixed top-[var(--h-header)] left-0 right-0 z-[160] w-full flex flex-col">
        {/* Persistent Subheader */}
        <div className="w-full h-[var(--h-subheader)] bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-3xl border-b border-black/10 dark:border-white/10 flex items-center px-4 md:px-8 relative shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          {/* Left: Back */}
          <button 
            onClick={() => { hapticFeedback(); onBack(); }}
            className="flex items-center gap-2 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors group h-full min-w-[36px] xl:min-w-[44px]"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${isDarkMode ? 'bg-white/5 border-white/10 group-hover:bg-white/10' : 'bg-black/5 border-black/10 group-hover:bg-black/10'}`}>
              <ArrowLeft size={14} className="xl:w-4" />
            </div>
            <span className="hidden lg:inline text-[9px] font-black uppercase tracking-[2px]">Back</span>
          </button>

          {/* Center: Category Dropdown */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <button 
              onClick={() => { hapticFeedback(); setIsCategoryOpen(!isCategoryOpen); if (isSearchOpen) setIsSearchOpen(false); }}
              className={`flex items-center gap-1.5 md:gap-2 border px-2.5 md:px-4 py-1 rounded-xl transition-all min-h-[30px] md:min-h-[34px] ${isDarkMode ? 'bg-white/5 hover:bg-white/10 border-white/10' : 'bg-black/5 hover:bg-black/10 border-black/10'}`}
            >
              <div className="flex flex-col items-start justify-center">
                <span className="text-[6px] md:text-[7px] text-black/30 dark:text-white/30 uppercase font-black tracking-[1px] leading-tight">Category</span>
                <span className="text-black dark:text-white font-black text-[8px] md:text-[9px] uppercase tracking-widest leading-tight truncate max-w-[50px] md:max-w-[80px]">{activeCategory}</span>
              </div>
              <motion.div animate={{ rotate: isCategoryOpen ? 180 : 0 }} className="opacity-30">
                <ChevronDown size={10} />
              </motion.div>
            </button>
          </div>

          {/* Right: Search Toggle */}
          <div className="ml-auto flex items-center gap-1.5 md:gap-3">
            <div className="hidden lg:flex flex-col items-end mr-1 opacity-40">
              <span className="text-[7px] text-black/40 dark:text-white/40 uppercase font-black tracking-[1px]">Store Area</span>
              <span className="text-black/60 dark:text-white/60 font-medium text-[8px]">Main Hub</span>
            </div>
            <button 
              onClick={() => { hapticFeedback(); setIsSearchOpen(!isSearchOpen); if (isCategoryOpen) setIsCategoryOpen(false); }}
              className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all ${isSearchOpen ? 'bg-brand-red text-white' : 'bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10'}`}
            >
              {isSearchOpen ? <X size={12} /> : <Search size={12} />}
            </button>
          </div>
        </div>

        {/* Persistent Search Bar Expansion */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="w-full bg-white/95 dark:bg-[#0a0a0a]/98 backdrop-blur-3xl border-b border-black/5 dark:border-white/5 overflow-hidden shadow-2xl"
            >
              <div className="max-w-xl mx-auto p-1.5 md:p-2">
                <div className="relative group">
                  <Search size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/20 dark:text-white/20 group-focus-within:text-brand-red transition-colors" />
                  <input 
                    ref={searchInputRef}
                    type="text"
                    placeholder="FIND..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full h-8 md:h-10 bg-black/5 dark:bg-black/40 border border-black/5 dark:border-white/5 rounded-lg pl-9 pr-3 text-black dark:text-white text-[9px] md:text-[11px] font-bold uppercase tracking-[2px] focus:outline-none focus:border-black/10 dark:focus:border-white/10 transition-all placeholder:text-black/5 dark:placeholder:text-white/5"
                  />
                  {query && (
                    <button 
                      onClick={() => setQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white transition-colors"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Category Dropdown Content */}
      <AnimatePresence>
        {isCategoryOpen && (
          <div className="fixed inset-x-0 top-[calc(var(--h-header)+var(--h-subheader))] z-[170] bottom-[var(--h-footer)] overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsCategoryOpen(false)}
              className="absolute inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="absolute left-1/2 -translate-x-1/2 top-4 w-[95vw] max-w-lg"
            >
              <div className="bg-white dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden">
                <div className="p-3 md:p-6 grid grid-cols-2 gap-1.5 max-h-[60vh] overflow-y-auto no-scrollbar">
                  <button
                    onClick={() => { hapticFeedback(); setActiveCategory('ALL'); setIsCategoryOpen(false); }}
                    className={`col-span-2 text-left px-4 py-2.5 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-between ${activeCategory === 'ALL' ? (isDarkMode ? 'bg-white text-black' : 'bg-black text-white') : (isDarkMode ? 'bg-white/5 text-white/60 hover:bg-white/10 border border-transparent hover:border-white/10' : 'bg-black/5 text-black/60 hover:bg-black/10 border border-transparent hover:border-black/10')}`}
                  >
                    <span className="flex flex-col">
                      <span>All Products</span>
                      <span className="text-[7px] opacity-40 lowercase leading-tight">Show everything from {type}</span>
                    </span>
                    {activeCategory === 'ALL' && <Check size={12} />}
                  </button>

                  <div className="col-span-2 mt-4 px-4 pb-1 text-[8px] text-black/20 dark:text-white/20 font-black uppercase tracking-[4px] flex items-center gap-2">
                    <div className="h-px bg-black/5 dark:bg-white/10 flex-1" />
                    <span>In {type}</span>
                    <div className="h-px bg-black/5 dark:bg-white/10 flex-1" />
                  </div>
                  
                  {categories.current.map(cat => (
                    <button
                      key={`current-${cat}`}
                      onClick={() => { hapticFeedback(); setActiveCategory(cat); setIsCategoryOpen(false); }}
                      className={`text-left px-4 py-2.5 rounded-lg transition-all font-black text-[9px] uppercase tracking-widest flex items-center justify-between ${activeCategory === cat ? (type === 'food' ? 'bg-brand-red text-white' : 'bg-brand-blue text-white') : (isDarkMode ? 'bg-white/5 text-white/60 hover:bg-white/10' : 'bg-black/5 text-black/60 hover:bg-black/10')}`}
                    >
                      <span className="truncate">{cat}</span>
                      {activeCategory === cat && <Check size={12} />}
                    </button>
                  ))}

                  <div className="col-span-2 mt-4 px-4 pb-1 text-[8px] text-black/20 dark:text-white/20 font-black uppercase tracking-[4px] flex items-center gap-2">
                    <div className="h-px bg-black/5 dark:bg-white/10 flex-1" />
                    <span>Other Sections</span>
                    <div className="h-px bg-black/5 dark:bg-white/10 flex-1" />
                  </div>
                  {categories.other.map(cat => (
                    <button
                      key={`other-${cat}`}
                      onClick={() => { 
                        hapticFeedback(); 
                        onTypeChange(type === 'food' ? 'market' : 'food', cat);
                        setIsCategoryOpen(false);
                      }}
                      className={`text-left px-4 py-2.5 rounded-lg transition-all font-black text-[9px] uppercase tracking-widest flex items-center justify-between ${isDarkMode ? 'bg-white/[0.03] text-white/30 hover:text-white/60 hover:bg-white/5' : 'bg-black/[0.03] text-black/30 hover:text-black/60 hover:bg-black/5'}`}
                    >
                      <span className="truncate">{cat}</span>
                      <ArrowLeft size={8} className="rotate-180 opacity-20" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Grid Area (With safe-padding for Header & Footer) */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative">
        <div className="p-3 md:px-8 pt-4 pb-20 xl:pb-40">
          <AnimatePresence mode="popLayout" initial={false}>
            {/* Exact Results Header */}
            {query && searchResults.exact.length > 0 && (
              <motion.div 
                key="header-exact"
                layout 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -10 }}
                className="mb-6 px-2 flex items-center gap-4"
              >
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[6px] text-black/60 dark:text-white/60">Matching in {type}</span>
                </div>
                <div className="h-px bg-black/10 dark:bg-white/20 flex-1" />
              </motion.div>
            )}

            {/* Grid for exact matches */}
            {searchResults.exact.length > 0 && (
              <motion.div 
                key="grid-exact"
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 short:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8 mb-12"
              >
                {searchResults.exact.map(item => (
                  <ProductCard 
                    key={`exact-${item.id}`}
                    product={item}
                    quantity={getItemQuantity(item.id)}
                    onUpdateQuantity={(qty) => updateQuantity(item, qty)}
                    onClick={() => {}}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </motion.div>
            )}

            {/* Fuzzy / Relevant Results Header */}
            {query && searchResults.relevant.length > 0 && (
              <motion.div 
                key="header-relevant"
                layout 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -10 }}
                className="mt-8 mb-4 px-2 flex items-center gap-4"
              >
                <div className="flex flex-col">
                  <span className="text-[7px] font-black uppercase tracking-[3px] text-black/30 dark:text-white/30">Suggestions</span>
                  <span className="text-[9px] font-black uppercase tracking-[1px] text-black/80 dark:text-white/80">Relevant Alternatives</span>
                </div>
                <div className="h-px bg-black/5 dark:bg-white/10 flex-1" />
              </motion.div>
            )}

            {/* Grid for relevant matches */}
            {searchResults.relevant.length > 0 && (
              <motion.div 
                key="grid-relevant"
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 short:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8 opacity-60 grayscale-[0.2] hover:grayscale-0 hover:opacity-100 transition-all duration-500 mb-12"
              >
                {searchResults.relevant.map(item => (
                  <ProductCard 
                    key={`relevant-${item.id}`}
                    product={item}
                    quantity={getItemQuantity(item.id)}
                    onUpdateQuantity={(qty) => updateQuantity(item, qty)}
                    onClick={() => {}}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </motion.div>
            )}

            {/* Cross-Storefront Recommendations */}
            {query && searchResults.crossStore.length > 0 && (
              <motion.div 
                key="header-cross"
                layout 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -10 }}
                className="mt-12 mb-6 px-2 flex items-center gap-4"
              >
                <div className="flex flex-col">
                  <span className="text-[7px] font-black uppercase tracking-[3px] text-black/20 dark:text-white/20">From the {type === 'food' ? 'Market' : 'Food'} section</span>
                  <span className="text-[9px] font-black uppercase tracking-[1px] text-black/60 dark:text-white/60 italic">You might also like</span>
                </div>
                <div className="h-px bg-black/5 dark:bg-white/5 flex-1" />
              </motion.div>
            )}

            {/* Grid for cross-storefront matches */}
            {searchResults.crossStore.length > 0 && (
              <motion.div 
                key="grid-cross"
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 short:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8 opacity-40 grayscale blur-[0.5px] hover:blur-0 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
              >
                {searchResults.crossStore.map(item => (
                  <div key={`cross-${item.id}`} className="relative group">
                    <ProductCard 
                      product={item}
                      quantity={getItemQuantity(item.id)}
                      onUpdateQuantity={(qty) => updateQuantity(item, qty)}
                      onClick={() => {}}
                      isDarkMode={isDarkMode}
                    />
                    <div className={`absolute top-1 right-1 lg:top-2 lg:right-2 backdrop-blur-md px-2 lg:px-3 py-1 lg:py-1.5 rounded-full border text-[6px] lg:text-[8px] font-black uppercase tracking-[1px] lg:tracking-[2px] pointer-events-none transition-colors shadow-xl ${isDarkMode ? 'bg-black/80 border-white/10 text-white/60 group-hover:bg-brand-red group-hover:text-white' : 'bg-white/80 border-black/10 text-black/60 group-hover:bg-brand-red group-hover:text-white'}`}>
                      <span className="text-brand-red mr-1.5">•</span>
                      {item.type} | {item.category}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Empty State */}
            {searchResults.exact.length === 0 && searchResults.relevant.length === 0 && searchResults.crossStore.length === 0 && (
              <motion.div 
                key="empty-state"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="h-[60vh] flex flex-col items-center justify-center text-black/20 dark:text-white/20"
              >
                <Inbox size={80} strokeWidth={1} />
                <p className="mt-4 font-black uppercase tracking-[5px] text-center px-8">No results for "{query}"</p>
                <button 
                  onClick={() => { hapticFeedback(); setQuery(''); }} 
                  className={`mt-8 text-[10px] font-black uppercase tracking-[3px] py-3 px-8 border rounded-full transition-all ${isDarkMode ? 'border-white/10 text-white/60 hover:bg-white/5 hover:text-white' : 'border-black/10 text-black/60 hover:bg-black/5 hover:text-black'}`}
                >
                  Clear Search
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default StorefrontView;
