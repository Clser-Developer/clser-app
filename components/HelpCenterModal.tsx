import React, { useState, useMemo } from 'react';
import Icon from './Icon';
import { helpContent, allFaqs } from '../services/helpContent';
import type { FAQ } from '../types';

// --- Sub-componentes para melhor estrutura e resiliência ---

// Componente Highlight (já robusto, mantido)
const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const Highlight: React.FC<{ text: unknown; highlight: string }> = ({ text, highlight }) => {
  const safeText = typeof text === 'string' ? text : String(text ?? ''); // Ainda mais robusto
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
            <mark key={i} className="bg-orange-500/50 text-white rounded-sm px-0.5 py-0">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  } catch (error) {
    console.error('Error in Highlight component regex:', error);
    return <span>{safeText}</span>; // Fallback em caso de erro de regex
  }
};

// Extrator de ID de Vídeo do YouTube (já robusto, mantido)
const getYouTubeVideoId = (url: unknown): string | null => {
  if (typeof url !== 'string' || !url) return null;
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('youtube.com')) return urlObj.searchParams.get('v');
    if (urlObj.hostname.includes('youtu.be')) return urlObj.pathname.slice(1);
    return null;
  } catch (error) {
    return null; // Não registrar erros esperados como URLs inválidas
  }
};

// Item de Acordeão (para FAQs)
const AccordionItem: React.FC<{
  faq: FAQ;
  isOpen: boolean;
  onClick: () => void;
}> = ({ faq, isOpen, onClick }) => (
  <div className="border-b border-gray-700 last:border-b-0">
    <button
      onClick={onClick}
      className="w-full flex justify-between items-center text-left p-4 focus:outline-none"
      aria-expanded={isOpen}
    >
      <span className="font-semibold text-white">{faq.question ?? 'Pergunta indisponível'}</span>
      <Icon name="chevron-down" className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
    </button>
    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
      <div className="p-4 pt-0 text-gray-300">
        <p>{faq.answer ?? 'Resposta indisponível'}</p>
      </div>
    </div>
  </div>
);

// Seção para o Vídeo Tutorial
const VideoTutorial: React.FC<{ title: string; videoUrl: string }> = ({ title, videoUrl }) => {
  const videoId = getYouTubeVideoId(videoUrl);
  if (!videoId) return null; // Falha silenciosamente se não encontrar vídeo válido

  return (
    <div>
      <h3 className="text-md font-bold text-white mb-2">{title}</h3>
      <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="block group">
        <div className="relative rounded-lg overflow-hidden aspect-video bg-gray-900 flex items-center justify-center p-8">
            <img 
                src="https://i.ibb.co/gMQ8gKsd/logo-superfans.png" 
                alt="Superfans Logo"
                className="h-12 w-auto opacity-80 group-hover:opacity-100 transition-opacity" 
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Icon name="media" className="w-12 h-12 text-white/80" />
            </div>
        </div>
      </a>
    </div>
  );
};

// Seção para FAQs contextuais
const FaqSection: React.FC<{ title: string; faqs: FAQ[] }> = ({ title, faqs }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  if (!Array.isArray(faqs) || faqs.length === 0) {
    return null; // Não renderiza se 'faqs' não for um array válido
  }
  
  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };
  
  return (
    <div>
      <h3 className="text-md font-bold text-white mb-2">{title}</h3>
      <div className="bg-gray-900/50 rounded-lg border border-gray-700">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            faq={faq}
            isOpen={openFaqIndex === index}
            onClick={() => toggleFaq(index)}
          />
        ))}
      </div>
    </div>
  );
};

// Seção para Resultados de Busca
const SearchResults: React.FC<{ query: string }> = ({ query }) => {
  const filteredFaqs = useMemo(() => {
    if (!query.trim()) return [];
    const lowercasedQuery = query.toLowerCase();
    return allFaqs.filter(
      faq =>
        (faq.question && faq.question.toLowerCase().includes(lowercasedQuery)) ||
        (faq.answer && faq.answer.toLowerCase().includes(lowercasedQuery))
    );
  }, [query]);

  if (filteredFaqs.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-900/50 rounded-lg border border-gray-700">
        <p className="font-semibold text-white">Nenhum resultado encontrado</p>
        <p className="text-sm text-gray-400 mt-1">Tente usar outros termos na sua busca.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 rounded-lg border border-gray-700 divide-y divide-gray-700">
      {filteredFaqs.map((faq, index) => (
        <div key={index} className="p-4">
          <span className="text-[10px] font-bold text-orange-400 uppercase bg-orange-500/10 px-2 py-0.5 rounded-full">
            {faq.category}
          </span>
          <p className="font-semibold text-white mt-2">
            <Highlight text={faq.question} highlight={query} />
          </p>
          <p className="text-sm text-gray-300 mt-1">
            <Highlight text={faq.answer} highlight={query} />
          </p>
        </div>
      ))}
    </div>
  );
};

// Seção para Ajuda Geral (fallback)
const GeneralHelp: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const generalHelp = helpContent.geral;
  
  if (!generalHelp || !Array.isArray(generalHelp.faqs)) return null;

  const initialFaqs = generalHelp.faqs.slice(0, 2);
  const faqsToShow = isExpanded ? generalHelp.faqs : initialFaqs;
  
  return (
    <div>
      <h3 className="text-md font-bold text-white mb-2">Dúvidas Gerais</h3>
      <div className="bg-gray-900/50 rounded-lg border border-gray-700 divide-y divide-gray-700">
        {faqsToShow.map((faq, index) => (
          <div key={index} className="p-4">
            <p className="font-semibold text-white">{faq.question}</p>
            <p className="text-sm text-gray-300 mt-1">{faq.answer}</p>
          </div>
        ))}
      </div>
      {generalHelp.faqs.length > initialFaqs.length && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-3 text-center p-2 bg-gray-700 text-orange-400 font-semibold rounded-lg hover:bg-gray-600 transition-colors"
        >
          {isExpanded ? 'Ver menos' : 'Ver mais'}
        </button>
      )}
    </div>
  );
};


// --- Componente Principal do Modal ---
const HelpCenterModal: React.FC<{
  isVisible: boolean;
  onClose: () => void;
  context: string;
}> = ({ isVisible, onClose, context }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  if (!isVisible) return null;

  // Obtém o tópico atual de forma segura, com um fallback garantido.
  const topic = helpContent[context] ?? helpContent.geral;
  const isSearching = searchQuery.trim().length > 0;

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-gray-800 rounded-t-2xl w-full max-w-lg shadow-2xl border-t border-gray-700 animate-slide-up flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <header className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center space-x-3">
            <Icon name="question-mark-circle" className="w-6 h-6 text-orange-400" />
            <h2 className="text-lg font-bold text-white">Central de Ajuda</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-700">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>

        {/* Conteúdo Rolável */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Barra de Busca sempre visível */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Icon name="search" className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar em toda a Central de Ajuda..."
              className="w-full bg-gray-700 border border-gray-600 rounded-full py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-magenta-500 focus:border-transparent outline-none transition"
            />
          </div>

          {isSearching ? (
            <SearchResults query={searchQuery} />
          ) : (
            <>
              <VideoTutorial title={topic.title} videoUrl={topic.videoTutorialUrl} />
              <FaqSection title="Dúvidas Frequentes da Página" faqs={topic.faqs} />
              <GeneralHelp />
            </>
          )}

          <footer className="text-center pt-4 border-t border-gray-700/50">
            <p className="text-sm text-gray-500">Não encontrou o que procurava? Tente buscar acima.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterModal;