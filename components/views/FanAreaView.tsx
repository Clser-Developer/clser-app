
import React, { useState } from 'react';
import { Artist, FanAreaSection, FanProfile, ExclusiveReward, RewardType, MuralPost, FanArtPost, FanGroup, Post, StoreSection, Section, PostType } from '../../types';
import FanAreaHome from '../FanAreaHome';
import Icon from '../Icon';
import RewardCard from '../RewardCard';
import FanDetailModal from '../FanDetailModal';
import MuralView from './MuralView';
import FanArtView from './FanArtView';
import FanGroupDetailModal from '../FanGroupDetailModal';
import PostCard from '../PostCard';

interface ImageViewerDetails {
  url: string;
  caption?: string;
  postId?: string;
  isLiked?: boolean;
  likeCount?: number;
}

const EmptyState: React.FC<{title: string, message: string, icon?: string}> = ({title, message, icon}) => (
  <div className="text-center py-16 px-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
    {icon && <Icon name={icon} className="w-12 h-12 mx-auto text-gray-200 mb-4" />}
    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
    <p className="text-gray-500 mt-2 text-sm font-medium leading-relaxed">{message}</p>
  </div>
);

const FanAreaSubSection: React.FC<{title: string, onBack: () => void, children: React.ReactNode}> = ({ title, onBack, children }) => (
  <div className="p-4 animate-fade-in pb-24">
    <div className="flex items-center mb-6">
      <button 
        onClick={onBack} 
        className="p-2 rounded-full text-gray-400 hover:bg-gray-100 mr-2 transition-colors"
        aria-label="Voltar para a Área do Fã"
      >
        <Icon name="arrowLeft" className="w-6 h-6" />
      </button>
      <h2 className="text-2xl font-black text-gray-900">{title}</h2>
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
        className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all border ${isCurrentUser ? 'bg-rose-50 border-rose-100 shadow-inner scale-[1.02]' : 'bg-white border-transparent hover:bg-gray-50'}`}
      >
        <span className={`text-xl font-black w-8 text-center ${isCurrentUser ? 'text-rose-500' : 'text-gray-300'}`}>{rank}</span>
        <img src={fan.profileImageUrl} alt={fan.name} className={`w-12 h-12 rounded-full object-cover border-2 shadow-sm ${isCurrentUser ? 'border-rose-500' : 'border-white'}`} />
        <div className="flex-1 text-left">
          <div className="flex items-center">
            <p className="font-bold text-gray-900 text-sm">{fan.name}</p>
            {isCurrentUser && (
              <span className="ml-2 bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">VOCÊ</span>
            )}
          </div>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-tight">{fan.level}</p>
        </div>
        <div className="text-right">
            <p className="font-black text-rose-500 text-sm">{fan.fanPoints.toLocaleString('pt-BR')}</p>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Pontos</p>
        </div>
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
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-2">
          <ul className="space-y-1">
            {topFans.map((fan, index) => (
              <LeaderboardItem key={fan.id} fan={fan} rank={index + 1} onFanClick={onFanClick}/>
            ))}
            {!isCurrentUserInTop && currentUser && (
              <>
                <li className="text-center text-gray-300 py-4 flex items-center justify-center space-x-2">
                    <div className="h-px bg-gray-100 flex-1"></div>
                    <span className="text-xs font-black">•••</span>
                    <div className="h-px bg-gray-100 flex-1"></div>
                </li>
                <LeaderboardItem key={currentUser.id} fan={currentUser} rank={currentUserIndex + 1} onFanClick={onFanClick} />
              </>
            )}
          </ul>
        </div>
      ) : (
        <div className="flex justify-center p-12">
           <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </FanAreaSubSection>
  );
};


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
    <FanAreaSubSection title="Recompensas" onBack={onBack}>
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
        <EmptyState title="Vazio por enquanto" message="Novas recompensas exclusivas serão adicionadas em breve." />
      )}
    </FanAreaSubSection>
  );
};

const FanGroupCard: React.FC<{ group: FanGroup, isJoined: boolean, onClick: () => void }> = ({ group, isJoined, onClick }) => (
    <button
        onClick={onClick}
        className="bg-white rounded-3xl overflow-hidden border border-gray-100 group w-full text-left focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm hover:shadow-md transition-all"
    >
        <div className="relative aspect-video">
            <img src={group.coverImageUrl} alt={group.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            {isJoined && (
                <div className="absolute top-3 right-3 px-2.5 py-1 text-[10px] font-black rounded-full bg-green-500 text-white shadow-lg backdrop-blur-sm">
                    PARTICIPANDO
                </div>
            )}
             <div className="absolute bottom-4 left-5">
                <p className="text-[10px] font-black text-rose-300 uppercase tracking-widest mb-1">{group.eventName || 'Comunidade'}</p>
                <h3 className="text-xl font-black text-white drop-shadow-md">{group.name}</h3>
            </div>
        </div>
        <div className="p-5 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-500 text-xs font-bold uppercase tracking-tight">
                <Icon name="user-group" className="w-4 h-4 text-rose-500" />
                <span>{group.memberCount} membros</span>
            </div>
            <div className="bg-gray-50 p-2 rounded-full text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                <Icon name="chat-alt" className="w-5 h-5" />
            </div>
        </div>
    </button>
);


const GroupsView: React.FC<{ 
    groups: FanGroup[],
    joinedGroupIds: Set<string>,
    onBack: () => void,
    onViewGroup: (group: FanGroup) => void,
}> = ({ groups, joinedGroupIds, onBack, onViewGroup }) => {
    return (
        <FanAreaSubSection title="Grupos de Fãs" onBack={onBack}>
            {groups.length > 0 ? (
                <div className="space-y-4">
                    {groups.map(group => (
                        <FanGroupCard
                            key={group.id}
                            group={group}
                            isJoined={joinedGroupIds.has(group.id)}
                            onClick={() => onViewGroup(group)}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon="user-group"
                    title="Nenhum Grupo"
                    message="Ainda não há grupos de fãs para este artista."
                />
            )}
        </FanAreaSubSection>
    );
};

const PollsView: React.FC<{
    artist: Artist;
    posts: Post[];
    targetItemId: string | null;
    likedPostIds: Set<string>;
    onBack: () => void;
    onVote: (postId: string, optionIndex: number) => void;
    onNavigate: (section: Section, subSection?: StoreSection | FanAreaSection, itemId?: string) => void;
    onViewImage: (details: ImageViewerDetails) => void;
    onCommentPost: (post: Post) => void;
    onLikePost: (postId: string) => void;
}> = ({ artist, posts, targetItemId, likedPostIds, onBack, onVote, onNavigate, onViewImage, onCommentPost, onLikePost }) => {
    const polls = posts.filter(p => p.type === PostType.POLL);
    const targetPoll = targetItemId ? polls.find(p => p.id === targetItemId) : null;
    const otherPolls = polls.filter(p => p.id !== targetItemId);

    return (
        <FanAreaSubSection title="Enquetes" onBack={onBack}>
            <div className="space-y-4">
                {targetPoll && (
                     <PostCard
                        post={targetPoll}
                        artistName={artist.name}
                        artistProfileImageUrl={artist.profileImageUrl}
                        isLiked={likedPostIds.has(targetPoll.id)}
                        onLike={onLikePost}
                        onComment={() => onCommentPost(targetPoll)}
                        onVote={onVote}
                        onViewProfileImage={() => onViewImage({ url: artist.profileImageUrl })}
                        onNavigate={onNavigate}
                        onViewPostMedia={(url) => onViewImage({ url })}
                    />
                )}
                {otherPolls.length > 0 && (
                    <>
                        {targetPoll && <div className="border-t border-gray-100 my-8"></div>}
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Outras Enquetes</h3>
                        {otherPolls.map(poll => (
                            <PostCard
                                key={poll.id}
                                post={poll}
                                artistName={artist.name}
                                artistProfileImageUrl={artist.profileImageUrl}
                                isLiked={likedPostIds.has(poll.id)}
                                onLike={onLikePost}
                                onComment={() => onCommentPost(poll)}
                                onVote={onVote}
                                onViewProfileImage={() => onViewImage({ url: artist.profileImageUrl })}
                                onNavigate={onNavigate}
                                onViewPostMedia={(url) => onViewImage({ url })}
                            />
                        ))}
                    </>
                )}
                 {polls.length === 0 && (
                    <EmptyState title="Tudo votado!" message="Não há enquetes novas por enquanto." icon="chart-bar" />
                 )}
            </div>
        </FanAreaSubSection>
    );
};

interface FanAreaViewProps {
    artist: Artist;
    fanAreaSection: FanAreaSection;
    onSectionChange: (section: FanAreaSection) => void;
    leaderboard: FanProfile[];
    rewards: ExclusiveReward[];
    fanPoints: number;
    muralPosts: MuralPost[];
    fanGroups: FanGroup[];
    likedMuralPostIds: Set<string>;
    joinedGroupIds: Set<string>;
    onLikeMuralPost: (postId: string) => void;
    onAddMuralPost: (imageDataUrl: string, caption: string) => void;
    fanArtPosts: FanArtPost[];
    likedFanArtPostIds: Set<string>;
    onLikeFanArtPost: (postId: string) => void;
    onAddFanArtPost: (imageDataUrl: string, caption: string) => void;
    onViewRewardDetails: (reward: ExclusiveReward) => void;
    onOpenPointsInfoModal: () => void;
    onViewMuralImage: (details: ImageViewerDetails) => void;
    onViewFanArtImage: (details: ImageViewerDetails) => void;
    onViewGenericImage: (details: ImageViewerDetails) => void;
    onJoinGroup: (groupId: string) => void;
    posts: Post[];
    targetItemId: string | null;
    onTargetItemHandled: () => void;
    likedPostIds: Set<string>;
    onLikePost: (postId: string) => void;
    onCommentPost: (post: Post) => void;
    onVote: (postId: string, optionIndex: number) => void;
    onNavigate: (section: Section, subSection?: StoreSection | FanAreaSection, itemId?: string) => void;
}

const FanAreaView: React.FC<FanAreaViewProps> = ({ 
    artist, fanAreaSection, onSectionChange, leaderboard, rewards, fanPoints, 
    muralPosts, fanGroups, likedMuralPostIds, joinedGroupIds, onLikeMuralPost, onAddMuralPost,
    fanArtPosts, likedFanArtPostIds, onLikeFanArtPost, onAddFanArtPost,
    onViewRewardDetails, onOpenPointsInfoModal, onViewMuralImage, onViewFanArtImage, onViewGenericImage, onJoinGroup,
    posts, targetItemId, onTargetItemHandled, likedPostIds, onLikePost, onCommentPost, onVote, onNavigate
}) => {
    
    const [selectedFan, setSelectedFan] = useState<FanProfile | null>(null);
    const [selectedGroup, setSelectedGroup] = useState<FanGroup | null>(null);

    const renderContent = () => {
        switch(fanAreaSection) {
            case FanAreaSection.HOME:
                return <FanAreaHome artist={artist} fanPoints={fanPoints} onNavigate={onSectionChange} onOpenPointsInfoModal={onOpenPointsInfoModal} />;
            case FanAreaSection.MURAL:
                return <MuralView 
                          onBack={() => onSectionChange(FanAreaSection.HOME)} 
                          posts={muralPosts}
                          likedPostIds={likedMuralPostIds}
                          onLikePost={onLikeMuralPost}
                          onViewImage={onViewMuralImage}
                          onAddPost={onAddMuralPost}
                       />;
            case FanAreaSection.LEADERBOARD:
                return <LeaderboardView leaderboard={leaderboard} onBack={() => onSectionChange(FanAreaSection.HOME)} onFanClick={setSelectedFan}/>;
            case FanAreaSection.GROUPS:
                return <GroupsView groups={fanGroups} joinedGroupIds={joinedGroupIds} onBack={() => onSectionChange(FanAreaSection.HOME)} onViewGroup={setSelectedGroup} />;
            case FanAreaSection.REWARDS:
                return <RewardsView 
                            rewards={rewards} 
                            fanPoints={fanPoints}
                            leaderboard={leaderboard}
                            onViewRewardDetails={onViewRewardDetails}
                            onBack={() => onSectionChange(FanAreaSection.HOME)} 
                        />;
            case FanAreaSection.POLLS:
                return <PollsView
                    artist={artist}
                    posts={posts}
                    targetItemId={targetItemId}
                    likedPostIds={likedPostIds}
                    onBack={() => onSectionChange(FanAreaSection.HOME)}
                    onVote={onVote}
                    onNavigate={onNavigate}
                    onViewImage={onViewGenericImage}
                    onCommentPost={onCommentPost}
                    onLikePost={onLikePost}
                />;
            case FanAreaSection.FAN_ART:
                return <FanArtView
                          onBack={() => onSectionChange(FanAreaSection.HOME)} 
                          posts={fanArtPosts}
                          likedPostIds={likedFanArtPostIds}
                          onLikePost={onLikeFanArtPost}
                          onViewImage={onViewFanArtImage}
                          onAddPost={onAddFanArtPost}
                       />;
            default:
                return <FanAreaHome artist={artist} fanPoints={fanPoints} onNavigate={onSectionChange} onOpenPointsInfoModal={onOpenPointsInfoModal} />;
        }
    }
    
    return (
        <>
            {renderContent()}
            <FanDetailModal fan={selectedFan} onClose={() => setSelectedFan(null)} leaderboard={leaderboard} />
            <FanGroupDetailModal 
                group={selectedGroup} 
                isJoined={selectedGroup ? joinedGroupIds.has(selectedGroup.id) : false}
                onClose={() => setSelectedGroup(null)}
                onJoin={onJoinGroup}
            />
        </>
    )
};

export default FanAreaView;
