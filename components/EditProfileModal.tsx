
import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import CountrySelect from './CountrySelect';
import { useGlobalUserState } from '../hooks/useGlobalUserState';
import { UserAddress, UserPhone } from '../types';

interface EditProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
  initialTab?: string;
}

const LoadingSpinner: React.FC<{ small?: boolean }> = ({ small = false }) => (
    <div className={`${small ? 'w-5 h-5 border-2' : 'w-6 h-6 border-4'} border-white border-t-transparent rounded-full animate-spin`}></div>
);

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isVisible, onClose, initialTab = 'personal' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const {
      fullName, setFullName,
      nickname, setNickname,
      email, setEmail,
      cpf, setCpf,
      phone, setPhone,
      address, setAddress
  } = useGlobalUserState();

  const [localFullName, setLocalFullName] = useState(fullName);
  const [localNickname, setLocalNickname] = useState(nickname);
  const [localEmail, setLocalEmail] = useState(email);
  const [localCpf, setLocalCpf] = useState(cpf);
  const [localPhone, setLocalPhone] = useState<UserPhone>(phone);
  const [localAddress, setLocalAddress] = useState<UserAddress>(address);
  
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (!isVisible) {
      // Reset local state to global state when modal is closed without saving
      setLocalFullName(fullName);
      setLocalNickname(nickname);
      setLocalEmail(email);
      setLocalCpf(cpf);
      setLocalPhone(phone);
      setLocalAddress(address);
    }
  }, [isVisible, fullName, nickname, email, cpf, phone, address]);
  
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
    setFullName(localFullName);
    setNickname(localNickname);
    setEmail(localEmail);
    setCpf(localCpf);
    setPhone(localPhone);
    setAddress(localAddress);
    onClose();
  };
  
  if (!isVisible) return null;

  const tabs = [
    { key: 'personal', label: 'Dados Pessoais' },
    { key: 'address', label: 'Endereço' },
  ];
  
  const renderPersonalForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Nome Completo</label>
        <input type="text" value={localFullName} onChange={e => setLocalFullName(e.target.value)} className="w-full bg-gray-700 border-gray-600 rounded-md p-3 text-white focus:ring-magenta-500 focus:border-magenta-500" />
      </div>
       <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Apelido no Fã Clube</label>
        <input type="text" value={localNickname} onChange={e => setLocalNickname(e.target.value)} className="w-full bg-gray-700 border-gray-600 rounded-md p-3 text-white focus:ring-magenta-500 focus:border-magenta-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">E-mail de Login</label>
        <input type="email" value={localEmail} onChange={e => setLocalEmail(e.target.value)} className="w-full bg-gray-700 border-gray-600 rounded-md p-3 text-white focus:ring-magenta-500 focus:border-magenta-500" />
      </div>
       <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">CPF</label>
        <input type="text" value={localCpf} onChange={e => setLocalCpf(e.target.value)} className="w-full bg-gray-700 border-gray-600 rounded-md p-3 text-white focus:ring-magenta-500 focus:border-magenta-500" />
      </div>
      <div className="flex items-start space-x-2">
          <CountrySelect selectedDDI={localPhone.ddi} onDDIChange={ddi => setLocalPhone({ ...localPhone, ddi })}/>
          <div className="flex-1">
               <label className="block text-sm font-medium text-gray-300 mb-1">Telefone</label>
              <input type="tel" value={localPhone.number} onChange={e => setLocalPhone({ ...localPhone, number: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white focus:ring-magenta-500 focus:border-magenta-500" />
          </div>
      </div>
    </div>
  );
  
  const renderAddressForm = () => (
    <div className="space-y-4">
        <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-1">CEP</label>
            <input type="text" value={localAddress.cep} onChange={e => setLocalAddress({...localAddress, cep: e.target.value})} maxLength={9} className="w-full bg-gray-700 border rounded-md p-3 text-white focus:ring-magenta-500 focus:border-magenta-500 border-gray-600" />
            {isCepLoading && <div className="absolute right-3 top-9"><LoadingSpinner small /></div>}
        </div>
         <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Rua</label>
                <input type="text" value={localAddress.street} onChange={e => setLocalAddress({...localAddress, street: e.target.value})} className="w-full bg-gray-700 border rounded-md p-3 text-white focus:ring-magenta-500 focus:border-magenta-500 border-gray-600" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Nº</label>
                <input type="text" value={localAddress.number} onChange={e => setLocalAddress({...localAddress, number: e.target.value})} className="w-full bg-gray-700 border rounded-md p-3 text-white focus:ring-magenta-500 focus:border-magenta-500 border-gray-600" />
            </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Complemento</label>
            <input type="text" value={localAddress.complement} onChange={e => setLocalAddress({...localAddress, complement: e.target.value})} className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white focus:ring-magenta-500 focus:border-magenta-500" />
        </div>
         <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Bairro</label>
                <input type="text" value={localAddress.neighborhood} onChange={e => setLocalAddress({...localAddress, neighborhood: e.target.value})} className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white focus:ring-magenta-500 focus:border-magenta-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Cidade</label>
                <input type="text" value={localAddress.city} onChange={e => setLocalAddress({...localAddress, city: e.target.value})} className="w-full bg-gray-700 border rounded-md p-3 text-white focus:ring-magenta-500 focus:border-magenta-500 border-gray-600" />
            </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Estado</label>
            <input type="text" value={localAddress.state} onChange={e => setLocalAddress({...localAddress, state: e.target.value})} className="w-full bg-gray-700 border rounded-md p-3 text-white focus:ring-magenta-500 focus:border-magenta-500 border-gray-600" />
        </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 z-[60] flex items-end justify-center" aria-modal="true" role="dialog">
      <div className="bg-gray-800 rounded-t-2xl w-full max-w-md shadow-2xl border-t border-gray-700 animate-slide-up">
        <header className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Editar Perfil</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-700">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>
        
        <div className="border-b border-gray-700 flex">
            {tabs.map(tab => (
                 <button 
                    key={tab.key} 
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === tab.key ? 'text-orange-400 border-b-2 border-orange-400' : 'text-gray-400 hover:text-white'}`}
                >
                    {tab.label}
                 </button>
            ))}
        </div>

        <div className="p-6 max-h-[50vh] overflow-y-auto">
          {activeTab === 'personal' && renderPersonalForm()}
          {activeTab === 'address' && renderAddressForm()}
        </div>

        <footer className="p-4 bg-gray-900/50">
          <button
            onClick={handleSave}
            className="w-full bg-orange-500 text-white font-bold py-4 px-4 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Salvar Alterações
          </button>
        </footer>
      </div>
    </div>
  );
};

export default EditProfileModal;
