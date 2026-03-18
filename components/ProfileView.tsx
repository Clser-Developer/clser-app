import React, { useState, useRef, ChangeEvent } from 'react';
import { Artist, PlanType, Plan, Section, FanAreaSection } from '../types';
import Icon from './Icon';
import PlanCard from './PlanCard';
import EditProfileModal from './EditProfileModal';
import { useBilling } from '../contexts/BillingContext';
import { useGlobalUserState } from '../hooks/useGlobalUserState';
import ContactVerificationModal from './ContactVerificationModal';

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
  <button onClick={onClick} className="w-full flex items-center text-left p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-4 text-gray-500">
      <Icon name={icon} className="w-5 h-5" />
    </div>
    <div className="flex-1">
      <p className="font-semibold text-gray-900 text-sm">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
    <Icon name="chevron-right" className="w-5 h-5 text-gray-300" />
  </button>
);

const SummaryStat: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100 shadow-sm">
    <p className="text-xl font-black text-gray-900">{value}</p>
    <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400 mt-1">{label}</p>
  </div>
);

const VerificationPill: React.FC<{ label: string; verified: boolean; onClick?: () => void }> = ({ label, verified, onClick }) => {
  const className = `inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-bold ${verified ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`;

  if (!onClick) {
    return (
      <div className={className}>
        <div className={`w-2 h-2 rounded-full ${verified ? 'bg-green-500' : 'bg-amber-500'}`}></div>
        <span>{label}</span>
      </div>
    );
  }

  return (
    <button onClick={onClick} className={`${className} hover:brightness-95 transition-all`}>
      <div className={`w-2 h-2 rounded-full ${verified ? 'bg-green-500' : 'bg-amber-500'}`}></div>
      <span>{label}</span>
    </button>
  );
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
        <div className="flex flex-col items-center text-center p-6 bg-white rounded-3xl shadow-sm border border-gray-100 mb-6 mx-4 mt-4">
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
                className="mt-3 flex items-center space-x-2 bg-rose-50 px-4 py-1.5 rounded-full"
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
      
      <div className="px-4 space-y-6">
        
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Conta Principal</h3>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
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
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-4 pb-2">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Conta</h3>
             </div>
             <SettingsItem icon="profile" title="Dados da Conta" subtitle="Nome, apelido, perfil e dados cadastrais" onClick={() => openEditModal('personal')} />
             <SettingsItem icon="truck" title="Endereço Principal" subtitle="Dados usados para compras e entregas da sua conta" onClick={onEditAddress} />
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
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
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-4 pb-2">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Financeiro</h3>
             </div>
             <SettingsItem icon="credit-card" title="Métodos de Pagamento" subtitle={hasCard ? 'Seu meio de pagamento vale para compras em qualquer artista' : 'Cadastre um método para comprar em qualquer artista'} onClick={onEditPaymentMethod} />
             <SettingsItem icon="document-text" title="Histórico Financeiro" subtitle="Faturas, recibos e cobranças globais da conta" onClick={onOpenPaymentHistory} />
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-4 pb-2">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Sobre</h3>
             </div>
             <SettingsItem icon="document-text" title="Termos de Serviço" onClick={handleUnimplemented} />
             <SettingsItem icon="lock-closed" title="Política de Privacidade" onClick={handleUnimplemented} />
        </div>
        
        <button
            onClick={onLogout}
            className="w-full text-rose-500 font-bold py-3 px-4 rounded-xl hover:bg-rose-50 transition-colors flex items-center justify-center space-x-2"
        >
            <Icon name="logout" className="w-5 h-5" />
            <span>Sair da Conta</span>
        </button>

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
