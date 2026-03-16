
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
        <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <div className="flex items-center">
                <img src={platformLogos[platform]} alt={`${platformName} logo`} className="w-6 h-6 mr-3" />
                <span className="font-semibold text-gray-900">{platformName}</span>
            </div>
            {isConnected ? (
                <div className="flex items-center space-x-2 text-green-500">
                    <Icon name="check-circle" className="w-5 h-5" />
                    <span className="text-sm font-bold">Conectado</span>
                </div>
            ) : (
                <button onClick={onConnect} className="text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors bg-rose-50 px-3 py-1.5 rounded-full">Conectar</button>
            )}
        </div>
    );
    
    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-1 text-lg">Conecte suas contas</h3>
            <p className="text-xs text-gray-500 mb-4">Assim cada play conta como view/stream oficial para o artista!</p>
            <div className="space-y-1">
                <ConnectionStatus platform={MediaPlatform.YOUTUBE} platformName="YouTube" isConnected={connections.youtube} onConnect={() => onRequestConnection(MediaPlatform.YOUTUBE)} />
                <ConnectionStatus platform={MediaPlatform.SPOTIFY} platformName="Spotify" isConnected={connections.spotify} onConnect={() => onRequestConnection(MediaPlatform.SPOTIFY)} />
            </div>
        </div>
    )
};


const MediaListItem: React.FC<{ item: MediaItem; onPlay: () => void }> = ({ item, onPlay }) => (
    <button onClick={onPlay} className="w-full flex items-center space-x-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors text-left group border border-transparent hover:border-gray-100 hover:shadow-sm">
        <div className="relative flex-shrink-0">
            <img src={item.imageUrl} alt={item.title} className="w-20 h-20 rounded-xl object-cover shadow-sm" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white p-1.5 rounded-full shadow-lg">
                    <Icon name="play" className="w-4 h-4 text-gray-900 fill-current" />
                </div>
            </div>
        </div>
        <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 truncate text-sm">{item.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{item.source}</p>
        </div>
        <div className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">{item.duration}</div>
    </button>
);


const MediaView: React.FC<MediaViewProps> = ({ mediaItems, connections, onPlay, onRequestConnection }) => {
    const youtubeVideos = mediaItems.filter(item => item.platform === MediaPlatform.YOUTUBE);
    const spotifyAudios = mediaItems.filter(item => item.platform === MediaPlatform.SPOTIFY);

    return (
        <div className="p-4 animate-fade-in">
            <header className="mb-6">
                <h2 className="text-3xl font-black text-gray-900">Mídia</h2>
                <p className="text-gray-500">Assista aos clipes e ouça as músicas mais recentes.</p>
            </header>

            <ConnectAccountCard connections={connections} onRequestConnection={onRequestConnection} />

            {youtubeVideos.length > 0 && (
                <section className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center px-2">
                        <img src={platformLogos.YOUTUBE} alt="YouTube" className="w-5 h-5 mr-2" />
                        YouTube
                    </h3>
                    <div className="flex flex-col space-y-2">
                        {youtubeVideos.map(item => (
                            <MediaListItem key={item.id} item={item} onPlay={() => onPlay(item)} />
                        ))}
                    </div>
                </section>
            )}

            {spotifyAudios.length > 0 && (
                <section>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center px-2">
                        <img src={platformLogos.SPOTIFY} alt="Spotify" className="w-5 h-5 mr-2" />
                        Spotify
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
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
