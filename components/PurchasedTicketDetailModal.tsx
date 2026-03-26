
import React, { useState } from 'react';
import { PurchasedTicket, Event } from '../types';
import Icon from './Icon';
import { Button } from './ui/button';
import { ModalBody, ModalCloseButton, ModalFooter, ModalHeader, ModalShell, ModalTitle } from './ui/modal-shell';

const Accordion: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-100 last:border-b-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left py-4 focus:outline-none"
                aria-expanded={isOpen}
            >
                <span className="font-bold text-gray-900 text-sm">{title}</span>
                <Icon name="chevron-down" className={`w-5 h-5 text-gray-300 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <div className="pb-4 pt-1 text-gray-500 text-xs font-medium leading-relaxed space-y-2">
                    {children}
                </div>
            </div>
        </div>
    );
};


const PurchasedTicketDetailModal: React.FC<{
  ticket: PurchasedTicket | null;
  onClose: () => void;
  onShowQr: (ticket: PurchasedTicket) => void;
  onBuyMoreTickets: (event: Event) => void;
  onShowToast: (message: string) => void;
  onConfigureAlert: (ticket: PurchasedTicket) => void;
}> = ({ ticket, onClose, onShowQr, onBuyMoreTickets, onShowToast, onConfigureAlert }) => {
  if (!ticket) return null;

  const handleShowQrCode = () => {
    onShowQr(ticket);
  };
  
  const handleSupportRequest = (topic: 'reembolso' | 'transferência' | 'suporte') => {
    let confirmMessage = '';
    let successMessage = '';

    switch (topic) {
        case 'reembolso':
            confirmMessage = 'Você confirma a solicitação de reembolso? Nossa equipe analisará seu pedido de acordo com a política de cancelamento.';
            successMessage = 'Solicitação de reembolso enviada!';
            break;
        case 'transferência':
            confirmMessage = 'Para transferir seu ingresso, nossa equipe entrará em contato para solicitar os dados do novo titular. Deseja continuar?';
            successMessage = 'Pedido de transferência iniciado!';
            break;
        case 'suporte':
            confirmMessage = 'Você será direcionado para iniciar uma conversa com nossa equipe de suporte. Continuar?';
            successMessage = 'Em breve o suporte entrará em contato!';
            break;
    }

    if (window.confirm(confirmMessage)) {
        onShowToast(successMessage);
        onClose();
    }
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ticket.fullAddress)}`;

  return (
    <ModalShell open={!!ticket} onClose={onClose} variant="sheet" className="max-w-lg" closeOnOverlayClick>
        <ModalHeader className="bg-white">
            <ModalTitle className="truncate ml-1">{ticket.name}</ModalTitle>
            <ModalCloseButton onClick={onClose} />
        </ModalHeader>
        <ModalBody className="overflow-y-auto no-scrollbar space-y-6">
            <div className="aspect-video rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm relative">
                <img src={ticket.imageUrl} alt={ticket.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            
            <div className="bg-green-50 p-5 rounded-3xl border border-green-100 shadow-inner">
                <div className="flex items-center space-x-3 text-green-700">
                    <Icon name="check-circle" className="w-6 h-6 flex-shrink-0"/>
                    <p className="font-bold text-sm leading-relaxed">Sua entrada está garantida para a <span className="font-black uppercase">Pista Premium</span>.</p>
                </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-5">
                <div>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Informações do Local</h3>
                    <div className="space-y-3">
                        <div className="flex items-start">
                            <Icon name="tickets" className="w-5 h-5 text-rose-500 mr-3 mt-0.5"/> 
                            <div>
                                <p className="text-gray-900 font-bold text-sm">{ticket.date}</p>
                                <p className="text-gray-500 text-xs font-medium">Abertura: {ticket.time}</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <Icon name="profile" className="w-5 h-5 text-rose-500 mr-3 mt-0.5"/> 
                            <p className="text-gray-900 font-bold text-sm leading-tight">{ticket.fullAddress}</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex gap-2">
                    <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex-1 bg-white border border-gray-200 text-gray-900 font-bold py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors text-xs flex items-center justify-center space-x-2 shadow-sm">
                        <Icon name="truck" className="w-4 h-4 text-gray-400"/>
                        <span>Ver no Maps</span>
                    </a>
                    <button
                        onClick={() => onConfigureAlert(ticket)}
                        className={`flex-1 font-bold py-3 px-4 rounded-xl transition-all text-xs flex items-center justify-center space-x-2 shadow-sm ${
                            ticket.alertSet 
                                ? 'bg-green-100 text-green-700 border border-green-200' 
                                : 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/20'
                        }`}
                    >
                        <Icon name="tickets" className="w-4 h-4"/>
                        <span>{ticket.alertSet ? 'Agenda OK' : 'Add Agenda'}</span>
                    </button>
                </div>
            </div>
            
             <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Auto-atendimento</h3>
                <div className="grid grid-cols-1 gap-2">
                    <button onClick={() => handleSupportRequest('transferência')} className="w-full bg-gray-50 text-gray-700 font-bold py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors text-xs flex items-center justify-between group">
                        <span className="group-hover:text-gray-900">Transferir titularidade</span>
                        <Icon name="switch" className="w-4 h-4 text-gray-300"/>
                    </button>
                    <button onClick={() => handleSupportRequest('reembolso')} className="w-full bg-gray-50 text-red-600 font-bold py-3 px-4 rounded-xl hover:bg-red-50 transition-colors text-xs flex items-center justify-between group border border-transparent hover:border-red-100">
                        <span>Solicitar reembolso</span>
                        <Icon name="document-text" className="w-4 h-4 text-red-200"/>
                    </button>
                </div>
            </div>

             <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Guia do Evento</h3>
                <div className="divide-y divide-gray-50">
                   <Accordion title="Itens Permitidos e Proibidos">
                       <p className="font-bold text-green-600">Pode levar:</p>
                       <ul className="list-disc list-inside mb-3">
                            <li>Celulares e powerbanks.</li>
                            <li>Capa de chuva.</li>
                            <li>Óculos escuros e protetor solar.</li>
                       </ul>
                       <p className="font-bold text-red-600">Não pode levar:</p>
                       <ul className="list-disc list-inside">
                            <li>Garrafas e latas rígidas.</li>
                            <li>Guarda-chuvas e hastes de selfie.</li>
                            <li>Objetos cortantes ou armas.</li>
                       </ul>
                   </Accordion>
                   <Accordion title="Dicas de Acesso">
                       <p>Chegue com antecedência. Os portões costumam abrir 3 horas antes do show. Evite levar mochilas grandes para agilizar a revista de segurança.</p>
                   </Accordion>
                </div>
             </div>

        </ModalBody>
        <ModalFooter className="grid grid-cols-2 gap-4 safe-bottom-pad">
            <Button
                onClick={() => onBuyMoreTickets(ticket)}
                variant="secondary"
                className="w-full rounded-2xl py-6 text-sm font-bold text-gray-600 border border-gray-100 shadow-sm"
            >
                Comprar Mais
            </Button>
             <Button
                onClick={handleShowQrCode}
                className="w-full rounded-2xl py-6 text-sm font-black"
            >
                Ver QR Code
            </Button>
        </ModalFooter>
    </ModalShell>
  );
};

export default PurchasedTicketDetailModal;
