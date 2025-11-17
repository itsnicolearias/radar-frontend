import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from './Icons';

interface NotificationToastProps {
  title: string;
  message: string;
  onClose?: () => void;
  duration?: number;
}

export default function NotificationToast({
  title,
  message,
  onClose,
  duration = 4000
}: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute top-12 left-4 right-4 z-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <div className="bg-[#1A1A1A]/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-[#00FFB3]/20 p-4 flex items-start gap-3 border border-[#00FFB3]/30">
            {/* App Icon */}
            <div className="w-10 h-10 bg-gradient-to-br from-[#00FFB3] to-[#1DE3F2] rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#00FFB3]/50 relative">
              <motion.div
                className="absolute inset-0 rounded-lg border-2 border-[#00FFB3]"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
              <div className="w-5 h-5 border-2 border-black rounded-full relative z-10" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[#00FFB3] text-xs">RADAR</span>
                <span className="text-white/50 text-xs">ahora</span>
              </div>
              <h4 className="text-white mb-1 truncate">{title}</h4>
              <p className="text-white/70 text-sm">{message}</p>
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-white/50 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Helper component for showing notifications
export function NotificationDemo() {
  const [notifications, setNotifications] = useState<Array<{id: number; title: string; message: string}>>([]);
  const [nextId, setNextId] = useState(1);

  const showNotification = (title: string, message: string) => {
    const id = nextId;
    setNextId(id + 1);
    setNotifications(prev => [...prev, { id, title, message }]);
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return {
    notifications,
    showNotification,
    removeNotification
  };
}
