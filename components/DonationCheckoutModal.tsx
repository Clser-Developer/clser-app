
import React, { useState } from 'react';
import { VaquinhaCampaign } from '../types';
import Icon from './Icon';

interface DonationCheckoutModalProps {
  checkoutDetails: { campaign: VaquinhaCampaign; amount: number } | null;
  onClose: () => void;
  onSuccess: (details: { campaign: VaquinhaCampaign; amount: number }) => void;
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

const DonationCheckoutModal: React.FC<DonationCheckoutModalProps> = ({ checkoutDetails, onClose, onSuccess, paymentMethod, onEditPaymentMethod }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    if (!checkoutDetails) return null;
    const { campaign, amount } = checkoutDetails;

    const handleConfirm = () => {
        setIsProcessing(true);
        setTimeout(() => {
            onSuccess(checkoutDetails);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center" aria-modal="true" role="dialog">
            <div className="bg-white rounded-t-[2.5rem] w-full max-w-md shadow-2xl border-t border-gray-100 animate-slide-up flex flex-col max-h-[95vh]">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900 ml-4">Finalizar Apoio</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100">
                        <Icon name="close" className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 space-y-8 overflow-y-auto no-scrollbar">
                    <div className="flex items-start space-x-4 pb-6 border-b border-gray-100">
                        <img src={campaign.imageUrl} alt={campaign.title} className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 border border-gray-100 shadow-sm" />
                        <div className="flex-1 min-w-0">
                            <p className="font-black text-gray-900 truncate text-lg leading-tight">{campaign.title}</p>
                            <p className="text-xs text-gray-400 mt-1 font-medium">Sua contribuição faz toda a diferença para o projeto!</p>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        <DetailRow icon="credit-card" title="Pagar Com" onEdit={onEditPaymentMethod}>
                        {paymentMethod === 'credit-card' ? (
                            <p>Mastercard **** 1234</p>
                        ) : (
                            <p>Pix Imediato</p>
                        )}
                        </DetailRow>

                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 shadow-inner">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Total da Doação</span>
                                <span className="font-black text-rose-500 text-3xl tabular-nums">R$ {amount.toFixed(2).replace('.', ',')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white border-t border-gray-100 pb-10">
                    <button 
                        onClick={handleConfirm} 
                        disabled={isProcessing} 
                        className="w-full bg-rose-500 text-white font-black py-4 px-4 rounded-2xl hover:bg-rose-600 transition-all disabled:bg-gray-200 flex items-center justify-center shadow-xl shadow-rose-500/20 active:scale-95"
                    >
                        {isProcessing ? <LoadingSpinner/> : (paymentMethod === 'pix' ? 'Gerar Pix de Apoio' : 'Confirmar Apoio')}
                    </button>
                </div>
            </div>
        </div>
    );
};
export default DonationCheckoutModal;
