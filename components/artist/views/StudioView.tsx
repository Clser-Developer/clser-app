
import React, { useState, useRef, ChangeEvent } from 'react';
import Icon from '../../Icon';
import { Artist, Post, PostType, MerchItem, Event, Section, StoreSection, FanAreaSection } from '../../../types';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Input } from '../../ui/input';
import { Select } from '../../ui/select';
import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs';
import { Textarea } from '../../ui/textarea';

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

            <Card className="overflow-hidden rounded-3xl border-gray-100 bg-white p-0 shadow-sm">
                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ContentTab)} className="gap-0">
                    <TabsList className="grid h-auto w-full grid-cols-2 rounded-none border-b border-gray-100 bg-transparent p-0">
                        <TabsTrigger value="POST" className="rounded-none py-4 text-sm font-bold data-[state=active]:border-b-2 data-[state=active]:border-rose-500 data-[state=active]:bg-gray-50 data-[state=active]:text-rose-500">
                            <Icon name="pencil" className="mr-2 h-4 w-4" /> Postagem
                        </TabsTrigger>
                        <TabsTrigger value="POLL" className="rounded-none py-4 text-sm font-bold data-[state=active]:border-b-2 data-[state=active]:border-rose-500 data-[state=active]:bg-gray-50 data-[state=active]:text-rose-500">
                            <Icon name="chart-bar" className="mr-2 h-4 w-4" /> Enquete
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="p-6">
                    <div className="flex items-start space-x-3 mb-6">
                        <img src={artist.profileImageUrl} alt={artist.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                        <Textarea
                            value={postText}
                            onChange={(e) => setPostText(e.target.value)}
                            placeholder={activeTab === 'POLL' ? "Faça uma pergunta para os fãs..." : "O que está acontecendo, " + artist.name.split(' ')[0] + "?"}
                            rows={activeTab === 'POLL' ? 2 : 4}
                            className="min-h-0 flex-1 resize-none border-none bg-transparent p-2 text-lg text-gray-900 shadow-none focus-visible:ring-0"
                        />
                    </div>

                    {/* Poll Options */}
                    {activeTab === 'POLL' && (
                        <div className="space-y-3 mb-6 pl-12">
                            {pollOptions.map((option, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Input
                                        type="text"
                                        value={option}
                                        onChange={(e) => handlePollOptionChange(index, e.target.value)}
                                        placeholder={`Opção ${index + 1}`}
                                        className="h-12 flex-1 rounded-xl border-gray-200 bg-gray-50 shadow-sm focus-visible:border-rose-300 focus-visible:ring-rose-500/25"
                                    />
                                    {pollOptions.length > 2 && (
                                        <Button onClick={() => handleRemovePollOption(index)} variant="ghost" size="icon-sm" className="text-gray-400 hover:text-red-500">
                                            <Icon name="close" className="w-5 h-5" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            {pollOptions.length < 4 && (
                                <Button
                                    onClick={handleAddPollOption}
                                    variant="ghost"
                                    className="mt-2 justify-start px-3 py-2 text-sm font-bold text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                                >
                                    <Icon name="plus" className="mr-2 h-4 w-4" /> Adicionar opção
                                </Button>
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
                                <Button onClick={() => setLinkType('NONE')} variant="ghost" className="h-8 rounded-md bg-red-50 px-2 py-1 text-xs font-black text-red-500 hover:bg-red-100 hover:text-red-600">Remover</Button>
                            )}
                        </div>
                        
                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                            <Button
                                onClick={() => setLinkType('MERCH')}
                                variant={linkType === 'MERCH' ? 'default' : 'outline'}
                                className={`rounded-full px-4 py-2 text-xs font-black whitespace-nowrap ${linkType === 'MERCH' ? 'shadow-md' : 'text-gray-500'}`}
                            >
                                🛍️ Produto
                            </Button>
                            <Button
                                onClick={() => setLinkType('TICKET')}
                                variant={linkType === 'TICKET' ? 'default' : 'outline'}
                                className={`rounded-full px-4 py-2 text-xs font-black whitespace-nowrap ${linkType === 'TICKET' ? 'shadow-md' : 'text-gray-500'}`}
                            >
                                🎟️ Ingresso
                            </Button>
                            <Button
                                onClick={() => setLinkType('FAN_AREA')}
                                variant={linkType === 'FAN_AREA' ? 'default' : 'outline'}
                                className={`rounded-full px-4 py-2 text-xs font-black whitespace-nowrap ${linkType === 'FAN_AREA' ? 'shadow-md' : 'text-gray-500'}`}
                            >
                                🏆 Área do Fã
                            </Button>
                        </div>

                        {/* Dynamic Link Inputs */}
                        {linkType !== 'NONE' && (
                            <div className="mt-4 bg-gray-50 p-4 rounded-xl space-y-3 animate-fade-in border border-gray-100">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Texto do Botão</label>
                                    <Input
                                        type="text" 
                                        value={linkButtonText}
                                        onChange={(e) => setLinkButtonText(e.target.value)}
                                        placeholder={linkType === 'MERCH' ? "Ex: Comprar Agora" : linkType === 'TICKET' ? "Ex: Garantir Ingresso" : "Ex: Ver Ranking"}
                                        className="h-11 rounded-lg border-gray-200 bg-white text-sm shadow-sm focus-visible:border-rose-300 focus-visible:ring-rose-500/25"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Destino</label>
                                    <Select
                                        value={selectedLinkId}
                                        onChange={(e) => setSelectedLinkId(e.target.value)}
                                        className="h-11 rounded-lg border-gray-200 bg-white text-sm shadow-sm focus-visible:border-rose-300 focus-visible:ring-rose-500/25"
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
                                    </Select>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Bar */}
                    <div className="flex justify-between items-center pt-2">
                        <div className="flex space-x-2">
                            {activeTab === 'POST' && (
                                <Button
                                    onClick={() => fileInputRef.current?.click()}
                                    variant="outline"
                                    size="icon-lg"
                                    className="rounded-full border-gray-100 bg-gray-50 text-rose-500 hover:bg-rose-50"
                                    title="Adicionar Mídia"
                                >
                                    <Icon name="camera" className="w-5 h-5" />
                                </Button>
                            )}
                        </div>
                        
                        <Button
                            onClick={handlePost}
                            disabled={!isPostValid() || isPosting}
                            className="rounded-full px-8 py-3 text-sm font-black shadow-lg shadow-rose-500/30 hover:-translate-y-0.5"
                        >
                            {isPosting ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span className="mr-2">Publicar</span>
                                    <Icon name="send" className="w-4 h-4" />
                                </>
                            )}
                        </Button>
                    </div>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageSelect} 
                        accept="image/*" 
                        className="hidden" 
                    />
                </div>
            </Card>
        </div>
    );
};

export default StudioView;
