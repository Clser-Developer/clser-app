import React from 'react';
import Icon from './Icon';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface FanAccessScreenProps {
  hasExistingAccount: boolean;
  nickname?: string;
  membershipsCount: number;
  onEnter: () => void;
  onRegister: () => void;
  onExploreArtists: () => void;
  onBack: () => void;
}

const FanAccessScreen: React.FC<FanAccessScreenProps> = ({
  hasExistingAccount,
  nickname,
  membershipsCount,
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
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white">Entrar</h1>
            <p className="mt-2 text-sm leading-relaxed text-white/72">
              Sua conta é única na Clser. Entre para acessar seus artistas, pedidos e vantagens da plataforma.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              {hasExistingAccount ? (
                <>
                  <Badge className="rounded-full border border-white/10 bg-white/14 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white">
                    Conta encontrada
                  </Badge>
                  <span className="text-xs font-medium text-white/72">
                    {nickname ? `${nickname}` : 'Perfil salvo'}{membershipsCount > 0 ? ` • ${membershipsCount} artista${membershipsCount > 1 ? 's' : ''}` : ''}
                  </span>
                </>
              ) : (
                <Badge className="rounded-full border border-white/10 bg-white/14 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white">
                  Primeiro acesso
                </Badge>
              )}
            </div>

            <div className="mt-6 space-y-3">
              <Button
                onClick={onEnter}
                className="h-12 w-full rounded-full bg-[linear-gradient(90deg,#ff8a1f,#ff5f44,#ff4d63)] text-sm font-black text-white shadow-[0_18px_36px_-20px_rgba(255,96,70,0.72)] hover:brightness-105"
              >
                Entrar
              </Button>

              <Button
                onClick={onRegister}
                variant="outline"
                className="h-12 w-full rounded-full border-white/10 bg-white/10 text-sm font-black text-white backdrop-blur-sm hover:bg-white/16 hover:text-white"
              >
                Cadastrar
              </Button>
            </div>

            <div className="mt-5 text-center">
              <button
                onClick={onExploreArtists}
                className="text-xs font-bold text-white/78 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                Explorar artistas primeiro
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FanAccessScreen;
