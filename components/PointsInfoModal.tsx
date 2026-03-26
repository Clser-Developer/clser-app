
import React from 'react';
import Icon from './Icon';

interface PointsInfoModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const InfoSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h4 className="text-md font-black text-rose-500 uppercase tracking-wider mb-2">{title}</h4>
        <div className="text-gray-600 space-y-2 text-sm font-medium leading-relaxed">{children}</div>
    </div>
);

const PointsInfoModal: React.FC<PointsInfoModalProps> = ({ isVisible, onClose }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" aria-modal="true" role="dialog">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-gray-100 animate-scale-in flex flex-col max-h-[85vh]">
                <header className="p-5 border-b border-gray-50 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-black text-gray-900">Sobre os Fan Points ✨</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 transition-colors">
                        <Icon name="close" className="w-6 h-6" />
                    </button>
                </header>
                <div className="p-6 overflow-y-auto space-y-8 no-scrollbar">
                    <InfoSection title="O que são?">
                        <p>Fan Points são a sua medida de engajamento no Fã Clube. Quanto mais você interage, mais pontos acumula, sobe no ranking e desbloqueia benefícios incríveis!</p>
                    </InfoSection>

                    <InfoSection title="Como Ganhar Pontos?">
                        <ul className="space-y-3">
                            <li className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <span className="text-gray-700">Inscrição no Clube</span>
                                <span className="font-black text-rose-500">+500 pts</span>
                            </li>
                            <li className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <span className="text-gray-700">Compra na Loja (por item)</span>
                                <span className="font-black text-rose-500">+50 pts</span>
                            </li>
                            <li className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <span className="text-gray-700">Lance em Leilão</span>
                                <span className="font-black text-rose-500">+20 pts</span>
                            </li>
                            <li className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <span className="text-gray-700">Votar em Enquete</span>
                                <span className="font-black text-rose-500">+15 pts</span>
                            </li>
                        </ul>
                    </InfoSection>

                    <InfoSection title="Quais os Benefícios?">
                        <p>Acumular pontos eleva seu <span className="font-bold text-gray-900">Nível de Fã</span> (Bronze, Prata, Ouro) e melhora sua posição no <span className="font-bold text-gray-900">Ranking de Fãs</span>.</p>
                        <p>Sua posição no ranking te torna elegível para <span className="font-bold text-rose-500">prêmios e experiências exclusivas</span>!</p>
                    </InfoSection>
                </div>
                <footer className="p-5 bg-gray-50/50 flex-shrink-0">
                    <button 
                        onClick={onClose} 
                        className="w-full bg-rose-500 text-white font-black py-4 px-4 rounded-2xl hover:bg-rose-600 shadow-lg shadow-rose-500/20"
                    >
                        Entendi!
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default PointsInfoModal;
