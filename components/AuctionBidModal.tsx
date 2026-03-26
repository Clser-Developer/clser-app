
import React from 'react';
import { AuctionItem } from '../types';
import Icon from './Icon';
import { Button } from './ui/button';
import { ModalBody, ModalCloseButton, ModalFooter, ModalHeader, ModalShell, ModalTitle } from './ui/modal-shell';

interface AuctionBidModalProps {
  item: AuctionItem;
  onClose: () => void;
  onConfirmBid: (auctionItem: AuctionItem) => void;
}

const AuctionBidModal: React.FC<AuctionBidModalProps> = ({ item, onClose, onConfirmBid }) => {
    const nextBidAmount = item.currentBid + item.bidIncrement;
    const handleConfirm = () => onConfirmBid(item);

    return (
        <ModalShell open={true} onClose={onClose} variant="sheet" closeOnOverlayClick>
                <ModalHeader>
                    <ModalTitle className="ml-1">Confirmar Lance</ModalTitle>
                    <ModalCloseButton onClick={onClose} />
                </ModalHeader>
                <ModalBody className="space-y-8">
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
                </ModalBody>
                <ModalFooter className="bg-gray-50/50 safe-bottom-pad">
                    <Button
                        onClick={handleConfirm}
                        className="w-full rounded-2xl py-6 text-sm font-black"
                    >
                        Confirmar e Continuar
                    </Button>
                </ModalFooter>
        </ModalShell>
    );
};

export default AuctionBidModal;
