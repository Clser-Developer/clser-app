
import React, { useState, useRef, ChangeEvent } from 'react';
import Icon from './Icon';
import { Button } from './ui/button';
import { ModalBody, ModalCloseButton, ModalFooter, ModalHeader, ModalShell, ModalTitle } from './ui/modal-shell';
import { Textarea } from './ui/textarea';

interface MuralPostModalProps {
  isVisible: boolean;
  onClose: () => void;
  onPost: (imageDataUrl: string, caption: string) => void;
}

const MuralPostModal: React.FC<MuralPostModalProps> = ({ isVisible, onClose, onPost }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isVisible) return null;

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  const handlePost = () => {
    if (!previewUrl || !caption.trim()) return;
    setIsPosting(true);
    setTimeout(() => {
      onPost(previewUrl, caption.trim());
      setIsPosting(false);
      setImageFile(null);
      setPreviewUrl(null);
      setCaption('');
      onClose();
    }, 1500);
  };

  return (
    <ModalShell open={isVisible} onClose={onClose} variant="sheet">
      <ModalHeader>
        <ModalTitle>Novo Post</ModalTitle>
        <ModalCloseButton onClick={onClose} />
      </ModalHeader>
      <ModalBody className="space-y-6 overflow-y-auto no-scrollbar">
          {previewUrl ? (
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-100">
              <img src={previewUrl} alt="Preview" className="w-full h-auto max-h-80 object-contain bg-gray-50" />
              <button
                onClick={triggerFileSelect}
                className="absolute bottom-3 right-3 bg-white/90 backdrop-blur text-gray-900 text-[10px] font-black py-2 px-4 rounded-full shadow-lg hover:bg-white transition-all uppercase tracking-wider"
              >
                Trocar Imagem
              </button>
            </div>
          ) : (
            <button
              onClick={triggerFileSelect}
              className="w-full aspect-video border-4 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center text-gray-400 hover:border-rose-200 hover:text-rose-500 hover:bg-rose-50 transition-all group"
            >
              <div className="bg-white p-4 rounded-2xl shadow-md mb-4 group-hover:scale-110 transition-transform">
                <Icon name="camera" className="w-10 h-10" />
              </div>
              <span className="font-black text-sm text-gray-900">Selecionar Foto</span>
              <span className="text-xs font-medium mt-1">PNG, JPG até 10MB</span>
            </button>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Legenda</label>
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Conta aí o que está rolando..."
              rows={4}
              maxLength={280}
              className="min-h-28 rounded-2xl border-gray-100 bg-gray-50 p-4 text-sm font-medium shadow-inner focus-visible:border-rose-300 focus-visible:ring-rose-500/30"
            />
          </div>
      </ModalBody>
      <ModalFooter className="bg-gray-50/50 pb-10">
          <Button
            onClick={handlePost}
            disabled={!previewUrl || !caption.trim() || isPosting}
            className="h-14 w-full rounded-2xl text-sm font-black shadow-lg shadow-rose-500/20"
          >
            {isPosting ? (
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Publicar no Mural'
            )}
          </Button>
      </ModalFooter>
    </ModalShell>
  );
};

export default MuralPostModal;
