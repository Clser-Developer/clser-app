
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Artist, Post, Section, StoreSection, FanAreaSection, Order, OrderStatus, FanProfile, Comment, AuctionItem, ExclusiveReward, RewardType, Event, MerchItem, MediaItem, MediaPlatform, MediaType, CartItem, PurchasedTicket, PaymentRecord, TicketSelection, MuralPost, FanArtPost, VaquinhaCampaign, TransactionType, PlanType, FanGroup, ExperienceItem, PurchasedExperience } from '../types';
import { getPostsForArtist, getMerchForArtist, getEventsForArtist, getFanLeaderboard, getCommentsForPost, getAuctionsForArtist, getExclusiveRewardsForArtist, getMediaForArtist, getMuralPosts, getFanArtPosts, getVaquinhaCampaignsForArtist, getFanGroupsForArtist, getExperiencesForArtist } from '../services/mockApiService';
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

interface ImageViewerDetails {
  url: string;
  caption?: string;
  postId?: string;
  isLiked?: boolean;
  likeCount?: number;
  onLike?: (postId: string) => void;
}

interface PurchaseSuccessDetails {
    isPix: boolean;
    type: 'merch' | 'ticket' | 'experience';
    event?: Event;
    experience?: ExperienceItem;
    group?: FanGroup;
}

interface ArtistPageProps {
  artist: Artist;
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
  const [lastPurchaseDetails, setLastPurchaseDetails] = useState<PurchaseSuccessDetails | null>(null);
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
  const [connections, setConnections] = useState({ youtube: false, spotify: false });
  const [connectionFlowState, setConnectionFlowState] = useState<{
    step: 'login' | 'consent';
    platform: MediaPlatform;
    mediaItem: MediaItem | null;
  } | null>(null);

  const scrollPositionRef = useRef(0);
  const mainScrollRef = useRef<HTMLElement | null>(null);
  const shoppingCart = useMemo(() => getCartForArtist(artist.id), [artist.id, getCartForArtist]);
  const orders = useMemo(() => getOrdersForArtist(artist.id), [artist.id, getOrdersForArtist]);
  const purchasedTickets = useMemo(() => getTicketsForArtist(artist.id), [artist.id, getTicketsForArtist]);

  useEffect(() => {
    if (pointsModalData === null) {
      const scrollContainer = mainScrollRef.current;
      if (scrollContainer) {
        requestAnimationFrame(() => {
          scrollContainer.scrollTop = scrollPositionRef.current;
        });
      }
    }
  }, [pointsModalData]);

  const addFanPoints = useCallback((points: number, reason: string) => {
    const scrollContainer = mainScrollRef.current;
    if (scrollContainer) {
      scrollPositionRef.current = scrollContainer.scrollTop;
    }
    setFanPoints(prev => prev + points);
    setPointsModalData({ points, reason });
  }, [setFanPoints]);

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
            getPostsForArtist(artist.id),
            getFanGroupsForArtist(artist.id),
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
    fetchInitialData();
  }, [artist.id, posts.length, setPosts, setFanGroups]);

  useEffect(() => {
    const loadStoreData = async () => {
      if (merch.length === 0 && events.length === 0 && auctions.length === 0 && vaquinhaCampaigns.length === 0 && experiences.length === 0) {
        setIsLoadingStore(true);
        try {
          const [merchData, eventsData, auctionsData, vaquinhaData, experiencesData] = await Promise.all([
            getMerchForArtist(artist.id),
            getEventsForArtist(artist.id),
            getAuctionsForArtist(artist.id),
            getVaquinhaCampaignsForArtist(artist.id),
            getExperiencesForArtist(artist.id),
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
          const mediaData = await getMediaForArtist(artist.id);
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
          exclusiveRewards.length === 0 ? getExclusiveRewardsForArtist(artist.id) : Promise.resolve(exclusiveRewards),
          leaderboard.length === 0 ? getFanLeaderboard(artist.id, fanPoints) : Promise.resolve(leaderboard),
          muralPosts.length === 0 ? getMuralPosts(artist.id) : Promise.resolve(muralPosts),
          fanArtPosts.length === 0 ? getFanArtPosts(artist.id) : Promise.resolve(fanArtPosts),
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
  }, [activeSection, artist.id, fanPoints, merch.length, events.length, auctions.length, experiences.length, vaquinhaCampaigns.length, media.length, exclusiveRewards.length, leaderboard.length, muralPosts.length, fanArtPosts.length, setMerch, setEvents, setAuctions, setExperiences, setVaquinhaCampaigns, setMedia, setExclusiveRewards, setLeaderboard, setMuralPosts, setFanArtPosts]);


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

  const handleLikeMuralPost = useCallback((postId: string) => {
    const isAlreadyLiked = likedMuralPostIds.has(postId);
    const newLikedMuralPostIds = new Set(likedMuralPostIds);
    
    let newLikeCount = 0;
    
    const updatedMuralPosts = muralPosts.map(p => {
        if (p.id === postId) {
            const updatedPost = { ...p, likes: isAlreadyLiked ? p.likes - 1 : p.likes + 1 };
            newLikeCount = updatedPost.likes;
            return updatedPost;
        }
        return p;
    });

    if (isAlreadyLiked) {
      newLikedMuralPostIds.delete(postId);
      setFanPoints(prev => prev - 5);
    } else {
      newLikedMuralPostIds.add(postId);
      addFanPoints(5, 'Por curtir uma foto no mural!');
    }
    
    setMuralPosts(updatedMuralPosts);
    setLikedMuralPostIds(newLikedMuralPostIds);

    updateImageViewer({
        isLiked: !isAlreadyLiked,
        likeCount: newLikeCount,
    });

  }, [addFanPoints, likedMuralPostIds, muralPosts, setLikedMuralPostIds, setFanPoints, setMuralPosts, updateImageViewer]);

  const handleLikeFanArtPost = useCallback((postId: string) => {
    const isAlreadyLiked = likedFanArtPostIds.has(postId);
    const newLikedFanArtPostIds = new Set(likedFanArtPostIds);
    
    let newLikeCount = 0;
    
    const updatedFanArtPosts = fanArtPosts.map(p => {
        if (p.id === postId) {
            const updatedPost = { ...p, likes: isAlreadyLiked ? p.likes - 1 : p.likes + 1 };
            newLikeCount = updatedPost.likes;
            return updatedPost;
        }
        return p;
    });

    if (isAlreadyLiked) {
      newLikedFanArtPostIds.delete(postId);
      setFanPoints(prev => prev - 5);
    } else {
      newLikedFanArtPostIds.add(postId);
      addFanPoints(5, 'Por curtir uma arte!');
    }
    
    setFanArtPosts(updatedFanArtPosts);
    setLikedFanArtPostIds(newLikedFanArtPostIds);

    updateImageViewer({
        isLiked: !isAlreadyLiked,
        likeCount: newLikeCount,
    });
  }, [addFanPoints, fanArtPosts, likedFanArtPostIds, setFanArtPosts, setLikedFanArtPostIds, setFanPoints, updateImageViewer]);

  const handleAddComment = useCallback((postId: string, commentText: string) => {
    if (!commentedPostIds.has(postId)) {
      addFanPoints(10, 'Por comentar em um post!');
      setCommentedPostIds(prev => new Set(prev).add(postId));
    }
    const newComment: Comment = {
      id: `c${Date.now()}`, postId, authorName: userNickname,
      authorImageUrl: userProfileImageUrl, text: commentText,
      timestamp: 'Agora mesmo', isCurrentUser: true,
    };
    setComments(prev => [...prev, newComment]);
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: p.comments + 1 } : p));
  }, [addFanPoints, commentedPostIds, setCommentedPostIds, setPosts, userNickname, userProfileImageUrl]);
  
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
    setCartForArtist(artist.id, prev => {
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
  }, [artist.id, setCartForArtist]);

  const handleUpdateCartQuantity = useCallback((itemId: string, newQuantity: number) => {
    setCartForArtist(artist.id, prev => newQuantity <= 0 ? prev.filter(item => item.id !== itemId) : prev.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item));
  }, [artist.id, setCartForArtist]);
  
  const handlePurchaseSuccess = useCallback((purchaseDetails: { total: number; shippingCost: number; paymentMethod: 'credit-card' | 'pix' }) => {
    const pointsEarned = shoppingCart.reduce((total, item) => total + item.quantity, 0) * 50;
    setLastPurchasePoints(pointsEarned);
    
    const newOrder: Order = {
        id: `SF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`, date: new Date().toLocaleDateString('pt-BR'),
        artistId: artist.id,
        status: OrderStatus.PROCESSING, items: [...shoppingCart], total: purchaseDetails.total, shippingCost: purchaseDetails.shippingCost,
    };
    addOrder(newOrder);

    const newPaymentRecord: PaymentRecord = {
        id: `PAY-${newOrder.id}`,
        artistId: artist.id,
        date: newOrder.date,
        type: TransactionType.MERCH,
        title: `Pedido #${newOrder.id} (${artist.name})`,
        amount: newOrder.total,
        status: 'Pago',
        invoiceUrl: '#',
        paymentMethod: purchaseDetails.paymentMethod === 'credit-card' ? 'Mastercard **** 1234' : 'Pix',
        items: newOrder.items.map(item => ({
            description: `${item.quantity}x ${item.name}`,
            amount: item.price * item.quantity
        }))
    };
    addPaymentRecord(newPaymentRecord);

    setLastPurchaseDetails({ isPix: purchaseDetails.paymentMethod === 'pix', type: 'merch' });
    clearCartForArtist(artist.id);
    setIsCheckoutVisible(false);
    setIsPurchaseSuccessModalVisible(true);
  }, [shoppingCart, artist.id, artist.name, addOrder, addPaymentRecord, clearCartForArtist]);

   const handlePurchaseTicketSuccess = useCallback((purchaseDetails: { event: Event, selections: TicketSelection[] }) => {
    const pointsEarned = purchaseDetails.selections.reduce((acc, s) => acc + s.quantity, 0) * 100;
    const newTicket: PurchasedTicket = {
      ...purchaseDetails.event,
      purchaseId: `TKT-${Date.now()}`,
      alertSet: false,
    };
    addPurchasedTicket(newTicket);

    const totalAmount = purchaseDetails.selections.reduce((acc, s) => acc + s.quantity * s.tier.price, 0);
    const newPaymentRecord: PaymentRecord = {
        id: `PAY-${newTicket.purchaseId}`,
        artistId: artist.id,
        date: new Date().toLocaleDateString('pt-BR'),
        type: TransactionType.TICKET,
        title: `Ingresso: ${purchaseDetails.event.name}`,
        amount: totalAmount,
        status: 'Pago',
        invoiceUrl: '#',
        paymentMethod: paymentMethod === 'credit-card' ? 'Mastercard **** 1234' : 'Pix',
        items: purchaseDetails.selections.map(s => ({
            description: `${s.quantity}x ${s.tier.name}`,
            amount: s.quantity * s.tier.price
        }))
    };
    addPaymentRecord(newPaymentRecord);

    const eventFanGroup = fanGroups.find(g => g.eventId === purchaseDetails.event.id) || undefined;

    setLastPurchasePoints(pointsEarned);
    setLastPurchaseDetails({
        isPix: paymentMethod === 'pix',
        type: 'ticket',
        event: purchaseDetails.event,
        group: eventFanGroup
    });
    setTicketsToPurchase(null);
    setIsPurchaseSuccessModalVisible(true);
  }, [artist.id, paymentMethod, fanGroups, addPurchasedTicket, addPaymentRecord]);

  const handleExperiencePurchaseSuccess = useCallback((experience: ExperienceItem) => {
    const pointsEarned = 250;
    const newPurchase: PurchasedExperience = {
        ...experience,
        purchaseId: `EXP-${Date.now()}`
    };
    addPurchasedExperience(newPurchase);

    const newPaymentRecord: PaymentRecord = {
        id: `PAY-${newPurchase.purchaseId}`,
        artistId: artist.id,
        date: new Date().toLocaleDateString('pt-BR'),
        type: TransactionType.EXPERIENCE,
        title: `Experiência: ${experience.name}`,
        amount: experience.price,
        status: 'Pago',
        invoiceUrl: '#',
        paymentMethod: paymentMethod === 'credit-card' ? 'Mastercard **** 1234' : 'Pix',
        items: [{
            description: `1x ${experience.name}`,
            amount: experience.price
        }]
    };
    addPaymentRecord(newPaymentRecord);

    setExperiences(prev => prev.map(exp => 
        exp.id === experience.id 
        ? { ...exp, participantsJoined: exp.participantsJoined + 1 }
        : exp
    ));
    
    setLastPurchasePoints(pointsEarned);
    setLastPurchaseDetails({
        isPix: paymentMethod === 'pix',
        type: 'experience',
        experience: experience
    });
    setExperienceToPurchase(null);
    setIsPurchaseSuccessModalVisible(true);
  }, [artist.id, paymentMethod, addPurchasedExperience, addPaymentRecord, setExperiences]);


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

  const handleAuctionPurchaseSuccess = useCallback((details: { auction: AuctionItem; bidAmount: number }) => {
    const { auction, bidAmount } = details;
    if (new Date(auction.endTime).getTime() < Date.now()) {
        setAuctionToCheckout(null);
        return;
    }

    addFanPoints(20, 'Por dar um lance em um leilão!');
    setAuctions(prev => prev.map(a => {
        if (a.id === auction.id) {
            return {
                ...a, currentBid: bidAmount, highestBidderName: userNickname,
                bids: [...a.bids, { bidderName: userNickname, amount: bidAmount, timestamp: 'Agora mesmo' }]
            };
        }
        return a;
    }));
    
    const newPaymentRecord: PaymentRecord = {
        id: `PAY-AUC-${Date.now()}`,
        artistId: artist.id,
        date: new Date().toLocaleDateString('pt-BR'),
        type: TransactionType.AUCTION,
        title: `Lance: ${auction.name}`,
        amount: bidAmount,
        status: 'Pago',
        invoiceUrl: '#',
        paymentMethod: paymentMethod === 'credit-card' ? 'Mastercard **** 1234' : 'Pix',
        items: [{
            description: `Lance no leilão para "${auction.name}"`,
            amount: bidAmount
        }]
    };
    addPaymentRecord(newPaymentRecord);

    setAuctionToCheckout(null);
    setToastMessage('Seu lance foi confirmado com sucesso!');
  }, [artist.id, addFanPoints, setAuctions, paymentMethod, addPaymentRecord, userNickname]);

  const handleInitiateDonationCheckout = useCallback((campaign: VaquinhaCampaign, amount: number) => {
    setSelectedVaquinha(null);
    setDonationToCheckout({ campaign, amount });
  }, []);

  const handleDonationSuccess = useCallback((details: { campaign: VaquinhaCampaign; amount: number }) => {
      const { campaign, amount } = details;
      const pointsToAdd = Math.floor(amount);
      addFanPoints(pointsToAdd, 'Por sua doação na Vaquinha!');

      setVaquinhaCampaigns(prev => prev.map(c =>
        c.id === campaign.id ? {
          ...c,
          currentAmount: c.currentAmount + amount,
          supporterCount: c.supporterCount + 1,
        } : c
      ));

      setDonatedCampaigns(prev => ({
        ...prev,
        [campaign.id]: (prev[campaign.id] || 0) + amount
      }));

      const newPaymentRecord: PaymentRecord = {
          id: `PAY-DON-${Date.now()}`,
          artistId: artist.id,
          date: new Date().toLocaleDateString('pt-BR'),
          type: TransactionType.DONATION,
          title: `Doação: ${campaign.title}`,
          amount: amount,
          status: 'Pago',
          invoiceUrl: '#',
          paymentMethod: paymentMethod === 'credit-card' ? 'Mastercard **** 1234' : 'Pix',
          items: [{
              description: `Doação para a campanha "${campaign.title}"`,
              amount: amount
          }]
      };
      addPaymentRecord(newPaymentRecord);
      
      setDonationToCheckout(null);
      setToastMessage('Sua doação foi recebida! Muito obrigado!');
  }, [artist.id, addFanPoints, setVaquinhaCampaigns, setDonatedCampaigns, addPaymentRecord, paymentMethod]);

  const handleAddMuralPost = useCallback((imageDataUrl: string, caption: string) => {
    const newPost: MuralPost = {
      id: `mp-${Date.now()}`,
      artistId: artist.id,
      imageUrl: imageDataUrl,
      fanName: userNickname,
      fanAvatarUrl: userProfileImageUrl,
      caption: caption,
      likes: 0,
      timestamp: new Date().toISOString(),
    };

    setMuralPosts(prev => [newPost, ...prev]);
    addFanPoints(25, 'Por postar uma foto no mural!');
    setToastMessage('Sua foto foi postada com sucesso!');
  }, [artist.id, addFanPoints, setMuralPosts, userNickname, userProfileImageUrl]);
  
  const handleAddFanArtPost = useCallback((imageDataUrl: string, caption: string) => {
    const newPost: FanArtPost = {
      id: `fa-${Date.now()}`,
      artistId: artist.id,
      imageUrl: imageDataUrl,
      fanName: userNickname,
      fanAvatarUrl: userProfileImageUrl,
      caption: caption,
      likes: 0,
      timestamp: new Date().toISOString(),
    };

    setFanArtPosts(prev => [newPost, ...prev]);
    addFanPoints(30, 'Por postar na galeria de arte!');
    setToastMessage('Sua arte foi postada com sucesso!');
  }, [artist.id, addFanPoints, setFanArtPosts, userNickname, userProfileImageUrl]);

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

  const handleJoinGroup = useCallback((groupId: string) => {
      if (joinedGroupIds.has(groupId)) return;

      addFanPoints(10, "Por entrar em um grupo de fãs!");
      setJoinedGroupIds(prev => {
          const newSet = new Set(prev);
          newSet.add(groupId);
          return newSet;
      });
      setFanGroups(prev => prev.map(g => g.id === groupId ? {...g, memberCount: g.memberCount + 1} : g));

  }, [addFanPoints, joinedGroupIds, setJoinedGroupIds, setFanGroups]);

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
    <div className="relative min-h-[100dvh] bg-gray-50 overflow-hidden flex flex-col">
      <Header artist={artist} onSwitchArtist={() => setSwitcherVisible(true)} onViewImage={onViewImage} onOpenHelp={() => setHelpVisible(true)} />
      
      <main ref={mainScrollRef} className="flex-1 overflow-y-auto no-scrollbar pb-40 relative px-0">
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

      <div className="absolute bottom-0 left-0 right-0 z-[55] pointer-events-none">
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
  const { artist } = props;

  return (
    <ArtistFanProvider artistId={artist.id} initialFanPoints={artist.fanPoints || 0}>
      <ArtistPageContent {...props} />
    </ArtistFanProvider>
  );
};

export default ArtistPage;
