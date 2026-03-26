
import React, { useState, useEffect, useMemo } from 'react';
import { CartItem } from '../types';
import Icon from './Icon';
import { Button } from './ui/button';
import { ModalBody, ModalCloseButton, ModalFooter, ModalHeader, ModalShell, ModalTitle } from './ui/modal-shell';

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
        <div className="bg-gray-50 p-2 rounded-full">
            <Icon name={icon} className="w-6 h-6 text-gray-400" />
        </div>
        <div className="flex-1">
            <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-400 text-xs uppercase tracking-wider">{title}</h4>
                {onEdit && (
                    <button onClick={onEdit} className="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors">
                        Alterar
                    </button>
                )}
            </div>
            <div className="text-gray-900 font-medium mt-1 text-sm">{children}</div>
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
    <ModalShell open={items.length > 0} onClose={onClose} variant="sheet" closeOnOverlayClick>
        <ModalHeader>
            <ModalTitle className="ml-1">Checkout</ModalTitle>
            <ModalCloseButton onClick={onClose} />
        </ModalHeader>
        <ModalBody className="overflow-y-auto flex-1 p-0">
            <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Seu Pedido</h3>
                    <div className="max-h-64 overflow-y-auto pr-2 mb-6 divide-y divide-gray-100">
                    {items.map(item => (
                        <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="flex items-start space-x-4 py-4">
                            <img src={item.imageUrls[0]} alt={item.name} className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 border border-gray-100 shadow-sm" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                                 {(item.selectedColor || item.selectedSize) && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        {item.selectedColor}{item.selectedColor && item.selectedSize && ', '}{item.selectedSize}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                                <div className="flex items-center mt-3 space-x-2">
                                    <button 
                                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                        aria-label={`Diminuir quantidade de ${item.name}`}
                                        className="w-7 h-7 bg-gray-100 rounded-lg text-gray-600 font-bold flex items-center justify-center hover:bg-gray-200 transition-colors"
                                    >
                                        -
                                    </button>
                                    <span className="w-8 text-center font-bold text-gray-900 tabular-nums">{item.quantity}</span>
                                    <button 
                                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                        aria-label={`Aumentar quantidade de ${item.name}`}
                                        className="w-7 h-7 bg-gray-100 rounded-lg text-gray-600 font-bold flex items-center justify-center hover:bg-gray-200 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div className="text-right flex flex-col items-end justify-between self-stretch">
                                <p className="text-base font-black text-gray-900">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                                <button 
                                    onClick={() => onUpdateQuantity(item.id, 0)}
                                    aria-label={`Remover ${item.name} do carrinho`}
                                    className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors"
                                >
                                    Remover
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="space-y-6">
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

                <div className="bg-gray-50 rounded-2xl p-4 mt-8 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="font-medium text-gray-900">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Frete</span>
                        <span className="font-medium text-gray-900">R$ {shipping.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="border-t border-gray-200 my-2"></div>
                    <div className="flex justify-between items-center text-xl">
                        <span className="text-gray-900 font-bold">Total</span>
                        <span className="font-black text-gray-900">R$ {total.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>
            </div>
        </ModalBody>

        <ModalFooter className="grid grid-cols-2 gap-4 safe-bottom-pad">
            <Button
                onClick={onClose} 
                variant="secondary"
                className="w-full rounded-2xl py-6 text-sm font-black text-gray-900">
                Continuar Comprando
            </Button>
            <Button
                onClick={handleConfirm} 
                disabled={isProcessing} 
                className="w-full rounded-2xl py-6 text-sm font-black flex justify-center items-center disabled:bg-rose-300 disabled:cursor-not-allowed"
            >
                {isProcessing ? <LoadingSpinner/> : (paymentMethod === 'pix' ? 'Gerar Pix' : 'Pagar Agora')}
            </Button>
        </ModalFooter>
    </ModalShell>
  );
};

export default OneClickPurchase;
