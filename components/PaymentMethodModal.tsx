import React, { useState } from 'react';
import Icon from './Icon';

interface PaymentMethodModalProps {
  isVisible: boolean;
  onClose: () => void;
  currentMethod: 'credit-card' | 'pix';
  onSelectMethod: (method: 'credit-card' | 'pix') => void;
}

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({ isVisible, onClose, currentMethod, onSelectMethod }) => {
  const [selectedMethod, setSelectedMethod] = useState(currentMethod);
  const [selectedCard, setSelectedCard] = useState('1234');

  if (!isVisible) return null;

  const handleSave = () => {
    onSelectMethod(selectedMethod);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[60] flex items-end justify-center" aria-modal="true" role="dialog">
      <div className="bg-gray-800 rounded-t-2xl w-full max-w-md shadow-2xl border-t border-gray-700 animate-slide-up">
        <header className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Forma de Pagamento</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-700">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>
        <div className="p-6">
          <div className="flex bg-gray-900/50 p-1 rounded-lg mb-6">
            <button onClick={() => setSelectedMethod('credit-card')} className={`w-1/2 py-2 text-sm font-bold rounded-md transition-colors ${selectedMethod === 'credit-card' ? 'bg-orange-500 text-white' : 'text-gray-300'}`}>Cartão de Crédito</button>
            <button onClick={() => setSelectedMethod('pix')} className={`w-1/2 py-2 text-sm font-bold rounded-md transition-colors ${selectedMethod === 'pix' ? 'bg-orange-500 text-white' : 'text-gray-300'}`}>Pix</button>
          </div>

          {selectedMethod === 'credit-card' ? (
            <div className="space-y-3">
               <button onClick={() => setSelectedCard('1234')} className={`w-full text-left p-4 rounded-lg border-2 flex items-center justify-between ${selectedCard === '1234' ? 'border-orange-500 bg-orange-500/10' : 'border-gray-700 bg-gray-900/50'}`}>
                    <p className="font-semibold text-white">**** **** **** 1234</p>
                    {selectedCard === '1234' && <Icon name="check-circle" className="w-6 h-6 text-orange-400" />}
                </button>
                 <button onClick={() => setSelectedCard('5678')} className={`w-full text-left p-4 rounded-lg border-2 flex items-center justify-between ${selectedCard === '5678' ? 'border-orange-500 bg-orange-500/10' : 'border-gray-700 bg-gray-900/50'}`}>
                    <p className="font-semibold text-white">**** **** **** 5678</p>
                    {selectedCard === '5678' && <Icon name="check-circle" className="w-6 h-6 text-orange-400" />}
                </button>
                <button className="w-full text-center p-3 border-2 border-dashed border-gray-600 text-gray-300 font-semibold rounded-lg hover:border-orange-500 hover:text-orange-400 transition-colors">
                    Adicionar novo cartão
                </button>
            </div>
          ) : (
            <div className="text-center p-6 bg-gray-900/50 rounded-lg">
              <p className="text-gray-300">Na próxima tela, um QR Code será gerado para pagamento com Pix.</p>
            </div>
          )}
        </div>
        <footer className="p-4 bg-gray-900/50">
          <button
            onClick={handleSave}
            className="w-full bg-orange-500 text-white font-bold py-4 px-4 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Salvar
          </button>
        </footer>
      </div>
    </div>
  );
};

export default PaymentMethodModal;
