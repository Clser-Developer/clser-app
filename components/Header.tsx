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
    <header className="sticky top-0 z-20 border-b border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,255,255,0.86))] px-5 py-4 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.55)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center space-x-3">
        <button 
          onClick={() => onViewImage({ url: artist.profileImageUrl })} 
          aria-label="Ver foto de perfil ampliada"
          className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
        >
          <img src={artist.profileImageUrl} alt={artist.name} className="h-11 w-11 rounded-full border border-white object-cover shadow-md shadow-black/10 transition-transform hover:scale-105" />
        </button>
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-rose-500">Clube oficial</p>
          <h1 className="truncate text-lg font-black leading-tight text-gray-950">{artist.name}</h1>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button 
          onClick={onOpenHelp}
          className="rounded-2xl border border-gray-200 bg-white p-2.5 text-gray-500 shadow-sm transition-colors hover:border-rose-200 hover:text-gray-900"
          aria-label="Central de Ajuda"
        >
          <Icon name="question-mark-circle" className="h-5 w-5" />
        </button>
        <button 
          onClick={onSwitchArtist}
          className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-gray-600 shadow-sm transition-colors hover:border-rose-200 hover:text-gray-900"
          aria-label="Trocar de artista"
        >
          <Icon name="switch" className="h-4 w-4" />
          <span className="hidden text-[10px] font-black uppercase tracking-[0.18em] sm:inline">Trocar</span>
        </button>
      </div>
      </div>
    </header>
  );
};

export default Header;
