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
    <>
      <header className="flex items-center justify-between">
          <Icon name="chevron-down" className="w-6 h-6 text-gray-400" />
          <h2 className="text-lg font-bold text-white">Tocando Agora</h2>
          <button onClick={onClose} className="p-2 -m-2 rounded-full text-gray-400 hover:bg-gray-700/50">
              <Icon name="close" className="w-5 h-5" />
          </button>
      </header>

      <main className="flex flex-col items-center">
          <img 
              src={item.imageUrl} 
              alt={item.title} 
              className="w-full aspect-square rounded-2xl object-cover shadow-2xl shadow-black/50" 
          />
          <div className="flex justify-between items-center w-full mt-6">
              <div className="text-left">
                  <h1 className="text-2xl font-bold text-white">{item.title}</h1>
                  <p className="text-md text-gray-400">{item.source}</p>
              </div>
               <button 
                  onClick={onToggleLike} 
                  className={`p-2 rounded-full transition-colors duration-200 ${isLiked ? 'text-magenta-500' : 'text-gray-400 hover:text-magenta-500'}`}
                  aria-pressed={isLiked}
               >
                  <Icon name="like" className={`w-7 h-7 ${isLiked ? 'fill-current' : ''}`} />
              </button>
          </div>
      </main>

      <footer className="w-full">
          {/* Fake Progress Bar */}
          <div className="mb-4">
              <div className="bg-gray-700 h-1.5 rounded-full group">
                  <div className="bg-white w-1/3 h-1.5 rounded-full relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div>
                  </div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2 font-mono">
                  <span>1:23</span>
                  <span>{item.duration}</span>
              </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between text-white">
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                  <Icon name="shuffle" className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-4">
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                      <Icon name="backward" className="w-8 h-8" />
                  </button>
                  <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-4 bg-white text-gray-900 rounded-full shadow-lg"
                      aria-label={isPlaying ? "Pausar" : "Tocar"}
                  >
                      <Icon name={isPlaying ? 'pause' : 'play'} className="w-10 h-10" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                      <Icon name="forward" className="w-8 h-8" />
                  </button>
              </div>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                  <Icon name="repeat" className="w-6 h-6" />
              </button>
          </div>
          <a 
              href={item.externalUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full mt-6 text-center block text-sm font-semibold text-orange-400 hover:text-orange-300"
          >
              Ver no Spotify
          </a>
      </footer>
    </>
  );
};

const VideoPlayerUI: React.FC<{ item: MediaItem, onClose: () => void, isLiked: boolean, onToggleLike: () => void }> = ({ item, onClose, isLiked, onToggleLike }) => {
    const [isPlaying, setIsPlaying] = useState(true);
    return (
        <>
            <header className="flex items-center">
                <button onClick={onClose} className="p-2 -m-2 rounded-full text-gray-400 hover:bg-gray-700/50">
                    <Icon name="close" className="w-6 h-6" />
                </button>
            </header>
            <main className="flex flex-col flex-grow justify-center">
                <div className="w-full aspect-video bg-black rounded-lg overflow-hidden relative group">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    
                    {/* Video Controls Overlay */}
                    <div className="absolute inset-0 bg-black/20 flex flex-col justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {/* Empty div for spacing */}
                        <div></div>
                        
                        {/* Play/Pause center button */}
                        <div className="flex-grow flex items-center justify-center">
                            <button 
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="bg-black/50 backdrop-blur-sm p-4 rounded-full text-white"
                                aria-label={isPlaying ? "Pausar" : "Tocar"}
                            >
                                <Icon name={isPlaying ? 'pause' : 'play'} className="w-10 h-10" />
                            </button>
                        </div>

                        {/* Bottom control bar */}
                        <div>
                           <div className="bg-gray-500 h-1 rounded-full group mb-2">
                                <div className="bg-red-600 w-1/3 h-1 rounded-full relative">
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-white">
                               <div className="flex items-center space-x-4">
                                   <button onClick={() => setIsPlaying(!isPlaying)}>
                                       <Icon name={isPlaying ? 'pause' : 'play'} className="w-6 h-6" />
                                   </button>
                                   <p className="text-xs font-mono">1:23 / {item.duration}</p>
                               </div>
                               <div className="flex items-center space-x-4">
                                   <button>
                                        <Icon name="volume-high" className="w-6 h-6" />
                                   </button>
                                    <button>
                                        <Icon name="fullscreen" className="w-6 h-6" />
                                   </button>
                               </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                 {/* Info and Like button section */}
                <div className="mt-4 flex justify-between items-start">
                    <div>
                        <h1 className="text-lg font-bold text-white">{item.title}</h1>
                        <p className="text-sm text-gray-400">{item.source}</p>
                    </div>
                    <button 
                        onClick={onToggleLike} 
                        className={`flex items-center space-x-2 py-2 px-4 rounded-full transition-colors duration-200 ${isLiked ? 'bg-magenta-500/20 text-magenta-400' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'}`}
                        aria-pressed={isLiked}
                    >
                        <Icon name="like" className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                        <span className="font-semibold text-sm">Curtir</span>
                    </button>
                </div>
                
                <a 
                    href={item.externalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full mt-4 text-center block text-sm font-semibold text-orange-400 hover:text-orange-300"
                >
                    Ver no YouTube
                </a>
            </main>
            {/* Empty footer to balance layout */}
            <footer></footer>
        </>
    );
};

const MediaPlayer: React.FC<MediaPlayerProps> = ({ item, onClose }) => {
  const [isLiked, setIsLiked] = useState(false);
  const handleToggleLike = () => setIsLiked(prev => !prev);

  return (
    <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-0 md:p-4 animate-fade-in" 
        onClick={onClose}
        aria-modal="true" 
        role="dialog"
    >
        <div
            className="bg-gray-900/95 backdrop-blur-xl flex flex-col w-full h-full p-6 justify-between animate-slide-up relative overflow-hidden"
            style={{
                maxWidth: '450px',
                aspectRatio: '1179 / 2556',
                maxHeight: '95vh',
                borderRadius: '2.5rem',
                border: '8px solid black',
                boxShadow: '0 0 80px rgba(0, 0, 0, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
        >
          {item.type === MediaType.VIDEO 
            ? <VideoPlayerUI item={item} onClose={onClose} isLiked={isLiked} onToggleLike={handleToggleLike} />
            : <AudioPlayerUI item={item} onClose={onClose} isLiked={isLiked} onToggleLike={handleToggleLike} />
          }
        </div>
    </div>
  );
};

export default MediaPlayer;