
import React, { useState, useMemo } from 'react';
import Icon from './Icon';
import { helpContent, allFaqs } from '../services/helpContent';
import type { FAQ } from '../types';

const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const Highlight: React.FC<{ text: unknown; highlight: string }> = ({ text, highlight }) => {
  const safeText = typeof text === 'string' ? text : String(text ?? '');
  const trimmedHighlight = highlight.trim();
  if (!trimmedHighlight) return <span>{safeText}</span>;

  try {
    const escapedHighlight = escapeRegExp(trimmedHighlight);
    const regex = new RegExp(`(${escapedHighlight})`, 'gi');
    const parts = safeText.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === trimmedHighlight.toLowerCase() ? (
            <mark key={i} className="bg-rose-100 text-rose-700 rounded-sm px-0.5 py-0">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  } catch (error) {
    return <span>{safeText}</span>;
  }
};

const getYouTubeVideoId = (url: unknown): string | null => {
  if (typeof url !== 'string' || !url) return null;
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('youtube.com')) return urlObj.searchParams.get('v');
    if (urlObj.hostname.includes('youtu.be')) return urlObj.pathname.slice(1);
    return null;
  } catch (error) {
    return null;
  }
};

const AccordionItem: React.FC<{
  faq: FAQ;
  isOpen: boolean;
  onClick: () => void;
}> = ({ faq, isOpen, onClick }) => (
  <div className="border-b border-gray-100 last:border-b-0">
    <button
      onClick={onClick}
      className="w-full flex justify-between items-center text-left p-4 focus:outline-none"
      aria-expanded={isOpen}
    >
      <span className="font-bold text-gray-900 text-sm">{faq.question}</span>
      <Icon name="chevron-down" className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
    </button>
    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
      <div className="p-4 pt-0 text-gray-500 text-sm font-medium leading-relaxed">
        <p>{faq.answer}</p>
      </div>
    </div>
  </div>
);

const VideoTutorial: React.FC<{ title: string; videoUrl: string }> = ({ title, videoUrl }) => {
  const videoId = getYouTubeVideoId(videoUrl);
  if (!videoId) return null;

  return (
    <div>
      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">{title}</h3>
      <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="block group">
        <div className="relative rounded-2xl overflow-hidden aspect-video bg-gray-100 flex items-center justify-center border border-gray-200 shadow-inner">
            <img 
                src="https://i.ibb.co/fzC9nphW/clser-logo-color.png" 
                alt="Clser Tutorial"
                className="h-10 w-auto opacity-30 grayscale group-hover:opacity-60 transition-opacity" 
            />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white p-4 rounded-full shadow-xl group-hover:scale-110 transition-transform">
                    <Icon name="play" className="w-8 h-8 text-rose-500 fill-current" />
                </div>
            </div>
        </div>
      </a>
    </div>
  );
};

const FaqSection: React.FC<{ title: string; faqs: FAQ[] }> = ({ title, faqs }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  if (!Array.isArray(faqs) || faqs.length === 0) return null;
  
  return (
    <div>
      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">{title}</h3>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            faq={faq}
            isOpen={openFaqIndex === index}
            onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
          />
        ))}
      </div>
    </div>
  );
};

const HelpCenterModal: React.FC<{
  isVisible: boolean;
  onClose: () => void;
  context: string;
}> = ({ isVisible, onClose, context }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  if (!isVisible) return null;

  const topic = helpContent[context] ?? helpContent.geral;
  const isSearching = searchQuery.trim().length > 0;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-gray-50 rounded-t-[2.5rem] w-full max-w-lg shadow-2xl border-t border-gray-100 animate-slide-up flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-5 border-b border-gray-100 flex justify-between items-center flex-shrink-0 bg-white rounded-t-[2.5rem]">
          <div className="flex items-center space-x-3">
            <Icon name="question-mark-circle" className="w-6 h-6 text-rose-500" />
            <h2 className="text-xl font-black text-gray-900">Central de Ajuda</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>

        <div className="p-6 overflow-y-auto space-y-8 no-scrollbar">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Icon name="search" className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Como podemos ajudar?"
              className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition shadow-sm"
            />
          </div>

          {!isSearching ? (
            <>
              <VideoTutorial title={topic.title} videoUrl={topic.videoTutorialUrl} />
              <FaqSection title="Dúvidas Frequentes" faqs={topic.faqs} />
            </>
          ) : (
             <div className="space-y-4">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Resultados da busca</h3>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                    {allFaqs.filter(f => f.question.toLowerCase().includes(searchQuery.toLowerCase())).map((faq, i) => (
                        <div key={i} className="p-4">
                            <span className="text-[9px] font-black text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-md uppercase mb-2 inline-block">{faq.category}</span>
                            <p className="font-bold text-gray-900 text-sm"><Highlight text={faq.question} highlight={searchQuery} /></p>
                            <p className="text-gray-500 text-xs mt-1 font-medium"><Highlight text={faq.answer} highlight={searchQuery} /></p>
                        </div>
                    ))}
                </div>
             </div>
          )}

          <footer className="text-center pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Suporte Direto</p>
            <p className="text-sm text-gray-600 mt-1 font-medium">ajuda@clser.app</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterModal;
