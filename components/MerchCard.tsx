
import React, { useState } from 'react';
import { MerchItem } from '../types';
import Icon from './Icon';

interface MerchCardProps {
  item: MerchItem;
  onViewDetails: (item: MerchItem) => void;
}

const MerchCard: React.FC<MerchCardProps> = ({ item, onViewDetails }) => {
  const displayImage = item.imageUrls?.[0] || 'https://via.placeholder.com/400';
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <button 
      onClick={() => onViewDetails(item)}
      className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700/50 group flex flex-col text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-magenta-500"
      aria-label={`Ver detalhes de ${item.name}`}
    >
      <div className="relative">
        <div className="w-full overflow-hidden aspect-[4/3] bg-gray-700">
          {!isImageLoaded && (
            <div className="w-full h-full animate-pulse"></div>
          )}
          <img 
            src={displayImage} 
            alt={item.name} 
            loading="lazy"
            onLoad={() => setIsImageLoaded(true)}
            className={`w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`} 
          />
        </div>
        {(item.isOnSale || item.tag) && (
            <div className="absolute top-2 right-2 flex flex-col items-end space-y-1">
                {item.isOnSale && (
                    <span className="bg-magenta-500 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase shadow-lg">
                        Promoção
                    </span>
                )}
                {item.tag && (
                    <span className={`text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase shadow-lg ${item.isDigital ? 'bg-blue-500' : 'bg-orange-500'}`}>
                        {item.tag}
                    </span>
                )}
            </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-md font-semibold text-white min-h-[3rem]">{item.name}</h3>
        <div className="mt-auto pt-3 flex items-baseline">
            <p className="text-lg font-bold text-orange-400">R$ {item.price.toFixed(2).replace('.', ',')}</p>
            {item.isOnSale && item.originalPrice && (
                <p className="text-sm text-gray-500 line-through ml-2">R$ {item.originalPrice.toFixed(2).replace('.', ',')}</p>
            )}
        </div>
      </div>
    </button>
  );
};

export default React.memo(MerchCard);
