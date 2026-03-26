
import React, { useState, useEffect } from 'react';
import Icon from './Icon';

interface ToastProps {
  message: string | null;
  onDismiss: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, onDismiss, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Allow time for fade-out animation before dismissing
        setTimeout(onDismiss, 300);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [message, duration, onDismiss]);
  
  const toastClasses = `
    fixed top-5 left-1/2 -translate-x-1/2 z-[200]
    flex items-center space-x-3
    bg-white border border-rose-100 rounded-full
    py-2.5 px-6 shadow-2xl shadow-rose-500/10
    transition-all duration-300
    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
  `;

  if (!message) return null;
  
  return (
    <div className={toastClasses} role="alert" aria-live="assertive">
        <span className="font-bold text-rose-500">✨</span>
        <p className="text-sm font-bold text-gray-900">{message}</p>
    </div>
  );
};

export default Toast;
