
import React, { useState } from 'react';
import Icon from '../Icon';

interface PayoutSettingsModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const PayoutSettingsModal: React.FC<PayoutSettingsModalProps> = ({ isVisible, onClose }) => {
  const [pixKey, setPixKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!isVisible) return null;

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="absolute inset-0 bg-white z-[70] flex flex-col animate-fade-in" aria-modal="true" role="dialog">
        <header className="p-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
          <h2 className="text-lg font-bold text-gray-900">Dados Financeiros</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-3xl text-white shadow-lg shadow-green-500/20">
                <p className="text-green-100 text-sm font-medium mb-1">Saldo Disponível</p>
                <div className="flex justify-between items-center">
                    <span className="text-3xl font-black">R$ 2.450,00</span>
                    <button className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-4 py-2 rounded-full border border-white/30 transition-colors backdrop-blur-sm">
                        Solicitar Saque
                    </button>
                </div>
            </div>

            <div>
                <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                    <div className="p-2 rounded-full bg-rose-100 mr-3">
                        <Icon name="currency-dollar" className="w-5 h-5 text-rose-500" />
                    </div>
                    Conta de Recebimento
                </h3>
                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wide">Chave Pix</label>
                        <input 
                            type="text" 
                            value={pixKey}
                            onChange={(e) => setPixKey(e.target.value)}
                            placeholder="CPF, E-mail ou Telefone"
                            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-gray-900 focus:border-rose-500 focus:ring-rose-500 outline-none transition-shadow shadow-sm"
                        />
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        O valor das vendas é liberado 14 dias após a confirmação do pagamento.
                    </p>
                </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
                <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide text-gray-400">Histórico Recente</h3>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm items-center p-3 rounded-xl hover:bg-gray-50 transition-colors">
                        <span className="font-medium text-gray-700">Saque Pix - 15/10</span>
                        <span className="font-bold text-gray-900">- R$ 1.200,00</span>
                    </div>
                    <div className="flex justify-between text-sm items-center p-3 rounded-xl hover:bg-gray-50 transition-colors">
                        <span className="font-medium text-gray-700">Saque Pix - 01/10</span>
                        <span className="font-bold text-gray-900">- R$ 3.500,00</span>
                    </div>
                </div>
            </div>
        </div>

        <footer className="p-4 bg-white border-t border-gray-100 shrink-0">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-rose-500 text-white font-bold py-4 px-4 rounded-2xl hover:bg-rose-600 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-rose-500/20"
          >
            {isSaving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
                'Salvar Dados'
            )}
          </button>
        </footer>
    </div>
  );
};

export default PayoutSettingsModal;
