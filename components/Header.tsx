import React from 'react';
import { Artist } from '../types';
import Icon from './Icon';

interface HeaderProps {
  artist: Artist;
  onSwitchArtist: () => void;
  onViewImage: (details: { url: string; caption?: string }) => void;
  onOpenHelp: () => void;
}

const Header: React.FC<HeaderProps> = ({ artist, onSwitchArtist, onViewImage, onOpenHelp }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-20 px-6 py-4 flex items-center justify-between border-b border-gray-100 shadow-sm">
      <div className="flex items-center space-x-3">
        <button 
          onClick={() => onViewImage({ url: artist.profileImageUrl })} 
          aria-label="Ver foto de perfil ampliada"
          className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
        >
          <img src={artist.profileImageUrl} alt={artist.name} className="w-10 h-10 rounded-full border border-gray-200 object-cover shadow-sm transition-transform hover:scale-105" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900 leading-tight">{artist.name}</h1>
          <p className="text-[10px] font-bold text-rose-500 tracking-wide uppercase">Fã Clube Oficial</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button 
          onClick={onOpenHelp}
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          aria-label="Central de Ajuda"
        >
          <Icon name="question-mark-circle" className="w-6 h-6" />
        </button>
        <button 
          onClick={onSwitchArtist}
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          aria-label="Trocar de artista"
        >
          <Icon name="switch" className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;