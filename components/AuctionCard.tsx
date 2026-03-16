
import React, { useState, useEffect } from 'react';
import { AuctionItem } from '../types';
import Icon from './Icon';

const useCountdown = (endTime: string) => {
    const countDownDate = new Date(endTime).getTime();
    const [countDown, setCountDown] = useState(countDownDate - new Date().getTime());

    useEffect(() => {
        const interval = setInterval(() => {
            setCountDown(countDownDate - new Date().getTime());
        }, 1000);
        return () => clearInterval(interval);
    }, [countDownDate]);

    return getReturnValues(countDown);
};

const getReturnValues = (countDown: number) => {
    if (countDown < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isFinished: true };
    const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
    const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countDown % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds, isFinished: false };
};

const CountdownTimer: React.FC<{ endTime: string }> = ({ endTime }) => {
    const { days, hours, minutes, seconds, isFinished } = useCountdown(endTime);

    if (isFinished) {
        return <div className="text-center font-bold text-red-500 text-xs uppercase tracking-wider">Leilão Encerrado</div>;
    }

    return (
        <div className="flex justify-center space-x-2 text-gray-900 tabular-nums font-black text-lg">
            {days > 0 && <div><span>{String(days).padStart(2, '0')}</span><span className="text-[10px] uppercase ml-0.5">d</span></div>}
            <div><span>{String(hours).padStart(2, '0')}</span><span className="text-[10px] uppercase ml-0.5">h</span></div>
            <div><span>{String(minutes).padStart(2, '0')}</span><span className="text-[10px] uppercase ml-0.5">m</span></div>
            <div className="text-rose-500"><span>{String(seconds).padStart(2, '0')}</span><span className="text-[10px] uppercase ml-0.5">s</span></div>
        </div>
    );
};

interface AuctionCardProps {
  auction: AuctionItem;
  onPlaceBid: (auctionId: string) => void;
}

const AuctionCard: React.FC<AuctionCardProps> = ({ auction, onPlaceBid }) => {
  const isFinished = new Date(auction.endTime).getTime() < Date.now();
  
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col group">
        <div className="relative aspect-video">
            <img src={auction.imageUrl} alt={auction.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
                <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Leilão Ativo</span>
            </div>
        </div>
        <div className="p-5">
            <h3 className="text-xl font-black text-gray-900 truncate">{auction.name}</h3>
            <p className="text-xs text-gray-500 mt-1 font-medium line-clamp-2 leading-relaxed">{auction.description}</p>
            
            <div className="my-5 grid grid-cols-2 gap-3">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Lance Atual</p>
                    <p className="text-xl font-black text-rose-500">R$ {auction.currentBid.toFixed(2).replace('.', ',')}</p>
                    <p className="text-[9px] text-gray-500 font-bold mt-1 truncate">De: {auction.highestBidderName}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col justify-center items-center">
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Encerra em</p>
                    <CountdownTimer endTime={auction.endTime} />
                </div>
            </div>

            <button
                onClick={() => onPlaceBid(auction.id)}
                disabled={isFinished}
                className="w-full bg-rose-500 text-white font-black py-4 px-4 rounded-2xl hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
            >
                {isFinished ? 'Leilão Encerrado' : 'Dar um Lance'}
            </button>
        </div>
    </div>
  );
};

export default React.memo(AuctionCard);
