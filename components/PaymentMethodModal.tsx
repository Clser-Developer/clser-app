
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-end justify-center" aria-modal="true" role="dialog">
      <div className="bg-white rounded-t-[2.5rem] w-full max-w-md shadow-2xl border-t border-gray-100 animate-slide-up flex flex-col">
        <header className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 ml-4">Forma de Pagamento</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>
        <div className="p-6">
          <div className="flex bg-gray-50 p-1 rounded-2xl mb-8 border border-gray-100 shadow-inner">
            <button onClick={() => setSelectedMethod('credit-card')} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${selectedMethod === 'credit-card' ? 'bg-white text-rose-500 shadow-md scale-[1.02]' : 'text-gray-400 hover:text-gray-600'}`}>Crédito</button>
            <button onClick={() => setSelectedMethod('pix')} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${selectedMethod === 'pix' ? 'bg-white text-rose-500 shadow-md scale-[1.02]' : 'text-gray-400 hover:text-gray-600'}`}>Pix</button>
          </div>

          {selectedMethod === 'credit-card' ? (
            <div className="space-y-4">
               <button onClick={() => setSelectedCard('1234')} className={`w-full text-left p-5 rounded-2xl border-2 flex items-center justify-between transition-all group ${selectedCard === '1234' ? 'border-rose-500 bg-rose-50/50' : 'border-gray-50 bg-gray-50 hover:border-gray-200'}`}>
                    <div className="flex items-center space-x-4">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                            <Icon name="credit-card" className="w-6 h-6 text-gray-900" />
                        </div>
                        <p className="font-black text-gray-900 text-sm italic">•••• •••• •••• 1234</p>
                    </div>
                    {selectedCard === '1234' && <Icon name="check-circle" className="w-6 h-6 text-rose-500" />}
                </button>
                 <button onClick={() => setSelectedCard('5678')} className={`w-full text-left p-5 rounded-2xl border-2 flex items-center justify-between transition-all group ${selectedCard === '5678' ? 'border-rose-500 bg-rose-50/50' : 'border-gray-50 bg-gray-50 hover:border-gray-200'}`}>
                    <div className="flex items-center space-x-4">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                            <Icon name="credit-card" className="w-6 h-6 text-gray-900" />
                        </div>
                        <p className="font-black text-gray-900 text-sm italic">•••• •••• •••• 5678</p>
                    </div>
                    {selectedCard === '5678' && <Icon name="check-circle" className="w-6 h-6 text-rose-500" />}
                </button>
                <button className="w-full text-center p-4 border-2 border-dashed border-gray-200 text-gray-400 font-black text-xs uppercase tracking-widest rounded-2xl hover:border-rose-300 hover:text-rose-500 hover:bg-rose-50 transition-all mt-4">
                    Adicionar novo cartão
                </button>
            </div>
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-3xl border border-gray-100 shadow-inner">
              <Icon name="device-mobile" className="w-12 h-12 text-rose-500 mx-auto mb-4" />
              <p className="text-gray-600 text-sm font-medium leading-relaxed">Na próxima tela, um <span className="font-black">QR Code Dinâmico</span> será gerado para seu pagamento instantâneo.</p>
            </div>
          )}
        </div>
        <footer className="p-6 bg-white border-t border-gray-100 pb-10">
          <button
            onClick={handleSave}
            className="w-full bg-gray-900 text-white font-black py-4 px-4 rounded-2xl hover:bg-black transition-all shadow-xl active:scale-95"
          >
            Confirmar Seleção
          </button>
        </footer>
      </div>
    </div>
  );
};

export default PaymentMethodModal;
