import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Camera, Mail, MessageCircle, Instagram, Music, Settings, Globe, Phone } from 'lucide-react';

interface HomeScreenProps {
  onOpenApp: () => void;
}

export default function HomeScreen({ onOpenApp }: HomeScreenProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Show notifications after 1.5 seconds
    const timer = setTimeout(() => {
      setShowNotifications(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const apps = [
    { name: 'WhatsApp', icon: MessageCircle, color: '#25D366' },
    { name: 'Instagram', icon: Instagram, color: '#E4405F' },
    { name: 'TikTok', icon: Music, color: '#000000' },
    { name: 'Gmail', icon: Mail, color: '#EA4335' },
    { name: 'Camera', icon: Camera, color: '#4285F4' },
    { name: 'Chrome', icon: Globe, color: '#4285F4' },
    { name: 'Phone', icon: Phone, color: '#34A853' },
    { name: 'Settings', icon: Settings, color: '#5F6368' },
  ];

  return (
    <div className="h-full bg-black relative overflow-hidden">
      {/* Radial gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(0, 255, 179, 0.08) 0%, transparent 60%)',
        }}
      />

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-[#00FFB3] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Time */}
      <div className="pt-16 pb-8 text-center animate-fade-in relative z-10">
        <div className="text-white text-7xl mb-2" style={{ fontFamily: 'system-ui' }}>
          {new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="text-white/50 text-lg">
          {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>

      {/* Push Notifications */}
      {showNotifications && (
        <div className="px-4 space-y-3 mb-8 animate-slide-down relative z-10">
          {/* First notification */}
          <motion.div
            className="bg-[#1A1A1A]/95 backdrop-blur-xl rounded-3xl p-4 border border-[#00FFB3]/30 shadow-2xl shadow-[#00FFB3]/20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-start gap-3">
              {/* Radar App Icon */}
              <div className="w-12 h-12 bg-gradient-to-br from-[#00FFB3] to-[#1DE3F2] rounded-2xl flex items-center justify-center flex-shrink-0 relative shadow-lg shadow-[#00FFB3]/50">
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-[#00FFB3]"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
                <div className="w-6 h-6 border-2 border-black rounded-full relative z-10" />
                <div className="absolute w-1 h-3 bg-black rotate-45 origin-bottom-left" style={{ bottom: '50%', left: '50%' }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/90 text-sm">RADAR</span>
                  <span className="text-white/50 text-xs">ahora</span>
                </div>
                <h4 className="text-white mb-1">📡 Nuevas conexiones detectadas</h4>
                <p className="text-white/70 text-sm">3 personas con intereses similares están cerca de ti</p>
              </div>
            </div>
          </motion.div>

          {/* Second notification */}
          <motion.div
            className="bg-[#1A1A1A]/95 backdrop-blur-xl rounded-3xl p-4 border border-[#FF005C]/30 shadow-2xl shadow-[#FF005C]/20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-start gap-3">
              {/* Radar App Icon */}
              <div className="w-12 h-12 bg-gradient-to-br from-[#00FFB3] to-[#1DE3F2] rounded-2xl flex items-center justify-center flex-shrink-0 relative shadow-lg shadow-[#00FFB3]/50">
                <div className="w-6 h-6 border-2 border-black rounded-full relative z-10" />
                <div className="absolute w-1 h-3 bg-black rotate-45 origin-bottom-left" style={{ bottom: '50%', left: '50%' }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/90 text-sm">RADAR</span>
                  <span className="text-white/50 text-xs">hace 2 min</span>
                </div>
                <h4 className="text-white mb-1">💬 Nuevo mensaje</h4>
                <p className="text-white/70 text-sm">Sofía te ha enviado un mensaje</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* App Grid */}
      <div className="px-8 grid grid-cols-4 gap-6 animate-scale-in relative z-10" style={{ animationDelay: '0.5s' }}>
        {/* Radar App - Special position */}
        <button
          onClick={onOpenApp}
          className="flex flex-col items-center gap-2 transition-all hover:scale-110 active:scale-95"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-[#00FFB3] via-[#1DE3F2] to-[#00FFB3] rounded-2xl shadow-2xl shadow-[#00FFB3]/50 flex items-center justify-center relative">
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-[#00FFB3]"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            <div className="w-8 h-8 border-2 border-black rounded-full relative z-10" />
            <div className="absolute w-1.5 h-4 bg-black rotate-45 origin-bottom-left" style={{ bottom: '50%', left: '50%' }} />
            {/* Notification badge */}
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF005C] text-white text-xs rounded-full flex items-center justify-center border-2 border-black shadow-lg shadow-[#FF005C]/50 animate-bounce">
              3
            </div>
          </div>
          <span className="text-white text-xs">RADAR</span>
        </button>

        {/* Other Apps */}
        {apps.map((app, index) => {
          const Icon = app.icon;
          return (
            <button
              key={app.name}
              className="flex flex-col items-center gap-2 transition-all hover:scale-110 active:scale-95 animate-scale-in"
              style={{ animationDelay: `${0.6 + index * 0.05}s` }}
            >
              <div
                className="w-16 h-16 rounded-2xl shadow-lg flex items-center justify-center"
                style={{ backgroundColor: app.color }}
              >
                <Icon className="w-8 h-8 text-white" />
              </div>
              <span className="text-white text-xs">{app.name}</span>
            </button>
          );
        })}
      </div>

      {/* Swipe up hint */}
      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center animate-bounce-slow relative z-10">
        <div className="text-white/50 text-sm mb-2">Toca RADAR para abrir</div>
        <div className="w-32 h-1 bg-[#00FFB3]/30 rounded-full" />
      </div>
    </div>
  );
}
