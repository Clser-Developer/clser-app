
import React, { useState, useMemo } from 'react';
import { Event, TicketSelection } from '../types';
import Icon from './Icon';
import { Button } from './ui/button';
import { ModalBody, ModalCloseButton, ModalFooter, ModalHeader, ModalShell, ModalTitle } from './ui/modal-shell';

interface TicketCheckoutModalProps {
  purchaseDetails: { event: Event; selections: TicketSelection[] } | null;
  onClose: () => void;
  onSuccess: (details: { event: Event; selections: TicketSelection[] }) => void;
  paymentMethod: 'credit-card' | 'pix';
  onEditAddress: () => void;
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

const TicketCheckoutModal: React.FC<TicketCheckoutModalProps> = ({ purchaseDetails, onClose, onSuccess, paymentMethod, onEditAddress, onEditPaymentMethod }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const total = useMemo(() => {
        if (!purchaseDetails) return 0;
        return purchaseDetails.selections.reduce((acc, sel) => acc + (sel.tier.price * sel.quantity), 0);
    }, [purchaseDetails]);

    if (!purchaseDetails) return null;
    const { event, selections } = purchaseDetails;

    const handleConfirm = () => {
        setIsProcessing(true);
        setTimeout(() => {
            onSuccess(purchaseDetails);
        }, 2000);
    };

    return (
    <ModalShell open={!!purchaseDetails} onClose={onClose} variant="sheet" closeOnOverlayClick>
        <ModalHeader>
            <ModalTitle className="ml-1">Checkout de Ingressos</ModalTitle>
            <ModalCloseButton onClick={onClose} />
        </ModalHeader>
        <ModalBody className="space-y-6 overflow-y-auto no-scrollbar">
            <div className="flex items-start space-x-4 pb-6 border-b border-gray-100">
                <img src={event.imageUrl} alt={event.name} className="w-16 h-20 rounded-2xl object-cover flex-shrink-0 border border-gray-100 shadow-sm" />
                <div className="flex-1 min-w-0">
                    <p className="font-black text-gray-900 leading-tight">{event.name}</p>
                    <p className="text-xs text-gray-400 mt-1.5 font-bold uppercase tracking-widest">{event.date} às {event.time}</p>
                    <p className="text-xs text-gray-500 mt-1 font-medium truncate">{event.location}</p>
                </div>
            </div>
            
            <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100 space-y-3 shadow-inner">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Resumo da Seleção</h3>
                <div className="space-y-2.5">
                    {selections.map(({ tier, quantity }) => (
                         <div key={tier.name} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 font-medium">{quantity}x {tier.name}</span>
                            <span className="font-black text-gray-900 tabular-nums">R$ {(tier.price * quantity).toFixed(2).replace('.',',')}</span>
                        </div>
                    ))}
                    <div className="pt-2.5 border-t border-gray-200 flex justify-between items-baseline">
                        <span className="text-gray-900 font-black text-base">Total</span>
                        <span className="font-black text-rose-500 text-2xl tabular-nums">R$ {total.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>
            </div>
            
            <div className="space-y-6">
                <DetailRow icon="box" title="Cobrança" onEdit={onEditAddress}>
                    <p>Fã Demo • São Paulo, SP</p>
                    <p className="text-[10px] text-gray-400 font-medium">Código postal: 01234-567</p>
                </DetailRow>
                <DetailRow icon="credit-card" title="Pagar Com" onEdit={onEditPaymentMethod}>
                {paymentMethod === 'credit-card' ? (
                    <p>Mastercard **** 1234</p>
                ) : (
                    <p>Pix Bancário</p>
                )}
                </DetailRow>
            </div>
        </ModalBody>

        <ModalFooter className="pb-10">
            <Button
                onClick={handleConfirm} 
                disabled={isProcessing} 
                className="w-full rounded-2xl py-6 text-sm font-black flex items-center justify-center disabled:bg-gray-200"
            >
                {isProcessing ? <LoadingSpinner/> : (paymentMethod === 'pix' ? 'Gerar Pix do Ingresso' : 'Confirmar Reserva')}
            </Button>
        </ModalFooter>
    </ModalShell>
  );
};

export default TicketCheckoutModal;
