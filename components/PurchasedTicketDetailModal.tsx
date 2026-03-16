
import React, { useState } from 'react';
import { PurchasedTicket, Event } from '../types';
import Icon from './Icon';

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-end justify-center" aria-modal="true" role="dialog" onClick={onClose}>
      <div className="bg-white rounded-t-[2.5rem] w-full max-w-lg shadow-2xl border-t border-gray-100 animate-slide-up flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <header className="p-5 border-b border-gray-100 flex justify-between items-center flex-shrink-0 bg-white rounded-t-[2.5rem]">
            <h2 className="text-lg font-black text-gray-900 truncate ml-4">{ticket.name}</h2>
            <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 transition-colors">
                <Icon name="close" className="w-6 h-6" />
            </button>
        </header>
        <main className="overflow-y-auto no-scrollbar p-6 space-y-6">
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

        </main>
        <footer className="p-6 bg-white border-t border-gray-100 flex-shrink-0 grid grid-cols-2 gap-4 pb-24">
            <button 
                onClick={() => onBuyMoreTickets(ticket)}
                className="w-full bg-gray-50 text-gray-600 font-bold py-4 px-4 rounded-2xl hover:bg-gray-100 transition-colors text-sm border border-gray-100 shadow-sm"
            >
                Comprar Mais
            </button>
             <button
                onClick={handleShowQrCode}
                className="w-full bg-gray-900 text-white font-black py-4 px-4 rounded-2xl hover:bg-black transition-all text-sm shadow-xl active:scale-95"
            >
                Ver QR Code
            </button>
        </footer>
      </div>
    </div>
  );
};

export default PurchasedTicketDetailModal;