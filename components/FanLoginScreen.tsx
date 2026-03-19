import React, { useState } from 'react';
import Icon from './Icon';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface FanLoginScreenProps {
  hasExistingAccount: boolean;
  defaultEmail?: string;
  onSubmit: () => void;
  onBack: () => void;
}

const FanLoginScreen: React.FC<FanLoginScreenProps> = ({
  hasExistingAccount,
  defaultEmail,
  onSubmit,
  onBack,
}) => {
  const [email, setEmail] = useState(defaultEmail ?? '');
  const [password, setPassword] = useState('');

  const canSubmit = email.trim() !== '' && password.trim() !== '' && hasExistingAccount;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#130d09] text-white">
      <img
        src="https://i.ibb.co/0jfNGBHZ/Gemini-Generated-Image-2s57u32s57u32s57.png"
        alt="Clser login background"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(27,16,10,0.18)_0%,rgba(22,14,10,0.42)_26%,rgba(24,14,10,0.76)_58%,rgba(15,10,8,0.92)_100%)]"></div>
      <div className="absolute inset-0 bg-black/10"></div>

      <div className="relative z-10 flex min-h-screen flex-col px-6 py-7">
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

        <div className="mt-auto pb-2">
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

            {!hasExistingAccount && (
              <p className="mt-4 text-xs font-medium text-amber-100/85">
                Nenhuma conta local foi encontrada neste dispositivo. Faça seu cadastro para continuar.
              </p>
            )}

            <div className="mt-6 space-y-3">
              <Button
                onClick={onSubmit}
                disabled={!canSubmit}
                className="h-12 w-full rounded-full bg-[linear-gradient(90deg,#ff8a1f,#ff5f44,#ff4d63)] text-sm font-black text-white shadow-[0_18px_36px_-20px_rgba(255,96,70,0.72)] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Entrar
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
  );
};

export default FanLoginScreen;
