
import React from 'react';
import { Button } from './ui/button';
import { ModalBody, ModalFooter, ModalShell, ModalTitle } from './ui/modal-shell';

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
    <ModalShell open={isVisible} onClose={onClose} variant="dialog" className="max-w-sm text-center">
      <ModalBody className="flex flex-col items-center p-8">
        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6 border-4 border-rose-100 shadow-inner">
            <span className="text-5xl animate-pulse">✨</span>
        </div>
        
        <ModalTitle className="mb-2 text-2xl">Você ganhou pontos!</ModalTitle>
        <p className="text-gray-500 mb-8 font-medium text-sm leading-relaxed">{reason}</p>
        
        <div className="bg-gray-50 rounded-2xl p-6 w-full mb-8 border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Fan Points Acumulados</p>
            <p className="text-4xl font-black text-rose-500">+{points}</p>
        </div>

      </ModalBody>
      <ModalFooter className="border-t-0 px-8 pb-8 pt-0">
        <Button
            onClick={onClose}
            className="w-full rounded-2xl py-6 text-sm font-black"
        >
            Incrível!
        </Button>
      </ModalFooter>
    </ModalShell>
  );
};

export default PointsAwardedModal;
