
import React, { useState, useMemo, useEffect } from 'react';
import { Event, TicketTier, TicketSelection } from '../types';
import Icon from './Icon';

interface TicketDetailModalProps {
  event: Event | null;
  onClose: () => void;
  onCheckout: (event: Event, selections: TicketSelection[]) => void;
}

const TicketTierRow: React.FC<{
    tier: TicketTier;
    quantity: number;
    onQuantityChange: (newQuantity: number) => void;
}> = ({ tier, quantity, onQuantityChange }) => {
    return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 transition-all hover:bg-rose-50/30 group">
            <div>
                <p className="font-bold text-gray-900 text-base">{tier.name}</p>
                <p className="text-sm text-rose-500 font-black">R$ {tier.price.toFixed(2).replace('.', ',')}</p>
            </div>
            <div className="flex items-center space-x-3">
                <button 
                    onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
                    className="w-9 h-9 bg-white border border-gray-200 rounded-xl text-gray-900 font-black flex items-center justify-center hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm"
                >
                    -
                </button>
                <span className="w-8 text-center font-black text-gray-900 tabular-nums text-lg">{quantity}</span>
                <button 
                    onClick={() => onQuantityChange(quantity + 1)}
                    className="w-9 h-9 bg-white border border-gray-200 rounded-xl text-gray-900 font-black flex items-center justify-center hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm"
                >
                    +
                </button>
            </div>
        </div>
    );
};

const TicketDetailModal: React.FC<TicketDetailModalProps> = ({ event, onClose, onCheckout }) => {
  const [ticketQuantities, setTicketQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (event) {
      setTicketQuantities({});
    }
  }, [event]);

  const { total, selections, totalQuantity } = useMemo(() => {
    if (!event) return { total: 0, selections: [], totalQuantity: 0 };
    const activeSelections: TicketSelection[] = [];
    let currentTotal = 0;
    let currentQuantity = 0;
    for (const tier of event.ticketTiers) {
        const quantity = ticketQuantities[tier.name] || 0;
        if (quantity > 0) {
            currentTotal += tier.price * quantity;
            currentQuantity += quantity;
            activeSelections.push({ tier, quantity });
        }
    }
    return { total: currentTotal, selections: activeSelections, totalQuantity: currentQuantity };
  }, [ticketQuantities, event]);

  if (!event) return null;

  const handleQuantityChange = (tierName: string, newQuantity: number) => {
    setTicketQuantities(prev => ({ ...prev, [tierName]: newQuantity }));
  };
  
  const handleCheckoutClick = () => {
    if (selections.length > 0) onCheckout(event, selections);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-end justify-center" aria-modal="true" role="dialog" onClick={onClose}>
      <div className="bg-white rounded-t-[2.5rem] w-full max-w-lg shadow-2xl animate-slide-up flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <header className="p-4 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
            <h2 className="text-lg font-bold text-gray-900 truncate ml-4">{event.name}</h2>
            <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100">
                <Icon name="close" className="w-6 h-6" />
            </button>
        </header>
        <main className="overflow-y-auto no-scrollbar p-6 space-y-6">
            <div className="flex items-start space-x-5">
              <div className="text-center bg-rose-50 px-4 py-3 rounded-2xl flex-shrink-0 border border-rose-100">
                <p className="text-3xl font-black text-rose-600 leading-tight">{event.date.split(' ')[0]}</p>
                <p className="text-xs font-black text-rose-400 uppercase tracking-widest leading-none">{event.date.split(' ')[1]}</p>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Informações</p>
                <p className="text-gray-900 font-medium leading-relaxed">{event.location}</p>
                <p className="text-gray-500 font-medium text-sm">{event.time} • {event.fullAddress}</p>
              </div>
            </div>

            {event.mapImageUrl && (
                <div>
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Mapa do Local</h3>
                    <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                        <img src={event.mapImageUrl} alt="Mapa do evento" className="w-full h-auto" />
                    </div>
                </div>
            )}
            
            <div>
                 <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Selecione seus Ingressos</h3>
                 <div className="space-y-3">
                    {event.ticketTiers.map(tier => (
                        <TicketTierRow 
                            key={tier.name}
                            tier={tier}
                            quantity={ticketQuantities[tier.name] || 0}
                            onQuantityChange={(newQuantity) => handleQuantityChange(tier.name, newQuantity)}
                        />
                    ))}
                 </div>
            </div>
        </main>
        <footer className="p-6 bg-white border-t border-gray-100 flex-shrink-0 pb-24">
          <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-0.5">Total</p>
                <p className="text-2xl font-black text-gray-900">R$ {total.toFixed(2).replace('.', ',')}</p>
            </div>
            <button 
                onClick={handleCheckoutClick} 
                disabled={totalQuantity === 0}
                className="bg-gray-900 text-white font-black py-4 px-8 rounded-2xl hover:bg-black transition-all disabled:bg-gray-200 disabled:text-gray-400 shadow-xl"
            >
                Comprar ({totalQuantity})
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default TicketDetailModal;