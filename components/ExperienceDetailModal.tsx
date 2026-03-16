
import React from 'react';
import { ExperienceItem } from '../types';
import Icon from './Icon';

interface ExperienceDetailModalProps {
  experience: ExperienceItem | null;
  onClose: () => void;
  onPurchase: (experience: ExperienceItem) => void;
}

const DetailItem: React.FC<{ icon: string, label: string, value: string }> = ({ icon, label, value }) => (
    <div className="flex items-start">
        <div className="bg-gray-100 p-2.5 rounded-xl text-gray-400 flex-shrink-0 mr-4">
            <Icon name={icon} className="w-5 h-5" />
        </div>
        <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
            <p className="text-gray-900 font-bold text-sm leading-tight">{value}</p>
        </div>
    </div>
);

const ExperienceDetailModal: React.FC<ExperienceDetailModalProps> = ({ experience, onClose, onPurchase }) => {
  if (!experience) return null;

  const slotsLeft = experience.participantLimit - experience.participantsJoined;
  const isSoldOut = slotsLeft <= 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-end justify-center" aria-modal="true" role="dialog" onClick={onClose}>
      <div className="bg-white rounded-t-[2.5rem] w-full max-w-lg shadow-2xl border-t border-gray-100 animate-slide-up flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <header className="p-4 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
            <h2 className="text-lg font-bold text-gray-900 truncate ml-4">{experience.name}</h2>
            <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100">
                <Icon name="close" className="w-6 h-6" />
            </button>
        </header>
        <main className="overflow-y-auto no-scrollbar p-6 space-y-8">
            <div className="aspect-video rounded-3xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm">
                <img src={experience.imageUrl} alt={experience.name} className="w-full h-full object-cover" />
            </div>
            
            <div>
                <h1 className="text-2xl font-black text-gray-900 leading-tight">{experience.name}</h1>
                <p className="text-gray-500 text-sm mt-3 leading-relaxed font-medium">{experience.longDescription || experience.description}</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-5 shadow-inner">
                <DetailItem icon="users" label="Vagas" value={`${slotsLeft} de ${experience.participantLimit} disponíveis`} />
                <DetailItem icon="tickets" label="Data e Hora" value={`${experience.eventDate} às ${experience.eventTime}`} />
                <DetailItem icon="store" label="Formato" value={experience.format} />
                <DetailItem icon="timeline" label="Duração" value={experience.duration} />
            </div>

            <div>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Regras e Informações</h3>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-3">
                    {experience.rules.map((rule, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1.5 flex-shrink-0"></div>
                            <p className="text-gray-600 text-xs font-medium leading-relaxed">{rule}</p>
                        </div>
                    ))}
                </div>
            </div>
        </main>
        <footer className="p-6 bg-white border-t border-gray-100 flex-shrink-0 pb-24">
          <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-0.5">Valor Único</p>
                <p className="text-2xl font-black text-gray-900">R$ {experience.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <button 
                onClick={() => onPurchase(experience)} 
                disabled={isSoldOut}
                className="bg-gray-900 text-white font-black py-4 px-8 rounded-2xl hover:bg-black transition-all disabled:bg-gray-200 shadow-xl active:scale-95"
            >
                {isSoldOut ? 'Esgotado' : 'Garantir Vaga'}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ExperienceDetailModal;