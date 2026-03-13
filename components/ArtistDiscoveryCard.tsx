

import React from 'react';
import { Artist } from '../types';

interface ArtistDiscoveryCardProps {
    artist: Artist;
    onClick: () => void;
}

const ArtistDiscoveryCard: React.FC<ArtistDiscoveryCardProps> = ({ artist, onClick }) => {
    return (
        <button 
            onClick={onClick}
            className="group relative rounded-2xl overflow-hidden w-full aspect-video block text-left border-2 border-transparent hover:border-fuchsia-500 transition-all duration-300"
        >
            <img 
                src={artist.coverImageUrl} 
                alt={artist.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4">
                <h2 className="text-xl font-bold text-white">{artist.name}</h2>
                <p className="text-sm font-medium text-orange-400">{artist.genre}</p>
            </div>
        </button>
    );
};

export default ArtistDiscoveryCard;