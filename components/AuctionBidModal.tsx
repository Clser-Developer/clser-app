
import React from 'react';
import { AuctionItem } from '../types';
import Icon from './Icon';

interface AuctionBidModalProps {
  item: AuctionItem;
  onClose: () => void;
  onConfirmBid: (auctionItem: AuctionItem) => void;
}

const AuctionBidModal: React.FC<AuctionBidModalProps> = ({ item, onClose, onConfirmBid }) => {
    const nextBidAmount = item.currentBid + item.bidIncrement;
    const handleConfirm = () => onConfirmBid(item);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-end justify-center" aria-modal="true" role="dialog">
            <div className="bg-white rounded-t-[2.5rem] w-full max-w-md shadow-2xl border-t border-gray-100 animate-slide-up flex flex-col">
                <header className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900 ml-4">Confirmar Lance</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100">
                        <Icon name="close" className="w-6 h-6" />
                    </button>
                </header>
                <div className="p-6 space-y-8">
                    <div className="flex items-center space-x-5">
                        <img src={item.imageUrl} alt={item.name} className="w-24 h-24 rounded-2xl object-cover flex-shrink-0 border border-gray-100 shadow-sm" />
                        <div className="flex-1 min-w-0">
                            <p className="font-black text-gray-900 text-lg leading-tight line-clamp-2">{item.name}</p>
                            <div className="flex items-center gap-1.5 mt-1.5">
                                <span className="text-xs font-bold text-gray-400 uppercase">Lance atual:</span>
                                <span className="text-sm font-black text-rose-500">R$ {item.currentBid.toFixed(2).replace('.', ',')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 text-center shadow-inner">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Seu lance será de:</p>
                        <p className="text-5xl font-black text-gray-900 my-3 tabular-nums">R$ {nextBidAmount.toFixed(2).replace('.', ',')}</p>
                        <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                            <Icon name="plus" className="w-3 h-3 mr-1" />
                            R$ {item.bidIncrement.toFixed(2).replace('.', ',')} mínimo
                        </div>
                    </div>

                    <div className="flex items-start space-x-3 bg-rose-50 p-4 rounded-2xl border border-rose-100">
                        <Icon name="lock-closed" className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-rose-700 font-medium leading-relaxed">
                            Ao confirmar, você se compromete com este lance se for o vencedor ao final do leilão. O valor só será debitado caso você ganhe.
                        </p>
                    </div>
                </div>
                <div className="p-6 bg-gray-50/50 pb-24 border-t border-gray-100">
                    <button
                        onClick={handleConfirm}
                        className="w-full bg-gray-900 text-white font-black py-4 px-4 rounded-2xl hover:bg-black transition-all shadow-xl shadow-black/10 active:scale-95"
                    >
                        Confirmar e Continuar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuctionBidModal;