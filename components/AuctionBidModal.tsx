
import React, { useState } from 'react';
import { AuctionItem } from '../types';
import Icon from './Icon';

interface AuctionBidModalProps {
  item: AuctionItem;
  onClose: () => void;
  onConfirmBid: (auctionId: string) => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
);

const AuctionBidModal: React.FC<AuctionBidModalProps> = ({ item, onClose, onConfirmBid }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const nextBidAmount = item.currentBid + item.bidIncrement;

    const handleConfirm = () => {
        setIsProcessing(true);
        // Simulate network delay
        setTimeout(() => {
            onConfirmBid(item.id);
            // The modal will be closed by the parent component
        }, 1500);
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center" aria-modal="true" role="dialog">
            <div className="bg-gray-800 rounded-t-2xl w-full max-w-md shadow-2xl border-t border-gray-700 animate-slide-up">
                <header className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-white">Confirmar Lance</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-700" disabled={isProcessing}>
                        <Icon name="close" className="w-6 h-6" />
                    </button>
                </header>
                <div className="p-6">
                    <div className="flex items-start space-x-4 mb-6">
                        <img src={item.imageUrl} alt={item.name} className="w-24 h-24 rounded-lg object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-white">{item.name}</p>
                            <p className="text-sm text-gray-400 mt-1">Lance atual: <span className="font-bold text-white">R$ {item.currentBid.toFixed(2).replace('.', ',')}</span></p>
                        </div>
                    </div>

                    <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-300">Seu lance será de:</p>
                        <p className="text-4xl font-black text-orange-400 my-2">R$ {nextBidAmount.toFixed(2).replace('.', ',')}</p>
                        <p className="text-xs text-gray-500">(Lance mínimo: + R$ {item.bidIncrement.toFixed(2).replace('.', ',')})</p>
                    </div>

                    <p className="text-xs text-gray-500 text-center mt-6">
                        Ao confirmar, você se compromete com este lance se for o vencedor ao final do leilão.
                    </p>
                </div>
                <div className="p-4 bg-gray-900/50">
                    <button
                        onClick={handleConfirm}
                        disabled={isProcessing}
                        className="w-full bg-orange-500 text-white font-bold py-4 px-4 rounded-lg hover:bg-orange-600 transition-transform hover:scale-105 transform-gpu disabled:bg-orange-700 disabled:cursor-not-allowed disabled:scale-100 flex justify-center items-center focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        {isProcessing ? <LoadingSpinner /> : 'Confirmar Lance'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuctionBidModal;