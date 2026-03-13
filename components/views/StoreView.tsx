import React, { useState, useEffect } from 'react';
import { Artist, MerchItem, Event, AuctionItem, StoreSection, Order, CartItem, PurchasedTicket } from '../../types';
import StoreHome from '../StoreHome';
import MerchCard from '../MerchCard';
import TicketCard from '../TicketCard';
import AuctionCard from '../AuctionCard';
import MyPurchasesView from '../MyPurchasesView';
import Icon from '../Icon';
import MerchDetailModal from '../MerchDetailModal';

// --- INLINED COMPONENTS FOR SIMPLICITY ---

const QRCodeModal: React.FC<{ ticket: PurchasedTicket | null; onClose: () => void; }> = ({ ticket, onClose }) => {
  if (!ticket) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-gray-800 rounded-2xl w-full max-w-sm text-center p-8 shadow-2xl border border-gray-700 animate-scale-in flex flex-col items-center" onClick={e => e.stopPropagation()}>
         <button onClick={onClose} className="absolute top-3 right-3 p-2 rounded-full text-gray-400 hover:bg-gray-700">
            <Icon name="close" className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-white mb-2">{ticket.name}</h2>
        <p className="text-gray-300 mb-1">{ticket.location}</p>
        <p className="font-semibold text-orange-400 mb-6">{ticket.date}</p>
        <div className="bg-white p-4 rounded-lg mb-6">
            <img src="https://img.odcdn.com.br/wp-content/uploads/2019/06/20190628211430.jpg" alt="QR Code" className="w-48 h-48 mx-auto" />
        </div>
        <p className="text-sm text-gray-400">Apresente este QR Code na entrada do evento.</p>
      </div>
    </div>
  );
};

const PurchasedTicketCard: React.FC<{ ticket: PurchasedTicket; onShowQr: (ticket: PurchasedTicket) => void; onToggleAlert: (purchaseId: string) => void; }> = ({ ticket, onShowQr, onToggleAlert }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700/50 flex flex-col">
      <div className="relative">
        <img src={ticket.imageUrl} alt={ticket.name} className="w-full h-32 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-lg font-bold text-white uppercase">{ticket.name}</h3>
        </div>
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            ADQUIRIDO
        </div>
      </div>
      <div className="p-4 flex items-center justify-between">
         <div className="flex items-center space-x-4">
            <div className="text-center">
              <p className="text-xl font-bold text-white">{ticket.date.split(' ')[0]}</p>
              <p className="text-sm font-semibold text-orange-400 uppercase">{ticket.date.split(' ')[1]}</p>
            </div>
            <div>
                <p className="text-gray-300 font-semibold">{ticket.location}</p>
            </div>
          </div>
      </div>
       <div className="p-4 border-t border-gray-700 grid grid-cols-2 gap-3">
            <button
                onClick={() => onShowQr(ticket)}
                className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-md hover:bg-orange-600 transition-colors text-sm"
            >
                Ver QR Code
            </button>
            <button
                onClick={() => onToggleAlert(ticket.purchaseId)}
                disabled={ticket.alertSet}
                className={`w-full font-bold py-3 px-4 rounded-md transition-colors text-sm ${
                    ticket.alertSet 
                        ? 'bg-green-500/20 text-green-300 cursor-default' 
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
            >
                {ticket.alertSet ? 'Alerta Ativado' : 'Criar Alerta'}
            </button>
       </div>
    </div>
  );
};

const MyTicketsView: React.FC<{ tickets: PurchasedTicket[]; onShowQr: (ticket: PurchasedTicket) => void; onToggleAlert: (purchaseId: string) => void; }> = ({ tickets, onShowQr, onToggleAlert }) => {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-gray-800/50 rounded-lg">
        <Icon name="tickets" className="w-12 h-12 mx-auto text-gray-500 mb-4" />
        <h3 className="text-xl font-bold text-white">Você não tem ingressos</h3>
        <p className="text-gray-400 mt-2">Seus ingressos comprados aparecerão aqui.</p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {tickets.map(ticket => (
        <PurchasedTicketCard 
          key={ticket.purchaseId} 
          ticket={ticket}
          onShowQr={onShowQr}
          onToggleAlert={onToggleAlert}
        />
      ))}
    </div>
  );
};


const TicketDetailModal: React.FC<{
  event: Event | null;
  onClose: () => void;
  onPurchase: (event: Event) => void;
}> = ({ event, onClose, onPurchase }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center" aria-modal="true" role="dialog" onClick={onClose}>
      <div className="bg-gray-800 rounded-t-2xl w-full max-w-lg shadow-2xl border-t border-gray-700 animate-slide-up flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <header className="p-4 border-b border-gray-700 flex justify-end items-center flex-shrink-0">
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-700">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>
        <main className="overflow-y-auto">
          <div className="relative">
            <img src={event.imageUrl} alt={event.name} className="w-full h-48 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent"></div>
          </div>
          <div className="p-6">
            <div className="flex items-start space-x-4 mb-4">
              <div className="text-center bg-gray-900/50 p-3 rounded-lg">
                <p className="text-3xl font-bold text-white">{event.date.split(' ')[0]}</p>
                <p className="text-md font-semibold text-orange-400 uppercase">{event.date.split(' ')[1]}</p>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-black text-white uppercase tracking-wider">{event.name}</h2>
                <p className="text-md text-gray-300">{event.location}</p>
              </div>
            </div>
            {event.isExclusive &&
              <span className="inline-block bg-magenta-500 text-white text-xs font-bold px-2.5 py-1 rounded-full mb-4">
                EXCLUSIVO PARA FÃS
              </span>
            }
            <div className="border-t border-gray-700 pt-4">
              <p className="text-gray-300">Ingressos a partir de</p>
              <p className="text-3xl font-bold text-orange-400">R$ {event.ticketPrice.toFixed(2).replace('.', ',')}</p>
            </div>
          </div>
        </main>
        <footer className="p-4 bg-gray-900/50 flex-shrink-0 border-t border-gray-700">
          <button onClick={() => onPurchase(event)} className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors">
            Comprar Ingressos
          </button>
        </footer>
      </div>
    </div>
  );
};

const EmptyState: React.FC<{title: string, message: string}> = ({title, message}) => (
  <div className="text-center py-16 px-4 bg-gray-800/50 rounded-lg">
    <h3 className="text-xl font-bold text-white">{title}</h3>
    <p className="text-gray-400 mt-2">{message}</p>
  </div>
);

const StoreSubSection: React.FC<{title: string, onBack: () => void, children: React.ReactNode}> = ({ title, onBack, children }) => (
  <div className="p-4 animate-fade-in">
    <div className="flex items-center mb-4">
      <button 
        onClick={onBack} 
        className="p-2 rounded-full text-gray-300 hover:bg-gray-700 mr-2 transition-colors"
        aria-label="Voltar para a loja"
      >
        <Icon name="arrowLeft" className="w-6 h-6" />
      </button>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
    </div>
    {children}
  </div>
);

const ComingSoonView: React.FC<{title: string, onBack: () => void}> = ({title, onBack}) => (
  <StoreSubSection title={title} onBack={onBack}>
    <div className="text-center py-16 px-4 bg-gray-800/50 rounded-lg">
      <h3 className="text-xl font-bold text-white">Em Breve</h3>
      <p className="text-gray-400 mt-2">Esta seção está sendo preparada com carinho para você!</p>
    </div>
  </StoreSubSection>
);

interface StoreViewProps {
    artist: Artist;
    merch: MerchItem[];
    events: Event[];
    auctions: AuctionItem[];
    orders: Order[];
    purchasedTickets: PurchasedTicket[];
    storeSection: StoreSection;
    onSectionChange: (section: StoreSection) => void;
    onAddToCart: (item: CartItem) => void;
    onViewOrderDetails: (order: Order) => void;
    onPlaceBid: (auctionId: string) => void;
    onInitiateTicketPurchase: (event: Event) => void;
    onToggleTicketAlert: (purchaseId: string) => void;
    paymentMethod: 'credit-card' | 'pix';
    onPaymentMethodChange: (method: 'credit-card' | 'pix') => void;
    targetItemId?: string | null;
    onTargetItemHandled: () => void;
    activeTicketTab: 'available' | 'my_tickets';
    onTicketTabChange: (tab: 'available' | 'my_tickets') => void;
}

const StoreView: React.FC<StoreViewProps> = ({ 
    artist, merch, events, auctions, orders, purchasedTickets, storeSection, 
    onSectionChange, onAddToCart, onViewOrderDetails, onPlaceBid,
    onInitiateTicketPurchase, onToggleTicketAlert,
    paymentMethod, onPaymentMethodChange,
    targetItemId, onTargetItemHandled,
    activeTicketTab, onTicketTabChange
}) => {
    const [selectedMerch, setSelectedMerch] = useState<MerchItem | null>(null);
    const [selectedTicket, setSelectedTicket] = useState<Event | null>(null);
    const [ticketForQr, setTicketForQr] = useState<PurchasedTicket | null>(null);

    useEffect(() => {
        // Only trigger if we are in the correct subsection
        if (targetItemId && storeSection === StoreSection.TICKETS) {
            const ticketToShow = events.find(e => e.id === targetItemId);
            if (ticketToShow) {
                setSelectedTicket(ticketToShow);
                onTargetItemHandled();
            }
        }
    }, [targetItemId, storeSection, events, onTargetItemHandled]);

    const renderContent = () => {
        switch(storeSection) {
            case StoreSection.HOME:
                return <StoreHome artist={artist} onNavigate={onSectionChange} />;
            case StoreSection.MERCH:
                return (
                    <StoreSubSection title="Merch" onBack={() => onSectionChange(StoreSection.HOME)}>
                      {merch.length > 0 ? (
                          <div className="grid grid-cols-2 gap-4">
                              {merch.map(item => <MerchCard key={item.id} item={item} onViewDetails={setSelectedMerch} />)}
                          </div>
                      ) : (
                          <EmptyState title="Em Breve" message="Novos produtos serão adicionados em breve!" />
                      )}
                    </StoreSubSection>
                );
              case StoreSection.AUCTIONS:
                return (
                  <StoreSubSection title="Leilões" onBack={() => onSectionChange(StoreSection.HOME)}>
                    {auctions.length > 0 ? (
                        <div className="space-y-4">
                            {auctions.map(item => <AuctionCard key={item.id} auction={item} onPlaceBid={onPlaceBid} />)}
                        </div>
                    ) : (
                        <EmptyState title="Nenhum Leilão Ativo" message="Fique de olho para itens exclusivos que podem aparecer aqui!" />
                    )}
                  </StoreSubSection>
                );
              case StoreSection.TICKETS:
                return (
                    <StoreSubSection title="Ingressos" onBack={() => onSectionChange(StoreSection.HOME)}>
                       <div className="mb-6">
                          <div className="flex bg-gray-900/50 p-1 rounded-lg">
                              <button onClick={() => onTicketTabChange('available')} className={`w-1/2 py-2 text-sm font-bold rounded-md transition-colors ${activeTicketTab === 'available' ? 'bg-orange-500 text-white' : 'text-gray-300'}`}>Disponíveis</button>
                              <button onClick={() => onTicketTabChange('my_tickets')} className={`w-1/2 py-2 text-sm font-bold rounded-md transition-colors ${activeTicketTab === 'my_tickets' ? 'bg-orange-500 text-white' : 'text-gray-300'}`}>Meus Ingressos</button>
                          </div>
                       </div>
                       {activeTicketTab === 'available' ? (
                          events.length > 0 ? (
                              <div className="space-y-4">
                                  {events.map(event => <TicketCard key={event.id} event={event} onViewDetails={setSelectedTicket} />)}
                              </div>
                          ) : (
                              <EmptyState title="Nenhum Ingresso Disponível" message="Fique de olho para futuros shows e eventos!" />
                          )
                       ) : (
                          <MyTicketsView tickets={purchasedTickets} onToggleAlert={onToggleTicketAlert} onShowQr={setTicketForQr} />
                       )}
                    </StoreSubSection>
                );
              case StoreSection.MY_PURCHASES:
                 return (
                  <StoreSubSection title="Minhas Compras" onBack={() => onSectionChange(StoreSection.HOME)}>
                    <MyPurchasesView 
                      orders={orders} 
                      purchasedTickets={purchasedTickets}
                      onViewOrderDetails={onViewOrderDetails}
                      onViewTicketDetails={setTicketForQr}
                    />
                  </StoreSubSection>
                );
              case StoreSection.CROWDFUNDING:
                return <ComingSoonView title="Crowdfunding" onBack={() => onSectionChange(StoreSection.HOME)} />;
              case StoreSection.EXPERIENCES:
                return <ComingSoonView title="Experiências" onBack={() => onSectionChange(StoreSection.HOME)} />;
              case StoreSection.PPV:
                return <ComingSoonView title="PPV" onBack={() => onSectionChange(StoreSection.HOME)} />;
              default:
                return <StoreHome artist={artist} onNavigate={onSectionChange} />;
        }
    }

    return (
        <>
            <MerchDetailModal 
                item={selectedMerch} 
                onClose={() => setSelectedMerch(null)} 
                onAddToCart={onAddToCart} 
            />
            <TicketDetailModal 
                event={selectedTicket} 
                onClose={() => setSelectedTicket(null)} 
                onPurchase={(event) => { setSelectedTicket(null); onInitiateTicketPurchase(event); }}
            />
            <QRCodeModal ticket={ticketForQr} onClose={() => setTicketForQr(null)} />
            {renderContent()}
        </>
    );
};

export default StoreView;