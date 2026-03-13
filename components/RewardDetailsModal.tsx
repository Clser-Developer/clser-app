
import React from 'react';
import { ExclusiveReward, RewardType, FanProfile } from '../types';
import Icon from './Icon';

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
        userStatusText = currentUserRank ? `Sua posição: #${currentUserRank}` : 'Calculando sua posição...';
    }

    return (
        <div className={`p-4 rounded-lg border-2 ${isEligible ? 'border-green-500 bg-green-500/10' : 'border-gray-600 bg-gray-700/50'}`}>
            <div className="flex items-start">
                <Icon name={isEligible ? 'check-circle' : 'close'} className={`w-6 h-6 mr-3 flex-shrink-0 mt-0.5 ${isEligible ? 'text-green-400' : 'text-gray-400'}`} />
                <div>
                    <p className={`font-bold ${isEligible ? 'text-white' : 'text-gray-300'}`}>{isEligible ? 'Você está elegível!' : 'Você ainda não está elegível'}</p>
                    <p className="text-sm text-gray-400">{requirementText}</p>
                    <p className="text-sm text-gray-400">{userStatusText}</p>
                </div>
            </div>
        </div>
    );
};

const EligibleFansList: React.FC<{ reward: ExclusiveReward; leaderboard: FanProfile[] }> = ({ reward, leaderboard }) => {
    const userRef = React.useRef<HTMLLIElement>(null);
    
    if (reward.type === RewardType.OFFER || !reward.eligibility.rank) {
        return null;
    }

    const eligibleFans = leaderboard.slice(0, reward.eligibility.rank);

    if (eligibleFans.length === 0) {
        return null;
    }

    return (
        <div className="bg-gray-900/50 p-4 rounded-lg">
            <h4 className="text-md font-bold text-white mb-3">Fãs Elegíveis</h4>
            <ol className="space-y-3 pr-2">
                {eligibleFans.map((fan, index) => {
                    const isCurrentUser = fan.isCurrentUser;
                    return (
                        <li 
                            key={fan.id}
                            ref={isCurrentUser ? userRef : null}
                            className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-300 ${isCurrentUser ? 'bg-magenta-500/20 border border-magenta-500' : 'border border-transparent'}`}
                        >
                            <span className={`text-sm font-bold w-6 text-center ${isCurrentUser ? 'text-magenta-400' : 'text-gray-400'}`}>{index + 1}</span>
                            <img src={fan.profileImageUrl} alt={fan.name} className={`w-8 h-8 rounded-full ${isCurrentUser ? 'border-2 border-magenta-500' : ''}`} />
                            <div className="font-semibold text-sm text-white flex-1 flex items-center">
                                <span>{fan.name}</span>
                                {isCurrentUser && (
                                    <span className="ml-2 bg-orange-400 text-gray-900 text-[10px] font-bold px-2 py-0.5 rounded-full">VOCÊ</span>
                                )}
                            </div>
                            <p className="text-xs text-orange-400 font-bold tabular-nums">{fan.fanPoints.toLocaleString('pt-BR')} pts</p>
                        </li>
                    )
                })}
            </ol>
        </div>
    );
};

const RewardDetailsModal: React.FC<RewardDetailsModalProps> = ({ reward, fanPoints, currentUserRank, leaderboard, onClose }) => {
    
    let isEligible = false;
    if (reward.type === RewardType.OFFER) {
        isEligible = fanPoints >= (reward.eligibility.points || Infinity);
    } else { // SWEEPSTAKE or PRIZE
        isEligible = currentUserRank !== null && currentUserRank > 0 && currentUserRank <= (reward.eligibility.rank || 0);
    }
    
    const typeMap = {
        [RewardType.SWEEPSTAKE]: { label: 'Sorteio Exclusivo', color: 'bg-blue-500/20 text-blue-300' },
        [RewardType.PRIZE]: { label: 'Prêmio Exclusivo', color: 'bg-yellow-500/20 text-yellow-300' },
        [RewardType.OFFER]: { label: 'Oferta Exclusiva', color: 'bg-teal-500/20 text-teal-300' }
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in" aria-modal="true" role="dialog">
            <div className="bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl border border-gray-700 animate-scale-in flex flex-col max-h-[90vh]">
                <header className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-bold text-white">Detalhes da Recompensa</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-700">
                        <Icon name="close" className="w-6 h-6" />
                    </button>
                </header>
                <div className="p-6 overflow-y-auto space-y-4">
                    <div className="relative rounded-lg overflow-hidden aspect-video">
                        <img src={reward.imageUrl} alt={reward.title} className="w-full h-full object-cover" />
                        <div className={`absolute top-2 left-2 px-2.5 py-1 text-xs font-bold rounded-full ${typeMap[reward.type].color}`}>
                            {typeMap[reward.type].label}
                        </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white">{reward.title}</h3>
                    <p className="text-gray-300">{reward.description}</p>
                    
                    <EligibilityCheck
                        reward={reward}
                        fanPoints={fanPoints}
                        currentUserRank={currentUserRank}
                        isEligible={isEligible}
                    />

                    <EligibleFansList reward={reward} leaderboard={leaderboard} />
                </div>
                <footer className="p-4 bg-gray-900/50 flex-shrink-0">
                    <button 
                        onClick={onClose} 
                        className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                        {isEligible && reward.type === RewardType.OFFER ? 'Resgatar Oferta' : 'Entendi!'}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default RewardDetailsModal;