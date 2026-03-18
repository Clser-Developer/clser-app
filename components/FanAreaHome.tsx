
import React from 'react';
import { Artist, FanAreaSection } from '../types';
import Icon from './Icon';
import { getFanLevel, calculateLevelProgress } from '../services/gamificationService';

interface FanAreaHomeProps {
  artist: Artist;
  fanPoints: number;
  onNavigate: (section: FanAreaSection) => void;
  onOpenPointsInfoModal: () => void;
}

const StatCard: React.FC<{ value: string; label: string }> = React.memo(({ value, label }) => (
  <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100 shadow-sm">
    <p className="text-2xl font-black text-rose-500">{value}</p>
    <p className="text-sm text-gray-500 font-medium">{label}</p>
  </div>
));

const ScopeNotice: React.FC<{ artistName: string }> = ({ artistName }) => (
  <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
    <div className="flex items-start space-x-3">
      <div className="bg-rose-50 p-3 rounded-2xl text-rose-500">
        <Icon name="users" className="w-6 h-6" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">Escopo deste artista</p>
        <h3 className="text-lg font-bold text-gray-900 mt-1">Seu perfil de fa em {artistName}</h3>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">Fanpoints, ranking, grupos e recompensas desta area valem apenas para {artistName}. Pagamentos e compras da conta continuam centralizados no Perfil.</p>
      </div>
    </div>
  </div>
);

interface CategoryCardProps {
  icon: string;
  title: string;
  description: string;
  section: FanAreaSection;
  tag?: string;
  onNavigate: (section: FanAreaSection) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ icon, title, description, section, tag, onNavigate }) => (
    <button
        onClick={() => onNavigate(section)}
        className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-rose-100 transition-all duration-300 text-left flex flex-col group h-full"
    >
        <div className="flex-grow flex flex-col">
            <div className="flex justify-between items-start">
                <div className="bg-rose-50 p-3 rounded-2xl mb-4 group-hover:bg-rose-100 transition-colors">
                    <Icon name={icon} className="w-6 h-6 text-rose-500" />
                </div>
                {tag && (
                    <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">{tag}</span>
                )}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
            <p className="text-gray-500 text-xs leading-snug flex-grow">{description}</p>
        </div>
    </button>
);

const FanAreaHome: React.FC<FanAreaHomeProps> = ({ artist, fanPoints, onNavigate, onOpenPointsInfoModal }) => {
  const currentLevel = getFanLevel(fanPoints);
  const { progressPercentage, pointsToNextLevel } = calculateLevelProgress(fanPoints);

  const categories = [
    { icon: 'camera', title: 'Mural', description: 'Poste suas fotos e vídeos com o artista.', section: FanAreaSection.MURAL, tag: 'Novo' },
    { icon: 'raffle', title: 'Recompensas', description: 'Concorra a prêmios e ofertas exclusivas.', section: FanAreaSection.REWARDS },
    { icon: 'chart-bar', title: 'Ranking de Fãs', description: 'Veja sua posição e suba no placar de pontos.', section: FanAreaSection.LEADERBOARD },
    { icon: 'user-group', title: 'Grupos de Fãs', description: 'Crie ou entre em grupos por cidade ou interesse.', section: FanAreaSection.GROUPS },
    { icon: 'chart-bar', title: 'Enquetes', description: 'Vote e crie enquetes sobre o universo do artista.', section: FanAreaSection.POLLS },
    { icon: 'palette', title: 'Galeria de Arte', description: 'Envie e veja as artes criadas pela comunidade.', section: FanAreaSection.FAN_ART },
  ];

  return (
    <div className="p-4 animate-fade-in space-y-6">
        <header>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mb-2">Area do Fa</p>
            <h2 className="text-3xl font-black text-gray-900">Universo de {artist.name}</h2>
            <p className="text-gray-500">Tudo aqui representa sua relacao com este artista.</p>
        </header>

        <ScopeNotice artistName={artist.name} />

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Minha Jornada com {artist.name}</h3>
                <button onClick={onOpenPointsInfoModal} className="text-gray-400 hover:text-rose-500 transition-colors" aria-label="Saiba mais sobre Fan Points">
                    <Icon name="question-mark-circle" className="w-6 h-6" />
                </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
            <StatCard value={fanPoints.toLocaleString('pt-BR')} label={`Fan Points em ${artist.name}`} />
            <StatCard value={currentLevel.name} label="Nivel neste artista" />
            </div>
            {currentLevel.nextLevelPoints && (
            <div className="mt-6">
                <h4 className="text-sm font-semibold mb-2 text-gray-600">Proximo Nivel em {artist.name}: {getFanLevel(currentLevel.nextLevelPoints).name}</h4>
                <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className={`bg-gradient-to-r ${currentLevel.color} h-3 rounded-full transition-all duration-500`} style={{width: `${progressPercentage}%`}}></div>
                </div>
                <p className="text-right text-xs text-gray-400 mt-2">Faltam {pointsToNextLevel.toLocaleString('pt-BR')} pts</p>
            </div>
            )}
        </div>

        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                {categories.map(cat => (
                    <CategoryCard
                        key={cat.section}
                        icon={cat.icon}
                        title={cat.title}
                        description={cat.description}
                        section={cat.section}
                        tag={cat.tag}
                        onNavigate={onNavigate}
                    />
                ))}
            </div>
        </div>
    </div>
  );
};

export default FanAreaHome;
