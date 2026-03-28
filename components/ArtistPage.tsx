
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Artist, Post, Section, StoreSection, FanAreaSection, Order, OrderStatus, FanProfile, Comment, AuctionItem, ExclusiveReward, RewardType, Event, MerchItem, MediaItem, MediaPlatform, MediaType, CartItem, PurchasedTicket, PaymentRecord, TicketSelection, MuralPost, FanArtPost, VaquinhaCampaign, TransactionType, PlanType, FanGroup, ExperienceItem, PurchasedExperience } from '../types';
import { getArtistDataRepository } from '../services/artistDataRepository';
import { useBilling } from '../contexts/BillingContext';
import { ArtistFanProvider, useArtistFan } from '../contexts/ArtistFanContext';
import { useArtistSession } from '../contexts/ArtistSessionContext';

import Header from './Header';
import BottomNav from './BottomNav';
import FloatingCartButton from './FloatingCartButton';
import ArtistPageOverlays from './artist/ArtistPageOverlays';
import ArtistPageSections from './artist/ArtistPageSections';
import { useArtistFanEngagement } from '../hooks/useArtistFanEngagement';
import { useArtistMediaConnections } from '../hooks/useArtistMediaConnections';
import { useArtistCommunityPublishing } from '../hooks/useArtistCommunityPublishing';
import { useArtistDataLoading } from '../hooks/useArtistDataLoading';
import { useArtistNavigation } from '../hooks/useArtistNavigation';
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
  
  const {
    isCommentsLoading,
    isLoadingMedia,
    isLoadingPosts,
    isLoadingProfile,
    isLoadingStore,
  } = useArtistDataLoading({
    artistId: artist.id,
    activeSection,
    fanPoints,
    selectedPostForComments,
    artistDataRepository,
    posts,
    merch,
    events,
    auctions,
    experiences,
    vaquinhaCampaigns,
    media,
    exclusiveRewards,
    leaderboard,
    muralPosts,
    fanArtPosts,
    setPosts,
    setFanGroups,
    setMerch,
    setEvents,
    setAuctions,
    setExperiences,
    setVaquinhaCampaigns,
    setMedia,
    setExclusiveRewards,
    setLeaderboard,
    setMuralPosts,
    setFanArtPosts,
    setComments,
  });
  
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

  const {
    handleGoToGroups,
    handleNavigateToFanArea,
    handleNavigation,
    handleSectionChange,
    handleStoreSectionChange,
  } = useArtistNavigation({
    activeSection,
    storeSection,
    setActiveSection,
    setStoreSection,
    setFanAreaSection,
    setActiveTicketTab,
    setStoreViewTargetItemId,
    setFanAreaViewTargetItemId,
    setSelectedReward,
    mainScrollRef,
    exclusiveRewards,
    handleClosePurchaseSuccess,
  });

  const handleGoToPurchases = useCallback(() => {
    handleClosePurchaseSuccess();
    setActiveSection(Section.STORE);
    setStoreSection(StoreSection.MY_PURCHASES);
  }, [handleClosePurchaseSuccess, setActiveSection, setStoreSection]);

  const handleGoToTickets = useCallback(() => {
    handleClosePurchaseSuccess();
    setActiveSection(Section.STORE);
    setStoreSection(StoreSection.TICKETS);
    setActiveTicketTab('my_tickets');
  }, [handleClosePurchaseSuccess, setActiveSection, setActiveTicketTab, setStoreSection]);

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

        <ArtistPageSections
          activeSection={activeSection}
          activeTicketTab={activeTicketTab}
          artist={artist}
          auctions={auctions}
          connections={connections}
          donatedCampaigns={donatedCampaigns}
          events={events}
          exclusiveRewards={exclusiveRewards}
          experiences={experiences}
          fanAreaSection={fanAreaSection}
          fanAreaViewTargetItemId={fanAreaViewTargetItemId}
          fanArtPosts={fanArtPosts}
          fanGroups={fanGroups}
          fanPoints={fanPoints}
          isLoadingMedia={isLoadingMedia}
          isLoadingPosts={isLoadingPosts}
          isLoadingProfile={isLoadingProfile}
          isLoadingStore={isLoadingStore}
          joinedGroupIds={joinedGroupIds}
          likedFanArtPostIds={likedFanArtPostIds}
          likedMuralPostIds={likedMuralPostIds}
          likedPostIds={likedPostIds}
          leaderboard={leaderboard}
          media={media}
          merch={merch}
          muralPosts={muralPosts}
          orders={orders}
          paymentMethod={paymentMethod}
          posts={posts}
          purchasedTickets={purchasedTickets}
          storeSection={storeSection}
          storeViewTargetItemId={storeViewTargetItemId}
          userNickname={userNickname}
          userProfileImageUrl={userProfileImageUrl}
          vaquinhaCampaigns={vaquinhaCampaigns}
          onAddFanArtPost={handleAddFanArtPost}
          onAddMuralPost={handleAddMuralPost}
          onAddToCart={handleAddToCart}
          onCommentPost={(post) => setSelectedPostForComments(post)}
          onEditAddress={() => setAddressModalVisible(true)}
          onEditPaymentMethod={() => setPaymentMethodModalVisible(true)}
          onInitiateExperiencePurchase={setExperienceToPurchase}
          onInitiateTicketPurchase={setTicketsToPurchase}
          onJoinGroup={handleJoinGroup}
          onLikeFanArtPost={handleLikeFanArtPost}
          onLikeMuralPost={handleLikeMuralPost}
          onLikePost={handleLikePost}
          onLogout={onLogout}
          onNavigate={handleNavigation}
          onNavigateToFanArea={handleNavigateToFanArea}
          onOpenPaymentHistory={() => setPaymentHistoryVisible(true)}
          onOpenPointsInfoModal={() => setIsPointsInfoModalVisible(true)}
          onPlaceBid={(auctionId) => setSelectedAuctionForBidding(auctions.find((auction) => auction.id === auctionId) || null)}
          onPlayMedia={handlePlayMedia}
          onPaymentMethodChange={setPaymentMethod}
          onProfileImageChange={onProfileImageChange}
          onRequestConnection={handleRequestConnection}
          onSectionChangeFanArea={setFanAreaSection}
          onSelectVaquinha={setSelectedVaquinha}
          onShowToast={setToastMessage}
          onStoreSectionChange={handleStoreSectionChange}
          onStoreTargetItemHandled={() => setStoreViewTargetItemId(null)}
          onTargetFanAreaItemHandled={() => setFanAreaViewTargetItemId(null)}
          onTicketTabChange={setActiveTicketTab}
          onToggleTicketAlert={handleToggleTicketAlert}
          onViewFanArtImage={handleViewFanArtImageWithLike}
          onViewGenericImage={onViewImage}
          onViewImage={onViewImage}
          onViewMuralImage={handleViewImageWithLike}
          onViewOrderDetails={setSelectedOrderForTracking}
          onViewRewardDetails={setSelectedReward}
          onVote={handleVote}
        />
      </main>
        
      <ArtistPageOverlays
        artist={artist}
        auctionToCheckout={auctionToCheckout}
        comments={comments}
        connectionFlowState={connectionFlowState}
        donationToCheckout={donationToCheckout}
        experienceToPurchase={experienceToPurchase}
        fanPoints={fanPoints}
        helpContext={helpContext}
        isAddressModalVisible={isAddressModalVisible}
        isCheckoutVisible={isCheckoutVisible}
        isCommentsLoading={isCommentsLoading}
        isHelpVisible={isHelpVisible}
        isPaymentHistoryVisible={isPaymentHistoryVisible}
        isPaymentMethodModalVisible={isPaymentMethodModalVisible}
        isPointsInfoModalVisible={isPointsInfoModalVisible}
        isPurchaseSuccessModalVisible={isPurchaseSuccessModalVisible}
        lastPurchaseDetails={lastPurchaseDetails}
        leaderboard={leaderboard}
        paymentHistory={paymentHistory}
        paymentMethod={paymentMethod}
        playingMedia={playingMedia}
        pointsModalData={pointsModalData}
        selectedAuctionForBidding={selectedAuctionForBidding}
        selectedOrderForTracking={selectedOrderForTracking}
        selectedPostForComments={selectedPostForComments}
        selectedReward={selectedReward}
        selectedVaquinha={selectedVaquinha}
        shoppingCart={shoppingCart}
        ticketsToPurchase={ticketsToPurchase}
        toastMessage={toastMessage}
        userProfileImageUrl={userProfileImageUrl}
        onAddComment={handleAddComment}
        onAuctionPurchaseSuccess={handleAuctionPurchaseSuccess}
        onCheckoutPurchaseSuccess={handlePurchaseSuccess}
        onCloseAddressModal={() => setAddressModalVisible(false)}
        onCloseAuctionBidModal={() => setSelectedAuctionForBidding(null)}
        onCloseAuctionCheckoutModal={() => setAuctionToCheckout(null)}
        onCloseCheckout={() => setIsCheckoutVisible(false)}
        onCloseCommentModal={() => setSelectedPostForComments(null)}
        onCloseConnectionFlow={handleCloseConnectionFlow}
        onCloseDonationCheckout={() => setDonationToCheckout(null)}
        onCloseExperienceCheckout={() => setExperienceToPurchase(null)}
        onCloseHelp={() => setHelpVisible(false)}
        onCloseMediaPlayer={() => setPlayingMedia(null)}
        onCloseOrderTracking={() => setSelectedOrderForTracking(null)}
        onClosePaymentHistoryModal={() => setPaymentHistoryVisible(false)}
        onClosePaymentMethodModal={() => setPaymentMethodModalVisible(false)}
        onClosePointsInfoModal={() => setIsPointsInfoModalVisible(false)}
        onClosePointsModal={() => setPointsModalData(null)}
        onClosePurchaseSuccess={handleClosePurchaseSuccess}
        onCloseRewardModal={() => setSelectedReward(null)}
        onCloseTicketCheckout={() => setTicketsToPurchase(null)}
        onCloseVaquinhaDetail={() => setSelectedVaquinha(null)}
        onConfirmBid={handleInitiateAuctionCheckout}
        onDismissToast={() => setToastMessage(null)}
        onDonationSuccess={handleDonationSuccess}
        onEditAddress={() => setAddressModalVisible(true)}
        onEditPaymentMethod={() => setPaymentMethodModalVisible(true)}
        onExperiencePurchaseSuccess={handleExperiencePurchaseSuccess}
        onGoToGroups={handleGoToGroups}
        onGoToPurchases={handleGoToPurchases}
        onGoToTickets={handleGoToTickets}
        onInitiateDonationCheckout={handleInitiateDonationCheckout}
        onLoginSuccess={handleLoginSuccess}
        onOAuthAllow={handleOAuthAllow}
        onSelectPaymentMethod={setPaymentMethod}
        onTicketPurchaseSuccess={handlePurchaseTicketSuccess}
        onUpdateCartQuantity={handleUpdateCartQuantity}
        onViewArtistProfileImage={() => onViewImage({ url: artist.profileImageUrl })}
      />

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
