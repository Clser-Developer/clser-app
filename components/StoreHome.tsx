
import React from 'react';
import { Artist, PlanType, StoreSection } from '../types';
import Icon from './Icon';

interface StoreHomeProps {
  artist: Artist;
  onNavigate: (section: StoreSection) => void;
}

interface CategoryCardProps {
  icon: string;
  title: string;
  description: string;
  section: StoreSection;
  tag?: string;
  onNavigate: (section: StoreSection) => void;
}

const StoreCategoryCard: React.FC<CategoryCardProps> = ({ icon, title, description, section, tag, onNavigate }) => (
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
                    <span className="bg-green-500/20 text-green-300 text-[10px] font-bold px-2 py-0.5 rounded-full">{tag}</span>
                )}
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
            <p className="text-gray-400 text-xs leading-snug flex-grow">{description}</p>
        </div>
    </button>
);

const MyPurchasesCard: React.FC<{ onNavigate: (section: StoreSection) => void }> = ({ onNavigate }) => (
    <button
        onClick={() => onNavigate(StoreSection.MY_PURCHASES)}
        className="w-full bg-gradient-to-r from-gray-800 to-gray-800/80 p-4 rounded-2xl border border-gray-700 hover:border-orange-500 transition-all duration-300 text-left flex items-center space-x-4 group"
    >
        <div className="bg-gray-700/50 p-3 rounded-lg group-hover:bg-orange-500/20 transition-colors">
            <Icon name="box" className="w-8 h-8 text-orange-400" />
        </div>
        <div>
            <h3 className="text-xl font-bold text-white">Minhas Compras</h3>
            <p className="text-gray-400 text-sm">Acompanhe seus pedidos e histórico</p>
        </div>
    </button>
);

const StoreHome: React.FC<StoreHomeProps> = ({ artist, onNavigate }) => {
  const fullAccessPlan = artist.plans.find(p => p.type === PlanType.FULL_ACCESS);
  const isPpvIncluded = fullAccessPlan?.includesPPV ?? false;

  const categories = [
    { icon: 'merch', title: 'Merch', description: 'Itens exclusivos da turnê e coleções.', section: StoreSection.MERCH },
    { icon: 'tickets', title: 'Ingressos', description: 'Acesso aos próximos shows e eventos.', section: StoreSection.TICKETS },
    { icon: 'auctions', title: 'Leilões', description: 'Peças únicas e itens de colecionador.', section: StoreSection.AUCTIONS },
    { icon: 'crowdfunding', title: 'Crowdfunding', description: 'Apoie projetos e ganhe recompensas.', section: StoreSection.CROWDFUNDING },
    { icon: 'experiences', title: 'Experiências', description: 'Meet & Greet, bastidores e mais.', section: StoreSection.EXPERIENCES },
    { icon: 'ppv', title: 'PPV', description: 'Assista a lives e eventos exclusivos.', section: StoreSection.PPV, tag: isPpvIncluded ? 'Incluso' : undefined },
  ];

  return (
    <div className="p-4 animate-fade-in">
        <header className="mb-6">
            <h2 className="text-3xl font-black text-white">Loja</h2>
            <p className="text-gray-400">Explore tudo que o universo de {artist.name} oferece.</p>
        </header>

        <div className="space-y-4">
            <MyPurchasesCard onNavigate={onNavigate} />
            <div className="grid grid-cols-2 gap-4">
                {categories.map(cat => (
                    <StoreCategoryCard
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

export default StoreHome;