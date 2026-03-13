
import React from 'react';
import Icon from './Icon';

interface ImageViewerModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

const ImageViewerModal: React.FC<ImageViewerModalProps> = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full max-w-lg animate-scale-in"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image/container
      >
        <img
          src={imageUrl}
          alt="Visualização ampliada"
          className="rounded-lg shadow-2xl w-full h-auto object-contain max-h-[80vh]"
        />
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-gray-800 p-2 rounded-full text-white hover:bg-gray-700 transition-colors border-2 border-gray-900 shadow-lg"
          aria-label="Fechar imagem"
        >
          <Icon name="close" className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ImageViewerModal;