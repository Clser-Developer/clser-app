
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Artist, Post, Section, StoreSection, FanAreaSection, Order, OrderStatus, FanProfile, Comment, AuctionItem, ExclusiveReward, RewardType, Event, MerchItem, MediaItem, MediaPlatform, MediaType, CartItem, PurchasedTicket, PaymentRecord, TicketSelection, MuralPost, FanArtPost, VaquinhaCampaign, TransactionType, PlanType, FanGroup, ExperienceItem, PurchasedExperience } from '../types';
import { getArtistDataRepository } from '../services/artistDataRepository';
import { useBilling } from '../contexts/BillingContext';
import { ArtistFanProvider, useArtistFan } from '../contexts/ArtistFanContext';
import { useArtistSession } from '../contexts/ArtistSessionContext';

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
import AuctionCheckoutModal from './AuctionCheckoutModal';
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
import VaquinhaDetailModal from './VaquinhaDetailModal';
import DonationCheckoutModal from './DonationCheckoutModal';
import ExperienceCheckoutModal from './ExperienceCheckoutModal';
import FloatingCartButton from './FloatingCartButton';

import TimelineView from './views/TimelineView';
import StoreView from './views/StoreView';
import FanAreaView from './views/FanAreaView';
import MediaView from './views/MediaView';
import { useArtistFanEngagement } from '../hooks/useArtistFanEngagement';
import { useArtistMediaConnections } from '../hooks/useArtistMediaConnections';
import { useArtistCommunityPublishing } from '../hooks/useArtistCommunityPublishing';
import {
  ArtistPurchaseSuccessDetails,
  useArtistCommerceHandlers,
} from '../hooks/useArtistCommerceHandlers';

interface ImageViewerDetails {
  url: string;
  caption?: string;
  postId?: string;
  isLiked?: boolean;
  likeCount?: number;
  onLike?: (postId: string) => void;
}

interface ArtistPageProps {
  artist: Artist;
  userScopeId: string;
  onViewImage: (details: ImageViewerDetails) => void;
  updateImageViewer: (updates: Partial<ImageViewerDetails>) => void;
  onLogout: () => void;
  userNickname: string;
  onNicknameChange: (name: string) => void;
  userProfileImageUrl: string;
  onProfileImageChange: (dataUrl: string) => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-8 h-full">
        <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
);

const ArtistPageContent: React.FC<ArtistPageProps> = ({ 
    artist, onViewImage, updateImageViewer, onLogout,
    userNickname, onNicknameChange, userProfileImageUrl, onProfileImageChange,
}) => {
  const {
      fanPoints, setFanPoints,
      likedPostIds, setLikedPostIds,
      commentedPostIds, setCommentedPostIds,
      likedMuralPostIds, setLikedMuralPostIds,
      likedFanArtPostIds, setLikedFanArtPostIds,
      joinedGroupIds, setJoinedGroupIds,
      posts, setPosts,
      merch, setMerch,
      events, setEvents,
      auctions, setAuctions,
      experiences, setExperiences,
      vaquinhaCampaigns, setVaquinhaCampaigns,
      fanGroups, setFanGroups,
      donatedCampaigns, setDonatedCampaigns,
      exclusiveRewards, setExclusiveRewards,
      media, setMedia,
      muralPosts, setMuralPosts,
      fanArtPosts, setFanArtPosts,
  } = useArtistFan();
  const {
      addOrder,
      addPaymentRecord,
      addPurchasedExperience,
      addPurchasedTicket,
      clearCartForArtist,
      getCartForArtist,
      getOrdersForArtist,
      getTicketsForArtist,
      paymentHistory,
      paymentMethod,
      setCartForArtist,
      setPaymentMethod,
      setPurchasedTickets,
  } = useBilling();
  const {
      activeSection,
      activeTicketTab,
      fanAreaSection,
      fanAreaViewTargetItemId,
      setActiveSection,
      setActiveTicketTab,
      setFanAreaSection,
      setFanAreaViewTargetItemId,
      setStoreSection,
      setStoreViewTargetItemId,
      setSwitcherVisible,
      storeSection,
      storeViewTargetItemId,
  } = useArtistSession();
  
  const [leaderboard, setLeaderboard] = useState<FanProfile[]>([]);
  
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isLoadingStore, setIsLoadingStore] = useState(false);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  const [isHelpVisible, setHelpVisible] = useState(false);
  const [pointsModalData, setPointsModalData] = useState<{ points: number; reason: string } | null>(null);
  const [isPointsInfoModalVisible, setIsPointsInfoModalVisible] = useState(false);
  const [selectedReward, setSelectedReward] = useState<ExclusiveReward | null>(null);
  const [selectedVaquinha, setSelectedVaquinha] = useState<VaquinhaCampaign | null>(null);
  const [isCheckoutVisible, setIsCheckoutVisible] = useState(false);
  const [isPurchaseSuccessModalVisible, setIsPurchaseSuccessModalVisible] = useState(false);
  const [lastPurchaseDetails, setLastPurchaseDetails] = useState<ArtistPurchaseSuccessDetails | null>(null);
  const [lastPurchasePoints, setLastPurchasePoints] = useState<number>(0);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null);
  const [selectedPostForComments, setSelectedPostForComments] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [selectedAuctionForBidding, setSelectedAuctionForBidding] = useState<AuctionItem | null>(null);
  const [auctionToCheckout, setAuctionToCheckout] = useState<{ auction: AuctionItem; bidAmount: number } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [ticketsToPurchase, setTicketsToPurchase] = useState<{ event: Event; selections: TicketSelection[] } | null>(null);
  const [experienceToPurchase, setExperienceToPurchase] = useState<ExperienceItem | null>(null);
  const [donationToCheckout, setDonationToCheckout] = useState<{ campaign: VaquinhaCampaign; amount: number } | null>(null);
  const [isAddressModalVisible, setAddressModalVisible] = useState(false);
  const [isPaymentMethodModalVisible, setPaymentMethodModalVisible] = useState(false);
  const [isPaymentHistoryVisible, setPaymentHistoryVisible] = useState(false);
  
  const [playingMedia, setPlayingMedia] = useState<MediaItem | null>(null);

  const scrollSnapshotRef = useRef<{
    position: number;
    section: Section;
    storeSection: StoreSection;
    fanAreaSection: FanAreaSection;
    artistId: string;
  } | null>(null);
  const mainScrollRef = useRef<HTMLElement | null>(null);
  const shoppingCart = useMemo(() => getCartForArtist(artist.id), [artist.id, getCartForArtist]);
  const orders = useMemo(() => getOrdersForArtist(artist.id), [artist.id, getOrdersForArtist]);
  const purchasedTickets = useMemo(() => getTicketsForArtist(artist.id), [artist.id, getTicketsForArtist]);
  const artistDataRepository = useMemo(() => getArtistDataRepository(), []);

  useEffect(() => {
    if (pointsModalData === null) {
      const snapshot = scrollSnapshotRef.current;
      const shouldRestore =
        !!snapshot &&
        snapshot.section === activeSection &&
        snapshot.storeSection === storeSection &&
        snapshot.fanAreaSection === fanAreaSection &&
        snapshot.artistId === artist.id;

      const scrollContainer = mainScrollRef.current;
      if (scrollContainer && shouldRestore && snapshot) {
        requestAnimationFrame(() => {
          scrollContainer.scrollTop = snapshot.position;
        });
      }
      scrollSnapshotRef.current = null;
    }
  }, [activeSection, artist.id, fanAreaSection, pointsModalData, storeSection]);

  const addFanPoints = useCallback((points: number, reason: string) => {
    const scrollContainer = mainScrollRef.current;
    if (scrollContainer) {
      scrollSnapshotRef.current = {
        position: scrollContainer.scrollTop,
        section: activeSection,
        storeSection,
        fanAreaSection,
        artistId: artist.id,
      };
    }
    setFanPoints(prev => prev + points);
    setPointsModalData({ points, reason });
  }, [activeSection, artist.id, fanAreaSection, setFanPoints, storeSection]);

  const {
    connections,
    connectionFlowState,
    handleCloseConnectionFlow,
    handleLoginSuccess,
    handleOAuthAllow,
    handlePlayMedia,
    handleRequestConnection,
  } = useArtistMediaConnections({
    addFanPoints,
    setPlayingMedia,
  });

  useEffect(() => {
    mainScrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [activeSection, storeSection, fanAreaSection, artist.id]);

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

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoadingPosts(true);
      try {
        if (posts.length === 0) {
          const [postsData, fanGroupsData] = await Promise.all([
            artistDataRepository.getPostsForArtist(artist.id),
            artistDataRepository.getFanGroupsForArtist(artist.id),
          ]);
          setPosts(postsData);
          setFanGroups(fanGroupsData);
        }
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      } finally {
        setIsLoadingPosts(false);
      }
    };
    void fetchInitialData();
  }, [artist.id, artistDataRepository, posts.length, setPosts, setFanGroups]);

  useEffect(() => {
    const loadStoreData = async () => {
      if (merch.length === 0 && events.length === 0 && auctions.length === 0 && vaquinhaCampaigns.length === 0 && experiences.length === 0) {
        setIsLoadingStore(true);
        try {
          const [merchData, eventsData, auctionsData, vaquinhaData, experiencesData] = await Promise.all([
            artistDataRepository.getMerchForArtist(artist.id),
            artistDataRepository.getEventsForArtist(artist.id),
            artistDataRepository.getAuctionsForArtist(artist.id),
            artistDataRepository.getVaquinhaCampaignsForArtist(artist.id),
            artistDataRepository.getExperiencesForArtist(artist.id),
          ]);
          setMerch(merchData);
          setEvents(eventsData);
          setAuctions(auctionsData);
          setVaquinhaCampaigns(vaquinhaData);
          setExperiences(experiencesData);
        } catch (error) { console.error("Failed to load store data", error); } 
        finally { setIsLoadingStore(false); }
      }
    };
    const loadMediaData = async () => {
      if (media.length === 0) {
        setIsLoadingMedia(true);
        try {
          const mediaData = await artistDataRepository.getMediaForArtist(artist.id);
          setMedia(mediaData);
        } catch (error) { console.error("Failed to load media data", error); }
        finally { setIsLoadingMedia(false); }
      }
    };
    
    const loadProfileData = async () => {
      if (leaderboard.length > 0 && exclusiveRewards.length > 0 && muralPosts.length > 0 && fanArtPosts.length > 0) return;
    
      setIsLoadingProfile(true);
      try {
          const [rewardsData, leaderboardData, muralData, fanArtData] = await Promise.all([
          exclusiveRewards.length === 0 ? artistDataRepository.getExclusiveRewardsForArtist(artist.id) : Promise.resolve(exclusiveRewards),
          leaderboard.length === 0 ? artistDataRepository.getFanLeaderboard(artist.id, fanPoints) : Promise.resolve(leaderboard),
          muralPosts.length === 0 ? artistDataRepository.getMuralPosts(artist.id) : Promise.resolve(muralPosts),
          fanArtPosts.length === 0 ? artistDataRepository.getFanArtPosts(artist.id) : Promise.resolve(fanArtPosts),
        ]);
        if (exclusiveRewards.length === 0) setExclusiveRewards(rewardsData as ExclusiveReward[]);
        if (leaderboard.length === 0) setLeaderboard(leaderboardData as FanProfile[]);
        if (muralPosts.length === 0) setMuralPosts(muralData as MuralPost[]);
        if (fanArtPosts.length === 0) setFanArtPosts(fanArtData as FanArtPost[]);
      } catch (error) { console.error("Failed to load profile data", error); }
      finally { setIsLoadingProfile(false); }
    };

    if (activeSection === Section.STORE) loadStoreData();
    else if (activeSection === Section.MEDIA) loadMediaData();
    else if (activeSection === Section.PROFILE || activeSection === Section.FAN_AREA) {
        loadProfileData();
    }
  }, [activeSection, artist.id, artistDataRepository, fanPoints, merch.length, events.length, auctions.length, experiences.length, vaquinhaCampaigns.length, media.length, exclusiveRewards.length, leaderboard.length, muralPosts.length, fanArtPosts.length, setMerch, setEvents, setAuctions, setExperiences, setVaquinhaCampaigns, setMedia, setExclusiveRewards, setLeaderboard, setMuralPosts, setFanArtPosts]);


  useEffect(() => {
      if (!selectedPostForComments) return;
      const fetchComments = async () => {
          setIsCommentsLoading(true);
          try {
              setComments(await artistDataRepository.getCommentsForPost(selectedPostForComments.id));
          } catch (error) { console.error("Failed to fetch comments:", error); } 
          finally { setIsCommentsLoading(false); }
      };
      void fetchComments();
  }, [artistDataRepository, selectedPostForComments?.id]);
  
  const {
    handleLikePost,
    handleLikeMuralPost,
    handleLikeFanArtPost,
    handleAddComment,
    handleVote,
    handleJoinGroup,
  } = useArtistFanEngagement({
    artistId: artist.id,
    userNickname,
    userProfileImageUrl,
    posts,
    muralPosts,
    fanArtPosts,
    likedPostIds,
    likedMuralPostIds,
    likedFanArtPostIds,
    commentedPostIds,
    joinedGroupIds,
    addFanPoints,
    setFanPoints,
    setPosts,
    setMuralPosts,
    setFanArtPosts,
    setComments,
    setLikedPostIds,
    setLikedMuralPostIds,
    setLikedFanArtPostIds,
    setCommentedPostIds,
    setFanGroups,
    setJoinedGroupIds,
    updateImageViewer,
  });

  const { handleAddFanArtPost, handleAddMuralPost } = useArtistCommunityPublishing({
    addFanPoints,
    artistId: artist.id,
    setFanArtPosts,
    setMuralPosts,
    setToastMessage,
    userNickname,
    userProfileImageUrl,
  });

  const {
    handleAddToCart,
    handleAuctionPurchaseSuccess,
    handleDonationSuccess,
    handleExperiencePurchaseSuccess,
    handlePurchaseSuccess,
    handlePurchaseTicketSuccess,
    handleUpdateCartQuantity,
  } = useArtistCommerceHandlers({
    addFanPoints,
    addOrder,
    addPaymentRecord,
    addPurchasedExperience,
    addPurchasedTicket,
    artistId: artist.id,
    artistName: artist.name,
    clearCartForArtist,
    fanGroups,
    paymentMethod,
    setAuctions,
    setAuctionToCheckout,
    setCartForArtist,
    setDonationToCheckout,
    setDonatedCampaigns,
    setExperienceToPurchase,
    setExperiences,
    setIsCheckoutVisible,
    setIsPurchaseSuccessModalVisible,
    setLastPurchaseDetails,
    setLastPurchasePoints,
    setTicketsToPurchase,
    setToastMessage,
    setVaquinhaCampaigns,
    shoppingCart,
    userNickname,
  });


  const handleClosePurchaseSuccess = useCallback(() => {
    setIsPurchaseSuccessModalVisible(false);
    if (lastPurchasePoints > 0) {
        let reason = 'Por sua compra!';
        if (lastPurchaseDetails?.type === 'ticket') reason = 'Pela compra do ingresso!';
        if (lastPurchaseDetails?.type === 'merch') reason = 'Por sua compra na loja!';
        if (lastPurchaseDetails?.type === 'experience') reason = 'Por adquirir uma experiência!';
        
        addFanPoints(lastPurchasePoints, reason);
        setLastPurchasePoints(0);
    }
  }, [addFanPoints, lastPurchasePoints, lastPurchaseDetails]);

  const handleInitiateAuctionCheckout = useCallback((auction: AuctionItem) => {
    if (new Date(auction.endTime).getTime() < Date.now()) {
      setSelectedAuctionForBidding(null);
      setToastMessage('Este leilão já encerrou.');
      return;
    }
    const nextBidAmount = auction.currentBid + auction.bidIncrement;
    setSelectedAuctionForBidding(null);
    setAuctionToCheckout({ auction, bidAmount: nextBidAmount });
  }, []);


  const handleInitiateDonationCheckout = useCallback((campaign: VaquinhaCampaign, amount: number) => {
    setSelectedVaquinha(null);
    setDonationToCheckout({ campaign, amount });
  }, []);

  const handleSectionChange = useCallback((section: Section) => {
    mainScrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });

    if (section === activeSection) {
      if (section === Section.STORE) {
          setStoreSection(StoreSection.HOME);
          setActiveTicketTab('available');
      }
      else if (section === Section.FAN_AREA) setFanAreaSection(FanAreaSection.HOME);
      requestAnimationFrame(() => {
        mainScrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
      });
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
        if (itemId) {
            setFanAreaViewTargetItemId(itemId);
        }
        if (subSection === FanAreaSection.REWARDS && itemId) {
            const rewardToView = exclusiveRewards.find(r => r.id === itemId);
            if (rewardToView) {
                setSelectedReward(rewardToView);
            }
        }
    }
  }, [exclusiveRewards, handleStoreSectionChange]);

  const handleGoToGroups = useCallback(() => {
    handleClosePurchaseSuccess();
    setActiveSection(Section.FAN_AREA);
    setFanAreaSection(FanAreaSection.GROUPS);
  }, [handleClosePurchaseSuccess]);

  const handleToggleTicketAlert = useCallback((purchaseId: string) => {
    setPurchasedTickets(prev => prev.map(t => t.purchaseId === purchaseId ? { ...t, alertSet: true } : t));
    setToastMessage("Alerta criado! Você será notificado sobre o show.");
  }, [setPurchasedTickets]);

  const handleViewImageWithLike = useCallback((details: Omit<ImageViewerDetails, 'onLike'>) => {
      onViewImage({
          ...details,
          onLike: handleLikeMuralPost
      });
  }, [onViewImage, handleLikeMuralPost]);

  const handleViewFanArtImageWithLike = useCallback((details: Omit<ImageViewerDetails, 'onLike'>) => {
      onViewImage({
          ...details,
          onLike: handleLikeFanArtPost
      });
  }, [onViewImage, handleLikeFanArtPost]);

  const handleNavigateToFanArea = useCallback(() => {
    setActiveSection(Section.FAN_AREA);
    setFanAreaSection(FanAreaSection.LEADERBOARD);
  }, []);

  const totalCartItems = useMemo(() => shoppingCart.reduce((sum, item) => sum + item.quantity, 0), [shoppingCart]);

  return (
    <div className="safe-screen relative bg-gray-50 overflow-hidden flex flex-col">
      <Header artist={artist} onSwitchArtist={() => setSwitcherVisible(true)} onViewImage={onViewImage} onOpenHelp={() => setHelpVisible(true)} />
      
      <main ref={mainScrollRef} className="safe-bottom-nav-space flex-1 overflow-y-auto no-scrollbar relative px-0">
        <div 
          className="h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${artist.coverImageUrl})` }}
        >
          <div className="w-full h-full bg-gradient-to-t from-gray-50 to-transparent"></div>
        </div>

        <div className="-mt-6 relative">
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
                artist={artist} merch={merch} events={events} auctions={auctions} experiences={experiences}
                orders={orders} purchasedTickets={purchasedTickets}
                vaquinhaCampaigns={vaquinhaCampaigns}
                donatedCampaigns={donatedCampaigns}
                storeSection={storeSection} onSectionChange={handleStoreSectionChange}
                onAddToCart={handleAddToCart}
                onViewOrderDetails={(order) => setSelectedOrderForTracking(order)} onPlaceBid={(auctionId) => setSelectedAuctionForBidding(auctions.find(a => a.id === auctionId) || null)}
                onSelectVaquinha={setSelectedVaquinha}
                onInitiateTicketPurchase={setTicketsToPurchase}
                onInitiateExperiencePurchase={setExperienceToPurchase}
                onToggleTicketAlert={handleToggleTicketAlert}
                paymentMethod={paymentMethod}
                onPaymentMethodChange={setPaymentMethod}
                targetItemId={storeViewTargetItemId} onTargetItemHandled={() => setStoreViewTargetItemId(null)}
                activeTicketTab={activeTicketTab} onTicketTabChange={setActiveTicketTab}
                onShowToast={setToastMessage}
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
                  muralPosts={muralPosts}
                  fanGroups={fanGroups}
                  joinedGroupIds={joinedGroupIds}
                  likedMuralPostIds={likedMuralPostIds}
                  onLikeMuralPost={handleLikeMuralPost}
                  onAddMuralPost={handleAddMuralPost}
                  fanArtPosts={fanArtPosts}
                  likedFanArtPostIds={likedFanArtPostIds}
                  onLikeFanArtPost={handleLikeFanArtPost}
                  onAddFanArtPost={handleAddFanArtPost}
                  onViewRewardDetails={(reward) => setSelectedReward(reward)}
                  onOpenPointsInfoModal={() => setIsPointsInfoModalVisible(true)}
                  onViewMuralImage={handleViewImageWithLike}
                  onViewFanArtImage={handleViewFanArtImageWithLike}
                  onViewGenericImage={onViewImage}
                  onJoinGroup={handleJoinGroup}
                  posts={posts}
                  targetItemId={fanAreaViewTargetItemId}
                  onTargetItemHandled={() => setFanAreaViewTargetItemId(null)}
                  likedPostIds={likedPostIds}
                  onLikePost={handleLikePost}
                  onCommentPost={(post) => setSelectedPostForComments(post)}
                  onVote={handleVote}
                  onNavigate={handleNavigation}
              />}
          </div>
           <div style={{ display: activeSection === Section.PROFILE ? 'block' : 'none' }}>
             {isLoadingProfile ? <LoadingSpinner /> : (
              <ProfileView 
                artist={artist}
                fanPoints={fanPoints}
                userNickname={userNickname}
                userProfileImageUrl={userProfileImageUrl}
                onProfileImageChange={onProfileImageChange}
                onNavigateToFanArea={handleNavigateToFanArea}
                onEditAddress={() => setAddressModalVisible(true)}
                onEditPaymentMethod={() => setPaymentMethodModalVisible(true)}
                onOpenPaymentHistory={() => setPaymentHistoryVisible(true)}
                onLogout={onLogout}
                onViewImage={(url) => onViewImage({ url })}
              />
             )}
          </div>
        </div>
      </main>
        
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
      {ticketsToPurchase && <TicketCheckoutModal 
                              purchaseDetails={ticketsToPurchase} 
                              onClose={() => setTicketsToPurchase(null)} 
                              onSuccess={handlePurchaseTicketSuccess} 
                              paymentMethod={paymentMethod}
                              onEditAddress={() => setAddressModalVisible(true)}
                              onEditPaymentMethod={() => setPaymentMethodModalVisible(true)}
                            />}
      {experienceToPurchase && <ExperienceCheckoutModal
                                  experience={experienceToPurchase}
                                  onClose={() => setExperienceToPurchase(null)}
                                  onSuccess={handleExperiencePurchaseSuccess}
                                  paymentMethod={paymentMethod}
                                  onEditPaymentMethod={() => setPaymentMethodModalVisible(true)}
                              />}
      {isPurchaseSuccessModalVisible && lastPurchaseDetails && <PurchaseSuccessModal isVisible={isPurchaseSuccessModalVisible} details={lastPurchaseDetails} onClose={handleClosePurchaseSuccess} onGoToPurchases={() => { handleClosePurchaseSuccess(); setActiveSection(Section.STORE); setStoreSection(StoreSection.MY_PURCHASES); }} onGoToTickets={() => { handleClosePurchaseSuccess(); setActiveSection(Section.STORE); setStoreSection(StoreSection.TICKETS); setActiveTicketTab('my_tickets'); }} onGoToGroups={handleGoToGroups} />}
      {selectedPostForComments && <CommentModal post={selectedPostForComments} artist={artist} userProfileImageUrl={userProfileImageUrl} comments={comments} isLoading={isCommentsLoading} onClose={() => setSelectedPostForComments(null)} onAddComment={handleAddComment} onViewProfileImage={() => onViewImage({ url: artist.profileImageUrl })} />}
      {selectedOrderForTracking && <OrderStatusModal order={selectedOrderForTracking} onClose={() => setSelectedOrderForTracking(null)} />}
      {selectedAuctionForBidding && <AuctionBidModal item={selectedAuctionForBidding} onClose={() => setSelectedAuctionForBidding(null)} onConfirmBid={handleInitiateAuctionCheckout} />}
      {auctionToCheckout && <AuctionCheckoutModal checkoutDetails={auctionToCheckout} onClose={() => setAuctionToCheckout(null)} onSuccess={handleAuctionPurchaseSuccess} paymentMethod={paymentMethod} onEditPaymentMethod={() => setPaymentMethodModalVisible(true)} />}
      {selectedReward && <RewardDetailsModal reward={selectedReward} fanPoints={fanPoints} currentUserRank={leaderboard.find(f => f.isCurrentUser) ? leaderboard.findIndex(f => f.isCurrentUser) + 1 : null} leaderboard={leaderboard} onClose={() => setSelectedReward(null)} />}
      <VaquinhaDetailModal 
        campaign={selectedVaquinha}
        onClose={() => setSelectedVaquinha(null)}
        onInitiateCheckout={handleInitiateDonationCheckout}
      />
      <DonationCheckoutModal
        checkoutDetails={donationToCheckout}
        onClose={() => setDonationToCheckout(null)}
        onSuccess={handleDonationSuccess}
        paymentMethod={paymentMethod}
        onEditPaymentMethod={() => setPaymentMethodModalVisible(true)}
      />
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

      <div className="safe-bottom-pad fixed bottom-0 left-0 right-0 z-[55] pointer-events-none px-3">
        <div className="relative h-0">
          {totalCartItems > 0 && !isCheckoutVisible && activeSection === Section.STORE && (
            <FloatingCartButton itemCount={totalCartItems} onClick={() => setIsCheckoutVisible(true)} />
          )}
        </div>
        <BottomNav activeSection={activeSection} onSectionChange={handleSectionChange} />
      </div>
    </div>
  );
};

const ArtistPage: React.FC<ArtistPageProps> = (props) => {
  const { artist, userScopeId } = props;

  return (
    <ArtistFanProvider artistId={artist.id} initialFanPoints={artist.fanPoints || 0} userScopeId={userScopeId}>
      <ArtistPageContent {...props} />
    </ArtistFanProvider>
  );
};

export default ArtistPage;
