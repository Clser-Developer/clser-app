
import React, { useMemo, useState } from 'react';
import { MuralPost } from '../../types';
import Icon from '../Icon';
import MuralPostModal from '../MuralPostModal';
import FanAreaSubSection from './FanAreaSubSection';

interface ImageViewerDetails {
  url: string;
  caption?: string;
  postId?: string;
  isLiked?: boolean;
  likeCount?: number;
}

const MuralPostCard: React.FC<{ 
  post: MuralPost, 
  isLiked: boolean, 
  onLike: (postId: string) => void,
  onViewImage: (details: ImageViewerDetails) => void
}> = ({ post, isLiked, onLike, onViewImage }) => {
  const captionText = `${post.fanName}: ${post.caption}`;
  
  const handleViewImage = () => {
    onViewImage({
      url: post.imageUrl,
      caption: captionText,
      postId: post.id,
      isLiked,
      likeCount: post.likes
    });
  };

  return (
    <div className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm">
       <button onClick={handleViewImage} className="w-full h-full block">
        <img 
            src={post.imageUrl} 
            alt={post.caption} 
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </button>

      {/* Hover Overlay with info */}
      <div 
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 pb-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      >
        <div className="flex items-center space-x-2">
            <img src={post.fanAvatarUrl} alt={post.fanName} className="w-5 h-5 rounded-full border border-white/50" />
            <p className="text-white text-[10px] font-black drop-shadow-md truncate">{post.fanName}</p>
        </div>
      </div>

      {/* Like Button - Always visible */}
      <button 
        onClick={(e) => { e.stopPropagation(); onLike(post.id); }}
        className={`absolute bottom-3 right-3 flex items-center space-x-1.5 py-1 px-2.5 rounded-full transition-all duration-200 backdrop-blur-md shadow-sm ${
            isLiked 
            ? 'bg-rose-500/90 text-white' 
            : 'bg-white/80 text-gray-700 hover:bg-white'
        }`}
        aria-pressed={isLiked}
      >
        <Icon name="like" className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
        <span className="text-[10px] font-black tabular-nums">{post.likes.toLocaleString('pt-BR')}</span>
      </button>
    </div>
  );
};


interface MuralViewProps {
  onBack: () => void;
  posts: MuralPost[];
  likedPostIds: Set<string>;
  onLikePost: (postId: string) => void;
  onViewImage: (details: ImageViewerDetails) => void;
  onAddPost: (imageDataUrl: string, caption: string) => void;
}

const MuralView: React.FC<MuralViewProps> = ({ onBack, posts, likedPostIds, onLikePost, onViewImage, onAddPost }) => {
  const [isPostingModalVisible, setIsPostingModalVisible] = useState(false);
  
  const processedPosts = useMemo(() => {
    if (!posts || posts.length === 0) return [];
    return [...posts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [posts]);
  
  return (
    <>
        <FanAreaSubSection
            title="Mural de Fãs"
            onBack={onBack}
            action={(
              <button
                onClick={() => setIsPostingModalVisible(true)}
                className="flex items-center space-x-2 rounded-2xl bg-rose-500 px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-rose-500/20 transition-all hover:bg-rose-600"
              >
                <Icon name="camera" className="h-4 w-4" />
                <span>Postar</span>
              </button>
            )}
        >
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 mb-8 text-sm text-rose-700 flex items-start space-x-4 shadow-sm shadow-rose-500/5">
                <div className="bg-rose-500 p-2.5 rounded-xl shadow-lg shadow-rose-500/20 text-white">
                    <Icon name="raffle" className="w-6 h-6" />
                </div>
                <div>
                    <p className="font-black text-rose-900 leading-tight">Ganhe Pontos Diariamente!</p>
                    <p className="text-rose-600/80 text-xs mt-1 font-medium">As 3 fotos mais curtidas do dia garantem <span className="font-black">200 fan points</span> extras.</p>
                </div>
            </div>
            
            {processedPosts.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                    {processedPosts.map(post => (
                        <MuralPostCard 
                            key={post.id} 
                            post={post}
                            isLiked={likedPostIds.has(post.id)}
                            onLike={onLikePost}
                            onViewImage={onViewImage}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 px-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <Icon name="camera" className="w-16 h-16 mx-auto text-gray-100 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900">Mural Vazio</h3>
                    <p className="text-gray-500 mt-2 text-sm font-medium">Seja o primeiro a postar uma foto exclusiva!</p>
                </div>
            )}
        </FanAreaSubSection>
        <MuralPostModal 
            isVisible={isPostingModalVisible}
            onClose={() => setIsPostingModalVisible(false)}
            onPost={onAddPost}
        />
    </>
  );
};

export default MuralView;
