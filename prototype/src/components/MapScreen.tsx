import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Users, MessageCircle, User, Ghost, Radio, Crown, X, Send } from 'lucide-react';
import { SimpleAvatar } from './SimpleAvatar';

interface NearbyUser {
  id: number;
  name: string;
  image: string;
  distance: number;
  angle: number;
  hasSignal?: boolean;
  signal?: string;
  isPremium?: boolean;
  timestamp?: number;
}

interface UserSignal {
  id: number;
  userId: number;
  text: string;
  timestamp: number;
}

const initialUsers: NearbyUser[] = [
  { id: 1, name: 'Ana', image: '', distance: 120, angle: 45, hasSignal: true, signal: '¿Alguien más por acá? ☕', isPremium: false, timestamp: Date.now() - 1200000 },
  { id: 2, name: 'Carlos', image: '', distance: 80, angle: 120, hasSignal: false, isPremium: true },
  { id: 3, name: 'María', image: '', distance: 150, angle: 210, hasSignal: true, signal: 'Disponible para charlar', isPremium: true, timestamp: Date.now() - 600000 },
  { id: 4, name: 'Juan', image: '', distance: 95, angle: 300, hasSignal: false, isPremium: false },
  { id: 5, name: 'Laura', image: '', distance: 200, angle: 15, hasSignal: true, signal: 'En el parque 🎧', isPremium: false, timestamp: Date.now() - 300000 },
];

const additionalUsers: NearbyUser[] = [
  { id: 6, name: 'Pedro', image: '', distance: 110, angle: 180, hasSignal: false, isPremium: false },
  { id: 7, name: 'Lucía', image: '', distance: 140, angle: 270, hasSignal: true, signal: 'Buscando grupo 🚶‍♀️', isPremium: true, timestamp: Date.now() - 900000 },
  { id: 8, name: 'Martín', image: '', distance: 90, angle: 60, hasSignal: false, isPremium: false },
];

export default function MapScreen({
  onUserClick,
  onNavigate,
  userPlan = 'free'
}: {
  onUserClick: (user: NearbyUser) => void;
  onNavigate: (screen: string) => void;
  userPlan?: 'free' | 'premium';
}) {
  const [activeTab, setActiveTab] = useState('map');
  const [pingUser, setPingUser] = useState<number | null>(null);
  const [invisibleMode, setInvisibleMode] = useState(false);
  const [visibleUsers, setVisibleUsers] = useState<NearbyUser[]>(initialUsers);
  const [newUsers, setNewUsers] = useState<number[]>([]);
  const [selectedSignal, setSelectedSignal] = useState<NearbyUser | null>(null);
  const [showSendSignalModal, setShowSendSignalModal] = useState(false);
  const [signalText, setSignalText] = useState('');
  const [sendingSignal, setSendingSignal] = useState(false);
  const [nextSignalAvailable, setNextSignalAvailable] = useState(0);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  const signalsDetected = visibleUsers.filter(u => u.hasSignal).length;
  const canSendSignal = userPlan === 'premium' || nextSignalAvailable === 0;

  // Generate floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  // Animación: agregar nuevos usuarios gradualmente
  useEffect(() => {
    if (invisibleMode) return;

    const timer = setTimeout(() => {
      if (visibleUsers.length < initialUsers.length + additionalUsers.length) {
        const nextUser = additionalUsers[visibleUsers.length - initialUsers.length];
        if (nextUser) {
          setVisibleUsers(prev => [...prev, nextUser]);
          setNewUsers(prev => [...prev, nextUser.id]);
          setTimeout(() => {
            setNewUsers(prev => prev.filter(id => id !== nextUser.id));
          }, 2000);
        }
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [visibleUsers, invisibleMode]);

  const handleUserClick = (user: NearbyUser) => {
    setPingUser(user.id);
    setTimeout(() => {
      setPingUser(null);
      if (user.hasSignal) {
        setSelectedSignal(user);
      } else {
        onUserClick(user);
      }
    }, 600);
  };

  const handleSendSignal = () => {
    if (!canSendSignal || signalText.trim() === '') return;

    setSendingSignal(true);

    if (userPlan === 'free') {
      setNextSignalAvailable(24);
    }

    setTimeout(() => {
      setSendingSignal(false);
      setShowSendSignalModal(false);
      setSignalText('');
    }, 1500);
  };

  const toggleInvisibleMode = () => {
    setInvisibleMode(!invisibleMode);
  };

  const displayUsers = invisibleMode ? [] : visibleUsers;

  return (
    <div className="h-full bg-black flex flex-col relative overflow-hidden">
      {/* Floating particles background */}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-[#00FFB3] rounded-full opacity-30"
          style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.4, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Radial gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(0, 255, 179, 0.1) 0%, transparent 70%)',
        }}
      />

      {/* Header */}
      <div className="p-6 pb-4 relative z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-white text-center flex-1">RADAR</h2>

          {/* Premium badge if user is premium */}
          {userPlan === 'premium' && (
            <div className="absolute top-6 left-6 bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] rounded-full px-3 py-1 flex items-center gap-1.5 shadow-lg shadow-[#00FFB3]/50">
              <Crown className="w-3.5 h-3.5 text-black" />
              <span className="text-black text-xs">PREMIUM</span>
            </div>
          )}

          {/* Invisible Mode Toggle */}
          <button
            onClick={toggleInvisibleMode}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              invisibleMode
                ? 'bg-[#FF005C] text-white shadow-lg shadow-[#FF005C]/50 scale-110'
                : 'bg-[#1A1A1A] text-white/60 hover:bg-[#0D0D0D] border border-[#00FFB3]/30'
            }`}
          >
            <Ghost className="w-5 h-5" />
          </button>
        </div>

        {/* Invisible Mode Label */}
        {invisibleMode && (
          <div className="text-center mt-2 animate-slide-up">
            <span className="inline-block px-3 py-1 bg-[#FF005C]/20 text-[#FF005C] rounded-full text-sm border border-[#FF005C]/30">
              👻 Modo invisible activado
            </span>
          </div>
        )}

        {/* Signals counter */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[#C5C5C5] text-sm">
            Radio: <span className="text-[#00FFB3]">{userPlan === 'premium' ? '30 km' : '10 km'}</span>
          </span>
          <div className="px-3 py-1 bg-[#1A1A1A] rounded-full border border-[#FF005C]/30 flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-[#FF005C]" />
            <span className="text-[#FF005C] text-sm">Señales: {signalsDetected}</span>
          </div>
        </div>
      </div>

      {/* Radar Map */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        {/* Radar circles */}
        <div className="relative w-80 h-80">
          {/* Concentric circles */}
          {[1, 2, 3, 4].map((ring) => (
            <motion.div
              key={ring}
              className="absolute border border-[#00FFB3]/20 rounded-full"
              style={{
                width: `${ring * 25}%`,
                height: `${ring * 25}%`,
                top: `${50 - ring * 12.5}%`,
                left: `${50 - ring * 12.5}%`,
              }}
              animate={{
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: ring * 0.3,
                ease: 'easeInOut',
              }}
            />
          ))}

          {/* Sonar wave animation */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[#00FFB3]"
            animate={{
              scale: [0.3, 2.5],
              opacity: [0.6, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />

          {/* Scanning animation */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >
            <div
              className="absolute top-1/2 left-1/2 w-[2px] h-40 origin-bottom"
              style={{
                transformOrigin: 'bottom center',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(to top, transparent, rgba(0, 255, 179, 0.6), transparent)',
              }}
            />
          </motion.div>

          {/* Center avatar (current user) */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="relative">
              {/* Glow ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  width: '80px',
                  height: '80px',
                  marginLeft: '-8px',
                  marginTop: '-8px',
                  background: `radial-gradient(circle, ${userPlan === 'premium' ? 'rgba(0, 255, 179, 0.4)' : 'rgba(0, 255, 179, 0.3)'} 0%, transparent 70%)`,
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />

              {/* Avatar */}
              <div className="animate-scale-in relative z-10">
                <SimpleAvatar
                  src=""
                  alt="Tú"
                  fallback="Tú"
                  className="w-16 h-16 border-4 border-[#00FFB3] shadow-lg shadow-[#00FFB3]/50"
                />

                {/* Premium crown on user avatar */}
                {userPlan === 'premium' && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-[#00FFB3] to-[#1DE3F2] rounded-full flex items-center justify-center border-2 border-black shadow-lg shadow-[#00FFB3]/50">
                    <Crown className="w-3 h-3 text-black" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Nearby users */}
          {displayUsers.map((user, index) => {
            const x = Math.cos((user.angle * Math.PI) / 180) * user.distance;
            const y = Math.sin((user.angle * Math.PI) / 180) * user.distance;
            const isNew = newUsers.includes(user.id);

            return (
              <div
                key={user.id}
                className={`absolute top-1/2 left-1/2 cursor-pointer transition-transform hover:scale-110 ${
                  isNew ? 'animate-radar-blip' : 'animate-scale-in'
                }`}
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  animationDelay: isNew ? '0s' : `${0.5 + index * 0.1}s`
                }}
                onClick={() => handleUserClick(user)}
              >
                <div className="relative">
                  {/* Signal indicator - Concentric waves */}
                  {user.hasSignal && (
                    <>
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-[#FF005C]"
                        style={{
                          width: '56px',
                          height: '56px',
                          marginLeft: '-4px',
                          marginTop: '-4px',
                        }}
                        animate={{
                          scale: [1, 2],
                          opacity: [0.8, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeOut',
                        }}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-[#FF005C]"
                        style={{
                          width: '56px',
                          height: '56px',
                          marginLeft: '-4px',
                          marginTop: '-4px',
                        }}
                        animate={{
                          scale: [1, 2],
                          opacity: [0.8, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: 1,
                          ease: 'easeOut',
                        }}
                      />
                      {/* Glow effect */}
                      <motion.div
                        className="absolute inset-0 rounded-full blur-sm"
                        style={{
                          width: '56px',
                          height: '56px',
                          marginLeft: '-4px',
                          marginTop: '-4px',
                          background: 'radial-gradient(circle, rgba(255, 0, 92, 0.6) 0%, transparent 70%)',
                        }}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.6, 0.9, 0.6],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      />
                    </>
                  )}

                  <SimpleAvatar
                    src={user.image}
                    alt={user.name}
                    fallback={user.name[0]}
                    className={`w-12 h-12 border-2 ${
                      user.hasSignal ? 'border-[#FF005C] shadow-lg shadow-[#FF005C]/50' : 'border-[#00FFB3]/50'
                    }`}
                  />

                  {/* Ping animation */}
                  {pingUser === user.id && (
                    <>
                      <div className="absolute inset-0 border-2 border-[#1DE3F2] rounded-full animate-ping" />
                      <div className="absolute inset-0 border-2 border-[#1DE3F2] rounded-full animate-ping"
                           style={{ animationDelay: '0.2s' }} />
                    </>
                  )}

                  {/* New user pulse animation */}
                  {isNew && (
                    <>
                      <div className="absolute inset-0 border-2 border-[#00FFB3] rounded-full animate-ping" />
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        <span className="bg-[#00FFB3] text-black text-xs px-2 py-1 rounded-full shadow-lg">
                          ¡Nuevo!
                        </span>
                      </div>
                    </>
                  )}

                  {/* Signal indicator icon */}
                  {user.hasSignal && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF005C] border-2 border-black rounded-full flex items-center justify-center shadow-lg shadow-[#FF005C]/50"
                      animate={{
                        scale: [1, 1.3, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    >
                      <Radio className="w-2 h-2 text-white" />
                    </motion.div>
                  )}

                  {/* Premium crown */}
                  {user.isPremium && !user.hasSignal && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-[#00FFB3] to-[#1DE3F2] border-2 border-black rounded-full flex items-center justify-center shadow-lg">
                      <Crown className="w-2 h-2 text-black" />
                    </div>
                  )}

                  {/* Active status indicator */}
                  {!user.hasSignal && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#1DE3F2] border-2 border-black rounded-full shadow-lg shadow-[#1DE3F2]/50" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Send signal button */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20">
        <motion.button
          onClick={() => setShowSendSignalModal(true)}
          className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl ${
            canSendSignal
              ? 'bg-gradient-to-br from-[#00FFB3] to-[#1DE3F2] shadow-[#00FFB3]/50'
              : 'bg-[#1A1A1A] border border-[#00FFB3]/30'
          }`}
          whileHover={canSendSignal ? { scale: 1.1 } : {}}
          whileTap={canSendSignal ? { scale: 0.95 } : {}}
        >
          {/* Pulse rings */}
          {canSendSignal && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-[#00FFB3]"
                animate={{
                  scale: [1, 1.8],
                  opacity: [0.6, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-[#1DE3F2]"
                animate={{
                  scale: [1, 1.8],
                  opacity: [0.6, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: 0.75,
                }}
              />
            </>
          )}

          <Radio className={`w-8 h-8 ${canSendSignal ? 'text-black' : 'text-[#00FFB3]'} relative z-10`} />
        </motion.button>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-[#1A1A1A]/90 backdrop-blur-lg rounded-t-3xl px-6 py-4 shadow-lg border-t border-[#00FFB3]/20 relative z-10">
        <div className="flex items-center justify-around">
          <button
            onClick={() => { setActiveTab('map'); onNavigate('map'); }}
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${
              activeTab === 'map' ? 'text-[#00FFB3]' : 'text-[#C5C5C5]'
            }`}
          >
            <MapPin className="w-6 h-6" />
            <span className="text-xs">Radar</span>
          </button>

          <button
            onClick={() => { setActiveTab('chats'); onNavigate('chats'); }}
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${
              activeTab === 'chats' ? 'text-[#00FFB3]' : 'text-[#C5C5C5]'
            }`}
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs">Chats</span>
          </button>

          <button
            onClick={() => { setActiveTab('events'); onNavigate('events'); }}
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${
              activeTab === 'events' ? 'text-[#00FFB3]' : 'text-[#C5C5C5]'
            }`}
          >
            <Users className="w-6 h-6" />
            <span className="text-xs">Eventos</span>
          </button>

          <button
            onClick={() => { setActiveTab('profile'); onNavigate('profile'); }}
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${
              activeTab === 'profile' ? 'text-[#00FFB3]' : 'text-[#C5C5C5]'
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Perfil</span>
          </button>
        </div>
      </div>

      {/* Send signal modal */}
      <AnimatePresence>
        {showSendSignalModal && (
          <motion.div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#1A1A1A] rounded-3xl p-6 w-full max-w-sm border border-[#00FFB3]/30 shadow-2xl shadow-[#00FFB3]/20"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white">Enviar Señal</h3>
                <button
                  onClick={() => setShowSendSignalModal(false)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sonar animation preview */}
              {sendingSignal && (
                <div className="mb-4 h-32 relative overflow-hidden rounded-2xl bg-black/50 flex items-center justify-center">
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-[#00FFB3]"
                    animate={{
                      scale: [0.5, 3],
                      opacity: [0.8, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      ease: 'easeOut',
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-[#FF005C]"
                    animate={{
                      scale: [0.5, 3],
                      opacity: [0.8, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: 0.3,
                      ease: 'easeOut',
                    }}
                  />
                  <span className="text-white relative z-10">🌊 Enviando señal...</span>
                </div>
              )}

              {!sendingSignal && (
                <>
                  {/* Input */}
                  <div className="mb-4">
                    <textarea
                      value={signalText}
                      onChange={e => e.target.value.length <= 100 && setSignalText(e.target.value)}
                      placeholder="Escribe tu mensaje temporal..."
                      className="w-full h-24 bg-black/50 border border-[#00FFB3]/30 rounded-2xl px-4 py-3 text-white placeholder-white/40 resize-none focus:outline-none focus:border-[#00FFB3]"
                      maxLength={100}
                    />
                    <div className="text-right mt-2 text-[#C5C5C5] text-sm">
                      {signalText.length}/100
                    </div>
                  </div>

                  {/* Quick suggestions */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    {['¿Alguien más por acá?', 'Disponible para charlar ☕', 'En el parque 🎧'].map(
                      suggestion => (
                        <button
                          key={suggestion}
                          onClick={() => setSignalText(suggestion)}
                          className="px-3 py-1.5 bg-black/50 border border-[#00FFB3]/30 rounded-full text-white/70 hover:text-white hover:border-[#00FFB3] transition-all text-sm"
                        >
                          {suggestion}
                        </button>
                      )
                    )}
                  </div>

                  {/* Send button */}
                  <button
                    onClick={handleSendSignal}
                    disabled={signalText.trim() === ''}
                    className={`w-full py-3 rounded-2xl flex items-center justify-center gap-2 transition-all ${
                      signalText.trim() === ''
                        ? 'bg-[#1A1A1A] border border-[#00FFB3]/20 text-white/30'
                        : 'bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] text-black shadow-lg hover:shadow-xl shadow-[#00FFB3]/50'
                    }`}
                  >
                    <Send className="w-5 h-5" />
                    {userPlan === 'free' ? 'Enviar señal (1/día)' : 'Enviar Señal'}
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Signal detail modal */}
      <AnimatePresence>
        {selectedSignal && (
          <motion.div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedSignal(null)}
          >
            <motion.div
              className="bg-[#1A1A1A] rounded-3xl p-6 w-full max-w-sm border border-[#FF005C]/30 shadow-2xl shadow-[#FF005C]/20"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={e => e.stopPropagation()}
            >
              {/* User info */}
              <div className="text-center mb-6">
                <div className="relative inline-block mb-3">
                  <SimpleAvatar
                    src={selectedSignal.image}
                    alt={selectedSignal.name}
                    fallback={selectedSignal.name[0]}
                    className="w-20 h-20 mx-auto border-4 border-[#FF005C] shadow-lg shadow-[#FF005C]/50"
                  />
                  {selectedSignal.isPremium && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-[#00FFB3] to-[#1DE3F2] rounded-full flex items-center justify-center border-2 border-black shadow-lg">
                      <Crown className="w-3 h-3 text-black" />
                    </div>
                  )}
                </div>
                <h4 className="text-white mb-1">{selectedSignal.name}</h4>
                <p className="text-[#C5C5C5] text-sm">{selectedSignal.distance}m de distancia</p>
              </div>

              {/* Signal message */}
              <div className="bg-black/50 rounded-2xl p-4 mb-4 border border-[#FF005C]/20">
                <div className="flex items-start gap-2 mb-2">
                  <Radio className="w-4 h-4 text-[#FF005C] mt-0.5 flex-shrink-0" />
                  <p className="text-white/90">{selectedSignal.signal}</p>
                </div>
                <p className="text-[#C5C5C5] text-xs">
                  Hace {selectedSignal.timestamp ? Math.floor((Date.now() - selectedSignal.timestamp) / 60000) : 0} min
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {userPlan === 'premium' ? (
                  <button className="flex-1 py-3 bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] rounded-2xl text-black hover:shadow-lg transition-shadow shadow-[#00FFB3]/50">
                    Responder señal
                  </button>
                ) : (
                  <button className="flex-1 py-3 bg-black/50 border border-[#00FFB3]/30 rounded-2xl text-[#C5C5C5] text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <Crown className="w-4 h-4 text-[#00FFB3]" />
                      <span>Premium para responder</span>
                    </div>
                  </button>
                )}
                <button className="px-4 py-3 bg-black/50 border border-[#00FFB3]/30 rounded-2xl text-white hover:border-[#00FFB3] transition-colors">
                  Ver perfil
                </button>
              </div>

              {/* Close hint */}
              <button
                onClick={() => setSelectedSignal(null)}
                className="w-full mt-4 text-[#C5C5C5] text-sm hover:text-white transition-colors"
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
