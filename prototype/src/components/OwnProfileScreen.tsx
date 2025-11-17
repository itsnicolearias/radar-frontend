import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Settings, LogOut, Eye, EyeOff, Crown, X, Check, Zap, Radio, MapPin } from 'lucide-react';
import { SimpleButton } from './SimpleButton';
import { SimpleInput } from './SimpleInput';
import { SimpleBadge } from './SimpleBadge';
import { SimpleAvatar } from './SimpleAvatar';

export default function OwnProfileScreen({
  onBack,
  userPlan = 'free',
  onUpgrade
}: {
  onBack: () => void;
  userPlan?: 'free' | 'premium';
  onUpgrade?: () => void;
}) {
  const [name, setName] = useState('Tomás');
  const [age, setAge] = useState('27');
  const [bio, setBio] = useState('Amante del café y la fotografía. Siempre buscando nuevas aventuras.');
  const [country, setCountry] = useState('Argentina');
  const [province, setProvince] = useState('Buenos Aires');
  const [showAge, setShowAge] = useState(true);
  const [showBio, setShowBio] = useState(true);
  const [selectedInterests, setSelectedInterests] = useState(['Música', 'Café', 'Fotografía', 'Viajes']);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const availableInterests = [
    'Música', 'Café', 'Arte', 'Running', 'Fotografía', 'Viajes',
    'Gaming', 'Cine', 'Lectura', 'Deportes', 'Cocina', 'Tecnología'
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSave = () => {
    alert('✅ Cambios guardados correctamente');
  };

  return (
    <div className="h-full bg-black flex flex-col animate-slide-in-right relative overflow-hidden">
      {/* Radial gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(0, 255, 179, 0.05) 0%, transparent 50%)',
        }}
      />

      {/* Header */}
      <div className="bg-[#1A1A1A]/50 backdrop-blur-lg p-6 pb-8 border-b border-[#00FFB3]/20 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center transition-transform hover:scale-110 border border-[#00FFB3]/30"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-white flex-1 text-center">Mi Perfil</h2>
          <button className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center transition-transform hover:scale-110 border border-[#00FFB3]/30">
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide relative z-10">
        {/* Profile Picture */}
        <div className="flex flex-col items-center animate-scale-in">
          <div className="relative">
            <SimpleAvatar
              src=""
              alt={name}
              fallback={name[0]}
              className={`w-24 h-24 border-4 ${userPlan === 'premium' ? 'border-[#00FFB3]' : 'border-[#00FFB3]/50'}`}
            />
            {userPlan === 'premium' && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-[#00FFB3] to-[#1DE3F2] rounded-full flex items-center justify-center border-2 border-black shadow-lg shadow-[#00FFB3]/50">
                <Crown className="w-4 h-4 text-black" />
              </div>
            )}
            <button className={`absolute bottom-0 right-0 w-8 h-8 ${userPlan === 'premium' ? 'bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2]' : 'bg-[#1A1A1A] border border-[#00FFB3]/30'} rounded-full flex items-center justify-center shadow-lg`}>
              <Settings className={`w-4 h-4 ${userPlan === 'premium' ? 'text-black' : 'text-white'}`} />
            </button>
          </div>
          <button className={`mt-3 ${userPlan === 'premium' ? 'text-[#00FFB3]' : 'text-[#00FFB3]/70'} text-sm hover:text-[#00FFB3] transition-colors`}>
            Cambiar foto de perfil
          </button>
        </div>

        {/* Subscription Card */}
        <motion.div
          className={`rounded-2xl p-5 border ${
            userPlan === 'premium'
              ? 'bg-gradient-to-br from-[#00FFB3]/10 to-[#1DE3F2]/5 border-[#00FFB3]'
              : 'bg-[#1A1A1A] border-[#00FFB3]/30'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {userPlan === 'premium' ? (
                <Crown className="w-5 h-5 text-[#00FFB3]" />
              ) : (
                <Zap className="w-5 h-5 text-[#00FFB3]" />
              )}
              <h3 className="text-white">
                {userPlan === 'premium' ? 'Plan Premium' : 'Plan Free'}
              </h3>
            </div>
            {userPlan === 'premium' && (
              <span className="px-3 py-1 bg-[#00FFB3]/20 text-[#00FFB3] text-xs rounded-full border border-[#00FFB3]/30">
                Activo
              </span>
            )}
          </div>

          {/* Benefits */}
          <div className="space-y-2 mb-4">
            <div className="flex items-start gap-2">
              <MapPin className={`w-4 h-4 ${userPlan === 'premium' ? 'text-[#1DBF73]' : 'text-[#C5C5C5]'} mt-0.5 flex-shrink-0`} />
              <span className="text-[#C5C5C5] text-sm">
                Radio del radar: <span className={userPlan === 'premium' ? 'text-[#1DBF73]' : 'text-white'}>{userPlan === 'premium' ? '30 km' : '10 km'}</span>
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Radio className={`w-4 h-4 ${userPlan === 'premium' ? 'text-[#1DBF73]' : 'text-[#C5C5C5]'} mt-0.5 flex-shrink-0`} />
              <span className="text-[#C5C5C5] text-sm">
                Señales: <span className={userPlan === 'premium' ? 'text-[#1DBF73]' : 'text-white'}>{userPlan === 'premium' ? 'Ilimitadas' : '1 cada 24h'}</span>
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Check className={`w-4 h-4 ${userPlan === 'premium' ? 'text-[#1DBF73]' : 'text-[#C5C5C5]'} mt-0.5 flex-shrink-0`} />
              <span className="text-[#C5C5C5] text-sm">
                {userPlan === 'premium' ? 'Crear y destacar eventos' : 'Limitado a ver eventos'}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Eye className={`w-4 h-4 ${userPlan === 'premium' ? 'text-[#1DBF73]' : 'text-[#C5C5C5]'} mt-0.5 flex-shrink-0`} />
              <span className="text-[#C5C5C5] text-sm">
                {userPlan === 'premium' ? 'Ver quién vio tu perfil (ilimitado)' : 'Ver últimos 3 visitantes'}
              </span>
            </div>
          </div>

          {/* CTA Button */}
          {userPlan === 'free' ? (
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="w-full py-3 bg-gradient-to-r from-[#1DBF73] to-[#15a362] rounded-2xl text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Crown className="w-5 h-5" />
              Actualizar a Premium
            </button>
          ) : (
            <button
              onClick={() => setShowCancelModal(true)}
              className="w-full py-3 bg-[#0A0E12]/50 border border-[#E63946]/30 rounded-2xl text-[#E63946] hover:bg-[#E63946]/10 transition-all"
            >
              Cancelar suscripción
            </button>
          )}
        </motion.div>

        {/* Basic Info */}
        <div className="space-y-4 animate-slide-up">
          <div>
            <label className="block text-white mb-2">Nombre visible</label>
            <SimpleInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              className="w-full bg-[#0A0E12]/50 border-[#197387]/30 text-white placeholder-[#C5C5C5]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-white">Edad</label>
              <button
                onClick={() => setShowAge(!showAge)}
                className={`flex items-center gap-2 text-sm ${userPlan === 'premium' ? 'text-[#1DBF73]' : 'text-[#197387]'}`}
              >
                {showAge ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {showAge ? 'Visible' : 'Oculta'}
              </button>
            </div>
            <SimpleInput
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Edad (opcional)"
              type="number"
              className="w-full bg-[#0A0E12]/50 border-[#197387]/30 text-white placeholder-[#C5C5C5]"
            />
          </div>

          <div>
            <label className="block text-white mb-2">País</label>
            <SimpleInput
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Tu país"
              className="w-full bg-[#0A0E12]/50 border-[#197387]/30 text-white placeholder-[#C5C5C5]"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Provincia/Estado</label>
            <SimpleInput
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              placeholder="Tu provincia"
              className="w-full bg-[#0A0E12]/50 border-[#197387]/30 text-white placeholder-[#C5C5C5]"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="animate-slide-up-delay">
          <div className="flex items-center justify-between mb-2">
            <label className="text-white">Biografía</label>
            <button
              onClick={() => setShowBio(!showBio)}
              className={`flex items-center gap-2 text-sm ${userPlan === 'premium' ? 'text-[#1DBF73]' : 'text-[#197387]'}`}
            >
              {showBio ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {showBio ? 'Visible' : 'Oculta'}
            </button>
          </div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Contá un poco sobre vos..."
            className="w-full h-24 px-4 py-3 bg-[#0A0E12]/50 border border-[#197387]/30 rounded-xl text-white placeholder-[#C5C5C5] resize-none focus:outline-none focus:ring-2 focus:ring-[#197387] focus:border-transparent transition-all"
          />
        </div>

        {/* Interests */}
        <div className="animate-slide-up-delay-2">
          <label className="block text-white mb-3">Intereses</label>
          <div className="flex flex-wrap gap-2">
            {availableInterests.map((interest) => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <SimpleBadge
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? userPlan === 'premium'
                        ? 'bg-[#1DBF73] text-white hover:bg-[#15a362]'
                        : 'bg-[#197387] text-white hover:bg-[#15657a]'
                      : 'bg-[#0A0E12]/50 border border-[#197387]/30 text-[#C5C5C5] hover:bg-[#0A0E12]/80'
                  }`}
                >
                  {interest}
                </SimpleBadge>
              );
            })}
          </div>
        </div>

        {/* Logout Button */}
        <div className="pt-4 border-t border-[#197387]/20">
          <SimpleButton
            className="w-full h-12 rounded-full bg-[#0A0E12]/50 border border-[#197387]/30 hover:bg-[#0A0E12]/80 text-[#C5C5C5] hover:text-white transition-all duration-300"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Cerrar sesión
          </SimpleButton>
        </div>
      </div>

      {/* Save Button */}
      <div className="p-6 bg-[#0F2B33]/80 backdrop-blur-lg border-t border-[#197387]/20">
        <SimpleButton
          onClick={handleSave}
          className={`w-full h-14 rounded-full ${
            userPlan === 'premium'
              ? 'bg-gradient-to-r from-[#1DBF73] to-[#15a362] hover:shadow-lg'
              : 'bg-gradient-to-r from-[#197387] to-[#15657a] hover:shadow-lg'
          } text-white transition-all duration-300`}
        >
          Guardar cambios
        </SimpleButton>
      </div>

      {/* Upgrade Modal */}
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
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white">Actualizar a Premium</h3>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#1DBF73] to-[#15a362] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-10 h-10 text-white" />
                </div>
                <p className="text-[#C5C5C5] text-sm">
                  Desbloquea todas las funciones por
                </p>
                <div className="text-white text-4xl mt-2 mb-1">$3<span className="text-xl text-[#C5C5C5]">/mes</span></div>
              </div>

              <div className="bg-[#0A0E12]/50 rounded-2xl p-4 mb-6 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#1DBF73]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-[#1DBF73]" />
                  </div>
                  <div>
                    <p className="text-white text-sm">Mayor radio (30 km)</p>
                    <p className="text-[#C5C5C5] text-xs">Descubre más personas cercanas</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#1DBF73]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-[#1DBF73]" />
                  </div>
                  <div>
                    <p className="text-white text-sm">Señales ilimitadas</p>
                    <p className="text-[#C5C5C5] text-xs">Envía y responde sin límites</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#1DBF73]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-[#1DBF73]" />
                  </div>
                  <div>
                    <p className="text-white text-sm">Crear y destacar eventos</p>
                    <p className="text-[#C5C5C5] text-xs">Organiza encuentros con boosts</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#1DBF73]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-[#1DBF73]" />
                  </div>
                  <div>
                    <p className="text-white text-sm">Ver quién vio tu perfil</p>
                    <p className="text-[#C5C5C5] text-xs">Sin límites de visitantes</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  onUpgrade?.();
                }}
                className="w-full py-4 bg-gradient-to-r from-[#1DBF73] to-[#15a362] rounded-2xl text-white shadow-lg hover:shadow-xl transition-all mb-3"
              >
                Suscribirme con Mercado Pago
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

      {/* Cancel Subscription Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCancelModal(false)}
          >
            <motion.div
              className="bg-gradient-to-b from-[#0F2B33] to-[#0A0E12] rounded-3xl p-6 w-full max-w-sm border border-[#E63946]/30 shadow-2xl"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white">¿Cancelar Premium?</h3>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-[#C5C5C5] text-sm mb-6">
                Si cancelas tu suscripción, perderás acceso a:
              </p>

              <div className="bg-[#0A0E12]/50 rounded-2xl p-4 mb-6 space-y-2">
                <div className="flex items-center gap-2 text-[#C5C5C5] text-sm">
                  <X className="w-4 h-4 text-[#E63946]" />
                  <span>Señales ilimitadas</span>
                </div>
                <div className="flex items-center gap-2 text-[#C5C5C5] text-sm">
                  <X className="w-4 h-4 text-[#E63946]" />
                  <span>Radio de 30 km</span>
                </div>
                <div className="flex items-center gap-2 text-[#C5C5C5] text-sm">
                  <X className="w-4 h-4 text-[#E63946]" />
                  <span>Crear eventos</span>
                </div>
                <div className="flex items-center gap-2 text-[#C5C5C5] text-sm">
                  <X className="w-4 h-4 text-[#E63946]" />
                  <span>Ver visitantes ilimitados</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-3 bg-gradient-to-r from-[#1DBF73] to-[#15a362] rounded-2xl text-white shadow-lg hover:shadow-xl transition-all"
                >
                  Mantener Premium
                </button>
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    alert('Suscripción cancelada');
                  }}
                  className="flex-1 py-3 bg-[#0A0E12]/50 border border-[#E63946]/30 rounded-2xl text-[#E63946] hover:bg-[#E63946]/10 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
