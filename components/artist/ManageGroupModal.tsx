
import React, { useState, useEffect } from 'react';
import { FanGroup, ChatMessage } from '../../types';
import Icon from '../Icon';

interface ManageGroupModalProps {
  isVisible: boolean;
  onClose: () => void;
  group: FanGroup | null;
  onUpdate: (updatedGroup: FanGroup) => void;
}

type Tab = 'INFO' | 'MODERATION';

const ManageGroupModal: React.FC<ManageGroupModalProps> = ({ isVisible, onClose, group, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<Tab>('INFO');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (group) {
        setName(group.name);
        setDescription(group.description);
        setMessages(group.messages || []);
    }
  }, [group]);

  if (!isVisible || !group) return null;

  const handleDeleteMessage = (messageId: string) => {
      if (confirm('Tem certeza que deseja excluir esta mensagem?')) {
          setMessages(prev => prev.filter(m => m.id !== messageId));
      }
  };

  const handleSave = () => {
      setIsSaving(true);
      setTimeout(() => {
          const updatedGroup: FanGroup = {
              ...group,
              name,
              description,
              messages
          };
          onUpdate(updatedGroup);
          setIsSaving(false);
          onClose();
      }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] animate-scale-in">
        <header className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Gerenciar Grupo</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>

        <div className="flex border-b border-gray-100">
            <button 
                onClick={() => setActiveTab('INFO')}
                className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'INFO' ? 'text-rose-500 border-b-2 border-rose-500 bg-rose-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
                Informações
            </button>
            <button 
                onClick={() => setActiveTab('MODERATION')}
                className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'MODERATION' ? 'text-rose-500 border-b-2 border-rose-500 bg-rose-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
                Moderação ({messages.length})
            </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
            {activeTab === 'INFO' && (
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wide">Nome do Grupo</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-gray-900 focus:border-rose-500 focus:ring-rose-500 outline-none transition-shadow shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wide">Descrição</label>
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-gray-900 focus:border-rose-500 focus:ring-rose-500 outline-none resize-none transition-shadow shadow-sm"
                        />
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center space-x-4">
                        <img src={group.coverImageUrl} alt="Cover" className="w-16 h-16 rounded-lg object-cover shadow-sm" />
                        <div className="text-xs text-gray-500">
                            <p className="font-bold text-gray-900 mb-1">Imagem de Capa</p>
                            <p>Alteração de imagem indisponível na versão mobile.</p>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'MODERATION' && (
                <div className="space-y-4">
                    {messages.length > 0 ? (
                        messages.map(msg => (
                            <div key={msg.id} className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex gap-3 shadow-sm">
                                <img src={msg.authorImageUrl} alt={msg.authorName} className="w-8 h-8 rounded-full flex-shrink-0 border border-white shadow-sm" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline">
                                        <p className="text-xs font-bold text-gray-900">{msg.authorName}</p>
                                        <p className="text-[10px] text-gray-400">{msg.timestamp}</p>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{msg.text}</p>
                                </div>
                                <button 
                                    onClick={() => handleDeleteMessage(msg.id)}
                                    className="text-gray-400 hover:text-red-500 self-start p-1 bg-white rounded-full shadow-sm hover:shadow-md transition-all"
                                    title="Excluir mensagem"
                                >
                                    <Icon name="close" className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Icon name="chat-alt" className="w-6 h-6 text-gray-300" />
                            </div>
                            Nenhuma mensagem no grupo.
                        </div>
                    )}
                </div>
            )}
        </div>

        <footer className="p-4 bg-white border-t border-gray-100">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-rose-500 text-white font-bold py-4 px-4 rounded-2xl hover:bg-rose-600 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-rose-500/20"
          >
            {isSaving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
                'Salvar Alterações'
            )}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ManageGroupModal;
