
import React from 'react';
import Icon from './Icon';

interface DemoSelectionScreenProps {
  onSelectFan: () => void;
  onSelectArtist: () => void;
}

const DemoSelectionScreen: React.FC<DemoSelectionScreenProps> = ({ onSelectFan, onSelectArtist }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-rose-200/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-200/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="z-10 w-full max-w-md flex flex-col items-center space-y-10 animate-fade-in">
        
        <div className="text-center space-y-4">
            <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200 border border-gray-100 inline-block mb-2">
                 <img 
                    src="https://i.ibb.co/fzC9nphW/clser-logo-color.png" 
                    alt="Clser Logo"
                    className="h-20 w-auto" 
                />
            </div>
            <p className="text-gray-500 text-lg max-w-xs mx-auto font-medium leading-relaxed">
                Conexão real entre ídolos e fãs em um ambiente exclusivo.
            </p>
        </div>

        <div className="w-full space-y-4">
            <button
                onClick={onSelectFan}
                className="w-full group relative bg-white hover:bg-gray-50 border border-gray-200 hover:border-rose-200 rounded-3xl p-6 transition-all duration-300 text-left shadow-md hover:shadow-xl hover:shadow-rose-100 hover:-translate-y-1"
            >
                <div className="flex items-center justify-between mb-3">
                    <div className="p-3 bg-rose-50 rounded-2xl group-hover:bg-rose-500 group-hover:text-white transition-colors text-rose-500">
                        <Icon name="users" className="w-8 h-8" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-rose-100 group-hover:text-rose-600 transition-colors">
                        <Icon name="chevron-right" className="w-5 h-5 text-gray-400" />
                    </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Sou Fã</h3>
                <p className="text-gray-500 text-sm mt-1">
                    Entre em fã clubes, participe de sorteios e garanta itens exclusivos.
                </p>
            </button>

            <button
                onClick={onSelectArtist}
                className="w-full group relative bg-white hover:bg-gray-50 border border-gray-200 hover:border-purple-200 rounded-3xl p-6 transition-all duration-300 text-left shadow-md hover:shadow-xl hover:shadow-purple-100 hover:-translate-y-1"
            >
                <div className="flex items-center justify-between mb-3">
                    <div className="p-3 bg-purple-50 rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition-colors text-purple-600">
                        <Icon name="microphone" className="w-8 h-8" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                        <Icon name="chevron-right" className="w-5 h-5 text-gray-400" />
                    </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Sou Artista</h3>
                <p className="text-gray-500 text-sm mt-1">
                    Acesse o Backstage para gerenciar sua comunidade e faturamento.
                </p>
            </button>
        </div>

        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
            Versão de Demonstração
        </p>

      </div>
    </div>
  );
};

export default DemoSelectionScreen;
