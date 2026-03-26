
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Artist, ArtistSection, Post, FanGroup, FanProfile, Order, MerchItem } from '../../types';
import { getArtistDataRepository } from '../../services/artistDataRepository';
import { useBilling } from '../../contexts/BillingContext';
import { ArtistFanProvider, useArtistFan } from '../../contexts/ArtistFanContext';
import ArtistBottomNav from './ArtistBottomNav';
import StudioView from './views/StudioView';
import DashboardView from './views/DashboardView';
import CommunityView from './views/CommunityView';
import SalesView from './views/SalesView';
import MenuView from './views/MenuView';

interface ArtistAppProps {
  artist: Artist;
  onExit: () => void;
  onViewImage: (details: any) => void;
}

const ArtistAppContent: React.FC<ArtistAppProps> = ({ artist: initialArtist, onExit, onViewImage }) => {
  const [activeSection, setActiveSection] = useState<ArtistSection>(ArtistSection.DASHBOARD);
  const [leaderboard, setLeaderboard] = useState<FanProfile[]>([]);
  const [currentArtist, setCurrentArtist] = useState<Artist>(initialArtist);
  const mainScrollRef = useRef<HTMLElement | null>(null);
  const artistDataRepository = useMemo(() => getArtistDataRepository(), []);
  const { getOrdersForArtist, setOrders } = useBilling();

  const {
      posts, setPosts,
      merch, setMerch,
      events,
      fanGroups, setFanGroups,
      fanPoints 
  } = useArtistFan();
  const orders = getOrdersForArtist(currentArtist.id);

  useEffect(() => {
      setCurrentArtist(initialArtist);
  }, [initialArtist]);

  useEffect(() => {
      mainScrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [activeSection, currentArtist.id]);

  useEffect(() => {
      const fetchInitialData = async () => {
          try {
              const groupsPromise = fanGroups.length === 0 ? artistDataRepository.getFanGroupsForArtist(currentArtist.id) : Promise.resolve(null);
              const leaderboardPromise = artistDataRepository.getFanLeaderboard(currentArtist.id, 0);

              const [leaderboardData, groupsData] = await Promise.all([leaderboardPromise, groupsPromise]);
              
              setLeaderboard(leaderboardData);
              
              if (groupsData) {
                  setFanGroups(groupsData);
              }
          } catch (error) {
              console.error("Failed to fetch initial data for artist app", error);
          }
      };
      void fetchInitialData();
  }, [artistDataRepository, currentArtist.id, setFanGroups, fanGroups.length]);

  const handleCreatePost = (newPost: Post) => {
      setPosts(prev => [newPost, ...prev]);
  };

  const handleCreateGroup = (groupData: { name: string; description: string; eventId?: string; coverImageUrl: string }) => {
      const newGroup: FanGroup = {
          id: `fg-${Date.now()}`,
          artistId: currentArtist.id,
          name: groupData.name,
          description: groupData.description,
          eventId: groupData.eventId || '',
          eventName: groupData.eventId ? (events.find(e => e.id === groupData.eventId)?.name || 'Evento') : 'Comunidade Oficial',
          coverImageUrl: groupData.coverImageUrl,
          memberCount: 1,
          messages: []
      };
      setFanGroups(prev => [newGroup, ...prev]);
  };

  const handleUpdateGroup = (updatedGroup: FanGroup) => {
      setFanGroups(prev => prev.map(g => g.id === updatedGroup.id ? updatedGroup : g));
  };

  const handleUpdateOrder = (updatedOrder: Order) => {
      setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
  };

  const handleAddProduct = (newProduct: MerchItem) => {
      setMerch(prev => [newProduct, ...prev]);
  };

  const handleUpdateArtistProfile = (updates: Partial<Artist>) => {
      setCurrentArtist(prev => ({ ...prev, ...updates }));
  };

  const handleSectionChange = (section: ArtistSection) => {
      mainScrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
      if (section !== activeSection) {
          setActiveSection(section);
          return;
      }
      requestAnimationFrame(() => {
          mainScrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
      });
  };

  const renderSection = () => {
    switch (activeSection) {
      case ArtistSection.DASHBOARD:
        return <DashboardView artist={currentArtist} />;
      case ArtistSection.STUDIO:
        return (
            <StudioView 
                artist={currentArtist} 
                onPostCreated={handleCreatePost}
                availableMerch={merch}
                availableEvents={events}
            />
        );
      case ArtistSection.COMMUNITY:
        return (
            <CommunityView 
                artist={currentArtist}
                fanGroups={fanGroups}
                leaderboard={leaderboard}
                availableEvents={events}
                onCreateGroup={handleCreateGroup}
                onUpdateGroup={handleUpdateGroup}
            />
        );
      case ArtistSection.SALES:
        return (
            <SalesView 
                artist={currentArtist}
                orders={orders}
                merch={merch}
                onUpdateOrder={handleUpdateOrder}
                onAddProduct={handleAddProduct}
            />
        );
      case ArtistSection.MENU:
        return (
            <MenuView 
                artist={currentArtist}
                onLogout={onExit}
                onUpdateArtist={handleUpdateArtistProfile}
            />
        );
      default:
        return <DashboardView artist={currentArtist} />;
    }
  };

  return (
    <div className="safe-screen bg-gray-50 flex flex-col text-gray-900 relative">
      <header className="safe-top-pad safe-horizontal-pad bg-white/90 backdrop-blur-md sticky top-0 z-20 pb-3 flex items-center justify-between border-b border-gray-100 shadow-sm">
        <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden shadow-sm">
                <img src={currentArtist.profileImageUrl} alt={currentArtist.name} className="w-full h-full object-cover" />
            </div>
            <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">{currentArtist.name}</h1>
            <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded-full inline-block mt-0.5">Backstage</p>
            </div>
        </div>
        <button 
            onClick={onExit}
            className="text-xs font-bold text-gray-500 hover:text-rose-500 bg-gray-50 hover:bg-rose-50 px-4 py-2 rounded-full transition-colors border border-gray-200 hover:border-rose-200"
        >
            Sair
        </button>
      </header>

      <main ref={mainScrollRef} className="safe-bottom-nav-space flex-grow relative overflow-y-auto">
        {renderSection()}
      </main>

      <ArtistBottomNav activeSection={activeSection} onSectionChange={handleSectionChange} />
    </div>
  );
};

const ArtistApp: React.FC<ArtistAppProps> = (props) => {
  const { artist } = props;

  return (
    <ArtistFanProvider artistId={artist.id} initialFanPoints={artist.fanPoints || 0} userScopeId={`artist-admin:${artist.id}`}>
      <ArtistAppContent {...props} />
    </ArtistFanProvider>
  );
};

export default ArtistApp;
