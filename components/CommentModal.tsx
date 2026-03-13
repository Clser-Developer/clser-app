import React, { useState, useRef, useEffect } from 'react';
import { Post, Artist, Comment } from '../types';
import Icon from './Icon';

const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => (
    <div className="flex items-start space-x-3 py-4">
        <img src={comment.authorImageUrl} alt={comment.authorName} className="w-10 h-10 rounded-full flex-shrink-0 object-cover" />
        <div className="flex-1 bg-gray-700 rounded-xl p-3">
            <div className="flex items-baseline space-x-2">
                <p className="font-bold text-sm text-white">{comment.authorName}</p>
                <p className="text-xs text-gray-400">{comment.timestamp}</p>
            </div>
            <p className="text-gray-200 text-sm mt-1">{comment.text}</p>
        </div>
    </div>
);

interface CommentModalProps {
    post: Post;
    artist: Artist;
    comments: Comment[];
    isLoading: boolean;
    onClose: () => void;
    onAddComment: (postId: string, commentText: string) => void;
    onViewProfileImage: () => void;
}

const CommentModal: React.FC<CommentModalProps> = ({ post, artist, comments, isLoading, onClose, onAddComment, onViewProfileImage }) => {
    const [commentText, setCommentText] = useState('');
    const commentsEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
      commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [comments]);
    
    // Effect to disable scrolling on the main app when modal is open
    useEffect(() => {
        const rootEl = document.getElementById('root');
        if (rootEl) {
            rootEl.style.overflow = 'hidden';
        }
        return () => {
            if (rootEl) {
                rootEl.style.overflow = 'auto';
            }
        };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim()) {
            onAddComment(post.id, commentText.trim());
            setCommentText('');
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in" 
            onClick={onClose}
            aria-modal="true" 
            role="dialog"
        >
            <div
                className="bg-gray-900 flex flex-col w-full h-full animate-slide-up relative overflow-hidden"
                style={{
                    maxWidth: '450px',
                    aspectRatio: '1179 / 2556',
                    maxHeight: '95vh',
                    borderRadius: '2.5rem',
                    border: '8px solid black',
                    boxShadow: '0 0 80px rgba(0, 0, 0, 0.3)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-center p-4 h-16 bg-gray-800 border-b border-gray-700 flex-shrink-0">
                    <button 
                        onClick={onClose} 
                        className="absolute left-4 p-2 rounded-full text-gray-300 hover:bg-gray-700 transition-colors"
                        aria-label="Voltar"
                    >
                        <Icon name="arrowLeft" className="w-6 h-6" />
                    </button>
                    <h2 className="text-lg font-bold text-white">Comentários</h2>
                </header>

                <div className="flex-1 overflow-y-auto px-4 bg-gray-800">
                    <div className="border-b border-gray-700 py-4">
                        <div className="flex items-start space-x-3">
                           <button onClick={onViewProfileImage} aria-label={`Ver foto de perfil de ${artist.name}`} className="rounded-full flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-magenta-500">
                                <img src={artist.profileImageUrl} alt={artist.name} className="w-10 h-10 rounded-full object-cover transition-transform hover:scale-105" />
                           </button>
                           <div>
                                <p className="font-bold text-white">{artist.name}</p>
                                <p className="text-gray-200 mt-1 whitespace-pre-line">{post.text}</p>
                           </div>
                        </div>
                    </div>
                    {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                             <div className="w-6 h-6 border-4 border-magenta-400 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-700">
                            {comments.map(comment => <CommentItem key={comment.id} comment={comment} />)}
                            <div ref={commentsEndRef} />
                        </div>
                    )}
                </div>

                <footer className="p-4 border-t border-gray-700 bg-gray-800 flex-shrink-0">
                    <form onSubmit={handleSubmit} className="flex items-center space-x-3">
                        <img src="https://picsum.photos/seed/user-profile/100/100" alt="Sua foto de perfil" className="w-10 h-10 rounded-full object-cover" />
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Adicione um comentário..."
                            className="flex-1 bg-gray-700 border-gray-600 rounded-full py-2.5 px-4 text-white focus:ring-2 focus:ring-magenta-500 focus:border-transparent outline-none"
                        />
                        <button
                            type="submit"
                            disabled={!commentText.trim()}
                            className="bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 hover:bg-orange-600 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                            aria-label="Enviar comentário"
                        >
                            <Icon name="send" className="w-5 h-5" />
                        </button>
                    </form>
                </footer>
            </div>
        </div>
    );
};

export default CommentModal;
