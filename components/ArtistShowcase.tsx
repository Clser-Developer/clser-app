

import React, { useState, useMemo } from 'react';
import { Artist } from '../types';
import ArtistDiscoveryCard from './ArtistDiscoveryCard';
import Icon from './Icon';

interface ArtistShowcaseProps {
  artists: Artist[];
  onSelectArtist: (artist: Artist) => void;
  onBack?: () => void;
}

const ArtistShowcase: React.FC<ArtistShowcaseProps> = ({ artists, onSelectArtist, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArtists = useMemo(() => {
    if (!searchQuery) {
      return artists;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return artists.filter(artist =>
      artist.name.toLowerCase().includes(lowercasedQuery) ||
      artist.genre.toLowerCase().includes(lowercasedQuery)
    );
  }, [artists, searchQuery]);

  return (
    <div className="bg-gray-900 text-white p-4 relative">
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-4 left-4 z-10 bg-black/30 backdrop-blur-sm p-2 rounded-full text-white hover:bg-black/50 transition-colors"
          aria-label="Voltar"
        >
          <Icon name="arrowLeft" className="w-6 h-6" />
        </button>
      )}
      <header className="text-center py-12">
        <img 
          src="https://i.ibb.co/gMQ8gKsd/logo-superfans.png" 
          alt="Superfans Logo"
          className="mx-auto h-12 w-auto mb-8" 
        />
        <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-fuchsia-500">
          Escolha seu Artista
        </h1>
        <p className="text-gray-400 mt-4 text-lg max-w-md mx-auto">
          Entre no universo exclusivo do seu ídolo.
        </p>
      </header>

      <div className="max-w-xl mx-auto mb-8">
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Icon name="search" className="w-5 h-5 text-gray-400" />
            </div>
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por artista ou gênero..."
                className="w-full bg-gray-800 border border-gray-700 rounded-full py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-magenta-500 focus:border-transparent outline-none transition"
            />
        </div>
      </div>

      <main>
        {filteredArtists.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredArtists.map((artist) => (
              <ArtistDiscoveryCard 
                key={artist.id} 
                artist={artist} 
                onClick={() => onSelectArtist(artist)} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-bold text-white">Nenhum artista encontrado</h3>
            <p className="text-gray-400 mt-2">Tente buscar por outro nome ou gênero.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ArtistShowcase;
