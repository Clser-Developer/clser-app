
import React from 'react';
import Icon from './Icon';
import { MediaPlatform } from '../types';

const platformDetails = {
    [MediaPlatform.YOUTUBE]: {
        name: 'YouTube',
        logo: 'https://www.logo.wine/a/logo/YouTube/YouTube-Icon-Full-Color-Logo.wine.svg',
        color: 'border-red-500',
        bg: 'bg-red-50'
    },
    [MediaPlatform.SPOTIFY]: {
        name: 'Spotify',
        logo: 'https://www.logo.wine/a/logo/Spotify/Spotify-Icon-Logo.wine.svg',
        color: 'border-green-500',
        bg: 'bg-green-50'
    }
};

interface ConnectAccountModalProps {
  isVisible: boolean;
  platform: MediaPlatform;
  onDeny: () => void;
  onAllow: () => void;
}

const ConnectAccountModal: React.FC<ConnectAccountModalProps> = ({ isVisible, platform, onDeny, onAllow }) => {
  if (!isVisible) return null;
  const details = platformDetails[platform];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in" aria-modal="true" role="dialog">
      <div className="bg-white rounded-[2.5rem] w-full max-w-sm text-center p-8 shadow-2xl border border-gray-100 animate-scale-in flex flex-col items-center">
        <div className={`w-24 h-24 ${details.bg} rounded-3xl flex items-center justify-center mb-8 border-4 ${details.color} shadow-lg shadow-black/5`}>
          <img src={details.logo} alt={details.name} className="w-12 h-12" />
        </div>
        
        <h2 className="text-2xl font-black text-gray-900 mb-2 leading-tight">Vincular Conta {details.name}</h2>
        <p className="text-gray-500 mb-8 text-sm font-medium leading-relaxed px-2">
            Isso permite que cada play conte como view oficial para o artista.
        </p>

        <div className="bg-gray-50 w-full rounded-2xl p-5 text-left space-y-4 mb-10 border border-gray-100 shadow-inner">
            <div className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
                    <Icon name="check" className="w-3.5 h-3.5 text-green-600 stroke-[4]"/>
                </div>
                <p className="text-xs text-gray-600 font-bold">Ver sua atividade de reprodução</p>
            </div>
            <div className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
                    <Icon name="check" className="w-3.5 h-3.5 text-green-600 stroke-[4]"/>
                </div>
                <p className="text-xs text-gray-600 font-bold">Sincronizar curtidas e playlists</p>
            </div>
        </div>

        <p className="text-[10px] text-gray-400 mb-8 font-black uppercase tracking-widest px-4">
            Você pode revogar este acesso a qualquer momento nas suas configurações.
        </p>
        
        <div className="w-full space-y-3">
             <button
                onClick={onAllow}
                className="w-full bg-gray-900 text-white font-black py-4 px-4 rounded-2xl hover:bg-black transition-all shadow-xl active:scale-95"
            >
                Confirmar e Vincular
            </button>
            <button
                onClick={onDeny}
                className="w-full bg-transparent text-gray-400 font-black py-3 px-4 rounded-xl hover:text-gray-600 transition-colors text-xs uppercase tracking-widest"
            >
                Agora não
            </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectAccountModal;
