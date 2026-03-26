
import React, { useState, useRef, ChangeEvent } from 'react';
import { MerchItem } from '../../types';
import Icon from '../Icon';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ModalBody, ModalCloseButton, ModalFooter, ModalHeader, ModalShell, ModalTitle } from '../ui/modal-shell';
import { Textarea } from '../ui/textarea';

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
    <ModalShell open={isVisible} onClose={onClose} variant="sheet">
      <ModalHeader>
        <ModalTitle>Adicionar Produto</ModalTitle>
        <ModalCloseButton onClick={onClose} />
      </ModalHeader>

      <ModalBody className="space-y-4 overflow-y-auto">
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
                <Input
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Camiseta Tour 2025"
                    className="h-12 rounded-xl border-gray-200 bg-white shadow-sm focus-visible:border-rose-300 focus-visible:ring-rose-500/25"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wide">Preço (R$)</label>
                <Input
                    type="number" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0,00"
                    className="h-12 rounded-xl border-gray-200 bg-white shadow-sm focus-visible:border-rose-300 focus-visible:ring-rose-500/25"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wide">Descrição</label>
                <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detalhes do produto..."
                    rows={3}
                    className="min-h-24 rounded-xl border-gray-200 bg-white shadow-sm focus-visible:border-rose-300 focus-visible:ring-rose-500/25"
                />
            </div>
      </ModalBody>

      <ModalFooter className="pb-8">
          <Button
            onClick={handleSubmit}
            disabled={!name || !price || !image || isSaving}
            className="h-14 w-full rounded-2xl text-sm font-black shadow-lg shadow-rose-500/20"
          >
            {isSaving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
                'Salvar Produto'
            )}
          </Button>
      </ModalFooter>
    </ModalShell>
  );
};

export default AddProductModal;
