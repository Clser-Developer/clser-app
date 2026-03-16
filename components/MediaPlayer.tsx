
import React, { useState } from 'react';
import { MediaItem, MediaType } from '../types';
import Icon from './Icon';

interface MediaPlayerProps {
  item: MediaItem;
  onClose: () => void;
}

const AudioPlayerUI: React.FC<{ item: MediaItem, onClose: () => void, isLiked: boolean, onToggleLike: () => void }> = ({ item, onClose, isLiked, onToggleLike }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  return (
    <div className="flex flex-col h-full justify-between animate-fade-in">
      <header className="flex items-center justify-between">
          <button onClick={onClose} className="p-2 -m-2 rounded-full text-gray-400 hover:bg-gray-100">
              <Icon name="chevron-down" className="w-7 h-7" />
          </button>
          <div className="text-center">
            <h2 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-0.5">Ouvindo Agora</h2>
            <p className="text-xs font-bold text-gray-400">Em Alta Qualidade</p>
          </div>
          <button onClick={onClose} className="p-2 -m-2 rounded-full text-gray-400 hover:bg-gray-100">
              <Icon name="close" className="w-5 h-5" />
          </button>
      </header>

      <main className="flex flex-col items-center py-8">
          <div className="relative w-full aspect-square group shadow-2xl shadow-black/10 rounded-[2.5rem] overflow-hidden">
            <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div className="flex justify-between items-center w-full mt-10 px-2">
              <div className="text-left flex-1 min-w-0 pr-4">
                  <h1 className="text-2xl font-black text-gray-900 leading-tight truncate">{item.title}</h1>
                  <p className="text-base text-rose-500 font-bold mt-1">{item.source}</p>
              </div>
               <button 
                  onClick={onToggleLike} 
                  className={`p-3 rounded-2xl transition-all duration-300 shadow-sm ${isLiked ? 'bg-rose-500 text-white shadow-rose-200' : 'bg-gray-50 text-gray-300 hover:bg-gray-100'}`}
                  aria-pressed={isLiked}
               >
                  <Icon name="like" className={`w-7 h-7 ${isLiked ? 'fill-current' : ''}`} />
              </button>
          </div>
      </main>

      <footer className="w-full pb-8">
          <div className="mb-10 px-2">
              <div className="bg-gray-100 h-1.5 rounded-full relative overflow-hidden shadow-inner">
                  <div className="bg-rose-500 w-1/3 h-full rounded-full relative shadow-sm">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-4 border-rose-500 rounded-full shadow-md"></div>
                  </div>
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 mt-3 font-black uppercase tracking-widest">
                  <span>01:23</span>
                  <span>{item.duration}</span>
              </div>
          </div>

          <div className="flex items-center justify-between text-gray-900 px-4">
              <button className="p-2 text-gray-300 hover:text-gray-600 transition-colors">
                  <Icon name="shuffle" className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-6">
                  <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors active:scale-90">
                      <Icon name="backward" className="w-8 h-8" />
                  </button>
                  <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-6 bg-gray-900 text-white rounded-[2rem] shadow-xl hover:bg-black transition-all active:scale-95 shadow-black/10"
                      aria-label={isPlaying ? "Pausar" : "Tocar"}
                  >
                      <Icon name={isPlaying ? 'pause' : 'play'} className="w-10 h-10" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors active:scale-90">
                      <Icon name="forward" className="w-8 h-8" />
                  </button>
              </div>
              <button className="p-2 text-gray-300 hover:text-gray-600 transition-colors">
                  <Icon name="repeat" className="w-5 h-5" />
              </button>
          </div>
          
          <a 
              href={item.externalUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full mt-10 text-center block text-xs font-black uppercase tracking-[0.2em] text-rose-500 hover:text-rose-600 bg-rose-50 py-4 rounded-2xl border border-rose-100 transition-all active:scale-[0.98]"
          >
              Abrir no Spotify
          </a>
      </footer>
    </div>
  );
};

const VideoPlayerUI: React.FC<{ item: MediaItem, onClose: () => void, isLiked: boolean, onToggleLike: () => void }> = ({ item, onClose, isLiked, onToggleLike }) => {
    const [isPlaying, setIsPlaying] = useState(true);
    return (
        <div className="flex flex-col h-full justify-between animate-fade-in">
            <header className="flex items-center justify-between">
                <button onClick={onClose} className="p-2 -m-2 rounded-full text-gray-400 hover:bg-gray-100">
                    <Icon name="chevron-down" className="w-7 h-7" />
                </button>
                <h2 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">Reproduzindo Vídeo</h2>
                <button onClick={onClose} className="p-2 -m-2 rounded-full text-gray-400 hover:bg-gray-100">
                    <Icon name="close" className="w-5 h-5" />
                </button>
            </header>

            <main className="flex flex-col flex-grow justify-center py-6">
                <div className="w-full aspect-video bg-gray-900 rounded-[2rem] overflow-hidden shadow-2xl relative group border-4 border-white">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div></div>
                        <div className="flex-grow flex items-center justify-center">
                            <button onClick={() => setIsPlaying(!isPlaying)} className="bg-white/20 backdrop-blur-md p-5 rounded-full text-white shadow-xl hover:bg-white/30 active:scale-90 transition-all border border-white/30">
                                <Icon name={isPlaying ? 'pause' : 'play'} className="w-10 h-10" />
                            </button>
                        </div>
                        <div className="space-y-3">
                           <div className="bg-white/20 h-1.5 rounded-full overflow-hidden backdrop-blur-sm">
                                <div className="bg-rose-500 w-1/3 h-full rounded-full relative"></div>
                            </div>
                            <div className="flex items-center justify-between text-white text-[10px] font-black font-mono">
                               <div className="flex items-center space-x-3">
                                   <span>01:23</span>
                                   <span className="opacity-40">/</span>
                                   <span>{item.duration}</span>
                               </div>
                               <div className="flex items-center space-x-4">
                                   <Icon name="volume-high" className="w-5 h-5" />
                                   <Icon name="fullscreen" className="w-5 h-5" />
                               </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="mt-8 flex justify-between items-start px-2">
                    <div className="flex-1 min-w-0 pr-4">
                        <h1 className="text-2xl font-black text-gray-900 leading-tight truncate">{item.title}</h1>
                        <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">{item.source}</p>
                    </div>
                    <button 
                        onClick={onToggleLike} 
                        className={`flex items-center space-x-2 py-3 px-5 rounded-2xl transition-all duration-300 shadow-sm ${isLiked ? 'bg-rose-500 text-white' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                    >
                        <Icon name="like" className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                        <span className="font-black text-[10px] uppercase tracking-widest">Curtir</span>
                    </button>
                </div>
            </main>
            
            <footer className="pb-8">
                <a 
                    href={item.externalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full text-center block text-xs font-black uppercase tracking-[0.2em] text-gray-500 hover:text-gray-900 bg-gray-100 py-4 rounded-2xl transition-all active:scale-[0.98] border border-gray-200"
                >
                    Assistir no YouTube
                </a>
            </footer>
        </div>
    );
};

const MediaPlayer: React.FC<MediaPlayerProps> = ({ item, onClose }) => {
  const [isLiked, setIsLiked] = useState(false);
  const handleToggleLike = () => setIsLiked(prev => !prev);

  return (
    <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center p-0 md:p-4 animate-fade-in" 
        onClick={onClose}
        aria-modal="true" 
        role="dialog"
    >
        <div
            className="bg-white/95 backdrop-blur-3xl flex flex-col w-full h-full p-6 justify-between animate-slide-up relative overflow-hidden"
            style={{
                maxWidth: '450px',
                aspectRatio: '1179 / 2556',
                maxHeight: '95vh',
                borderRadius: '2.5rem',
                border: '8px solid #111827',
                boxShadow: '0 0 80px rgba(0, 0, 0, 0.4)',
            }}
            onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute top-[-20%] right-[-20%] w-96 h-96 bg-rose-200/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-[-10%] left-[-20%] w-80 h-80 bg-purple-200/20 rounded-full blur-3xl pointer-events-none"></div>

          {item.type === MediaType.VIDEO 
            ? <VideoPlayerUI item={item} onClose={onClose} isLiked={isLiked} onToggleLike={handleToggleLike} />
            : <AudioPlayerUI item={item} onClose={onClose} isLiked={isLiked} onToggleLike={handleToggleLike} />
          }
        </div>
    </div>
  );
};

export default MediaPlayer;
