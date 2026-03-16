
import React from 'react';
import Icon from './Icon';

interface ImageViewerDetails {
  url: string;
  caption?: string;
  postId?: string;
  isLiked?: boolean;
  likeCount?: number;
  onLike?: (postId: string) => void;
}

interface ImageViewerModalProps {
  details: ImageViewerDetails | null;
  onClose: () => void;
}

const ImageViewerModal: React.FC<ImageViewerModalProps> = ({ details, onClose }) => {
  if (!details) return null;

  const { url, caption, postId, isLiked, likeCount, onLike } = details;

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onLike && postId) {
      onLike(postId);
    }
  };

  const hasFooterContent = caption || (onLike && postId);

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full max-w-lg animate-scale-in flex flex-col gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-3xl p-2 shadow-2xl overflow-hidden">
            <img
            src={url}
            alt="Visualização ampliada"
            className="rounded-2xl w-full h-auto object-contain max-h-[70vh] bg-gray-50"
            />
        </div>
        
        {hasFooterContent && (
          <div className="bg-white/95 backdrop-blur-md p-4 rounded-[2rem] flex items-center justify-between gap-4 shadow-2xl border border-gray-100">
            {caption && <p className="text-gray-900 text-sm font-bold whitespace-pre-line flex-1 leading-relaxed">{caption}</p>}
            {onLike && postId && typeof isLiked === 'boolean' && typeof likeCount === 'number' && (
              <button
                onClick={handleLikeClick}
                className={`flex items-center space-x-2 py-2 px-4 rounded-2xl transition-all duration-300 shadow-sm ${
                  isLiked 
                  ? 'bg-rose-500 text-white shadow-rose-200' 
                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                }`}
                aria-pressed={isLiked}
              >
                <Icon name="like" className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-xs font-black tabular-nums">{likeCount.toLocaleString('pt-BR')}</span>
              </button>
            )}
          </div>
        )}

        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white p-2.5 rounded-full text-gray-900 hover:text-rose-500 transition-colors border-4 border-gray-50 shadow-xl"
          aria-label="Fechar imagem"
        >
          <Icon name="close" className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ImageViewerModal;
