
import React from 'react';
import { Artist } from '../types';
import Icon from './Icon';

interface PaymentSuccessModalProps {
  isVisible: boolean;
  artist: Artist;
  onConfirm: () => void;
  isNewUser: boolean;
}

const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({ isVisible, artist, onConfirm, isNewUser }) => {
  if (!isVisible) return null;
  
  const buttonText = isNewUser ? 'Criar Meu Perfil!' : 'Ir para o Fã Clube';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in" aria-modal="true" role="dialog">
      <div className="bg-white rounded-[2.5rem] w-full max-w-sm text-center p-8 shadow-2xl border border-gray-100 animate-scale-in flex flex-col items-center">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 border-4 border-green-100 shadow-inner">
            <Icon name="check-circle" className="w-12 h-12 text-green-500 stroke-[3]" />
        </div>
        
        <h2 className="text-2xl font-black text-gray-900 mb-2">Assinatura Ativa!</h2>
        <p className="text-gray-500 mb-8 font-medium text-sm leading-relaxed">Agora você é um membro oficial do<br/><span className="font-black text-rose-500 uppercase tracking-wider">{artist.name}</span>!</p>

        <div className="relative mb-10 group">
            <img src={artist.profileImageUrl} alt={artist.name} className="w-28 h-28 rounded-full border-4 border-white shadow-xl object-cover" />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg border-2 border-white uppercase tracking-widest">Membro</div>
        </div>
        
        <button
          onClick={onConfirm}
          className="w-full bg-gray-900 text-white font-black py-4 px-4 rounded-2xl hover:bg-black transition-all shadow-xl active:scale-95"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessModal;
