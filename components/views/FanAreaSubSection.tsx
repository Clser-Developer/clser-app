import React from 'react';
import Icon from '../Icon';

interface FanAreaSubSectionProps {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
  action?: React.ReactNode;
}

const FanAreaSubSection: React.FC<FanAreaSubSectionProps> = ({ title, onBack, children, action }) => (
  <section className="animate-fade-in p-4 safe-bottom-pad">
    <header className="mb-6 flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-center">
        <button
          onClick={onBack}
          className="mr-2 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100"
          aria-label="Voltar para a Área do Fã"
        >
          <Icon name="arrowLeft" className="h-6 w-6" />
        </button>
        <h2 className="truncate text-2xl font-black text-gray-900">{title}</h2>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
    {children}
  </section>
);

export default FanAreaSubSection;
