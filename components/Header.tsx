
import React from 'react';
import { Artist } from '../types';
import Icon from './Icon';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  artist: Artist;
  onSwitchArtist: () => void;
  onViewImage: (url: string) => void;
  onOpenHelp: () => void;
}

const Header: React.FC<HeaderProps> = ({ artist, onSwitchArtist, onViewImage, onOpenHelp }) => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-20 p-4 flex items-center justify-between border-b border-gray-700">
      <div className="flex items-center space-x-3">
        <button 
          onClick={() => onViewImage(artist.profileImageUrl)} 
          aria-label="Ver foto de perfil ampliada"
          className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-magenta-500"
        >
          <img src={artist.profileImageUrl} alt={artist.name} className="w-10 h-10 rounded-full border-2 border-magenta-500 object-cover transition-transform hover:scale-105" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white">{artist.name}</h1>
          <p className="text-xs text-orange-400 font-semibold">Fã Clube Oficial</p>
        </div>
      </div>
      <div className="flex items-center space-x-1">
        <Button
          onClick={onOpenHelp}
          variant="ghost"
          className="p-2 rounded-full text-gray-300 hover:bg-gray-700 hover:text-white"
          aria-label="Central de Ajuda"
        >
          <Icon name="question-mark-circle" className="w-6 h-6" />
        </Button>
        <Button
          onClick={onSwitchArtist}
          variant="ghost"
          className="p-2 rounded-full text-gray-300 hover:bg-gray-700 hover:text-white"
          aria-label="Trocar de artista"
        >
          <Icon name="switch" className="w-6 h-6" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
