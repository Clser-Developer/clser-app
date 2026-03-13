
import React, { useState } from 'react';
import { Artist, Plan } from '../types';
import PlanCard from './PlanCard';
import Icon from './Icon';
import BenefitDetailModal, { Benefit } from './BenefitDetailModal';

// Data for benefits
const benefits: Benefit[] = [
    {
      title: 'Conteúdo exclusivo',
      shortDescription: 'Fotos, vídeos de bastidores, informações quentes e músicas inéditas.',
      imageUrl: 'https://i.ibb.co/sJpqGSyn/Whisk-3de5514976.jpg',
      fullDescription: 'Tenha acesso a um mundo de conteúdo que você não encontra em nenhum outro lugar. Veja fotos dos bastidores das turnês, assista a vídeos exclusivos do processo criativo, receba notícias em primeira mão e ouça trechos de músicas antes de todo mundo.'
    },
    {
      title: 'Lives imperdíveis',
      shortDescription: 'Sessões exclusivas ao vivo, pocket shows e conversas com fãs.',
      imageUrl: 'https://i.ibb.co/m514n3cC/Whisk-dfimtrkzwe.jpg',
      fullDescription: 'Participe de transmissões ao vivo exclusivas! Curta pocket shows acústicos no conforto da sua casa, participe de sessões de perguntas e respostas e sinta-se mais perto do que nunca do seu artista.'
    },
    {
      title: 'Comunidade de Fãs',
      shortDescription: 'Conecte-se com outros fãs e faça amizades, compartilhe experiências.',
      imageUrl: 'https://i.ibb.co/ymg9hzFs/Whisk-7006ff34eb.jpg',
      fullDescription: 'Faça parte de uma comunidade vibrante e apaixonada. Troque ideias, discuta sobre as músicas, combine de ir aos shows e faça amizades para a vida toda com pessoas que compartilham o mesmo amor que você.'
    },
    {
      title: 'Sorteios e loja oficial',
      shortDescription: 'Concorra a itens autografados, experiências, adquira produtos oficiais.',
      imageUrl: 'https://i.ibb.co/Q30ys2YJ/Whisk-508d19aea4.jpg',
      fullDescription: 'Tenha a chance de ganhar prêmios incríveis! Participe de sorteios de itens autografados, Meet & Greets virtuais e muito mais. Além disso, tenha acesso a produtos exclusivos na loja oficial do fã clube.'
    }
];

interface ArtistLandingPageProps {
  artist: Artist;
  onBack: () => void;
  onSubscribe: (artist: Artist, plan: Plan) => void;
  onViewImage: (url: string) => void;
}

const ArtistLandingPage: React.FC<ArtistLandingPageProps> = ({ artist, onBack, onSubscribe, onViewImage }) => {
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);

  const handleSubscribeFromModal = () => {
    const plansSection = document.getElementById('plans');
    plansSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-gray-900 text-white">
      <header className="relative h-64">
        <img src={artist.coverImageUrl} alt={`${artist.name} cover`} className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        <div className="absolute top-4 left-4 z-10">
          <button onClick={onBack} className="bg-black/30 backdrop-blur-sm p-2 rounded-full text-white hover:bg-black/50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end space-x-4">
          <button 
            onClick={() => onViewImage(artist.profileImageUrl)} 
            aria-label="Ver foto de perfil ampliada"
            className="rounded-full flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-magenta-500"
          >
            <img src={artist.profileImageUrl} alt={artist.name} className="w-24 h-24 rounded-full border-4 border-gray-800 object-cover transition-transform hover:scale-105" />
          </button>
          <div>
            <h1 className="text-3xl font-black">{artist.name}</h1>
            <p className="text-orange-400 font-semibold">{artist.genre}</p>
          </div>
        </div>
      </header>
      
      <main className="p-6">
        <section id="bio" className="mb-12">
          <h2 className="text-xl font-bold text-white mb-2">Sobre</h2>
          <p className="text-gray-300 leading-relaxed">{artist.bio}</p>
        </section>

        {artist.id === 'lia' && (
            <section id="benefits" className="mb-12">
                <h2 className="text-2xl font-bold text-center text-white mb-6">O que te espera no Fã Clube</h2>
                <div className="grid grid-cols-2 gap-4">
                    {benefits.map((benefit, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedBenefit(benefit)}
                            className="relative rounded-lg overflow-hidden aspect-square group shadow-lg text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-magenta-500"
                            aria-label={`Ver mais sobre ${benefit.title}`}
                        >
                            <img src={benefit.imageUrl} alt={benefit.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3">
                                <h3 className="font-bold text-white text-md">{benefit.title}</h3>
                                <p className="text-xs text-gray-300 leading-tight">{benefit.shortDescription}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </section>
        )}

        <section id="plans">
          <h2 className="text-2xl font-bold text-center text-white mb-6">Escolha seu plano</h2>
          <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
            {artist.plans.map(plan => <PlanCard key={plan.type} plan={plan} onSubscribe={() => onSubscribe(artist, plan)} />)}
          </div>
        </section>
        
        {/* Placeholder for other sections like Spotify, YouTube, etc. */}
      </main>

      <BenefitDetailModal
        benefit={selectedBenefit}
        onClose={() => setSelectedBenefit(null)}
        onSubscribe={handleSubscribeFromModal}
      />
    </div>
  );
};

export default ArtistLandingPage;