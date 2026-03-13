
import React, { useState } from 'react';
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

interface SimulatedLoginModalProps {
  isVisible: boolean;
  platform: MediaPlatform;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const SimulatedLoginModal: React.FC<SimulatedLoginModalProps> = ({ isVisible, platform, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isVisible) return null;

  const details = platformDetails[platform];
  const canSubmit = email.trim() !== '' && password.trim() !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) {
      onLoginSuccess();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in" aria-modal="true" role="dialog">
      <div className="bg-gray-800 rounded-2xl w-full max-w-sm p-8 shadow-2xl border border-gray-700 animate-scale-in flex flex-col items-center">
        <button onClick={onClose} className="absolute top-3 right-3 p-2 rounded-full text-gray-400 hover:bg-gray-700">
            <Icon name="close" className="w-5 h-5" />
        </button>

        <img src={details.logo} alt={details.name} className="w-12 h-12 mb-4" />
        
        <h2 className="text-2xl font-bold text-white mb-2">Fazer login</h2>
        <p className="text-gray-300 mb-6 text-sm">
            Use sua conta {details.name}
        </p>
        
        <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div>
                <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email ou telefone"
                    className="w-full bg-gray-700 border-gray-600 rounded-md p-3 text-white focus:ring-magenta-500 focus:border-magenta-500"
                />
            </div>
             <div>
                <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Senha"
                    className="w-full bg-gray-700 border-gray-600 rounded-md p-3 text-white focus:ring-magenta-500 focus:border-magenta-500"
                />
            </div>
             <div className="pt-4">
                 <button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    Fazer Login
                </button>
            </div>
        </form>
         <p className="text-xs text-gray-500 mt-4 text-center">
            Esta é uma tela de login simulada para fins de demonstração.
        </p>
      </div>
    </div>
  );
};

export default SimulatedLoginModal;
