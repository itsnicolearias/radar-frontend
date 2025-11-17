import { useState } from 'react';
import { motion } from 'motion/react';
import { SimpleButton } from './SimpleButton';
import { Mail, Check } from './Icons';

export default function VerificationScreen({ onComplete }: { onComplete: () => void }) {
  const [isVerified, setIsVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleResend = () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      alert('✉️ Correo de verificación enviado');
    }, 1500);
  };

  const handleComplete = () => {
    setIsVerified(true);
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  return (
    <div className="h-full bg-black flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Radial gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(0, 255, 179, 0.15) 0%, transparent 70%)',
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
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="max-w-sm w-full z-10">
        {/* Icon */}
        <div className="flex justify-center mb-8 animate-scale-in">
          <div className="relative">
            <motion.div
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${
                isVerified
                  ? 'bg-gradient-to-br from-[#00FFB3] to-[#1DE3F2] shadow-lg shadow-[#00FFB3]/50'
                  : 'bg-[#1A1A1A] backdrop-blur-sm border-4 border-[#00FFB3]/30'
              }`}
              animate={isVerified ? {
                scale: [1, 1.1, 1],
              } : {}}
              transition={{ duration: 0.5 }}
            >
              {isVerified ? (
                <Check className="w-12 h-12 text-black animate-scale-in" />
              ) : (
                <Mail className="w-12 h-12 text-[#00FFB3]" />
              )}
            </motion.div>
            {!isVerified && (
              <motion.div
                className="absolute inset-0 border-4 border-[#00FFB3] rounded-full"
                animate={{
                  scale: [1, 1.3],
                  opacity: [0.5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
            )}
          </div>
        </div>

        {/* Title and Description */}
        <div className="text-center mb-8 animate-slide-up">
          <h2 className="text-white mb-3">
            {isVerified ? '¡Verificado!' : 'Verificá tu correo'}
          </h2>
          <p className="text-white/80">
            {isVerified
              ? 'Tu cuenta ha sido verificada correctamente. Ya podés usar RADAR.'
              : 'Te enviamos un email de verificación a tu casilla. Hacé clic en el enlace para activar el radar.'}
          </p>
        </div>

        {/* Status */}
        <div className={`mb-8 p-4 rounded-2xl backdrop-blur-sm transition-all duration-500 animate-slide-up-delay ${
          isVerified
            ? 'bg-[#00FFB3]/10 border-2 border-[#00FFB3]'
            : 'bg-[#1A1A1A] border-2 border-[#00FFB3]/30'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-white">Estado de verificación</span>
            <div className={`px-3 py-1 rounded-full text-sm transition-all duration-500 ${
              isVerified
                ? 'bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] text-black'
                : 'bg-[#1A1A1A] border border-[#00FFB3]/30 text-white'
            }`}>
              {isVerified ? (
                <span className="flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  Verificada
                </span>
              ) : (
                'Pendiente'
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        {!isVerified ? (
          <div className="space-y-3 animate-slide-up-delay-2">
            <SimpleButton
              onClick={handleResend}
              disabled={isResending}
              className="w-full h-14 rounded-full bg-[#1A1A1A] backdrop-blur-sm text-white border border-[#00FFB3]/30 hover:bg-[#1A1A1A]/80 transition-all duration-300 disabled:opacity-50"
            >
              {isResending ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-[#00FFB3] rounded-full animate-spin" />
                  Enviando...
                </div>
              ) : (
                'Reenviar correo de verificación'
              )}
            </SimpleButton>

            {/* Demo button - simula verificación */}
            <SimpleButton
              onClick={handleComplete}
              className="w-full h-14 rounded-full bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] text-black hover:shadow-lg transition-all duration-300 shadow-[#00FFB3]/30"
            >
              Simular verificación (Demo)
            </SimpleButton>

            <p className="text-center text-white/60 text-sm mt-4">
              ¿No recibiste el correo? Revisá tu carpeta de spam
            </p>
          </div>
        ) : (
          <SimpleButton
            onClick={onComplete}
            className="w-full h-14 rounded-full bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] text-black hover:shadow-lg transition-all duration-300 shadow-[#00FFB3]/30 animate-scale-in"
          >
            Continuar a RADAR
          </SimpleButton>
        )}
      </div>
    </div>
  );
}
