
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
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-gray-800 rounded-2xl w-full max-w-sm shadow-2xl border border-gray-700 animate-scale-in flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="relative flex-shrink-0">
          <img src={benefit.imageUrl} alt={benefit.title} className="w-full h-48 object-cover rounded-t-2xl" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
            aria-label="Fechar"
          >
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>
        <div className="p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold text-white mb-4">{benefit.title}</h2>
          <p className="text-gray-300 leading-relaxed">{benefit.fullDescription}</p>
        </div>
        <footer className="p-4 mt-auto bg-gray-900/50 rounded-b-2xl flex-shrink-0">
          <button
            onClick={handleSubscribeClick}
            className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition-transform hover:scale-105"
          >
            Assine agora
          </button>
        </footer>
      </div>
    </div>
  );
};

export default BenefitDetailModal;