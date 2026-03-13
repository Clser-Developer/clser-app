import React from 'react';
import Icon from './Icon';

interface AddressModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const AddressModal: React.FC<AddressModalProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally save the address
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[60] flex items-end justify-center" aria-modal="true" role="dialog">
      <div className="bg-gray-800 rounded-t-2xl w-full max-w-md shadow-2xl border-t border-gray-700 animate-slide-up">
        <header className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Alterar Endereço</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-700">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="cep" className="block text-sm font-medium text-gray-300 mb-1">CEP</label>
              <input type="text" id="cep" defaultValue="01234-567" className="w-full bg-gray-700 border-gray-600 rounded-md p-3 text-white focus:ring-magenta-500 focus:border-magenta-500" />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">Endereço</label>
              <input type="text" id="address" defaultValue="Rua dos Fãs, 123" className="w-full bg-gray-700 border-gray-600 rounded-md p-3 text-white focus:ring-magenta-500 focus:border-magenta-500" />
            </div>
             <div>
              <label htmlFor="complement" className="block text-sm font-medium text-gray-300 mb-1">Complemento</label>
              <input type="text" id="complement" defaultValue="Apto 456" className="w-full bg-gray-700 border-gray-600 rounded-md p-3 text-white focus:ring-magenta-500 focus:border-magenta-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1">Cidade</label>
                <input type="text" id="city" defaultValue="São Paulo" className="w-full bg-gray-700 border-gray-600 rounded-md p-3 text-white focus:ring-magenta-500 focus:border-magenta-500" />
              </div>
               <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-300 mb-1">Estado</label>
                <input type="text" id="state" defaultValue="SP" className="w-full bg-gray-700 border-gray-600 rounded-md p-3 text-white focus:ring-magenta-500 focus:border-magenta-500" />
              </div>
            </div>
          </div>
          <footer className="p-4 bg-gray-900/50">
            <button
              type="submit"
              className="w-full bg-orange-500 text-white font-bold py-4 px-4 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Salvar Endereço
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
