
import React, { useState, useMemo, useEffect } from 'react';
import { MerchItem, ColorOption, CartItem } from '../types';
import Icon from './Icon';

const MerchDetailModal: React.FC<{
  item: MerchItem | null;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}> = ({ item, onClose, onAddToCart }) => {
    const [selectedColor, setSelectedColor] = useState<ColorOption | null>(item?.colors?.[0] ?? null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [mainImageIndex, setMainImageIndex] = useState(0);

    useEffect(() => {
        if (item) {
            setSelectedColor(item.colors?.[0] ?? null);
            setSelectedSize(item.sizes?.length === 1 ? item.sizes[0] : null);
            setQuantity(1);
            setMainImageIndex(0);
        }
    }, [item]);

    const activeImages = useMemo(() => {
        return selectedColor?.imageUrls || item?.imageUrls || [];
    }, [item, selectedColor]);

    const mainImage = activeImages[mainImageIndex] || 'https://via.placeholder.com/600';

    const handleColorSelect = (color: ColorOption) => {
        setSelectedColor(color);
        setMainImageIndex(0);
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-end justify-center" aria-modal="true" role="dialog" onClick={onClose}>
      <div className="bg-white rounded-t-[2.5rem] w-full max-w-lg shadow-2xl animate-slide-up flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <header className="p-4 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-900 truncate ml-4">{item.name}</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>

        <main className="p-4 overflow-y-auto no-scrollbar">
            <div className="mb-6">
                <div className="aspect-square rounded-3xl overflow-hidden bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm">
                    <img src={mainImage} alt={item.name} className="w-full h-full object-cover" />
                </div>
                {activeImages.length > 1 && (
                    <div className="flex space-x-2 mt-3 overflow-x-auto no-scrollbar py-1">
                        {activeImages.map((img, index) => (
                            <button key={index} onClick={() => setMainImageIndex(index)} className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${mainImageIndex === index ? 'border-rose-500 scale-95 shadow-md' : 'border-transparent opacity-60'}`}>
                                <img src={img} alt={`thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>
            
            <div className="px-2">
                <div className="flex justify-between items-start mb-2">
                    <h1 className="text-2xl font-black text-gray-900 leading-tight">{item.name}</h1>
                    <div className="text-right">
                        <p className="text-2xl font-black text-rose-500">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                        {item.isOnSale && item.originalPrice && (
                            <p className="text-sm text-gray-400 line-through">R$ {item.originalPrice.toFixed(2).replace('.', ',')}</p>
                        )}
                    </div>
                </div>
                {item.tag && (
                    <span className={`text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase shadow-sm mb-4 inline-block ${item.isDigital ? 'bg-blue-500' : 'bg-rose-50'}`}>
                        {item.tag}
                    </span>
                )}
                <p className="text-gray-500 text-sm mb-8 leading-relaxed font-medium">{item.description}</p>

                {item.colors && item.colors.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Selecione a Cor: <span className="text-gray-900">{selectedColor?.name}</span></h3>
                        <div className="flex space-x-3">
                            {item.colors.map(color => (
                                <button key={color.name} onClick={() => handleColorSelect(color)} className={`w-10 h-10 rounded-full border-2 transition-all shadow-sm ${selectedColor?.name === color.name ? 'border-rose-500 scale-110 shadow-lg' : 'border-white'}`} style={{ backgroundColor: color.hex || 'white' }} />
                            ))}
                        </div>
                    </div>
                )}

                {item.sizes && item.sizes.length > 0 && item.sizes[0] !== 'Único' && (
                    <div className="mb-8">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Tamanho</h3>
                        <div className="flex flex-wrap gap-3">
                            {item.sizes.map(size => (
                                <button key={size} onClick={() => setSelectedSize(size)} className={`px-5 py-2.5 rounded-xl border-2 text-sm font-black transition-all ${selectedSize === size ? 'bg-rose-500 text-white border-rose-500 shadow-md scale-105' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}>
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>

        <footer className="p-6 bg-white border-t border-gray-100 flex-shrink-0 pb-24">
            <div className="flex items-center space-x-4">
                {!item.isDigital && (
                     <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-100">
                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 rounded-lg text-gray-900 font-black text-xl hover:bg-white transition-colors">-</button>
                        <span className="w-10 text-center font-black text-gray-900 text-lg tabular-nums">{quantity}</span>
                        <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 rounded-lg text-gray-900 font-black text-xl hover:bg-white transition-colors">+</button>
                    </div>
                )}
                <button
                    onClick={handleAddToCartClick}
                    disabled={isAddToCartDisabled}
                    className="flex-1 bg-gray-900 text-white font-black py-4 px-4 rounded-2xl hover:bg-black transition-all disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-xl"
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