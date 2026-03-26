
import React from 'react';
import { VaquinhaCampaign } from '../types';
import Icon from './Icon';

interface VaquinhaCardProps {
  campaign: VaquinhaCampaign;
  onSelect: () => void;
  userDonation?: number;
}

const ProgressBar: React.FC<{ current: number; goal: number }> = ({ current, goal }) => {
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  return (
    <div className="w-full bg-gray-100 rounded-full h-2">
      <div
        className="bg-gradient-to-r from-rose-500 to-purple-500 h-2 rounded-full transition-all duration-500"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

const VaquinhaCard: React.FC<VaquinhaCardProps> = ({ campaign, onSelect, userDonation }) => {
  return (
    <button
      onClick={onSelect}
      className="bg-white rounded-3xl overflow-hidden border border-gray-100 group w-full text-left focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm hover:shadow-md transition-all"
    >
      <div className="relative aspect-video">
          <img
            src={campaign.imageUrl}
            alt={campaign.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-5">
            <h3 className="text-xl font-black text-white drop-shadow-md">{campaign.title}</h3>
        </div>
      </div>
      <div className="p-5">
        <ProgressBar current={campaign.currentAmount} goal={campaign.goalAmount} />
        <div className="flex justify-between items-baseline mt-4">
            <div className="text-gray-900">
                <span className="font-black text-xl">R$ {campaign.currentAmount.toLocaleString('pt-BR')}</span>
                <span className="text-gray-400 text-xs font-bold ml-1">alcançados</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-400 text-xs font-bold uppercase tracking-tighter">
                <Icon name="users" className="w-4 h-4 text-rose-500" />
                <span>{campaign.supporterCount} apoiadores</span>
            </div>
        </div>
      </div>
      {userDonation && userDonation > 0 && (
          <div className="bg-green-50 text-green-600 text-xs font-black py-3 px-5 text-center border-t border-green-100 flex items-center justify-center space-x-2">
            <Icon name="check-circle" className="w-4 h-4" />
            <span>Você doou R$ {userDonation.toFixed(2).replace('.', ',')}!</span>
          </div>
      )}
    </button>
  );
};

export default VaquinhaCard;
