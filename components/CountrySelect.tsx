
import React, { useState, useRef, useEffect } from 'react';
import Icon from './Icon';

const countries = [
  { code: 'BR', name: 'Brazil', ddi: '+55', flag: '🇧🇷' },
  { code: 'US', name: 'United States', ddi: '+1', flag: '🇺🇸' },
  { code: 'PT', name: 'Portugal', ddi: '+351', flag: '🇵🇹' },
  { code: 'AR', name: 'Argentina', ddi: '+54', flag: '🇦🇷' },
  { code: 'GB', name: 'United Kingdom', ddi: '+44', flag: '🇬🇧' },
];

interface CountrySelectProps {
  selectedDDI: string;
  onDDIChange: (ddi: string) => void;
}

const CountrySelect: React.FC<CountrySelectProps> = ({ selectedDDI, onDDIChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCountry = countries.find(c => c.ddi === selectedDDI) || countries[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (ddi: string) => {
    onDDIChange(ddi);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-300 mb-1">DDI</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-gray-700 border border-gray-600 rounded-md p-3 text-white focus:ring-magenta-500 focus:border-magenta-500"
      >
        <span className="flex items-center">
          <span className="mr-2">{selectedCountry.flag}</span>
          <span>{selectedCountry.ddi}</span>
        </span>
        <Icon name="chevron-down" className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
          {countries.map(country => (
            <button
              key={country.code}
              type="button"
              onClick={() => handleSelect(country.ddi)}
              className="w-full text-left flex items-center px-4 py-2 text-sm text-white hover:bg-magenta-500/20"
            >
              <span className="mr-3">{country.flag}</span>
              <span className="flex-1">{country.name}</span>
              <span className="text-gray-400">{country.ddi}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CountrySelect;
