
import React, { useState } from 'react';
import { Artist } from '../../../types';
import Icon from '../../Icon';
import EditArtistProfileModal from '../EditArtistProfileModal';
import PayoutSettingsModal from '../PayoutSettingsModal';

interface MenuViewProps {
  artist: Artist;
  onLogout: () => void;
  onUpdateArtist: (updates: Partial<Artist>) => void;
}

const MenuButton: React.FC<{ icon: string; label: string; subLabel?: string; onClick: () => void; color?: string }> = ({ icon, label, subLabel, onClick, color = "text-gray-500" }) => (
    <button 
        onClick={onClick}
        className="w-full bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-rose-200 hover:shadow-md transition-all active:scale-[0.99]"
    >
        <div className="flex items-center space-x-4">
            <div className={`p-2.5 rounded-xl bg-gray-50 group-hover:bg-rose-50 transition-colors ${color}`}>
                <Icon name={icon} className="w-6 h-6" />
            </div>
            <div className="text-left">
                <p className="font-bold text-gray-900 text-base">{label}</p>
                {subLabel && <p className="text-xs text-gray-500 mt-0.5">{subLabel}</p>}
            </div>
        </div>
        <Icon name="chevron-right" className="w-5 h-5 text-gray-300 group-hover:text-rose-400 transition-colors" />
    </button>
);

const MenuView: React.FC<MenuViewProps> = ({ artist, onLogout, onUpdateArtist }) => {
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [isPayoutModalVisible, setIsPayoutModalVisible] = useState(false);

  return (
    <div className="p-4 pb-24 animate-fade-in space-y-6">
      <header className="mb-6">
        <h2 className="text-3xl font-black text-gray-900">Menu</h2>
        <p className="text-gray-500">Configurações da sua conta e perfil.</p>
      </header>

      {/* Profile Card */}
      <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-400 to-purple-500"></div>
        <img 
            src={artist.profileImageUrl} 
            alt={artist.name} 
            className="w-24 h-24 rounded-full border-4 border-white shadow-lg mb-4 object-cover"
        />
        <h3 className="text-2xl font-black text-gray-900">{artist.name}</h3>
        <p className="text-rose-500 font-bold text-sm">{artist.genre}</p>
        <div className="flex items-center gap-2 mt-4">
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200 flex items-center">
                <Icon name="check-circle" className="w-3 h-3 mr-1" />
                CONTA VERIFICADA
            </span>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-bold text-gray-400 uppercase ml-2 mb-2 tracking-wider">Geral</h4>
        <MenuButton 
            icon="profile" 
            label="Editar Perfil" 
            subLabel="Bio, fotos e informações básicas" 
            onClick={() => setIsProfileModalVisible(true)} 
            color="text-blue-500"
        />
        <MenuButton 
            icon="currency-dollar" 
            label="Financeiro" 
            subLabel="Saques e dados bancários" 
            onClick={() => setIsPayoutModalVisible(true)} 
            color="text-green-500"
        />
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-bold text-gray-400 uppercase ml-2 mb-2 tracking-wider">Conta</h4>
        <MenuButton 
            icon="question-mark-circle" 
            label="Ajuda e Suporte" 
            onClick={() => alert('Em breve')} 
        />
        <button 
            onClick={onLogout}
            className="w-full bg-white p-4 rounded-2xl border border-red-100 flex items-center justify-center space-x-2 text-red-500 font-bold hover:bg-red-50 transition-colors shadow-sm"
        >
            <Icon name="logout" className="w-5 h-5" />
            <span>Sair da Conta</span>
        </button>
      </div>

      <EditArtistProfileModal 
        isVisible={isProfileModalVisible}
        onClose={() => setIsProfileModalVisible(false)}
        artist={artist}
        onSave={onUpdateArtist}
      />

      <PayoutSettingsModal
        isVisible={isPayoutModalVisible}
        onClose={() => setIsPayoutModalVisible(false)}
      />
    </div>
  );
};

export default MenuView;
