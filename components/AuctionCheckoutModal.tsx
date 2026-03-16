
import React, { useState } from 'react';
import { AuctionItem } from '../types';
import Icon from './Icon';

interface AuctionCheckoutModalProps {
  checkoutDetails: { auction: AuctionItem; bidAmount: number } | null;
  onClose: () => void;
  onSuccess: (details: { auction: AuctionItem; bidAmount: number }) => void;
  paymentMethod: 'credit-card' | 'pix';
  onEditPaymentMethod: () => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="w-6 h-6 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
);

const DetailRow: React.FC<{ icon: string; title: string; onEdit?: () => void; children: React.ReactNode }> = ({ icon, title, onEdit, children }) => (
    <div className="flex items-start space-x-4">
        <div className="bg-gray-100 p-2.5 rounded-xl text-gray-400 flex-shrink-0">
            <Icon name={icon} className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center">
                <h4 className="font-bold text-gray-400 text-[10px] uppercase tracking-widest">{title}</h4>
                {onEdit && (
                    <button onClick={onEdit} className="text-xs font-black text-rose-500 hover:text-rose-600">
                        Alterar
                    </button>
                )}
            </div>
            <div className="text-gray-900 font-bold mt-0.5 text-sm">{children}</div>
        </div>
    </div>
);

const AuctionCheckoutModal: React.FC<AuctionCheckoutModalProps> = ({ checkoutDetails, onClose, onSuccess, paymentMethod, onEditPaymentMethod }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    if (!checkoutDetails) return null;
    const { auction, bidAmount } = checkoutDetails;

    const handleConfirm = () => {
        setIsProcessing(true);
        setTimeout(() => {
            onSuccess(checkoutDetails);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center" aria-modal="true" role="dialog">
            <div className="bg-white rounded-t-[2.5rem] w-full max-w-md shadow-2xl border-t border-gray-100 animate-slide-up flex flex-col max-h-[95vh]">
                <header className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900 ml-4">Autorizar Lance</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100">
                        <Icon name="close" className="w-6 h-6" />
                    </button>
                </header>
                <div className="p-6 space-y-6 overflow-y-auto no-scrollbar">
                    <div className="flex items-start space-x-4 pb-6 border-b border-gray-100">
                        <img src={auction.imageUrl} alt={auction.name} className="w-20 h-20 rounded-2xl object-cover flex-shrink-0 border border-gray-100 shadow-sm" />
                        <div className="flex-1 min-w-0">
                            <p className="font-black text-gray-900 truncate">{auction.name}</p>
                            <p className="text-xs text-gray-500 mt-1 font-medium leading-relaxed">Você está autorizando um compromisso de lance para este item.</p>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        <DetailRow icon="credit-card" title="Pagar Com" onEdit={onEditPaymentMethod}>
                        {paymentMethod === 'credit-card' ? (
                            <p>Mastercard **** 1234</p>
                        ) : (
                            <p>Pix Institucional</p>
                        )}
                        </DetailRow>

                        <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100 space-y-1">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Valor total do lance</p>
                            <p className="text-3xl font-black text-gray-900">R$ {bidAmount.toFixed(2).replace('.', ',')}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                        <Icon name="question-mark-circle" className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        <p className="text-[10px] text-blue-800 font-bold leading-tight">
                            Uma pré-autorização será feita em seu cartão. A cobrança definitiva só ocorre se você vencer o leilão.
                        </p>
                    </div>
                </div>

                <div className="p-6 bg-white border-t border-gray-100 pb-10">
                    <button 
                        onClick={handleConfirm} 
                        disabled={isProcessing} 
                        className="w-full bg-rose-500 text-white font-black py-4 px-4 rounded-2xl hover:bg-rose-600 transition-all disabled:bg-gray-200 flex items-center justify-center shadow-xl shadow-rose-500/20 active:scale-95"
                    >
                        {isProcessing ? <LoadingSpinner/> : (paymentMethod === 'pix' ? 'Autorizar com Pix' : 'Autorizar Lance')}
                    </button>
                </div>
            </div>
        </div>
    );
};
export default AuctionCheckoutModal;
