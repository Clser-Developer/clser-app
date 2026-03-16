
import React, { useState } from 'react';
import { Artist, Plan } from '../types';
import Icon from './Icon';
import { Button } from '@/components/ui/button';

interface PaymentScreenProps {
  artist: Artist;
  plan: Plan;
  onPaymentSuccess: () => void;
  onBack: () => void;
  onViewImage: (url: string) => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
);

const WalletOptions: React.FC = () => (
    <div className="space-y-3">
        <p className="text-sm text-gray-400 text-center mb-4">Selecione sua carteira digital para continuar.</p>
        <Button className="w-full text-center p-3 bg-black text-white font-semibold rounded-lg border border-gray-600 hover:border-white">
             Apple Pay
        </Button>
        <Button className="w-full text-center p-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-400 hover:border-black">
            <span className="font-bold">G</span> Pay
        </Button>
        <Button className="w-full text-center p-3 bg-gray-700 text-white font-semibold rounded-lg border border-gray-600 hover:border-white">
            Samsung Wallet
        </Button>
        <Button className="w-full text-center p-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
            PayPal
        </Button>
    </div>
);

const PaymentScreen: React.FC<PaymentScreenProps> = ({ artist, plan, onPaymentSuccess, onBack, onViewImage }) => {
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onPaymentSuccess();
    }, 2500); // Simulate network delay
  };

  return (
    <div className="bg-gray-900 text-white">
      <div className="animate-fade-in">
        <header className="p-4 flex items-center bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-700">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-center flex-grow mr-10">Pagamento</h1>
        </header>

        <main className="p-4 max-w-2xl mx-auto">
          {/* Order Summary */}
          <div className="bg-gray-800 rounded-2xl p-5 mb-6 border border-gray-700">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => onViewImage(artist.profileImageUrl)} 
                aria-label="Ver foto de perfil ampliada"
                className="rounded-full flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-magenta-500"
              >
                <img src={artist.profileImageUrl} alt={artist.name} className="w-16 h-16 rounded-full border-2 border-magenta-500 object-cover transition-transform hover:scale-105" />
              </button>
              <div>
                <p className="text-gray-400 text-sm">Assinatura do Fã Clube</p>
                <h2 className="text-xl font-bold">{artist.name}</h2>
                <p className="font-semibold text-orange-400">{plan.type}</p>
              </div>
            </div>
            <div className="border-t border-gray-700 my-4"></div>
            <div className="flex justify-between items-center text-lg">
              <span className="text-gray-300">Total</span>
              <span className="font-bold text-white">R$ {plan.price.toFixed(2).replace('.', ',')} / mês</span>
            </div>
          </div>

          {/* Payment Method */}
          <h3 className="text-lg font-bold mb-4">Forma de Pagamento</h3>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <button
              onClick={() => setPaymentMethod('credit-card')}
              className={`p-3 rounded-lg border-2 font-semibold transition-colors ${paymentMethod === 'credit-card' ? 'bg-magenta-600/30 border-magenta-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'}`}
            >Crédito</button>
            <button
              onClick={() => setPaymentMethod('pix')}
              className={`p-3 rounded-lg border-2 font-semibold transition-colors ${paymentMethod === 'pix' ? 'bg-magenta-600/30 border-magenta-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'}`}
            >Pix</button>
            <button
              onClick={() => setPaymentMethod('wallets')}
              className={`p-3 rounded-lg border-2 font-semibold transition-colors ${paymentMethod === 'wallets' ? 'bg-magenta-600/30 border-magenta-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'}`}
            >Carteiras</button>
          </div>

          {/* Dynamic Payment Content */}
          <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
            {paymentMethod === 'credit-card' && (
              <form className="space-y-4">
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-300 mb-1">Número do Cartão</label>
                  <input type="tel" id="cardNumber" inputMode="numeric" pattern="[0-9\s]{13,19}" autoComplete="cc-number" maxLength={19} placeholder="0000 0000 0000 0000" className="w-full bg-gray-700 border-gray-600 rounded-md p-3 text-white focus:ring-magenta-500 focus:border-magenta-500" />
                </div>
                <div>
                  <label htmlFor="cardName" className="block text-sm font-medium text-gray-300 mb-1">Nome no Cartão</label>
                  <input type="text" id="cardName" autoComplete="cc-name" placeholder="Seu nome completo" className="w-full bg-gray-700 border-gray-600 rounded-md p-3 text-white focus:ring-magenta-500 focus:border-magenta-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-300 mb-1">Validade</label>
                    <input type="tel" id="cardExpiry" autoComplete="cc-exp" placeholder="MM/AA" className="w-full bg-gray-700 border-gray-600 rounded-md p-3 text-white focus:ring-magenta-500 focus:border-magenta-500" />
                  </div>
                  <div>
                    <label htmlFor="cardCvv" className="block text-sm font-medium text-gray-300 mb-1">CVV</label>
                    <input type="tel" id="cardCvv" autoComplete="cc-csc" placeholder="123" className="w-full bg-gray-700 border-gray-600 rounded-md p-3 text-white focus:ring-magenta-500 focus:border-magenta-500" />
                  </div>
                </div>
              </form>
            )}
            {paymentMethod === 'pix' && (
              <div className="text-center p-6 flex flex-col items-center">
                 <p className="text-gray-300 mb-4">Um QR Code para pagamento com Pix seria exibido aqui.</p>
                 <div className="w-32 h-32 bg-gray-600 flex items-center justify-center text-gray-400 rounded-lg">QR Code</div>
              </div>
            )}
            {paymentMethod === 'wallets' && (
              <WalletOptions />
            )}
          </div>

          <div className="mt-8">
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-orange-500 text-white font-bold py-4 px-4 rounded-lg hover:bg-orange-600 transition-transform hover:scale-105 transform-gpu disabled:bg-orange-700 disabled:cursor-not-allowed disabled:scale-100 flex justify-center items-center"
              >
                {isProcessing ? <LoadingSpinner/> : `Confirmar Pagamento - R$ ${plan.price.toFixed(2).replace('.', ',')}`}
              </button>
              <p className="text-xs text-gray-500 text-center mt-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1 align-text-bottom" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Pagamento seguro. Cancele quando quiser.
              </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PaymentScreen;