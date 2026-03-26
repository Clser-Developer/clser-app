
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
    <ModalShell open={isVisible} onClose={onClose} variant="dialog" className="max-w-[22rem] text-center">
      <ModalBody className="flex flex-col items-center px-6 pb-4 pt-6">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border-4 border-rose-100 bg-rose-50 shadow-inner">
            <span className="text-4xl animate-pulse">✨</span>
        </div>
        
        <ModalTitle className="mb-1 text-[1.75rem] leading-none">Você ganhou pontos!</ModalTitle>
        <p className="mb-5 text-sm font-medium leading-relaxed text-gray-500">{reason}</p>
        
        <div className="mb-5 w-full rounded-[1.5rem] border border-gray-100 bg-gray-50 px-5 py-4 shadow-inner">
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.22em] text-gray-400">Fan Points Acumulados</p>
            <p className="text-[2.25rem] font-black leading-none text-rose-500">+{points}</p>
        </div>

      </ModalBody>
      <ModalFooter className="border-t-0 bg-background px-6 pb-6 pt-0">
        <Button
            onClick={onClose}
            className="h-12 w-full rounded-2xl text-sm font-black"
        >
            Incrível!
        </Button>
      </ModalFooter>
    </ModalShell>
  );
};

export default PointsAwardedModal;
