import React, { useMemo } from 'react';
import { Order, OrderStatus, PurchasedTicket } from '../types';
import Icon from './Icon';

interface MyPurchasesViewProps {
  orders: Order[];
  purchasedTickets: PurchasedTicket[];
  onViewOrderDetails: (order: Order) => void;
  onViewTicketDetails: (ticket: PurchasedTicket) => void;
}

const statusConfig = {
  [OrderStatus.PROCESSING]: { text: 'Processando', color: 'text-yellow-400' },
  [OrderStatus.SHIPPED]: { text: 'Enviado', color: 'text-blue-400' },
  [OrderStatus.DELIVERED]: { text: 'Entregue', color: 'text-green-400' },
};

const OrderStatusTracker: React.FC<{ status: OrderStatus }> = ({ status }) => {
    const statuses = [OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED];
    const currentIndex = statuses.indexOf(status);

    return (
        <div className="w-full mt-4">
            <div className="flex items-center -mx-1">
                {statuses.map((s, index) => (
                    <React.Fragment key={s}>
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-3 h-3 rounded-full transition-colors ${
                                    index <= currentIndex ? 'bg-orange-400' : 'bg-gray-600'
                                }`}
                            ></div>
                        </div>
                        {index < statuses.length - 1 && (
                            <div
                                className={`flex-1 h-0.5 transition-colors ${
                                    index < currentIndex ? 'bg-orange-400' : 'bg-gray-600'
                                }`}
                            ></div>
                        )}
                    </React.Fragment>
                ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span className={currentIndex >= 0 ? 'font-semibold text-white' : ''}>Processando</span>
                <span className={currentIndex >= 1 ? 'font-semibold text-white' : ''}>Enviado</span>
                <span className={currentIndex >= 2 ? 'font-semibold text-white' : ''}>Entregue</span>
            </div>
        </div>
    );
};


const OrderCard: React.FC<{ order: Order; onViewDetails: (order: Order) => void }> = ({ order, onViewDetails }) => {
  const statusInfo = statusConfig[order.status];

  return (
    <div 
      className="bg-gray-800 rounded-2xl border border-gray-700 p-4 w-full text-left"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-white">Pedido #{order.id}</h3>
          <p className="text-xs text-gray-400">Feito em {order.date}</p>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusInfo.color} bg-white/10`}>
          {statusInfo.text}
        </span>
      </div>
      
      <div className="border-t border-b border-gray-700 my-3 py-3 space-y-3">
        {order.items.map(item => (
          <div key={item.id} className="flex items-center space-x-3">
            <img src={item.imageUrls[0]} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{item.name}</p>
              <p className="text-xs text-gray-400">Qtd: {item.quantity}</p>
            </div>
            <p className="text-sm font-semibold text-white">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
          </div>
        ))}
      </div>

      <div className="text-xs text-gray-400 space-y-1 mb-4">
        <div className="flex justify-between"><span>Subtotal</span> <span className="text-gray-300">R$ {(order.total - order.shippingCost).toFixed(2).replace('.', ',')}</span></div>
        <div className="flex justify-between"><span>Frete</span> <span className="text-gray-300">R$ {order.shippingCost.toFixed(2).replace('.', ',')}</span></div>
        <div className="flex justify-between font-bold text-sm text-white mt-1"><span>Total</span> <span>R$ {order.total.toFixed(2).replace('.', ',')}</span></div>
      </div>
      
      <button 
        onClick={() => onViewDetails(order)}
        className="w-full bg-gray-700/80 text-white font-bold py-3 px-4 rounded-md hover:bg-gray-700 transition-colors text-sm"
      >
        Rastrear Pedido
      </button>

      <OrderStatusTracker status={order.status} />

    </div>
  );
};

const PurchasedTicketSummaryCard: React.FC<{ ticket: PurchasedTicket; onViewDetails: (ticket: PurchasedTicket) => void }> = ({ ticket, onViewDetails }) => {
  return (
    <div className="bg-gray-800 rounded-2xl border border-gray-700 p-4 w-full">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-white">Ingresso: {ticket.name}</h3>
          <p className="text-xs text-gray-400">Compra #{ticket.purchaseId}</p>
        </div>
        <span className="text-xs font-bold px-2 py-1 rounded-full text-green-300 bg-green-500/20">
          CONFIRMADO
        </span>
      </div>
      <div className="border-t border-gray-700 my-3 py-3 flex items-center space-x-3">
        <img src={ticket.imageUrl} alt={ticket.name} className="w-12 h-16 rounded-lg object-cover" />
        <div className="flex-1">
          <p className="text-sm font-medium text-white">{ticket.location}</p>
          <p className="text-sm text-orange-400 font-bold">{ticket.date}</p>
        </div>
      </div>
      <button
        onClick={() => onViewDetails(ticket)}
        className="w-full mt-2 bg-gray-700 text-white font-bold py-3 px-4 rounded-md hover:bg-gray-600 transition-colors text-sm"
      >
        Ver Ingresso (QR Code)
      </button>
    </div>
  );
};


const MyPurchasesView: React.FC<MyPurchasesViewProps> = ({ orders, purchasedTickets, onViewOrderDetails, onViewTicketDetails }) => {
  
  const combinedItems = useMemo(() => {
    const orderItems = orders.map(o => ({ type: 'order' as const, data: o, id: o.id }));
    const ticketItems = purchasedTickets.map(t => ({ type: 'ticket' as const, data: t, id: t.purchaseId }));
    // Simple combination without sorting due to inconsistent date formats in mock data
    return [...orderItems, ...ticketItems];
  }, [orders, purchasedTickets]);

  if (combinedItems.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-gray-800/50 rounded-lg">
        <Icon name="box" className="w-12 h-12 mx-auto text-gray-500 mb-4" />
        <h3 className="text-xl font-bold text-white">Nenhuma compra por aqui</h3>
        <p className="text-gray-400 mt-2">Seus pedidos e ingressos aparecerão aqui assim que você fizer uma compra.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {combinedItems.map(item => {
        if (item.type === 'order') {
          return <OrderCard key={item.id} order={item.data} onViewDetails={onViewOrderDetails} />;
        }
        if (item.type === 'ticket') {
          return <PurchasedTicketSummaryCard key={item.id} ticket={item.data} onViewDetails={onViewTicketDetails} />;
        }
        return null;
      })}
    </div>
  );
};

export default MyPurchasesView;