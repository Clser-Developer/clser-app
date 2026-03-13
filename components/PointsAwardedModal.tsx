
import React from 'react';

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
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="bg-gray-800 rounded-2xl w-full max-w-sm text-center p-8 shadow-2xl border border-gray-700 animate-scale-in-bounce flex flex-col items-center">
        <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mb-6 border-4 border-orange-500/30">
            <span className="text-4xl animate-pulse">✨</span>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">Você ganhou pontos!</h2>
        <p className="text-gray-300 mb-6 text-sm">{reason}</p>
        
        <div className="bg-gray-700/50 rounded-lg p-3 w-full mb-8">
            <p className="text-3xl font-bold text-orange-400">+{points} Fan Points</p>
        </div>
        
        <div className="w-full space-y-3">
             <button
                onClick={onClose}
                className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition-transform hover:scale-105 transform-gpu"
            >
                Continuar
            </button>
        </div>
      </div>
    </div>
  );
};

export default PointsAwardedModal;