
import React, { useState, useMemo } from 'react';
import { VaquinhaCampaign } from '../types';
import Icon from './Icon';
import { Button } from './ui/button';
import { ModalBody, ModalCloseButton, ModalFooter, ModalHeader, ModalShell, ModalTitle } from './ui/modal-shell';

interface VaquinhaDetailModalProps {
  campaign: VaquinhaCampaign | null;
  onClose: () => void;
  onInitiateCheckout: (campaign: VaquinhaCampaign, amount: number) => void;
}

const ProgressBar: React.FC<{ current: number; goal: number }> = ({ current, goal }) => {
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 shadow-inner">
      <div
        className="bg-gradient-to-r from-rose-500 to-purple-600 h-2.5 rounded-full transition-all duration-700 ease-out"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

const VaquinhaDetailModal: React.FC<VaquinhaDetailModalProps> = ({ campaign, onClose, onInitiateCheckout }) => {
    const [selectedAmount, setSelectedAmount] = useState<number | null>(25);
    const [customAmount, setCustomAmount] = useState('');

    if (!campaign) return null;

    const presetAmounts = [10, 25, 50, 100];
    const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;

    const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            setCustomAmount(value);
            setSelectedAmount(null);
        }
    };
    
    const handleDonateClick = () => {
        if (!finalAmount || finalAmount <= 0) return;
        onInitiateCheckout(campaign, finalAmount);
    };

  return (
    <ModalShell open={!!campaign} onClose={onClose} variant="sheet" className="max-w-lg" closeOnOverlayClick>
        <ModalHeader>
          <ModalTitle className="truncate ml-1">{campaign.title}</ModalTitle>
          <ModalCloseButton onClick={onClose} />
        </ModalHeader>

        <ModalBody className="overflow-y-auto no-scrollbar space-y-6">
            <div className="aspect-video rounded-3xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm">
                <img src={campaign.imageUrl} alt={campaign.title} className="w-full h-full object-cover" />
            </div>

            <div>
                <h1 className="text-2xl font-black text-gray-900 leading-tight">{campaign.title}</h1>
                <p className="text-gray-500 text-sm mt-3 leading-relaxed font-medium">{campaign.description}</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 shadow-inner">
                <div className="flex justify-between items-baseline mb-3">
                    <div className="text-gray-900">
                        <span className="font-black text-2xl tracking-tight">R$ {campaign.currentAmount.toLocaleString('pt-BR')}</span>
                        <span className="text-gray-400 text-xs font-bold ml-1 uppercase tracking-widest">alcançados</span>
                    </div>
                    <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">Meta: R$ {campaign.goalAmount.toLocaleString('pt-BR')}</div>
                </div>
                <ProgressBar current={campaign.currentAmount} goal={campaign.goalAmount} />
                <div className="flex items-center space-x-2 mt-4 text-rose-500 text-xs font-black uppercase tracking-widest">
                    <Icon name="users" className="w-4 h-4" />
                    <span>{campaign.supporterCount} fãs apoiadores</span>
                </div>
            </div>

            <div>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Quanto você quer doar?</h3>
                <div className="grid grid-cols-4 gap-3 mb-4">
                    {presetAmounts.map(amount => (
                        <button 
                            key={amount}
                            onClick={() => { setSelectedAmount(amount); setCustomAmount(''); }}
                            className={`py-4 rounded-2xl border-2 text-sm font-black transition-all shadow-sm ${selectedAmount === amount ? 'bg-rose-500 border-rose-500 text-white scale-105 shadow-lg' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                        >
                            R$ {amount}
                        </button>
                    ))}
                </div>
                 <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-black">R$</span>
                    <input 
                        type="text"
                        inputMode="decimal"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        placeholder="Outro valor..."
                        className="w-full bg-white border-2 border-gray-100 rounded-2xl p-4 pl-12 text-gray-900 font-black focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all placeholder-gray-300"
                    />
                 </div>
            </div>
        </ModalBody>

        <ModalFooter className="safe-bottom-pad">
             <Button
                onClick={handleDonateClick}
                disabled={!finalAmount || finalAmount <= 0}
                className="w-full rounded-2xl py-6 text-sm font-black disabled:bg-gray-200 disabled:text-gray-400 flex items-center justify-center space-x-2"
            >
                <Icon name="like" className="w-5 h-5" />
                <span>Apoiar com R$ {finalAmount?.toFixed(2).replace('.',',')}</span>
            </Button>
        </ModalFooter>
    </ModalShell>
  );
};

export default VaquinhaDetailModal;
