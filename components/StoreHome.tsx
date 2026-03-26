import React from 'react';
import { Artist, PlanType, StoreSection } from '../types';
import Icon from './Icon';
import { Badge } from './ui/badge';

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
        className="group flex h-full flex-col rounded-[2rem] border border-gray-100 bg-white p-5 text-left shadow-[0_18px_40px_-34px_rgba(15,23,42,0.32)] transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-100 hover:shadow-[0_24px_48px_-30px_rgba(244,63,94,0.22)]"
    >
        <div className="flex-grow flex flex-col">
            <div className="flex justify-between items-start">
                <div className="mb-4 rounded-2xl bg-gray-50 p-3 transition-colors group-hover:bg-rose-50">
                    <Icon name={icon} className="w-6 h-6 text-gray-700 group-hover:text-rose-500 transition-colors" />
                </div>
                {tag && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-[10px] font-black">{tag}</Badge>
                )}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
            <p className="text-gray-500 text-xs leading-snug flex-grow">{description}</p>
        </div>
    </button>
);

const MyPurchasesCard: React.FC<{ onNavigate: (section: StoreSection) => void }> = ({ onNavigate }) => (
    <button
        onClick={() => onNavigate(StoreSection.MY_PURCHASES)}
        className="group flex w-full items-center space-x-4 rounded-[2rem] border border-gray-100 bg-[linear-gradient(135deg,#ffffff,#fff7ed)] p-5 text-left shadow-[0_22px_48px_-36px_rgba(249,115,22,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-100"
    >
        <div className="bg-orange-50 p-3 rounded-2xl group-hover:bg-orange-100 transition-colors">
            <Icon name="box" className="w-8 h-8 text-orange-500" />
        </div>
        <div>
            <h3 className="text-xl font-bold text-gray-900">Minhas Compras</h3>
            <p className="text-gray-500 text-sm">Acompanhe seus pedidos e histórico</p>
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
    { icon: 'crowdfunding', title: 'Vaquinha', description: 'Apoie projetos e ganhe recompensas.', section: StoreSection.CROWDFUNDING },
    { icon: 'experiences', title: 'Experiências', description: 'Meet & Greet, bastidores e mais.', section: StoreSection.EXPERIENCES },
    { icon: 'ppv', title: 'PPV', description: 'Assista a lives e eventos exclusivos.', section: StoreSection.PPV, tag: isPpvIncluded ? 'Incluso' : undefined },
  ];

  return (
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
  );
};

export default StoreHome;
