
import React, { useState } from 'react';
import { PaymentRecord } from '../types';
import Icon from './Icon';

interface PaymentHistoryModalProps {
  isVisible: boolean;
  onClose: () => void;
  history: PaymentRecord[];
}

const InvoiceDetailView: React.FC<{ invoice: PaymentRecord; onBack: () => void }> = ({ invoice, onBack }) => (
    <div className="animate-fade-in flex flex-col h-full">
        <header className="p-5 border-b border-gray-100 flex items-center shrink-0">
            <button onClick={onBack} className="p-2 -m-2 rounded-full text-gray-400 hover:bg-gray-100 transition-colors">
                <Icon name="arrowLeft" className="w-6 h-6" />
            </button>
            <div className="text-center flex-1">
                <h2 className="text-lg font-black text-gray-900">Transação</h2>
                <p className="text-[10px] text-gray-400 font-mono font-bold">{invoice.id}</p>
            </div>
        </header>
        <div className="p-6 space-y-6 flex-1 overflow-y-auto no-scrollbar">
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 shadow-inner space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Data:</span>
                    <span className="font-bold text-gray-900 text-sm">{invoice.date}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Status:</span>
                    <span className="font-black text-green-600 text-xs px-2 py-1 bg-green-100 rounded-lg uppercase">{invoice.status}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Canal:</span>
                    <span className="font-bold text-gray-900 text-sm italic">{invoice.paymentMethod}</span>
                </div>
            </div>
             <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Detalhamento dos Itens</h3>
                <ul className="space-y-4 divide-y divide-gray-50">
                    {invoice.items.map((item, index) => (
                        <li key={index} className="flex justify-between items-start pt-4 first:pt-0">
                            <span className="text-gray-700 text-sm font-medium flex-1 pr-4">{item.description}</span>
                            <span className="font-black text-gray-900 text-sm tabular-nums">R$ {item.amount.toFixed(2).replace('.', ',')}</span>
                        </li>
                    ))}
                </ul>
                <div className="border-t border-gray-100 mt-6 pt-5 flex justify-between items-baseline">
                    <span className="font-black text-gray-900 text-lg uppercase tracking-tight">Total</span>
                    <span className="font-black text-rose-500 text-3xl tabular-nums">R$ {invoice.amount.toFixed(2).replace('.', ',')}</span>
                </div>
            </div>
        </div>
        <footer className="p-6 bg-gray-50 border-t border-gray-100 shrink-0 pb-10">
             <button
                onClick={() => alert('Download do PDF iniciado (Simulado)')}
                className="w-full bg-gray-900 text-white font-black py-4 px-4 rounded-2xl hover:bg-black transition-all flex items-center justify-center space-x-2 shadow-xl"
            >
                <Icon name="document-text" className="w-5 h-5" />
                <span>Baixar Nota Fiscal</span>
            </button>
        </footer>
    </div>
);

const HistoryListView: React.FC<{ history: PaymentRecord[]; onSelectInvoice: (invoice: PaymentRecord) => void }> = ({ history, onSelectInvoice }) => (
    <>
        <header className="p-5 border-b border-gray-100 flex-shrink-0 bg-white">
            <h2 className="text-lg font-black text-gray-900 text-center">Faturas e Recibos</h2>
        </header>
        <div className="p-4 overflow-y-auto no-scrollbar flex-1 bg-gray-50/30">
            {history.length > 0 ? (
                <div className="space-y-3">
                    {history.map(record => (
                        <button key={record.id} onClick={() => onSelectInvoice(record)} className="w-full flex items-center justify-between text-left p-5 bg-white rounded-3xl border border-gray-100 hover:border-rose-300 hover:shadow-md transition-all group">
                            <div className="min-w-0">
                                <p className="font-black text-gray-900 text-sm truncate pr-2">{record.title}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{record.type} • {record.date}</p>
                            </div>
                            <div className="text-right shrink-0">
                                 <p className="font-black text-gray-900 text-base tabular-nums">R$ {record.amount.toFixed(2).replace('.', ',')}</p>
                                 <p className="text-[9px] font-black text-green-600 uppercase tracking-widest mt-0.5">{record.status}</p>
                            </div>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 px-6 bg-white rounded-[2.5rem] border border-gray-100 shadow-inner m-2">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 shadow-sm">
                        <Icon name="document-text" className="w-8 h-8 text-gray-200" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Histórico Limpo</h3>
                    <p className="text-gray-500 mt-2 text-sm font-medium">Seus recibos e faturas de assinatura aparecerão aqui.</p>
                </div>
            )}
        </div>
    </>
);

const PaymentHistoryModal: React.FC<PaymentHistoryModalProps> = ({ isVisible, onClose, history }) => {
  const [selectedInvoice, setSelectedInvoice] = useState<PaymentRecord | null>(null);
  if (!isVisible) return null;
  const handleClose = () => { setSelectedInvoice(null); onClose(); };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-end justify-center" aria-modal="true" role="dialog">
      <div className="bg-white rounded-t-[2.5rem] w-full max-w-md shadow-2xl border-t border-gray-100 animate-slide-up flex flex-col h-[90vh]">
        <button onClick={handleClose} className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:bg-gray-100 z-10 transition-colors">
            <Icon name="close" className="w-6 h-6" />
        </button>
        {selectedInvoice ? <InvoiceDetailView invoice={selectedInvoice} onBack={() => setSelectedInvoice(null)} /> : <HistoryListView history={history} onSelectInvoice={setSelectedInvoice} />}
      </div>
    </div>
  );
};

export default PaymentHistoryModal;
