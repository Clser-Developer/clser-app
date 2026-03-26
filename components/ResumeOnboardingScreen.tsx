import React from 'react';
import Icon from './Icon';

interface ResumeOnboardingScreenProps {
  onResume: () => void;
  onRestart: () => void;
}

const ResumeOnboardingScreen: React.FC<ResumeOnboardingScreenProps> = ({ onResume, onRestart }) => (
  <div className="bg-white h-full flex flex-col items-center justify-center p-8 text-center animate-fade-in">
    <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mb-6 text-rose-500 shadow-xl shadow-rose-100 border border-rose-100">
      <Icon name="users" className="w-10 h-10" />
    </div>
    <h2 className="text-3xl font-black text-gray-900 leading-tight">Olá novamente!</h2>
    <p className="text-gray-500 mt-3 font-medium leading-relaxed">
      Vimos que você já começou seu cadastro como fã. Deseja continuar de onde parou?
    </p>
    <div className="w-full space-y-3 mt-12">
      <button
        onClick={onResume}
        className="w-full bg-rose-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-rose-500/20 active:scale-95 transition-transform"
      >
        Continuar cadastro
      </button>
      <button
        onClick={onRestart}
        className="w-full bg-gray-50 text-gray-400 font-bold py-4 rounded-2xl hover:text-gray-600 transition-colors"
      >
        Começar do zero
      </button>
    </div>
  </div>
);

export default ResumeOnboardingScreen;

