import React, { useState, useRef, ChangeEvent } from 'react';
import { Artist, PlanType, Plan, Section, FanAreaSection } from '../types';
import Icon from './Icon';
import PlanCard from './PlanCard';
import EditProfileModal from './EditProfileModal';
import { useGlobalUserState } from '../hooks/useGlobalUserState';

interface ProfileViewProps {
  artist: Artist;
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

const ProfileSummary: React.FC<{
  nickname: string;
  profileImageUrl: string;
  fanPoints: number; // artist-specific
  onProfileImageChange: (imageDataUrl: string) => void;
  onNavigateToFanArea: () => void;
  onViewImage: () => void;
  onEditProfile: () => void;
}> = ({ nickname, profileImageUrl, fanPoints, onProfileImageChange, onNavigateToFanArea, onViewImage, onEditProfile }) => {
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
                <span className="font-bold text-rose-600 text-sm">{fanPoints.toLocaleString('pt-BR')} Fan Points</span>
                <Icon name="chevron-right" className="w-3 h-3 text-rose-400" />
            </button>
        </div>
    );
};


const ProfileView: React.FC<ProfileViewProps> = ({ 
    artist, onNavigateToFanArea, onOpenPaymentHistory, onLogout, onViewImage,
    userNickname, userProfileImageUrl, onProfileImageChange, onEditAddress, onEditPaymentMethod
}) => {
  
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editModalInitialTab, setEditModalInitialTab] = useState('personal');
  const { hasCard } = useGlobalUserState();
  
  const handleUnimplemented = () => alert("Funcionalidade em desenvolvimento.");
  
  const openEditModal = (tab: string) => {
    setEditModalInitialTab(tab);
    setIsEditModalVisible(true);
  };

  const fanPoints = artist.fanPoints || 0;

  return (
    <>
    <div className="pb-6">
      <ProfileSummary 
          nickname={userNickname}
          profileImageUrl={userProfileImageUrl}
          fanPoints={fanPoints}
          onProfileImageChange={onProfileImageChange}
          onNavigateToFanArea={onNavigateToFanArea}
          onViewImage={() => onViewImage(userProfileImageUrl)}
          onEditProfile={() => openEditModal('personal')}
      />
      
      <div className="px-4 space-y-6">
        
        {/* Card Status Section */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Status no Clube</h3>
            
            {hasCard ? (
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-5 rounded-2xl shadow-lg relative overflow-hidden text-white">
                    <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-white/10 blur-2xl rounded-full"></div>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-white/60 mb-1">Assinatura Ativa</p>
                            <p className="text-lg font-black italic tracking-wide">Membro Oficial</p>
                        </div>
                        <div className="flex space-x-1">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                        <p className="text-xs text-white/60">Mastercard **** 1234</p>
                        <button onClick={handleUnimplemented} className="text-xs font-bold text-white hover:text-rose-200 transition-colors">Gerenciar</button>
                    </div>
                </div>
            ) : (
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-lg font-bold text-gray-900">Fã Gratuito</p>
                        <p className="text-xs text-gray-500 mt-1">Faça o upgrade para benefícios.</p>
                    </div>
                    <button className="bg-rose-500 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-rose-600 transition-colors">
                        Virar Membro
                    </button>
                </div>
            )}
        </div>

        {/* Settings List */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-4 pb-2">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Minha Conta</h3>
             </div>
             <SettingsItem icon="profile" title="Dados Pessoais" subtitle="Nome, apelido e dados demográficos" onClick={() => openEditModal('personal')} />
             <SettingsItem icon="truck" title="Endereço de Entrega" subtitle="Rua dos Fãs, 123..." onClick={onEditAddress} />
             <SettingsItem icon="credit-card" title="Métodos de Pagamento" subtitle="Mastercard **** 1234" onClick={onEditPaymentMethod} />
             <SettingsItem icon="document-text" title="Histórico Financeiro" subtitle="Ver todas as faturas e cobranças" onClick={onOpenPaymentHistory} />
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
    </>
  );
};

export default ProfileView;