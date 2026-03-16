
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
  const modalTitle = hasArtists ? 'Meus Clubes' : 'Explorar Artistas';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-gray-100 overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-gray-50">
          <h2 className="text-xl font-black text-gray-900">{modalTitle}</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 transition-colors">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-4">
            {hasArtists ? (
                <ul className="space-y-1 mb-4">
                {artists.map((artist) => (
                    <li key={artist.id}>
                    <button
                        onClick={() => {
                        onSelectArtist(artist.id);
                        onClose();
                        }}
                        className={`w-full flex items-center space-x-4 p-3 rounded-2xl text-left transition-all ${
                        artist.id === currentArtistId ? 'bg-rose-50 shadow-inner' : 'hover:bg-gray-50'
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
                            <img src={artist.profileImageUrl} alt={artist.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm cursor-pointer hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex-1">
                        <p className="font-bold text-gray-900">{artist.name}</p>
                        <p className={`text-xs font-bold uppercase tracking-tight ${artist.id === currentArtistId ? 'text-rose-500' : 'text-gray-400'}`}>
                            {artist.id === currentArtistId ? 'Ativo agora' : 'Acessar Clube'}
                        </p>
                        </div>
                        {artist.id === currentArtistId && (
                        <div className="w-2.5 h-2.5 bg-rose-500 rounded-full"></div>
                        )}
                    </button>
                    </li>
                ))}
                </ul>
            ) : (
                <div className="p-6 text-center">
                    <p className="text-gray-500 mb-6 font-medium">
                    Comece sua jornada e encontre seu primeiro artista!
                    </p>
                </div>
            )}
            
            <button
                onClick={onFindMoreArtists}
                className="w-full bg-gray-900 text-white font-bold py-4 px-4 rounded-2xl hover:bg-black transition-all shadow-lg"
            >
                Explorar Novos Artistas
            </button>
        </div>
      </div>
    </div>
  );
};

export default ArtistSwitcher;
