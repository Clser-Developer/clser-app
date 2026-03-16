
import React, { useState, useRef, ChangeEvent } from 'react';
import Icon from '../Icon';
import { Event } from '../../types';

interface CreateGroupModalProps {
  isVisible: boolean;
  onClose: () => void;
  onCreate: (groupData: { name: string; description: string; eventId?: string; coverImageUrl: string }) => void;
  availableEvents: Event[];
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isVisible, onClose, onCreate, availableEvents }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isVisible) return null;

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!name || !description || !coverImage) return;

    setIsCreating(true);
    setTimeout(() => {
        onCreate({
            name,
            description,
            eventId: selectedEventId || undefined,
            coverImageUrl: coverImage
        });
        setIsCreating(false);
        // Reset form
        setName('');
        setDescription('');
        setSelectedEventId('');
        setCoverImage(null);
        onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-end justify-center" aria-modal="true" role="dialog">
      <div className="bg-white rounded-t-3xl w-full max-w-md shadow-2xl border-t border-gray-100 animate-slide-up flex flex-col max-h-[90vh]">
        <header className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Novo Grupo Oficial</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>

        <div className="p-6 space-y-6 overflow-y-auto">
            {/* Image Upload */}
            <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-video bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-rose-400 hover:bg-rose-50 transition-colors overflow-hidden relative group"
            >
                {coverImage ? (
                    <>
                        <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white font-bold text-sm bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">Trocar Imagem</span>
                        </div>
                    </>
                ) : (
                    <>
                        <Icon name="camera" className="w-8 h-8 text-gray-400 mb-2 group-hover:text-rose-500 transition-colors" />
                        <span className="text-gray-500 text-sm font-semibold group-hover:text-rose-600 transition-colors">Adicionar Capa</span>
                    </>
                )}
                <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wide">Nome do Grupo</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Galera do Backstage"
                        className="w-full bg-white border border-gray-200 rounded-xl p-3 text-gray-900 focus:border-rose-500 focus:ring-rose-500 outline-none transition-shadow shadow-sm placeholder-gray-400"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wide">Descrição</label>
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Sobre o que é este grupo?"
                        rows={3}
                        className="w-full bg-white border border-gray-200 rounded-xl p-3 text-gray-900 focus:border-rose-500 focus:ring-rose-500 outline-none resize-none transition-shadow shadow-sm placeholder-gray-400"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wide">Vincular a Evento (Opcional)</label>
                    <select 
                        value={selectedEventId}
                        onChange={(e) => setSelectedEventId(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl p-3 text-gray-900 focus:border-rose-500 focus:ring-rose-500 outline-none transition-shadow shadow-sm"
                    >
                        <option value="">Nenhum evento vinculado</option>
                        {availableEvents.map(event => (
                            <option key={event.id} value={event.id}>{event.name} - {event.date}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>

        <footer className="p-4 bg-white border-t border-gray-100">
          <button
            onClick={handleSubmit}
            disabled={!name || !description || !coverImage || isCreating}
            className="w-full bg-rose-500 text-white font-bold py-4 px-4 rounded-2xl hover:bg-rose-600 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-rose-500/20"
          >
            {isCreating ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
                'Criar Grupo'
            )}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default CreateGroupModal;
