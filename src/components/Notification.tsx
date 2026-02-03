import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useState, useEffect } from 'react';

export interface NotificationProps {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}

interface NotificationItemProps extends NotificationProps {
  onClose: (id: string) => void;
}

function NotificationItem({ id, type, title, message, duration = 5000, onClose }: NotificationItemProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const getStyles = () => {
    const styles = {
      success: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: 'text-green-600',
        text: 'text-green-800',
        title: 'text-green-900'
      },
      error: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: 'text-red-600',
        text: 'text-red-800',
        title: 'text-red-900'
      },
      info: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'text-blue-600',
        text: 'text-blue-800',
        title: 'text-blue-900'
      },
      warning: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        icon: 'text-yellow-600',
        text: 'text-yellow-800',
        title: 'text-yellow-900'
      }
    };
    return styles[type];
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const styles = getStyles();

  return (
    <div
      className={`${styles.bg} border ${styles.border} rounded-lg p-4 shadow-lg animate-slideIn`}
      role="alert"
    >
      <div className="flex items-start space-x-3">
        <div className={styles.icon}>{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold ${styles.title}`}>{title}</h3>
          <p className={`text-sm ${styles.text} mt-1`}>{message}</p>
        </div>
        <button
          onClick={() => onClose(id)}
          className={`flex-shrink-0 ${styles.icon} hover:opacity-75 transition-opacity`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {duration > 0 && (
        <div className={`mt-2 h-1 ${styles.border} rounded-full overflow-hidden`}>
          <div
            className={`h-full ${
              type === 'success' ? 'bg-green-600' :
              type === 'error' ? 'bg-red-600' :
              type === 'warning' ? 'bg-yellow-600' :
              'bg-blue-600'
            }`}
            style={{
              animation: `shrink ${duration}ms linear forwards`
            }}
          />
        </div>
      )}
    </div>
  );
}

interface NotificationContainerProps {
  notifications: NotificationItemProps[];
  onClose: (id: string) => void;
}

export function NotificationContainer({ notifications, onClose }: NotificationContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 max-w-md">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          {...notification}
          onClose={onClose}
        />
      ))}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItemProps[]>([]);

  const addNotification = (
    type: 'success' | 'error' | 'info' | 'warning',
    title: string,
    message: string,
    duration?: number
  ) => {
    const id = `notification-${Date.now()}-${Math.random()}`;
    const notification: NotificationItemProps = {
      id,
      type,
      title,
      message,
      duration,
      onClose: () => {}
    };

    setNotifications((prev) => [...prev, notification]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const onClose = (id: string) => {
    removeNotification(id);
  };

  return {
    notifications: notifications.map(n => ({ ...n, onClose })),
    addNotification,
    removeNotification,
    NotificationContainer: () => (
      <NotificationContainer notifications={notifications.map(n => ({ ...n, onClose }))} onClose={onClose} />
    )
  };
}
