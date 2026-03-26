
import React from 'react';
import { FanProfile } from '../types';
import Icon from './Icon';

interface FanDetailModalProps {
  fan: FanProfile | null;
  leaderboard: FanProfile[];
  onClose: () => void;
}

const StatCard: React.FC<{ icon: string; value: string; label: string }> = ({ icon, value, label }) => (
    <div className="bg-gray-50 p-4 rounded-3xl text-center border border-gray-100 shadow-sm group hover:bg-rose-50 transition-colors">
        <Icon name={icon} className="w-6 h-6 mx-auto text-rose-500 mb-2 group-hover:scale-110 transition-transform" />
        <p className="text-lg font-black text-gray-900">{value}</p>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
    </div>
);

const FanDetailModal: React.FC<FanDetailModalProps> = ({ fan, leaderboard, onClose }) => {
  if (!fan) return null;

  const rank = leaderboard.findIndex(f => f.id === fan.id) + 1;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-[2.5rem] w-full max-w-sm shadow-2xl border border-gray-100 animate-scale-in flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-5 border-b border-gray-50 flex justify-between items-center flex-shrink-0 bg-white">
          <h2 className="text-lg font-black text-gray-900 ml-2">Perfil do Fã</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 transition-colors">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>

        <div className="p-8 overflow-y-auto no-scrollbar">
          <div className="flex flex-col items-center text-center">
            <div className="relative group mb-4">
                <img
                    src={fan.profileImageUrl}
                    alt={fan.name}
                    className={`w-28 h-28 rounded-full border-4 object-cover shadow-xl transition-transform group-hover:scale-105 ${fan.isCurrentUser ? 'border-rose-500' : 'border-white'}`}
                />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg border-2 border-white uppercase tracking-widest">
                    #{rank}
                </div>
            </div>
            
            <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black text-gray-900">{fan.name}</h1>
                {fan.isCurrentUser && (
                    <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-1 rounded-lg shadow-sm">VOCÊ</span>
                )}
            </div>
            <p className="text-xs font-black text-rose-500 uppercase tracking-[0.2em] mt-1">{fan.level}</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-3">Membro há {fan.memberSince}</p>
          </div>

          <div className="h-px bg-gray-50 my-8"></div>

          <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                 <StatCard icon="users" value={fan.fanPoints.toLocaleString('pt-BR')} label="Total de Fan Points" />
              </div>
              <StatCard icon="like" value={fan.stats.likes.toLocaleString('pt-BR')} label="Curtidas" />
              <StatCard icon="comment" value={fan.stats.comments.toLocaleString('pt-BR')} label="Comentários" />
              <div className="col-span-2">
                <StatCard icon="shopping-cart" value={fan.stats.storePurchases.toLocaleString('pt-BR')} label="Compras no Clube" />
              </div>
          </div>
        </div>
        
        <footer className="p-6 bg-gray-50 border-t border-gray-100 flex-shrink-0 pb-10">
            <button onClick={onClose} className="w-full bg-gray-900 text-white font-black py-4 px-4 rounded-2xl hover:bg-black transition-all shadow-xl active:scale-95 uppercase tracking-widest text-xs">
                Fechar Perfil
            </button>
        </footer>
      </div>
    </div>
  );
};

export default FanDetailModal;
