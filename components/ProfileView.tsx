import React, { useState } from 'react';
import { Artist, FanProfile, ExclusiveReward, RewardType, PlanType, Plan } from '../types';
import { getFanLevel, calculateLevelProgress } from '../services/gamificationService';
import Icon from './Icon';
import RewardCard from './RewardCard';
import PlanCard from './PlanCard';

interface ProfileViewProps {
  artist: Artist;
  onEditAddress: () => void;
  onEditPaymentMethod: () => void;
  onOpenPaymentHistory: () => void;
  onLogout: () => void;
}

const SettingsItem: React.FC<{ icon: string; title: string; subtitle?: string; onClick: () => void; }> = ({ icon, title, subtitle, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center text-left p-4 hover:bg-gray-700/50 transition-colors rounded-lg">
    <Icon name={icon} className="w-6 h-6 text-orange-400 mr-4 flex-shrink-0" />
    <div className="flex-1">
      <p className="font-semibold text-white">{title}</p>
      {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
    </div>
    <Icon name="chevron-right" className="w-5 h-5 text-gray-500" />
  </button>
);

const ProfileSummary: React.FC = () => {
    const [nickname, setNickname] = useState('Fã nº 1');
    const [isEditing, setIsEditing] = useState(false);

    const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(e.target.value);
    };

    const handleFinishEditing = () => {
        setIsEditing(false);
        // Here you would typically save the nickname
    };

    return (
        <div className="flex flex-col items-center text-center p-6">
            <img
              src="https://picsum.photos/seed/user-profile/200/200"
              alt="User profile"
              className="w-28 h-28 rounded-full mb-4 border-4 border-magenta-500 object-cover shadow-lg"
            />
            {isEditing ? (
                <input
                    type="text"
                    value={nickname}
                    onChange={handleNicknameChange}
                    onBlur={handleFinishEditing}
                    onKeyDown={(e) => e.key === 'Enter' && handleFinishEditing()}
                    autoFocus
                    className="bg-gray-700 border border-gray-600 rounded-md p-1 text-center text-2xl font-bold text-white focus:ring-magenta-500 focus:border-magenta-500 w-48"
                />
            ) : (
                <div className="flex items-center space-x-2 group">
                    <h1 className="text-2xl font-bold text-white">{nickname}</h1>
                     <button onClick={() => setIsEditing(true)} aria-label="Editar apelido" className="opacity-50 group-hover:opacity-100 transition-opacity">
                        <Icon name="pencil" className="w-5 h-5 text-gray-400 hover:text-white" />
                    </button>
                </div>
            )}
            <p className="text-sm text-gray-400">Membro desde Nov 2023</p>
        </div>
    );
};


const ProfileView: React.FC<ProfileViewProps> = ({ artist, onEditAddress, onEditPaymentMethod, onOpenPaymentHistory, onLogout }) => {
  
  const [expandedPlan, setExpandedPlan] = useState<PlanType | null>(null);
  const handleUnimplemented = () => alert("Funcionalidade em desenvolvimento.");

  const currentPlan = artist.plans.find(p => p.type === PlanType.FULL_ACCESS) || artist.plans[0];
  const otherPlans = artist.plans.filter(p => p.type !== currentPlan.type);

  const handleTogglePlan = (planType: PlanType) => {
    setExpandedPlan(prev => (prev === planType ? null : planType));
  };


  return (
    <div className="text-white space-y-6 pb-6">
      <ProfileSummary />
      
      <div className="px-4 space-y-6">
        <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-2 px-2">Minha Conta</h3>
             <SettingsItem icon="truck" title="Endereço de Entrega" subtitle="Rua dos Fãs, 123..." onClick={onEditAddress} />
             <SettingsItem icon="credit-card" title="Métodos de Pagamento" subtitle="Mastercard **** 1234" onClick={onEditPaymentMethod} />
        </div>

        <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4 px-2">Minha Assinatura</h3>
            <div className="bg-gradient-to-br from-magenta-500/20 to-gray-800/20 p-4 rounded-lg border border-magenta-500/50 mb-4">
                <p className="text-sm text-gray-400">Seu plano atual com {artist.name}</p>
                <p className="text-xl font-bold text-white">{currentPlan.type}</p>
                <p className="text-md text-gray-300">R$ {currentPlan.price.toFixed(2).replace('.',',')} / mês</p>
            </div>
            <SettingsItem icon="document-text" title="Histórico de Pagamentos" subtitle="Ver faturas e cobranças" onClick={onOpenPaymentHistory} />
             {otherPlans.length > 0 && (
                <>
                    <h4 className="text-md font-semibold text-gray-300 mt-6 mb-2 px-2">Outros planos disponíveis</h4>
                     <div className="space-y-2">
                        {otherPlans.map(plan => {
                            const isUpgrade = plan.level > currentPlan.level;
                            const isExpanded = expandedPlan === plan.type;

                            const currentBenefits = new Set(currentPlan.benefits);
                            const newBenefits = plan.benefits.filter(b => !currentBenefits.has(b));
                            const lostBenefits = currentPlan.benefits.filter(b => !new Set(plan.benefits).has(b));

                            return (
                                <div key={plan.type} className="bg-gray-900/50 rounded-lg border border-gray-700 overflow-hidden">
                                    <button onClick={() => handleTogglePlan(plan.type)} className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-700/20 transition-colors">
                                        <div className="flex-1">
                                            <p className="font-bold text-white">{plan.type}</p>
                                            <p className="text-sm text-gray-400">R$ {plan.price.toFixed(2).replace('.',',')} / mês</p>
                                        </div>
                                         <span className={`text-xs font-bold px-2 py-1 rounded-full ${isUpgrade ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                                            {isUpgrade ? 'UPGRADE' : 'DOWNGRADE'}
                                        </span>
                                        <Icon name="chevron-down" className={`w-5 h-5 text-gray-400 transition-transform duration-300 ml-3 ${isExpanded ? 'transform rotate-180' : ''}`} />
                                    </button>
                                    <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[500px]' : 'max-h-0'}`}>
                                        <div className="px-4 pb-4 space-y-4">
                                            {isUpgrade && newBenefits.length > 0 && (
                                                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-sm">
                                                    <p className="font-bold text-green-300">Ao fazer o upgrade, você ganhará acesso a:</p>
                                                    <ul className="list-disc list-inside text-green-200/80 mt-1">
                                                        {newBenefits.map(b => <li key={b}>{b.replace('+ ', '')}</li>)}
                                                    </ul>
                                                </div>
                                            )}
                                            {!isUpgrade && lostBenefits.length > 0 && (
                                                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm">
                                                    <p className="font-bold text-red-300">Atenção: Ao fazer o downgrade, você perderá acesso a:</p>
                                                     <ul className="list-disc list-inside text-red-200/80 mt-1">
                                                        {lostBenefits.map(b => <li key={b}>{b.replace('+ ', '')}</li>)}
                                                    </ul>
                                                </div>
                                            )}
                                            <PlanCard plan={plan} onSubscribe={handleUnimplemented} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
             <button onClick={handleUnimplemented} className="w-full text-center text-sm text-red-400 hover:text-red-300 mt-4 p-2 rounded-lg hover:bg-red-500/10 transition-colors">
                Cancelar Assinatura
            </button>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-2 px-2">Legal</h3>
            <SettingsItem icon="document-text" title="Termos de Serviço" onClick={handleUnimplemented} />
            <SettingsItem icon="lock-closed" title="Política de Privacidade" onClick={handleUnimplemented} />
        </div>
        
        <button
            onClick={onLogout}
            className="w-full bg-gray-700/80 text-red-400 font-bold py-3 px-4 rounded-lg hover:bg-red-500/10 transition-colors flex items-center justify-center space-x-2"
        >
            <Icon name="logout" className="w-5 h-5" />
            <span>Sair da Conta</span>
        </button>

      </div>
    </div>
  );
};

export default ProfileView;