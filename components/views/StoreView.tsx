
import React, { useState, useEffect, useMemo } from 'react';
import { Artist, MerchItem, Event, AuctionItem, StoreSection, Order, CartItem, PurchasedTicket, TicketSelection, EventStatus, VaquinhaCampaign, ExperienceItem } from '../../types';
import StoreHome from '../StoreHome';
import MerchCard from '../MerchCard';
import TicketCard from '../TicketCard';
import AuctionCard from '../AuctionCard';
import MyPurchasesView from '../MyPurchasesView';
import Icon from '../Icon';
import MerchDetailModal from '../MerchDetailModal';
import TicketDetailModal from '../TicketDetailModal';
import VaquinhaCard from '../VaquinhaCard';
import PurchasedTicketDetailModal from '../PurchasedTicketDetailModal';
import AlertConfigurationModal from '../AlertConfigurationModal';
import ExperienceCard from '../ExperienceCard';
import ExperienceDetailModal from '../ExperienceDetailModal';
import { useBilling } from '../../contexts/BillingContext';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { ModalBody, ModalFooter, ModalHeader, ModalShell, ModalTitle } from '../ui/modal-shell';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

// Componente Mastercard do Artista
const MastercardBanner: React.FC<{ artist: Artist, hasCard: boolean, onGetCard: () => void }> = ({ artist, hasCard, onGetCard }) => {
    if (hasCard) {
        return (
            <div className="relative mb-6 w-full aspect-[1.58] overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_30px_60px_-32px_rgba(15,23,42,0.55)] transition-transform hover:scale-[1.01]">
                {/* Background simulating holographic card */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-shimmer"></div>
                
                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-white/80 font-bold uppercase tracking-widest text-xs">Official Member</h3>
                            <h2 className="text-white font-black text-xl italic">{artist.name}</h2>
                        </div>
                        <Icon name="check-circle" className="w-8 h-8 text-rose-500" />
                    </div>
                    
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-white/60 text-xs mb-1">Anuidade (Mensal)</p>
                            <p className="text-white font-bold">R$ 19,90</p>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex space-x-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-red-500/80"></div>
                                <div className="w-8 h-8 rounded-full bg-yellow-500/80 -ml-4"></div>
                            </div>
                            <p className="text-white/80 text-xs font-bold">mastercard</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="group relative mb-6 overflow-hidden rounded-[2rem] border border-gray-200 bg-[linear-gradient(135deg,#111827,#1f2937)] p-1 shadow-[0_30px_60px_-34px_rgba(15,23,42,0.55)]">
            <div className="relative z-10 flex flex-col items-center rounded-[1.6rem] bg-[linear-gradient(180deg,#ffffff,#fff7f7)] p-5 text-center">
                {/* Imagem Oficial do Cartão solicitada pelo usuário */}
                <div className="w-full mb-5 rounded-xl overflow-hidden shadow-md">
                    <img 
                        src="https://i.ibb.co/tprX1SCV/66886960-1598-431-E-B193-DBB16078-F558.png" 
                        alt="Cartão Mastercard Oficial" 
                        className="w-full h-auto object-cover transform transition-transform group-hover:scale-105 duration-500"
                    />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Cartão Oficial {artist.name}</h3>
                <p className="text-gray-500 text-xs mb-5 max-w-[200px]">Descontos em ingressos, pré-vendas e pontos em dobro.</p>
                <Button 
                    onClick={onGetCard}
                    className="h-12 w-full rounded-2xl font-black shadow-md transition-all active:scale-95"
                >
                    Solicitar Cartão
                </Button>
            </div>
        </div>
    );
};

// --- INLINED COMPONENTS FOR SIMPLICITY ---

const QRCodeModal: React.FC<{ ticket: PurchasedTicket | null; onClose: () => void; }> = ({ ticket, onClose }) => {
  if (!ticket) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-[2rem] w-full max-w-sm text-center p-8 shadow-2xl animate-scale-in flex flex-col items-center border border-gray-100" onClick={e => e.stopPropagation()}>
         <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:bg-gray-100">
            <Icon name="close" className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-gray-900 mb-1">{ticket.name}</h2>
        <p className="text-gray-500 mb-1 text-sm">{ticket.location}</p>
        <p className="font-bold text-rose-500 mb-6">{ticket.date}</p>
        <div className="bg-white p-2 rounded-xl mb-6 shadow-inner border border-gray-100">
            <img src="https://img.odcdn.com.br/wp-content/uploads/2019/06/20190628211430.jpg" alt="QR Code" className="w-48 h-48 mx-auto mix-blend-multiply" />
        </div>
        <p className="text-xs text-gray-400">Apresente este QR Code na entrada.</p>
      </div>
    </div>
  );
};

const PurchasedTicketCard: React.FC<{ ticket: PurchasedTicket; onViewDetails: (ticket: PurchasedTicket) => void; onShowQr: (ticket: PurchasedTicket) => void; onConfigureAlert: (ticket: PurchasedTicket) => void; }> = ({ ticket, onViewDetails, onShowQr, onConfigureAlert }) => {
  return (
    <button
      onClick={() => onViewDetails(ticket)}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col w-full text-left hover:shadow-md transition-all group"
    >
      <div className="relative">
        <img src={ticket.imageUrl} alt={ticket.name} className="w-full h-32 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-lg font-bold text-white uppercase drop-shadow-md">{ticket.name}</h3>
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-green-600 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
            ADQUIRIDO
        </div>
      </div>
      <div className="p-4 flex items-center justify-between">
         <div className="flex items-center space-x-4">
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">{ticket.date.split(' ')[0]}</p>
              <p className="text-xs font-bold text-rose-500 uppercase">{ticket.date.split(' ')[1]}</p>
            </div>
            <div>
                <p className="text-gray-600 font-medium text-sm">{ticket.location}</p>
            </div>
          </div>
      </div>
       <div className="p-3 bg-gray-50 border-t border-gray-100 grid grid-cols-2 gap-3">
            <button
                onClick={(e) => { e.stopPropagation(); onShowQr(ticket); }}
                className="w-full bg-white border border-gray-200 text-gray-700 font-bold py-2.5 px-4 rounded-xl hover:bg-gray-50 transition-colors text-xs shadow-sm"
            >
                Ver QR Code
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); onConfigureAlert(ticket); }}
                disabled={ticket.alertSet}
                className={`w-full font-bold py-2.5 px-4 rounded-xl transition-colors text-xs shadow-sm ${
                    ticket.alertSet 
                        ? 'bg-green-50 text-green-600 border border-green-100 cursor-default' 
                        : 'bg-rose-500 text-white hover:bg-rose-600'
                }`}
            >
                {ticket.alertSet ? 'Lembrete Ativo' : 'Criar Alerta'}
            </button>
       </div>
    </button>
  );
};

const MyTicketsView: React.FC<{ tickets: PurchasedTicket[]; onViewDetails: (ticket: PurchasedTicket) => void; onShowQr: (ticket: PurchasedTicket) => void; onConfigureAlert: (ticket: PurchasedTicket) => void; }> = ({ tickets, onViewDetails, onShowQr, onConfigureAlert }) => {
  if (tickets.length === 0) {
    return (
      <Card className="gap-3 rounded-3xl border-gray-100 px-4 py-16 text-center shadow-sm">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="tickets" className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Você não tem ingressos</h3>
        <p className="text-gray-500 text-sm mt-1">Seus ingressos comprados aparecerão aqui.</p>
      </Card>
    );
  }
  return (
    <div className="space-y-4">
      {tickets.map(ticket => (
        <PurchasedTicketCard 
          key={ticket.purchaseId} 
          ticket={ticket}
          onViewDetails={onViewDetails}
          onShowQr={onShowQr}
          onConfigureAlert={onConfigureAlert}
        />
      ))}
    </div>
  );
};

const EmptyState: React.FC<{title: string, message: string}> = ({title, message}) => (
  <Card className="gap-3 rounded-3xl border-gray-100 px-4 py-16 text-center shadow-sm">
    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
    <p className="text-gray-500 text-sm mt-2">{message}</p>
  </Card>
);

const InfoModal: React.FC<{ isVisible: boolean; message: string; onClose: () => void }> = ({ isVisible, message, onClose }) => {
  if (!isVisible) return null;

  return (
    <ModalShell open={isVisible} onClose={onClose} variant="sheet">
      <ModalHeader className="border-b-0 pb-0">
        <ModalTitle className="sr-only">Solicitação indisponível</ModalTitle>
      </ModalHeader>
      <ModalBody className="pt-2 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-gray-100">
            <Icon name="lock-closed" className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-black text-gray-900">Solicitação indisponível</h2>
          <p className="text-sm text-gray-500 mt-3 font-medium leading-relaxed">{message}</p>
      </ModalBody>
      <ModalFooter className="pt-0">
          <Button
            onClick={onClose}
            className="h-14 w-full rounded-2xl font-black"
          >
            Fechar
          </Button>
      </ModalFooter>
    </ModalShell>
  );
};

const StoreSubSection: React.FC<{title: string, onBack: () => void, children: React.ReactNode}> = ({ title, onBack, children }) => (
  <div className="animate-fade-in p-4 pb-24">
    <div className="flex items-center mb-6">
      <Button
        onClick={onBack} 
        variant="outline"
        size="icon-lg"
        className="mr-2 rounded-2xl border-gray-200 bg-white text-gray-400 shadow-sm hover:bg-gray-50"
        aria-label="Voltar para a loja"
      >
        <Icon name="arrowLeft" className="w-6 h-6" />
      </Button>
      <h2 className="text-2xl font-black text-gray-950">{title}</h2>
    </div>
    {children}
  </div>
);

const ComingSoonView: React.FC<{title: string, onBack: () => void}> = ({title, onBack}) => (
  <StoreSubSection title={title} onBack={onBack}>
    <Card className="gap-3 rounded-3xl border-gray-100 px-4 py-16 text-center shadow-sm">
      <h3 className="text-xl font-bold text-gray-900">Em Breve</h3>
      <p className="text-gray-500 mt-2">Esta seção está sendo preparada com carinho para você!</p>
    </Card>
  </StoreSubSection>
);

interface StoreViewProps {
    artist: Artist;
    merch: MerchItem[];
    events: Event[];
    auctions: AuctionItem[];
    experiences: ExperienceItem[];
    orders: Order[];
    purchasedTickets: PurchasedTicket[];
    vaquinhaCampaigns: VaquinhaCampaign[];
    donatedCampaigns: Record<string, number>;
    storeSection: StoreSection;
    onSectionChange: (section: StoreSection) => void;
    onAddToCart: (item: CartItem) => void;
    onViewOrderDetails: (order: Order) => void;
    onPlaceBid: (auctionId: string) => void;
    onSelectVaquinha: (campaign: VaquinhaCampaign) => void;
    onInitiateTicketPurchase: (details: { event: Event; selections: TicketSelection[] }) => void;
    onInitiateExperiencePurchase: (experience: ExperienceItem) => void;
    onToggleTicketAlert: (purchaseId: string) => void;
    paymentMethod: 'credit-card' | 'pix';
    onPaymentMethodChange: (method: 'credit-card' | 'pix') => void;
    targetItemId?: string | null;
    onTargetItemHandled: () => void;
    activeTicketTab: 'available' | 'my_tickets';
    onTicketTabChange: (tab: 'available' | 'my_tickets') => void;
    onShowToast: (message: string) => void;
}

const StoreView: React.FC<StoreViewProps> = ({ 
    artist, merch, events, auctions, experiences, orders, purchasedTickets, vaquinhaCampaigns, donatedCampaigns, storeSection, 
    onSectionChange, onAddToCart, onViewOrderDetails, onPlaceBid, onSelectVaquinha,
    onInitiateTicketPurchase, onInitiateExperiencePurchase, onToggleTicketAlert,
    paymentMethod, onPaymentMethodChange,
    targetItemId, onTargetItemHandled,
    activeTicketTab, onTicketTabChange,
    onShowToast
}) => {
    const [selectedMerch, setSelectedMerch] = useState<MerchItem | null>(null);
    const [selectedEventForDetails, setSelectedEventForDetails] = useState<Event | null>(null);
    const [selectedExperience, setSelectedExperience] = useState<ExperienceItem | null>(null);
    const [ticketForQr, setTicketForQr] = useState<PurchasedTicket | null>(null);
    const [selectedPurchasedTicket, setSelectedPurchasedTicket] = useState<PurchasedTicket | null>(null);
    const [ticketSearchQuery, setTicketSearchQuery] = useState('');
    const [ticketForAlertConfig, setTicketForAlertConfig] = useState<PurchasedTicket | null>(null);
    const [isCardRequestBlockedVisible, setCardRequestBlockedVisible] = useState(false);

    const { hasCard } = useBilling();

    const filteredEvents = useMemo(() => {
        const sorted = [...events].sort((a, b) => {
            if (a.status === EventStatus.PAST && b.status !== EventStatus.PAST) return 1;
            if (a.status !== EventStatus.PAST && b.status === EventStatus.PAST) return -1;
            return 0;
        });

        if (!ticketSearchQuery.trim()) {
            return sorted;
        }
        
        const lowercasedQuery = ticketSearchQuery.toLowerCase();
        return sorted.filter(event => 
            event.name.toLowerCase().includes(lowercasedQuery) ||
            event.location.toLowerCase().includes(lowercasedQuery) ||
            event.date.toLowerCase().includes(lowercasedQuery)
        );
    }, [events, ticketSearchQuery]);

    useEffect(() => {
        if (targetItemId && storeSection === StoreSection.TICKETS) {
            const eventToShow = events.find(e => e.id === targetItemId);
            if (eventToShow) {
                setSelectedEventForDetails(eventToShow);
                onTargetItemHandled();
            }
        }
    }, [targetItemId, storeSection, events, onTargetItemHandled]);
    
    const handleCheckout = (event: Event, selections: TicketSelection[]) => {
        setSelectedEventForDetails(null);
        onInitiateTicketPurchase({ event, selections });
    };

    const handleBuyMoreTickets = (event: Event) => {
        setSelectedPurchasedTicket(null);
        setSelectedEventForDetails(event);
    };
    
    const handleConfigureAlert = (ticket: PurchasedTicket) => {
        if (ticket.alertSet) return;
        setSelectedPurchasedTicket(null);
        setTicketForAlertConfig(ticket);
    };

    const handleSetAlertAndClose = (purchaseId: string) => {
        onToggleTicketAlert(purchaseId);
        setTicketForAlertConfig(null);
    };

    const handleGetCard = () => {
        setCardRequestBlockedVisible(true);
    };

    const renderContent = () => {
        switch(storeSection) {
            case StoreSection.HOME:
                return (
                    <div className="animate-fade-in p-4 pb-24">
                        <header className="mb-6 rounded-[2rem] border border-gray-100 bg-[linear-gradient(180deg,#ffffff,#fff8f8)] p-6 shadow-[0_20px_48px_-36px_rgba(244,63,94,0.35)]">
                            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.24em] text-rose-500">Loja do artista</p>
                            <h2 className="text-3xl font-black text-gray-950">Loja</h2>
                            <p className="mt-2 text-gray-500">Explore tudo que o universo de {artist.name} oferece.</p>
                        </header>
                        
                        <MastercardBanner artist={artist} hasCard={hasCard} onGetCard={handleGetCard} />

                        <StoreHome artist={artist} onNavigate={onSectionChange} />
                    </div>
                );
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
                       <Tabs value={activeTicketTab} onValueChange={(value) => onTicketTabChange(value as 'available' | 'my_tickets')} className="mb-4">
                          <TabsList className="h-auto w-full rounded-2xl border border-gray-100 bg-white p-1 shadow-sm">
                              <TabsTrigger value="available" className="rounded-xl py-2.5 text-sm font-black data-[state=active]:bg-rose-500 data-[state=active]:text-white data-[state=active]:shadow-md">Disponíveis</TabsTrigger>
                              <TabsTrigger value="my_tickets" className="rounded-xl py-2.5 text-sm font-black data-[state=active]:bg-rose-500 data-[state=active]:text-white data-[state=active]:shadow-md">Meus Ingressos</TabsTrigger>
                          </TabsList>
                       </Tabs>

                       {activeTicketTab === 'available' ? (
                          <>
                            <div className="relative mb-4">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Icon name="search" className="w-5 h-5 text-gray-400" />
                                </div>
                                <Input
                                    type="text"
                                    value={ticketSearchQuery}
                                    onChange={(e) => setTicketSearchQuery(e.target.value)}
                                    placeholder="Buscar por show, local ou data..."
                                    className="h-auto rounded-2xl border-gray-200 bg-white py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 shadow-sm"
                                />
                            </div>
                             {filteredEvents.length > 0 ? (
                                <div className="space-y-3">
                                    {filteredEvents.map(event => {
                                        const isPurchased = purchasedTickets.some(t => t.id === event.id);
                                        return <TicketCard key={event.id} event={event} onViewDetails={setSelectedEventForDetails} isPurchased={isPurchased} />
                                    })}
                                </div>
                             ) : (
                                <EmptyState title="Nenhum Ingresso Encontrado" message="Tente ajustar sua busca ou fique de olho para futuros shows!" />
                             )}
                          </>
                       ) : (
                          <MyTicketsView tickets={purchasedTickets} onShowQr={setTicketForQr} onViewDetails={setSelectedPurchasedTicket} onConfigureAlert={handleConfigureAlert} />
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
                      onViewTicketDetails={setSelectedPurchasedTicket}
                    />
                  </StoreSubSection>
                );
              case StoreSection.CROWDFUNDING:
                return (
                  <StoreSubSection title="Vaquinha" onBack={() => onSectionChange(StoreSection.HOME)}>
                    {vaquinhaCampaigns.length > 0 ? (
                        <div className="space-y-4">
                            {vaquinhaCampaigns.map(campaign => (
                                <VaquinhaCard 
                                    key={campaign.id} 
                                    campaign={campaign} 
                                    onSelect={() => onSelectVaquinha(campaign)}
                                    userDonation={donatedCampaigns[campaign.id]}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState title="Nenhuma Vaquinha Ativa" message="Fique de olho para futuras campanhas de arrecadação!" />
                    )}
                  </StoreSubSection>
                );
              case StoreSection.EXPERIENCES:
                return (
                    <StoreSubSection title="Experiências" onBack={() => onSectionChange(StoreSection.HOME)}>
                      {experiences.length > 0 ? (
                          <div className="space-y-4">
                              {experiences.map(item => <ExperienceCard key={item.id} experience={item} onViewDetails={setSelectedExperience} />)}
                          </div>
                      ) : (
                          <EmptyState title="Em Breve" message="Nenhuma experiência disponível no momento." />
                      )}
                    </StoreSubSection>
                );
              case StoreSection.PPV:
                return (
                    <StoreSubSection title="Pay Per View" onBack={() => onSectionChange(StoreSection.HOME)}>
                        <Card className="rounded-3xl border-gray-100 p-8 text-center shadow-sm">
                            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Icon name="play" className="w-10 h-10 text-rose-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Conteúdo Exclusivo</h3>
                            <p className="text-gray-500 mt-2 mb-6">Assista a shows completos, documentários e transmissões ao vivo adquirindo seu ingresso digital.</p>
                            <Button className="rounded-xl px-6 py-3 font-black shadow-md">Ver Catálogo</Button>
                        </Card>
                    </StoreSubSection>
                );
              default:
                return (
                    <div className="animate-fade-in p-4">
                        <header className="mb-6 rounded-[2rem] border border-gray-100 bg-[linear-gradient(180deg,#ffffff,#fff8f8)] p-6 shadow-[0_20px_48px_-36px_rgba(244,63,94,0.35)]">
                            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.24em] text-rose-500">Loja do artista</p>
                            <h2 className="text-3xl font-black text-gray-950">Loja</h2>
                            <p className="mt-2 text-gray-500">Explore tudo que o universo de {artist.name} oferece.</p>
                        </header>
                        
                        <MastercardBanner artist={artist} hasCard={hasCard} onGetCard={handleGetCard} />

                        <StoreHome artist={artist} onNavigate={onSectionChange} />
                    </div>
                );
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
                event={selectedEventForDetails}
                onClose={() => setSelectedEventForDetails(null)}
                onCheckout={handleCheckout}
            />
            <ExperienceDetailModal 
                experience={selectedExperience} 
                onClose={() => setSelectedExperience(null)} 
                onPurchase={(exp) => {
                    setSelectedExperience(null);
                    onInitiateExperiencePurchase(exp);
                }}
            />
            <QRCodeModal ticket={ticketForQr} onClose={() => setTicketForQr(null)} />
            <PurchasedTicketDetailModal 
                ticket={selectedPurchasedTicket}
                onClose={() => setSelectedPurchasedTicket(null)}
                onShowQr={setTicketForQr}
                onBuyMoreTickets={handleBuyMoreTickets}
                onShowToast={onShowToast}
                onConfigureAlert={handleConfigureAlert}
            />
            <AlertConfigurationModal 
                ticket={ticketForAlertConfig}
                onClose={() => setTicketForAlertConfig(null)}
                onSetAlert={handleSetAlertAndClose}
            />
            <InfoModal
                isVisible={isCardRequestBlockedVisible}
                message="Seu usuário não pode solicitar o cartão."
                onClose={() => setCardRequestBlockedVisible(false)}
            />
            {renderContent()}
        </>
    );
};

export default StoreView;
