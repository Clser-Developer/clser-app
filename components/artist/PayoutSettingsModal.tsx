
import React, { useState } from 'react';
import Icon from '../Icon';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { ModalBody, ModalCloseButton, ModalFooter, ModalHeader, ModalShell, ModalTitle } from '../ui/modal-shell';

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
    <ModalShell open={isVisible} onClose={onClose} variant="fullscreen" className="absolute inset-0 z-[70]">
        <ModalHeader className="bg-white">
          <ModalTitle>Dados Financeiros</ModalTitle>
          <ModalCloseButton onClick={onClose} />
        </ModalHeader>

        <ModalBody className="flex-1 space-y-6 overflow-y-auto no-scrollbar">
            <Card className="gap-3 rounded-3xl border-none bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white shadow-lg shadow-green-500/20">
                <p className="text-green-100 text-sm font-medium mb-1">Saldo Disponível</p>
                <div className="flex justify-between items-center">
                    <span className="text-3xl font-black">R$ 2.450,00</span>
                    <Button variant="outline" className="rounded-full border-white/30 bg-white/20 px-4 py-2 text-xs font-black text-white backdrop-blur-sm hover:bg-white/30 hover:text-white">
                        Solicitar Saque
                    </Button>
                </div>
            </Card>

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
                        <Input
                            type="text" 
                            value={pixKey}
                            onChange={(e) => setPixKey(e.target.value)}
                            placeholder="CPF, E-mail ou Telefone"
                            className="h-12 rounded-xl border-gray-200 bg-white shadow-sm focus-visible:border-rose-300 focus-visible:ring-rose-500/25"
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
        </ModalBody>

        <ModalFooter className="shrink-0">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="h-14 w-full rounded-2xl text-sm font-black shadow-lg shadow-rose-500/20"
          >
            {isSaving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
                'Salvar Dados'
            )}
          </Button>
        </ModalFooter>
    </ModalShell>
  );
};

export default PayoutSettingsModal;
