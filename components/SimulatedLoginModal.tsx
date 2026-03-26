
import React, { useState } from 'react';
import Icon from './Icon';
import { MediaPlatform } from '../types';

const platformDetails = {
    [MediaPlatform.YOUTUBE]: {
        name: 'YouTube',
        logo: 'https://www.logo.wine/a/logo/YouTube/YouTube-Icon-Full-Color-Logo.wine.svg',
    },
    [MediaPlatform.SPOTIFY]: {
        name: 'Spotify',
        logo: 'https://www.logo.wine/a/logo/Spotify/Spotify-Icon-Logo.wine.svg',
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
    if (canSubmit) onLoginSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-fade-in" aria-modal="true" role="dialog">
      <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 shadow-2xl border border-gray-100 animate-scale-in flex flex-col items-center relative">
        <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:bg-gray-100 transition-colors">
            <Icon name="close" className="w-5 h-5" />
        </button>

        <img src={details.logo} alt={details.name} className="w-20 h-20 mb-6 drop-shadow-sm" />
        
        <h2 className="text-2xl font-black text-gray-900 mb-1 text-center">Fazer Login</h2>
        <p className="text-gray-500 mb-8 text-sm font-medium text-center leading-relaxed">
            Acesse sua conta {details.name} para sincronizar seus plays oficiais.
        </p>
        
        <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-2">E-mail</label>
                <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemplo@gmail.com"
                    className="w-full bg-gray-50 border-gray-100 border-2 rounded-2xl p-4 text-gray-900 focus:ring-2 focus:ring-rose-500 outline-none shadow-sm font-bold transition-all placeholder-gray-300"
                />
            </div>
             <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-2">Senha</label>
                <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border-gray-100 border-2 rounded-2xl p-4 text-gray-900 focus:ring-2 focus:ring-rose-500 outline-none shadow-sm font-bold transition-all placeholder-gray-300"
                />
            </div>
             <div className="pt-6">
                 <button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-full bg-gray-900 text-white font-black py-4 px-4 rounded-2xl hover:bg-black transition-all disabled:bg-gray-200 disabled:text-gray-400 shadow-xl active:scale-95"
                >
                    Continuar
                </button>
            </div>
        </form>
         <p className="text-[9px] text-gray-400 mt-8 text-center font-black uppercase tracking-[0.2em]">
            Ambiente de Demonstração Seguro
        </p>
      </div>
    </div>
  );
};

export default SimulatedLoginModal;
