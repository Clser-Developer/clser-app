
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
  return (
    <button
      onClick={onClick}
      className={`flex w-1/5 flex-col items-center justify-center rounded-2xl px-2 py-2 transition-all ${
        isActive
          ? 'bg-rose-50 text-rose-600 shadow-sm shadow-rose-200/50'
          : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'
      }`}
    >
      <Icon name={iconName} className={`mb-1 h-5 w-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
      <span className="text-[10px] font-black tracking-tight leading-tight">{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeSection, onSectionChange }) => {
  return (
    <nav className="pointer-events-auto relative z-50 w-full flex justify-around rounded-[2rem] border border-white/80 bg-white/92 p-2 shadow-[0_18px_40px_-22px_rgba(15,23,42,0.38)] backdrop-blur-xl">
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
