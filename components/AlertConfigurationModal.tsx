
import React, { useState } from 'react';
import { PurchasedTicket } from '../types';
import Icon from './Icon';

interface AlertConfigurationModalProps {
  ticket: PurchasedTicket | null;
  onClose: () => void;
  onSetAlert: (purchaseId: string) => void;
}

const reminderOptions = [
    { label: '1 Hora', value: '1h', trigger: '-PT1H' },
    { label: '2 Horas', value: '2h', trigger: '-PT2H' },
    { label: '1 Dia', value: '1d', trigger: '-P1D' },
    { label: '3 Dias', value: '3d', trigger: '-P3D' },
    { label: '1 Semana', value: '1w', trigger: '-P1W' },
];

const AlertConfigurationModal: React.FC<AlertConfigurationModalProps> = ({ ticket, onClose, onSetAlert }) => {
    const [selectedReminder, setSelectedReminder] = useState(reminderOptions[2]); // Default to 1 day

    if (!ticket) return null;

    // Helper to format date for calendar links (YYYYMMDDTHHMMSSZ)
    const formatCalendarDate = (eventDate: string, eventTime: string, durationHours: number = 0): string => {
        const months: { [key: string]: number } = { 'JAN': 0, 'FEV': 1, 'MAR': 2, 'ABR': 3, 'MAI': 4, 'JUN': 5, 'JUL': 6, 'AGO': 7, 'SET': 8, 'OUT': 9, 'NOV': 10, 'DEZ': 11 };
        const [day, monthStr, year] = eventDate.split(' ');
        const [hour, minute] = eventTime.split(':');
        const date = new Date(Date.UTC(parseInt(year), months[monthStr.toUpperCase()], parseInt(day), parseInt(hour), parseInt(minute)));
        if (durationHours > 0) {
            date.setUTCHours(date.getUTCHours() + durationHours);
        }
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const handleCalendarClick = (calendarType: 'google' | 'outlook' | 'ics') => {
        onSetAlert(ticket.purchaseId);
        
        const startDate = new Date(`${ticket.date.replace(/(\d{2}) (\w{3}) (\d{4})/, '$2 $1 $3')} ${ticket.time}`);
        const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Assume 2-hour duration

        const eventDetails = {
            title: encodeURIComponent(ticket.name),
            location: encodeURIComponent(ticket.fullAddress),
            description: encodeURIComponent(`Ingresso para o show de ${ticket.name}. Detalhes em seu app Clser.`),
            start: startDate.toISOString().replace(/-|:|\.\d+/g, ''),
            end: endDate.toISOString().replace(/-|:|\.\d+/g, ''),
        };

        let url = '';

        if (calendarType === 'google') {
            url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${eventDetails.title}&dates=${eventDetails.start}/${eventDetails.end}&details=${eventDetails.description}&location=${eventDetails.location}`;
        } else if (calendarType === 'outlook') {
            url = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${eventDetails.title}&startdt=${eventDetails.start}&enddt=${eventDetails.end}&location=${eventDetails.location}&body=${eventDetails.description}`;
        }

        if (calendarType === 'ics') {
            const icsData = [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'BEGIN:VEVENT',
                `DTSTART:${formatCalendarDate(ticket.date, ticket.time)}`,
                `DTEND:${formatCalendarDate(ticket.date, ticket.time, 2)}`,
                `SUMMARY:${ticket.name}`,
                `DESCRIPTION:Ingresso para o show de ${ticket.name}. Detalhes em seu app Clser.`,
                `LOCATION:${ticket.fullAddress}`,
                'BEGIN:VALARM',
                `TRIGGER:${selectedReminder.trigger}`,
                'ACTION:DISPLAY',
                'DESCRIPTION:Lembrete',
                'END:VALARM',
                'END:VEVENT',
                'END:VCALENDAR',
            ].join('\r\n');

            const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${ticket.name.replace(/ /g, '_')}.ics`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            onClose();
            return;
        }

        window.open(url, '_blank');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[120] flex items-end justify-center" aria-modal="true" role="dialog">
          <div className="bg-white rounded-t-[2.5rem] w-full max-w-md shadow-2xl border-t border-gray-100 animate-slide-up flex flex-col">
            <header className="p-4 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-[2.5rem]">
              <h2 className="text-lg font-bold text-gray-900 ml-4">Lembrete do Show</h2>
              <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100">
                <Icon name="close" className="w-6 h-6" />
              </button>
            </header>
            <div className="p-6 space-y-8 pb-10">
                <div>
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Quando te lembrar?</h3>
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {reminderOptions.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => setSelectedReminder(opt)}
                                className={`px-4 py-2.5 rounded-xl border-2 text-xs font-black transition-all whitespace-nowrap shadow-sm ${selectedReminder.value === opt.value ? 'bg-rose-500 text-white border-rose-500 scale-105 shadow-md' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Exportar para Agenda</h3>
                    <div className="space-y-3">
                         <button onClick={() => handleCalendarClick('google')} className="w-full bg-gray-50 border border-gray-100 text-gray-900 font-bold py-4 px-4 rounded-2xl hover:bg-white hover:border-rose-300 transition-all text-sm flex items-center justify-between group">
                            <span className="group-hover:text-rose-600">Google Calendar</span>
                            <Icon name="chevron-right" className="w-4 h-4 text-gray-300" />
                        </button>
                        <button onClick={() => handleCalendarClick('outlook')} className="w-full bg-gray-50 border border-gray-100 text-gray-900 font-bold py-4 px-4 rounded-2xl hover:bg-white hover:border-blue-300 transition-all text-sm flex items-center justify-between group">
                            <span className="group-hover:text-blue-600">Outlook Agenda</span>
                            <Icon name="chevron-right" className="w-4 h-4 text-gray-300" />
                        </button>
                        <button onClick={() => handleCalendarClick('ics')} className="w-full bg-gray-900 text-white font-black py-4 px-4 rounded-2xl hover:bg-black transition-all text-sm flex items-center justify-center space-x-2 shadow-xl active:scale-95">
                            <Icon name="document-text" className="w-5 h-5" />
                            <span>Download arquivo .ICS</span>
                        </button>
                    </div>
                </div>
            </div>
          </div>
        </div>
      );
};

export default AlertConfigurationModal;
