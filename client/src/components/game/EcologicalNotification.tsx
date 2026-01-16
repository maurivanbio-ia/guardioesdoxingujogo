import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'success' | 'failure' | 'info';
  species?: 'expansa' | 'unifilis' | 'sextuberculata';
  message: string;
  duration?: number;
}

interface Props {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export function EcologicalNotification({ notifications, onDismiss }: Props) {
  return (
    <div className="fixed top-20 right-4 z-[200] flex flex-col gap-3 pointer-events-none">
      {notifications.map((notification) => (
        <NotificationCard 
          key={notification.id} 
          notification={notification}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
}

function NotificationCard({ notification, onDismiss }: { notification: Notification; onDismiss: (id: string) => void }) {
  const [isExiting, setIsExiting] = useState(false);
  
  useEffect(() => {
    // Use custom duration if provided, otherwise default to 5000ms
    const duration = notification.duration !== undefined ? notification.duration : 5000;
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onDismiss(notification.id), 300);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [notification.id, notification.duration, onDismiss]);
  
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" strokeWidth={2.5} />;
      case 'failure':
        return <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" strokeWidth={2.5} />;
      case 'info':
        return <Info className="w-6 h-6 text-blue-400 flex-shrink-0" strokeWidth={2.5} />;
    }
  };
  
  const getSpeciesName = () => {
    switch (notification.species) {
      case 'expansa':
        return 'P. expansa';
      case 'unifilis':
        return 'P. unifilis';
      case 'sextuberculata':
        return 'P. sextuberculata';
      default:
        return '';
    }
  };
  
  const getBgColor = () => {
    switch (notification.type) {
      case 'success':
        return 'from-green-900/95 to-emerald-900/95 border-green-500/50';
      case 'failure':
        return 'from-red-900/95 to-rose-900/95 border-red-500/50';
      case 'info':
        return 'from-blue-900/95 to-cyan-900/95 border-blue-500/50';
    }
  };
  
  return (
    <div 
      className={`
        pointer-events-auto
        bg-gradient-to-br ${getBgColor()}
        backdrop-blur-md rounded-2xl p-4 border-2 shadow-2xl
        min-w-[320px] max-w-[400px]
        transform transition-all duration-300
        ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
      `}
    >
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          {notification.species && (
            <p className="text-white font-bold text-sm mb-1 italic">
              {getSpeciesName()}
            </p>
          )}
          <p className="text-white/90 text-sm leading-relaxed">
            {notification.message}
          </p>
        </div>
      </div>
    </div>
  );
}
