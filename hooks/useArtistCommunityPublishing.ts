import { useCallback, type Dispatch, type SetStateAction } from 'react';
import { FanArtPost, MuralPost } from '../types';

interface UseArtistCommunityPublishingInput {
  addFanPoints: (points: number, reason: string) => void;
  artistId: string;
  setFanArtPosts: Dispatch<SetStateAction<FanArtPost[]>>;
  setMuralPosts: Dispatch<SetStateAction<MuralPost[]>>;
  setToastMessage: Dispatch<SetStateAction<string | null>>;
  userNickname: string;
  userProfileImageUrl: string;
}

export const useArtistCommunityPublishing = ({
  addFanPoints,
  artistId,
  setFanArtPosts,
  setMuralPosts,
  setToastMessage,
  userNickname,
  userProfileImageUrl,
}: UseArtistCommunityPublishingInput) => {
  const handleAddMuralPost = useCallback(
    (imageDataUrl: string, caption: string) => {
      const newPost: MuralPost = {
        id: `mp-${Date.now()}`,
        artistId,
        imageUrl: imageDataUrl,
        fanName: userNickname,
        fanAvatarUrl: userProfileImageUrl,
        caption,
        likes: 0,
        timestamp: new Date().toISOString(),
      };

      setMuralPosts((previous) => [newPost, ...previous]);
      addFanPoints(25, 'Por postar uma foto no mural!');
      setToastMessage('Sua foto foi postada com sucesso!');
    },
    [addFanPoints, artistId, setMuralPosts, setToastMessage, userNickname, userProfileImageUrl]
  );

  const handleAddFanArtPost = useCallback(
    (imageDataUrl: string, caption: string) => {
      const newPost: FanArtPost = {
        id: `fa-${Date.now()}`,
        artistId,
        imageUrl: imageDataUrl,
        fanName: userNickname,
        fanAvatarUrl: userProfileImageUrl,
        caption,
        likes: 0,
        timestamp: new Date().toISOString(),
      };

      setFanArtPosts((previous) => [newPost, ...previous]);
      addFanPoints(30, 'Por postar na galeria de arte!');
      setToastMessage('Sua arte foi postada com sucesso!');
    },
    [addFanPoints, artistId, setFanArtPosts, setToastMessage, userNickname, userProfileImageUrl]
  );

  return {
    handleAddFanArtPost,
    handleAddMuralPost,
  };
};
