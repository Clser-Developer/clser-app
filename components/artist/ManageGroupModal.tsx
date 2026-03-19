
import React, { useState, useEffect } from 'react';
import { FanGroup, ChatMessage } from '../../types';
import Icon from '../Icon';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ModalBody, ModalCloseButton, ModalFooter, ModalHeader, ModalShell, ModalTitle } from '../ui/modal-shell';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';

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
    <ModalShell open={isVisible} onClose={onClose} variant="dialog">
      <ModalHeader>
        <ModalTitle>Gerenciar Grupo</ModalTitle>
        <ModalCloseButton onClick={onClose} />
      </ModalHeader>

      <ModalBody className="overflow-y-auto flex-1 space-y-6">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Tab)}>
                <TabsList className="grid w-full grid-cols-2 rounded-xl bg-gray-100 p-1">
                    <TabsTrigger value="INFO" className="font-bold data-[state=active]:text-rose-500">
                        Informações
                    </TabsTrigger>
                    <TabsTrigger value="MODERATION" className="font-bold data-[state=active]:text-rose-500">
                        Moderação ({messages.length})
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {activeTab === 'INFO' && (
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wide">Nome do Grupo</label>
                        <Input
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-12 rounded-xl border-gray-200 bg-white shadow-sm focus-visible:border-rose-300 focus-visible:ring-rose-500/25"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wide">Descrição</label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="min-h-28 rounded-xl border-gray-200 bg-white shadow-sm focus-visible:border-rose-300 focus-visible:ring-rose-500/25"
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
      </ModalBody>

      <ModalFooter>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="h-14 w-full rounded-2xl text-sm font-black shadow-lg shadow-rose-500/20"
          >
            {isSaving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
                'Salvar Alterações'
            )}
          </Button>
      </ModalFooter>
    </ModalShell>
  );
};

export default ManageGroupModal;
