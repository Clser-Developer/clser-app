import React from 'react';
import {
  Artist,
  AuctionItem,
  Event,
  ExclusiveReward,
  ExperienceItem,
  FanAreaSection,
  FanArtPost,
  FanGroup,
  FanProfile,
  MediaItem,
  MerchItem,
  MuralPost,
  Order,
  Post,
  PurchasedTicket,
  Section,
  StoreSection,
  TicketSelection,
  VaquinhaCampaign,
} from '../../types';
import TimelineView from '../views/TimelineView';
import StoreView from '../views/StoreView';
import FanAreaView from '../views/FanAreaView';
import MediaView from '../views/MediaView';
import ProfileView from '../ProfileView';

interface ArtistPageSectionsProps {
  activeSection: Section;
  activeTicketTab: 'available' | 'my_tickets';
  artist: Artist;
  auctions: AuctionItem[];
  connections: { youtube: boolean; spotify: boolean };
  donatedCampaigns: Record<string, number>;
  events: Event[];
  exclusiveRewards: ExclusiveReward[];
  experiences: ExperienceItem[];
  fanAreaSection: FanAreaSection;
  fanAreaViewTargetItemId: string | null;
  fanArtPosts: FanArtPost[];
  fanGroups: FanGroup[];
  fanPoints: number;
  isLoadingMedia: boolean;
  isLoadingPosts: boolean;
  isLoadingProfile: boolean;
  isLoadingStore: boolean;
  joinedGroupIds: Set<string>;
  likedFanArtPostIds: Set<string>;
  likedMuralPostIds: Set<string>;
  likedPostIds: Set<string>;
  leaderboard: FanProfile[];
  media: MediaItem[];
  merch: MerchItem[];
  muralPosts: MuralPost[];
  orders: Order[];
  paymentMethod: 'credit-card' | 'pix';
  posts: Post[];
  purchasedTickets: PurchasedTicket[];
  storeSection: StoreSection;
  storeViewTargetItemId: string | null;
  userNickname: string;
  userProfileImageUrl: string;
  vaquinhaCampaigns: VaquinhaCampaign[];
  onAddFanArtPost: React.ComponentProps<typeof FanAreaView>['onAddFanArtPost'];
  onAddMuralPost: React.ComponentProps<typeof FanAreaView>['onAddMuralPost'];
  onAddToCart: React.ComponentProps<typeof StoreView>['onAddToCart'];
  onCommentPost: (post: Post) => void;
  onEditAddress: () => void;
  onEditPaymentMethod: () => void;
  onInitiateExperiencePurchase: (experience: ExperienceItem) => void;
  onInitiateTicketPurchase: React.ComponentProps<typeof StoreView>['onInitiateTicketPurchase'];
  onJoinGroup: (groupId: string) => void;
  onLikeFanArtPost: (postId: string) => void;
  onLikeMuralPost: (postId: string) => void;
  onLikePost: (postId: string) => void;
  onLogout: () => void;
  onNavigate: (section: Section, subSection?: StoreSection | FanAreaSection, itemId?: string) => void;
  onNavigateToFanArea: () => void;
  onOpenPaymentHistory: () => void;
  onOpenPointsInfoModal: () => void;
  onPlaceBid: (auctionId: string) => void;
  onPlayMedia: React.ComponentProps<typeof MediaView>['onPlay'];
  onPaymentMethodChange: React.ComponentProps<typeof StoreView>['onPaymentMethodChange'];
  onProfileImageChange: (dataUrl: string) => void;
  onRequestConnection: React.ComponentProps<typeof MediaView>['onRequestConnection'];
  onSectionChangeFanArea: (section: FanAreaSection) => void;
  onSelectVaquinha: (campaign: VaquinhaCampaign | null) => void;
  onShowToast: React.ComponentProps<typeof StoreView>['onShowToast'];
  onStoreSectionChange: (section: StoreSection) => void;
  onStoreTargetItemHandled: () => void;
  onTargetFanAreaItemHandled: () => void;
  onTicketTabChange: (tab: 'available' | 'my_tickets') => void;
  onToggleTicketAlert: (purchaseId: string) => void;
  onViewFanArtImage: React.ComponentProps<typeof FanAreaView>['onViewFanArtImage'];
  onViewGenericImage: React.ComponentProps<typeof FanAreaView>['onViewGenericImage'];
  onViewImage: React.ComponentProps<typeof TimelineView>['onViewImage'];
  onViewMuralImage: React.ComponentProps<typeof FanAreaView>['onViewMuralImage'];
  onViewOrderDetails: (order: Order) => void;
  onViewRewardDetails: (reward: ExclusiveReward) => void;
  onVote: (postId: string, optionIndex: number) => void;
}

const LoadingSpinner = () => (
  <div className="flex h-full items-center justify-center p-8">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-500 border-t-transparent"></div>
  </div>
);

const ArtistPageSections = ({
  activeSection,
  activeTicketTab,
  artist,
  auctions,
  connections,
  donatedCampaigns,
  events,
  exclusiveRewards,
  experiences,
  fanAreaSection,
  fanAreaViewTargetItemId,
  fanArtPosts,
  fanGroups,
  fanPoints,
  isLoadingMedia,
  isLoadingPosts,
  isLoadingProfile,
  isLoadingStore,
  joinedGroupIds,
  likedFanArtPostIds,
  likedMuralPostIds,
  likedPostIds,
  leaderboard,
  media,
  merch,
  muralPosts,
  orders,
  paymentMethod,
  posts,
  purchasedTickets,
  storeSection,
  storeViewTargetItemId,
  userNickname,
  userProfileImageUrl,
  vaquinhaCampaigns,
  onAddFanArtPost,
  onAddMuralPost,
  onAddToCart,
  onCommentPost,
  onEditAddress,
  onEditPaymentMethod,
  onInitiateExperiencePurchase,
  onInitiateTicketPurchase,
  onJoinGroup,
  onLikeFanArtPost,
  onLikeMuralPost,
  onLikePost,
  onLogout,
  onNavigate,
  onNavigateToFanArea,
  onOpenPaymentHistory,
  onOpenPointsInfoModal,
  onPlaceBid,
  onPlayMedia,
  onPaymentMethodChange,
  onProfileImageChange,
  onRequestConnection,
  onSectionChangeFanArea,
  onSelectVaquinha,
  onShowToast,
  onStoreSectionChange,
  onStoreTargetItemHandled,
  onTargetFanAreaItemHandled,
  onTicketTabChange,
  onToggleTicketAlert,
  onViewFanArtImage,
  onViewGenericImage,
  onViewImage,
  onViewMuralImage,
  onViewOrderDetails,
  onViewRewardDetails,
  onVote,
}: ArtistPageSectionsProps) => {
  return (
    <div className="-mt-6 relative">
      <div style={{ display: activeSection === Section.TIMELINE ? 'block' : 'none' }}>
        {isLoadingPosts ? (
          <LoadingSpinner />
        ) : (
          <TimelineView
            artist={artist}
            posts={posts}
            likedPostIds={likedPostIds}
            onLikePost={onLikePost}
            onVote={onVote}
            onNavigate={onNavigate}
            onViewImage={onViewImage}
            onCommentPost={onCommentPost}
          />
        )}
      </div>

      <div style={{ display: activeSection === Section.MEDIA ? 'block' : 'none' }}>
        {isLoadingMedia ? (
          <LoadingSpinner />
        ) : (
          <MediaView mediaItems={media} connections={connections} onPlay={onPlayMedia} onRequestConnection={onRequestConnection} />
        )}
      </div>

      <div style={{ display: activeSection === Section.STORE ? 'block' : 'none' }}>
        {isLoadingStore ? (
          <LoadingSpinner />
        ) : (
          <StoreView
            artist={artist}
            merch={merch}
            events={events}
            auctions={auctions}
            experiences={experiences}
            orders={orders}
            purchasedTickets={purchasedTickets}
            vaquinhaCampaigns={vaquinhaCampaigns}
            donatedCampaigns={donatedCampaigns}
            storeSection={storeSection}
            onSectionChange={onStoreSectionChange}
            onAddToCart={onAddToCart}
            onViewOrderDetails={onViewOrderDetails}
            onPlaceBid={onPlaceBid}
            onSelectVaquinha={onSelectVaquinha}
            onInitiateTicketPurchase={onInitiateTicketPurchase}
            onInitiateExperiencePurchase={onInitiateExperiencePurchase}
            onToggleTicketAlert={onToggleTicketAlert}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={onPaymentMethodChange}
            targetItemId={storeViewTargetItemId}
            onTargetItemHandled={onStoreTargetItemHandled}
            activeTicketTab={activeTicketTab}
            onTicketTabChange={onTicketTabChange}
            onShowToast={onShowToast}
          />
        )}
      </div>

      <div style={{ display: activeSection === Section.FAN_AREA ? 'block' : 'none' }}>
        {isLoadingProfile ? (
          <LoadingSpinner />
        ) : (
          <FanAreaView
            artist={artist}
            fanAreaSection={fanAreaSection}
            onSectionChange={onSectionChangeFanArea}
            leaderboard={leaderboard}
            rewards={exclusiveRewards}
            fanPoints={fanPoints}
            muralPosts={muralPosts}
            fanGroups={fanGroups}
            joinedGroupIds={joinedGroupIds}
            likedMuralPostIds={likedMuralPostIds}
            onLikeMuralPost={onLikeMuralPost}
            onAddMuralPost={onAddMuralPost}
            fanArtPosts={fanArtPosts}
            likedFanArtPostIds={likedFanArtPostIds}
            onLikeFanArtPost={onLikeFanArtPost}
            onAddFanArtPost={onAddFanArtPost}
            onViewRewardDetails={onViewRewardDetails}
            onOpenPointsInfoModal={onOpenPointsInfoModal}
            onViewMuralImage={onViewMuralImage}
            onViewFanArtImage={onViewFanArtImage}
            onViewGenericImage={onViewGenericImage}
            onJoinGroup={onJoinGroup}
            posts={posts}
            targetItemId={fanAreaViewTargetItemId}
            onTargetItemHandled={onTargetFanAreaItemHandled}
            likedPostIds={likedPostIds}
            onLikePost={onLikePost}
            onCommentPost={onCommentPost}
            onVote={onVote}
            onNavigate={onNavigate}
          />
        )}
      </div>

      <div style={{ display: activeSection === Section.PROFILE ? 'block' : 'none' }}>
        {isLoadingProfile ? (
          <LoadingSpinner />
        ) : (
          <ProfileView
            artist={artist}
            fanPoints={fanPoints}
            userNickname={userNickname}
            userProfileImageUrl={userProfileImageUrl}
            onProfileImageChange={onProfileImageChange}
            onNavigateToFanArea={onNavigateToFanArea}
            onEditAddress={onEditAddress}
            onEditPaymentMethod={onEditPaymentMethod}
            onOpenPaymentHistory={onOpenPaymentHistory}
            onLogout={onLogout}
            onViewImage={(url) => onViewImage({ url })}
          />
        )}
      </div>
    </div>
  );
};

export default ArtistPageSections;
