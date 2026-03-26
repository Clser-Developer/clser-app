
import React, { useState, useMemo } from 'react';
import { Artist } from '../types';
import ArtistDiscoveryCard from './ArtistDiscoveryCard';
import Icon from './Icon';

interface ArtistShowcaseProps {
  artists: Artist[];
  onSelectArtist: (artist: Artist) => void;
  onBack?: () => void;
}

const CATEGORIES = ['Destaques', 'Sertanejo', 'Pop', 'Rock', 'Indie', 'Eletrônica', 'Axé', 'Funk', 'MPB'];

const ArtistShowcase: React.FC<ArtistShowcaseProps> = ({ artists, onSelectArtist, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Destaques');
  const [isShowingAll, setIsShowingAll] = useState(false);

  // Simula uma lista maior de artistas para o modo "Veja todos"
  const extendedArtists = useMemo(() => {
    const pool = [...artists];
    // Adiciona variações para simular uma base maior em todas as categorias
    const clones = Array.from({ length: 20 }).map((_, i) => ({
      ...pool[i % pool.length],
      id: `clone-${i}`,
      name: `${pool[i % pool.length].name} ${i + 1}`,
      genre: CATEGORIES[1 + (i % (CATEGORIES.length - 1))]
    }));
    return [...pool, ...clones];
  }, [artists]);

  const filteredArtists = useMemo(() => {
    let source = isShowingAll ? extendedArtists : artists;
    let result = source;
    
    if (activeCategory !== 'Destaques') {
      result = result.filter(a => 
        a.genre.toLowerCase().includes(activeCategory.toLowerCase()) ||
        (activeCategory === 'Sertanejo' && a.id === 'lia')
      );
    }
    
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.name.toLowerCase().includes(lowerQuery) || 
        a.genre.toLowerCase().includes(lowerQuery)
      );
    }
    
    return result;
  }, [artists, extendedArtists, searchQuery, activeCategory, isShowingAll]);

  const handleToggleShowAll = () => {
    setIsShowingAll(!isShowingAll);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <div className="safe-screen bg-[#FAFAFA] text-gray-900 pb-[calc(5rem+env(safe-area-inset-bottom,0px))]">
      {/* Header com Logo e Texto de Boas-vindas */}
      <div className="px-6 pt-[calc(env(safe-area-inset-top,0px)+1rem)] flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-8">
            <button 
                onClick={isShowingAll ? handleToggleShowAll : onBack} 
                className="p-2 -ml-2 text-gray-400 hover:text-gray-900 transition-colors"
            >
                <Icon name="arrowLeft" className="w-6 h-6" />
            </button>
            <img 
              src="https://i.ibb.co/fzC9nphW/clser-logo-color.png" 
              alt="Clser Logo"
              className="h-8 w-auto" 
            />
            <div className="w-10"></div>
        </div>
        
        {!isShowingAll && (
            <div className="text-center animate-fade-in px-4">
               <h1 className="text-3xl font-black text-gray-900 leading-tight tracking-tight">
                 Explore artistas e clubes
               </h1>
               <p className="text-sm text-gray-400 font-medium mt-2 leading-relaxed max-w-[280px] mx-auto">
                 Escolha por onde quer começar ou descubra novos universos para acompanhar.
               </p>
            </div>
        )}
      </div>

      {/* Barra de Busca + Botão Lupa */}
      <div className="px-6 mt-8 flex items-center gap-3">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Icon name="search" className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Busca"
            className="w-full bg-[#F3F4F6] border-none rounded-2xl py-4 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-rose-500 outline-none transition-shadow"
          />
        </div>
        <button className="w-12 h-12 bg-gradient-to-br from-rose-400 to-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-200 active:scale-95 transition-transform">
          <Icon name="search" className="w-6 h-6" />
        </button>
      </div>

      {/* MENU DE CATEGORIAS - Corrigido para Scroll Horizontal */}
      <div className="mt-8 relative">
          <div className="overflow-x-auto no-scrollbar flex items-center px-6 gap-8 whitespace-nowrap scroll-smooth">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-lg font-black transition-all duration-300 relative pb-1 ${
                  activeCategory === cat ? 'text-gray-900 scale-105' : 'text-gray-300 hover:text-gray-400'
                }`}
              >
                {cat}
                {activeCategory === cat && (
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-rose-500 rounded-full animate-scale-in"></span>
                )}
              </button>
            ))}
            {/* Espaçador final para garantir que o último item não cole na borda ao rolar */}
            <div className="min-w-[24px] h-1"></div>
          </div>
      </div>

      {/* Grid Dinâmico */}
      <div className="mt-6 px-6">
        {isShowingAll ? (
            <div className="grid grid-cols-2 gap-4 animate-fade-in">
                {filteredArtists.map((artist) => (
                    <ArtistDiscoveryCard 
                        key={artist.id} 
                        artist={artist} 
                        onClick={() => onSelectArtist(artist)} 
                    />
                ))}
                {filteredArtists.length === 0 && (
                    <div className="col-span-2 py-10 text-center text-gray-400 font-bold">
                        Nenhum artista nesta categoria.
                    </div>
                )}
            </div>
        ) : (
            <div className="overflow-x-auto no-scrollbar flex gap-4 -mx-1 px-1">
                {filteredArtists.length > 0 ? (
                filteredArtists.slice(0, 5).map((artist) => (
                    <div key={artist.id} className="min-w-[160px] w-[160px] animate-fade-in">
                    <ArtistDiscoveryCard 
                        artist={artist} 
                        onClick={() => onSelectArtist(artist)} 
                    />
                    </div>
                ))
                ) : (
                <div className="w-full py-10 text-center text-gray-400 font-bold">
                    Nenhum artista encontrado
                </div>
                )}
            </div>
        )}
      </div>

      {/* Seção Popular */}
      {!isShowingAll && (
          <div className="mt-10 px-6 animate-fade-in">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-black text-gray-900">Popular</h2>
              <button 
                onClick={handleToggleShowAll}
                className="text-rose-500 font-bold text-sm hover:underline"
              >
                Veja todos
              </button>
            </div>
            
            <div className="space-y-6">
              {artists.slice(0, 2).map(artist => (
                <button 
                  key={`popular-${artist.id}`}
                  onClick={() => onSelectArtist(artist)}
                  className="w-full flex gap-4 text-left group"
                >
                  <div className="w-24 h-24 rounded-2xl overflow-hidden relative shrink-0 shadow-md">
                    <img src={artist.coverImageUrl} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-lg font-black text-gray-900 group-hover:text-rose-500 transition-colors">{artist.name} Official</h3>
                    <p className="text-gray-400 text-xs font-bold mt-1 uppercase tracking-wider">{artist.genre}</p>
                    <div className="flex items-center mt-2 gap-2">
                       <div className="flex -space-x-2">
                         {[1,2,3].map(i => (
                           <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${artist.id}${i}`} alt="" />
                           </div>
                         ))}
                       </div>
                       <span className="text-[10px] text-gray-400 font-bold">+1.2k fãs no clube</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
      )}
    </div>
  );
};

export default ArtistShowcase;
