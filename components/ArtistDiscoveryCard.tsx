
import React from 'react';
import { Artist } from '../types';
import Icon from './Icon';

interface ArtistDiscoveryCardProps {
    artist: Artist;
    onClick: () => void;
}

const ArtistDiscoveryCard: React.FC<ArtistDiscoveryCardProps> = ({ artist, onClick }) => {
    // Charles tem o ID 'lia' no mockApiService.ts
    const isTrending = artist.id === 'lia';

    return (
        <button 
            onClick={onClick}
            className="group relative rounded-3xl overflow-hidden w-full aspect-[3/4] block text-left shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
        >
            {/* Background Image */}
            <img 
                src={artist.coverImageUrl} 
                alt={artist.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            {/* Trending Badge */}
            {isTrending && (
                <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-rose-600 text-[10px] text-white font-black px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-lg border border-white/20">
                   <Icon name="raffle" className="w-3 h-3" />
                   EM ALTA
                </div>
            )}

            {/* Bottom Content */}
            <div className="absolute bottom-0 left-0 p-4 w-full flex items-center gap-2">
                {/* Profile Circle with Red Border */}
                <div className="w-8 h-8 rounded-full border-2 border-rose-500 p-0.5 shadow-lg flex-shrink-0">
                    <img 
                        src={artist.profileImageUrl} 
                        className="w-full h-full rounded-full object-cover" 
                        alt={artist.name} 
                    />
                </div>
                <div className="min-w-0">
                    <h2 className="text-sm font-black text-white truncate drop-shadow-md">
                        {artist.name}
                    </h2>
                </div>
            </div>
        </button>
    );
};

export default ArtistDiscoveryCard;
