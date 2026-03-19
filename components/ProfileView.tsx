import React, { useState, useRef, ChangeEvent } from 'react';
import { Artist, PlanType, Plan, Section, FanAreaSection } from '../types';
import Icon from './Icon';
import PlanCard from './PlanCard';
import EditProfileModal from './EditProfileModal';
import { useBilling } from '../contexts/BillingContext';
import { useGlobalUserState } from '../hooks/useGlobalUserState';
import ContactVerificationModal from './ContactVerificationModal';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface ProfileViewProps {
  artist: Artist;
  fanPoints: number;
  onNavigateToFanArea: () => void;
  onOpenPaymentHistory: () => void;
  onLogout: () => void;
  onViewImage: (url: string) => void;
  userNickname: string;
  userProfileImageUrl: string;
  onProfileImageChange: (dataUrl: string) => void;
  onEditAddress: () => void;
  onEditPaymentMethod: () => void;
}

const SettingsItem: React.FC<{ icon: string; title: string; subtitle?: string; onClick: () => void; }> = ({ icon, title, subtitle, onClick }) => (
  <button onClick={onClick} className="group w-full flex items-center text-left px-5 py-4 hover:bg-gray-50/80 transition-colors border-b border-gray-100 last:border-0">
    <div className="mr-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-50 text-gray-500 transition-colors group-hover:bg-rose-50 group-hover:text-rose-500">
      <Icon name={icon} className="w-5 h-5" />
    </div>
    <div className="flex-1">
      <p className="text-sm font-black text-gray-900">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
    <Icon name="chevron-right" className="w-5 h-5 text-gray-300 transition-transform group-hover:translate-x-0.5" />
  </button>
);

const sectionCardClassName = 'rounded-[2rem] border border-gray-100 bg-white shadow-[0_18px_42px_-34px_rgba(15,23,42,0.32)]';

const SummaryStat: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="rounded-[1.75rem] border border-gray-100 bg-[linear-gradient(180deg,#ffffff,#f8fafc)] p-4 text-center shadow-[0_12px_32px_-24px_rgba(15,23,42,0.45)]">
    <p className="text-xl font-black text-gray-950">{value}</p>
    <p className="mt-1 text-[11px] font-black uppercase tracking-[0.14em] text-gray-400">{label}</p>
  </div>
);

const VerificationPill: React.FC<{ label: string; verified: boolean; onClick?: () => void }> = ({ label, verified, onClick }) => {
  const badge = (
    <Badge
      variant="secondary"
      className={`cursor-default gap-2 rounded-full px-3 py-1.5 text-xs font-black ${
        verified ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${verified ? 'bg-green-500' : 'bg-amber-500'}`}></span>
      <span>{label}</span>
    </Badge>
  );

  if (!onClick) return badge;

  return <button onClick={onClick} className="transition-all hover:brightness-95">{badge}</button>;
};

const ProfileSummary: React.FC<{
  artistName: string;
  nickname: string;
  profileImageUrl: string;
  fanPoints: number; // artist-specific
  onProfileImageChange: (imageDataUrl: string) => void;
  onNavigateToFanArea: () => void;
  onViewImage: () => void;
  onEditProfile: () => void;
}> = ({ artistName, nickname, profileImageUrl, fanPoints, onProfileImageChange, onNavigateToFanArea, onViewImage, onEditProfile }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    onProfileImageChange(reader.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };
    
    return (
        <div className="mx-4 mt-4 mb-6 rounded-[2rem] border border-gray-100 bg-[linear-gradient(180deg,#ffffff,#fff8f8)] p-6 text-center shadow-[0_24px_60px_-40px_rgba(244,63,94,0.45)]">
            <div className="relative mb-4">
                <button onClick={onViewImage} className="block rounded-full focus:outline-none focus:ring-4 focus:ring-rose-100">
                    <img
                      src={profileImageUrl}
                      alt="User profile"
                      className="w-28 h-28 rounded-full border border-gray-200 object-cover"
                    />
                </button>
                 <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-rose-500 p-2 rounded-full text-white hover:bg-rose-600 border-4 border-white transition-colors shadow-sm"
                    aria-label="Alterar foto de perfil"
                >
                    <Icon name="pencil" className="w-4 h-4" />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
            </div>

            <div className="flex items-center space-x-2 group h-9 justify-center">
                <h1 className="text-2xl font-bold text-gray-900">{nickname}</h1>
                 <button onClick={onEditProfile} aria-label="Editar perfil" className="text-gray-400 hover:text-rose-500 transition-colors">
                    <Icon name="pencil" className="w-4 h-4" />
                </button>
            </div>

            <button 
                onClick={onNavigateToFanArea}
                className="mt-3 inline-flex items-center space-x-2 rounded-full border border-rose-100 bg-rose-50 px-4 py-2 shadow-sm"
            >
                <Icon name="users" className="w-4 h-4 text-rose-500" />
                <span className="font-bold text-rose-600 text-sm">{fanPoints.toLocaleString('pt-BR')} Fan Points com {artistName}</span>
                <Icon name="chevron-right" className="w-3 h-3 text-rose-400" />
            </button>
        </div>
    );
};


const ProfileView: React.FC<ProfileViewProps> = ({ 
    artist, fanPoints, onNavigateToFanArea, onOpenPaymentHistory, onLogout, onViewImage,
    userNickname, userProfileImageUrl, onProfileImageChange, onEditAddress, onEditPaymentMethod
}) => {
  
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editModalInitialTab, setEditModalInitialTab] = useState('personal');
  const [verificationTarget, setVerificationTarget] = useState<'email' | 'phone' | null>(null);
  const { hasCard, orders, paymentHistory, purchasedExperiences, purchasedTickets } = useBilling();
  const { email, emailVerified, internalUserId, phone, phoneVerified, setEmailVerified, setPhoneVerified } = useGlobalUserState();
  
  const handleUnimplemented = () => alert("Funcionalidade em desenvolvimento.");
  
  const openEditModal = (tab: string) => {
    setEditModalInitialTab(tab);
    setIsEditModalVisible(true);
  };
  return (
    <>
    <div className="pb-6">
      <ProfileSummary 
          artistName={artist.name}
          nickname={userNickname}
          profileImageUrl={userProfileImageUrl}
          fanPoints={fanPoints}
          onProfileImageChange={onProfileImageChange}
          onNavigateToFanArea={onNavigateToFanArea}
          onViewImage={() => onViewImage(userProfileImageUrl)}
          onEditProfile={() => openEditModal('personal')}
      />
      
      <div className="space-y-6 px-4">
        
        <Card className={`${sectionCardClassName} gap-0 p-5`}>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Conta Principal</h3>
            <div className="rounded-[1.75rem] border border-gray-100 bg-[linear-gradient(180deg,#ffffff,#f8fafc)] p-4">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">ID Interno</p>
                        <p className="text-sm font-black text-gray-900 font-mono break-all">{internalUserId}</p>
                        <p className="text-xs text-gray-500 mt-2">Esta conta vale para todos os artistas. Pagamentos, pedidos e ingressos ficam centralizados aqui.</p>
                    </div>
                    <div className="bg-white rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-gray-500 border border-gray-200 shrink-0">
                        Conta Global
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                    <VerificationPill label={emailVerified ? 'E-mail verificado' : 'Verificar e-mail'} verified={emailVerified} onClick={!emailVerified && email ? () => setVerificationTarget('email') : undefined} />
                    <VerificationPill label={phoneVerified ? 'Telefone verificado' : 'Verificar telefone'} verified={phoneVerified} onClick={!phoneVerified && phone.number ? () => setVerificationTarget('phone') : undefined} />
                </div>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="bg-white rounded-2xl border border-gray-200 p-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">E-mail vinculado</p>
                        <p className="text-sm font-bold text-gray-900 mt-2 break-all">{email || 'Nao informado'}</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-200 p-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Telefone vinculado</p>
                        <p className="text-sm font-bold text-gray-900 mt-2">{phone.ddi} {phone.number || 'Nao informado'}</p>
                    </div>
                </div>
            </div>
        </Card>

        <div className={`overflow-hidden ${sectionCardClassName}`}>
             <div className="p-4 pb-2">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Conta</h3>
             </div>
             <SettingsItem icon="profile" title="Dados da Conta" subtitle="Nome, apelido, perfil e dados cadastrais" onClick={() => openEditModal('personal')} />
             <SettingsItem icon="truck" title="Endereço Principal" subtitle="Dados usados para compras e entregas da sua conta" onClick={onEditAddress} />
        </div>

        <Card className={`${sectionCardClassName} gap-0 p-5`}>
            <div className="flex items-start justify-between gap-3 mb-5">
                <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Pagamento e Compras</h3>
                    <p className="text-xs text-gray-500 mt-2">Tudo abaixo pertence a sua conta, independentemente do artista que estiver ativo.</p>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wide ${hasCard ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {hasCard ? 'Pagamento ativo' : 'Sem pagamento salvo'}
                </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-5">
                <SummaryStat value={orders.length.toString()} label="Pedidos" />
                <SummaryStat value={purchasedTickets.length.toString()} label="Ingressos" />
                <SummaryStat value={purchasedExperiences.length.toString()} label="Experiências" />
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-gray-600">Recibos e cobranças emitidos</span>
                    <span className="font-black text-gray-900">{paymentHistory.length}</span>
                </div>
            </div>
        </Card>

        <div className={`overflow-hidden ${sectionCardClassName}`}>
             <div className="p-4 pb-2">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Financeiro</h3>
             </div>
             <SettingsItem icon="credit-card" title="Métodos de Pagamento" subtitle={hasCard ? 'Seu meio de pagamento vale para compras em qualquer artista' : 'Cadastre um método para comprar em qualquer artista'} onClick={onEditPaymentMethod} />
             <SettingsItem icon="document-text" title="Histórico Financeiro" subtitle="Faturas, recibos e cobranças globais da conta" onClick={onOpenPaymentHistory} />
        </div>

        <div className={`overflow-hidden ${sectionCardClassName}`}>
             <div className="p-4 pb-2">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Sobre</h3>
             </div>
             <SettingsItem icon="document-text" title="Termos de Serviço" onClick={handleUnimplemented} />
             <SettingsItem icon="lock-closed" title="Política de Privacidade" onClick={handleUnimplemented} />
        </div>
        
        <Button
            onClick={onLogout}
            variant="outline"
            className="h-14 w-full rounded-2xl border-rose-100 bg-white font-black text-rose-500 shadow-sm hover:bg-rose-50 hover:text-rose-600"
        >
            <Icon name="logout" className="w-5 h-5" />
            <span>Sair da Conta</span>
        </Button>

      </div>
    </div>
    <EditProfileModal
        isVisible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        initialTab={editModalInitialTab}
    />
    <ContactVerificationModal
        isVisible={verificationTarget === 'email'}
        type="email"
        value={email}
        onClose={() => setVerificationTarget(null)}
        onVerified={() => {
            setEmailVerified(true);
            setVerificationTarget(null);
        }}
    />
    <ContactVerificationModal
        isVisible={verificationTarget === 'phone'}
        type="phone"
        value={`${phone.ddi} ${phone.number}`.trim()}
        onClose={() => setVerificationTarget(null)}
        onVerified={() => {
            setPhoneVerified(true);
            setVerificationTarget(null);
        }}
    />
    </>
  );
};

export default ProfileView;
