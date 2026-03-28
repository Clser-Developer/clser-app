import type { ComponentType, Dispatch, SetStateAction } from 'react';
import { Artist } from '../../types';
import ArtistSwitcher from '../ArtistSwitcher';
import PointsAwardedModal from '../PointsAwardedModal';

interface ImageViewerDetails {
  url: string;
  caption?: string;
  postId?: string;
  isLiked?: boolean;
  likeCount?: number;
  onLike?: (postId: string) => void;
}

interface ArtistPageComponentProps {
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

interface FanSessionViewProps {
  ArtistPageComponent: ComponentType<ArtistPageComponentProps>;
  artist: Artist;
  currentArtistId: string;
  userScopeId: string;
  userNickname: string;
  userProfileImageUrl: string;
  isSwitcherVisible: boolean;
  subscribedArtists: Artist[];
  pointsModalData: { points: number; reason: string } | null;
  onLogout: () => void;
  onSetImageViewerState: Dispatch<SetStateAction<ImageViewerDetails | null>>;
  onNicknameChange: (name: string) => void;
  onProfileImageChange: (dataUrl: string) => void;
  onCloseSwitcher: () => void;
  onSelectArtist: (artistId: string) => void;
  onFindMoreArtists: () => void;
  onClosePointsModal: () => void;
}

const FanSessionView = ({
  ArtistPageComponent,
  artist,
  currentArtistId,
  userScopeId,
  userNickname,
  userProfileImageUrl,
  isSwitcherVisible,
  subscribedArtists,
  pointsModalData,
  onLogout,
  onSetImageViewerState,
  onNicknameChange,
  onProfileImageChange,
  onCloseSwitcher,
  onSelectArtist,
  onFindMoreArtists,
  onClosePointsModal,
}: FanSessionViewProps) => {
  return (
    <div className="h-full bg-gray-50 text-gray-900">
      <ArtistPageComponent
        artist={artist}
        onViewImage={onSetImageViewerState}
        updateImageViewer={(updates) => onSetImageViewerState((previous) => (previous ? { ...previous, ...updates } : null))}
        onLogout={onLogout}
        userNickname={userNickname}
        userScopeId={userScopeId}
        onNicknameChange={onNicknameChange}
        userProfileImageUrl={userProfileImageUrl}
        onProfileImageChange={onProfileImageChange}
      />
      <ArtistSwitcher
        isVisible={isSwitcherVisible}
        onClose={onCloseSwitcher}
        artists={subscribedArtists}
        currentArtistId={currentArtistId}
        onSelectArtist={onSelectArtist}
        onFindMoreArtists={onFindMoreArtists}
        onViewImage={(url) => onSetImageViewerState({ url })}
      />
      {pointsModalData && (
        <PointsAwardedModal
          isVisible={true}
          points={pointsModalData.points}
          reason={pointsModalData.reason}
          onClose={onClosePointsModal}
        />
      )}
    </div>
  );
};

export default FanSessionView;
