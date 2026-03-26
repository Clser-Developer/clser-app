import { useCallback, useState, type Dispatch, type SetStateAction } from 'react';
import { MediaItem, MediaPlatform } from '../types';

interface ConnectionFlowState {
  step: 'login' | 'consent';
  platform: MediaPlatform;
  mediaItem: MediaItem | null;
}

interface UseArtistMediaConnectionsInput {
  addFanPoints: (points: number, reason: string) => void;
  setPlayingMedia: Dispatch<SetStateAction<MediaItem | null>>;
}

export const useArtistMediaConnections = ({ addFanPoints, setPlayingMedia }: UseArtistMediaConnectionsInput) => {
  const [connections, setConnections] = useState({ youtube: false, spotify: false });
  const [connectionFlowState, setConnectionFlowState] = useState<ConnectionFlowState | null>(null);

  const handlePlayMedia = useCallback(
    (item: MediaItem) => {
      const platformKey = item.platform.toLowerCase() as keyof typeof connections;
      if (connections[platformKey]) {
        setPlayingMedia(item);
      } else {
        setConnectionFlowState({ step: 'login', platform: item.platform, mediaItem: item });
      }
    },
    [connections, setPlayingMedia]
  );

  const handleRequestConnection = useCallback(
    (platform: MediaPlatform) => {
      const platformKey = platform.toLowerCase() as keyof typeof connections;
      if (!connections[platformKey]) {
        setConnectionFlowState({ step: 'login', platform, mediaItem: null });
      }
    },
    [connections]
  );

  const handleCloseConnectionFlow = useCallback(() => {
    setConnectionFlowState(null);
  }, []);

  const handleLoginSuccess = useCallback(() => {
    setConnectionFlowState((previous) => (previous ? { ...previous, step: 'consent' } : null));
  }, []);

  const handleOAuthAllow = useCallback(() => {
    if (!connectionFlowState) return;
    const { platform, mediaItem } = connectionFlowState;
    const platformKey = platform.toLowerCase() as keyof typeof connections;
    setConnections((previous) => ({ ...previous, [platformKey]: true }));

    if (platform === MediaPlatform.YOUTUBE) addFanPoints(5, 'Por conectar sua conta do YouTube');
    if (platform === MediaPlatform.SPOTIFY) addFanPoints(5, 'Por conectar sua conta do Spotify');

    setConnectionFlowState(null);
    if (mediaItem) {
      setPlayingMedia(mediaItem);
    }
  }, [addFanPoints, connectionFlowState, connections, setPlayingMedia]);

  return {
    connections,
    connectionFlowState,
    handleCloseConnectionFlow,
    handleLoginSuccess,
    handleOAuthAllow,
    handlePlayMedia,
    handleRequestConnection,
  };
};

