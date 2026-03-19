
import React, { useState, useMemo } from 'react';
import Icon from '../Icon';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ModalBody, ModalCloseButton, ModalFooter, ModalHeader, ModalShell, ModalTitle } from '../ui/modal-shell';
import { Select } from '../ui/select';
import { Textarea } from '../ui/textarea';

interface CreateCampaignModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSend: (campaign: any) => void;
}

type Channel = 'PUSH' | 'SMS' | 'EMAIL';

const CHANNELS = {
    PUSH: { label: 'Push Notification', price: 0.10, icon: 'chat-alt', color: 'text-rose-500', bg: 'bg-rose-100', border: 'border-rose-500' },
    SMS: { label: 'SMS', price: 0.20, icon: 'device-mobile', color: 'text-green-500', bg: 'bg-green-100', border: 'border-green-500' }, // using fallback icon logic if needed
    EMAIL: { label: 'E-mail Marketing', price: 0.05, icon: 'document-text', color: 'text-blue-500', bg: 'bg-blue-100', border: 'border-blue-500' }
};

const TOTAL_FANS = 12500; // Mock total base

const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({ isVisible, onClose, onSend }) => {
  const [step, setStep] = useState(1);
  const [selectedChannel, setSelectedChannel] = useState<Channel>('PUSH');
  const [segmentation, setSegmentation] = useState({
      location: 'ALL',
      level: 'ALL',
      age: 'ALL'
  });
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Mock calculation logic
  const stats = useMemo(() => {
      let reach = TOTAL_FANS;
      
      // Simulate segmentation reduction
      if (segmentation.location !== 'ALL') reach = Math.floor(reach * 0.35); // ~35% in specific cities
      if (segmentation.level !== 'ALL') reach = Math.floor(reach * 0.15); // ~15% are VIPs
      if (segmentation.age !== 'ALL') reach = Math.floor(reach * 0.60); 

      const cost = reach * CHANNELS[selectedChannel].price;

      return { reach, cost };
  }, [segmentation, selectedChannel]);

  if (!isVisible) return null;

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleFinalSend = () => {
      setIsSending(true);
      setTimeout(() => {
          onSend({
              channel: selectedChannel,
              ...stats,
              message,
              date: 'Agora',
              status: 'Enviando...'
          });
          setIsSending(false);
          // Reset
          setStep(1);
          setMessage('');
          setSegmentation({ location: 'ALL', level: 'ALL', age: 'ALL' });
          onClose();
      }, 2000);
  };

  const renderStep1_Channel = () => (
      <div className="space-y-4 animate-fade-in">
          <h3 className="text-lg font-bold text-gray-900 mb-4">1. Escolha o Canal</h3>
          {(Object.keys(CHANNELS) as Channel[]).map(key => (
              <button
                key={key}
                onClick={() => setSelectedChannel(key)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all shadow-sm ${selectedChannel === key ? `${CHANNELS[key].bg} ${CHANNELS[key].border}` : 'bg-white border-gray-100 hover:border-gray-300'}`}
              >
                  <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full bg-white shadow-sm ${CHANNELS[key].color}`}>
                          <Icon name={CHANNELS[key].icon} className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                          <p className="font-bold text-gray-900">{CHANNELS[key].label}</p>
                          <p className="text-xs text-gray-500 font-medium">R$ {CHANNELS[key].price.toFixed(2)} / disparo</p>
                      </div>
                  </div>
                  {selectedChannel === key && <Icon name="check-circle" className={`w-6 h-6 ${CHANNELS[key].color}`} />}
              </button>
          ))}
      </div>
  );

  const renderStep2_Segmentation = () => (
      <div className="space-y-6 animate-fade-in">
          <h3 className="text-lg font-bold text-gray-900">2. Defina o Público</h3>
          
          <div className="space-y-4">
              <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wide">Localização</label>
                  <Select
                    value={segmentation.location}
                    onChange={(e) => setSegmentation({...segmentation, location: e.target.value})}
                    className="h-12 rounded-xl border-gray-200 bg-white shadow-sm focus-visible:border-rose-300 focus-visible:ring-rose-500/25"
                  >
                      <option value="ALL">Todos os locais</option>
                      <option value="SP">São Paulo (Capital + RMSP)</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="SUL">Região Sul</option>
                  </Select>
              </div>

              <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wide">Nível do Fã</label>
                  <Select
                    value={segmentation.level}
                    onChange={(e) => setSegmentation({...segmentation, level: e.target.value})}
                    className="h-12 rounded-xl border-gray-200 bg-white shadow-sm focus-visible:border-rose-300 focus-visible:ring-rose-500/25"
                  >
                      <option value="ALL">Todos os fãs</option>
                      <option value="VIP">Apenas VIP (Ouro/Platina)</option>
                      <option value="NEW">Novos (últimos 30 dias)</option>
                  </Select>
              </div>
          </div>

          {/* Real-time Calculator */}
          <Card className="mt-6 gap-3 rounded-2xl border-gray-100 bg-gray-50 p-5 shadow-inner">
              <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-500 text-sm font-medium">Alcance Estimado</span>
                  <span className="text-gray-900 font-bold">{stats.reach.toLocaleString('pt-BR')} pessoas</span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                  <span className="text-gray-500 text-sm font-medium">Custo Previsto</span>
                  <span className="text-green-600 font-black text-xl">R$ {stats.cost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
          </Card>
      </div>
  );

  const renderStep3_Content = () => (
      <div className="space-y-4 animate-fade-in">
          <h3 className="text-lg font-bold text-gray-900">3. Escreva a Mensagem</h3>
          
          <div>
            <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={selectedChannel === 'SMS' ? "Digite sua mensagem curta aqui..." : "Digite o conteúdo da sua campanha..."}
                rows={selectedChannel === 'SMS' ? 3 : 5}
                maxLength={selectedChannel === 'SMS' ? 160 : 500}
                className="min-h-28 rounded-xl border-gray-200 bg-white shadow-sm focus-visible:border-rose-300 focus-visible:ring-rose-500/25"
            />
            <div className="text-right text-xs text-gray-400 mt-2 font-medium">
                {message.length} / {selectedChannel === 'SMS' ? 160 : 500} caracteres
            </div>
          </div>

          {/* Preview */}
          <div className="mt-4">
              <p className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-wide">Pré-visualização</p>
              <div className="bg-white text-gray-900 p-4 rounded-2xl shadow-xl max-w-[90%] mx-auto relative border border-gray-100">
                  {selectedChannel === 'PUSH' && (
                      <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                              <Icon name="chat-alt" className="w-6 h-6 text-gray-400" />
                          </div>
                          <div>
                              <p className="font-bold text-xs mb-1 text-gray-900">Charles • Fã Clube</p>
                              <p className="text-sm leading-tight text-gray-600">{message || "Sua mensagem aparecerá aqui..."}</p>
                          </div>
                      </div>
                  )}
                  {selectedChannel === 'SMS' && (
                      <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none inline-block">
                          <p className="text-sm text-gray-800">{message || "Sua mensagem SMS..."}</p>
                      </div>
                  )}
                  {selectedChannel === 'EMAIL' && (
                      <div className="border-b pb-3 mb-3 border-gray-100">
                          <p className="font-bold text-sm text-gray-900">Assunto: Novidades do Charles</p>
                          <p className="text-xs text-gray-500 mt-1">Para: {stats.reach} fãs</p>
                      </div>
                  )}
                  {selectedChannel === 'EMAIL' && <p className="text-sm text-gray-600">{message || "Corpo do e-mail..."}</p>}
              </div>
          </div>
      </div>
  );

  const renderStep4_Review = () => (
      <div className="space-y-6 animate-fade-in text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto border-4 border-green-100 text-green-500">
              <Icon name="send" className="w-8 h-8 ml-1" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900">Pronto para enviar?</h3>
          
          <div className="bg-white rounded-2xl p-5 text-left space-y-3 border border-gray-100 shadow-sm">
              <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Canal</span>
                  <span className="text-gray-900 font-bold">{CHANNELS[selectedChannel].label}</span>
              </div>
              <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Público</span>
                  <span className="text-gray-900 font-bold">{segmentation.location === 'ALL' ? 'Global' : segmentation.location} • {segmentation.level === 'ALL' ? 'Todos' : 'VIPs'}</span>
              </div>
              <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Alcance</span>
                  <span className="text-gray-900 font-bold">{stats.reach.toLocaleString()} fãs</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Total a Pagar</span>
                  <span className="text-green-600 font-black text-xl">R$ {stats.cost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
          </div>

          <p className="text-xs text-gray-400 max-w-xs mx-auto">
              Ao confirmar, o valor será debitado do seu saldo de vendas e a campanha entrará na fila de disparo.
          </p>
      </div>
  );

  return (
    <ModalShell open={isVisible} onClose={onClose} variant="sheet" className="max-h-[95vh]">
      <ModalHeader>
        <ModalTitle>Nova Campanha</ModalTitle>
        <ModalCloseButton onClick={onClose} />
      </ModalHeader>

        {/* Progress Bar */}
        <div className="flex h-1.5 bg-gray-100">
            <div className="bg-rose-500 transition-all duration-300 rounded-r-full" style={{ width: `${step * 25}%` }}></div>
        </div>

        <ModalBody className="overflow-y-auto flex-1">
            {step === 1 && renderStep1_Channel()}
            {step === 2 && renderStep2_Segmentation()}
            {step === 3 && renderStep3_Content()}
            {step === 4 && renderStep4_Review()}
        </ModalBody>

        <ModalFooter className="flex space-x-3 pb-8">
            {step > 1 && (
                <Button
                    onClick={handleBack}
                    variant="secondary"
                    className="h-14 flex-1 rounded-2xl font-black text-gray-700"
                >
                    Voltar
                </Button>
            )}
            {step < 4 ? (
                <Button
                    onClick={handleNext}
                    className="h-14 flex-[2] rounded-2xl text-sm font-black shadow-lg shadow-rose-500/30"
                >
                    Próximo
                </Button>
            ) : (
                <Button
                    onClick={handleFinalSend}
                    disabled={isSending}
                    className="h-14 flex-[2] rounded-2xl bg-green-500 text-sm font-black text-white shadow-lg shadow-green-500/30 hover:bg-green-600"
                >
                    {isSending ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        'Pagar e Enviar'
                    )}
                </Button>
            )}
        </ModalFooter>
    </ModalShell>
  );
};

export default CreateCampaignModal;
