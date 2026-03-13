import React, { useState } from 'react';
import { Artist, FanAreaSection, FanProfile, ExclusiveReward, RewardType } from '../../types';
import FanAreaHome from '../FanAreaHome';
import Icon from '../Icon';
import RewardCard from '../RewardCard';
import FanDetailModal from '../FanDetailModal';

const EmptyState: React.FC<{title: string, message: string}> = ({title, message}) => (
  <div className="text-center py-16 px-4 bg-gray-800/50 rounded-lg">
    <h3 className="text-xl font-bold text-white">{title}</h3>
    <p className="text-gray-400 mt-2">{message}</p>
  </div>
);

const FanAreaSubSection: React.FC<{title: string, onBack: () => void, children: React.ReactNode}> = ({ title, onBack, children }) => (
  <div className="p-4 animate-fade-in">
    <div className="flex items-center mb-4">
      <button 
        onClick={onBack} 
        className="p-2 rounded-full text-gray-300 hover:bg-gray-700 mr-2 transition-colors"
        aria-label="Voltar para a Área do Fã"
      >
        <Icon name="arrowLeft" className="w-6 h-6" />
      </button>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
    </div>
    {children}
  </div>
);

const LeaderboardItem: React.FC<{ fan: FanProfile, rank: number, onFanClick: (fan: FanProfile) => void }> = React.memo(({ fan, rank, onFanClick }) => {
  const isCurrentUser = fan.isCurrentUser;
  return (
    <li>
      <button 
        onClick={() => onFanClick(fan)}
        className={`w-full flex items-center space-x-4 p-3 rounded-lg transition-colors border ${isCurrentUser ? 'bg-magenta-600/20 border-magenta-500' : 'border-transparent hover:bg-gray-700/50'}`}
      >
        <span className={`text-lg font-bold w-6 text-center ${isCurrentUser ? 'text-magenta-400' : 'text-gray-400'}`}>{rank}</span>
        <img src={fan.profileImageUrl} alt={fan.name} className={`w-12 h-12 rounded-full object-cover ${isCurrentUser ? 'border-2 border-magenta-500' : ''}`} />
        <div className="flex-1 text-left">
          <div className="flex items-center">
            <p className="font-semibold text-white">{fan.name}</p>
            {isCurrentUser && (
              <span className="ml-2 bg-orange-400 text-gray-900 text-[10px] font-bold px-2 py-0.5 rounded-full">VOCÊ</span>
            )}
          </div>
          <p className="text-sm text-gray-400">{fan.level}</p>
        </div>
        <p className="font-bold text-orange-400 tabular-nums">{fan.fanPoints.toLocaleString('pt-BR')} pts</p>
      </button>
    </li>
  );
});

const LeaderboardView: React.FC<{ leaderboard: FanProfile[], onBack: () => void, onFanClick: (fan: FanProfile) => void }> = ({ leaderboard, onBack, onFanClick }) => {
  const topFans = leaderboard.slice(0, 20);
  const currentUserIndex = leaderboard.findIndex(f => f.isCurrentUser);
  const currentUser = currentUserIndex !== -1 ? leaderboard[currentUserIndex] : null;
  const isCurrentUserInTop = currentUserIndex !== -1 && currentUserIndex < 20;

  return (
    <FanAreaSubSection title="Ranking de Fãs" onBack={onBack}>
      {leaderboard.length > 0 ? (
        <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700">
          <ul className="space-y-1">
            {topFans.map((fan, index) => (
              <LeaderboardItem key={fan.id} fan={fan} rank={index + 1} onFanClick={onFanClick}/>
            ))}
            {!isCurrentUserInTop && currentUser && (
              <>
                <li className="text-center text-gray-500 py-3 flex items-center justify-center space-x-2">
                    <div className="h-px bg-gray-700 flex-1"></div>
                    <span className="text-xs font-bold">...</span>
                    <div className="h-px bg-gray-700 flex-1"></div>
                </li>
                <LeaderboardItem key={currentUser.id} fan={currentUser} rank={currentUserIndex + 1} onFanClick={onFanClick} />
              </>
            )}
          </ul>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-400">Carregando ranking...</p>
        </div>
      )}
    </FanAreaSubSection>
  );
};


const MuralView: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <FanAreaSubSection title="Mural de Fãs" onBack={onBack}>
    <div className="bg-gray-800 border border-yellow-500/50 rounded-lg p-4 mb-6 text-sm text-yellow-200">
      <p className="font-bold mb-2">Aviso de Moderação de Conteúdo</p>
      <p>Ao postar no Mural, você declara ser responsável pelo conteúdo (fotos e vídeos) compartilhado. Todo material passará por uma auditoria automática de nossa IA para prevenir a publicação de conteúdo adulto, falsidade ideológica ou imagens inadequadas. O uso responsável da plataforma é fundamental para mantermos uma comunidade segura e positiva para todos.</p>
    </div>
    <EmptyState title="Em Breve" message="Uma galeria para você compartilhar seus melhores momentos com o artista!" />
  </FanAreaSubSection>
);

const RewardsView: React.FC<{
  onBack: () => void;
  rewards: ExclusiveReward[];
  fanPoints: number;
  leaderboard: FanProfile[];
  onViewRewardDetails: (reward: ExclusiveReward) => void;
}> = ({ onBack, rewards, fanPoints, leaderboard, onViewRewardDetails }) => {
  const currentUserRank = leaderboard.find(f => f.isCurrentUser)?.id
    ? leaderboard.findIndex(f => f.isCurrentUser) + 1
    : null;

  return (
    <FanAreaSubSection title="Recompensas Exclusivas" onBack={onBack}>
      {rewards.length > 0 ? (
        <div className="space-y-4">
          {rewards.map(reward => {
            let isEligible = false;
            if (reward.type === RewardType.OFFER) {
              isEligible = fanPoints >= (reward.eligibility.points || Infinity);
            } else {
              isEligible = currentUserRank !== null && currentUserRank <= (reward.eligibility.rank || 0);
            }
            return (
              <RewardCard
                key={reward.id}
                reward={reward}
                isEligible={isEligible}
                onClick={() => onViewRewardDetails(reward)}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState title="Nenhuma Recompensa" message="Fique de olho! Novas recompensas podem aparecer a qualquer momento." />
      )}
    </FanAreaSubSection>
  );
};

const FanAreaComingSoonView: React.FC<{title: string, onBack: () => void}> = ({title, onBack}) => (
  <FanAreaSubSection title={title} onBack={onBack}>
    <EmptyState title="Em Breve" message="Esta seção está sendo preparada com carinho para você!" />
  </FanAreaSubSection>
);

interface FanAreaViewProps {
    artist: Artist;
    fanAreaSection: FanAreaSection;
    onSectionChange: (section: FanAreaSection) => void;
    leaderboard: FanProfile[];
    rewards: ExclusiveReward[];
    fanPoints: number;
    onViewRewardDetails: (reward: ExclusiveReward) => void;
    onOpenPointsInfoModal: () => void;
}

const FanAreaView: React.FC<FanAreaViewProps> = ({ artist, fanAreaSection, onSectionChange, leaderboard, rewards, fanPoints, onViewRewardDetails, onOpenPointsInfoModal }) => {
    
    const [selectedFan, setSelectedFan] = useState<FanProfile | null>(null);

    const renderContent = () => {
        switch(fanAreaSection) {
            case FanAreaSection.HOME:
                return <FanAreaHome artist={artist} fanPoints={fanPoints} onNavigate={onSectionChange} onOpenPointsInfoModal={onOpenPointsInfoModal} />;
            case FanAreaSection.MURAL:
                return <MuralView onBack={() => onSectionChange(FanAreaSection.HOME)} />;
            case FanAreaSection.LEADERBOARD:
                return <LeaderboardView leaderboard={leaderboard} onBack={() => onSectionChange(FanAreaSection.HOME)} onFanClick={setSelectedFan}/>;
            case FanAreaSection.REWARDS:
                return <RewardsView 
                            rewards={rewards} 
                            fanPoints={fanPoints}
                            leaderboard={leaderboard}
                            onViewRewardDetails={onViewRewardDetails}
                            onBack={() => onSectionChange(FanAreaSection.HOME)} 
                        />;
            case FanAreaSection.GROUPS:
                return <FanAreaComingSoonView title="Grupos de Fãs" onBack={() => onSectionChange(FanAreaSection.HOME)} />;
            case FanAreaSection.POLLS:
                return <FanAreaComingSoonView title="Enquetes da Comunidade" onBack={() => onSectionChange(FanAreaSection.HOME)} />;
            case FanAreaSection.FAN_ART:
                return <FanAreaComingSoonView title="Galeria de Fan Arts" onBack={() => onSectionChange(FanAreaSection.HOME)} />;
            default:
                return <FanAreaHome artist={artist} fanPoints={fanPoints} onNavigate={onSectionChange} onOpenPointsInfoModal={onOpenPointsInfoModal} />;
        }
    }
    
    return (
        <>
            {renderContent()}
            <FanDetailModal fan={selectedFan} onClose={() => setSelectedFan(null)} leaderboard={leaderboard} />
        </>
    )
};

export default FanAreaView;