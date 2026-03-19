
import React, { useState } from 'react';
import { ExperienceItem } from '../types';
import Icon from './Icon';
import { Button } from './ui/button';
import { ModalBody, ModalCloseButton, ModalFooter, ModalHeader, ModalShell, ModalTitle } from './ui/modal-shell';

interface ExperienceCheckoutModalProps {
  experience: ExperienceItem | null;
  onClose: () => void;
  onSuccess: (experience: ExperienceItem) => void;
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

const ExperienceCheckoutModal: React.FC<ExperienceCheckoutModalProps> = ({ experience, onClose, onSuccess, paymentMethod, onEditPaymentMethod }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    if (!experience) return null;

    const handleConfirm = () => {
        setIsProcessing(true);
        setTimeout(() => {
            onSuccess(experience);
        }, 2000);
    };

    return (
        <ModalShell open={!!experience} onClose={onClose} variant="sheet" closeOnOverlayClick>
                <ModalHeader>
                    <ModalTitle className="ml-1">Finalizar Experiência</ModalTitle>
                    <ModalCloseButton onClick={onClose} />
                </ModalHeader>
                <ModalBody className="space-y-8 overflow-y-auto no-scrollbar">
                    <div className="flex items-start space-x-4 pb-6 border-b border-gray-100">
                        <img src={experience.imageUrl} alt={experience.name} className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 border border-gray-100 shadow-sm" />
                        <div className="flex-1 min-w-0">
                            <p className="font-black text-gray-900 text-lg leading-tight truncate">{experience.name}</p>
                            <p className="text-xs text-gray-400 mt-1 font-medium">{experience.eventDate} às {experience.eventTime}</p>
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

                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 shadow-inner flex justify-between items-center">
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Total</span>
                            <span className="font-black text-gray-900 text-3xl tabular-nums">R$ {experience.price.toFixed(2).replace('.', ',')}</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-2xl border border-green-100">
                        <Icon name="check-circle" className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <p className="text-[10px] text-green-800 font-bold leading-tight">
                            Após o pagamento, os dados de acesso serão enviados por e-mail e estarão em "Minhas Compras".
                        </p>
                    </div>
                </ModalBody>

                <ModalFooter className="pb-10">
                    <Button
                        onClick={handleConfirm} 
                        disabled={isProcessing} 
                        className="w-full rounded-2xl py-6 text-sm font-black flex items-center justify-center disabled:bg-gray-200"
                    >
                        {isProcessing ? <LoadingSpinner/> : (paymentMethod === 'pix' ? 'Gerar Pix de Reserva' : 'Confirmar e Pagar')}
                    </Button>
                </ModalFooter>
        </ModalShell>
    );
};
export default ExperienceCheckoutModal;
