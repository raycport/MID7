import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency } from '../../lib/utils';

interface ProductCardProps {
  product: Product;
  quantity: number;
  onUpdateQuantity: (qty: number) => void;
  onClick: (product: Product) => void;
  isDarkMode: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, quantity, onUpdateQuantity, onClick, isDarkMode }) => {
  const hapticFeedback = () => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
  };

  const handleUpdate = (e: React.MouseEvent, delta: number) => {
    e.stopPropagation();
    hapticFeedback();
    onUpdateQuantity(Math.max(0, quantity + delta));
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`backdrop-blur-md rounded-2xl overflow-hidden group flex flex-col h-full shadow-2xl transition-colors duration-500 border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}
      onClick={() => {
        hapticFeedback();
        onClick(product);
      }}
    >
      <div className="relative aspect-square short:aspect-video overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-black/40 backdrop-blur-md px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[8px] md:text-[10px] uppercase tracking-widest text-white/80 font-bold border border-white/10">
          {product.category}
        </div>
      </div>

      <div className="p-2 md:p-4 flex flex-col flex-1 gap-1 md:gap-2">
        <h3 className="text-black dark:text-white font-bold text-xs md:text-lg leading-tight uppercase tracking-tight md:tracking-wide truncate">
          {product.name}
        </h3>
        
        <div className="flex flex-col gap-2 md:gap-3 mt-auto">
          <span className="text-black dark:text-brand-white font-black text-sm md:text-xl tracking-tight">
            {formatCurrency(product.price)}
          </span>

          <div className={`flex items-center justify-between rounded-lg md:rounded-xl p-1 border h-8 md:h-12 transition-all ${isDarkMode ? 'bg-white/10 border-white/5' : 'bg-black/10 border-black/5'}`}>
            <button
              onClick={(e) => handleUpdate(e, -1)}
              className="w-6 md:w-10 h-full flex items-center justify-center text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors active:scale-90"
              aria-label="Decrease quantity"
            >
              <Minus size={12} className="md:w-[18px]" />
            </button>
            
            <AnimatePresence mode="wait">
              <motion.span 
                key={quantity}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="w-4 md:w-6 text-center text-black dark:text-white font-black text-[10px] md:text-sm"
              >
                {quantity}
              </motion.span>
            </AnimatePresence>

            <button
              onClick={(e) => handleUpdate(e, 1)}
              className="w-6 md:w-10 h-full flex items-center justify-center text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors active:scale-90"
              aria-label="Increase quantity"
            >
              <Plus size={12} className="md:w-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
