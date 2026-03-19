
import React, { useState, useRef, useEffect } from 'react';
import { Post, Artist, Comment } from '../types';
import Icon from './Icon';

const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => (
    <div className="flex items-start space-x-3 py-4">
        <img src={comment.authorImageUrl} alt={comment.authorName} className="w-10 h-10 rounded-full flex-shrink-0 object-cover border border-gray-100" />
        <div className="flex-1 bg-gray-50 rounded-2xl rounded-tl-none p-3 border border-gray-100">
            <div className="flex items-baseline space-x-2">
                <p className="font-bold text-sm text-gray-900">{comment.authorName}</p>
                <p className="text-xs text-gray-400">{comment.timestamp}</p>
            </div>
            <p className="text-gray-700 text-sm mt-1">{comment.text}</p>
        </div>
    </div>
);

interface CommentModalProps {
    post: Post;
    artist: Artist;
    userProfileImageUrl: string;
    comments: Comment[];
    isLoading: boolean;
    onClose: () => void;
    onAddComment: (postId: string, commentText: string) => void;
    onViewProfileImage: () => void;
}

const CommentModal: React.FC<CommentModalProps> = ({ post, artist, userProfileImageUrl, comments, isLoading, onClose, onAddComment, onViewProfileImage }) => {
    const [commentText, setCommentText] = useState('');
    const commentsEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
      commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [comments]);
    
    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previousOverflow;
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center animate-fade-in" 
            onClick={onClose}
            aria-modal="true" 
            role="dialog"
        >
            <div
                className="bg-white flex flex-col w-full h-full animate-slide-up relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-center p-4 h-16 bg-white border-b border-gray-100 flex-shrink-0">
                    <button 
                        onClick={onClose} 
                        className="absolute left-4 p-2 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
                        aria-label="Voltar"
                    >
                        <Icon name="arrowLeft" className="w-6 h-6" />
                    </button>
                    <h2 className="text-lg font-bold text-gray-900">Comentários</h2>
                </header>

                <div className="flex-1 overflow-y-auto px-4 bg-white">
                    <div className="border-b border-gray-100 py-4">
                        <div className="flex items-start space-x-3">
                           <button onClick={onViewProfileImage} aria-label={`Ver foto de perfil de ${artist.name}`} className="rounded-full flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500">
                                <img src={artist.profileImageUrl} alt={artist.name} className="w-10 h-10 rounded-full object-cover transition-transform hover:scale-105 border border-gray-200" />
                           </button>
                           <div>
                                <p className="font-bold text-gray-900">{artist.name}</p>
                                <p className="text-gray-600 mt-1 whitespace-pre-line text-sm">{post.text}</p>
                           </div>
                        </div>
                    </div>
                    {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                             <div className="w-6 h-6 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {comments.map(comment => <CommentItem key={comment.id} comment={comment} />)}
                            <div ref={commentsEndRef} />
                        </div>
                    )}
                </div>

                <footer className="p-4 border-t border-gray-100 bg-white flex-shrink-0 pb-24">
                    <form onSubmit={handleSubmit} className="flex items-center space-x-3">
                        <img src={userProfileImageUrl} alt="Sua foto de perfil" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Adicione um comentário..."
                            className="flex-1 bg-gray-50 border-gray-200 border rounded-full py-2.5 px-4 text-gray-900 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none placeholder-gray-400"
                        />
                        <button
                            type="submit"
                            disabled={!commentText.trim()}
                            className="bg-rose-500 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 hover:bg-rose-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md"
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
