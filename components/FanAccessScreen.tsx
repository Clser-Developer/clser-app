import React from 'react';
import Icon from './Icon';
import { Button } from './ui/button';

interface FanAccessScreenProps {
  onEnter: () => void;
  onRegister: () => void;
  onExploreArtists: () => void;
  onBack: () => void;
}

const FanAccessScreen: React.FC<FanAccessScreenProps> = ({
  onEnter,
  onRegister,
  onExploreArtists,
  onBack,
}) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#130d09] text-white">
      <img
        src="https://i.ibb.co/0jfNGBHZ/Gemini-Generated-Image-2s57u32s57u32s57.png"
        alt="Clser access background"
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
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/65">Fan Access</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white">Bem vindo ao Clser</h1>
            <p className="mt-2 text-sm leading-relaxed text-white/72">
              Cadastre-se para começar, ou entre, para continuar de onde parou.
            </p>

            <div className="mt-8 space-y-3">
              <Button
                onClick={onRegister}
                className="h-12 w-full rounded-full bg-[linear-gradient(90deg,#ff8a1f,#ff5f44,#ff4d63)] text-sm font-black text-white shadow-[0_18px_36px_-20px_rgba(255,96,70,0.72)] hover:brightness-105"
              >
                Cadastrar
              </Button>

              <Button
                onClick={onEnter}
                variant="outline"
                className="h-12 w-full rounded-full border-white/10 bg-white/10 text-sm font-black text-white backdrop-blur-sm hover:bg-white/16 hover:text-white"
              >
                Já tem uma conta? Entre
              </Button>
            </div>

            <div className="mt-5 text-center">
              <button
                onClick={onExploreArtists}
                className="text-[11px] font-medium text-white/58 transition-colors hover:text-white/82"
              >
                Entrar sem login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FanAccessScreen;
