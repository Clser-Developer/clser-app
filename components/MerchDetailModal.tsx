
import React, { useState, useMemo, useEffect } from 'react';
import { MerchItem, ColorOption, CartItem } from '../types';
import Icon from './Icon';

const MerchDetailModal: React.FC<{
  item: MerchItem | null;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}> = ({ item, onClose, onAddToCart }) => {
    // State for user selections
    const [selectedColor, setSelectedColor] = useState<ColorOption | null>(item?.colors?.[0] ?? null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [mainImageIndex, setMainImageIndex] = useState(0);

    // Effect to reset state when the item changes (modal opens for a new item)
    useEffect(() => {
        if (item) {
            setSelectedColor(item.colors?.[0] ?? null);
            setSelectedSize(item.sizes?.length === 1 ? item.sizes[0] : null);
            setQuantity(1);
            setMainImageIndex(0);
        }
    }, [item]);

    // Derived state for images
    const activeImages = useMemo(() => {
        return selectedColor?.imageUrls || item?.imageUrls || [];
    }, [item, selectedColor]);

    const mainImage = activeImages[mainImageIndex] || 'https://via.placeholder.com/600';

    // Event Handlers
    const handleColorSelect = (color: ColorOption) => {
        setSelectedColor(color);
        setMainImageIndex(0); // Reset to first image of the new color
    };

    const handleAddToCartClick = () => {
        if (!item) return;
        const cartItem: CartItem = {
            ...item,
            quantity,
            selectedColor: selectedColor?.name,
            selectedSize: selectedSize ?? undefined,
        };
        onAddToCart(cartItem);
        onClose();
    };

    if (!item) return null;

    const needsSizeSelection = item.sizes && item.sizes.length > 0 && item.sizes[0] !== 'Único';
    const isAddToCartDisabled = (needsSizeSelection && !selectedSize) || quantity <= 0;
    
    return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center" aria-modal="true" role="dialog" onClick={onClose}>
      <div className="bg-gray-800 rounded-t-2xl w-full max-w-lg shadow-2xl border-t border-gray-700 animate-slide-up flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <header className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
          <h2 className="text-lg font-bold text-white truncate">{item.name}</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-700">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>

        <main className="p-4 overflow-y-auto">
            {/* Image Gallery */}
            <div className="mb-4">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center">
                    <img src={mainImage} alt={`${item.name} - view ${mainImageIndex + 1}`} className="w-full h-full object-cover" />
                </div>
                {activeImages.length > 1 && (
                    <div className="flex space-x-2 mt-2">
                        {activeImages.map((img, index) => (
                            <button key={index} onClick={() => setMainImageIndex(index)} className={`w-16 h-16 rounded-md overflow-hidden border-2 ${mainImageIndex === index ? 'border-orange-500' : 'border-transparent'}`}>
                                <img src={img} alt={`thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Details */}
            <div className="flex justify-between items-start mb-2">
                <h1 className="text-2xl font-bold text-white">{item.name}</h1>
                <div className="flex items-baseline">
                    <p className="text-2xl font-bold text-orange-400">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                    {item.isOnSale && item.originalPrice && (
                        <p className="text-md text-gray-500 line-through ml-2">R$ {item.originalPrice.toFixed(2).replace('.', ',')}</p>
                    )}
                </div>
            </div>
            {item.tag && (
                <span className={`text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase shadow-lg mb-4 inline-block ${item.isDigital ? 'bg-blue-500' : 'bg-orange-500'}`}>
                    {item.tag}
                </span>
            )}
            <p className="text-gray-300 text-sm mb-6 whitespace-pre-line">{item.description}</p>

            {/* Color Options */}
            {item.colors && item.colors.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Cor: <span className="text-white font-bold">{selectedColor?.name}</span></h3>
                    <div className="flex space-x-2">
                        {item.colors.map(color => (
                            <button key={color.name} onClick={() => handleColorSelect(color)} className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor?.name === color.name ? 'border-orange-500 scale-110' : 'border-gray-600'}`} style={{ backgroundColor: color.hex || 'white' }} aria-label={`Select color ${color.name}`}/>
                        ))}
                    </div>
                </div>
            )}

            {/* Size Options */}
            {item.sizes && item.sizes.length > 0 && item.sizes[0] !== 'Único' && (
                 <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Tamanho</h3>
                    <div className="flex flex-wrap gap-2">
                        {item.sizes.map(size => (
                            <button key={size} onClick={() => setSelectedSize(size)} className={`px-4 py-2 rounded-md border text-sm font-bold transition-colors ${selectedSize === size ? 'bg-white text-gray-900 border-white' : 'border-gray-600 text-gray-300 hover:border-white'}`}>
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </main>

        <footer className="p-4 bg-gray-900/50 flex-shrink-0 border-t border-gray-700">
            <div className="flex items-center space-x-4">
                {/* Quantity */}
                {!item.isDigital && (
                     <div className="flex items-center space-x-2">
                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 bg-gray-700 rounded-md text-white font-bold text-lg flex items-center justify-center hover:bg-gray-600">-</button>
                        <span className="w-10 text-center font-bold text-white text-lg">{quantity}</span>
                        <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 bg-gray-700 rounded-md text-white font-bold text-lg flex items-center justify-center hover:bg-gray-600">+</button>
                    </div>
                )}
                <button
                    onClick={handleAddToCartClick}
                    disabled={isAddToCartDisabled}
                    className="flex-1 bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                    <Icon name="shopping-cart" className="w-5 h-5" />
                    <span>{item.isDigital ? 'Baixar Agora' : 'Adicionar ao Carrinho'}</span>
                </button>
            </div>
        </footer>
      </div>
    </div>
    )
}
export default MerchDetailModal;
