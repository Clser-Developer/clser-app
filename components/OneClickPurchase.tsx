

import React, { useState, useEffect, useMemo } from 'react';
import { CartItem } from '../types';
import Icon from './Icon';

interface OneClickPurchaseProps {
  items: CartItem[];
  onClose: () => void;
  onSuccess: (details: { total: number; shippingCost: number; paymentMethod: 'credit-card' | 'pix' }) => void;
  paymentMethod: 'credit-card' | 'pix';
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onEditAddress: () => void;
  onEditPaymentMethod: () => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
);

const DetailRow: React.FC<{ icon: string; title: string; onEdit?: () => void; children: React.ReactNode }> = ({ icon, title, onEdit, children }) => (
    <div className="flex items-start space-x-4">
        <Icon name={icon} className="w-6 h-6 text-gray-400 mt-1" />
        <div className="flex-1">
            <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-400 text-sm">{title}</h4>
                {onEdit && (
                    <button onClick={onEdit} className="text-sm font-semibold text-orange-400 hover:text-orange-300 transition-colors">
                        Alterar
                    </button>
                )}
            </div>
            <div className="text-white font-medium mt-1">{children}</div>
        </div>
    </div>
);

const OneClickPurchase: React.FC<OneClickPurchaseProps> = ({ items, onClose, onSuccess, paymentMethod, onUpdateQuantity, onEditAddress, onEditPaymentMethod }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    
    const { subtotal, shipping, total } = useMemo(() => {
        const sub = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const ship = 15.00; // Fixed shipping for simulation
        return {
            subtotal: sub,
            shipping: ship,
            total: sub + ship,
        };
    }, [items]);


    useEffect(() => {
        if (items.length === 0) {
            onClose();
        }
    }, [items, onClose]);

    const handleConfirm = () => {
        setIsProcessing(true);
        setTimeout(() => {
            onSuccess({ total, shippingCost: shipping, paymentMethod });
        }, 2000);
    };

    return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center" aria-modal="true" role="dialog">
      <div className="bg-gray-800 rounded-t-2xl w-full max-w-md shadow-2xl border-t border-gray-700 animate-slide-up">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Finalizar Compra</h2>
            <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-700">
                <Icon name="close" className="w-6 h-6" />
            </button>
        </div>
        <>
            <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Meu Carrinho</h3>
                    <div className="max-h-64 overflow-y-auto pr-2 mb-4 divide-y divide-gray-700/50">
                    {items.map(item => (
                        <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="flex items-start space-x-4 py-4">
                            <img src={item.imageUrls[0]} alt={item.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                                 {(item.selectedColor || item.selectedSize) && (
                                    <p className="text-xs text-gray-400 mt-1">
                                        {item.selectedColor}{item.selectedColor && item.selectedSize && ', '}{item.selectedSize}
                                    </p>
                                )}
                                <p className="text-xs text-gray-400 mt-1">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                                <div className="flex items-center mt-3 space-x-2">
                                    <button 
                                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                        aria-label={`Diminuir quantidade de ${item.name}`}
                                        className="w-7 h-7 bg-gray-700 rounded-md text-white font-bold flex items-center justify-center hover:bg-gray-600 transition-colors"
                                    >
                                        -
                                    </button>
                                    <span className="w-8 text-center font-bold text-white tabular-nums">{item.quantity}</span>
                                    <button 
                                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                        aria-label={`Aumentar quantidade de ${item.name}`}
                                        className="w-7 h-7 bg-gray-700 rounded-md text-white font-bold flex items-center justify-center hover:bg-gray-600 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div className="text-right flex flex-col items-end justify-between self-stretch">
                                <p className="text-base font-bold text-white">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                                <button 
                                    onClick={() => onUpdateQuantity(item.id, 0)}
                                    aria-label={`Remover ${item.name} do carrinho`}
                                    className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    Remover
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="space-y-5 mt-6">
                    <DetailRow icon="truck" title="Enviar Para" onEdit={onEditAddress}>
                        <p>Rua dos Fãs, 123 - Apto 456</p>
                        <p>São Paulo, SP - 01234-567</p>
                    </DetailRow>
                    <DetailRow icon="credit-card" title="Pagar Com" onEdit={onEditPaymentMethod}>
                    {paymentMethod === 'credit-card' ? (
                        <>
                            <p>Cartão de Crédito</p>
                            <p>**** **** **** 1234</p>
                        </>
                    ) : (
                        <p>Pix</p>
                    )}
                    </DetailRow>
                </div>

                <div className="border-t border-gray-700 my-6 pt-4 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Subtotal</span>
                        <span className="font-medium text-white">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Frete</span>
                        <span className="font-medium text-white">R$ {shipping.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="flex justify-between items-center text-xl mt-2">
                        <span className="text-gray-300 font-medium">Total</span>
                        <span className="font-bold text-white">R$ {total.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-gray-900/50 grid grid-cols-2 gap-4">
                <button 
                    onClick={onClose} 
                    className="w-full bg-gray-700 text-white font-bold py-4 px-4 rounded-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500">
                    Continuar Comprando
                </button>
                <button 
                    onClick={handleConfirm} 
                    disabled={isProcessing} 
                    className="w-full bg-orange-500 text-white font-bold py-4 px-4 rounded-lg hover:bg-orange-600 transition-transform hover:scale-105 transform-gpu disabled:bg-orange-700 disabled:cursor-not-allowed disabled:scale-100 flex justify-center items-center focus:outline-none focus:ring-2 focus:ring-orange-500">
                    {isProcessing ? <LoadingSpinner/> : (paymentMethod === 'pix' ? 'Gerar Pix' : 'Confirmar Compra')}
                </button>
            </div>
        </>
      </div>
    </div>
  );
};

export default OneClickPurchase;