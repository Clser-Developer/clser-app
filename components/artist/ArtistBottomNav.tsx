
import React from 'react';
import { ArtistSection } from '../../types';
import Icon from '../Icon';

interface ArtistBottomNavProps {
  activeSection: ArtistSection;
  onSectionChange: (section: ArtistSection) => void;
}

const NavItem: React.FC<{
  label: string;
  iconName: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, iconName, isActive, onClick }) => {
  const activeClasses = 'text-rose-600';
  const inactiveClasses = 'text-gray-400 hover:text-gray-600';
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-1/5 pt-2 pb-1 transition-colors ${isActive ? activeClasses : inactiveClasses}`}>
      <Icon name={iconName} className={`w-6 h-6 mb-1 transition-transform ${isActive ? 'scale-110' : ''}`} />
      <span className="text-[10px] font-bold tracking-tight leading-tight">{label}</span>
    </button>
  );
};

const ArtistBottomNav: React.FC<ArtistBottomNavProps> = ({ activeSection, onSectionChange }) => {
  return (
    <nav className="safe-bottom-pad fixed inset-x-0 bottom-0 h-16 bg-white/95 backdrop-blur-md border-t border-gray-100 flex justify-around z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] px-2">
      <NavItem 
        label="Visão Geral" 
        iconName="dashboard" 
        isActive={activeSection === ArtistSection.DASHBOARD}
        onClick={() => onSectionChange(ArtistSection.DASHBOARD)}
      />
      <NavItem 
        label="Estúdio" 
        iconName="microphone" 
        isActive={activeSection === ArtistSection.STUDIO}
        onClick={() => onSectionChange(ArtistSection.STUDIO)}
      />
      <NavItem 
        label="Comunidade" 
        iconName="users" 
        isActive={activeSection === ArtistSection.COMMUNITY}
        onClick={() => onSectionChange(ArtistSection.COMMUNITY)}
      />
      <NavItem 
        label="Vendas" 
        iconName="currency-dollar" 
        isActive={activeSection === ArtistSection.SALES}
        onClick={() => onSectionChange(ArtistSection.SALES)}
      />
      <NavItem 
        label="Menu" 
        iconName="menu" 
        isActive={activeSection === ArtistSection.MENU}
        onClick={() => onSectionChange(ArtistSection.MENU)}
      />
    </nav>
  );
};

export default ArtistBottomNav;
