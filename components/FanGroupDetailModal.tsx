import React, { useState, useRef, useEffect } from 'react';
import { FanGroup, ChatMessage } from '../types';
import Icon from './Icon';

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isCurrentUser = message.isCurrentUser;
    return (
        <div className={`flex items-end gap-2 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
            {!isCurrentUser && (
                 <img src={message.authorImageUrl} alt={message.authorName} className="w-8 h-8 rounded-full flex-shrink-0" />
            )}
            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${isCurrentUser ? 'bg-orange-500 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                 {!isCurrentUser && (
                    <p className="font-bold text-sm text-magenta-300 mb-1">{message.authorName}</p>
                )}
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${isCurrentUser ? 'text-orange-100' : 'text-gray-400'} text-right`}>{message.timestamp}</p>
            </div>
        </div>
    );
};

interface FanGroupDetailModalProps {
  group: FanGroup | null;
  isJoined: boolean;
  onClose: () => void;
  onJoin: (groupId: string) => void;
}

const FanGroupDetailModal: React.FC<FanGroupDetailModalProps> = ({ group, isJoined, onClose, onJoin }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(group?.messages || []);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (group) {
        setMessages(group.messages);
    }
  }, [group]);
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!group) return null;
  
  const handleJoin = () => {
      onJoin(group.id);
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      authorName: 'Você',
      authorImageUrl: 'https://picsum.photos/seed/user-profile/100/100',
      text: newMessage,
      timestamp: 'Agora',
      isCurrentUser: true,
    };
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center" aria-modal="true" role="dialog" onClick={onClose}>
      <div className="bg-gray-800 rounded-t-2xl w-full max-w-lg shadow-2xl border-t border-gray-700 animate-slide-up flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <header className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
            <div className="min-w-0">
                <h2 className="text-lg font-bold text-white truncate">{group.name}</h2>
                <p className="text-xs text-gray-400">{group.memberCount} membros</p>
            </div>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-700">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>

        <main className="overflow-y-auto p-4 space-y-4 flex-1">
            <div className="p-4 bg-gray-900/50 rounded-lg">
                <p className="text-sm text-gray-300">{group.description}</p>
            </div>

            <div className="space-y-4">
                {messages.map(msg => <ChatBubble key={msg.id} message={msg} />)}
                <div ref={chatEndRef} />
            </div>
        </main>

        <footer className="p-4 bg-gray-900/50 flex-shrink-0 border-t border-gray-700">
          {isJoined ? (
            <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-gray-700 border-gray-600 rounded-full py-2.5 px-4 text-white focus:ring-2 focus:ring-magenta-500 focus:border-transparent outline-none"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 hover:bg-orange-600 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                aria-label="Enviar mensagem"
              >
                <Icon name="send" className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <button
              onClick={handleJoin}
              className="w-full bg-magenta-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-magenta-600 transition-colors"
            >
              Entrar no Grupo
            </button>
          )}
        </footer>
      </div>
    </div>
  );
};

export default FanGroupDetailModal;
