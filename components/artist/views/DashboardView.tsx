
import React, { useState } from 'react';
import { Artist } from '../../../types';
import Icon from '../../Icon';

interface DashboardViewProps {
  artist: Artist;
}

const StatCard: React.FC<{ title: string; value: string; trend?: string; isPositive?: boolean; icon: string; color: string; bgColor: string }> = ({ title, value, trend, isPositive, icon, color, bgColor }) => (
  <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-full relative overflow-hidden group hover:shadow-md transition-shadow">
    <div className={`absolute right-[-10px] top-[-10px] opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
        <Icon name={icon} className="w-24 h-24" />
    </div>
    <div className="flex items-center justify-between mb-3 relative z-10">
      <div className={`p-2 rounded-xl ${bgColor}`}>
        <Icon name={icon} className={`w-5 h-5 ${color.replace('text-', 'text-')}`} />
      </div>
      {trend && (
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {isPositive ? '+' : ''}{trend}
            </span>
        )}
    </div>
    <div className="relative z-10">
        <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">{title}</span>
        <span className="text-2xl font-black text-gray-900 block mt-1">{value}</span>
    </div>
  </div>
);

const ActivityBar: React.FC<{ height: string; day: string; active?: boolean }> = ({ height, day, active }) => (
    <div className="flex flex-col items-center flex-1 gap-2 group cursor-pointer">
        <div className="relative w-full bg-gray-100 rounded-md h-32 flex items-end overflow-hidden">
            <div 
                className={`w-full rounded-t-md transition-all duration-500 ease-out ${active ? 'bg-rose-500 shadow-lg shadow-rose-500/30' : 'bg-gray-300 group-hover:bg-gray-400'}`} 
                style={{ height: height }}
            ></div>
        </div>
        <span className={`text-xs font-bold ${active ? 'text-rose-500' : 'text-gray-400'}`}>{day}</span>
    </div>
);

const LiveActivityItem: React.FC<{ type: 'sale' | 'card' | 'like'; text: string; time: string; value?: string }> = ({ type, text, time, value }) => {
    let iconName = '';
    let iconColor = '';
    let bgColor = '';

    switch(type) {
        case 'sale':
            iconName = 'shopping-cart';
            iconColor = 'text-green-600';
            bgColor = 'bg-green-100';
            break;
        case 'card':
            iconName = 'credit-card';
            iconColor = 'text-purple-600';
            bgColor = 'bg-purple-100';
            break;
        case 'like':
            iconName = 'like';
            iconColor = 'text-rose-600';
            bgColor = 'bg-rose-100';
            break;
    }

    return (
        <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors border-b border-gray-50 last:border-0 group">
            <div className="flex items-center space-x-3 overflow-hidden">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${bgColor} group-hover:scale-110 transition-transform`}>
                    <Icon name={iconName} className={`w-5 h-5 ${iconColor}`} />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-900 truncate">{text}</p>
                    <p className="text-xs text-gray-500 font-medium">{time}</p>
                </div>
            </div>
            {value && (
                <span className="text-sm font-bold text-gray-900 ml-2 whitespace-nowrap bg-gray-100 px-2 py-1 rounded-lg">{value}</span>
            )}
        </div>
    );
};

const DashboardView: React.FC<DashboardViewProps> = ({ artist }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'total'>('7d');

  return (
    <div className="p-4 animate-fade-in pb-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-black text-gray-900">Visão Geral</h2>
            <p className="text-gray-500 text-sm font-medium">Bom dia, {artist.name.split(' ')[0]}!</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center relative hover:bg-gray-50 cursor-pointer transition-colors">
            <Icon name="chat-alt" className="w-5 h-5 text-gray-500" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-rose-500 border-2 border-white rounded-full"></span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
            <StatCard 
                title="Vendas Totais" 
                value="R$ 24.590,00" 
                trend="15%" 
                isPositive={true} 
                icon="currency-dollar"
                color="text-green-600"
                bgColor="bg-green-100"
            />
        </div>
        <StatCard 
            title="Novos Fãs" 
            value="15.2k" 
            trend="8%" 
            isPositive={true} 
            icon="users"
            color="text-blue-600"
            bgColor="bg-blue-100"
        />
        <StatCard 
            title="Cartões Ativos" 
            value="482" 
            trend="12%" 
            isPositive={true} 
            icon="credit-card"
            color="text-purple-600"
            bgColor="bg-purple-100"
        />
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900 text-lg">Performance</h3>
            <div className="flex bg-gray-100 rounded-lg p-1">
                {['7d', '30d', 'total'].map((t) => (
                    <button 
                        key={t}
                        onClick={() => setTimeRange(t as any)}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all shadow-sm ${timeRange === t ? 'bg-white text-gray-900' : 'text-gray-500 hover:text-gray-700 bg-transparent shadow-none'}`}
                    >
                        {t.toUpperCase()}
                    </button>
                ))}
            </div>
        </div>
        <div className="flex items-end justify-between gap-2 h-40">
            <ActivityBar height="40%" day="SEG" />
            <ActivityBar height="65%" day="TER" />
            <ActivityBar height="30%" day="QUA" />
            <ActivityBar height="85%" day="QUI" />
            <ActivityBar height="55%" day="SEX" />
            <ActivityBar height="90%" day="SAB" active />
            <ActivityBar height="70%" day="DOM" />
        </div>
      </div>

      {/* Live Feed */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Ao Vivo
        </h3>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-2">
            <LiveActivityItem type="sale" text="Camiseta Tour 2025 vendida" time="Há 2 min" value="+ R$ 89,90" />
            <LiveActivityItem type="card" text="Novo Cartão Solicitado: Mariana S." time="Há 5 min" value="+ Anuidade" />
            <LiveActivityItem type="like" text="150 curtidas no post 'Bastidores'" time="Há 12 min" />
            <LiveActivityItem type="sale" text="Ingresso Pista Premium vendido" time="Há 24 min" value="+ R$ 300,00" />
            <LiveActivityItem type="card" text="Novo Cartão Solicitado: João P." time="Há 45 min" value="+ Anuidade" />
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
