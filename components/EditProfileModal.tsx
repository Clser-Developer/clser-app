
import React, { useState, useEffect } from 'react';
import CountrySelect from './CountrySelect';
import { useGlobalUserState } from '../hooks/useGlobalUserState';
import { UserAddress, UserPhone } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ModalBody, ModalCloseButton, ModalFooter, ModalHeader, ModalShell, ModalTitle } from './ui/modal-shell';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

interface EditProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
  initialTab?: string;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isVisible, onClose, initialTab = 'personal' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const {
      fullName, setFullName,
      nickname, setNickname,
      email, setEmail,
      emailVerified, setEmailVerified,
      taxId, setTaxId,
      phone, setPhone,
      phoneVerified, setPhoneVerified,
      address, setAddress
  } = useGlobalUserState();

  const [localFullName, setLocalFullName] = useState(fullName);
  const [localNickname, setLocalNickname] = useState(nickname);
  const [localEmail, setLocalEmail] = useState(email);
  const [localTaxId, setLocalTaxId] = useState(taxId);
  const [localPhone, setLocalPhone] = useState<UserPhone>(phone);
  const [localAddress, setLocalAddress] = useState<UserAddress>(address);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (!isVisible) {
      // Reset local state to global state when modal is closed without saving
      setLocalFullName(fullName);
      setLocalNickname(nickname);
      setLocalEmail(email);
      setLocalTaxId(taxId);
      setLocalPhone(phone);
      setLocalAddress(address);
    }
  }, [isVisible, fullName, nickname, email, taxId, phone, address]);

  const handleSave = () => {
    if (localEmail !== email && emailVerified) {
      setEmailVerified(false);
    }
    if ((localPhone.ddi !== phone.ddi || localPhone.number !== phone.number) && phoneVerified) {
      setPhoneVerified(false);
    }
    setFullName(localFullName);
    setNickname(localNickname);
    setEmail(localEmail);
    setTaxId(localTaxId);
    setPhone(localPhone);
    setAddress(localAddress);
    onClose();
  };
  
  if (!isVisible) return null;

  const tabs = [
    { key: 'personal', label: 'Dados Pessoais' },
    { key: 'address', label: 'Endereço' },
  ] as const;
  
  const renderPersonalForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Nome Completo</label>
        <Input type="text" value={localFullName} onChange={e => setLocalFullName(e.target.value)} className="h-auto rounded-2xl border-gray-100 bg-gray-50 p-4 font-bold text-gray-900 shadow-none" />
      </div>
       <div>
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Apelido no Fã Clube</label>
        <Input type="text" value={localNickname} onChange={e => setLocalNickname(e.target.value)} className="h-auto rounded-2xl border-gray-100 bg-gray-50 p-4 font-bold text-gray-900 shadow-none" />
      </div>
      <div>
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">E-mail de Login</label>
        <Input type="email" value={localEmail} onChange={e => setLocalEmail(e.target.value)} className="h-auto rounded-2xl border-gray-100 bg-gray-50 p-4 font-bold text-gray-900 shadow-none" />
      </div>
       <div>
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Documento fiscal (opcional)</label>
        <Input type="text" value={localTaxId} onChange={e => setLocalTaxId(e.target.value)} className="h-auto rounded-2xl border-gray-100 bg-gray-50 p-4 font-bold text-gray-900 shadow-none" />
      </div>
      <div className="flex items-start space-x-2">
          <CountrySelect selectedDDI={localPhone.ddi} onDDIChange={ddi => setLocalPhone({ ...localPhone, ddi })}/>
          <div className="flex-1">
               <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Telefone</label>
              <Input type="tel" value={localPhone.number} onChange={e => setLocalPhone({ ...localPhone, number: e.target.value })} className="h-auto rounded-2xl border-gray-100 bg-gray-50 p-4 font-bold text-gray-900 shadow-none" />
          </div>
      </div>
    </div>
  );
  
  const renderAddressForm = () => (
    <div className="space-y-4">
        <div className="relative">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Código postal</label>
            <Input type="text" value={localAddress.cep} onChange={e => setLocalAddress({...localAddress, cep: e.target.value})} maxLength={9} className="h-auto rounded-2xl border-gray-100 bg-gray-50 p-4 font-bold text-gray-900 shadow-none" />
        </div>
         <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Rua</label>
                <Input type="text" value={localAddress.street} onChange={e => setLocalAddress({...localAddress, street: e.target.value})} className="h-auto rounded-2xl border-gray-100 bg-gray-50 p-4 font-bold text-gray-900 shadow-none" />
            </div>
            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Nº</label>
                <Input type="text" value={localAddress.number} onChange={e => setLocalAddress({...localAddress, number: e.target.value})} className="h-auto rounded-2xl border-gray-100 bg-gray-50 p-4 font-bold text-gray-900 shadow-none" />
            </div>
        </div>
        <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Complemento</label>
            <Input type="text" value={localAddress.complement} onChange={e => setLocalAddress({...localAddress, complement: e.target.value})} className="h-auto rounded-2xl border-gray-100 bg-gray-50 p-4 font-bold text-gray-900 shadow-none" />
        </div>
         <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Bairro / Distrito</label>
                <Input type="text" value={localAddress.neighborhood} onChange={e => setLocalAddress({...localAddress, neighborhood: e.target.value})} className="h-auto rounded-2xl border-gray-100 bg-gray-50 p-4 font-bold text-gray-900 shadow-none" />
            </div>
            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Cidade</label>
                <Input type="text" value={localAddress.city} onChange={e => setLocalAddress({...localAddress, city: e.target.value})} className="h-auto rounded-2xl border-gray-100 bg-gray-50 p-4 font-bold text-gray-900 shadow-none" />
            </div>
        </div>
        <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Estado / Região</label>
            <Input type="text" value={localAddress.state} onChange={e => setLocalAddress({...localAddress, state: e.target.value})} className="h-auto rounded-2xl border-gray-100 bg-gray-50 p-4 font-bold text-gray-900 shadow-none" />
        </div>
    </div>
  );

  return (
    <ModalShell open={isVisible} onClose={onClose} variant="sheet">
      <ModalHeader>
        <ModalTitle>Editar Perfil</ModalTitle>
        <ModalCloseButton onClick={onClose} />
      </ModalHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-0">
          <div className="border-b border-gray-100 px-6 py-4">
            <TabsList className="h-auto w-full rounded-2xl bg-gray-50 p-1">
              {tabs.map(tab => (
                <TabsTrigger
                  key={tab.key}
                  value={tab.key}
                  className="rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-rose-500 data-[state=active]:shadow-sm"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <ModalBody className="max-h-[50vh] overflow-y-auto">
            {activeTab === 'personal' && renderPersonalForm()}
            {activeTab === 'address' && renderAddressForm()}
          </ModalBody>
        </Tabs>

        <ModalFooter className="pb-10">
          <Button
            onClick={handleSave}
            className="w-full rounded-2xl py-6 text-sm font-black"
          >
            Salvar Alterações
          </Button>
        </ModalFooter>
    </ModalShell>
  );
};

export default EditProfileModal;
