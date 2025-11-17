import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, MapPin, Users, Clock, Filter, Plus, X, Zap, Crown, Send } from 'lucide-react';
import { SimpleBadge } from './SimpleBadge';
import { SimpleButton } from './SimpleButton';
import { PlaceholderImage } from './PlaceholderImage';

interface Event {
  id: number;
  name: string;
  location: string;
  attendees: number;
  time: string;
  distance: string;
  category: string;
  isBoosted?: boolean;
  createdBy?: string;
}

const events: Event[] = [
  {
    id: 1,
    name: 'Indie Rock Night',
    location: 'Club Niceto, Palermo',
    attendees: 47,
    time: 'Hoy, 22:00',
    distance: '1.2 km',
    category: 'Música',
    isBoosted: true,
    createdBy: 'premium',
  },
  {
    id: 2,
    name: 'Feria Gastronómica',
    location: 'Plaza Serrano',
    attendees: 89,
    time: 'Hoy, 18:00',
    distance: '0.5 km',
    category: 'Gastronomía',
    isBoosted: false,
  },
  {
    id: 3,
    name: 'After Office en Terraza',
    location: 'Sky Bar, Recoleta',
    attendees: 34,
    time: 'Hoy, 19:30',
    distance: '2.1 km',
    category: 'Social',
    isBoosted: false,
  },
  {
    id: 4,
    name: 'Meetup de Fotografía',
    location: 'Puerto Madero',
    attendees: 23,
    time: 'Mañana, 16:00',
    distance: '3.5 km',
    category: 'Arte',
    isBoosted: true,
    createdBy: 'premium',
  },
];

export default function EventsScreen({
  onBack,
  userPlan = 'free'
}: {
  onBack: () => void;
  userPlan?: 'free' | 'premium';
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [eventName, setEventName] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [wantBoost, setWantBoost] = useState(false);

  const filters = ['Todos', 'Música', 'Gastronomía', 'Social', 'Arte', 'Deportes'];

  const handleCreateEvent = () => {
    if (userPlan === 'free') {
      setShowUpgradeModal(true);
      return;
    }
    setShowCreateModal(true);
  };

  const handlePublishEvent = () => {
    // Simular creación de evento
    alert(`✅ Evento creado${wantBoost ? ' con Boost' : ''}`);
    setShowCreateModal(false);
    setEventName('');
    setEventLocation('');
    setEventDate('');
    setEventTime('');
    setEventDescription('');
    setWantBoost(false);
  };

  const filteredEvents = selectedFilter === 'Todos'
    ? events
    : events.filter(e => e.category === selectedFilter);

  return (
    <div className="h-full bg-black flex flex-col animate-slide-in-right relative overflow-hidden">
      {/* Radial gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 20%, rgba(0, 255, 179, 0.08) 0%, transparent 60%)',
        }}
      />

      {/* Header */}
      <div className="bg-[#1A1A1A]/50 backdrop-blur-lg p-6 pb-4 relative z-10 border-b border-[#00FFB3]/20">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center transition-transform hover:scale-110 border border-[#00FFB3]/30"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-white flex-1 text-center">Eventos Cercanos</h2>
          <button className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center transition-transform hover:scale-110 border border-[#00FFB3]/30">
            <Filter className="w-5 h-5 text-[#00FFB3]" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {filters.map((filter) => (
            <SimpleBadge
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 whitespace-nowrap cursor-pointer transition-all ${
                selectedFilter === filter
                  ? 'bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] text-black'
                  : 'bg-[#1A1A1A] border border-[#00FFB3]/30 text-[#C5C5C5] hover:text-white'
              }`}
            >
              {filter}
            </SimpleBadge>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide relative z-10">
        {filteredEvents.map((event, index) => (
          <motion.div
            key={event.id}
            className={`rounded-2xl p-5 transition-all cursor-pointer ${
              event.isBoosted
                ? 'bg-gradient-to-br from-[#00FFB3]/10 to-[#1DE3F2]/5 border-2 border-[#00FFB3] shadow-lg shadow-[#00FFB3]/20'
                : 'bg-[#1A1A1A] border border-[#00FFB3]/20 hover:border-[#00FFB3]/50'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Boosted badge */}
            {event.isBoosted && (
              <div className="flex items-center gap-2 mb-3">
                <motion.div
                  className="px-3 py-1 bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] rounded-full flex items-center gap-1.5 shadow-lg shadow-[#00FFB3]/50"
                  animate={{
                    boxShadow: [
                      '0 0 15px rgba(0, 255, 179, 0.5)',
                      '0 0 25px rgba(0, 255, 179, 0.8)',
                      '0 0 15px rgba(0, 255, 179, 0.5)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <Zap className="w-3.5 h-3.5 text-black" />
                  <span className="text-black text-xs">BOOSTED</span>
                </motion.div>
              </div>
            )}

            {/* Event Image */}
            <div className="mb-4 rounded-xl overflow-hidden">
              <PlaceholderImage
                width={320}
                height={160}
                text={event.name}
                className="w-full h-40 object-cover"
              />
            </div>

            {/* Event Info */}
            <div className="space-y-3">
              <div>
                <h3 className="text-white mb-1">{event.name}</h3>
                <div className="flex items-center gap-2 text-[#C5C5C5] text-sm">
                  <MapPin className="w-4 h-4 text-[#00FFB3]" />
                  <span>{event.location}</span>
                  <span className="text-[#00FFB3]">• {event.distance}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-[#C5C5C5]">
                    <Clock className="w-4 h-4 text-[#1DE3F2]" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#C5C5C5]">
                    <Users className="w-4 h-4 text-[#1DE3F2]" />
                    <span>{event.attendees}</span>
                  </div>
                </div>

                <SimpleBadge className="px-3 py-1 bg-[#00FFB3]/20 text-[#00FFB3] border border-[#00FFB3]/30">
                  {event.category}
                </SimpleBadge>
              </div>

              <SimpleButton className="w-full h-10 rounded-xl bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] hover:shadow-lg text-black transition-all shadow-[#00FFB3]/30">
                Me interesa ❤️
              </SimpleButton>
            </div>
          </motion.div>
        ))}

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#C5C5C5]">No hay eventos en esta categoría</p>
          </div>
        )}
      </div>

      {/* Create Event Button */}
      <div className="absolute bottom-24 right-6 z-20">
        <motion.button
          onClick={handleCreateEvent}
          className="w-16 h-16 bg-gradient-to-br from-[#00FFB3] to-[#1DE3F2] rounded-full flex items-center justify-center shadow-2xl shadow-[#00FFB3]/50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: [
              '0 0 20px rgba(0, 255, 179, 0.5)',
              '0 0 40px rgba(0, 255, 179, 0.8)',
              '0 0 20px rgba(0, 255, 179, 0.5)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <Plus className="w-8 h-8 text-black" />
        </motion.button>
      </div>

      {/* Create Event Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#1A1A1A] rounded-3xl p-6 w-full max-w-sm border border-[#00FFB3]/30 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white">Crear Evento</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm mb-2">Nombre del evento</label>
                  <input
                    type="text"
                    value={eventName}
                    onChange={e => setEventName(e.target.value)}
                    placeholder="Ej: Meetup de fotografía"
                    className="w-full px-4 py-3 bg-black/50 border border-[#00FFB3]/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#00FFB3]"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm mb-2">Ubicación</label>
                  <input
                    type="text"
                    value={eventLocation}
                    onChange={e => setEventLocation(e.target.value)}
                    placeholder="Dirección o lugar"
                    className="w-full px-4 py-3 bg-black/50 border border-[#00FFB3]/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#00FFB3]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white text-sm mb-2">Fecha</label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={e => setEventDate(e.target.value)}
                      className="w-full px-4 py-3 bg-black/50 border border-[#00FFB3]/30 rounded-xl text-white focus:outline-none focus:border-[#00FFB3]"
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm mb-2">Hora</label>
                    <input
                      type="time"
                      value={eventTime}
                      onChange={e => setEventTime(e.target.value)}
                      className="w-full px-4 py-3 bg-black/50 border border-[#00FFB3]/30 rounded-xl text-white focus:outline-none focus:border-[#00FFB3]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm mb-2">Descripción</label>
                  <textarea
                    value={eventDescription}
                    onChange={e => setEventDescription(e.target.value)}
                    placeholder="Describe tu evento..."
                    className="w-full h-24 px-4 py-3 bg-black/50 border border-[#00FFB3]/30 rounded-xl text-white placeholder-white/40 resize-none focus:outline-none focus:border-[#00FFB3]"
                  />
                </div>

                {/* Boost option */}
                <div
                  className={`rounded-2xl p-4 border-2 cursor-pointer transition-all ${
                    wantBoost
                      ? 'bg-gradient-to-br from-[#00FFB3]/10 to-[#1DE3F2]/5 border-[#00FFB3]'
                      : 'bg-black/30 border-[#00FFB3]/30 hover:border-[#00FFB3]/50'
                  }`}
                  onClick={() => setWantBoost(!wantBoost)}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      wantBoost ? 'border-[#00FFB3] bg-[#00FFB3]' : 'border-[#00FFB3]/50'
                    }`}>
                      {wantBoost && <div className="w-2 h-2 bg-black rounded-full" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-4 h-4 text-[#00FFB3]" />
                        <span className="text-white">Boost del evento</span>
                        <span className="text-[#00FFB3] text-sm">+$1</span>
                      </div>
                      <p className="text-[#C5C5C5] text-sm">
                        Aumenta la visibilidad de tu evento. Aparecerá destacado en el radar y notificará a usuarios a 10 km por 24h.
                      </p>
                    </div>
                  </div>

                  {wantBoost && (
                    <motion.div
                      className="mt-3 p-3 bg-[#00FFB3]/10 rounded-xl border border-[#00FFB3]/30"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <Zap className="w-3.5 h-3.5 text-[#00FFB3]" />
                        <span className="text-white">Tu evento será visible para 10x más personas</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={handlePublishEvent}
                  disabled={!eventName || !eventLocation || !eventDate || !eventTime}
                  className={`w-full py-3 rounded-2xl flex items-center justify-center gap-2 transition-all ${
                    !eventName || !eventLocation || !eventDate || !eventTime
                      ? 'bg-[#1A1A1A] border border-[#00FFB3]/20 text-white/30'
                      : 'bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] text-black shadow-lg hover:shadow-xl shadow-[#00FFB3]/50'
                  }`}
                >
                  <Send className="w-5 h-5" />
                  Publicar evento {wantBoost && '($1)'}
                </button>

                <button
                  onClick={() => setShowCreateModal(false)}
                  className="w-full py-2 text-[#C5C5C5] text-sm hover:text-white transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upgrade Modal for Free users */}
      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowUpgradeModal(false)}
          >
            <motion.div
              className="bg-[#1A1A1A] rounded-3xl p-6 w-full max-w-sm border border-[#00FFB3]/30 shadow-2xl"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#00FFB3] to-[#1DE3F2] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#00FFB3]/50">
                  <Crown className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-white mb-2">Función Premium</h3>
                <p className="text-[#C5C5C5] text-sm">
                  Crear eventos es exclusivo para usuarios Premium
                </p>
              </div>

              <div className="bg-black/50 rounded-2xl p-4 mb-6">
                <p className="text-white text-sm mb-3">Con Premium desbloqueas:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-[#C5C5C5] text-sm">
                    <span className="text-[#00FFB3]">✓</span>
                    <span>Crear eventos ilimitados</span>
                  </li>
                  <li className="flex items-start gap-2 text-[#C5C5C5] text-sm">
                    <span className="text-[#00FFB3]">✓</span>
                    <span>Opción de Boost ($1 por evento)</span>
                  </li>
                  <li className="flex items-start gap-2 text-[#C5C5C5] text-sm">
                    <span className="text-[#00FFB3]">✓</span>
                    <span>Señales ilimitadas</span>
                  </li>
                  <li className="flex items-start gap-2 text-[#C5C5C5] text-sm">
                    <span className="text-[#00FFB3]">✓</span>
                    <span>Radio de 30 km</span>
                  </li>
                </ul>
              </div>

              <button className="w-full py-3 bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] rounded-2xl text-black shadow-lg hover:shadow-xl transition-all mb-3 shadow-[#00FFB3]/50">
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
    </div>
  );
}
