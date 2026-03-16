
import React from 'react';
import Icon from './Icon';

export interface Benefit {
  title: string;
  shortDescription: string;
  imageUrl: string;
  fullDescription: string;
}

interface BenefitDetailModalProps {
  benefit: Benefit | null;
  onClose: () => void;
  onSubscribe: () => void;
}

const BenefitDetailModal: React.FC<BenefitDetailModalProps> = ({ benefit, onClose, onSubscribe }) => {
  if (!benefit) return null;

  const handleSubscribeClick = () => {
    onSubscribe();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-[2.5rem] w-full max-w-sm shadow-2xl border border-gray-100 animate-scale-in flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="relative flex-shrink-0">
          <img src={benefit.imageUrl} alt={benefit.title} className="w-full h-56 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-full text-gray-500 hover:text-gray-900 transition-colors shadow-sm"
            aria-label="Fechar"
          >
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>
        <div className="p-8 pt-2 overflow-y-auto no-scrollbar">
          <h2 className="text-2xl font-black text-gray-900 mb-4 leading-tight">{benefit.title}</h2>
          <p className="text-gray-500 leading-relaxed font-medium text-sm">{benefit.fullDescription}</p>
        </div>
        <footer className="p-6 mt-auto bg-gray-50 border-t border-gray-100 flex-shrink-0 pb-10">
          <button
            onClick={handleSubscribeClick}
            className="w-full bg-rose-500 text-white font-black py-4 px-4 rounded-2xl hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20 active:scale-95"
          >
            Acessar Agora (Grátis)
          </button>
        </footer>
      </div>
    </div>
  );
};

export default BenefitDetailModal;
