
import React from 'react';
import { Post, PostType, Section, StoreSection, FanAreaSection } from '../types';
import Icon from './Icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

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
        <button onClick={onViewProfileImage} aria-label={`Ver foto de perfil de ${artistName}`} className="rounded-full flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-magenta-500">
            <img src={artistProfileImageUrl} alt={artistName} className="w-11 h-11 rounded-full mr-4 object-cover transition-transform hover:scale-105" />
        </button>
        <div>
            <p className="font-bold text-white">{artistName}</p>
            <p className="text-xs text-gray-400">{timestamp}</p>
        </div>
    </div>
);

const PollOptions: React.FC<{ options: string[], onVote: (index: number) => void }> = ({ options, onVote }) => (
    <div className="space-y-2">
        {options.map((option, index) => (
            <Button
                key={index}
                onClick={() => onVote(index)}
                variant="secondary"
                className="w-full text-left justify-start hover:border-magenta-500 group"
            >
                <span className="font-medium group-hover:text-magenta-300">{option}</span>
            </Button>
        ))}
    </div>
);

const PollResults: React.FC<{ options: string[], votes: number[], userVotedIndex: number }> = ({ options, votes, userVotedIndex }) => {
    const totalVotes = votes.reduce((sum, current) => sum + current, 0);

    return (
        <div className="space-y-2">
            {options.map((option, index) => {
                const percentage = totalVotes > 0 ? Math.round((votes[index] / totalVotes) * 100) : 0;
                const isUserVote = userVotedIndex === index;

                return (
                    <div
                        key={index}
                        className={`relative overflow-hidden rounded-lg border-2 p-3 ${isUserVote ? 'border-magenta-500' : 'border-gray-600'}`}
                    >
                        <div
                            className="absolute top-0 left-0 h-full bg-gray-700/50 transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                        ></div>
                        <div className="relative z-10 flex justify-between items-center">
                            <div className="flex items-center">
                                <span className={`font-bold ${isUserVote ? 'text-white' : 'text-gray-200'}`}>{option}</span>
                                {isUserVote && <Icon name="check-circle" className="w-5 h-5 text-magenta-400 ml-2 flex-shrink-0" />}
                            </div>
                            <span className="text-sm font-bold text-gray-300">{percentage}%</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const PostContent: React.FC<{ post: Post, onVote: (optionIndex: number) => void, onNavigate: (section: Section, subSection?: StoreSection | FanAreaSection, itemId?: string) => void; onViewPostMedia: (url: string) => void; }> = ({ post, onVote, onNavigate, onViewPostMedia }) => {
    
    const getLinkIcon = () => {
        if (post.link?.targetSection === Section.PROFILE) {
            return 'raffle';
        }
        if (post.link?.targetSubSection === StoreSection.TICKETS) {
            return 'tickets';
        }
        return 'users'; 
    };
    
    return (
        <>
            {post.text && <p className="text-gray-200 px-4 pb-3 whitespace-pre-line">{post.text}</p>}
             {post.link && (
                 <div className="px-4 pb-4 mt-[-8px]">
                    <button
                        onClick={() => onNavigate(post.link!.targetSection, post.link!.targetSubSection, post.link!.targetItemId)}
                        className="w-full text-center p-3 bg-gradient-to-r from-orange-500 to-magenta-500 text-white font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
                    >
                        <Icon name={getLinkIcon()} className="w-5 h-5"/>
                        <span>{post.link.text}</span>
                    </button>
                </div>
            )}
            {post.type === PostType.IMAGE && post.mediaUrl && (
                <button onClick={() => onViewPostMedia(post.mediaUrl!)} className="w-full block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-magenta-500">
                    <img src={post.mediaUrl} alt="Post media" className="w-full h-auto" />
                </button>
            )}
            {post.type === PostType.VIDEO && post.mediaUrl && (
                 <button onClick={() => onViewPostMedia(post.mediaUrl!)} className="w-full block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-magenta-500">
                    <div className="relative w-full bg-black aspect-video flex items-center justify-center">
                        <img src={post.mediaUrl} alt="Video thumbnail" className="w-full h-full object-cover"/>
                        <div className="absolute bg-black/40 rounded-full p-4">
                            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"></path></svg>
                        </div>
                    </div>
                </button>
            )}
            {post.type === PostType.POLL && post.pollOptions && post.pollVotes && (
                 <div className="px-4 pb-4">
                    {post.userVotedOptionIndex != null ? (
                        <PollResults
                            options={post.pollOptions}
                            votes={post.pollVotes}
                            userVotedIndex={post.userVotedOptionIndex}
                        />
                    ) : (
                        <PollOptions
                            options={post.pollOptions}
                            onVote={onVote}
                        />
                    )}
                </div>
            )}
        </>
    );
};

const PostFooter: React.FC<{ post: Post, isLiked: boolean, onLike: (postId: string) => void, onComment: (postId: string) => void }> = ({ post, isLiked, onLike, onComment }) => (
    <div className="flex items-center text-gray-400 p-4 space-x-6">
        <Button
            onClick={() => onLike(post.id)}
            variant="ghost"
            className={`flex items-center space-x-2 transition-colors duration-200 ${isLiked ? 'text-magenta-500 hover:text-magenta-400' : 'hover:text-magenta-500'}`}
            aria-pressed={isLiked}
        >
            <Icon name="like" className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{post.likes.toLocaleString('pt-BR')}</span>
        </Button>
        <Button onClick={() => onComment(post.id)} variant="ghost" className="flex items-center space-x-2 hover:text-orange-400">
            <Icon name="comment" className="w-5 h-5" />
            <span className="text-sm font-medium">{post.comments.toLocaleString('pt-BR')}</span>
        </Button>
    </div>
);


const PostCard: React.FC<PostCardProps> = ({ post, artistName, artistProfileImageUrl, isLiked, onLike, onComment, onVote, onViewProfileImage, onNavigate, onViewPostMedia }) => {
  return (
    <Card className="bg-gray-800 border-gray-700/50">
      <CardHeader className="p-0">
        <PostHeader artistName={artistName} artistProfileImageUrl={artistProfileImageUrl} timestamp={post.timestamp} onViewProfileImage={onViewProfileImage} />
      </CardHeader>
      <CardContent className="p-0">
        <PostContent post={post} onVote={(optionIndex) => onVote(post.id, optionIndex)} onNavigate={onNavigate} onViewPostMedia={onViewPostMedia} />
      </CardContent>
      <CardFooter className="p-0 border-t border-gray-700/50">
        <PostFooter post={post} isLiked={isLiked} onLike={onLike} onComment={onComment} />
      </CardFooter>
    </Card>
  );
};

export default React.memo(PostCard);
