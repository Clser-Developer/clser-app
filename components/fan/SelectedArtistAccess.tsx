import { Artist, UserAddress, UserPhone } from '../../types';
import ArtistLandingPage from '../ArtistLandingPage';
import PaymentSetupScreen from '../PaymentSetupScreen';

interface BillingDataInput {
  fullName: string;
  email: string;
  taxId: string;
  phone: UserPhone;
  address: UserAddress;
}

interface SelectedArtistAccessProps {
  artist: Artist;
  showPaymentSetup: boolean;
  isSwitcherVisible: boolean;
  onSkipPaymentSetup: () => Promise<void>;
  onSaveCard: (billingData: BillingDataInput) => void;
  onBack: () => void;
  onSubscribe: (artist: Artist) => Promise<void>;
  onViewImage: (url: string) => void;
}

const SelectedArtistAccess = ({
  artist,
  showPaymentSetup,
  isSwitcherVisible,
  onSkipPaymentSetup,
  onSaveCard,
  onBack,
  onSubscribe,
  onViewImage,
}: SelectedArtistAccessProps) => {
  if (showPaymentSetup && !isSwitcherVisible) {
    return (
      <PaymentSetupScreen
        artistName={artist.name}
        onSkip={() => {
          void onSkipPaymentSetup();
        }}
        onSaveCard={onSaveCard}
      />
    );
  }

  return (
    <ArtistLandingPage
      artist={artist}
      onBack={onBack}
      onSubscribe={() => {
        void onSubscribe(artist);
      }}
      onViewImage={onViewImage}
    />
  );
};

export default SelectedArtistAccess;
