
import React, { useState, useRef, ChangeEvent } from 'react';
import { MerchItem } from '../../types';
import Icon from '../Icon';

interface AddProductModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (product: MerchItem) => void;
  artistId: string;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isVisible, onClose, onSave, artistId }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isVisible) return null;

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!name || !price || !image) return;

    setIsSaving(true);
    setTimeout(() => {
        const newProduct: MerchItem = {
            id: `m-${Date.now()}`,
            artistId,
            name,
            price: parseFloat(price.replace(',', '.')),
            description: description || 'Novo item exclusivo.',
            imageUrls: [image],
            sizes: ['P', 'M', 'G', 'GG'], // Default sizes for demo
            isOnSale: false
        };

        onSave(newProduct);
        setIsSaving(false);
        
        // Reset
        setName('');
        setPrice('');
        setDescription('');
        setImage(null);
        onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-end justify-center" aria-modal="true" role="dialog">
      <div className="bg-white rounded-t-3xl w-full max-w-md shadow-2xl border-t border-gray-100 animate-slide-up flex flex-col max-h-[90vh]">
        <header className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Adicionar Produto</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>

        <div className="p-6 space-y-4 overflow-y-auto">
            {/* Image Upload */}
            <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-rose-400 hover:bg-rose-50 transition-colors overflow-hidden relative group"
            >
                {image ? (
                    <>
                        <img src={image} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white font-bold text-sm bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">Trocar Imagem</span>
                        </div>
                    </>
                ) : (
                    <>
                        <Icon name="camera" className="w-8 h-8 text-gray-400 mb-2 group-hover:text-rose-500 transition-colors" />
                        <span className="text-gray-500 text-sm font-semibold group-hover:text-rose-600 transition-colors">Adicionar Foto</span>
                    </>
                )}
                <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
            </div>

            {/* Fields */}
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wide">Nome do Produto</label>
                <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Camiseta Tour 2025"
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-gray-900 focus:border-rose-500 focus:ring-rose-500 outline-none transition-shadow shadow-sm placeholder-gray-400"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wide">Preço (R$)</label>
                <input 
                    type="number" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0,00"
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-gray-900 focus:border-rose-500 focus:ring-rose-500 outline-none transition-shadow shadow-sm placeholder-gray-400"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wide">Descrição</label>
                <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detalhes do produto..."
                    rows={3}
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-gray-900 focus:border-rose-500 focus:ring-rose-500 outline-none resize-none transition-shadow shadow-sm placeholder-gray-400"
                />
            </div>
        </div>

        <footer className="p-4 bg-white border-t border-gray-100 pb-8">
          <button
            onClick={handleSubmit}
            disabled={!name || !price || !image || isSaving}
            className="w-full bg-rose-500 text-white font-bold py-4 px-4 rounded-2xl hover:bg-rose-600 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-rose-500/20"
          >
            {isSaving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
                'Salvar Produto'
            )}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AddProductModal;
