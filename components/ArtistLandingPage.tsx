
import React, { useState } from 'react';
import { Artist, Plan } from '../types';
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

  const handleJoin = () => {
      // Mock plan for compatibility, but flow is free
      onSubscribe(artist, { type: 'BASIC', price: 0, benefits: [], includesPPV: false, level: 1 } as any);
  };

  return (
    <div className="bg-white min-h-[100dvh] flex flex-col text-gray-900 relative">
      <div className="flex-1 overflow-y-auto no-scrollbar">
          <header className="relative h-64">
            <img src={artist.coverImageUrl} alt={`${artist.name} cover`} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-4 left-4 z-10">
              <button onClick={onBack} className="bg-white/80 backdrop-blur-sm p-2 rounded-full text-gray-900 hover:bg-white transition-colors shadow-sm">
                <Icon name="arrowLeft" className="w-6 h-6" />
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end space-x-4">
              <button 
                onClick={() => onViewImage(artist.profileImageUrl)} 
                aria-label="Ver foto de perfil ampliada"
                className="rounded-full flex-shrink-0 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
              >
                <img src={artist.profileImageUrl} alt={artist.name} className="w-24 h-24 rounded-full border-4 border-white object-cover transition-transform hover:scale-105 shadow-xl" />
              </button>
              <div className="mb-2">
                <h1 className="text-3xl font-black text-gray-900">{artist.name}</h1>
                <p className="text-rose-500 font-bold">{artist.genre}</p>
              </div>
            </div>
          </header>
          
          <main className="p-6">
            <section id="bio" className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Sobre</h2>
              <p className="text-gray-500 leading-relaxed text-sm">{artist.bio}</p>
            </section>

            <section id="benefits" className="mb-8">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">O que te espera no Fã Clube</h2>
                <div className="grid grid-cols-2 gap-4">
                    {benefits.map((benefit, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedBenefit(benefit)}
                            className="relative rounded-2xl overflow-hidden aspect-square group shadow-md text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
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
          </main>
      </div>

      <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-20">
          <button
            onClick={handleJoin}
            className="w-full bg-rose-500 text-white font-black text-lg py-4 px-6 rounded-2xl hover:bg-rose-600 transition-all active:scale-95 shadow-xl shadow-rose-500/20 flex items-center justify-center space-x-2"
          >
            <span>Entrar para o Clube (Grátis)</span>
            <Icon name="chevron-right" className="w-5 h-5" />
          </button>
      </div>

      <BenefitDetailModal
        benefit={selectedBenefit}
        onClose={() => setSelectedBenefit(null)}
        onSubscribe={handleJoin}
      />
    </div>
  );
};

export default ArtistLandingPage;
