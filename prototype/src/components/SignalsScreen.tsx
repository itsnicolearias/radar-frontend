import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Zap, Trophy, Send, Radio, Crown, Clock } from 'lucide-react';
import { SimpleAvatar } from './SimpleAvatar';

interface UserSignal {
  id: number;
  name: string;
  image: string;
  distance: number;
  angle: number;
  signal: string;
  timestamp: number;
  hasSignal: boolean;
  responses: number;
  isPremium: boolean;
}

interface Achievement {
  id: string;
  name: string;
  icon: string;
  earned: boolean;
}

const mockUsers: UserSignal[] = [
  { id: 1, name: 'Ana', image: '', distance: 100, angle: 30, signal: '¿Alguien más por acá? ☕', timestamp: Date.now() - 1200000, hasSignal: true, responses: 2, isPremium: false },
  { id: 2, name: 'Carlos', image: '', distance: 80, angle: 120, signal: 'Disponible para charlar', timestamp: Date.now() - 600000, hasSignal: true, responses: 1, isPremium: true },
  { id: 3, name: 'María', image: '', distance: 130, angle: 200, signal: '', timestamp: 0, hasSignal: false, responses: 0, isPremium: false },
  { id: 4, name: 'Juan', image: '', distance: 110, angle: 280, signal: 'En el parque 🎧', timestamp: Date.now() - 300000, hasSignal: true, responses: 3, isPremium: false },
  { id: 5, name: 'Laura', image: '', distance: 90, angle: 350, signal: '', timestamp: 0, hasSignal: false, responses: 0, isPremium: true },
];

const initialAchievements: Achievement[] = [
  { id: 'explorer', name: 'Explorador activo', icon: '🔍', earned: false },
  { id: 'popular', name: 'Eco popular', icon: '⭐', earned: false },
  { id: 'social', name: 'Conector social', icon: '🌊', earned: false },
];

export default function SignalsScreen({
  onBack,
  userPlan = 'free'
}: {
  onBack: () => void;
  userPlan?: 'free' | 'premium';
}) {
  const [showModal, setShowModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [signalText, setSignalText] = useState('');
  const [sonarEnergy, setSonarEnergy] = useState(userPlan === 'premium' ? 100 : 80);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [sentSignals, setSentSignals] = useState(3);
  const [receivedEchoes, setReceivedEchoes] = useState(5);
  const [selectedUser, setSelectedUser] = useState<UserSignal | null>(null);
  const [showEchoEffect, setShowEchoEffect] = useState(false);
  const [sendingSignal, setSendingSignal] = useState(false);
  const [users, setUsers] = useState<UserSignal[]>(mockUsers);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  // Free user: time until next signal
  const [nextSignalAvailable, setNextSignalAvailable] = useState<number>(0); // hours remaining
  const canSendSignal = userPlan === 'premium' || nextSignalAvailable === 0;

  // Generate floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  // Recharge sonar energy over time
  useEffect(() => {
    const interval = setInterval(() => {
      if (userPlan === 'premium') {
        setSonarEnergy(100); // Always 100 for premium
      } else {
        setSonarEnergy(prev => Math.min(100, prev + 5));
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [userPlan]);

  // Count down to next signal for free users
  useEffect(() => {
    if (userPlan === 'free' && nextSignalAvailable > 0) {
      const interval = setInterval(() => {
        setNextSignalAvailable(prev => Math.max(0, prev - 1));
      }, 3600000); // Every hour
      return () => clearInterval(interval);
    }
  }, [userPlan, nextSignalAvailable]);

  // Check achievements
  useEffect(() => {
    const newAchievements = [...achievements];
    if (sentSignals >= 5 && !newAchievements[0].earned) {
      newAchievements[0].earned = true;
    }
    if (receivedEchoes >= 3 && !newAchievements[1].earned) {
      newAchievements[1].earned = true;
    }
    setAchievements(newAchievements);
  }, [sentSignals, receivedEchoes]);

  // Simulate echo response
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setShowEchoEffect(true);
        setReceivedEchoes(prev => prev + 1);
        setTimeout(() => setShowEchoEffect(false), 1500);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSendSignal = () => {
    if (!canSendSignal || signalText.trim() === '') return;

    setSendingSignal(true);
    setSentSignals(prev => prev + 1);

    // Set cooldown for free users
    if (userPlan === 'free') {
      setNextSignalAvailable(24);
    }

    setTimeout(() => {
      setSendingSignal(false);
      setShowModal(false);
      setSignalText('');
    }, 1500);
  };

  const handleOpenModal = () => {
    if (userPlan === 'free' && nextSignalAvailable > 0) {
      setShowUpgradeModal(true);
    } else {
      setShowModal(true);
    }
  };

  const handleUserClick = (user: UserSignal) => {
    setSelectedUser(user);
  };

  return (
    <div className="h-full bg-gradient-to-b from-[#0A0E12] via-[#0F2B33] to-[#0A0E12] flex flex-col relative overflow-hidden">
      {/* Floating particles background */}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-[#197387] rounded-full opacity-40"
          style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
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

      {/* Header */}
      <div className="p-6 pb-4 relative z-10">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-white/70 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-white text-center flex-1">Señales del Radar</h2>
          {userPlan === 'premium' && (
            <div className="bg-gradient-to-r from-[#1DBF73] to-[#15a362] rounded-full px-3 py-1 flex items-center gap-1.5 shadow-lg">
              <Crown className="w-3.5 h-3.5 text-white" />
              <span className="text-white text-xs">PRO</span>
            </div>
          )}
          {userPlan === 'free' && <div className="w-6" />}
        </div>

        {/* Stats bar */}
        <div className="mt-4 flex items-center justify-between gap-4">
          {/* Signal status for free users */}
          {userPlan === 'free' && (
            <div className="flex-1 bg-[#0A0E12]/50 rounded-full p-3 border border-[#197387]/30">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-[#197387]" />
                <span className="text-white/70 text-xs">Próxima señal</span>
              </div>
              <div className="text-[#197387] text-sm">
                {nextSignalAvailable === 0 ? '¡Disponible!' : `En ${nextSignalAvailable}h`}
              </div>
            </div>
          )}

          {/* Sonar energy for premium */}
          {userPlan === 'premium' && (
            <div className="flex-1 bg-[#0A0E12]/50 rounded-full p-3 border border-[#1DBF73]/30">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-[#1DBF73]" />
                <span className="text-white/70 text-xs">Señales</span>
                <span className="text-[#1DBF73] text-xs ml-auto">Ilimitadas</span>
              </div>
              <div className="h-1.5 bg-[#0A0E12]/50 rounded-full overflow-hidden">
                <div className="h-full w-full bg-gradient-to-r from-[#1DBF73] to-[#15a362]" />
              </div>
            </div>
          )}

          {/* Achievements button */}
          <button className="bg-[#0A0E12]/50 rounded-full p-3 border border-[#197387]/30 relative">
            <Trophy className="w-5 h-5 text-[#197387]" />
            {achievements.filter(a => a.earned).length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E63946] rounded-full text-white text-xs flex items-center justify-center">
                {achievements.filter(a => a.earned).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Radar view */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="relative w-80 h-80">
          {/* Sonar wave rings */}
          {[1, 2, 3, 4, 5].map((ring, idx) => (
            <motion.div
              key={ring}
              className="absolute border border-[#197387]/20 rounded-full"
              style={{
                width: `${ring * 20}%`,
                height: `${ring * 20}%`,
                top: `${50 - ring * 10}%`,
                left: `${50 - ring * 10}%`,
              }}
              animate={{
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: idx * 0.3,
                ease: 'easeInOut',
              }}
            />
          ))}

          {/* Expanding sonar waves */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[#197387]"
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
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[#1DBF73]"
            animate={{
              scale: [0.3, 2.5],
              opacity: [0.6, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: 1,
              ease: 'easeOut',
            }}
          />

          {/* Echo effect overlay */}
          <AnimatePresence>
            {showEchoEffect && (
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-[#E63946]"
                initial={{ scale: 2, opacity: 0 }}
                animate={{ scale: 0.5, opacity: [0, 0.8, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
              />
            )}
          </AnimatePresence>

          {/* Scanning line */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          >
            <div
              className="absolute top-1/2 left-1/2 w-[2px] h-40 origin-bottom"
              style={{
                transformOrigin: 'bottom center',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(to top, transparent, rgba(25, 115, 135, 0.6), transparent)',
              }}
            />
          </motion.div>

          {/* Center user (submarine) */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <motion.div
              className="relative"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* Glow rings */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  width: '80px',
                  height: '80px',
                  marginLeft: '-8px',
                  marginTop: '-8px',
                  background: `radial-gradient(circle, ${userPlan === 'premium' ? 'rgba(29, 191, 115, 0.3)' : 'rgba(25, 115, 135, 0.3)'} 0%, transparent 70%)`,
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0.2, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />

              <SimpleAvatar
                src=""
                alt="Tú"
                fallback="🎯"
                className={`w-16 h-16 border-4 ${userPlan === 'premium' ? 'border-[#1DBF73]' : 'border-[#197387]'} shadow-lg ${userPlan === 'premium' ? 'shadow-[#1DBF73]/50' : 'shadow-[#197387]/50'}`}
              />

              {/* Premium crown */}
              {userPlan === 'premium' && (
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-[#1DBF73] to-[#15a362] rounded-full flex items-center justify-center shadow-lg border-2 border-[#0A0E12]">
                  <Crown className="w-4 h-4 text-white" />
                </div>
              )}

              {/* Active ping indicator */}
              {canSendSignal && (
                <motion.div
                  className={`absolute -top-2 -right-2 w-6 h-6 ${userPlan === 'premium' ? 'bg-[#1DBF73]' : 'bg-[#197387]'} rounded-full flex items-center justify-center shadow-lg`}
                  animate={{
                    scale: [1, 1.2, 1],
                    boxShadow: [
                      `0 0 10px ${userPlan === 'premium' ? 'rgba(29, 191, 115, 0.5)' : 'rgba(25, 115, 135, 0.5)'}`,
                      `0 0 20px ${userPlan === 'premium' ? 'rgba(29, 191, 115, 0.8)' : 'rgba(25, 115, 135, 0.8)'}`,
                      `0 0 10px ${userPlan === 'premium' ? 'rgba(29, 191, 115, 0.5)' : 'rgba(25, 115, 135, 0.5)'}`,
                    ],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                >
                  <Radio className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Users with signals */}
          {users.map((user, index) => {
            const x = Math.cos((user.angle * Math.PI) / 180) * user.distance;
            const y = Math.sin((user.angle * Math.PI) / 180) * user.distance;

            return (
              <motion.div
                key={user.id}
                className="absolute top-1/2 left-1/2 cursor-pointer z-10"
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.5 + index * 0.1,
                  type: 'spring',
                  stiffness: 200,
                }}
                whileHover={{ scale: 1.15 }}
                onClick={() => handleUserClick(user)}
              >
                <div className="relative">
                  {/* Signal bubble glow */}
                  {user.hasSignal && (
                    <motion.div
                      className="absolute inset-0 rounded-full blur-md"
                      style={{
                        width: '56px',
                        height: '56px',
                        marginLeft: '-4px',
                        marginTop: '-4px',
                        background: 'radial-gradient(circle, rgba(25, 115, 135, 0.6) 0%, transparent 70%)',
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
                  )}

                  {/* User avatar */}
                  <SimpleAvatar
                    src={user.image}
                    alt={user.name}
                    fallback={user.name[0]}
                    className={`w-12 h-12 border-2 ${
                      user.hasSignal ? 'border-[#197387]' : 'border-white/30'
                    } relative z-10`}
                  />

                  {/* Active signal indicator */}
                  {user.hasSignal && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-4 h-4 bg-[#197387] border-2 border-[#0A0E12] rounded-full"
                      animate={{
                        scale: [1, 1.3, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    />
                  )}

                  {/* Premium badge */}
                  {user.isPremium && !user.hasSignal && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-[#1DBF73] to-[#15a362] border-2 border-[#0A0E12] rounded-full flex items-center justify-center">
                      <Crown className="w-2 h-2 text-white" />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Send signal button (sonar ping) */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20">
        <motion.button
          onClick={handleOpenModal}
          className={`relative w-20 h-20 rounded-full flex items-center justify-center shadow-2xl ${
            canSendSignal
              ? userPlan === 'premium'
                ? 'bg-gradient-to-br from-[#1DBF73] to-[#15a362]'
                : 'bg-gradient-to-br from-[#197387] to-[#15657a]'
              : 'bg-gray-600'
          }`}
          whileHover={canSendSignal ? { scale: 1.1 } : {}}
          whileTap={canSendSignal ? { scale: 0.95 } : {}}
        >
          {/* Pulse rings */}
          {canSendSignal && (
            <>
              <motion.div
                className={`absolute inset-0 rounded-full border-2 ${userPlan === 'premium' ? 'border-[#1DBF73]' : 'border-[#197387]'}`}
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
                className={`absolute inset-0 rounded-full border-2 ${userPlan === 'premium' ? 'border-[#1DBF73]' : 'border-[#197387]'}`}
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

          <Radio className="w-10 h-10 text-white relative z-10" />
        </motion.button>
      </div>

      {/* Bottom stats */}
      <div className="bg-[#0F2B33]/80 backdrop-blur-lg rounded-t-3xl px-6 py-4 border-t border-[#197387]/20 relative z-10">
        <div className="flex items-center justify-around text-center">
          <div>
            <div className="text-[#197387] text-2xl">{sentSignals}</div>
            <div className="text-[#C5C5C5] text-xs mt-1">Señales enviadas</div>
          </div>
          <div className="w-px h-12 bg-white/10" />
          <div>
            <div className="text-[#1DBF73] text-2xl">{receivedEchoes}</div>
            <div className="text-[#C5C5C5] text-xs mt-1">Ecos recibidos</div>
          </div>
          <div className="w-px h-12 bg-white/10" />
          <div>
            <div className="text-[#197387] text-2xl">{achievements.filter(a => a.earned).length}</div>
            <div className="text-[#C5C5C5] text-xs mt-1">Insignias</div>
          </div>
        </div>

        {/* Achievements preview */}
        {achievements.filter(a => a.earned).length > 0 && (
          <motion.div
            className="mt-4 flex gap-2 justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {achievements
              .filter(a => a.earned)
              .map(achievement => (
                <motion.div
                  key={achievement.id}
                  className="px-3 py-1.5 bg-gradient-to-r from-[#197387]/20 to-[#1DBF73]/20 rounded-full border border-[#197387]/30 flex items-center gap-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <span className="text-lg">{achievement.icon}</span>
                  <span className="text-white/80 text-xs">{achievement.name}</span>
                </motion.div>
              ))}
          </motion.div>
        )}
      </div>

      {/* Send signal modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-b from-[#0F2B33] to-[#0A0E12] rounded-3xl p-6 w-full max-w-sm border border-[#197387]/30 shadow-2xl"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white">Enviar Señal</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sonar animation preview */}
              {sendingSignal && (
                <div className="mb-4 h-32 relative overflow-hidden rounded-2xl bg-[#0A0E12]/50 flex items-center justify-center">
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-[#197387]"
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
                    className="absolute inset-0 rounded-full border-2 border-[#1DBF73]"
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
                      className="w-full h-24 bg-[#0A0E12]/50 border border-[#197387]/30 rounded-2xl px-4 py-3 text-white placeholder-white/40 resize-none focus:outline-none focus:border-[#197387]"
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
                          className="px-3 py-1.5 bg-[#0A0E12]/50 border border-[#197387]/30 rounded-full text-white/70 hover:text-white hover:border-[#197387] transition-all text-sm"
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
                        ? 'bg-gray-600 text-white/50'
                        : userPlan === 'premium'
                        ? 'bg-gradient-to-r from-[#1DBF73] to-[#15a362] text-white shadow-lg hover:shadow-xl'
                        : 'bg-gradient-to-r from-[#197387] to-[#15657a] text-white shadow-lg hover:shadow-xl'
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

      {/* Upgrade modal for free users */}
      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowUpgradeModal(false)}
          >
            <motion.div
              className="bg-gradient-to-b from-[#0F2B33] to-[#0A0E12] rounded-3xl p-6 w-full max-w-sm border border-[#1DBF73]/30 shadow-2xl"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#1DBF73] to-[#15a362] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white mb-2">Límite de señales alcanzado</h3>
                <p className="text-[#C5C5C5] text-sm">
                  Podrás enviar una nueva señal en {nextSignalAvailable} horas
                </p>
              </div>

              <div className="bg-[#0A0E12]/50 rounded-2xl p-4 mb-6">
                <p className="text-white text-sm mb-3">Con Premium desbloqueas:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-[#C5C5C5] text-sm">
                    <span className="text-[#1DBF73]">✓</span>
                    <span>Señales ilimitadas</span>
                  </li>
                  <li className="flex items-start gap-2 text-[#C5C5C5] text-sm">
                    <span className="text-[#1DBF73]">✓</span>
                    <span>Responder a señales de otros</span>
                  </li>
                  <li className="flex items-start gap-2 text-[#C5C5C5] text-sm">
                    <span className="text-[#1DBF73]">✓</span>
                    <span>Radio de radar 30 km</span>
                  </li>
                </ul>
              </div>

              <button className="w-full py-3 bg-gradient-to-r from-[#1DBF73] to-[#15a362] rounded-2xl text-white shadow-lg hover:shadow-xl transition-all mb-3">
                Actualizar a Premium - $3/mes
              </button>

              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full py-2 text-[#C5C5C5] text-sm hover:text-white transition-colors"
              >
                Tal vez después
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User detail modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              className="bg-gradient-to-b from-[#0F2B33] to-[#0A0E12] rounded-3xl p-6 w-full max-w-sm border border-[#197387]/30 shadow-2xl"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white">Señal Detectada</h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User info */}
              <div className="text-center mb-6">
                <div className="relative inline-block mb-3">
                  <SimpleAvatar
                    src={selectedUser.image}
                    alt={selectedUser.name}
                    fallback={selectedUser.name[0]}
                    className="w-20 h-20 mx-auto border-4 border-[#197387]"
                  />
                  {selectedUser.isPremium && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-[#1DBF73] to-[#15a362] rounded-full flex items-center justify-center border-2 border-[#0A0E12] shadow-lg">
                      <Crown className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <h4 className="text-white mb-1">{selectedUser.name}</h4>
                <p className="text-[#C5C5C5] text-sm">{selectedUser.distance}m de distancia</p>
              </div>

              {/* Signal message */}
              {selectedUser.hasSignal && (
                <div className="bg-[#0A0E12]/50 rounded-2xl p-4 mb-4 border border-[#197387]/20">
                  <p className="text-white/90">{selectedUser.signal}</p>
                  <p className="text-[#C5C5C5] text-xs mt-2">
                    Hace {Math.floor((Date.now() - selectedUser.timestamp) / 60000)} min
                  </p>
                </div>
              )}

              {/* Response stats */}
              {selectedUser.hasSignal && selectedUser.responses > 0 && (
                <div className="bg-[#197387]/10 rounded-2xl p-3 mb-4 flex items-center gap-2">
                  <span className="text-[#197387]">🌊</span>
                  <span className="text-white/80 text-sm">
                    {selectedUser.responses} persona{selectedUser.responses !== 1 ? 's' : ''} respondió
                    {selectedUser.responses !== 1 ? 'eron' : ''}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                {userPlan === 'premium' ? (
                  <button className="flex-1 py-3 bg-gradient-to-r from-[#197387] to-[#15657a] rounded-2xl text-white hover:shadow-lg transition-shadow">
                    Responder
                  </button>
                ) : (
                  <button className="flex-1 py-3 bg-[#0A0E12]/50 border border-[#197387]/30 rounded-2xl text-[#C5C5C5] text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <Crown className="w-4 h-4 text-[#1DBF73]" />
                      <span>Premium para responder</span>
                    </div>
                  </button>
                )}
                <button className="px-4 py-3 bg-[#0A0E12]/50 border border-[#197387]/30 rounded-2xl text-white hover:border-[#197387] transition-colors">
                  👋
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Echo notification */}
      <AnimatePresence>
        {showEchoEffect && (
          <motion.div
            className="absolute top-24 left-1/2 -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
          >
            <div className="bg-gradient-to-r from-[#E63946] to-[#ff5a63] rounded-2xl px-6 py-3 shadow-2xl border border-white/20">
              <p className="text-white flex items-center gap-2">
                <span className="text-xl">🌊</span>
                Tu señal fue recibida por alguien cercano
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
