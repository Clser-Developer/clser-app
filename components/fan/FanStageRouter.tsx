import { Artist } from '../../types';
import FanAccessScreen from '../FanAccessScreen';
import FanLoginScreen from '../FanLoginScreen';
import ArtistShowcase from '../ArtistShowcase';
import type { FanModeStage } from '../../hooks/useFanFlowState';

interface LoginResult {
  success: boolean;
  reason?: string;
}

interface FanStageRouterProps {
  fanModeStage: FanModeStage;
  defaultEmail: string;
  artistsForShowcase: Artist[];
  onOpenLogin: () => void;
  onStartRegistration: () => void;
  onExploreArtists: () => void;
  onBackToSelection: () => void;
  onLoginSubmit: (credentials: { email: string; password: string }) => Promise<LoginResult>;
  onLoginBack: () => void;
  onBrowseArtistSelect: (artist: Artist) => Promise<void>;
  onBrowseBack: () => void;
}

const FanStageRouter = ({
  fanModeStage,
  defaultEmail,
  artistsForShowcase,
  onOpenLogin,
  onStartRegistration,
  onExploreArtists,
  onBackToSelection,
  onLoginSubmit,
  onLoginBack,
  onBrowseArtistSelect,
  onBrowseBack,
}: FanStageRouterProps) => {
  if (fanModeStage === 'gateway') {
    return (
      <FanAccessScreen
        onEnter={onOpenLogin}
        onRegister={onStartRegistration}
        onExploreArtists={onExploreArtists}
        onBack={onBackToSelection}
      />
    );
  }

  if (fanModeStage === 'login') {
    return <FanLoginScreen defaultEmail={defaultEmail} onSubmit={onLoginSubmit} onBack={onLoginBack} />;
  }

  if (fanModeStage === 'browse') {
    return (
      <ArtistShowcase
        artists={artistsForShowcase}
        onSelectArtist={(artist) => {
          void onBrowseArtistSelect(artist);
        }}
        onBack={onBrowseBack}
      />
    );
  }

  return null;
};

export default FanStageRouter;
