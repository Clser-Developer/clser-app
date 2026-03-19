
import React, { useState, useEffect } from 'react';
import { useGlobalUserState } from '../hooks/useGlobalUserState';
import { UserAddress } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ModalBody, ModalCloseButton, ModalFooter, ModalHeader, ModalShell, ModalTitle } from './ui/modal-shell';

interface AddressModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const LoadingSpinner: React.FC<{ small?: boolean }> = ({ small = false }) => (
    <div className={`${small ? 'w-5 h-5 border-2' : 'w-6 h-6 border-4'} border-rose-500 border-t-transparent rounded-full animate-spin`}></div>
);

const fieldClassName =
  'h-14 rounded-2xl border-2 border-gray-100 bg-gray-50 px-4 text-base font-bold text-gray-900 shadow-sm focus-visible:border-rose-300 focus-visible:ring-rose-500/30';

const AddressModal: React.FC<AddressModalProps> = ({ isVisible, onClose }) => {
  const { address, setAddress } = useGlobalUserState();
  const [localAddress, setLocalAddress] = useState<UserAddress>(address);
  const [isCepLoading, setIsCepLoading] = useState(false);

  useEffect(() => {
    if (isVisible) setLocalAddress(address);
  }, [isVisible, address]);

  useEffect(() => {
    const cep = localAddress.cep.replace(/\D/g, '');
    if (cep.length === 8) {
        setIsCepLoading(true);
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(res => res.json())
            .then(data => {
                if (!data.erro) {
                    setLocalAddress(prev => ({
                        ...prev,
                        street: data.logradouro,
                        neighborhood: data.bairro,
                        city: data.localidade,
                        state: data.uf,
                    }));
                }
            })
            .finally(() => setIsCepLoading(false));
    }
  }, [localAddress.cep]);

  const handleSave = () => {
    setAddress(localAddress);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <ModalShell open={isVisible} onClose={onClose} variant="sheet">
      <ModalHeader>
        <ModalTitle className="ml-1">Endereço de Entrega</ModalTitle>
        <ModalCloseButton onClick={onClose} />
      </ModalHeader>
      <ModalBody className="max-h-[60vh] space-y-5 overflow-y-auto no-scrollbar">
            <div className="relative">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">CEP</label>
                <Input type="text" value={localAddress.cep} onChange={e => setLocalAddress({...localAddress, cep: e.target.value})} maxLength={9} className={fieldClassName} />
                {isCepLoading && <div className="absolute right-4 top-10"><LoadingSpinner small /></div>}
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Rua / Logradouro</label>
                    <Input type="text" value={localAddress.street} onChange={e => setLocalAddress({...localAddress, street: e.target.value})} className={fieldClassName} />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Número</label>
                    <Input type="text" value={localAddress.number} onChange={e => setLocalAddress({...localAddress, number: e.target.value})} className={fieldClassName} />
                </div>
            </div>
            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Complemento</label>
                <Input type="text" value={localAddress.complement} onChange={e => setLocalAddress({...localAddress, complement: e.target.value})} className={fieldClassName} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Bairro</label>
                    <Input type="text" value={localAddress.neighborhood} onChange={e => setLocalAddress({...localAddress, neighborhood: e.target.value})} className={fieldClassName} />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Cidade</label>
                    <Input type="text" value={localAddress.city} onChange={e => setLocalAddress({...localAddress, city: e.target.value})} className={fieldClassName} />
                </div>
            </div>
            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Estado (UF)</label>
                <Input type="text" value={localAddress.state} onChange={e => setLocalAddress({...localAddress, state: e.target.value})} className={fieldClassName} />
            </div>
      </ModalBody>
      <ModalFooter className="pb-10">
          <Button
            onClick={handleSave}
            className="w-full rounded-2xl py-6 text-sm font-black"
          >
            Salvar Endereço
          </Button>
      </ModalFooter>
    </ModalShell>
  );
};

export default AddressModal;
