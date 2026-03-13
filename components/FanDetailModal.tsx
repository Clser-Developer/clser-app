import React from 'react';
import { FanProfile } from '../types';
import Icon from './Icon';

interface FanDetailModalProps {
  fan: FanProfile | null;
  leaderboard: FanProfile[];
  onClose: () => void;
}

const StatCard: React.FC<{ icon: string; value: string; label: string }> = ({ icon, value, label }) => (
    <div className="bg-gray-900/50 p-3 rounded-lg text-center">
        <Icon name={icon} className="w-6 h-6 mx-auto text-orange-400 mb-2" />
        <p className="text-lg font-bold text-white">{value}</p>
        <p className="text-xs text-gray-400">{label}</p>
    </div>
);

const FanDetailModal: React.FC<FanDetailModalProps> = ({ fan, leaderboard, onClose }) => {
  if (!fan) return null;

  const rank = leaderboard.findIndex(f => f.id === fan.id) + 1;

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-gray-800 rounded-2xl w-full max-w-sm shadow-2xl border border-gray-700 animate-scale-in flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
          <h2 className="text-lg font-bold text-white">Detalhes do Fã</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-700">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>

        <div className="p-6">
          <div className="flex flex-col items-center text-center">
            <img
              src={fan.profileImageUrl}
              alt={fan.name}
              className={`w-24 h-24 rounded-full mb-4 border-4 object-cover shadow-lg ${fan.isCurrentUser ? 'border-magenta-500' : 'border-gray-600'}`}
            />
            <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-white">{fan.name}</h1>
                {fan.isCurrentUser && (
                    <span className="bg-orange-400 text-gray-900 text-xs font-bold px-2.5 py-1 rounded-full">VOCÊ</span>
                )}
            </div>
            <p className="text-sm font-semibold text-orange-300">{fan.level}</p>
            <p className="text-xs text-gray-400 mt-2">Membro há {fan.memberSince}</p>
          </div>

          <div className="border-t border-gray-700 my-6"></div>

          <div className="grid grid-cols-2 gap-4">
              <StatCard icon="users" value={fan.fanPoints.toLocaleString('pt-BR')} label="Fan Points" />
              <StatCard icon="chart-bar" value={`#${rank}`} label="Posição no Rank" />
              <StatCard icon="like" value={fan.stats.likes.toLocaleString('pt-BR')} label="Curtidas" />
              <StatCard icon="comment" value={fan.stats.comments.toLocaleString('pt-BR')} label="Comentários" />
              <StatCard icon="shopping-cart" value={fan.stats.storePurchases.toLocaleString('pt-BR')} label="Compras" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FanDetailModal;