
import React from 'react';
import Icon from './Icon';
import { MediaPlatform } from '../types';

const platformDetails = {
    [MediaPlatform.YOUTUBE]: {
        name: 'YouTube',
        logo: 'https://www.logo.wine/a/logo/YouTube/YouTube-Icon-Full-Color-Logo.wine.svg',
        color: 'border-red-500',
    },
    [MediaPlatform.SPOTIFY]: {
        name: 'Spotify',
        logo: 'https://www.logo.wine/a/logo/Spotify/Spotify-Icon-Logo.wine.svg',
        color: 'border-green-500',
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
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in" aria-modal="true" role="dialog">
      <div className="bg-gray-800 rounded-2xl w-full max-w-sm text-center p-8 shadow-2xl border border-gray-700 animate-scale-in flex flex-col items-center">
        <div className={`w-20 h-20 bg-gray-900/50 rounded-full flex items-center justify-center mb-6 border-4 ${details.color}`}>
          <img src={details.logo} alt={details.name} className="w-10 h-10" />
        </div>
        
        <h2 className="text-xl font-bold text-white mb-2">Superfans quer acessar sua conta {details.name}</h2>
        <p className="text-gray-300 mb-6 text-sm">
            Isso permitirá que o Superfans:
        </p>
        <ul className="text-left text-sm text-gray-300 space-y-2 mb-8 w-full pl-4">
            <li className="flex items-start"><Icon name="check" className="w-4 h-4 text-green-400 mr-2 mt-0.5"/> Veja sua atividade de reprodução.</li>
            <li className="flex items-start"><Icon name="check" className="w-4 h-4 text-green-400 mr-2 mt-0.5"/> Interaja com conteúdo (curtir, comentar).</li>
        </ul>
        <p className="text-gray-400 mb-8 text-xs">
            Você pode revogar esse acesso a qualquer momento nas configurações da sua conta {details.name}.
        </p>
        
        <div className="w-full space-y-3">
             <button
                onClick={onAllow}
                className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition-transform hover:scale-105 transform-gpu"
            >
                Permitir
            </button>
            <button
                onClick={onDeny}
                className="w-full bg-transparent text-gray-400 font-bold py-3 px-4 rounded-lg hover:bg-gray-700/50 transition-colors"
            >
                Cancelar
            </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectAccountModal;
