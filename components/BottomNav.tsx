
import React from 'react';
import { Section } from '../types';
import Icon from './Icon';
import { Button } from '@/components/ui/button';

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
    <Button onClick={onClick} variant="ghost" className={`flex flex-col items-center justify-center w-1/5 pt-2 pb-1 h-auto ${isActive ? 'text-magenta-400' : 'text-gray-400 hover:text-white'}`}>
      <Icon name={iconName} className="w-6 h-6 mb-1" />
      <span className="text-[10px] font-bold tracking-tighter leading-tight">{label}</span>
    </Button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeSection, onSectionChange }) => {
  return (
    <nav className="sticky bottom-0 left-0 right-0 h-16 bg-gray-900/90 backdrop-blur-sm border-t border-gray-700 flex justify-around z-20">
      <NavItem 
        label="Novidades" 
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
        label="Área do Fã" 
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
