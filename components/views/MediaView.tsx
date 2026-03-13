
import React from 'react';
import { MediaItem, MediaPlatform } from '../../types';
import Icon from '../Icon';

const platformLogos = {
    [MediaPlatform.YOUTUBE]: 'https://www.logo.wine/a/logo/YouTube/YouTube-Icon-Full-Color-Logo.wine.svg',
    [MediaPlatform.SPOTIFY]: 'https://www.logo.wine/a/logo/Spotify/Spotify-Icon-Logo.wine.svg',
}

interface MediaViewProps {
    mediaItems: MediaItem[];
    connections: { youtube: boolean; spotify: boolean };
    onPlay: (item: MediaItem) => void;
    onRequestConnection: (platform: MediaPlatform) => void;
}

const ConnectAccountCard: React.FC<{ connections: { youtube: boolean; spotify: boolean }, onRequestConnection: (platform: MediaPlatform) => void }> = ({ connections, onRequestConnection }) => {
    
    const ConnectionStatus: React.FC<{ platform: MediaPlatform, platformName: string, isConnected: boolean, onConnect: () => void }> = ({ platform, platformName, isConnected, onConnect }) => (
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <img src={platformLogos[platform]} alt={`${platformName} logo`} className="w-6 h-6 mr-3" />
                <span className="font-semibold text-white">{platformName}</span>
            </div>
            {isConnected ? (
                <div className="flex items-center space-x-2 text-green-400">
                    <Icon name="check-circle" className="w-5 h-5" />
                    <span className="text-sm font-semibold">Conectado</span>
                </div>
            ) : (
                <button onClick={onConnect} className="text-sm font-bold text-orange-400 hover:text-orange-300 transition-colors">Conectar</button>
            )}
        </div>
    );
    
    return (
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-4 mb-6">
            <h3 className="font-bold text-white mb-1">Conecte suas contas</h3>
            <p className="text-xs text-gray-400 mb-4">Assim cada play conta como view/stream oficial para o artista!</p>
            <div className="space-y-3">
                <ConnectionStatus platform={MediaPlatform.YOUTUBE} platformName="YouTube" isConnected={connections.youtube} onConnect={() => onRequestConnection(MediaPlatform.YOUTUBE)} />
                <ConnectionStatus platform={MediaPlatform.SPOTIFY} platformName="Spotify" isConnected={connections.spotify} onConnect={() => onRequestConnection(MediaPlatform.SPOTIFY)} />
            </div>
        </div>
    )
};


const MediaListItem: React.FC<{ item: MediaItem; onPlay: () => void }> = ({ item, onPlay }) => (
    <button onClick={onPlay} className="w-full flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-800/50 transition-colors text-left group">
        <div className="relative flex-shrink-0">
            <img src={item.imageUrl} alt={item.title} className="w-16 h-16 rounded-md object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                <Icon name="ppv" className="w-8 h-8 text-white" />
            </div>
        </div>
        <div className="flex-1 min-w-0">
            <p className="font-bold text-white truncate">{item.title}</p>
            <p className="text-sm text-gray-400">{item.source}</p>
        </div>
        <div className="text-sm text-gray-500 font-mono">{item.duration}</div>
    </button>
);


const MediaView: React.FC<MediaViewProps> = ({ mediaItems, connections, onPlay, onRequestConnection }) => {
    const youtubeVideos = mediaItems.filter(item => item.platform === MediaPlatform.YOUTUBE);
    const spotifyAudios = mediaItems.filter(item => item.platform === MediaPlatform.SPOTIFY);

    return (
        <div className="p-4 animate-fade-in">
            <header className="mb-6">
                <h2 className="text-3xl font-black text-white">Mídia</h2>
                <p className="text-gray-400">Assista aos clipes e ouça as músicas mais recentes.</p>
            </header>

            <ConnectAccountCard connections={connections} onRequestConnection={onRequestConnection} />

            {youtubeVideos.length > 0 && (
                <section className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                        <img src={platformLogos.YOUTUBE} alt="YouTube" className="w-6 h-6 mr-2" />
                        YouTube
                    </h3>
                    <div className="flex flex-col">
                        {youtubeVideos.map(item => (
                            <MediaListItem key={item.id} item={item} onPlay={() => onPlay(item)} />
                        ))}
                    </div>
                </section>
            )}

            {spotifyAudios.length > 0 && (
                <section>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                        <img src={platformLogos.SPOTIFY} alt="Spotify" className="w-6 h-6 mr-2" />
                        Spotify
                    </h3>
                    <div className="grid grid-cols-1 divide-y divide-gray-700/50">
                        {spotifyAudios.map(item => (
                            <MediaListItem key={item.id} item={item} onPlay={() => onPlay(item)} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default MediaView;
