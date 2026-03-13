

import React, { useState, useMemo } from 'react';
import { Event } from '../types';
import Icon from './Icon';

interface TicketCheckoutModalProps {
  event: Event | null;
  onClose: () => void;
  onSuccess: (event: Event) => void;
  paymentMethod: 'credit-card' | 'pix';
  onEditAddress: () => void;
  onEditPaymentMethod: () => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
);

const DetailRow: React.FC<{ icon: string; title: string; onEdit?: () => void; children: React.ReactNode }> = ({ icon, title, onEdit, children }) => (
    <div className="flex items-start space-x-4">
        <Icon name={icon} className="w-6 h-6 text-gray-400 mt-1" />
        <div className="flex-1">
            <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-400 text-sm">{title}</h4>
                {onEdit && (
                    <button onClick={onEdit} className="text-sm font-semibold text-orange-400 hover:text-orange-300 transition-colors">
                        Alterar
                    </button>
                )}
            </div>
            <div className="text-white font-medium mt-1">{children}</div>
        </div>
    </div>
);

const TicketCheckoutModal: React.FC<TicketCheckoutModalProps> = ({ event, onClose, onSuccess, paymentMethod, onEditAddress, onEditPaymentMethod }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    if (!event) return null;

    const handleConfirm = () => {
        setIsProcessing(true);
        setTimeout(() => {
            onSuccess(event);
        }, 2000);
    };

    return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center" aria-modal="true" role="dialog">
      <div className="bg-gray-800 rounded-t-2xl w-full max-w-md shadow-2xl border-t border-gray-700 animate-slide-up">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Finalizar Compra de Ingresso</h2>
            <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-700">
                <Icon name="close" className="w-6 h-6" />
            </button>
        </div>
        <div className="p-6">
            <div className="flex items-start space-x-4 py-4">
                <img src={event.imageUrl} alt={event.name} className="w-16 h-20 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{event.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{event.location}</p>
                    <p className="text-xs text-gray-400 mt-1">{event.date}</p>
                </div>
                <p className="text-base font-bold text-white">R$ {event.ticketPrice.toFixed(2).replace('.', ',')}</p>
            </div>
            
            <div className="space-y-5 mt-6">
                <DetailRow icon="box" title="Endereço de Cobrança" onEdit={onEditAddress}>
                    <p>Rua dos Fãs, 123</p>
                    <p className="text-xs text-gray-500">São Paulo, SP - 01234-567</p>
                </DetailRow>
                <DetailRow icon="credit-card" title="Pagar Com" onEdit={onEditPaymentMethod}>
                {paymentMethod === 'credit-card' ? (
                    <>
                        <p>Cartão de Crédito</p>
                        <p>**** **** **** 1234</p>
                    </>
                ) : (
                    <p>Pix</p>
                )}
                </DetailRow>
            </div>

            <div className="border-t border-gray-700 my-6 pt-4 space-y-2">
                <div className="flex justify-between items-center text-xl mt-2">
                    <span className="text-gray-300 font-medium">Total</span>
                    <span className="font-bold text-white">R$ {event.ticketPrice.toFixed(2).replace('.', ',')}</span>
                </div>
            </div>
        </div>

        <div className="p-4 bg-gray-900/50">
            <button 
                onClick={handleConfirm} 
                disabled={isProcessing} 
                className="w-full bg-orange-500 text-white font-bold py-4 px-4 rounded-lg hover:bg-orange-600 transition-transform hover:scale-105 transform-gpu disabled:bg-orange-700 disabled:cursor-not-allowed disabled:scale-100 flex justify-center items-center focus:outline-none focus:ring-2 focus:ring-orange-500">
                {isProcessing ? <LoadingSpinner/> : (paymentMethod === 'pix' ? 'Gerar Pix' : 'Confirmar Compra')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default TicketCheckoutModal;