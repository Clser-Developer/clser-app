
import React from 'react';
import Icon from './Icon';

interface DemoSelectionScreenProps {
  onSelectFan: () => void;
  onSelectArtist: () => void;
}

const DemoSelectionScreen: React.FC<DemoSelectionScreenProps> = ({ onSelectFan, onSelectArtist }) => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.14),transparent_24%),linear-gradient(180deg,#fff8f8,#f8fafc)] p-6">
      <div className="pointer-events-none absolute top-[-10%] left-[-10%] h-96 w-96 rounded-full bg-rose-200/40 blur-3xl"></div>
      <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-96 w-96 rounded-full bg-amber-200/40 blur-3xl"></div>

      <div className="z-10 flex w-full max-w-md flex-col items-center space-y-8 animate-fade-in">
        <div className="w-full rounded-[2.25rem] border border-white/80 bg-white/90 p-7 text-center shadow-[0_30px_70px_-38px_rgba(15,23,42,0.38)] backdrop-blur">
          <div className="mb-4 inline-flex rounded-[1.6rem] border border-gray-100 bg-white px-5 py-4 shadow-sm">
            <img
              src="https://i.ibb.co/fzC9nphW/clser-logo-color.png"
              alt="Clser Logo"
              className="h-20 w-auto object-contain"
            />
          </div>
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.26em] text-rose-500">Acesso principal</p>
          <h1 className="text-3xl font-black tracking-tight text-gray-950">Escolha como entrar</h1>
          <p className="mx-auto max-w-xs text-lg font-medium leading-relaxed text-gray-500">
            Conexão real entre ídolos e fãs em um ambiente exclusivo.
          </p>
        </div>

        <div className="w-full space-y-4">
          <button
            onClick={onSelectFan}
            className="group relative w-full rounded-[2rem] border border-gray-200 bg-white p-6 text-left shadow-[0_20px_48px_-36px_rgba(15,23,42,0.32)] transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-[0_24px_56px_-34px_rgba(244,63,94,0.25)]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="rounded-2xl bg-rose-50 p-3 text-rose-500 transition-colors group-hover:bg-rose-500 group-hover:text-white">
                <Icon name="users" className="w-8 h-8" />
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 transition-colors group-hover:bg-rose-100 group-hover:text-rose-600">
                <Icon name="chevron-right" className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <p className="mb-1 text-[10px] font-black uppercase tracking-[0.22em] text-rose-500">Entrada fã</p>
            <h3 className="text-2xl font-black text-gray-950">Sou Fã</h3>
            <p className="mt-1 text-sm text-gray-500">
              Entre em fã clubes, participe de sorteios e garanta itens exclusivos.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-rose-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-rose-600">Sorteios</span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">Fanpoints</span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">Ingressos</span>
            </div>
          </button>

          <button
            onClick={onSelectArtist}
            className="group relative w-full rounded-[2rem] border border-gray-200 bg-white p-6 text-left shadow-[0_20px_48px_-36px_rgba(15,23,42,0.32)] transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-[0_24px_56px_-34px_rgba(245,158,11,0.22)]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="rounded-2xl bg-amber-50 p-3 text-amber-600 transition-colors group-hover:bg-amber-500 group-hover:text-white">
                <Icon name="microphone" className="w-8 h-8" />
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 transition-colors group-hover:bg-amber-100 group-hover:text-amber-600">
                <Icon name="chevron-right" className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <p className="mb-1 text-[10px] font-black uppercase tracking-[0.22em] text-amber-600">Entrada artista</p>
            <h3 className="text-2xl font-black text-gray-950">Sou Artista</h3>
            <p className="mt-1 text-sm text-gray-500">
              Acesse o Backstage para gerenciar sua comunidade e faturamento.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-amber-700">Backstage</span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">Campanhas</span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">Recebimentos</span>
            </div>
          </button>
        </div>

        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
          Versão de Demonstração
        </p>
      </div>
    </div>
  );
};

export default DemoSelectionScreen;
