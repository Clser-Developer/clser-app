
import React from 'react';
import { Plan, PlanType } from '../types';

interface PlanCardProps {
  plan: Plan;
  onSubscribe: () => void;
}

const CheckIcon = () => (
  <svg className="w-5 h-5 text-orange-400 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const PlanCard: React.FC<PlanCardProps> = ({ plan, onSubscribe }) => {
  const isFullAccess = plan.type === PlanType.FULL_ACCESS;
  const cardClasses = `bg-gray-800 border-2 rounded-2xl p-6 flex flex-col transition-all duration-300 ${
    isFullAccess ? 'border-fuchsia-500 shadow-lg shadow-fuchsia-500/10' : 'border-gray-700'
  }`;

  return (
    <div className={cardClasses}>
      {isFullAccess && (
          <div className="text-center mb-4">
              <span className="bg-fuchsia-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">Mais Popular</span>
          </div>
      )}
      <h3 className="text-2xl font-bold text-center text-white">{plan.type}</h3>
      <div className="my-6 text-center">
        <span className="text-4xl font-black text-white">R$ {plan.price.toFixed(2).replace('.', ',')}</span>
        <span className="text-gray-400">/mês</span>
      </div>
      <ul className="space-y-3 mb-8 flex-grow">
        {plan.benefits.map((benefit, index) => (
          <li key={index} className="flex items-start">
            <CheckIcon />
            <span className="text-gray-300">{benefit}</span>
          </li>
        ))}
        {plan.includesPPV && (
             <li className="flex items-start font-bold">
                <CheckIcon />
                <span className="text-orange-300">PPV Incluso</span>
             </li>
        )}
      </ul>
      <button 
        onClick={onSubscribe}
        className={`w-full font-bold py-3 px-4 rounded-lg transition-transform duration-200 ${
          isFullAccess 
          ? 'bg-fuchsia-500 text-white hover:bg-fuchsia-600 hover:scale-105' 
          : 'bg-orange-500 text-white hover:bg-orange-600 hover:scale-105'
      }`}>
        Assinar Agora
      </button>
    </div>
  );
};

export default PlanCard;