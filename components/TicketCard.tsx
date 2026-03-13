
import React from 'react';
import { Event } from '../types';

interface TicketCardProps {
  event: Event;
  onViewDetails: (event: Event) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ event, onViewDetails }) => {
  return (
    <button 
      onClick={() => onViewDetails(event)}
      className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700/50 flex flex-col text-left hover:border-orange-500 transition-colors group w-full"
      aria-label={`Ver detalhes de ${event.name}`}
    >
      <div className="relative">
        <img src={event.imageUrl} alt={event.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-xl font-black text-white uppercase tracking-wider">{event.name}</h3>
          <p className="text-sm text-gray-300">{event.location}</p>
        </div>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex-grow">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{event.date.split(' ')[0]}</p>
              <p className="text-sm font-semibold text-orange-400 uppercase">{event.date.split(' ')[1]}</p>
            </div>
            <div className="border-l-2 border-gray-600 pl-4">
              {event.isExclusive && 
                <span className="inline-block bg-magenta-500 text-white text-xs font-bold px-2.5 py-1 rounded-full mb-2">
                  FÃ CLUBE
                </span>
              }
              <p className="text-gray-300">Ingressos a partir de <span className="font-bold text-white">R$ {event.ticketPrice.toFixed(2).replace('.', ',')}</span></p>
            </div>
          </div>
        </div>
        <div className="w-full mt-4 text-center bg-orange-500 text-white font-bold py-3 px-4 rounded-md group-hover:bg-orange-600 transition-colors">
          Ver Detalhes
        </div>
      </div>
    </button>
  );
};

export default React.memo(TicketCard);
