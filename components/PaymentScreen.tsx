
import React, { useState, useEffect } from 'react';
import { Artist, Plan, UserAddress, UserPhone } from '../types';
import { BillingData } from '../App';
import Icon from './Icon';
import CountrySelect from './CountrySelect';

interface PaymentScreenProps {
  artist: Artist;
  plan: Plan;
  onPaymentSuccess: (billingData: BillingData) => void;
  onBack: () => void;
  onViewImage: (url: string) => void;
  user: {
      fullName: string;
      email: string;
      cpf: string;
      phone: UserPhone;
      address: UserAddress;
  };
  paymentMethod: 'credit-card' | 'pix';
  onPaymentMethodChange: (method: 'credit-card' | 'pix') => void;
  isSetupMode?: boolean;
}

const LoadingSpinner: React.FC<{ small?: boolean }> = ({ small = false }) => (
    <div className={`${small ? 'w-5 h-5 border-2' : 'w-6 h-6 border-4'} border-rose-500 border-t-transparent rounded-full animate-spin`}></div>
);

const PaymentScreen: React.FC<PaymentScreenProps> = ({ artist, plan, onPaymentSuccess, onBack, onViewImage, user, paymentMethod, onPaymentMethodChange, isSetupMode }) => {
  const [step, setStep] = useState(1);
  const [billingDetails, setBillingDetails] = useState<BillingData>({
      fullName: user.fullName || '',
      email: user.email || '',
      cpf: user.cpf || '',
      phone: user.phone || { ddi: '+55', number: '' },
      address: user.address || { cep: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' },
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isCepLoading, setIsCepLoading] = useState(false);
  
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    const cep = billingDetails.address.cep.replace(/\D/g, '');
    if (cep.length === 8) {
        setIsCepLoading(true);
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(res => res.json())
            .then(data => {
                if (!data.erro) {
                    setBillingDetails(prev => ({
                        ...prev,
                        address: {
                            ...prev.address,
                            street: data.logradouro,
                            neighborhood: data.bairro,
                            city: data.localidade,
                            state: data.uf,
                        }
                    }));
                } else {
                    setErrors(prev => ({ ...prev, cep: 'CEP não encontrado.' }));
                }
            })
            .catch(() => setErrors(prev => ({ ...prev, cep: 'Erro ao buscar CEP.' })))
            .finally(() => setIsCepLoading(false));
    }
  }, [billingDetails.address.cep]);

  const handleBillingChange = (field: keyof BillingData, value: any) => {
    setBillingDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field: keyof UserAddress, value: string) => {
    setBillingDetails(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value }
    }));
  };
  
  const validateBillingForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!billingDetails.fullName.trim()) newErrors.fullName = "Nome completo é obrigatório.";
    if (!billingDetails.email.includes('@')) newErrors.email = "E-mail inválido.";
    if (billingDetails.phone.ddi === '+55' && billingDetails.cpf.replace(/\D/g, '').length !== 11) newErrors.cpf = "CPF inválido.";
    if (billingDetails.address.cep.replace(/\D/g, '').length !== 8) newErrors.cep = "CEP inválido.";
    if (!billingDetails.address.street.trim()) newErrors.street = "Rua é obrigatória.";
    if (!billingDetails.address.number.trim()) newErrors.number = "Número é obrigatório.";
    if (!billingDetails.address.city.trim()) newErrors.city = "Cidade é obrigatória.";
    if (!billingDetails.address.state.trim()) newErrors.state = "Estado é obrigatório.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = () => {
    if (validateBillingForm()) {
        setStep(2);
    }
  };

  const handlePayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      onPaymentSuccess(billingDetails);
    }, 2500);
  };

  const handleDemoBypass = () => {
    const demoData: BillingData = {
        fullName: 'Fã Demo',
        email: 'demo@superfans.app',
        cpf: '000.000.000-00',
        phone: { ddi: '+55', number: '999999999' },
        address: {
            cep: '01001-000',
            street: 'Rua da Demonstração',
            number: '10',
            complement: 'Apto 1',
            neighborhood: 'Centro',
            city: 'São Paulo',
            state: 'SP'
        }
    };
    onPaymentSuccess(demoData);
  };
  
  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .substring(0, 14);
  };

  const renderBillingForm = () => (
    <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Seus Dados</h3>
        <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Nome Completo</label>
            <input type="text" value={billingDetails.fullName} onChange={e => handleBillingChange('fullName', e.target.value)} className={`w-full bg-white border rounded-xl p-3 text-gray-900 focus:ring-rose-500 focus:border-rose-500 shadow-sm ${errors.fullName ? 'border-red-500' : 'border-gray-200'}`} />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
            <input type="email" value={billingDetails.email} onChange={e => handleBillingChange('email', e.target.value)} className={`w-full bg-white border rounded-xl p-3 text-gray-900 focus:ring-rose-500 focus:border-rose-500 shadow-sm ${errors.email ? 'border-red-500' : 'border-gray-200'}`} />
        </div>
        
        <div className="flex items-start space-x-2">
            <CountrySelect selectedDDI={billingDetails.phone.ddi} onDDIChange={ddi => handleBillingChange('phone', { ...billingDetails.phone, ddi })}/>
            <div className="flex-1">
                 <label className="block text-sm font-medium text-gray-500 mb-1">Telefone</label>
                <input type="tel" value={billingDetails.phone.number} onChange={e => handleBillingChange('phone', { ...billingDetails.phone, number: e.target.value })} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-gray-900 focus:ring-rose-500 focus:border-rose-500 shadow-sm" />
            </div>
        </div>
        
        {billingDetails.phone.ddi === '+55' && (
             <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">CPF</label>
                <input type="text" value={formatCPF(billingDetails.cpf)} onChange={e => handleBillingChange('cpf', e.target.value)} className={`w-full bg-white border rounded-xl p-3 text-gray-900 focus:ring-rose-500 focus:border-rose-500 shadow-sm ${errors.cpf ? 'border-red-500' : 'border-gray-200'}`} />
            </div>
        )}

        <h3 className="text-lg font-bold text-gray-900 pt-4">Endereço de Cobrança</h3>
        <div className="relative">
            <label className="block text-sm font-medium text-gray-500 mb-1">CEP</label>
            <input type="text" value={billingDetails.address.cep} onChange={e => handleAddressChange('cep', e.target.value)} maxLength={9} className={`w-full bg-white border rounded-xl p-3 text-gray-900 focus:ring-rose-500 focus:border-rose-500 shadow-sm ${errors.cep ? 'border-red-500' : 'border-gray-200'}`} />
            {isCepLoading && <div className="absolute right-3 top-9"><LoadingSpinner small /></div>}
        </div>
        <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">Rua</label>
                <input type="text" value={billingDetails.address.street} onChange={e => handleAddressChange('street', e.target.value)} className={`w-full bg-white border rounded-xl p-3 text-gray-900 focus:ring-rose-500 focus:border-rose-500 shadow-sm ${errors.street ? 'border-red-500' : 'border-gray-200'}`} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Nº</label>
                <input type="text" value={billingDetails.address.number} onChange={e => handleAddressChange('number', e.target.value)} className={`w-full bg-white border rounded-xl p-3 text-gray-900 focus:ring-rose-500 focus:border-rose-500 shadow-sm ${errors.number ? 'border-red-500' : 'border-gray-200'}`} />
            </div>
        </div>
         <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Complemento</label>
            <input type="text" value={billingDetails.address.complement} onChange={e => handleAddressChange('complement', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-gray-900 focus:ring-rose-500 focus:border-rose-500 shadow-sm" />
        </div>
         <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Bairro</label>
                <input type="text" value={billingDetails.address.neighborhood} onChange={e => handleAddressChange('neighborhood', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-gray-900 focus:ring-rose-500 focus:border-rose-500 shadow-sm" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Cidade</label>
                <input type="text" value={billingDetails.address.city} onChange={e => handleAddressChange('city', e.target.value)} className={`w-full bg-white border rounded-xl p-3 text-gray-900 focus:ring-rose-500 focus:border-rose-500 shadow-sm ${errors.city ? 'border-red-500' : 'border-gray-200'}`} />
            </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Estado</label>
            <input type="text" value={billingDetails.address.state} onChange={e => handleAddressChange('state', e.target.value)} className={`w-full bg-white border rounded-xl p-3 text-gray-900 focus:ring-rose-500 focus:border-rose-500 shadow-sm ${errors.state ? 'border-red-500' : 'border-gray-200'}`} />
        </div>
    </div>
  );

  const renderPaymentForm = () => (
     <div className="animate-fade-in">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Forma de Pagamento</h3>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <button onClick={() => onPaymentMethodChange('credit-card')} className={`p-3 rounded-xl border font-bold text-sm transition-colors shadow-sm ${paymentMethod === 'credit-card' ? 'bg-rose-50 border-rose-500 text-rose-600' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400'}`}>Crédito</button>
            <button onClick={() => onPaymentMethodChange('pix')} className={`p-3 rounded-xl border font-bold text-sm transition-colors shadow-sm ${paymentMethod === 'pix' ? 'bg-rose-50 border-rose-500 text-rose-600' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400'}`}>Pix</button>
             <button onClick={() => alert('Funcionalidade em desenvolvimento.')} className="p-3 rounded-xl border bg-white border-gray-200 text-gray-400 hover:border-gray-400 font-bold text-sm transition-colors shadow-sm">Carteiras</button>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md">
            {paymentMethod === 'credit-card' ? (
              <form className="space-y-4">
                <input type="text" placeholder="Número do Cartão" className="w-full bg-gray-50 border-gray-200 rounded-xl p-3 text-gray-900 focus:ring-rose-500 focus:border-rose-500" />
                <input type="text" placeholder="Nome no Cartão" className="w-full bg-gray-50 border-gray-200 rounded-xl p-3 text-gray-900 focus:ring-rose-500 focus:border-rose-500" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Validade (MM/AA)" className="w-full bg-gray-50 border-gray-200 rounded-xl p-3 text-gray-900 focus:ring-rose-500 focus:border-rose-500" />
                  <input type="text" placeholder="CVV" className="w-full bg-gray-50 border-gray-200 rounded-xl p-3 text-gray-900 focus:ring-rose-500 focus:border-rose-500" />
                </div>
              </form>
            ) : (
              <div className="text-center p-6 flex flex-col items-center">
                 <p className="text-gray-500 mb-4">Um QR Code para pagamento com Pix será exibido aqui.</p>
                 <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-gray-400 rounded-lg">QR Code</div>
              </div>
            )}
          </div>
     </div>
  );

  return (
    <div className="bg-gray-50 min-h-full text-gray-900">
      <div className="animate-fade-in">
        <header className="p-4 flex items-center bg-white/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-100">
          <button onClick={step === 1 ? onBack : () => setStep(1)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
            <Icon name="arrowLeft" className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-center flex-grow mr-10">{isSetupMode ? 'Configurar Pagamento' : 'Pagamento'}</h1>
        </header>

        <main className="p-4 max-w-2xl mx-auto pb-24">
          <div className="bg-white rounded-3xl p-5 mb-6 border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-4">
              <button onClick={() => onViewImage(artist.profileImageUrl)} className="rounded-full flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500">
                <img src={artist.profileImageUrl} alt={artist.name} className="w-16 h-16 rounded-full border-4 border-white shadow-md object-cover transition-transform hover:scale-105" />
              </button>
              <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Assinatura</p>
                <h2 className="text-xl font-black text-gray-900">{artist.name}</h2>
                <p className="font-semibold text-rose-500 text-sm">{plan.type}</p>
              </div>
            </div>
            {plan.price > 0 && (
                <>
                    <div className="border-t border-gray-100 my-4"></div>
                    <div className="flex justify-between items-center text-lg">
                    <span className="text-gray-500">Total</span>
                    <span className="font-black text-gray-900">R$ {plan.price.toFixed(2).replace('.', ',')} / mês</span>
                    </div>
                </>
            )}
          </div>

          {step === 1 ? renderBillingForm() : renderPaymentForm()}

          <div className="mt-8">
              <button
                onClick={step === 1 ? handleContinueToPayment : handlePayment}
                disabled={isProcessingPayment}
                className="w-full bg-rose-500 text-white font-bold py-4 px-4 rounded-2xl hover:bg-rose-600 transition-transform hover:scale-105 transform-gpu disabled:bg-rose-300 disabled:cursor-not-allowed disabled:scale-100 flex justify-center items-center shadow-lg shadow-rose-500/20"
              >
                {isProcessingPayment ? <LoadingSpinner/> : 
                 step === 1 ? 'Continuar para Pagamento' : `Confirmar - R$ ${plan.price.toFixed(2).replace('.', ',')}`}
              </button>
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-400 inline-block">
                    <Icon name="lock-closed" className="h-3 w-3 inline mr-1 align-text-bottom" />
                    Pagamento seguro.
                </p>
                <button 
                    onClick={handleDemoBypass}
                    className="ml-2 text-[10px] text-gray-400 hover:text-rose-500 underline transition-colors"
                >
                    [Demo: Pular]
                </button>
              </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PaymentScreen;
