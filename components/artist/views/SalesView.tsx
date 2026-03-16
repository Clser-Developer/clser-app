
import React, { useState, useMemo } from 'react';
import { Artist, Order, MerchItem, OrderStatus } from '../../../types';
import Icon from '../../Icon';
import OrderDetailModal from '../OrderDetailModal';
import AddProductModal from '../AddProductModal';

interface SalesViewProps {
  artist: Artist;
  orders: Order[];
  merch: MerchItem[];
  onUpdateOrder: (updatedOrder: Order) => void;
  onAddProduct: (product: MerchItem) => void;
}

type Tab = 'OVERVIEW' | 'ORDERS' | 'CATALOG';

const SalesView: React.FC<SalesViewProps> = ({ artist, orders, merch, onUpdateOrder, onAddProduct }) => {
  const [activeTab, setActiveTab] = useState<Tab>('OVERVIEW');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isAddProductModalVisible, setIsAddProductModalVisible] = useState(false);
  const [orderFilter, setOrderFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');

  // --- Calculations ---
  const totalRevenue = useMemo(() => orders.reduce((acc, order) => acc + order.total, 0), [orders]);
  const totalOrders = orders.length;
  const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
        if (orderFilter === 'ALL') return true;
        if (orderFilter === 'PENDING') return order.status === OrderStatus.PROCESSING;
        if (orderFilter === 'COMPLETED') return order.status !== OrderStatus.PROCESSING;
        return true;
    });
  }, [orders, orderFilter]);

  // --- Render Functions ---

  const renderOverview = () => (
    <div className="space-y-4 animate-fade-in">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm col-span-2">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Receita Total</span>
                    <Icon name="currency-dollar" className="w-5 h-5 text-green-500" />
                </div>
                <span className="text-3xl font-black text-gray-900 block">R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Pedidos</span>
                    <Icon name="shopping-cart" className="w-5 h-5 text-orange-500" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{totalOrders}</span>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Ticket Médio</span>
                    <Icon name="chart-bar" className="w-5 h-5 text-purple-500" />
                </div>
                <span className="text-2xl font-bold text-gray-900">R$ {averageTicket.toFixed(0)}</span>
            </div>
        </div>

        {/* Simple Chart Visualization */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mt-4">
            <h3 className="font-bold text-gray-900 mb-6 text-lg">Vendas da Semana</h3>
            <div className="flex items-end justify-between gap-2 h-40 px-2">
                {[40, 65, 30, 85, 55, 90, 70].map((h, i) => (
                    <div key={i} className="flex flex-col items-center flex-1 gap-3">
                        <div className="w-full bg-gray-100 rounded-t-md h-full flex items-end">
                            <div 
                                className={`w-full rounded-t-md transition-all duration-500 ${i === 5 ? 'bg-green-500 shadow-lg shadow-green-500/20' : 'bg-gray-300'}`} 
                                style={{ height: `${h}%` }}
                            ></div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400">{['S','T','Q','Q','S','S','D'][i]}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );

  const renderOrders = () => (
    <div className="animate-fade-in h-full flex flex-col">
        {/* Filters */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-1 no-scrollbar">
            <button 
                onClick={() => setOrderFilter('ALL')}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${orderFilter === 'ALL' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
            >
                Todos
            </button>
            <button 
                onClick={() => setOrderFilter('PENDING')}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 border ${orderFilter === 'PENDING' ? 'bg-yellow-100 text-yellow-700 border-yellow-100' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
            >
                <div className={`w-2 h-2 rounded-full ${orderFilter === 'PENDING' ? 'bg-yellow-500' : 'bg-yellow-400'}`}></div>
                Pendentes
            </button>
            <button 
                onClick={() => setOrderFilter('COMPLETED')}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 border ${orderFilter === 'COMPLETED' ? 'bg-green-100 text-green-700 border-green-100' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
            >
                <div className={`w-2 h-2 rounded-full ${orderFilter === 'COMPLETED' ? 'bg-green-500' : 'bg-green-400'}`}></div>
                Enviados
            </button>
        </div>

        {/* List */}
        <div className="space-y-3 flex-1 overflow-y-auto pb-20">
            {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                    <button 
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className="w-full bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-rose-200 transition-all text-left group relative overflow-hidden"
                    >
                        {order.status === OrderStatus.PROCESSING && (
                            <div className="absolute top-0 right-0 w-3 h-3 bg-yellow-400 rounded-bl-lg shadow-sm"></div>
                        )}
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <p className="font-bold text-gray-900 text-sm">#{order.id}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{order.date}</p>
                            </div>
                            <p className="font-bold text-green-600 text-sm bg-green-50 px-2 py-1 rounded-lg">R$ {order.total.toFixed(2).replace('.', ',')}</p>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                            <div className="flex items-center space-x-3">
                                <div className="flex -space-x-3">
                                    {order.items.slice(0,3).map((item, idx) => (
                                        <img key={idx} src={item.imageUrls[0]} className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm" alt="" />
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 font-medium">{order.items.length} item(s)</p>
                            </div>
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                                order.status === OrderStatus.PROCESSING ? 'bg-yellow-100 text-yellow-700' : 
                                order.status === OrderStatus.SHIPPED ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                            }`}>
                                {order.status === OrderStatus.PROCESSING ? 'Pendente' : 
                                 order.status === OrderStatus.SHIPPED ? 'Enviado' : 'Entregue'}
                            </span>
                        </div>
                    </button>
                ))
            ) : (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon name="box" className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-medium">Nenhum pedido encontrado.</p>
                </div>
            )}
        </div>
    </div>
  );

  const renderCatalog = () => (
    <div className="animate-fade-in h-full relative">
        <div className="grid grid-cols-2 gap-4 pb-24">
            {/* Add New Card */}
            <button 
                onClick={() => setIsAddProductModalVisible(true)}
                className="aspect-[4/5] bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-rose-400 hover:text-rose-500 hover:bg-rose-50 transition-all group"
            >
                <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Icon name="plus" className="w-6 h-6" />
                </div>
                <span className="font-bold text-sm">Adicionar Produto</span>
            </button>

            {merch.map(item => (
                <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col relative group hover:shadow-md transition-shadow">
                    <div className="relative aspect-square">
                        <img src={item.imageUrls[0]} alt={item.name} className="w-full h-full object-cover" />
                        {item.isOnSale && (
                            <span className="absolute top-2 right-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                PROMO
                            </span>
                        )}
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                        <h4 className="font-bold text-gray-900 text-sm line-clamp-2 mb-2">{item.name}</h4>
                        <div className="mt-auto flex items-center justify-between">
                            <p className="text-gray-900 font-black text-sm">R$ {item.price.toFixed(0)}</p>
                            <button className="text-gray-400 hover:text-rose-500 p-1">
                                <Icon name="pencil" className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );

  return (
    <div className="p-4 h-full flex flex-col">
      <header className="mb-6 flex justify-between items-end">
        <div>
            <h2 className="text-3xl font-black text-gray-900">Vendas</h2>
            <p className="text-gray-500">Gerencie sua loja e pedidos.</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex bg-white p-1.5 rounded-xl mb-6 shrink-0 border border-gray-100 shadow-sm">
        <button 
            onClick={() => setActiveTab('OVERVIEW')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'OVERVIEW' ? 'bg-gray-100 text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
        >
            Visão Geral
        </button>
        <button 
            onClick={() => setActiveTab('ORDERS')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'ORDERS' ? 'bg-gray-100 text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
        >
            Pedidos
        </button>
        <button 
            onClick={() => setActiveTab('CATALOG')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'CATALOG' ? 'bg-gray-100 text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
        >
            Catálogo
        </button>
      </div>

      <div className="flex-1 min-h-0">
        {activeTab === 'OVERVIEW' && renderOverview()}
        {activeTab === 'ORDERS' && renderOrders()}
        {activeTab === 'CATALOG' && renderCatalog()}
      </div>

      <OrderDetailModal 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
        onUpdateStatus={onUpdateOrder}
      />

      <AddProductModal
        isVisible={isAddProductModalVisible}
        onClose={() => setIsAddProductModalVisible(false)}
        onSave={onAddProduct}
        artistId={artist.id}
      />
    </div>
  );
};

export default SalesView;
