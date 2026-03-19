
import React from 'react';
import Icon from './Icon';
import { Event, FanGroup, ExperienceItem } from '../types';
import { Button } from './ui/button';
import { ModalBody, ModalFooter, ModalShell, ModalTitle } from './ui/modal-shell';

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
    <ModalShell open={isVisible} onClose={onClose} variant="dialog" className="max-w-sm text-center">
      <ModalBody className="flex flex-col items-center p-8">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 border-4 border-green-100 shadow-inner">
          <Icon name="check-circle" className="w-12 h-12 text-green-500 stroke-[3]" />
        </div>
        
        <ModalTitle className="mb-2 text-2xl leading-tight">{title}</ModalTitle>
        <p className="text-gray-500 mb-10 text-sm font-medium leading-relaxed">{message}</p>

      </ModalBody>
      <ModalFooter className="border-t-0 px-8 pb-8 pt-0">
        <div className="w-full space-y-4">
             <Button
                onClick={handlePrimaryAction}
                className="w-full rounded-2xl py-6 text-sm font-black"
            >
                {primaryActionText}
            </Button>
             {isTicket && details.group && (
                <Button
                    onClick={onGoToGroups}
                    variant="secondary"
                    className="w-full rounded-2xl py-6 text-sm font-black text-gray-900 flex items-center justify-center space-x-2"
                >
                    <Icon name="user-group" className="w-5 h-5" />
                    <span>Juntar-se ao Grupo de Fãs</span>
                </Button>
            )}
            <Button
                onClick={onClose}
                variant="ghost"
                className="w-full rounded-xl py-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-600"
            >
                Continuar Explorando
            </Button>
        </div>
      </ModalFooter>
    </ModalShell>
  );
};

export default PurchaseSuccessModal;
