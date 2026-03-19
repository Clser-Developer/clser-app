
import React from 'react';
import { Order, OrderStatus, TrackingEvent } from '../types';
import Icon from './Icon';
import { ModalBody, ModalCloseButton, ModalHeader, ModalShell, ModalTitle } from './ui/modal-shell';

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
        case OrderStatus.PROCESSING: return 2;
        case OrderStatus.SHIPPED: return 3;
        case OrderStatus.DELIVERED: return 4;
        default: return 0;
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
        <div className="mt-8 bg-gray-50 p-6 rounded-3xl border border-gray-100 shadow-inner">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Código de Rastreamento</h4>
            <div className="flex items-center bg-white border border-gray-100 rounded-xl p-3 shadow-sm mb-6">
                <span className="flex-1 text-sm text-gray-900 font-mono font-bold truncate">{trackingCode}</span>
                <button onClick={handleCopy} className="ml-4 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors">
                    {copied ? 'Copiado!' : 'Copiar'}
                </button>
            </div>
            <ul className="space-y-6">
                {history.map((event, index) => (
                    <li key={index} className="relative pl-7">
                        <div className={`absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm ${index === 0 ? 'bg-rose-500' : 'bg-gray-300'}`}></div>
                        {index < history.length - 1 && <div className="absolute left-[5px] top-[18px] h-full w-0.5 bg-gray-200"></div>}
                        <p className="text-sm font-bold text-gray-900">{event.status}</p>
                        <p className="text-xs text-gray-400 font-medium">{event.location}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{event.date}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const StepIcon: React.FC<{isCompleted: boolean, isCurrent: boolean}> = ({ isCompleted, isCurrent }) => {
    return (
        <div className={`relative z-10 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500 shadow-md' : isCurrent ? 'bg-rose-500 ring-4 ring-rose-100 shadow-lg' : 'bg-gray-200'}`}>
            {isCompleted ? (
                <Icon name="check" className="w-4 h-4 text-white stroke-[3]" />
            ) : isCurrent ? (
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            ) : null}
        </div>
    );
};

const OrderStatusModal: React.FC<OrderStatusModalProps> = ({ order, onClose }) => {
    const currentStepIndex = getStatusStepIndex(order.status);
    
    return (
        <ModalShell open={true} onClose={onClose} variant="sheet" className="max-w-lg" closeOnOverlayClick>
                <ModalHeader className="p-5">
                    <div className="ml-4">
                        <ModalTitle>Rastreio do Pedido</ModalTitle>
                        <p className="text-xs text-gray-400 font-mono font-bold">#{order.id}</p>
                    </div>
                    <ModalCloseButton onClick={onClose} />
                </ModalHeader>
                <ModalBody className="overflow-y-auto no-scrollbar pb-12">
                    <div className="pl-2">
                        {statusSteps.map((step, index) => {
                             const isCompleted = index < currentStepIndex;
                             const isCurrent = index === currentStepIndex;
                             const isFuture = index > currentStepIndex;
                             
                             return (
                                <div key={step.id} className="relative flex items-start pb-8">
                                    {index < statusSteps.length - 1 && (
                                        <div className={`absolute left-[15px] top-5 h-full w-0.5 transition-colors duration-500 ${index < currentStepIndex ? 'bg-green-200' : 'bg-gray-100'}`} />
                                    )}
                                    <StepIcon isCompleted={isCompleted} isCurrent={isCurrent} />
                                    <div className="ml-5">
                                        <h4 className={`text-sm font-black uppercase tracking-tight ${isFuture ? 'text-gray-400' : isCompleted ? 'text-green-600' : 'text-gray-900'}`}>{step.title}</h4>
                                        <p className={`text-xs mt-0.5 font-medium ${isFuture ? 'text-gray-400' : 'text-gray-500'}`}>{step.description}</p>
                                    </div>
                                </div>
                             );
                        })}
                    </div>
                    {order.status !== OrderStatus.PROCESSING && order.trackingCode && order.trackingHistory && (
                        <TrackingHistory trackingCode={order.trackingCode} history={order.trackingHistory} />
                    )}
                </ModalBody>
        </ModalShell>
    );
};

export default OrderStatusModal;
