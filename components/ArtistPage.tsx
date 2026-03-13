import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Artist, Post, Section, StoreSection, FanAreaSection, Order, OrderStatus, FanProfile, Comment, AuctionItem, ExclusiveReward, RewardType, Event, MerchItem, MediaItem, MediaPlatform, MediaType, CartItem, PurchasedTicket, PaymentRecord } from '../types';
import { getPostsForArtist, getMerchForArtist, getEventsForArtist, getFanLeaderboard, getCommentsForPost, getAuctionsForArtist, getExclusiveRewardsForArtist, getMediaForArtist, getPaymentHistory } from '../services/mockApiService';
import { usePersistentArtistState } from '../hooks/usePersistentArtistState';

import Header from './Header';
import BottomNav from './BottomNav';
import ProfileView from './ProfileView';
import Icon from './Icon';
import OneClickPurchase from './OneClickPurchase';
import PurchaseSuccessModal from './PurchaseSuccessModal';
import CommentModal from './CommentModal';
import PointsAwardedModal from './PointsAwardedModal';
import OrderStatusModal from './OrderStatusModal';
import AuctionBidModal from './AuctionBidModal';
import PointsInfoModal from './PointsInfoModal';
import RewardDetailsModal from './RewardDetailsModal';
import MediaPlayer from './MediaPlayer';
import ConnectAccountModal from './ConnectAccountModal';
import SimulatedLoginModal from './SimulatedLoginModal';
import HelpCenterModal from './HelpCenterModal';
import Toast from './Toast';
import TicketCheckoutModal from './TicketCheckoutModal';
import AddressModal from './AddressModal';
import PaymentMethodModal from './PaymentMethodModal';
import PaymentHistoryModal from './PaymentHistoryModal';

import TimelineView from './views/TimelineView';
import StoreView from './views/StoreView';
import FanAreaView from './views/FanAreaView';
import MediaView from './views/MediaView';

interface ArtistPageProps {
  artist: Artist;
  onViewImage: (url: string) => void;
  onSwitchArtist: () => void;
  onLogout: () => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-8 h-full">
        <div className="w-8 h-8 border-4 border-magenta-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
);

const FloatingCartButton: React.FC<{itemCount: number, onClick: () => void}> = ({itemCount, onClick}) => (
    <div className="sticky w-full h-0 bottom-0 z-30 flex justify-end items-end pointer-events-none">
        <button 
            onClick={onClick}
            className="mb-20 mr-4 bg-orange-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-orange-600 transition-transform transform hover:scale-110 pointer-events-auto"
            aria-label={`Ver carrinho com ${itemCount} itens`}
        >
            <Icon name="shopping-cart" className="w-8 h-8" />
            <span className="absolute -top-1 -right-1 bg-white text-orange-500 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                {itemCount}
            </span>
        </button>
    </div>
);


const ArtistPage: React.FC<ArtistPageProps> = ({ artist, onViewImage, onSwitchArtist, onLogout }) => {
  const [activeSection, setActiveSection] = useState<Section>(Section.TIMELINE);
  const [storeSection, setStoreSection] = useState<StoreSection>(StoreSection.HOME);
  const [fanAreaSection, setFanAreaSection] = useState<FanAreaSection>(FanAreaSection.HOME);
  const [storeViewTargetItemId, setStoreViewTargetItemId] = useState<string | null>(null);
  const [activeTicketTab, setActiveTicketTab] = useState<'available' | 'my_tickets'>('available');

  const {
      fanPoints, setFanPoints,
      likedPostIds, setLikedPostIds,
      commentedPostIds, setCommentedPostIds,
      shoppingCart, setShoppingCart,
      orders, setOrders,
      purchasedTickets, setPurchasedTickets,
      paymentMethod, setPaymentMethod,
      posts, setPosts,
      merch, setMerch,
      events, setEvents,
      auctions, setAuctions,
      exclusiveRewards, setExclusiveRewards,
      media, setMedia,
  } = usePersistentArtistState(artist.id, artist.fanPoints || 0);
  
  const [leaderboard, setLeaderboard] = useState<FanProfile[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);
  
  // Performance Refactor: Section-specific loading states
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isLoadingStore, setIsLoadingStore] = useState(false);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Modals and player state
  const [isHelpVisible, setHelpVisible] = useState(false);
  const [pointsModalData, setPointsModalData] = useState<{ points: number; reason: string } | null>(null);
  const [isPointsInfoModalVisible, setIsPointsInfoModalVisible] = useState(false);
  const [selectedReward, setSelectedReward] = useState<ExclusiveReward | null>(null);
  const [isCheckoutVisible, setIsCheckoutVisible] = useState(false);
  const [isPurchaseSuccessModalVisible, setIsPurchaseSuccessModalVisible] = useState(false);
  const [lastPurchaseDetails, setLastPurchaseDetails] = useState<{ isPix: boolean } | null>(null);
  const [lastPurchaseType, setLastPurchaseType] = useState<'merch' | 'ticket'>('merch');
  const [lastPurchasePoints, setLastPurchasePoints] = useState<number>(0);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null);
  const [selectedPostForComments, setSelectedPostForComments] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [selectedAuctionForBidding, setSelectedAuctionForBidding] = useState<AuctionItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [ticketToPurchase, setTicketToPurchase] = useState<Event | null>(null);
  const [isAddressModalVisible, setAddressModalVisible] = useState(false);
  const [isPaymentMethodModalVisible, setPaymentMethodModalVisible] = useState(false);
  const [isPaymentHistoryVisible, setPaymentHistoryVisible] = useState(false);
  
  // Media Section State
  const [playingMedia, setPlayingMedia] = useState<MediaItem | null>(null);
  const [connections, setConnections] = useState({ youtube: false, spotify: false });
  const [connectionFlowState, setConnectionFlowState] = useState<{
    step: 'login' | 'consent';
    platform: MediaPlatform;
    mediaItem: MediaItem | null;
  } | null>(null);

  const scrollPositionRef = useRef(0);

  useEffect(() => {
    if (pointsModalData === null) {
      const rootEl = document.getElementById('root');
      if (rootEl) {
        requestAnimationFrame(() => {
          rootEl.scrollTop = scrollPositionRef.current;
        });
      }
    }
  }, [pointsModalData]);

  const addFanPoints = useCallback((points: number, reason: string) => {
    const rootEl = document.getElementById('root');
    if (rootEl) {
      scrollPositionRef.current = rootEl.scrollTop;
    }
    setFanPoints(prev => prev + points);
    setPointsModalData({ points, reason });
  }, [setFanPoints]);

  const helpContext = useMemo(() => {
    if (activeSection === Section.TIMELINE) return 'novidades';
    if (activeSection === Section.STORE) {
        if (storeSection !== StoreSection.HOME && storeSection !== StoreSection.MY_PURCHASES) return `loja_${storeSection}`;
        return 'loja';
    }
    if (activeSection === Section.FAN_AREA) {
        if (fanAreaSection !== FanAreaSection.HOME) return `fan_area_${fanAreaSection}`;
        return 'fan_area';
    }
    return activeSection;
  }, [activeSection, storeSection, fanAreaSection]);
  
  useEffect(() => {
    if (activeSection !== Section.STORE) {
        setStoreSection(StoreSection.HOME);
        setActiveTicketTab('available');
    }
    if (activeSection !== Section.FAN_AREA) setFanAreaSection(FanAreaSection.HOME);
  }, [activeSection]);

  // Performance Refactor: Initial data fetch for Timeline only
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoadingPosts(true);
      try {
        if (posts.length === 0) {
          const postsData = await getPostsForArtist(artist.id);
          setPosts(postsData);
        }
      } catch (error) {
        console.error("Failed to fetch initial post data:", error);
      } finally {
        setIsLoadingPosts(false);
      }
    };
    fetchInitialData();
  }, [artist.id, posts.length, setPosts]);

  // Performance Refactor: Lazy load data for other sections
  useEffect(() => {
    const loadStoreData = async () => {
      if (merch.length === 0 && events.length === 0 && auctions.length === 0) {
        setIsLoadingStore(true);
        try {
          const [merchData, eventsData, auctionsData] = await Promise.all([
            getMerchForArtist(artist.id),
            getEventsForArtist(artist.id),
            getAuctionsForArtist(artist.id),
          ]);
          setMerch(merchData);
          setEvents(eventsData);
          setAuctions(auctionsData);
        } catch (error) { console.error("Failed to load store data", error); } 
        finally { setIsLoadingStore(false); }
      }
    };
    const loadMediaData = async () => {
      if (media.length === 0) {
        setIsLoadingMedia(true);
        try {
          const mediaData = await getMediaForArtist(artist.id);
          setMedia(mediaData);
        } catch (error) { console.error("Failed to load media data", error); }
        finally { setIsLoadingMedia(false); }
      }
    };
    
    const loadProfileData = async () => {
      if (leaderboard.length > 0 && exclusiveRewards.length > 0 && paymentHistory.length > 0) return;
    
      setIsLoadingProfile(true);
      try {
        const [rewardsData, leaderboardData, paymentHistoryData] = await Promise.all([
          exclusiveRewards.length === 0 ? getExclusiveRewardsForArtist(artist.id) : Promise.resolve(exclusiveRewards),
          leaderboard.length === 0 ? getFanLeaderboard(artist.id, fanPoints) : Promise.resolve(leaderboard),
          paymentHistory.length === 0 ? getPaymentHistory(artist.id) : Promise.resolve(paymentHistory),
        ]);
        if (exclusiveRewards.length === 0) setExclusiveRewards(rewardsData as ExclusiveReward[]);
        if (leaderboard.length === 0) setLeaderboard(leaderboardData as FanProfile[]);
        if (paymentHistory.length === 0) setPaymentHistory(paymentHistoryData as PaymentRecord[]);
      } catch (error) { console.error("Failed to load profile data", error); }
      finally { setIsLoadingProfile(false); }
    };

    if (activeSection === Section.STORE) loadStoreData();
    else if (activeSection === Section.MEDIA) loadMediaData();
    else if (activeSection === Section.PROFILE || activeSection === Section.FAN_AREA) {
        loadProfileData();
    }
  }, [activeSection, artist.id, fanPoints, merch.length, events.length, auctions.length, media.length, exclusiveRewards, leaderboard, paymentHistory, setMerch, setEvents, setAuctions, setMedia, setExclusiveRewards, setLeaderboard, setPaymentHistory]);


  useEffect(() => {
      if (!selectedPostForComments) return;
      const fetchComments = async () => {
          setIsCommentsLoading(true);
          try {
              setComments(await getCommentsForPost(selectedPostForComments.id));
          } catch (error) { console.error("Failed to fetch comments:", error); } 
          finally { setIsCommentsLoading(false); }
      };
      fetchComments();
  }, [selectedPostForComments?.id]);
  
  const handleLikePost = useCallback((postId: string) => {
    const isAlreadyLiked = likedPostIds.has(postId);
    const newLikedPostIds = new Set(likedPostIds);
    if (isAlreadyLiked) {
      newLikedPostIds.delete(postId);
      setFanPoints(prev => prev - 5);
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes - 1 } : p));
    } else {
      newLikedPostIds.add(postId);
      addFanPoints(5, 'Por curtir um post!');
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
    }
    setLikedPostIds(newLikedPostIds);
  }, [addFanPoints, likedPostIds, setLikedPostIds, setFanPoints, setPosts]);

  const handleAddComment = useCallback((postId: string, commentText: string) => {
    if (!commentedPostIds.has(postId)) {
      addFanPoints(10, 'Por comentar em um post!');
      setCommentedPostIds(prev => new Set(prev).add(postId));
    }
    const newComment: Comment = {
      id: `c${Date.now()}`, postId, authorName: 'Fã nº 1 (Você)',
      authorImageUrl: 'https://picsum.photos/seed/user-profile/100/100', text: commentText,
      timestamp: 'Agora mesmo', isCurrentUser: true,
    };
    setComments(prev => [...prev, newComment]);
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: p.comments + 1 } : p));
  }, [addFanPoints, commentedPostIds, setCommentedPostIds, setPosts]);
  
  const handleVote = useCallback((postId: string, optionIndex: number) => {
    const post = posts.find(p => p.id === postId);
    if (!post || post.userVotedOptionIndex != null || !post.pollVotes) return;
    addFanPoints(15, 'Por votar na enquete!');
    setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          const newPollVotes = [...p.pollVotes!];
          newPollVotes[optionIndex]++;
          return { ...p, pollVotes: newPollVotes, userVotedOptionIndex: optionIndex };
        }
        return p;
      })
    );
  }, [addFanPoints, posts, setPosts]);

  const handleAddToCart = useCallback((itemToAdd: CartItem) => {
    setShoppingCart(prev => {
      const existingIndex = prev.findIndex(item =>
        item.id === itemToAdd.id &&
        item.selectedSize === itemToAdd.selectedSize &&
        item.selectedColor === itemToAdd.selectedColor
      );

      if (existingIndex > -1) {
        const newCart = [...prev];
        const existingItem = newCart[existingIndex];
        newCart[existingIndex] = { ...existingItem, quantity: existingItem.quantity + itemToAdd.quantity };
        return newCart;
      } else {
        return [...prev, itemToAdd];
      }
    });
  }, [setShoppingCart]);

  const handleUpdateCartQuantity = useCallback((itemId: string, newQuantity: number) => {
    setShoppingCart(prev => newQuantity <= 0 ? prev.filter(item => item.id !== itemId) : prev.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item));
  }, [setShoppingCart]);
  
  const handlePurchaseSuccess = useCallback((purchaseDetails: { total: number; shippingCost: number; paymentMethod: 'credit-card' | 'pix' }) => {
    const pointsEarned = shoppingCart.reduce((total, item) => total + item.quantity, 0) * 50;
    setLastPurchasePoints(pointsEarned);
    const newOrder: Order = {
        id: `SF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`, date: new Date().toLocaleDateString('pt-BR'),
        status: OrderStatus.PROCESSING, items: [...shoppingCart], total: purchaseDetails.total, shippingCost: purchaseDetails.shippingCost,
    };
    setOrders(prev => [newOrder, ...prev]);
    setLastPurchaseDetails({ isPix: purchaseDetails.paymentMethod === 'pix' });
    setLastPurchaseType('merch');
    setShoppingCart([]);
    setIsCheckoutVisible(false);
    setIsPurchaseSuccessModalVisible(true);
  }, [shoppingCart, setOrders, setShoppingCart]);

   const handlePurchaseTicketSuccess = useCallback((event: Event) => {
    const pointsEarned = 100;
    const newTicket: PurchasedTicket = {
      ...event,
      purchaseId: `TKT-${Date.now()}`,
      alertSet: false,
    };
    setPurchasedTickets(prev => [newTicket, ...prev]);
    setLastPurchasePoints(pointsEarned);
    setLastPurchaseDetails({ isPix: paymentMethod === 'pix' });
    setLastPurchaseType('ticket');
    setTicketToPurchase(null);
    setIsPurchaseSuccessModalVisible(true);
  }, [paymentMethod, setPurchasedTickets]);

  const handleClosePurchaseSuccess = useCallback(() => {
    setIsPurchaseSuccessModalVisible(false);
    if (lastPurchasePoints > 0) {
        const reason = lastPurchaseType === 'ticket' ? 'Pela compra do ingresso!' : 'Por sua compra na loja!';
        addFanPoints(lastPurchasePoints, reason);
        setLastPurchasePoints(0);
    }
  }, [addFanPoints, lastPurchasePoints, lastPurchaseType]);

  const handleConfirmBid = useCallback((auctionId: string) => {
    const auction = auctions.find(a => a.id === auctionId);
    if (!auction || new Date(auction.endTime).getTime() < Date.now()) {
        setSelectedAuctionForBidding(null);
        return;
    }
    addFanPoints(20, 'Por dar um lance em um leilão!');
    setAuctions(prev => prev.map(a => {
        if (a.id === auctionId) {
            const newBidAmount = a.currentBid + a.bidIncrement;
            return {
                ...a, currentBid: newBidAmount, highestBidderName: 'Fã nº 1 (Você)',
                bids: [...a.bids, { bidderName: 'Fã nº 1 (Você)', amount: newBidAmount, timestamp: 'Agora mesmo' }]
            };
        }
        return a;
    }));
    setSelectedAuctionForBidding(null);
  }, [addFanPoints, auctions, setAuctions]);
  
  const handlePlayMedia = useCallback((item: MediaItem) => {
    const platformKey = item.platform.toLowerCase() as keyof typeof connections;
    if (connections[platformKey]) {
      setPlayingMedia(item);
    } else {
      setConnectionFlowState({ step: 'login', platform: item.platform, mediaItem: item });
    }
  }, [connections]);

  const handleRequestConnection = useCallback((platform: MediaPlatform) => {
    const platformKey = platform.toLowerCase() as keyof typeof connections;
    if (!connections[platformKey]) {
        setConnectionFlowState({ step: 'login', platform, mediaItem: null });
    }
  }, [connections]);

  const handleCloseConnectionFlow = useCallback(() => { setConnectionFlowState(null); }, []);
  const handleLoginSuccess = useCallback(() => { setConnectionFlowState(prev => prev ? { ...prev, step: 'consent' } : null); }, []);

  const handleOAuthAllow = useCallback(() => {
    if (!connectionFlowState) return;
    const { platform, mediaItem } = connectionFlowState;
    const platformKey = platform.toLowerCase() as keyof typeof connections;
    setConnections(prev => ({ ...prev, [platformKey]: true }));
    if (platform === MediaPlatform.YOUTUBE) addFanPoints(5, 'Por conectar sua conta do YouTube');
    if (platform === MediaPlatform.SPOTIFY) addFanPoints(5, 'Por conectar sua conta do Spotify');
    handleCloseConnectionFlow();
    if (mediaItem) { setPlayingMedia(mediaItem); }
  }, [addFanPoints, connectionFlowState, handleCloseConnectionFlow]);

  const handleSectionChange = useCallback((section: Section) => {
    if (section === activeSection) {
      if (section === Section.STORE) {
          setStoreSection(StoreSection.HOME);
          setActiveTicketTab('available');
      }
      else if (section === Section.FAN_AREA) setFanAreaSection(FanAreaSection.HOME);
    } else {
      setActiveSection(section);
    }
  }, [activeSection]);

  const handleStoreSectionChange = useCallback((section: StoreSection) => {
    setStoreSection(section);
    setActiveTicketTab('available');
  }, []);

  const handleNavigation = useCallback((section: Section, subSection?: StoreSection | FanAreaSection, itemId?: string) => {
    setActiveSection(section);
    if (section === Section.STORE) {
        if (subSection) { handleStoreSectionChange(subSection as StoreSection); }
        if (itemId) { setStoreViewTargetItemId(itemId); }
    } else if (section === Section.FAN_AREA) {
        if (subSection) {
            setFanAreaSection(subSection as FanAreaSection);
        }
        // If navigating to rewards with a specific item, open its details
        if (subSection === FanAreaSection.REWARDS && itemId) {
            const rewardToView = exclusiveRewards.find(r => r.id === itemId);
            if (rewardToView) {
                setSelectedReward(rewardToView);
            }
        }
    }
  }, [exclusiveRewards, handleStoreSectionChange]);

  const handleToggleTicketAlert = useCallback((purchaseId: string) => {
    setPurchasedTickets(prev => prev.map(t => t.purchaseId === purchaseId ? { ...t, alertSet: true } : t));
    setToastMessage("Alerta criado! Você será notificado sobre o show.");
  }, [setPurchasedTickets]);

  const totalCartItems = useMemo(() => shoppingCart.reduce((sum, item) => sum + item.quantity, 0), [shoppingCart]);

  return (
    <>
      <Header artist={artist} onSwitchArtist={onSwitchArtist} onViewImage={onViewImage} onOpenHelp={() => setHelpVisible(true)} />
      <div className="pb-16">
        <div 
          className="h-40 bg-cover bg-center"
          style={{ backgroundImage: `url(${artist.coverImageUrl})` }}
        ></div>
        <main>
            {/* Performance Refactor: Render all views but only display the active one */}
            <div style={{ display: activeSection === Section.TIMELINE ? 'block' : 'none' }}>
              {isLoadingPosts ? <LoadingSpinner /> : (
                <TimelineView 
                  artist={artist} posts={posts} likedPostIds={likedPostIds} onLikePost={handleLikePost} onVote={handleVote}
                  onNavigate={handleNavigation} onViewImage={onViewImage} onCommentPost={(post) => setSelectedPostForComments(post)}
                />
              )}
            </div>
            <div style={{ display: activeSection === Section.MEDIA ? 'block' : 'none' }}>
              {isLoadingMedia ? <LoadingSpinner /> : (
                <MediaView mediaItems={media} connections={connections} onPlay={handlePlayMedia} onRequestConnection={handleRequestConnection} />
              )}
            </div>
            <div style={{ display: activeSection === Section.STORE ? 'block' : 'none' }}>
              {isLoadingStore ? <LoadingSpinner /> : (
                <StoreView 
                  artist={artist} merch={merch} events={events} auctions={auctions} orders={orders} purchasedTickets={purchasedTickets}
                  storeSection={storeSection} onSectionChange={handleStoreSectionChange} onAddToCart={handleAddToCart}
                  onViewOrderDetails={(order) => setSelectedOrderForTracking(order)} onPlaceBid={(auctionId) => setSelectedAuctionForBidding(auctions.find(a => a.id === auctionId) || null)}
                  onInitiateTicketPurchase={setTicketToPurchase} onToggleTicketAlert={handleToggleTicketAlert}
                  paymentMethod={paymentMethod} onPaymentMethodChange={setPaymentMethod}
                  targetItemId={storeViewTargetItemId} onTargetItemHandled={() => setStoreViewTargetItemId(null)}
                  activeTicketTab={activeTicketTab} onTicketTabChange={setActiveTicketTab}
                />
              )}
            </div>
            <div style={{ display: activeSection === Section.FAN_AREA ? 'block' : 'none' }}>
                {isLoadingProfile ? <LoadingSpinner/> : <FanAreaView 
                    artist={artist} 
                    fanAreaSection={fanAreaSection} 
                    onSectionChange={setFanAreaSection} 
                    leaderboard={leaderboard} 
                    rewards={exclusiveRewards}
                    fanPoints={fanPoints}
                    onViewRewardDetails={(reward) => setSelectedReward(reward)}
                    onOpenPointsInfoModal={() => setIsPointsInfoModalVisible(true)}
                />}
            </div>
             <div style={{ display: activeSection === Section.PROFILE ? 'block' : 'none' }}>
               {isLoadingProfile ? <LoadingSpinner /> : (
                <ProfileView 
                  artist={artist}
                  onEditAddress={() => setAddressModalVisible(true)}
                  onEditPaymentMethod={() => setPaymentMethodModalVisible(true)}
                  onOpenPaymentHistory={() => setPaymentHistoryVisible(true)}
                  onLogout={onLogout}
                />
               )}
            </div>
        </main>
        
        {/* Modals and Players */}
        <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
        <PointsInfoModal isVisible={isPointsInfoModalVisible} onClose={() => setIsPointsInfoModalVisible(false)} />
        
        <AddressModal 
            isVisible={isAddressModalVisible}
            onClose={() => setAddressModalVisible(false)}
        />
        <PaymentMethodModal
            isVisible={isPaymentMethodModalVisible}
            onClose={() => setPaymentMethodModalVisible(false)}
            currentMethod={paymentMethod}
            onSelectMethod={setPaymentMethod}
        />
         <PaymentHistoryModal
            isVisible={isPaymentHistoryVisible}
            onClose={() => setPaymentHistoryVisible(false)}
            history={paymentHistory}
        />

        {pointsModalData && <PointsAwardedModal isVisible={true} points={pointsModalData.points} reason={pointsModalData.reason} onClose={() => setPointsModalData(null)} />}
        {isCheckoutVisible && shoppingCart.length > 0 && <OneClickPurchase items={shoppingCart} onClose={() => setIsCheckoutVisible(false)} onSuccess={handlePurchaseSuccess} paymentMethod={paymentMethod} onUpdateQuantity={handleUpdateCartQuantity} onEditAddress={() => setAddressModalVisible(true)} onEditPaymentMethod={() => setPaymentMethodModalVisible(true)} />}
        {ticketToPurchase && <TicketCheckoutModal 
                                event={ticketToPurchase} 
                                onClose={() => setTicketToPurchase(null)} 
                                onSuccess={handlePurchaseTicketSuccess} 
                                paymentMethod={paymentMethod}
                                onEditAddress={() => setAddressModalVisible(true)}
                                onEditPaymentMethod={() => setPaymentMethodModalVisible(true)}
                             />}
        {isPurchaseSuccessModalVisible && lastPurchaseDetails && <PurchaseSuccessModal isVisible={isPurchaseSuccessModalVisible} onClose={handleClosePurchaseSuccess} onGoToPurchases={() => { handleClosePurchaseSuccess(); setActiveSection(Section.STORE); setStoreSection(StoreSection.MY_PURCHASES); }} onGoToTickets={() => { handleClosePurchaseSuccess(); setActiveSection(Section.STORE); setStoreSection(StoreSection.TICKETS); setActiveTicketTab('my_tickets'); }} isPix={lastPurchaseDetails.isPix} purchaseType={lastPurchaseType} />}
        {selectedPostForComments && <CommentModal post={selectedPostForComments} artist={artist} comments={comments} isLoading={isCommentsLoading} onClose={() => setSelectedPostForComments(null)} onAddComment={handleAddComment} onViewProfileImage={() => onViewImage(artist.profileImageUrl)} />}
        {selectedOrderForTracking && <OrderStatusModal order={selectedOrderForTracking} onClose={() => setSelectedOrderForTracking(null)} />}
        {selectedAuctionForBidding && <AuctionBidModal item={selectedAuctionForBidding} onClose={() => setSelectedAuctionForBidding(null)} onConfirmBid={handleConfirmBid} />}
        {selectedReward && <RewardDetailsModal reward={selectedReward} fanPoints={fanPoints} currentUserRank={leaderboard.find(f => f.isCurrentUser) ? leaderboard.findIndex(f => f.isCurrentUser) + 1 : null} leaderboard={leaderboard} onClose={() => setSelectedReward(null)} />}
        {playingMedia && <MediaPlayer item={playingMedia} onClose={() => setPlayingMedia(null)} />}
        {connectionFlowState?.step === 'login' && (
            <SimulatedLoginModal
                isVisible={true}
                platform={connectionFlowState.platform}
                onClose={handleCloseConnectionFlow}
                onLoginSuccess={handleLoginSuccess}
            />
        )}
        {connectionFlowState?.step === 'consent' && (
            <ConnectAccountModal
                isVisible={true}
                platform={connectionFlowState.platform}
                onDeny={handleCloseConnectionFlow}
                onAllow={handleOAuthAllow}
            />
        )}
        <HelpCenterModal isVisible={isHelpVisible} onClose={() => setHelpVisible(false)} context={helpContext} />
      </div>

      {totalCartItems > 0 && !isCheckoutVisible && activeSection === Section.STORE && <FloatingCartButton itemCount={totalCartItems} onClick={() => setIsCheckoutVisible(true)} />}
      
      <BottomNav activeSection={activeSection} onSectionChange={handleSectionChange} />
    </>
  );
};

export default ArtistPage;