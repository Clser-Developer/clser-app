
import React, { useMemo, useState } from 'react';
import { FanArtPost } from '../../types';
import Icon from '../Icon';
import FanArtPostModal from '../FanArtPostModal';

const FanAreaSubSection: React.FC<{title: string, onBack: () => void; onPostClick: () => void; children: React.ReactNode}> = ({ title, onBack, onPostClick, children }) => (
  <div className="p-4 animate-fade-in pb-24">
    <header className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <button 
          onClick={onBack} 
          className="p-2 rounded-full text-gray-400 hover:bg-gray-100 mr-2 transition-colors"
          aria-label="Voltar para a Área do Fã"
        >
          <Icon name="arrowLeft" className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-black text-gray-900">{title}</h2>
      </div>
      <button 
        onClick={onPostClick}
        className="bg-gray-900 text-white font-black py-2.5 px-5 rounded-2xl hover:bg-black transition-all text-xs flex items-center space-x-2 shadow-lg"
      >
        <Icon name="palette" className="w-4 h-4"/>
        <span>Enviar Arte</span>
      </button>
    </header>
    {children}
  </div>
);

interface ImageViewerDetails {
  url: string;
  caption?: string;
  postId?: string;
  isLiked?: boolean;
  likeCount?: number;
}

const FanArtPostCard: React.FC<{ 
  post: FanArtPost, 
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
    <div className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
       <button onClick={handleViewImage} className="w-full h-full block">
        <img 
            src={post.imageUrl} 
            alt={post.caption} 
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </button>

      <div 
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 pb-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      >
        <div className="flex items-center space-x-2">
            <img src={post.fanAvatarUrl} alt={post.fanName} className="w-5 h-5 rounded-full border border-white/50" />
            <p className="text-white text-[10px] font-black drop-shadow-md truncate">{post.fanName}</p>
        </div>
      </div>

      <button 
        onClick={(e) => { e.stopPropagation(); onLike(post.id); }}
        className={`absolute bottom-3 right-3 flex items-center space-x-1.5 py-1 px-2.5 rounded-full transition-all duration-200 backdrop-blur-md shadow-sm ${
            isLiked 
            ? 'bg-rose-500 text-white' 
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


interface FanArtViewProps {
  onBack: () => void;
  posts: FanArtPost[];
  likedPostIds: Set<string>;
  onLikePost: (postId: string) => void;
  onViewImage: (details: ImageViewerDetails) => void;
  onAddPost: (imageDataUrl: string, caption: string) => void;
}

const FanArtView: React.FC<FanArtViewProps> = ({ onBack, posts, likedPostIds, onLikePost, onViewImage, onAddPost }) => {
  const [isPostingModalVisible, setIsPostingModalVisible] = useState(false);
  
  const processedPosts = useMemo(() => {
    return [...posts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [posts]);
  
  return (
    <>
        <FanAreaSubSection title="Galeria de Arte" onBack={onBack} onPostClick={() => setIsPostingModalVisible(true)}>
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-8 text-sm text-blue-700 flex items-start space-x-4 shadow-sm shadow-blue-500/5">
                <div className="bg-blue-500 p-2.5 rounded-xl shadow-lg shadow-blue-500/20 text-white">
                    <Icon name="palette" className="w-6 h-6" />
                </div>
                <div>
                    <p className="font-black text-blue-900 leading-tight">Mostre seu talento!</p>
                    <p className="text-blue-600/80 text-xs mt-1 font-medium leading-relaxed">Envie suas artes e caricaturas. As melhores podem ser repostadas pelo artista oficial.</p>
                </div>
            </div>
            
            {processedPosts.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                    {processedPosts.map(post => (
                        <FanArtPostCard 
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
                    <Icon name="palette" className="w-16 h-16 mx-auto text-gray-100 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900">Galeria Vazia</h3>
                    <p className="text-gray-500 mt-2 text-sm font-medium">Inaugure a galeria enviando sua primeira arte!</p>
                </div>
            )}
        </FanAreaSubSection>
        <FanArtPostModal 
            isVisible={isPostingModalVisible}
            onClose={() => setIsPostingModalVisible(false)}
            onPost={onAddPost}
        />
    </>
  );
};

export default FanArtView;
