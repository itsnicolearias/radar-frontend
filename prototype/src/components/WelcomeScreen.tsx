import { motion } from 'motion/react';
import { SimpleButton } from './SimpleButton';

interface WelcomeScreenProps {
  onRegister?: () => void;
  onLogin?: () => void;
}

export default function WelcomeScreen({ onRegister, onLogin }: WelcomeScreenProps) {
  return (
    <div className="h-full bg-black flex flex-col items-center justify-between p-8 relative overflow-hidden animate-fade-in">
      {/* Radial gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(0, 255, 179, 0.15) 0%, transparent 70%)',
        }}
      />

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-[#00FFB3] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center z-10">
        <div className="text-center animate-scale-in">
          {/* Radar icon animation */}
          <div className="w-48 h-48 mx-auto mb-8 relative">
            {/* Concentric circles */}
            {[1, 2, 3].map((ring) => (
              <motion.div
                key={ring}
                className="absolute border-2 rounded-full"
                style={{
                  width: `${100 - ring * 20}%`,
                  height: `${100 - ring * 20}%`,
                  top: `${ring * 10}%`,
                  left: `${ring * 10}%`,
                  borderColor: 'rgba(0, 255, 179, 0.3)',
                }}
                animate={{
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: ring * 0.3,
                  ease: 'easeInOut',
                }}
              />
            ))}

            {/* Sonar wave */}
            <motion.div
              className="absolute inset-0 border-2 border-[#00FFB3] rounded-full"
              animate={{
                scale: [0.3, 2],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />

            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-6 h-6 bg-[#FF005C] rounded-full shadow-lg shadow-[#FF005C]/50"
                animate={{
                  scale: [1, 1.2, 1],
                  boxShadow: [
                    '0 0 10px rgba(255, 0, 92, 0.5)',
                    '0 0 20px rgba(255, 0, 92, 0.8)',
                    '0 0 10px rgba(255, 0, 92, 0.5)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
            </div>

            {/* Scanning line */}
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              <div
                className="absolute top-1/2 left-1/2 w-[2px] h-24 origin-bottom"
                style={{
                  transformOrigin: 'bottom center',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(to top, transparent, rgba(0, 255, 179, 0.8), transparent)',
                }}
              />
            </motion.div>
          </div>

          <h1 className="text-white mb-4 animate-slide-up">
            RADAR
          </h1>

          <p className="text-white/90 text-center max-w-xs animate-slide-up-delay">
            Descubrí quién está cerca de vos en tiempo real
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full space-y-4 z-10 animate-slide-up-delay-2">
        <SimpleButton
          onClick={onRegister}
          className="w-full bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] hover:shadow-lg text-black h-14 rounded-full transition-all duration-300 shadow-[#00FFB3]/30"
        >
          Registrarme
        </SimpleButton>
        <SimpleButton
          onClick={onLogin}
          variant="outline"
          className="w-full bg-transparent border-2 border-[#00FFB3] text-[#00FFB3] hover:bg-[#00FFB3]/10 h-14 rounded-full transition-all duration-300"
        >
          Iniciar sesión
        </SimpleButton>
      </div>
    </div>
  );
}
