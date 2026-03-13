
import React from 'react';
import { Artist } from '../types';
import Icon from './Icon';

interface ArtistSwitcherProps {
  isVisible: boolean;
  onClose: () => void;
  artists: Artist[];
  currentArtistId: string;
  onSelectArtist: (artistId: string) => void;
  onFindMoreArtists: () => void;
  onViewImage: (url: string) => void;
}

const ArtistSwitcher: React.FC<ArtistSwitcherProps> = ({ isVisible, onClose, artists, currentArtistId, onSelectArtist, onFindMoreArtists, onViewImage }) => {
  if (!isVisible) return null;

  const hasArtists = artists.length > 0;
  const modalTitle = hasArtists ? 'Meus Artistas' : 'Explorar Artistas';

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gray-800 rounded-2xl w-full max-w-sm shadow-2xl border border-gray-700">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold text-white">{modalTitle}</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-700">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-4">
            {hasArtists ? (
                <ul className="space-y-1">
                {artists.map((artist) => (
                    <li key={artist.id}>
                    <button
                        onClick={() => {
                        onSelectArtist(artist.id);
                        onClose();
                        }}
                        className={`w-full flex items-center space-x-4 p-3 rounded-lg text-left transition-colors ${
                        artist.id === currentArtistId ? 'bg-magenta-600/30' : 'hover:bg-gray-700/50'
                        }`}
                    >
                        <div 
                            className="flex-shrink-0"
                            role="button"
                            aria-label={`Ver foto de perfil de ${artist.name} ampliada`}
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent the artist selection
                                onViewImage(artist.profileImageUrl);
                            }}
                        >
                            <img src={artist.profileImageUrl} alt={artist.name} className="w-12 h-12 rounded-full object-cover cursor-pointer hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex-1">
                        <p className="font-semibold text-white">{artist.name}</p>
                        <p className="text-sm text-gray-400">Ver Fã Clube</p>
                        </div>
                        {artist.id === currentArtistId && (
                        <div className="w-3 h-3 bg-magenta-400 rounded-full"></div>
                        )}
                    </button>
                    </li>
                ))}
                </ul>
            ) : (
                <div className="p-6 text-center">
                    <p className="text-gray-300 mb-6">
                    Comece sua jornada e encontre seu primeiro artista!
                    </p>
                </div>
            )}
            
            {hasArtists && (
                <div className="border-t border-gray-700 my-3"></div>
            )}

            <button
                onClick={onFindMoreArtists}
                className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors"
            >
                Procurar por mais artistas
            </button>
        </div>
      </div>
    </div>
  );
};

export default ArtistSwitcher;