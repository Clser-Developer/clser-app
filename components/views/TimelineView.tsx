import React from 'react';
import { Artist, Post, Section, StoreSection, FanAreaSection } from '../../types';
import PostCard from '../PostCard';

interface TimelineViewProps {
  artist: Artist;
  posts: Post[];
  likedPostIds: Set<string>;
  onLikePost: (postId: string) => void;
  onVote: (postId: string, optionIndex: number) => void;
  onNavigate: (section: Section, subSection?: StoreSection | FanAreaSection, itemId?: string) => void;
  onViewImage: (details: { url: string; caption?: string }) => void;
  onCommentPost: (post: Post) => void;
}

const TimelineView: React.FC<TimelineViewProps> = ({ artist, posts, likedPostIds, onLikePost, onVote, onNavigate, onViewImage, onCommentPost }) => {
    return (
        <div className="space-y-4 p-4">
            {posts.map(post => (
                <PostCard
                    key={post.id}
                    post={post}
                    artistName={artist.name}
                    artistProfileImageUrl={artist.profileImageUrl}
                    isLiked={likedPostIds.has(post.id)}
                    onLike={onLikePost}
                    onComment={() => onCommentPost(post)}
                    onVote={onVote}
                    onViewProfileImage={() => onViewImage({ url: artist.profileImageUrl })}
                    onNavigate={onNavigate}
                    onViewPostMedia={(url) => onViewImage({ url })}
                />
            ))}
        </div>
    );
};

export default TimelineView;
