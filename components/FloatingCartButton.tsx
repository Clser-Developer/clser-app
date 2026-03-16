
import React from 'react';
import Icon from './Icon';

interface FloatingCartButtonProps {
    itemCount: number;
    onClick: () => void;
}

const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({ itemCount, onClick }) => (
    <div className="absolute bottom-24 right-6 z-40 pointer-events-none">
        <button 
            onClick={onClick}
            className="bg-rose-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-xl shadow-rose-500/30 hover:bg-rose-700 transition-all transform hover:scale-110 pointer-events-auto active:scale-95 border-2 border-white/20"
            aria-label={`Ver carrinho com ${itemCount} itens`}
        >
            <Icon name="shopping-cart" className="w-6 h-6" />
            {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-rose-600 text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center shadow-sm border border-rose-100 animate-scale-in">
                    {itemCount}
                </span>
            )}
        </button>
    </div>
);

export default FloatingCartButton;
