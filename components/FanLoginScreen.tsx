import React, { useMemo, useState } from 'react';
import Icon from './Icon';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ModalBody, ModalFooter, ModalShell, ModalTitle } from './ui/modal-shell';

interface FanLoginScreenProps {
  defaultEmail?: string;
  onSubmit: (credentials: { email: string; password: string }) => Promise<{ success: boolean; reason?: string }>;
  onBack: () => void;
}

const FanLoginScreen: React.FC<FanLoginScreenProps> = ({
  defaultEmail,
  onSubmit,
  onBack,
}) => {
  const [email, setEmail] = useState(defaultEmail ?? '');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAccountErrorVisible, setAccountErrorVisible] = useState(false);
  const [accountErrorMessage, setAccountErrorMessage] = useState('Não encontramos uma conta cadastrada para os dados informados.');

  const canAttemptLogin = email.trim() !== '' && password.trim() !== '';

  const helperMessage = useMemo(() => {
    if (!email.trim()) {
      return 'Informe o e-mail cadastrado para acessar sua conta.';
    }

    if (!password.trim()) {
      return 'Digite sua senha para continuar.';
    }

    return 'Pronto. Toque em Entrar para abrir sua conta.';
  }, [email, password]);

  const helperToneClassName = !email.trim() || !password.trim()
    ? 'border-white/10 bg-white/8 text-white/72'
    : 'border-emerald-400/20 bg-emerald-500/12 text-emerald-50';

  const handlePrimaryAction = async () => {
    if (!canAttemptLogin) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onSubmit({
        email: email.trim(),
        password,
      });

      if (!result.success) {
        setAccountErrorMessage(
          result.reason ?? 'Não encontramos uma conta cadastrada para os dados informados.'
        );
        setAccountErrorVisible(true);
      }
    } catch {
      setAccountErrorMessage('Não foi possível entrar agora. Tente novamente em instantes.');
      setAccountErrorVisible(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="safe-screen relative overflow-y-auto bg-[#130d09] text-white">
        <img
          src="https://i.ibb.co/0jfNGBHZ/Gemini-Generated-Image-2s57u32s57u32s57.png"
          alt="Clser login background"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(27,16,10,0.18)_0%,rgba(22,14,10,0.42)_26%,rgba(24,14,10,0.76)_58%,rgba(15,10,8,0.92)_100%)]"></div>
        <div className="absolute inset-0 bg-black/10"></div>

        <div className="safe-screen safe-horizontal-pad safe-top-pad safe-bottom-pad relative z-10 flex flex-col px-6">
          <div className="mb-8 flex items-center justify-between">
            <Button
              onClick={onBack}
              variant="ghost"
              size="icon-lg"
              className="rounded-2xl border border-white/12 bg-white/8 text-white backdrop-blur-sm hover:bg-white/14 hover:text-white"
              aria-label="Voltar"
            >
              <Icon name="arrowLeft" className="h-6 w-6" />
            </Button>
            <img
              src="https://i.ibb.co/1jSq1PW/logo-clser-wht.png"
              alt="Clser"
              className="h-9 w-auto object-contain"
            />
            <div className="w-10"></div>
          </div>

          <div className="mt-auto pb-1">
            <div className="mx-auto max-w-sm rounded-[2rem] border border-white/15 bg-white/10 p-5 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.55)] backdrop-blur-xl">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/65">Login</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-white">Entre na sua conta</h1>
              <p className="mt-2 text-sm leading-relaxed text-white/72">
                Acesse sua conta para voltar direto ao último artista e continuar sua jornada.
              </p>

              <div className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="ml-2 block text-[10px] font-black uppercase tracking-[0.24em] text-white/65">
                    E-mail
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="seu@email.com"
                    className="h-12 rounded-2xl border-white/10 bg-white/12 text-white placeholder:text-white/40 focus-visible:border-white/20 focus-visible:ring-white/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="ml-2 block text-[10px] font-black uppercase tracking-[0.24em] text-white/65">
                    Senha
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    className="h-12 rounded-2xl border-white/10 bg-white/12 text-white placeholder:text-white/40 focus-visible:border-white/20 focus-visible:ring-white/20"
                  />
                </div>
              </div>

              <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-semibold leading-relaxed ${helperToneClassName}`}>
                {helperMessage}
              </div>

              <div className="mt-6 space-y-3">
                <Button
                  onClick={handlePrimaryAction}
                  aria-disabled={!canAttemptLogin || isSubmitting}
                  className={`h-12 w-full rounded-full text-sm font-black text-white transition-all ${
                    canAttemptLogin && !isSubmitting
                      ? 'bg-[linear-gradient(90deg,#ff8a1f,#ff5f44,#ff4d63)] shadow-[0_18px_36px_-20px_rgba(255,96,70,0.72)] hover:brightness-105'
                      : 'bg-white/16 text-white/55 shadow-none hover:bg-white/18'
                  }`}
                >
                  {isSubmitting ? 'Entrando...' : 'Entrar'}
                </Button>

                <Button
                  onClick={onBack}
                  variant="outline"
                  className="h-12 w-full rounded-full border-white/10 bg-white/10 text-sm font-black text-white backdrop-blur-sm hover:bg-white/16 hover:text-white"
                >
                  Voltar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalShell open={isAccountErrorVisible} onClose={() => setAccountErrorVisible(false)} variant="dialog" className="max-w-sm text-center">
        <ModalBody className="px-6 pb-4 pt-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-500">
            <Icon name="warning" className="h-8 w-8" />
          </div>
          <ModalTitle className="mb-2 text-[1.7rem] leading-none">Conta não encontrada</ModalTitle>
          <p className="text-sm font-medium leading-relaxed text-muted-foreground">
            {accountErrorMessage}
          </p>
        </ModalBody>
        <ModalFooter className="px-6 pb-6 pt-0">
          <Button
            onClick={() => {
              setAccountErrorVisible(false);
              onBack();
            }}
            className="h-12 w-full rounded-2xl text-sm font-black"
          >
            Voltar e criar conta
          </Button>
        </ModalFooter>
      </ModalShell>
    </>
  );
};

export default FanLoginScreen;
