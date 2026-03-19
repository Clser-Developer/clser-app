
import React, { useEffect, useState } from 'react';
import Icon from './Icon';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ModalBody, ModalCloseButton, ModalFooter, ModalHeader, ModalShell, ModalTitle } from './ui/modal-shell';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

interface PaymentMethodModalProps {
  isVisible: boolean;
  onClose: () => void;
  currentMethod: 'credit-card' | 'pix';
  onSelectMethod: (method: 'credit-card' | 'pix') => void;
}

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({ isVisible, onClose, currentMethod, onSelectMethod }) => {
  const [selectedMethod, setSelectedMethod] = useState(currentMethod);
  const [selectedCard, setSelectedCard] = useState('1234');

  useEffect(() => {
    if (!isVisible) return;
    setSelectedMethod(currentMethod);
  }, [currentMethod, isVisible]);

  if (!isVisible) return null;

  const handleSave = () => {
    onSelectMethod(selectedMethod);
    onClose();
  };

  return (
    <ModalShell open={isVisible} onClose={onClose} variant="sheet">
      <ModalHeader>
        <ModalTitle className="ml-1">Forma de Pagamento</ModalTitle>
        <ModalCloseButton onClick={onClose} />
      </ModalHeader>
      <ModalBody>
          <Tabs
            value={selectedMethod}
            onValueChange={(value) => setSelectedMethod(value as 'credit-card' | 'pix')}
            className="mb-8"
          >
            <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-gray-50 p-1.5 shadow-inner">
              <TabsTrigger
                value="credit-card"
                className="rounded-xl text-xs font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-rose-500 data-[state=active]:shadow-sm"
              >
                Crédito
              </TabsTrigger>
              <TabsTrigger
                value="pix"
                className="rounded-xl text-xs font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-rose-500 data-[state=active]:shadow-sm"
              >
                Pix
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {selectedMethod === 'credit-card' ? (
            <div className="space-y-4">
               <button onClick={() => setSelectedCard('1234')} className={`w-full text-left p-5 rounded-2xl border-2 flex items-center justify-between transition-all group ${selectedCard === '1234' ? 'border-rose-500 bg-rose-50/50 shadow-sm' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}>
                    <div className="flex items-center space-x-4">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                            <Icon name="credit-card" className="w-6 h-6 text-gray-900" />
                        </div>
                        <p className="font-black text-gray-900 text-sm italic">•••• •••• •••• 1234</p>
                    </div>
                    {selectedCard === '1234' && <Icon name="check-circle" className="w-6 h-6 text-rose-500" />}
                </button>
                 <button onClick={() => setSelectedCard('5678')} className={`w-full text-left p-5 rounded-2xl border-2 flex items-center justify-between transition-all group ${selectedCard === '5678' ? 'border-rose-500 bg-rose-50/50 shadow-sm' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}>
                    <div className="flex items-center space-x-4">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                            <Icon name="credit-card" className="w-6 h-6 text-gray-900" />
                        </div>
                        <p className="font-black text-gray-900 text-sm italic">•••• •••• •••• 5678</p>
                    </div>
                    {selectedCard === '5678' && <Icon name="check-circle" className="w-6 h-6 text-rose-500" />}
                </button>
                <Button variant="outline" className="mt-4 h-14 w-full rounded-2xl border-dashed text-xs font-black uppercase tracking-widest text-gray-500 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-500">
                    Adicionar novo cartão
                </Button>
            </div>
          ) : (
            <Card className="gap-4 rounded-3xl border-gray-100 bg-gray-50 p-8 text-center shadow-inner">
              <Icon name="device-mobile" className="w-12 h-12 text-rose-500 mx-auto mb-4" />
              <p className="text-gray-600 text-sm font-medium leading-relaxed">Na próxima tela, um <span className="font-black">QR Code Dinâmico</span> será gerado para seu pagamento instantâneo.</p>
            </Card>
          )}
      </ModalBody>
      <ModalFooter className="pb-10">
          <Button
            onClick={handleSave}
            className="w-full rounded-2xl py-6 text-sm font-black"
          >
            Confirmar Seleção
          </Button>
      </ModalFooter>
    </ModalShell>
  );
};

export default PaymentMethodModal;
