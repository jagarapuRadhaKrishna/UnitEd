import React, { createContext, useContext, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { AnimatePresence, motion } from 'framer-motion';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: var(--z-toast);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const NotificationItem = styled(motion.div)<{ type: Notification['type'] }>`
  min-width: 300px;
  max-width: 500px;
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  background: ${props => {
    switch (props.type) {
      case 'success':
        return 'var(--color-success)';
      case 'error':
        return 'var(--color-error)';
      case 'warning':
        return 'var(--color-warning)';
      case 'info':
      default:
        return 'var(--color-primary)';
    }
  }};
  color: var(--color-text-light);
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  opacity: 0.7;
  transition: opacity var(--transition-normal);

  &:hover {
    opacity: 1;
  }
`;

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = ({ type, message, duration = 5000 }: Omit<Notification, 'id'>) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, type, message }]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, showNotification, removeNotification }}>
      {children}
      <NotificationContainer>
        <AnimatePresence>
          {notifications.map(notification => (
            <NotificationItem
              key={notification.id}
              type={notification.type}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.2 }}
            >
              <span>{notification.message}</span>
              <CloseButton onClick={() => removeNotification(notification.id)}>×</CloseButton>
            </NotificationItem>
          ))}
        </AnimatePresence>
      </NotificationContainer>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};