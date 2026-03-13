
import React from 'react';
import Icon from './Icon';

interface PointsInfoModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const InfoSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h4 className="text-lg font-bold text-orange-400 mb-2">{title}</h4>
        <div className="text-gray-300 space-y-2 text-sm">{children}</div>
    </div>
);

const PointsInfoModal: React.FC<PointsInfoModalProps> = ({ isVisible, onClose }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in" aria-modal="true" role="dialog">
            <div className="bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl border border-gray-700 animate-scale-in flex flex-col max-h-[90vh]">
                <header className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-bold text-white">Sobre os Fan Points ✨</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-700">
                        <Icon name="close" className="w-6 h-6" />
                    </button>
                </header>
                <div className="p-6 overflow-y-auto space-y-6">
                    <InfoSection title="O que são?">
                        <p>Fan Points são a sua medida de engajamento no Fã Clube. Quanto mais você interage, mais pontos acumula, sobe no ranking e desbloqueia benefícios incríveis!</p>
                    </InfoSection>

                    <InfoSection title="Como Ganhar Pontos?">
                        <ul className="list-disc list-inside space-y-1">
                            <li><span className="font-bold text-white">+500 pts:</span> Ao se inscrever no Fã Clube.</li>
                            <li><span className="font-bold text-white">+50 pts:</span> Por cada item comprado na loja.</li>
                            <li><span className="font-bold text-white">+20 pts:</span> Por dar um lance em um leilão.</li>
                            <li><span className="font-bold text-white">+15 pts:</span> Por votar em uma enquete.</li>
                            <li><span className="font-bold text-white">+10 pts:</span> Pelo seu primeiro comentário em um post.</li>
                            <li><span className="font-bold text-white">+5 pts:</span> Por curtir um post.</li>
                        </ul>
                    </InfoSection>

                    <InfoSection title="Quais os Benefícios?">
                        <p>Acumular pontos eleva seu <span className="font-bold text-white">Nível de Fã</span> (Bronze, Prata, Ouro) e melhora sua posição no <span className="font-bold text-white">Ranking de Fãs</span>.</p>
                        <p>Sua posição no ranking é crucial, pois ela te torna elegível para <span className="font-bold text-orange-300">prêmios, sorteios e experiências exclusivas</span>, como Meet & Greets, itens autografados e muito mais!</p>
                        <p>Fique de olho na seção de sorteios no seu perfil para ver se você está participando!</p>
                    </InfoSection>
                </div>
                <footer className="p-4 bg-gray-900/50 flex-shrink-0">
                    <button 
                        onClick={onClose} 
                        className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                        Entendi!
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default PointsInfoModal;