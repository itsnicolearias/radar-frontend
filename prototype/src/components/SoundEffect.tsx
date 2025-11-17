import { useEffect, useState } from 'react';

interface SoundEffectProps {
  type: 'radar-blip' | 'message-ping' | 'scan' | 'connection-click';
  trigger?: boolean;
}

export default function SoundEffect({ type, trigger }: SoundEffectProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 500);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  if (!show) return null;

  const getEffectLabel = () => {
    switch (type) {
      case 'radar-blip':
        return '🔊 BLIP';
      case 'message-ping':
        return '🔔 PING';
      case 'scan':
        return '📡 SCAN';
      case 'connection-click':
        return '✨ CLICK';
      default:
        return '';
    }
  };

  return (
    <div className="fixed top-4 left-4 z-50 animate-fade-in">
      <div className="bg-[#3EC8A7]/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs shadow-lg">
        {getEffectLabel()}
      </div>
    </div>
  );
}
