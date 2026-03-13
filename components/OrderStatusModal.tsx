
import React from 'react';
import { Order, OrderStatus, TrackingEvent } from '../types';
import Icon from './Icon';

interface OrderStatusModalProps {
  order: Order;
  onClose: () => void;
}

const statusSteps = [
    { id: 1, title: 'Pedido Recebido', description: 'Confirmamos o recebimento do seu pedido.' },
    { id: 2, title: 'Pagamento Aprovado', description: 'Seu pagamento foi aprovado com sucesso.' },
    { id: 3, title: 'Em Preparação', description: 'Estamos preparando seu pedido para envio.' },
    { id: 4, title: 'Pedido Enviado', description: 'Seu pedido foi enviado e está a caminho.' },
    { id: 5, title: 'Entregue', description: 'Seu pedido foi entregue!' },
];

const getStatusStepIndex = (status: OrderStatus): number => {
    switch (status) {
        case OrderStatus.PROCESSING:
            return 2; // "Em Preparação"
        case OrderStatus.SHIPPED:
            return 3; // "Pedido Enviado"
        case OrderStatus.DELIVERED:
            return 4; // "Entregue"
        default:
            return 0;
    }
};

const TrackingHistory: React.FC<{ trackingCode: string; history: TrackingEvent[] }> = ({ trackingCode, history }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(trackingCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mt-6 bg-gray-900/50 p-4 rounded-lg">
            <h4 className="text-md font-bold text-white mb-3">Rastreamento</h4>
            <div className="flex items-center bg-gray-700 rounded-md p-2">
                <span className="flex-1 text-sm text-gray-300 font-mono truncate">{trackingCode}</span>
                <button onClick={handleCopy} className="ml-4 text-sm font-semibold text-orange-400 hover:text-orange-300 transition-colors flex-shrink-0">
                    {copied ? 'Copiado!' : 'Copiar'}
                </button>
            </div>
            <ul className="mt-4 space-y-4">
                {history.map((event, index) => (
                    <li key={index} className="relative pl-6">
                        <div className={`absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 border-gray-800 ${index === 0 ? 'bg-orange-400' : 'bg-gray-600'}`}></div>
                        {index < history.length - 1 && <div className="absolute left-[5px] top-[18px] h-[calc(100%)] w-0.5 bg-gray-600"></div>}
                        <p className="text-sm font-semibold text-white">{event.status}</p>
                        <p className="text-xs text-gray-400">{event.location}</p>
                        <p className="text-xs text-gray-500">{event.date}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};


const StepIcon: React.FC<{isCompleted: boolean, isCurrent: boolean}> = ({ isCompleted, isCurrent }) => {
    return (
        <div className={`relative z-10 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full ${isCompleted ? 'bg-orange-500' : isCurrent ? 'bg-orange-500 ring-4 ring-orange-500/30' : 'bg-gray-600'}`}>
            {isCompleted ? (
                <Icon name="check" className="w-5 h-5 text-white" />
            ) : isCurrent ? (
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            ) : null}
        </div>
    );
};


const OrderStatusModal: React.FC<OrderStatusModalProps> = ({ order, onClose }) => {
    const currentStepIndex = getStatusStepIndex(order.status);
    
    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center" aria-modal="true" role="dialog">
            <div className="bg-gray-800 rounded-t-2xl w-full max-w-lg shadow-2xl border-t border-gray-700 animate-slide-up flex flex-col max-h-[90vh]">
                <header className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-white">Detalhes do Pedido</h2>
                        <p className="text-sm text-gray-400 font-mono">#{order.id}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-700">
                        <Icon name="close" className="w-6 h-6" />
                    </button>
                </header>
                <div className="p-6 overflow-y-auto">
                    <div>
                        {statusSteps.map((step, index) => {
                             const isCompleted = index < currentStepIndex;
                             const isCurrent = index === currentStepIndex;
                             const isFuture = index > currentStepIndex;
                             
                             return (
                                <div key={step.id} className="relative flex items-start pb-8">
                                    {/* Vertical Line */}
                                    {index < statusSteps.length - 1 && (
                                        <div className="absolute left-[15px] top-5 h-full w-0.5 bg-gray-600" />
                                    )}
                                    <StepIcon isCompleted={isCompleted} isCurrent={isCurrent} />
                                    {/* Text */}
                                    <div className="ml-4">
                                        <h4 className={`font-bold ${isFuture ? 'text-gray-500' : 'text-white'}`}>{step.title}</h4>
                                        <p className={`text-sm ${isFuture ? 'text-gray-600' : 'text-gray-400'}`}>{step.description}</p>
                                    </div>
                                </div>
                             );
                        })}
                    </div>
                    {order.status !== OrderStatus.PROCESSING && order.trackingCode && order.trackingHistory && (
                        <TrackingHistory trackingCode={order.trackingCode} history={order.trackingHistory} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderStatusModal;