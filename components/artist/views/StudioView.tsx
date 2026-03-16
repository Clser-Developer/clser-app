
import React, { useState, useRef, ChangeEvent } from 'react';
import Icon from '../../Icon';
import { Artist, Post, PostType, MerchItem, Event, Section, StoreSection, FanAreaSection } from '../../../types';

interface StudioViewProps {
    artist: Artist;
    onPostCreated: (post: Post) => void;
    availableMerch: MerchItem[];
    availableEvents: Event[];
}

type ContentTab = 'POST' | 'POLL';
type LinkType = 'NONE' | 'MERCH' | 'TICKET' | 'FAN_AREA';

const StudioView: React.FC<StudioViewProps> = ({ artist, onPostCreated, availableMerch, availableEvents }) => {
    const [activeTab, setActiveTab] = useState<ContentTab>('POST');
    const [postText, setPostText] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    
    // Poll State
    const [pollOptions, setPollOptions] = useState<string[]>(['', '']);

    // Link State
    const [linkType, setLinkType] = useState<LinkType>('NONE');
    const [selectedLinkId, setSelectedLinkId] = useState<string>('');
    const [linkButtonText, setLinkButtonText] = useState('');

    const [isPosting, setIsPosting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddPollOption = () => {
        if (pollOptions.length < 5) {
            setPollOptions([...pollOptions, '']);
        }
    };

    const handleRemovePollOption = (index: number) => {
        if (pollOptions.length > 2) {
            const newOptions = [...pollOptions];
            newOptions.splice(index, 1);
            setPollOptions(newOptions);
        }
    };

    const handlePollOptionChange = (index: number, value: string) => {
        const newOptions = [...pollOptions];
        newOptions[index] = value;
        setPollOptions(newOptions);
    };

    const getLinkObject = () => {
        if (linkType === 'NONE') return undefined;

        let targetSection: Section = Section.STORE; // Default
        let targetSubSection: any = undefined;
        let targetItemId: string | undefined = undefined;

        if (linkType === 'MERCH') {
            targetSection = Section.STORE;
            targetSubSection = StoreSection.MERCH;
            targetItemId = selectedLinkId;
        } else if (linkType === 'TICKET') {
            targetSection = Section.STORE;
            targetSubSection = StoreSection.TICKETS;
            targetItemId = selectedLinkId;
        } else if (linkType === 'FAN_AREA') {
            targetSection = Section.FAN_AREA;
            targetSubSection = selectedLinkId; // In this case ID is the subsection enum
        }

        return {
            text: linkButtonText || 'Ver Agora',
            targetSection,
            targetSubSection,
            targetItemId
        };
    };

    const handlePost = () => {
        if (activeTab === 'POST' && !postText.trim() && !previewUrl) return;
        if (activeTab === 'POLL' && (!postText.trim() || pollOptions.some(opt => !opt.trim()))) return;
        
        setIsPosting(true);
        
        setTimeout(() => {
            const newPost: Post = {
                id: `p-${Date.now()}`,
                artistId: artist.id,
                type: activeTab === 'POLL' ? PostType.POLL : (previewUrl ? PostType.IMAGE : PostType.TEXT),
                text: postText,
                mediaUrl: previewUrl || undefined,
                likes: 0,
                comments: 0,
                timestamp: 'Agora mesmo',
                pollOptions: activeTab === 'POLL' ? pollOptions.filter(o => o.trim()) : undefined,
                pollVotes: activeTab === 'POLL' ? new Array(pollOptions.length).fill(0) : undefined,
                userVotedOptionIndex: null,
                link: getLinkObject()
            };

            onPostCreated(newPost);
            
            // Reset
            setPostText('');
            setPreviewUrl(null);
            setImageFile(null);
            setPollOptions(['', '']);
            setLinkType('NONE');
            setSelectedLinkId('');
            setLinkButtonText('');
            setIsPosting(false);
            alert('Conteúdo publicado com sucesso!');
        }, 1500);
    };

    const isPostValid = () => {
        if (activeTab === 'POST') return postText.trim().length > 0 || !!previewUrl;
        if (activeTab === 'POLL') return postText.trim().length > 0 && pollOptions.every(opt => opt.trim().length > 0);
        return false;
    };

    return (
        <div className="p-4 animate-fade-in pb-24">
            <header className="mb-6">
                <h2 className="text-3xl font-black text-gray-900">Estúdio</h2>
                <p className="text-gray-500">Crie conteúdo e engaje sua comunidade.</p>
            </header>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-100">
                    <button 
                        onClick={() => setActiveTab('POST')}
                        className={`flex-1 py-4 text-sm font-bold transition-colors flex items-center justify-center gap-2 ${activeTab === 'POST' ? 'bg-gray-50 text-rose-500 border-b-2 border-rose-500' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
                    >
                        <Icon name="pencil" className="w-4 h-4" /> Postagem
                    </button>
                    <button 
                        onClick={() => setActiveTab('POLL')}
                        className={`flex-1 py-4 text-sm font-bold transition-colors flex items-center justify-center gap-2 ${activeTab === 'POLL' ? 'bg-gray-50 text-rose-500 border-b-2 border-rose-500' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
                    >
                        <Icon name="chart-bar" className="w-4 h-4" /> Enquete
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex items-start space-x-3 mb-6">
                        <img src={artist.profileImageUrl} alt={artist.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                        <textarea
                            value={postText}
                            onChange={(e) => setPostText(e.target.value)}
                            placeholder={activeTab === 'POLL' ? "Faça uma pergunta para os fãs..." : "O que está acontecendo, " + artist.name.split(' ')[0] + "?"}
                            rows={activeTab === 'POLL' ? 2 : 4}
                            className="flex-1 bg-transparent border-none text-gray-900 placeholder-gray-400 focus:ring-0 resize-none p-2 text-lg"
                        />
                    </div>

                    {/* Poll Options */}
                    {activeTab === 'POLL' && (
                        <div className="space-y-3 mb-6 pl-12">
                            {pollOptions.map((option, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => handlePollOptionChange(index, e.target.value)}
                                        placeholder={`Opção ${index + 1}`}
                                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:border-rose-500 focus:ring-rose-500 outline-none transition-shadow shadow-sm"
                                    />
                                    {pollOptions.length > 2 && (
                                        <button onClick={() => handleRemovePollOption(index)} className="text-gray-400 hover:text-red-500 p-2">
                                            <Icon name="close" className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            {pollOptions.length < 4 && (
                                <button 
                                    onClick={handleAddPollOption}
                                    className="text-sm font-bold text-rose-500 hover:text-rose-600 flex items-center gap-2 mt-2 px-3 py-2 rounded-lg hover:bg-rose-50 transition-colors"
                                >
                                    <Icon name="plus" className="w-4 h-4" /> Adicionar opção
                                </button>
                            )}
                        </div>
                    )}

                    {/* Image Preview */}
                    {previewUrl && activeTab === 'POST' && (
                        <div className="relative mb-6 ml-12 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                            <img src={previewUrl} alt="Preview" className="w-full object-cover max-h-64" />
                            <button 
                                onClick={() => { setPreviewUrl(null); setImageFile(null); }}
                                className="absolute top-2 right-2 bg-white/80 backdrop-blur p-2 rounded-full text-gray-600 hover:text-red-500 hover:bg-white transition-colors shadow-sm"
                            >
                                <Icon name="close" className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {/* Smart Linking Section */}
                    <div className="mb-6 pt-6 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Botão de Ação</label>
                            {linkType !== 'NONE' && (
                                <button onClick={() => setLinkType('NONE')} className="text-xs font-bold text-red-500 hover:text-red-600 bg-red-50 px-2 py-1 rounded-md">Remover</button>
                            )}
                        </div>
                        
                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                            <button 
                                onClick={() => setLinkType('MERCH')}
                                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${linkType === 'MERCH' ? 'bg-rose-500 border-rose-500 text-white shadow-md' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'}`}
                            >
                                🛍️ Produto
                            </button>
                            <button 
                                onClick={() => setLinkType('TICKET')}
                                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${linkType === 'TICKET' ? 'bg-rose-500 border-rose-500 text-white shadow-md' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'}`}
                            >
                                🎟️ Ingresso
                            </button>
                            <button 
                                onClick={() => setLinkType('FAN_AREA')}
                                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${linkType === 'FAN_AREA' ? 'bg-rose-500 border-rose-500 text-white shadow-md' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'}`}
                            >
                                🏆 Área do Fã
                            </button>
                        </div>

                        {/* Dynamic Link Inputs */}
                        {linkType !== 'NONE' && (
                            <div className="mt-4 bg-gray-50 p-4 rounded-xl space-y-3 animate-fade-in border border-gray-100">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Texto do Botão</label>
                                    <input 
                                        type="text" 
                                        value={linkButtonText}
                                        onChange={(e) => setLinkButtonText(e.target.value)}
                                        placeholder={linkType === 'MERCH' ? "Ex: Comprar Agora" : linkType === 'TICKET' ? "Ex: Garantir Ingresso" : "Ex: Ver Ranking"}
                                        className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm text-gray-900 focus:border-rose-500 focus:ring-rose-500 outline-none"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Destino</label>
                                    <select 
                                        value={selectedLinkId}
                                        onChange={(e) => setSelectedLinkId(e.target.value)}
                                        className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm text-gray-900 focus:border-rose-500 focus:ring-rose-500 outline-none"
                                    >
                                        <option value="">Selecione...</option>
                                        {linkType === 'MERCH' && availableMerch.map(item => (
                                            <option key={item.id} value={item.id}>{item.name} - R$ {item.price}</option>
                                        ))}
                                        {linkType === 'TICKET' && availableEvents.map(event => (
                                            <option key={event.id} value={event.id}>{event.name} - {event.date}</option>
                                        ))}
                                        {linkType === 'FAN_AREA' && (
                                            <>
                                                <option value={FanAreaSection.LEADERBOARD}>Ranking de Fãs</option>
                                                <option value={FanAreaSection.MURAL}>Mural de Fotos</option>
                                                <option value={FanAreaSection.REWARDS}>Recompensas</option>
                                                <option value={FanAreaSection.POLLS}>Enquetes</option>
                                            </>
                                        )}
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Bar */}
                    <div className="flex justify-between items-center pt-2">
                        <div className="flex space-x-2">
                            {activeTab === 'POST' && (
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-3 text-rose-500 hover:bg-rose-50 rounded-full transition-colors bg-gray-50 border border-gray-100"
                                    title="Adicionar Mídia"
                                >
                                    <Icon name="camera" className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                        
                        <button
                            onClick={handlePost}
                            disabled={!isPostValid() || isPosting}
                            className="bg-rose-500 text-white font-bold py-3 px-8 rounded-full hover:bg-rose-600 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center shadow-lg shadow-rose-500/30 hover:shadow-xl hover:-translate-y-0.5"
                        >
                            {isPosting ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span className="mr-2">Publicar</span>
                                    <Icon name="send" className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageSelect} 
                        accept="image/*" 
                        className="hidden" 
                    />
                </div>
            </div>
        </div>
    );
};

export default StudioView;
