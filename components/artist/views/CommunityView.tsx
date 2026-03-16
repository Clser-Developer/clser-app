
import React, { useState } from 'react';
import { Artist, FanGroup, FanProfile, Event } from '../../../types';
import Icon from '../../Icon';
import CreateGroupModal from '../CreateGroupModal';
import CreateCampaignModal from '../CreateCampaignModal';
import ManageGroupModal from '../ManageGroupModal';
import Toast from '../../Toast';

interface CommunityViewProps {
  artist: Artist;
  fanGroups: FanGroup[];
  leaderboard: FanProfile[];
  availableEvents: Event[];
  onCreateGroup: (groupData: any) => void;
  onUpdateGroup: (updatedGroup: FanGroup) => void;
}

type Tab = 'GROUPS' | 'RANKING' | 'INTERACTIONS' | 'CAMPAIGNS';

const CommunityView: React.FC<CommunityViewProps> = ({ artist, fanGroups, leaderboard, availableEvents, onCreateGroup, onUpdateGroup }) => {
  const [activeTab, setActiveTab] = useState<Tab>('GROUPS');
  const [isCreateGroupModalVisible, setIsCreateGroupModalVisible] = useState(false);
  const [isCreateCampaignModalVisible, setIsCreateCampaignModalVisible] = useState(false);
  const [selectedGroupForManagement, setSelectedGroupForManagement] = useState<FanGroup | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [campaigns, setCampaigns] = useState([
      { id: 1, type: 'PUSH', message: 'Aviso: Ingressos esgotando para SP!', sent: 4500, date: 'Ontem', cost: 450.00, status: 'Enviado' },
      { id: 2, type: 'EMAIL', message: 'Newsletter Mensal - Novidades', sent: 12000, date: '3 dias atrás', cost: 600.00, status: 'Enviado' },
  ]);

  const handleCreateCampaign = (newCampaign: any) => {
      const campaignEntry = {
          id: Date.now(),
          type: newCampaign.channel,
          message: newCampaign.message,
          sent: newCampaign.reach,
          date: 'Hoje',
          cost: newCampaign.cost,
          status: 'Processando'
      };
      setCampaigns(prev => [campaignEntry, ...prev]);
      setToastMessage('Campanha criada! Enviando mensagens...');
  };

  const handleUpdateGroup = (updatedGroup: FanGroup) => {
      onUpdateGroup(updatedGroup);
      setToastMessage('Grupo atualizado com sucesso!');
  };

  const renderGroups = () => (
    <div className="space-y-4 animate-fade-in">
        <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6 flex items-center justify-between">
            <div>
                <h3 className="font-black text-gray-900 text-lg">Criar Novo Grupo</h3>
                <p className="text-xs text-gray-500 mt-1 font-medium">Oficialize comunidades para seus fãs.</p>
            </div>
            <button 
                onClick={() => setIsCreateGroupModalVisible(true)}
                className="bg-rose-500 hover:bg-rose-600 text-white p-3 rounded-2xl transition-colors shadow-lg shadow-rose-500/20"
            >
                <Icon name="plus" className="w-6 h-6" />
            </button>
        </div>

        {fanGroups.length > 0 ? (
            fanGroups.map(group => (
                <div key={group.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm group hover:shadow-md transition-all">
                    <div className="h-36 relative">
                        <img src={group.coverImageUrl} alt={group.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        <div className="absolute bottom-4 left-5 text-white">
                            <h4 className="font-black text-xl drop-shadow-md">{group.name}</h4>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-90">{group.memberCount} membros • {group.eventName || 'Geral'}</p>
                        </div>
                    </div>
                    <div className="p-5 flex justify-between items-center bg-white border-t border-gray-50">
                        <div className="flex -space-x-3">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                                     <Icon name="profile" className="w-5 h-5 text-gray-300" />
                                </div>
                            ))}
                        </div>
                        <button 
                            onClick={() => setSelectedGroupForManagement(group)}
                            className="text-xs font-black text-rose-500 hover:text-rose-600 px-5 py-2.5 rounded-2xl border-2 border-rose-50 hover:bg-rose-50 transition-colors uppercase tracking-widest"
                        >
                            Gerenciar
                        </button>
                    </div>
                </div>
            ))
        ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <Icon name="user-group" className="w-12 h-12 mx-auto text-gray-100 mb-3" />
                <p className="text-gray-400 font-bold">Nenhum grupo oficial criado.</p>
            </div>
        )}
    </div>
  );

  const renderRanking = () => (
    <div className="animate-fade-in space-y-4">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-3xl shadow-xl mb-4 relative overflow-hidden text-white">
            <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-white/10 blur-2xl rounded-full"></div>
            <h3 className="font-black text-xl italic tracking-tight">Top 10 Engajamento</h3>
            <p className="text-xs text-white/60 mt-1 font-medium uppercase tracking-widest">Fãs mais fiéis do mês</p>
        </div>
        
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-2">
            {leaderboard.slice(0, 10).map((fan, index) => {
                let rankColor = 'text-gray-300';
                let bgClass = 'bg-white';
                
                if (index === 0) rankColor = 'text-yellow-500';
                if (index === 1) rankColor = 'text-gray-400';
                if (index === 2) rankColor = 'text-orange-500';

                return (
                    <div key={fan.id} className={`${bgClass} p-4 rounded-2xl flex items-center space-x-4 border border-transparent hover:bg-gray-50 transition-colors`}>
                        <span className={`font-black text-2xl w-8 text-center ${rankColor}`}>#{index + 1}</span>
                        <img src={fan.profileImageUrl} alt={fan.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                        <div className="flex-1">
                            <p className="font-black text-gray-900 text-sm">{fan.name}</p>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">{fan.level}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-black text-gray-900 text-sm">{fan.fanPoints.toLocaleString('pt-BR')}</p>
                            <p className="text-[9px] text-rose-500 font-black uppercase tracking-tighter">Pts</p>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );

  const renderInteractions = () => (
      <div className="animate-fade-in space-y-4">
          {[
              { user: 'Mariana S.', text: 'Amei o último show em SP! Quando volta?', time: 'Há 10 min', post: 'Show São Paulo' },
              { user: 'João Pedro', text: 'Essa camiseta nova tá animal 🔥', time: 'Há 45 min', post: 'Merch Drop' },
              { user: 'Ana Clara', text: 'Votação da setlist foi difícil hein...', time: 'Há 1h', post: 'Enquete Setlist' }
          ].map((comment, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center font-black text-rose-500 text-xs border border-rose-100">{comment.user.charAt(0)}</div>
                          <div>
                            <span className="font-black text-gray-900 text-sm block">{comment.user}</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{comment.time}</span>
                          </div>
                      </div>
                      <button className="text-gray-300 hover:text-rose-500 p-1 transition-colors"><Icon name="menu" className="w-5 h-5 rotate-90" /></button>
                  </div>
                  <p className="text-gray-700 text-sm font-medium leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-50 italic">"{comment.text}"</p>
                  <div className="flex items-center justify-between mt-5 pt-3 border-t border-gray-50">
                      <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Em: {comment.post}</span>
                      <div className="flex space-x-4">
                          <button className="flex items-center space-x-1 text-gray-400 hover:text-rose-500 font-bold text-xs"><Icon name="like" className="w-4 h-4" /> <span>Responder</span></button>
                      </div>
                  </div>
              </div>
          ))}
      </div>
  );

  const renderCampaigns = () => (
      <div className="animate-fade-in space-y-6">
          <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-[2rem] p-7 flex items-center justify-between shadow-xl shadow-rose-500/20 text-white relative overflow-hidden">
              <div className="absolute right-[-20px] top-[-20px] w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                  <h3 className="font-black text-2xl leading-tight">Impulsionar<br/>Comunidade</h3>
                  <p className="text-xs text-rose-100 mt-2 font-bold uppercase tracking-widest opacity-80">Push • SMS • E-mail</p>
              </div>
              <button 
                  onClick={() => setIsCreateCampaignModalVisible(true)}
                  className="bg-white text-rose-500 p-4 rounded-2xl hover:bg-rose-50 transition-all shadow-xl shadow-black/10 active:scale-95"
              >
                  <Icon name="send" className="w-7 h-7 ml-1" />
              </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Disparos Recentes</h3>
            {campaigns.map(campaign => (
                <div key={campaign.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-2">
                            <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-wider ${
                                campaign.type === 'PUSH' ? 'bg-rose-50 text-rose-600' : 
                                campaign.type === 'SMS' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                            }`}>
                                {campaign.type}
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{campaign.date}</span>
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-wider ${campaign.status === 'Enviado' ? 'text-green-500' : 'text-yellow-500'}`}>{campaign.status}</span>
                    </div>
                    <p className="text-gray-800 font-bold text-sm mb-4 line-clamp-2 leading-relaxed italic">"{campaign.message}"</p>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <span>Alcance: <strong className="text-gray-900">{campaign.sent.toLocaleString()} fãs</strong></span>
                        <span>Custo: <strong className="text-rose-500">R$ {campaign.cost.toFixed(2)}</strong></span>
                    </div>
                </div>
            ))}
          </div>
      </div>
  );

  return (
    <div className="p-4 pb-24 h-full flex flex-col">
      <header className="mb-6">
        <h2 className="text-3xl font-black text-gray-900">Comunidade</h2>
        <p className="text-gray-500 font-medium">Gerencie sua base de superfãs.</p>
      </header>

      {/* Nav Tabs */}
      <div className="flex space-x-2 mb-8 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
        {(['GROUPS', 'RANKING', 'INTERACTIONS', 'CAMPAIGNS'] as Tab[]).map((tab) => (
            <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${activeTab === tab ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-gray-400 hover:text-gray-600'}`}
            >
                {tab === 'GROUPS' ? 'Grupos' : tab === 'RANKING' ? 'Rank' : tab === 'INTERACTIONS' ? 'Bate-papo' : 'Mensagens'}
            </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {activeTab === 'GROUPS' && renderGroups()}
        {activeTab === 'RANKING' && renderRanking()}
        {activeTab === 'INTERACTIONS' && renderInteractions()}
        {activeTab === 'CAMPAIGNS' && renderCampaigns()}
      </div>

      <CreateGroupModal 
        isVisible={isCreateGroupModalVisible}
        onClose={() => setIsCreateGroupModalVisible(false)}
        onCreate={onCreateGroup}
        availableEvents={availableEvents}
      />

      <ManageGroupModal
        isVisible={!!selectedGroupForManagement}
        onClose={() => setSelectedGroupForManagement(null)}
        group={selectedGroupForManagement}
        onUpdate={handleUpdateGroup}
      />

      <CreateCampaignModal
        isVisible={isCreateCampaignModalVisible}
        onClose={() => setIsCreateCampaignModalVisible(false)}
        onSend={handleCreateCampaign}
      />

      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
    </div>
  );
};

export default CommunityView;
