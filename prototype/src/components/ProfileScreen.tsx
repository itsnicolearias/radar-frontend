import { motion } from 'motion/react';
import { ArrowLeft, MapPin, MessageCircle, Heart } from './Icons';
import { SimpleButton } from './SimpleButton';
import { SimpleBadge } from './SimpleBadge';
import { PlaceholderImage } from './PlaceholderImage';

interface ProfileScreenProps {
  user: {
    name: string;
    image: string;
    distance: number;
  };
  onBack: () => void;
  onMessage: () => void;
}

export default function ProfileScreen({ user, onBack, onMessage }: ProfileScreenProps) {
  const interests = ['Música', 'Café', 'Arte', 'Running', 'Fotografía', 'Viajes'];

  return (
    <div className="h-full bg-black flex flex-col animate-slide-in-right relative overflow-hidden">
      {/* Radial gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(0, 255, 179, 0.08) 0%, transparent 60%)',
        }}
      />

      {/* Header with back button */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={onBack}
          className="w-10 h-10 bg-[#1A1A1A]/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 border border-[#00FFB3]/30"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Profile Image */}
      <div className="relative h-96 bg-gradient-to-b from-[#00FFB3] to-[#197387]">
        <PlaceholderImage
          alt={user.name}
          text={user.name}
          color="#197387"
          className="w-full h-full animate-scale-in"
        />

        {/* Distance badge */}
        <motion.div
          className="absolute bottom-4 left-4 bg-[#1A1A1A]/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 border border-[#00FFB3]/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <MapPin className="w-4 h-4 text-[#00FFB3]" />
          <span className="text-white">{user.distance}m de distancia</span>
        </motion.div>
      </div>

      {/* Profile Info */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto scrollbar-hide relative z-10">
        <div className="animate-slide-up">
          <h2 className="text-white mb-2">{user.name}, 26</h2>
          <p className="text-[#C5C5C5] flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#00FFB3]" />
            Buenos Aires, Palermo
          </p>
        </div>

        <div className="animate-slide-up-delay">
          <h3 className="text-white mb-3">Intereses</h3>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest, index) => (
              <motion.div
                key={interest}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.4 + index * 0.08,
                  type: 'spring',
                  stiffness: 200
                }}
              >
                <SimpleBadge
                  variant="secondary"
                  className="bg-[#00FFB3]/10 text-[#00FFB3] hover:bg-[#00FFB3]/20 px-4 py-2 cursor-default transition-all hover:scale-105 border border-[#00FFB3]/30"
                >
                  {interest}
                </SimpleBadge>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="animate-slide-up-delay-2">
          <h3 className="text-white mb-2">Sobre mí</h3>
          <p className="text-[#C5C5C5]">
            Me encanta explorar cafés nuevos, descubrir música indie y correr por los parques de la ciudad.
            Siempre buscando buenas conversaciones y nuevas experiencias. 🎵☕️🏃‍♂️
          </p>
        </div>

        <div className="animate-slide-up-delay-2">
          <h3 className="text-white mb-2">¿Qué estoy buscando?</h3>
          <p className="text-[#C5C5C5]">
            Me gustaría conocer gente con quien compartir actividades, desde un café hasta salir a correr o
            explorar eventos culturales.
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="p-6 bg-[#1A1A1A]/50 backdrop-blur-lg border-t border-[#00FFB3]/20 flex gap-3 relative z-10">
        <SimpleButton
          onClick={onMessage}
          className="flex-1 h-14 rounded-full bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] hover:shadow-lg text-black transition-all shadow-[#00FFB3]/30 flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          Enviar mensaje
        </SimpleButton>

        <button
          className="w-14 h-14 rounded-full bg-[#1A1A1A] border-2 border-[#FF005C] hover:bg-[#FF005C]/10 flex items-center justify-center transition-all group"
        >
          <Heart className="w-6 h-6 text-[#FF005C] group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
}
