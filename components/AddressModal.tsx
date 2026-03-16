
import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import { useGlobalUserState } from '../hooks/useGlobalUserState';
import { UserAddress } from '../types';

interface AddressModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const LoadingSpinner: React.FC<{ small?: boolean }> = ({ small = false }) => (
    <div className={`${small ? 'w-5 h-5 border-2' : 'w-6 h-6 border-4'} border-rose-500 border-t-transparent rounded-full animate-spin`}></div>
);

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-end justify-center" aria-modal="true" role="dialog">
      <div className="bg-white rounded-t-[2.5rem] w-full max-w-md shadow-2xl border-t border-gray-100 animate-slide-up flex flex-col">
        <header className="p-4 border-b border-gray-100 flex justify-between items-center shrink-0">
          <h2 className="text-lg font-bold text-gray-900 ml-4">Endereço de Entrega</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>
        <div className="p-6 max-h-[60vh] overflow-y-auto no-scrollbar space-y-5">
            <div className="relative">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">CEP</label>
                <input type="text" value={localAddress.cep} onChange={e => setLocalAddress({...localAddress, cep: e.target.value})} maxLength={9} className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-gray-900 font-bold focus:ring-2 focus:ring-rose-500 outline-none transition-all" />
                {isCepLoading && <div className="absolute right-4 top-10"><LoadingSpinner small /></div>}
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Rua / Logradouro</label>
                    <input type="text" value={localAddress.street} onChange={e => setLocalAddress({...localAddress, street: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-gray-900 font-bold focus:ring-2 focus:ring-rose-500 outline-none transition-all" />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Número</label>
                    <input type="text" value={localAddress.number} onChange={e => setLocalAddress({...localAddress, number: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-gray-900 font-bold focus:ring-2 focus:ring-rose-500 outline-none transition-all" />
                </div>
            </div>
            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Complemento</label>
                <input type="text" value={localAddress.complement} onChange={e => setLocalAddress({...localAddress, complement: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-gray-900 font-bold focus:ring-2 focus:ring-rose-500 outline-none transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Bairro</label>
                    <input type="text" value={localAddress.neighborhood} onChange={e => setLocalAddress({...localAddress, neighborhood: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-gray-900 font-bold focus:ring-2 focus:ring-rose-500 outline-none transition-all" />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Cidade</label>
                    <input type="text" value={localAddress.city} onChange={e => setLocalAddress({...localAddress, city: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-gray-900 font-bold focus:ring-2 focus:ring-rose-500 outline-none transition-all" />
                </div>
            </div>
            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Estado (UF)</label>
                <input type="text" value={localAddress.state} onChange={e => setLocalAddress({...localAddress, state: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-gray-900 font-bold focus:ring-2 focus:ring-rose-500 outline-none transition-all" />
            </div>
        </div>
        <footer className="p-6 bg-white border-t border-gray-100 pb-10">
          <button
            onClick={handleSave}
            className="w-full bg-gray-900 text-white font-black py-4 px-4 rounded-2xl hover:bg-black transition-all shadow-xl active:scale-95"
          >
            Salvar Endereço
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AddressModal;
