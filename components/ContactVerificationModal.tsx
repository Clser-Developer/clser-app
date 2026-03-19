import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { ModalBody, ModalCloseButton, ModalDescription, ModalFooter, ModalHeader, ModalShell, ModalTitle } from './ui/modal-shell';

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
    <ModalShell open={isVisible} onClose={onClose} variant="sheet">
      <ModalHeader className="px-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">Conta Segura</p>
            <ModalTitle className="mt-1 text-xl">{title}</ModalTitle>
          </div>
          <ModalCloseButton onClick={onClose} />
      </ModalHeader>

      <ModalBody className="space-y-6">
          <div className="bg-gray-50 border border-gray-100 rounded-3xl p-5">
            <ModalDescription className="text-gray-500">{description}</ModalDescription>
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
      </ModalBody>

      <ModalFooter className="border-t-0 pt-0">
          <Button
            onClick={onVerified}
            disabled={!isValid}
            className="w-full rounded-2xl py-6 text-sm font-black disabled:bg-gray-200 disabled:text-gray-400"
          >
            Confirmar verificacao
          </Button>
      </ModalFooter>
    </ModalShell>
  );
};

export default ContactVerificationModal;
