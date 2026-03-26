import React from 'react';
import { Event, EventStatus } from '../types';
import Icon from './Icon';

interface TicketCardProps {
  event: Event;
  onViewDetails: (event: Event) => void;
  isPurchased?: boolean;
}

const StatusBadge: React.FC<{ status: EventStatus; price: number; isPurchased?: boolean }> = ({ status, price, isPurchased }) => {
    if (isPurchased) {
        return (
            <div className="text-right">
                <span className="font-bold text-base text-green-600">Adquirido</span>
                <p className="text-[10px] text-gray-500">Ver em "Meus Ingressos"</p>
            </div>
        );
    }
    switch (status) {
        case EventStatus.SOLD_OUT:
            return <span className="font-bold text-base text-red-500">Esgotado</span>;
        case EventStatus.PAST:
            return <span className="font-bold text-base text-gray-400">Encerrado</span>;
        case EventStatus.AVAILABLE:
        default:
            return (
                <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">A partir de</p>
                    <p className="font-black text-lg text-rose-500">R$ {price.toFixed(2).replace('.', ',')}</p>
                </div>
            );
    }
};

const TicketCard: React.FC<TicketCardProps> = ({ event, onViewDetails, isPurchased }) => {
  const isClickable = event.status === EventStatus.AVAILABLE && !isPurchased;

  const cardClasses = `
    flex w-full text-left bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm
    transition-all duration-300
    ${isClickable ? 'hover:shadow-md hover:border-rose-100' : 'opacity-80'}
    ${isPurchased ? 'border-green-200 bg-green-50/30' : ''}
    ${event.status === EventStatus.PAST ? 'filter grayscale opacity-60' : ''}
  `;

  return (
    <button 
      onClick={() => isClickable && onViewDetails(event)}
      disabled={!isClickable}
      className={cardClasses}
      aria-label={`Ver detalhes de ${event.name}`}
    >
      <div className="w-24 h-full relative">
          <img src={event.imageUrl} alt={event.name} className="w-full h-full object-cover absolute inset-0" />
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between min-h-[110px]">
        <div>
           {event.isExclusive && 
              <span className="inline-block bg-rose-100 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">
                FÃ CLUBE
              </span>
            }
          <h3 className="font-bold text-gray-900 leading-tight text-sm line-clamp-2">{event.name}</h3>
          <p className="text-xs text-gray-500 mt-1 truncate">{event.location}</p>
        </div>
        <div className="flex items-end justify-between mt-3">
            <div className="flex items-center space-x-3">
                <div className="text-center bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                    <p className="text-lg font-black text-gray-900 leading-none">{event.date.split(' ')[0]}</p>
                    <p className="text-[10px] font-bold text-rose-500 uppercase leading-none">{event.date.split(' ')[1]}</p>
                </div>
                <div className="text-xs text-gray-500 leading-tight">
                    <p>{event.date.split(' ')[2]}</p>
                    <p className="font-medium">{event.time}</p>
                </div>
            </div>
            <StatusBadge status={event.status} price={event.startingPrice} isPurchased={isPurchased} />
        </div>
      </div>
    </button>
  );
};

export default React.memo(TicketCard);