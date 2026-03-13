
import React, { useState, useEffect } from 'react';
import { AuctionItem } from '../types';

const useCountdown = (endTime: string) => {
    const countDownDate = new Date(endTime).getTime();

    const [countDown, setCountDown] = useState(
        countDownDate - new Date().getTime()
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setCountDown(countDownDate - new Date().getTime());
        }, 1000);

        return () => clearInterval(interval);
    }, [countDownDate]);

    return getReturnValues(countDown);
};

const getReturnValues = (countDown: number) => {
    if (countDown < 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isFinished: true };
    }
    const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isFinished: false };
};

const CountdownTimer: React.FC<{ endTime: string }> = ({ endTime }) => {
    const { days, hours, minutes, seconds, isFinished } = useCountdown(endTime);

    if (isFinished) {
        return <div className="text-center font-bold text-red-400">Leilão Encerrado</div>;
    }

    return (
        <div className="flex justify-center space-x-2 text-white tabular-nums">
            {days > 0 && <div><span className="text-2xl font-bold">{String(days).padStart(2, '0')}</span><span className="text-xs">d</span></div>}
            <div><span className="text-2xl font-bold">{String(hours).padStart(2, '0')}</span><span className="text-xs">h</span></div>
            <div><span className="text-2xl font-bold">{String(minutes).padStart(2, '0')}</span><span className="text-xs">m</span></div>
            <div><span className="text-2xl font-bold">{String(seconds).padStart(2, '0')}</span><span className="text-xs">s</span></div>
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
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700/50 flex flex-col">
        <div className="w-full overflow-hidden aspect-video">
            <img src={auction.imageUrl} alt={auction.name} className="w-full h-full object-cover" />
        </div>
        <div className="p-4">
            <h3 className="text-lg font-bold text-white truncate">{auction.name}</h3>
            <p className="text-sm text-gray-400 mt-1 h-10">{auction.description}</p>
            
            <div className="my-4 p-3 bg-gray-900/50 rounded-lg">
                <p className="text-xs text-orange-400 font-semibold">LANCE ATUAL</p>
                <p className="text-2xl font-bold text-white">R$ {auction.currentBid.toFixed(2).replace('.', ',')}</p>
                <p className="text-xs text-gray-400">Maior lance de: {auction.highestBidderName}</p>
            </div>
            
            <div className="my-4 p-3 bg-gray-900/50 rounded-lg text-center">
                <p className="text-xs text-orange-400 font-semibold mb-2">TERMINA EM</p>
                <CountdownTimer endTime={auction.endTime} />
            </div>

            <button
                onClick={() => onPlaceBid(auction.id)}
                disabled={isFinished}
                className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-md hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 disabled:bg-gray-600 disabled:cursor-not-allowed">
                {isFinished ? 'Leilão Encerrado' : 'Dar Lance'}
            </button>
        </div>
    </div>
  );
};

export default React.memo(AuctionCard);
