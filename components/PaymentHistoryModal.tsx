import React, { useState } from 'react';
import { PaymentRecord } from '../types';
import Icon from './Icon';

interface PaymentHistoryModalProps {
  isVisible: boolean;
  onClose: () => void;
  history: PaymentRecord[];
}

const InvoiceDetailView: React.FC<{ invoice: PaymentRecord; onBack: () => void }> = ({ invoice, onBack }) => (
    <div className="animate-fade-in">
        <header className="p-4 border-b border-gray-700 flex items-center flex-shrink-0">
            <button onClick={onBack} className="p-2 -m-2 rounded-full text-gray-300 hover:bg-gray-700/50 transition-colors">
                <Icon name="arrowLeft" className="w-6 h-6" />
            </button>
            <div className="text-center flex-1">
                <h2 className="text-lg font-bold text-white">Detalhes da Fatura</h2>
                <p className="text-sm text-gray-400">{invoice.id}</p>
            </div>
        </header>
        <div className="p-6 space-y-4">
            <div className="bg-gray-900/50 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">Data:</span> <span className="font-semibold text-white">{invoice.date}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Status:</span> <span className="font-semibold text-green-400">{invoice.status}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Método:</span> <span className="font-semibold text-white">{invoice.paymentMethod}</span></div>
            </div>
             <div className="bg-gray-900/50 p-4 rounded-lg">
                <h3 className="text-md font-bold text-white mb-2">Itens Cobrados</h3>
                <ul className="space-y-2 text-sm border-t border-gray-700 pt-2">
                    {invoice.items.map((item, index) => (
                        <li key={index} className="flex justify-between items-center">
                            <span className="text-gray-300 flex-1 pr-4">{item.description}</span>
                            <span className="font-semibold text-white">R$ {item.amount.toFixed(2).replace('.', ',')}</span>
                        </li>
                    ))}
                </ul>
                <div className="border-t border-gray-700 mt-3 pt-3 flex justify-between items-baseline">
                    <span className="font-bold text-white text-lg">Total</span>
                    <span className="font-bold text-orange-400 text-xl">R$ {invoice.amount.toFixed(2).replace('.', ',')}</span>
                </div>
            </div>
        </div>
        <footer className="p-4 bg-gray-900/50 flex-shrink-0 mt-auto">
             <a
                href={invoice.invoiceUrl}
                download
                onClick={(e) => { e.preventDefault(); alert('Iniciando download da fatura (simulado)...'); }}
                className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
            >
                <Icon name="document-text" className="w-5 h-5" />
                <span>Baixar Fatura (PDF)</span>
            </a>
        </footer>
    </div>
);

const HistoryListView: React.FC<{ history: PaymentRecord[]; onSelectInvoice: (invoice: PaymentRecord) => void }> = ({ history, onSelectInvoice }) => (
    <>
        <header className="p-4 border-b border-gray-700 flex-shrink-0">
            <h2 className="text-lg font-bold text-white text-center">Histórico de Pagamentos</h2>
        </header>
        <div className="p-4 overflow-y-auto">
            {history.length > 0 ? (
                <div className="space-y-3">
                    {history.map(record => (
                        <button key={record.id} onClick={() => onSelectInvoice(record)} className="w-full flex items-center justify-between text-left p-4 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-orange-500 transition-colors">
                            <div>
                                <p className="font-semibold text-white">{record.planName}</p>
                                <p className="text-sm text-gray-400">{record.date}</p>
                            </div>
                            <div className="text-right">
                                 <p className="font-bold text-white">R$ {record.amount.toFixed(2).replace('.', ',')}</p>
                                 <p className="text-sm text-green-400">{record.status}</p>
                            </div>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 px-4">
                    <Icon name="document-text" className="w-12 h-12 mx-auto text-gray-500 mb-4" />
                    <h3 className="text-xl font-bold text-white">Nenhum histórico</h3>
                    <p className="text-gray-400 mt-2">Suas faturas de assinatura aparecerão aqui.</p>
                </div>
            )}
        </div>
    </>
);


const PaymentHistoryModal: React.FC<PaymentHistoryModalProps> = ({ isVisible, onClose, history }) => {
  const [selectedInvoice, setSelectedInvoice] = useState<PaymentRecord | null>(null);

  if (!isVisible) return null;

  const handleClose = () => {
    setSelectedInvoice(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[60] flex items-end justify-center" aria-modal="true" role="dialog">
      <div className="bg-gray-800 rounded-t-2xl w-full max-w-md shadow-2xl border-t border-gray-700 animate-slide-up flex flex-col max-h-[90vh]">
        <button onClick={handleClose} className="absolute top-3 right-3 p-2 rounded-full text-gray-400 hover:bg-gray-700 z-10">
            <Icon name="close" className="w-6 h-6" />
        </button>

        {selectedInvoice ? (
            <InvoiceDetailView invoice={selectedInvoice} onBack={() => setSelectedInvoice(null)} />
        ) : (
            <HistoryListView history={history} onSelectInvoice={setSelectedInvoice} />
        )}
      </div>
    </div>
  );
};

export default PaymentHistoryModal;