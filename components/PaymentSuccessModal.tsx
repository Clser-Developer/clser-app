
import React from 'react';
import { Artist } from '../types';

interface PaymentSuccessModalProps {
  isVisible: boolean;
  artist: Artist;
  onConfirm: () => void;
}

const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({ isVisible, artist, onConfirm }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in" aria-modal="true" role="dialog">
      <div className="bg-gray-800 rounded-2xl w-full max-w-sm text-center p-8 shadow-2xl border border-gray-700 animate-scale-in flex flex-col items-center">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border-4 border-green-500/30">
          <svg className="w-12 h-12 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path className="animate-draw-check" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">Pagamento Aprovado!</h2>
        <p className="text-gray-300 mb-6">Bem-vindo(a) ao Fã Clube de<br/><span className="font-bold text-white">{artist.name}</span>!</p>

        <img src={artist.profileImageUrl} alt={artist.name} className="w-20 h-20 rounded-full mb-8 border-2 border-magenta-500 object-cover" />
        
        <button
          onClick={onConfirm}
          className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition-transform hover:scale-105 transform-gpu"
        >
          Entrar no Fã Clube
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessModal;