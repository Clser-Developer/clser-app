
import React from 'react';
import { ExperienceItem } from '../types';
import Icon from './Icon';

interface ExperienceCardProps {
  experience: ExperienceItem;
  onViewDetails: (experience: ExperienceItem) => void;
}

const ParticipantCounter: React.FC<{ joined: number; limit: number }> = ({ joined, limit }) => {
    const slotsLeft = limit - joined;
    const isSoldOut = slotsLeft <= 0;

    return (
        <div className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase shadow-lg backdrop-blur-md ${isSoldOut ? 'bg-red-500 text-white' : 'bg-white/90 text-rose-600'}`}>
            {isSoldOut ? 'Esgotado' : `${slotsLeft} Vagas`}
        </div>
    );
};

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience, onViewDetails }) => {
  return (
    <button 
      onClick={() => onViewDetails(experience)}
      className="bg-white rounded-3xl overflow-hidden border border-gray-100 group flex flex-col text-left focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm hover:shadow-md transition-all h-full"
      aria-label={`Ver detalhes de ${experience.name}`}
    >
      <div className="relative aspect-video">
          <img 
            src={experience.imageUrl} 
            alt={experience.name} 
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-300" 
          />
        <div className="absolute top-3 right-3">
            <ParticipantCounter joined={experience.participantsJoined} limit={experience.participantLimit} />
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div>
            <div className="flex items-center space-x-2 mb-1">
                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{experience.format}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2">{experience.name}</h3>
            <p className="text-xs text-gray-500 mt-2 font-medium line-clamp-2">{experience.description}</p>
        </div>
        <div className="mt-auto pt-4 flex items-center justify-between">
            <p className="text-xl font-black text-gray-900">R$ {experience.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <div className="bg-rose-50 p-2 rounded-full text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                <Icon name="chevron-right" className="w-5 h-5" />
            </div>
        </div>
      </div>
    </button>
  );
};

export default React.memo(ExperienceCard);
