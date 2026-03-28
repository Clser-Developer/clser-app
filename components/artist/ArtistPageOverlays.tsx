import React from 'react';
import type { Artist } from '../../types';
import AddressModal from '../AddressModal';
import AuctionBidModal from '../AuctionBidModal';
import AuctionCheckoutModal from '../AuctionCheckoutModal';
import CommentModal from '../CommentModal';
import ConnectAccountModal from '../ConnectAccountModal';
import DonationCheckoutModal from '../DonationCheckoutModal';
import ExperienceCheckoutModal from '../ExperienceCheckoutModal';
import HelpCenterModal from '../HelpCenterModal';
import MediaPlayer from '../MediaPlayer';
import OneClickPurchase from '../OneClickPurchase';
import OrderStatusModal from '../OrderStatusModal';
import PaymentHistoryModal from '../PaymentHistoryModal';
import PaymentMethodModal from '../PaymentMethodModal';
import PointsAwardedModal from '../PointsAwardedModal';
import PointsInfoModal from '../PointsInfoModal';
import PurchaseSuccessModal from '../PurchaseSuccessModal';
import RewardDetailsModal from '../RewardDetailsModal';
import SimulatedLoginModal from '../SimulatedLoginModal';
import TicketCheckoutModal from '../TicketCheckoutModal';
import Toast from '../Toast';
import VaquinhaDetailModal from '../VaquinhaDetailModal';

interface ArtistPageOverlaysProps {
  artist: Artist;
  auctionToCheckout: React.ComponentProps<typeof AuctionCheckoutModal>['checkoutDetails'];
  comments: React.ComponentProps<typeof CommentModal>['comments'];
  connectionFlowState:
    | {
        step: 'login' | 'consent';
        platform: React.ComponentProps<typeof SimulatedLoginModal>['platform'];
      }
    | null;
  donationToCheckout: React.ComponentProps<typeof DonationCheckoutModal>['checkoutDetails'];
  experienceToPurchase: React.ComponentProps<typeof ExperienceCheckoutModal>['experience'];
  fanPoints: React.ComponentProps<typeof RewardDetailsModal>['fanPoints'];
  helpContext: React.ComponentProps<typeof HelpCenterModal>['context'];
  isAddressModalVisible: boolean;
  isCheckoutVisible: boolean;
  isCommentsLoading: React.ComponentProps<typeof CommentModal>['isLoading'];
  isHelpVisible: boolean;
  isPaymentHistoryVisible: boolean;
  isPaymentMethodModalVisible: boolean;
  isPointsInfoModalVisible: boolean;
  isPurchaseSuccessModalVisible: boolean;
  lastPurchaseDetails: React.ComponentProps<typeof PurchaseSuccessModal>['details'] | null;
  leaderboard: React.ComponentProps<typeof RewardDetailsModal>['leaderboard'];
  paymentHistory: React.ComponentProps<typeof PaymentHistoryModal>['history'];
  paymentMethod: React.ComponentProps<typeof OneClickPurchase>['paymentMethod'];
  playingMedia: React.ComponentProps<typeof MediaPlayer>['item'] | null;
  pointsModalData: { points: number; reason: string } | null;
  selectedAuctionForBidding: React.ComponentProps<typeof AuctionBidModal>['item'] | null;
  selectedOrderForTracking: React.ComponentProps<typeof OrderStatusModal>['order'] | null;
  selectedPostForComments: React.ComponentProps<typeof CommentModal>['post'] | null;
  selectedReward: React.ComponentProps<typeof RewardDetailsModal>['reward'] | null;
  selectedVaquinha: React.ComponentProps<typeof VaquinhaDetailModal>['campaign'];
  shoppingCart: React.ComponentProps<typeof OneClickPurchase>['items'];
  ticketsToPurchase: React.ComponentProps<typeof TicketCheckoutModal>['purchaseDetails'];
  toastMessage: string | null;
  userProfileImageUrl: string;
  onAddComment: React.ComponentProps<typeof CommentModal>['onAddComment'];
  onAuctionPurchaseSuccess: React.ComponentProps<typeof AuctionCheckoutModal>['onSuccess'];
  onCheckoutPurchaseSuccess: React.ComponentProps<typeof OneClickPurchase>['onSuccess'];
  onCloseAddressModal: () => void;
  onCloseAuctionBidModal: () => void;
  onCloseAuctionCheckoutModal: () => void;
  onCloseCheckout: () => void;
  onCloseCommentModal: () => void;
  onCloseConnectionFlow: () => void;
  onCloseDonationCheckout: () => void;
  onCloseExperienceCheckout: () => void;
  onCloseHelp: () => void;
  onCloseMediaPlayer: () => void;
  onCloseOrderTracking: () => void;
  onClosePaymentHistoryModal: () => void;
  onClosePaymentMethodModal: () => void;
  onClosePointsInfoModal: () => void;
  onClosePointsModal: () => void;
  onClosePurchaseSuccess: () => void;
  onCloseRewardModal: () => void;
  onCloseTicketCheckout: () => void;
  onCloseVaquinhaDetail: () => void;
  onConfirmBid: React.ComponentProps<typeof AuctionBidModal>['onConfirmBid'];
  onDismissToast: () => void;
  onDonationSuccess: React.ComponentProps<typeof DonationCheckoutModal>['onSuccess'];
  onEditAddress: () => void;
  onEditPaymentMethod: () => void;
  onExperiencePurchaseSuccess: React.ComponentProps<typeof ExperienceCheckoutModal>['onSuccess'];
  onGoToGroups: () => void;
  onGoToPurchases: () => void;
  onGoToTickets: () => void;
  onInitiateDonationCheckout: React.ComponentProps<typeof VaquinhaDetailModal>['onInitiateCheckout'];
  onLoginSuccess: () => void;
  onOAuthAllow: () => void;
  onSelectPaymentMethod: React.ComponentProps<typeof PaymentMethodModal>['onSelectMethod'];
  onTicketPurchaseSuccess: React.ComponentProps<typeof TicketCheckoutModal>['onSuccess'];
  onUpdateCartQuantity: React.ComponentProps<typeof OneClickPurchase>['onUpdateQuantity'];
  onViewArtistProfileImage: () => void;
}

const ArtistPageOverlays = ({
  artist,
  auctionToCheckout,
  comments,
  connectionFlowState,
  donationToCheckout,
  experienceToPurchase,
  fanPoints,
  helpContext,
  isAddressModalVisible,
  isCheckoutVisible,
  isCommentsLoading,
  isHelpVisible,
  isPaymentHistoryVisible,
  isPaymentMethodModalVisible,
  isPointsInfoModalVisible,
  isPurchaseSuccessModalVisible,
  lastPurchaseDetails,
  leaderboard,
  paymentHistory,
  paymentMethod,
  playingMedia,
  pointsModalData,
  selectedAuctionForBidding,
  selectedOrderForTracking,
  selectedPostForComments,
  selectedReward,
  selectedVaquinha,
  shoppingCart,
  ticketsToPurchase,
  toastMessage,
  userProfileImageUrl,
  onAddComment,
  onAuctionPurchaseSuccess,
  onCheckoutPurchaseSuccess,
  onCloseAddressModal,
  onCloseAuctionBidModal,
  onCloseAuctionCheckoutModal,
  onCloseCheckout,
  onCloseCommentModal,
  onCloseConnectionFlow,
  onCloseDonationCheckout,
  onCloseExperienceCheckout,
  onCloseHelp,
  onCloseMediaPlayer,
  onCloseOrderTracking,
  onClosePaymentHistoryModal,
  onClosePaymentMethodModal,
  onClosePointsInfoModal,
  onClosePointsModal,
  onClosePurchaseSuccess,
  onCloseRewardModal,
  onCloseTicketCheckout,
  onCloseVaquinhaDetail,
  onConfirmBid,
  onDismissToast,
  onDonationSuccess,
  onEditAddress,
  onEditPaymentMethod,
  onExperiencePurchaseSuccess,
  onGoToGroups,
  onGoToPurchases,
  onGoToTickets,
  onInitiateDonationCheckout,
  onLoginSuccess,
  onOAuthAllow,
  onSelectPaymentMethod,
  onTicketPurchaseSuccess,
  onUpdateCartQuantity,
  onViewArtistProfileImage,
}: ArtistPageOverlaysProps) => {
  const currentUserRank = leaderboard.find((fan) => fan.isCurrentUser)
    ? leaderboard.findIndex((fan) => fan.isCurrentUser) + 1
    : null;

  return (
    <>
      <Toast message={toastMessage} onDismiss={onDismissToast} />
      <PointsInfoModal isVisible={isPointsInfoModalVisible} onClose={onClosePointsInfoModal} />

      <AddressModal isVisible={isAddressModalVisible} onClose={onCloseAddressModal} />
      <PaymentMethodModal
        isVisible={isPaymentMethodModalVisible}
        onClose={onClosePaymentMethodModal}
        currentMethod={paymentMethod}
        onSelectMethod={onSelectPaymentMethod}
      />
      <PaymentHistoryModal isVisible={isPaymentHistoryVisible} onClose={onClosePaymentHistoryModal} history={paymentHistory} />

      {pointsModalData && (
        <PointsAwardedModal
          isVisible={true}
          points={pointsModalData.points}
          reason={pointsModalData.reason}
          onClose={onClosePointsModal}
        />
      )}
      {isCheckoutVisible && shoppingCart.length > 0 && (
        <OneClickPurchase
          items={shoppingCart}
          onClose={onCloseCheckout}
          onSuccess={onCheckoutPurchaseSuccess}
          paymentMethod={paymentMethod}
          onUpdateQuantity={onUpdateCartQuantity}
          onEditAddress={onEditAddress}
          onEditPaymentMethod={onEditPaymentMethod}
        />
      )}
      {ticketsToPurchase && (
        <TicketCheckoutModal
          purchaseDetails={ticketsToPurchase}
          onClose={onCloseTicketCheckout}
          onSuccess={onTicketPurchaseSuccess}
          paymentMethod={paymentMethod}
          onEditAddress={onEditAddress}
          onEditPaymentMethod={onEditPaymentMethod}
        />
      )}
      {experienceToPurchase && (
        <ExperienceCheckoutModal
          experience={experienceToPurchase}
          onClose={onCloseExperienceCheckout}
          onSuccess={onExperiencePurchaseSuccess}
          paymentMethod={paymentMethod}
          onEditPaymentMethod={onEditPaymentMethod}
        />
      )}
      {isPurchaseSuccessModalVisible && lastPurchaseDetails && (
        <PurchaseSuccessModal
          isVisible={isPurchaseSuccessModalVisible}
          details={lastPurchaseDetails}
          onClose={onClosePurchaseSuccess}
          onGoToPurchases={onGoToPurchases}
          onGoToTickets={onGoToTickets}
          onGoToGroups={onGoToGroups}
        />
      )}
      {selectedPostForComments && (
        <CommentModal
          post={selectedPostForComments}
          artist={artist}
          userProfileImageUrl={userProfileImageUrl}
          comments={comments}
          isLoading={isCommentsLoading}
          onClose={onCloseCommentModal}
          onAddComment={onAddComment}
          onViewProfileImage={onViewArtistProfileImage}
        />
      )}
      {selectedOrderForTracking && <OrderStatusModal order={selectedOrderForTracking} onClose={onCloseOrderTracking} />}
      {selectedAuctionForBidding && (
        <AuctionBidModal item={selectedAuctionForBidding} onClose={onCloseAuctionBidModal} onConfirmBid={onConfirmBid} />
      )}
      {auctionToCheckout && (
        <AuctionCheckoutModal
          checkoutDetails={auctionToCheckout}
          onClose={onCloseAuctionCheckoutModal}
          onSuccess={onAuctionPurchaseSuccess}
          paymentMethod={paymentMethod}
          onEditPaymentMethod={onEditPaymentMethod}
        />
      )}
      {selectedReward && (
        <RewardDetailsModal
          reward={selectedReward}
          fanPoints={fanPoints}
          currentUserRank={currentUserRank}
          leaderboard={leaderboard}
          onClose={onCloseRewardModal}
        />
      )}
      <VaquinhaDetailModal campaign={selectedVaquinha} onClose={onCloseVaquinhaDetail} onInitiateCheckout={onInitiateDonationCheckout} />
      <DonationCheckoutModal
        checkoutDetails={donationToCheckout}
        onClose={onCloseDonationCheckout}
        onSuccess={onDonationSuccess}
        paymentMethod={paymentMethod}
        onEditPaymentMethod={onEditPaymentMethod}
      />
      {playingMedia && <MediaPlayer item={playingMedia} onClose={onCloseMediaPlayer} />}
      {connectionFlowState?.step === 'login' && (
        <SimulatedLoginModal
          isVisible={true}
          platform={connectionFlowState.platform}
          onClose={onCloseConnectionFlow}
          onLoginSuccess={onLoginSuccess}
        />
      )}
      {connectionFlowState?.step === 'consent' && (
        <ConnectAccountModal
          isVisible={true}
          platform={connectionFlowState.platform}
          onDeny={onCloseConnectionFlow}
          onAllow={onOAuthAllow}
        />
      )}
      <HelpCenterModal isVisible={isHelpVisible} onClose={onCloseHelp} context={helpContext} />
    </>
  );
};

export default ArtistPageOverlays;
