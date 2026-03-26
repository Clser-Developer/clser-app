
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
  [OrderStatus.PROCESSING]: { text: 'Processando', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  [OrderStatus.SHIPPED]: { text: 'Enviado', color: 'text-blue-600', bg: 'bg-blue-100' },
  [OrderStatus.DELIVERED]: { text: 'Entregue', color: 'text-green-600', bg: 'bg-green-100' },
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
                                    index <= currentIndex ? 'bg-orange-500' : 'bg-gray-200'
                                }`}
                            ></div>
                        </div>
                        {index < statuses.length - 1 && (
                            <div
                                className={`flex-1 h-0.5 transition-colors ${
                                    index < currentIndex ? 'bg-orange-500' : 'bg-gray-200'
                                }`}
                            ></div>
                        )}
                    </React.Fragment>
                ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span className={currentIndex >= 0 ? 'font-bold text-gray-900' : ''}>Processando</span>
                <span className={currentIndex >= 1 ? 'font-bold text-gray-900' : ''}>Enviado</span>
                <span className={currentIndex >= 2 ? 'font-bold text-gray-900' : ''}>Entregue</span>
            </div>
        </div>
    );
};


const OrderCard: React.FC<{ order: Order; onViewDetails: (order: Order) => void }> = ({ order, onViewDetails }) => {
  const statusInfo = statusConfig[order.status];

  return (
    <div 
      className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 w-full text-left transition-shadow hover:shadow-md"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Pedido #{order.id}</h3>
          <p className="text-xs text-gray-500 mt-0.5">Feito em {order.date}</p>
        </div>
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${statusInfo.color} ${statusInfo.bg}`}>
          {statusInfo.text}
        </span>
      </div>
      
      <div className="border-t border-b border-gray-100 my-4 py-4 space-y-4">
        {order.items.map(item => (
          <div key={item.id} className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl border border-gray-100 overflow-hidden bg-gray-50 flex-shrink-0">
                <img src={item.imageUrls[0]} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
              <p className="text-xs text-gray-500">Qtd: {item.quantity}</p>
            </div>
            <p className="text-sm font-bold text-gray-900">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
          </div>
        ))}
      </div>

      <div className="text-xs text-gray-500 space-y-1 mb-5">
        <div className="flex justify-between"><span>Subtotal</span> <span className="font-medium text-gray-900">R$ {(order.total - order.shippingCost).toFixed(2).replace('.', ',')}</span></div>
        <div className="flex justify-between"><span>Frete</span> <span className="font-medium text-gray-900">R$ {order.shippingCost.toFixed(2).replace('.', ',')}</span></div>
        <div className="flex justify-between font-bold text-sm text-gray-900 mt-2 pt-2 border-t border-gray-100"><span>Total</span> <span>R$ {order.total.toFixed(2).replace('.', ',')}</span></div>
      </div>
      
      <button 
        onClick={() => onViewDetails(order)}
        className="w-full bg-gray-50 text-gray-900 font-bold py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors text-xs border border-gray-200"
      >
        Rastrear Pedido
      </button>

      <OrderStatusTracker status={order.status} />

    </div>
  );
};

const PurchasedTicketSummaryCard: React.FC<{ ticket: PurchasedTicket; onViewDetails: (ticket: PurchasedTicket) => void }> = ({ ticket, onViewDetails }) => {
  return (
    <button 
      onClick={() => onViewDetails(ticket)}
      className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 w-full hover:border-rose-200 hover:shadow-md transition-all text-left"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Ingresso: {ticket.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">Compra #{ticket.purchaseId}</p>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-green-700 bg-green-100 uppercase tracking-wide">
          CONFIRMADO
        </span>
      </div>
      <div className="border-t border-gray-100 my-4 py-4 flex items-center space-x-4">
        <div className="w-12 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            <img src={ticket.imageUrl} alt={ticket.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{ticket.location}</p>
          <p className="text-xs text-rose-500 font-bold uppercase mt-1">{ticket.date}</p>
        </div>
      </div>
      <div
        className="w-full bg-rose-50 text-rose-600 font-bold py-3 px-4 rounded-xl hover:bg-rose-100 transition-colors text-xs text-center"
      >
        Ver Detalhes do Evento
      </div>
    </button>
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
      <div className="text-center py-16 px-4 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
            <Icon name="box" className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Nenhuma compra por aqui</h3>
        <p className="text-gray-500 text-sm mt-2">Seus pedidos e ingressos aparecerão aqui assim que você fizer uma compra.</p>
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
