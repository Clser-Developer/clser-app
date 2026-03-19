
import React from 'react';
import { ExclusiveReward, RewardType, FanProfile } from '../types';
import Icon from './Icon';
import { Button } from './ui/button';
import { ModalBody, ModalCloseButton, ModalFooter, ModalHeader, ModalShell, ModalTitle } from './ui/modal-shell';

interface RewardDetailsModalProps {
  reward: ExclusiveReward;
  fanPoints: number;
  currentUserRank: number | null;
  leaderboard: FanProfile[];
  onClose: () => void;
}

const EligibilityCheck: React.FC<{
    reward: ExclusiveReward;
    fanPoints: number;
    currentUserRank: number | null;
    isEligible: boolean;
}> = ({ reward, fanPoints, currentUserRank, isEligible }) => {
    let requirementText = '';
    let userStatusText = '';

    if (reward.type === RewardType.OFFER) {
        requirementText = `Requer ${reward.eligibility.points?.toLocaleString('pt-BR')} pontos`;
        userStatusText = `Você tem ${fanPoints.toLocaleString('pt-BR')} pontos`;
    } else {
        requirementText = `Elegível para o Top ${reward.eligibility.rank}`;
        userStatusText = currentUserRank ? `Sua posição: #${currentUserRank}` : 'Calculando...';
    }

    return (
        <div className={`p-4 rounded-2xl border-2 transition-colors ${isEligible ? 'border-green-500 bg-green-50' : 'border-gray-100 bg-gray-50'}`}>
            <div className="flex items-start">
                <div className={`p-1.5 rounded-full mr-3 mt-0.5 ${isEligible ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    <Icon name={isEligible ? 'check' : 'close'} className="w-4 h-4" />
                </div>
                <div>
                    <p className={`font-bold text-sm ${isEligible ? 'text-green-700' : 'text-gray-700'}`}>{isEligible ? 'Você está elegível!' : 'Você ainda não está elegível'}</p>
                    <p className="text-xs text-gray-500 mt-0.5 font-medium">{requirementText}</p>
                    <p className="text-xs text-gray-500 font-medium">{userStatusText}</p>
                </div>
            </div>
        </div>
    );
};

const EligibleFansList: React.FC<{ reward: ExclusiveReward; leaderboard: FanProfile[] }> = ({ reward, leaderboard }) => {
    if (reward.type === RewardType.OFFER || !reward.eligibility.rank) {
        return null;
    }

    const eligibleFans = leaderboard.slice(0, reward.eligibility.rank);
    if (eligibleFans.length === 0) return null;

    return (
        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Fãs Elegíveis</h4>
            <div className="space-y-4 max-h-64 overflow-y-auto no-scrollbar">
                {eligibleFans.map((fan, index) => {
                    const isCurrentUser = fan.isCurrentUser;
                    return (
                        <div 
                            key={fan.id}
                            className={`flex items-center space-x-3 p-2 rounded-xl transition-all ${isCurrentUser ? 'bg-rose-50 shadow-inner' : ''}`}
                        >
                            <span className={`text-sm font-black w-6 text-center ${isCurrentUser ? 'text-rose-500' : 'text-gray-400'}`}>{index + 1}</span>
                            <img src={fan.profileImageUrl} alt={fan.name} className={`w-8 h-8 rounded-full object-cover border-2 ${isCurrentUser ? 'border-rose-500' : 'border-white'}`} />
                            <div className="font-bold text-sm text-gray-900 flex-1 flex items-center">
                                <span>{fan.name}</span>
                                {isCurrentUser && (
                                    <span className="ml-2 bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">VOCÊ</span>
                                )}
                            </div>
                            <p className="text-xs text-rose-500 font-black tabular-nums">{fan.fanPoints.toLocaleString('pt-BR')} pts</p>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

const RewardDetailsModal: React.FC<RewardDetailsModalProps> = ({ reward, fanPoints, currentUserRank, leaderboard, onClose }) => {
    
    let isEligible = false;
    if (reward.type === RewardType.OFFER) {
        isEligible = fanPoints >= (reward.eligibility.points || Infinity);
    } else {
        isEligible = currentUserRank !== null && currentUserRank > 0 && currentUserRank <= (reward.eligibility.rank || 0);
    }
    
    const typeMap = {
        [RewardType.SWEEPSTAKE]: { label: 'Sorteio Exclusivo', color: 'bg-blue-100 text-blue-700' },
        [RewardType.PRIZE]: { label: 'Prêmio Especial', color: 'bg-yellow-100 text-yellow-700' },
        [RewardType.OFFER]: { label: 'Oferta da Loja', color: 'bg-green-100 text-green-700' }
    };

    return (
        <ModalShell open={true} onClose={onClose} variant="dialog" className="max-h-[90vh] max-w-md flex flex-col">
            <ModalHeader className="p-5">
                <ModalTitle className="text-xl">Recompensa</ModalTitle>
                <ModalCloseButton onClick={onClose} />
            </ModalHeader>
            <ModalBody className="overflow-y-auto space-y-6 no-scrollbar">
                    <div className="relative rounded-2xl overflow-hidden aspect-video shadow-md">
                        <img src={reward.imageUrl} alt={reward.title} className="w-full h-full object-cover" />
                        <div className={`absolute top-3 left-3 px-3 py-1.5 text-[10px] font-black rounded-full shadow-lg ${typeMap[reward.type].color}`}>
                            {typeMap[reward.type].label}
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 leading-tight">{reward.title}</h3>
                        <p className="text-gray-500 mt-2 text-sm leading-relaxed font-medium">{reward.description}</p>
                    </div>
                    
                    <EligibilityCheck
                        reward={reward}
                        fanPoints={fanPoints}
                        currentUserRank={currentUserRank}
                        isEligible={isEligible}
                    />

                    <EligibleFansList reward={reward} leaderboard={leaderboard} />
            </ModalBody>
            <ModalFooter className="bg-gray-50/50 p-5">
                    <Button
                        onClick={onClose} 
                        className="w-full rounded-2xl py-6 text-sm font-black"
                    >
                        {isEligible && reward.type === RewardType.OFFER ? 'Resgatar Agora' : 'Entendi!'}
                    </Button>
            </ModalFooter>
        </ModalShell>
    );
};

export default RewardDetailsModal;
