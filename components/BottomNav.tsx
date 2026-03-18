
import React from 'react';
import { Section } from '../types';
import Icon from './Icon';

interface BottomNavProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
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
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-1/5 pt-3 pb-2 transition-colors ${isActive ? activeClasses : inactiveClasses}`}>
      <Icon name={iconName} className={`w-6 h-6 mb-1 transition-transform ${isActive ? 'scale-110' : ''}`} />
      <span className="text-[10px] font-bold tracking-tight leading-tight">{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeSection, onSectionChange }) => {
  return (
    <nav className="relative bg-white/95 backdrop-blur-md border-t border-gray-100 flex justify-around z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe pointer-events-auto">
      <NavItem 
        label="Feed" 
        iconName="timeline" 
        isActive={activeSection === Section.TIMELINE}
        onClick={() => onSectionChange(Section.TIMELINE)}
      />
      <NavItem 
        label="Mídia" 
        iconName="media" 
        isActive={activeSection === Section.MEDIA}
        onClick={() => onSectionChange(Section.MEDIA)}
      />
      <NavItem 
        label="Fã" 
        iconName="users" 
        isActive={activeSection === Section.FAN_AREA}
        onClick={() => onSectionChange(Section.FAN_AREA)}
      />
      <NavItem 
        label="Loja" 
        iconName="store" 
        isActive={activeSection === Section.STORE}
        onClick={() => onSectionChange(Section.STORE)}
      />
      <NavItem 
        label="Perfil" 
        iconName="profile" 
        isActive={activeSection === Section.PROFILE}
        onClick={() => onSectionChange(Section.PROFILE)}
      />
    </nav>
  );
};

export default BottomNav;
