
import React from 'react';
import { ExclusiveReward, RewardType } from '../types';
import Icon from './Icon';

interface RewardCardProps {
    reward: ExclusiveReward;
    isEligible: boolean;
    onClick: () => void;
}

const RewardCard: React.FC<RewardCardProps> = ({ reward, isEligible, onClick }) => {
    let typeLabel = '';
    let eligibilityTag = '';

    switch (reward.type) {
        case RewardType.SWEEPSTAKE:
            typeLabel = 'SORTEIO EXCLUSIVO';
            eligibilityTag = isEligible ? 'VOCÊ ESTÁ PARTICIPANDO' : 'NÃO ELEGÍVEL';
            break;
        case RewardType.PRIZE:
            typeLabel = 'PRÊMIO EXCLUSIVO';
            eligibilityTag = isEligible ? 'ELEGÍVEL' : 'NÃO ELEGÍVEL';
            break;
        case RewardType.OFFER:
            typeLabel = 'OFERTA EXCLUSIVA';
            eligibilityTag = isEligible ? 'DESBLOQUEADA' : 'BLOQUEADA';
            break;
    }

    return (
        <button
            onClick={onClick}
            className="bg-white rounded-3xl border border-gray-100 overflow-hidden w-full text-left hover:border-rose-200 transition-all group shadow-sm hover:shadow-md"
        >
            <div className="relative aspect-[16/9]">
                <img src={reward.imageUrl} alt={reward.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className={`absolute top-3 right-3 px-2.5 py-1 text-[10px] font-bold rounded-full shadow-sm backdrop-blur-md ${isEligible ? 'bg-green-500/90 text-white' : 'bg-gray-900/60 text-white/80'}`}>
                    {eligibilityTag}
                </div>
            </div>
            <div className="p-5">
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{typeLabel}</p>
                <h4 className="text-lg font-bold text-gray-900 mt-1">{reward.title}</h4>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">{reward.description}</p>
            </div>
        </button>
    );
};

export default React.memo(RewardCard);
