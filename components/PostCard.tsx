
import React from 'react';
import { Post, PostType, Section, StoreSection, FanAreaSection } from '../types';
import Icon from './Icon';

interface PostCardProps {
  post: Post;
  artistName: string;
  artistProfileImageUrl: string;
  isLiked: boolean;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onVote: (postId: string, optionIndex: number) => void;
  onViewProfileImage: () => void;
  onNavigate: (section: Section, subSection?: StoreSection | FanAreaSection, itemId?: string) => void;
  onViewPostMedia: (url: string) => void;
}

const PostHeader: React.FC<{ artistName: string; artistProfileImageUrl: string; timestamp: string; onViewProfileImage: () => void; }> = ({ artistName, artistProfileImageUrl, timestamp, onViewProfileImage }) => (
    <div className="flex items-center p-4">
        <button onClick={onViewProfileImage} aria-label={`Ver foto de perfil de ${artistName}`} className="rounded-full flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500">
            <img src={artistProfileImageUrl} alt={artistName} className="w-10 h-10 rounded-full mr-3 object-cover shadow-sm" />
        </button>
        <div>
            <p className="font-bold text-gray-900 text-sm">{artistName}</p>
            <p className="text-xs text-gray-500 font-medium">{timestamp}</p>
        </div>
        {/* Ícone de menu removido conforme solicitado */}
    </div>
);

const PollOptions: React.FC<{ options: string[], onVote: (index: number) => void }> = ({ options, onVote }) => (
    <div className="space-y-2 mt-2">
        {options.map((option, index) => (
            <button
                key={index}
                onClick={() => onVote(index)}
                className="w-full text-left p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-rose-300 hover:bg-rose-50 transition-all group"
            >
                <span className="text-gray-700 font-medium text-sm group-hover:text-rose-600">{option}</span>
            </button>
        ))}
    </div>
);

const PollResults: React.FC<{ options: string[], votes: number[], userVotedIndex: number }> = ({ options, votes, userVotedIndex }) => {
    const totalVotes = votes.reduce((sum, current) => sum + current, 0);

    return (
        <div className="space-y-2 mt-2">
            {options.map((option, index) => {
                const percentage = totalVotes > 0 ? Math.round((votes[index] / totalVotes) * 100) : 0;
                const isUserVote = userVotedIndex === index;

                return (
                    <div
                        key={index}
                        className={`relative overflow-hidden rounded-xl border ${isUserVote ? 'border-rose-500 bg-rose-50' : 'border-gray-100 bg-gray-50'}`}
                    >
                        <div
                            className={`absolute top-0 left-0 h-full transition-all duration-500 ${isUserVote ? 'bg-rose-100' : 'bg-gray-200/50'}`}
                            style={{ width: `${percentage}%` }}
                        ></div>
                        <div className="relative z-10 flex justify-between items-center p-3">
                            <div className="flex items-center">
                                <span className={`font-semibold text-sm ${isUserVote ? 'text-rose-700' : 'text-gray-700'}`}>{option}</span>
                                {isUserVote && <Icon name="check-circle" className="w-4 h-4 text-rose-500 ml-2 flex-shrink-0" />}
                            </div>
                            <span className="text-xs font-bold text-gray-500">{percentage}%</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const PostContent: React.FC<{ post: Post, onVote: (optionIndex: number) => void, onNavigate: (section: Section, subSection?: StoreSection | FanAreaSection, itemId?: string) => void; onViewPostMedia: (url: string) => void; }> = ({ post, onVote, onNavigate, onViewPostMedia }) => {
    
    const getLinkIcon = () => {
        if (post.link?.targetSection === Section.PROFILE) return 'raffle';
        if (post.link?.targetSubSection === StoreSection.TICKETS) return 'tickets';
        return 'shopping-cart'; 
    };

    const handlePollVote = (index: number) => {
        onVote(index);
        if (post.link) {
            onNavigate(post.link.targetSection, post.link.targetSubSection, post.link.targetItemId);
        }
    };
    
    return (
        <div className="px-4 pb-2">
            {post.text && <p className="text-gray-800 text-sm leading-relaxed mb-3 whitespace-pre-line">{post.text}</p>}
            
            {post.type === PostType.IMAGE && post.mediaUrl && (
                <button onClick={() => onViewPostMedia(post.mediaUrl!)} className="w-full block rounded-2xl overflow-hidden shadow-sm mb-3">
                    <img src={post.mediaUrl} alt="Post media" className="w-full h-auto object-cover" />
                </button>
            )}
            
            {post.type === PostType.VIDEO && post.mediaUrl && (
                 <button onClick={() => onViewPostMedia(post.mediaUrl!)} className="w-full block rounded-2xl overflow-hidden shadow-sm mb-3 relative group">
                    <div className="relative w-full bg-black aspect-video flex items-center justify-center">
                        <img src={post.mediaUrl} alt="Video thumbnail" className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"/>
                        <div className="absolute bg-white/20 backdrop-blur-md rounded-full p-3 border border-white/50">
                            <Icon name="play" className="w-8 h-8 text-white fill-current" />
                        </div>
                    </div>
                </button>
            )}

            {post.type === PostType.POLL && post.pollOptions && post.pollVotes && (
                 <div className="mb-3">
                    {post.userVotedOptionIndex != null ? (
                        <PollResults
                            options={post.pollOptions}
                            votes={post.pollVotes}
                            userVotedIndex={post.userVotedOptionIndex}
                        />
                    ) : (
                        <PollOptions
                            options={post.pollOptions}
                            onVote={handlePollVote}
                        />
                    )}
                </div>
            )}

            {post.link && post.type !== PostType.POLL && (
                 <div className="mt-2">
                    <button
                        onClick={() => onNavigate(post.link!.targetSection, post.link!.targetSubSection, post.link!.targetItemId)}
                        className="w-full flex items-center justify-center space-x-2 p-3 bg-rose-50 text-rose-600 font-bold text-sm rounded-xl hover:bg-rose-100 transition-colors"
                    >
                        <Icon name={getLinkIcon()} className="w-4 h-4"/>
                        <span>{post.link.text}</span>
                    </button>
                </div>
            )}
        </div>
    );
};

const PostFooter: React.FC<{ post: Post, isLiked: boolean, onLike: (postId: string) => void, onComment: (postId: string) => void }> = ({ post, isLiked, onLike, onComment }) => (
    <div className="flex items-center p-4 pt-2">
        <button 
            onClick={() => onLike(post.id)} 
            className={`flex items-center space-x-1.5 transition-colors duration-200 group ${isLiked ? 'text-rose-500' : 'text-gray-500 hover:text-rose-500'}`}
            aria-pressed={isLiked}
        >
            <div className={`p-1.5 rounded-full ${isLiked ? 'bg-rose-50' : 'group-hover:bg-rose-50'}`}>
                <Icon name={isLiked ? 'like' : 'like'} className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </div>
            <span className="text-xs font-bold">{post.likes.toLocaleString('pt-BR')}</span>
        </button>
        <button onClick={() => onComment(post.id)} className="flex items-center space-x-1.5 text-gray-500 hover:text-gray-900 transition-colors ml-4 group">
            <div className="p-1.5 rounded-full group-hover:bg-gray-100">
                <Icon name="chat-alt" className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold">{post.comments.toLocaleString('pt-BR')}</span>
        </button>
        
        <button className="ml-auto text-gray-400 hover:text-gray-600">
            <Icon name="send" className="w-5 h-5" />
        </button>
    </div>
);


const PostCard: React.FC<PostCardProps> = ({ post, artistName, artistProfileImageUrl, isLiked, onLike, onComment, onVote, onViewProfileImage, onNavigate, onViewPostMedia }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-4 overflow-hidden">
      <PostHeader artistName={artistName} artistProfileImageUrl={artistProfileImageUrl} timestamp={post.timestamp} onViewProfileImage={onViewProfileImage} />
      <PostContent post={post} onVote={(optionIndex) => onVote(post.id, optionIndex)} onNavigate={onNavigate} onViewPostMedia={onViewPostMedia} />
      <PostFooter post={post} isLiked={isLiked} onLike={onLike} onComment={onComment} />
    </div>
  );
};

export default React.memo(PostCard);
