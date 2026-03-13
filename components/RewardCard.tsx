
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
    let eligibilityText = '';
    let eligibilityTag = '';

    switch (reward.type) {
        case RewardType.SWEEPSTAKE:
            typeLabel = 'SORTEIO EXCLUSIVO';
            eligibilityText = `TOP ${reward.eligibility.rank}`;
            eligibilityTag = isEligible ? 'VOCÊ ESTÁ PARTICIPANDO' : 'NÃO ELEGÍVEL';
            break;
        case RewardType.PRIZE:
            typeLabel = 'PRÊMIO EXCLUSIVO';
            eligibilityText = `TOP ${reward.eligibility.rank}`;
            eligibilityTag = isEligible ? 'ELEGÍVEL' : 'NÃO ELEGÍVEL';
            break;
        case RewardType.OFFER:
            typeLabel = 'OFERTA EXCLUSIVA';
            eligibilityText = `${reward.eligibility.points?.toLocaleString('pt-BR')} PONTOS`;
            eligibilityTag = isEligible ? 'DESBLOQUEADA' : 'BLOQUEADA';
            break;
    }

    return (
        <button
            onClick={onClick}
            className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden w-full text-left hover:border-orange-500 transition-colors group"
        >
            <div className="relative">
                <img src={reward.imageUrl} alt={reward.title} className="w-full h-32 object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className={`absolute top-2 right-2 px-2.5 py-1 text-xs font-bold rounded-full ${isEligible ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'}`}>
                    {eligibilityTag}
                </div>
            </div>
            <div className="p-4">
                <p className="text-xs font-bold text-orange-400">{typeLabel}: {eligibilityText}</p>
                <h4 className="text-lg font-bold text-white mt-1">{reward.title}</h4>
                <p className="text-sm text-gray-400 mt-2 h-10 overflow-hidden">{reward.description}</p>
            </div>
        </button>
    );
};

export default React.memo(RewardCard);
