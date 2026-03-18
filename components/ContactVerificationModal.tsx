import React, { useEffect, useState } from 'react';
import Icon from './Icon';

interface ContactVerificationModalProps {
  isVisible: boolean;
  type: 'email' | 'phone';
  value: string;
  onClose: () => void;
  onVerified: () => void;
}

const ContactVerificationModal: React.FC<ContactVerificationModalProps> = ({
  isVisible,
  type,
  value,
  onClose,
  onVerified,
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  useEffect(() => {
    if (!isVisible) {
      setOtp(['', '', '', '', '', '']);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const handleOtpChange = (index: number, nextValue: string) => {
    if (!/^\d*$/.test(nextValue)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = nextValue.slice(-1);
    setOtp(updatedOtp);

    if (nextValue && index < updatedOtp.length - 1) {
      document.getElementById(`verification-otp-${index + 1}`)?.focus();
    }
  };

  const isValid = otp.every(Boolean);
  const title = type === 'email' ? 'Verificar e-mail' : 'Verificar telefone';
  const description = type === 'email'
    ? 'Enviamos um codigo para confirmar que este e-mail pertence a sua conta.'
    : 'Enviamos um codigo por SMS para confirmar este telefone na sua conta.';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-end justify-center p-0 sm:p-4" aria-modal="true" role="dialog">
      <div className="bg-white rounded-t-[2.5rem] sm:rounded-[2rem] w-full max-w-md shadow-2xl border border-gray-100 animate-slide-up overflow-hidden">
        <header className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">Conta Segura</p>
            <h2 className="text-xl font-black text-gray-900 mt-1">{title}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 transition-colors">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>

        <div className="p-6 space-y-6">
          <div className="bg-gray-50 border border-gray-100 rounded-3xl p-5">
            <p className="text-sm font-medium text-gray-500 leading-relaxed">{description}</p>
            <p className="text-sm font-black text-gray-900 mt-3 break-all">{value || 'Nenhum contato informado'}</p>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Codigo de verificacao</p>
            <div className="flex gap-2 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`verification-otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(event) => handleOtpChange(index, event.target.value)}
                  className="w-11 h-14 bg-gray-50 border-2 border-gray-100 rounded-xl text-center text-2xl font-black focus:ring-2 focus:ring-rose-500 outline-none shadow-sm"
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-bold">
            <button className="text-rose-500 uppercase tracking-widest hover:underline">
              Reenviar codigo
            </button>
            <span className="text-gray-400 uppercase tracking-widest">Simulado</span>
          </div>
        </div>

        <footer className="p-6 pt-0">
          <button
            onClick={onVerified}
            disabled={!isValid}
            className="w-full bg-gray-900 text-white font-black py-4 px-4 rounded-2xl hover:bg-black transition-all disabled:bg-gray-200 disabled:text-gray-400"
          >
            Confirmar verificacao
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ContactVerificationModal;
