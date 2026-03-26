
import React, { useState } from 'react';
import { Order, OrderStatus, TrackingEvent } from '../../types';
import Icon from '../Icon';

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (updatedOrder: Order) => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose, onUpdateStatus }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!order) return null;

  const handleShipOrder = () => {
    setIsProcessing(true);
    
    // Simulate API delay
    setTimeout(() => {
        const newTrackingEvent: TrackingEvent = {
            date: 'Agora mesmo',
            status: 'Objeto postado',
            location: 'Centro de Distribuição, São Paulo - SP'
        };

        const updatedOrder: Order = {
            ...order,
            status: OrderStatus.SHIPPED,
            trackingCode: `BR${Math.floor(Math.random() * 100000000)}SP`,
            trackingHistory: [newTrackingEvent, ...(order.trackingHistory || [])]
        };

        onUpdateStatus(updatedOrder);
        setIsProcessing(false);
        onClose();
    }, 1500);
  };

  const isPending = order.status === OrderStatus.PROCESSING;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-end justify-center" aria-modal="true" role="dialog">
      <div className="bg-white rounded-t-3xl w-full max-w-md shadow-2xl border-t border-gray-100 animate-slide-up flex flex-col max-h-[90vh]">
        <header className="p-4 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
            <div>
                <h2 className="text-lg font-bold text-gray-900">Pedido #{order.id}</h2>
                <p className="text-xs text-gray-500 font-medium">{order.date}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100">
                <Icon name="close" className="w-6 h-6" />
            </button>
        </header>

        <main className="p-6 overflow-y-auto space-y-6">
            {/* Customer Info (Simulated) */}
            <div className="bg-gray-50 p-4 rounded-2xl flex items-center space-x-4 border border-gray-100 shadow-sm">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                    <Icon name="profile" className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-900">Cliente Fã</p>
                    <p className="text-xs text-gray-500">Rua dos Fãs, 123 - São Paulo, SP</p>
                </div>
            </div>

            {/* Items */}
            <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase mb-3 tracking-wide">Itens do Pedido</h3>
                <div className="space-y-3">
                    {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-3 bg-white border border-gray-100 p-2 rounded-xl shadow-sm">
                            <img src={item.imageUrls[0]} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                                <div className="flex text-xs text-gray-500 space-x-2">
                                    <span>Qtd: {item.quantity}</span>
                                    {item.selectedSize && <span>Tam: {item.selectedSize}</span>}
                                </div>
                            </div>
                            <p className="text-sm font-bold text-gray-900">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Totals */}
            <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span>R$ {(order.total - order.shippingCost).toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                    <span>Frete</span>
                    <span>R$ {order.shippingCost.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-lg font-black text-gray-900 pt-2">
                    <span>Total</span>
                    <span className="text-green-600">R$ {order.total.toFixed(2).replace('.', ',')}</span>
                </div>
            </div>
        </main>

        <footer className="p-4 bg-white border-t border-gray-100 pb-8">
            {isPending ? (
                <button 
                    onClick={handleShipOrder}
                    disabled={isProcessing}
                    className="w-full bg-rose-500 text-white font-bold py-4 px-4 rounded-2xl hover:bg-rose-600 transition-all flex items-center justify-center space-x-2 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg shadow-rose-500/20"
                >
                    {isProcessing ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <Icon name="truck" className="w-5 h-5" />
                            <span>Marcar como Enviado</span>
                        </>
                    )}
                </button>
            ) : (
                <div className="w-full bg-green-50 border border-green-200 text-green-600 font-bold py-4 px-4 rounded-2xl flex items-center justify-center space-x-2">
                    <Icon name="check-circle" className="w-5 h-5" />
                    <span>Pedido Enviado</span>
                </div>
            )}
        </footer>
      </div>
    </div>
  );
};

export default OrderDetailModal;
