import { createContext, type ReactNode, useContext, useMemo } from 'react';
import { usePersistentArtistState } from '../hooks/usePersistentArtistState';

type ArtistFanContextValue = ReturnType<typeof usePersistentArtistState>;

const ArtistFanContext = createContext<ArtistFanContextValue | undefined>(undefined);

interface ArtistFanProviderProps {
  artistId: string;
  initialFanPoints: number;
  userScopeId?: string;
  children: ReactNode;
}

export const ArtistFanProvider = ({ artistId, initialFanPoints, userScopeId, children }: ArtistFanProviderProps) => {
  const artistFanState = usePersistentArtistState(artistId, initialFanPoints, userScopeId ?? 'anonymous');
  const value = useMemo(() => artistFanState, [artistFanState]);

  return <ArtistFanContext.Provider value={value}>{children}</ArtistFanContext.Provider>;
};

export const useArtistFan = () => {
  const context = useContext(ArtistFanContext);
  if (!context) {
    throw new Error('useArtistFan must be used within an ArtistFanProvider');
  }

  return context;
};
