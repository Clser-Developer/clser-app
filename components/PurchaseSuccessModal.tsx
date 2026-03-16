
import React from 'react';
import Icon from './Icon';
import { Event, FanGroup, ExperienceItem } from '../types';

interface PurchaseSuccessDetails {
    isPix: boolean;
    type: 'merch' | 'ticket' | 'experience';
    event?: Event;
    experience?: ExperienceItem;
    group?: FanGroup;
}

interface PurchaseSuccessModalProps {
  isVisible: boolean;
  details: PurchaseSuccessDetails | null;
  onClose: () => void;
  onGoToPurchases?: () => void;
  onGoToTickets?: () => void;
  onGoToGroups?: () => void;
}

const PurchaseSuccessModal: React.FC<PurchaseSuccessModalProps> = ({
  isVisible,
  details,
  onClose,
  onGoToPurchases,
  onGoToTickets,
  onGoToGroups
}) => {
  if (!isVisible || !details) return null;

  const isTicket = details.type === 'ticket';
  const isExperience = details.type === 'experience';
  
  let title = details.isPix ? "Pedido Criado!" : "Compra Realizada!";
  if (isTicket) title = "Ingresso Confirmado!";
  if (isExperience) title = "Experiência Adquirida!";

  let message = details.isPix
    ? "Efetue o pagamento do Pix para confirmar sua compra. Você já pode acompanhar o status na área 'Minhas Compras'."
    : "Sua compra foi realizada com sucesso! Acompanhe o envio do seu pedido na área 'Minhas Compras'.";

  if (isTicket) {
      message = "Seu ingresso digital já está disponível em 'Meus Ingressos'. Fique atento aos alertas do show!";
  }
  if (isExperience) {
      message = "Sua experiência foi confirmada! Os detalhes de acesso estão disponíveis em 'Minhas Compras'.";
  }

  const handlePrimaryAction = () => {
    if (isTicket) onGoToTickets?.();
    else onGoToPurchases?.();
  };

  const primaryActionText = isTicket ? 'Ver Meus Ingressos' : 'Ver Minhas Compras';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in" aria-modal="true" role="dialog">
      <div className="bg-white rounded-[2.5rem] w-full max-w-sm text-center p-8 shadow-2xl border border-gray-100 animate-scale-in flex flex-col items-center">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 border-4 border-green-100 shadow-inner">
          <Icon name="check-circle" className="w-12 h-12 text-green-500 stroke-[3]" />
        </div>
        
        <h2 className="text-2xl font-black text-gray-900 mb-2 leading-tight">{title}</h2>
        <p className="text-gray-500 mb-10 text-sm font-medium leading-relaxed">{message}</p>
        
        <div className="w-full space-y-4">
             <button
                onClick={handlePrimaryAction}
                className="w-full bg-rose-500 text-white font-black py-4 px-4 rounded-2xl hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20 active:scale-95"
            >
                {primaryActionText}
            </button>
             {isTicket && details.group && (
                <button
                    onClick={onGoToGroups}
                    className="w-full bg-gray-900 text-white font-black py-4 px-4 rounded-2xl hover:bg-black transition-all flex items-center justify-center space-x-2 shadow-lg active:scale-95"
                >
                    <Icon name="user-group" className="w-5 h-5" />
                    <span>Juntar-se ao Grupo de Fãs</span>
                </button>
            )}
            <button
                onClick={onClose}
                className="w-full bg-transparent text-gray-400 font-bold py-2 px-4 rounded-xl hover:text-gray-600 transition-colors text-xs uppercase tracking-widest"
            >
                Continuar Explorando
            </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccessModal;
