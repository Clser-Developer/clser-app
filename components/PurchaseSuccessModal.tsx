

import React from 'react';
import Icon from './Icon';

interface PurchaseSuccessModalProps {
  isVisible: boolean;
  onClose: () => void;
  onGoToPurchases?: () => void;
  onGoToTickets?: () => void;
  isPix: boolean;
  purchaseType: 'merch' | 'ticket';
}

const PurchaseSuccessModal: React.FC<PurchaseSuccessModalProps> = ({
  isVisible,
  onClose,
  onGoToPurchases,
  onGoToTickets,
  isPix,
  purchaseType,
}) => {
  if (!isVisible) return null;

  const isTicket = purchaseType === 'ticket';
  const title = isPix ? "Pedido Criado!" : isTicket ? "Ingresso Confirmado!" : "Compra Realizada!";
  const message = isTicket 
    ? "Seu ingresso é digital e já está disponível em 'Meus Ingressos'. Você receberá alertas sobre o evento."
    : isPix
    ? "Efetue o pagamento do Pix para confirmar sua compra. Você já pode acompanhar o status do seu pedido na área 'Minhas Compras'."
    : "Sua compra foi realizada com sucesso! Acompanhe o envio do seu pedido na área 'Minhas Compras'.";

  const handlePrimaryAction = () => {
    if (isTicket) {
      onGoToTickets?.();
    } else {
      onGoToPurchases?.();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in" aria-modal="true" role="dialog">
      <div className="bg-gray-800 rounded-2xl w-full max-w-sm text-center p-8 shadow-2xl border border-gray-700 animate-scale-in flex flex-col items-center">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border-4 border-green-500/30">
          <Icon name="check-circle" className="w-12 h-12 text-green-400" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-gray-300 mb-8 text-sm">{message}</p>
        
        <div className="w-full space-y-3">
             <button
                onClick={handlePrimaryAction}
                className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition-transform hover:scale-105 transform-gpu"
            >
                {isTicket ? 'Ver Meus Ingressos' : 'Acompanhar Pedido'}
            </button>
            <button
                onClick={onClose}
                className="w-full bg-transparent text-gray-400 font-bold py-3 px-4 rounded-lg hover:bg-gray-700/50 transition-colors"
            >
                Continuar Explorando
            </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccessModal;