
import React, { useState } from 'react';
import Icon from './Icon';
import { BillingData } from '../App';
import PaymentScreen from './PaymentScreen';
import { UserAddress, UserPhone } from '../types';

interface PaymentSetupScreenProps {
    onSkip: () => void;
    onSaveCard: (billingData: BillingData) => void;
    artistName: string;
}

const PaymentSetupScreen: React.FC<PaymentSetupScreenProps> = ({ onSkip, onSaveCard, artistName }) => {
    const [showForm, setShowForm] = useState(false);

    // Mock user data for the form props
    const mockUser = {
        fullName: '',
        email: '',
        taxId: '',
        phone: { ddi: '+55', number: '' } as UserPhone,
        address: { cep: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' } as UserAddress
    };

    const benefits = [
        { icon: 'tickets', title: 'Ingressos em 1 Clique', desc: 'Não perca tempo digitando dados quando o show esgotar em minutos.' },
        { icon: 'lightning-bolt', title: 'Ofertas Relâmpago', desc: 'Aproveite drops de merch exclusivos instantaneamente.' },
        { icon: 'credit-card', title: 'Cartão do Fã Clube', desc: 'Habilite seu Mastercard oficial para pontuar em dobro.' }
    ];

    if (showForm) {
        return (
            <PaymentScreen 
                artist={{ name: artistName, profileImageUrl: '' } as any} // Mock minimum needed
                plan={{ type: 'Cartão Oficial', price: 0, benefits: [], includesPPV: false, level: 1 } as any}
                onPaymentSuccess={onSaveCard}
                onBack={() => setShowForm(false)}
                onViewImage={() => {}}
                user={mockUser}
                paymentMethod='credit-card'
                onPaymentMethodChange={() => {}}
                isSetupMode={true} // Add this prop to PaymentScreen to adjust UI slightly
            />
        );
    }

    return (
        <div className="bg-gray-50 min-h-[100dvh] flex flex-col p-6 animate-fade-in relative overflow-hidden">
            {/* Decorative BG */}
            <div className="absolute top-[-20%] right-[-20%] w-80 h-80 bg-rose-200/40 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-20%] left-[-20%] w-80 h-80 bg-purple-200/40 rounded-full blur-3xl pointer-events-none"></div>

            <header className="text-center mt-8 mb-8 z-10">
                <div className="w-20 h-20 bg-white rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-gray-200 border border-gray-100 mb-6 relative">
                    <Icon name="credit-card" className="w-10 h-10 text-rose-500" />
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md animate-bounce">
                        Recomendado
                    </div>
                </div>
                <h1 className="text-3xl font-black text-gray-900 leading-tight">Turbine sua experiência com {artistName}</h1>
            </header>

            <div className="space-y-4 flex-1 z-10">
                {benefits.map((b, idx) => (
                    <div key={idx} className="flex items-start space-x-4 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="bg-rose-50 p-3 rounded-2xl text-rose-500">
                            <Icon name={b.icon === 'lightning-bolt' ? 'star' : b.icon} className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-sm">{b.title}</h3>
                            <p className="text-xs text-gray-500 mt-1">{b.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-auto z-10 space-y-3 pt-6">
                <button
                    onClick={() => setShowForm(true)}
                    className="w-full bg-rose-500 text-white font-bold py-4 px-4 rounded-2xl hover:scale-105 transition-transform shadow-xl shadow-rose-500/20 flex items-center justify-center space-x-2"
                >
                    <Icon name="lock-closed" className="w-5 h-5" />
                    <span>Cadastrar Cartão Agora</span>
                </button>
                <button
                    onClick={onSkip}
                    className="w-full bg-transparent text-gray-400 font-bold py-3 px-4 rounded-lg hover:text-gray-600 transition-colors text-xs"
                >
                    Fazer isso depois
                </button>
            </div>
        </div>
    );
};

export default PaymentSetupScreen;
