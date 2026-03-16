
import React from 'react';
import Icon from './Icon';

interface PointsAwardedModalProps {
  isVisible: boolean;
  points: number;
  reason: string;
  onClose: () => void;
}

const PointsAwardedModal: React.FC<PointsAwardedModalProps> = ({
  isVisible,
  points,
  reason,
  onClose,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" aria-modal="true" role="dialog">
      <div className="bg-white rounded-3xl w-full max-w-sm text-center p-8 shadow-2xl border border-gray-100 animate-scale-in-bounce flex flex-col items-center">
        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6 border-4 border-rose-100 shadow-inner">
            <span className="text-5xl animate-pulse">✨</span>
        </div>
        
        <h2 className="text-2xl font-black text-gray-900 mb-2">Você ganhou pontos!</h2>
        <p className="text-gray-500 mb-8 font-medium text-sm leading-relaxed">{reason}</p>
        
        <div className="bg-gray-50 rounded-2xl p-6 w-full mb-8 border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Fan Points Acumulados</p>
            <p className="text-4xl font-black text-rose-500">+{points}</p>
        </div>
        
        <button
            onClick={onClose}
            className="w-full bg-rose-500 text-white font-black py-4 px-4 rounded-2xl hover:bg-rose-600 transition-transform shadow-xl shadow-rose-500/20"
        >
            Incrível!
        </button>
      </div>
    </div>
  );
};

export default PointsAwardedModal;
