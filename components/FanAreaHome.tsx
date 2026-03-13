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
  <div className="bg-gray-800/50 p-4 rounded-lg text-center">
    <p className="text-2xl font-bold text-orange-400">{value}</p>
    <p className="text-sm text-gray-400">{label}</p>
  </div>
));

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
        className="bg-gray-800 p-4 rounded-2xl border border-gray-700 hover:border-magenta-500 hover:bg-gray-800/80 transition-all duration-300 text-left flex flex-col group h-full"
    >
        <div className="flex-grow flex flex-col">
            <div className="flex justify-between items-start">
                <div className="bg-gray-700/50 p-2 rounded-lg mb-3 group-hover:bg-magenta-500/20 transition-colors">
                    <Icon name={icon} className="w-6 h-6 text-orange-400" />
                </div>
                {tag && (
                    <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full">{tag}</span>
                )}
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
            <p className="text-gray-400 text-xs leading-snug flex-grow">{description}</p>
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
            <h2 className="text-3xl font-black text-white">Área do Fã</h2>
            <p className="text-gray-400">Conecte-se com outros fãs e participe da comunidade de {artist.name}.</p>
        </header>

        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Minhas Estatísticas</h3>
                <button onClick={onOpenPointsInfoModal} className="text-gray-400 hover:text-white transition-colors" aria-label="Saiba mais sobre Fan Points">
                    <Icon name="question-mark-circle" className="w-6 h-6" />
                </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
            <StatCard value={fanPoints.toLocaleString('pt-BR')} label="Fan Points" />
            <StatCard value={currentLevel.name} label="Nível de Fã" />
            </div>
            {currentLevel.nextLevelPoints && (
            <div className="mt-6">
                <h4 className="text-md font-semibold mb-2">Próximo Nível: {getFanLevel(currentLevel.nextLevelPoints).name}</h4>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className={`bg-gradient-to-r ${currentLevel.color} h-2.5 rounded-full transition-all duration-500`} style={{width: `${progressPercentage}%`}}></div>
                </div>
                <p className="text-right text-xs text-gray-400 mt-1">Faltam {pointsToNextLevel.toLocaleString('pt-BR')} pts</p>
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