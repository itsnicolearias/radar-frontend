import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Send, MapPin, MessageCircle, Users, Check, X, Eye, Crown, Lock } from 'lucide-react';
import { SimpleAvatar } from './SimpleAvatar';
import { SimpleInput } from './SimpleInput';
import { SimpleButton } from './SimpleButton';

interface Message {
  id: number;
  text: string;
  sent: boolean;
  time: string;
}

interface ConnectionRequest {
  id: number;
  name: string;
  image: string;
  age: number;
  distance: number;
  mutualInterests: number;
}

interface ConnectedUser {
  id: number;
  name: string;
  image: string;
  distance: number;
  lastMessage: string;
  time: string;
  unread: number;
}

interface ProfileVisitor {
  id: number;
  name: string;
  image: string;
  distance: number;
  lastSeen: string;
  isPremium: boolean;
}

interface ChatScreenProps {
  user?: {
    name: string;
    image: string;
    distance: number;
  };
  onBack: () => void;
  onUserSelect?: (user: ConnectedUser) => void;
  userPlan?: 'free' | 'premium';
}

type TabType = 'messages' | 'requests' | 'connected';

const profileVisitors: ProfileVisitor[] = [
  { id: 1, name: 'Sofía', image: '', distance: 85, lastSeen: 'Hace 5 min', isPremium: true },
  { id: 2, name: 'Marcos', image: '', distance: 120, lastSeen: 'Hace 15 min', isPremium: false },
  { id: 3, name: 'Valentina', image: '', distance: 95, lastSeen: 'Hace 1h', isPremium: true },
  { id: 4, name: 'Diego', image: '', distance: 200, lastSeen: 'Hace 2h', isPremium: false },
  { id: 5, name: 'Lucía', image: '', distance: 150, lastSeen: 'Hace 3h', isPremium: true },
  { id: 6, name: 'Pablo', image: '', distance: 180, lastSeen: 'Hace 5h', isPremium: false },
];

export default function ChatScreen({ user, onBack, onUserSelect, userPlan = 'free' }: ChatScreenProps) {
  const [activeTab, setActiveTab] = useState<TabType>('messages');
  const [inputValue, setInputValue] = useState('');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const [messages] = useState<Message[]>(user ? [
    { id: 1, text: 'Hola! Vi que estás cerca', sent: false, time: '14:23' },
    { id: 2, text: 'Hola! Sí, estoy por Palermo', sent: true, time: '14:24' },
    { id: 3, text: 'Yo también! Estás en el café de Gorriti?', sent: false, time: '14:25' },
    { id: 4, text: 'Exacto! Vine a trabajar un rato', sent: true, time: '14:26' },
    { id: 5, text: 'Genial, yo estoy a 2 cuadras. Te molesta si paso a saludar?', sent: false, time: '14:27' },
  ] : []);

  const [requests, setRequests] = useState<ConnectionRequest[]>([
    { id: 1, name: 'Sofía', image: '', age: 24, distance: 85, mutualInterests: 3 },
    { id: 2, name: 'Marcos', image: '', age: 28, distance: 120, mutualInterests: 5 },
    { id: 3, name: 'Valentina', image: '', age: 26, distance: 95, mutualInterests: 4 },
  ]);

  const [connected] = useState<ConnectedUser[]>([
    { id: 1, name: 'Ana', image: '', distance: 120, lastMessage: 'Nos vemos mañana!', time: '15:30', unread: 0 },
    { id: 2, name: 'Carlos', image: '', distance: 80, lastMessage: 'Perfecto 👍', time: '14:45', unread: 0 },
    { id: 3, name: 'María', image: '', distance: 150, lastMessage: 'Te paso la dirección', time: 'Ayer', unread: 2 },
    { id: 4, name: 'Juan', image: '', distance: 95, lastMessage: 'Dale, avísame', time: 'Ayer', unread: 0 },
  ]);

  const [acceptedId, setAcceptedId] = useState<number | null>(null);

  const handleAccept = (id: number) => {
    setAcceptedId(id);
    setTimeout(() => {
      setRequests(prev => prev.filter(req => req.id !== id));
      setAcceptedId(null);
    }, 1500);
  };

  const handleReject = (id: number) => {
    setRequests(prev => prev.filter(req => req.id !== id));
  };

  const handleSend = () => {
    if (inputValue.trim()) {
      setInputValue('');
    }
  };

  const visibleVisitors = userPlan === 'premium' ? profileVisitors : profileVisitors.slice(0, 3);
  const hasMoreVisitors = profileVisitors.length > 3;

  // If viewing a specific user's chat
  if (user) {
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
        <div className="bg-[#1A1A1A]/50 backdrop-blur-lg p-6 relative z-10 border-b border-[#00FFB3]/20">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center transition-transform hover:scale-110 border border-[#00FFB3]/30"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <SimpleAvatar src={user.image} alt={user.name} fallback={user.name[0]} className="w-12 h-12 border-2 border-[#00FFB3]" />
            <div className="flex-1">
              <h3 className="text-white">{user.name}</h3>
              <div className="flex items-center gap-1.5 text-[#C5C5C5] text-sm">
                <MapPin className="w-3.5 h-3.5 text-[#00FFB3]" />
                <span>{user.distance}m</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide relative z-10">
          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`max-w-[75%] ${msg.sent ? 'bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2]' : 'bg-[#1A1A1A] border border-[#00FFB3]/30'} rounded-2xl px-4 py-3`}>
                <p className={`${msg.sent ? 'text-black' : 'text-white'} text-sm`}>{msg.text}</p>
                <span className={`${msg.sent ? 'text-black/70' : 'text-[#C5C5C5]'} text-xs mt-1 block`}>{msg.time}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input */}
        <div className="p-6 bg-[#1A1A1A]/50 backdrop-blur-lg border-t border-[#00FFB3]/20 relative z-10">
          <div className="flex gap-3">
            <SimpleInput
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escribí un mensaje..."
              className="flex-1 bg-black/50 border-[#00FFB3]/30 text-white placeholder-[#C5C5C5]"
            />
            <SimpleButton
              onClick={handleSend}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] hover:shadow-lg text-black transition-all shadow-[#00FFB3]/30"
            >
              <Send className="w-5 h-5" />
            </SimpleButton>
          </div>
        </div>
      </div>
    );
  }

  // List view (default)
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
      <div className="bg-[#1A1A1A]/50 backdrop-blur-lg p-6 pb-4 relative z-10 border-b border-[#00FFB3]/20">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center transition-transform hover:scale-110 border border-[#00FFB3]/30"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-white flex-1 text-center">Conexiones</h2>
          <div className="w-10" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex-1 py-2 px-4 rounded-xl transition-all ${
              activeTab === 'messages'
                ? 'bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] text-black'
                : 'bg-[#1A1A1A] border border-[#00FFB3]/30 text-[#C5C5C5]'
            }`}
          >
            <MessageCircle className="w-4 h-4 mx-auto mb-1" />
            <span className="text-xs">Chats</span>
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-2 px-4 rounded-xl transition-all relative ${
              activeTab === 'requests'
                ? 'bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] text-black'
                : 'bg-[#1A1A1A] border border-[#00FFB3]/30 text-[#C5C5C5]'
            }`}
          >
            <Users className="w-4 h-4 mx-auto mb-1" />
            <span className="text-xs">Solicitudes</span>
            {requests.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF005C] rounded-full text-white text-xs flex items-center justify-center">
                {requests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('connected')}
            className={`flex-1 py-2 px-4 rounded-xl transition-all ${
              activeTab === 'connected'
                ? 'bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] text-black'
                : 'bg-[#1A1A1A] border border-[#00FFB3]/30 text-[#C5C5C5]'
            }`}
          >
            <Check className="w-4 h-4 mx-auto mb-1" />
            <span className="text-xs">Conectados</span>
          </button>
        </div>
      </div>

      {/* Profile Visitors Section */}
      {activeTab === 'connected' && (
        <div className="p-6 pb-4 border-b border-[#00FFB3]/20 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#1DE3F2]" />
              <h3 className="text-white">Vieron tu perfil</h3>
            </div>
            {userPlan === 'premium' && (
              <span className="px-2 py-1 bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] rounded-full text-black text-xs flex items-center gap-1">
                <Crown className="w-3 h-3" />
                PRO
              </span>
            )}
          </div>

          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {visibleVisitors.map((visitor, index) => (
              <motion.div
                key={visitor.id}
                className="flex-shrink-0 w-20"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="relative mb-2">
                  <SimpleAvatar
                    src={visitor.image}
                    alt={visitor.name}
                    fallback={visitor.name[0]}
                    className="w-16 h-16 border-2 border-[#1DE3F2] mx-auto"
                  />
                  {visitor.isPremium && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-[#00FFB3] to-[#1DE3F2] rounded-full flex items-center justify-center border-2 border-black">
                      <Crown className="w-2.5 h-2.5 text-black" />
                    </div>
                  )}
                </div>
                <p className="text-white text-xs text-center truncate">{visitor.name}</p>
                <p className="text-[#C5C5C5] text-xs text-center">{visitor.lastSeen}</p>
              </motion.div>
            ))}

            {/* Blurred visitors for free users */}
            {userPlan === 'free' && hasMoreVisitors && (
              <>
                {profileVisitors.slice(3, 6).map((visitor, index) => (
                  <div
                    key={visitor.id}
                    className="flex-shrink-0 w-20 opacity-30 blur-sm relative"
                  >
                    <div className="relative mb-2">
                      <SimpleAvatar
                        src={visitor.image}
                        alt={visitor.name}
                        fallback={visitor.name[0]}
                        className="w-16 h-16 border-2 border-[#C5C5C5] mx-auto"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <p className="text-white text-xs text-center truncate">???</p>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Upgrade CTA for free users */}
          {userPlan === 'free' && hasMoreVisitors && (
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="w-full mt-4 py-2.5 bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] rounded-xl text-black text-sm hover:shadow-lg transition-all shadow-[#00FFB3]/30 flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4" />
              Desbloqueá todos los visitantes con Premium
            </button>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3 scrollbar-hide relative z-10">
        {/* Messages Tab */}
        {activeTab === 'messages' && connected.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-[#00FFB3]/30 mx-auto mb-4" />
            <p className="text-[#C5C5C5]">No tenés conversaciones activas</p>
          </div>
        )}

        {activeTab === 'messages' && connected.map((chat, index) => (
          <motion.div
            key={chat.id}
            onClick={() => onUserSelect?.(chat)}
            className="bg-[#1A1A1A] border border-[#00FFB3]/20 rounded-2xl p-4 cursor-pointer hover:border-[#00FFB3]/50 transition-all"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <SimpleAvatar src={chat.image} alt={chat.name} fallback={chat.name[0]} className="w-14 h-14 border-2 border-[#00FFB3]" />
                {chat.unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF005C] rounded-full text-white text-xs flex items-center justify-center">
                    {chat.unread}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-white truncate">{chat.name}</h4>
                  <span className="text-[#C5C5C5] text-xs">{chat.time}</span>
                </div>
                <p className="text-[#C5C5C5] text-sm truncate">{chat.lastMessage}</p>
                <div className="flex items-center gap-1.5 text-[#C5C5C5] text-xs mt-1">
                  <MapPin className="w-3 h-3 text-[#00FFB3]" />
                  <span>{chat.distance}m</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Requests Tab */}
        {activeTab === 'requests' && requests.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-[#00FFB3]/30 mx-auto mb-4" />
            <p className="text-[#C5C5C5]">No tenés solicitudes pendientes</p>
          </div>
        )}

        {activeTab === 'requests' && requests.map((request, index) => (
          <motion.div
            key={request.id}
            className="bg-[#1A1A1A] border border-[#00FFB3]/20 rounded-2xl p-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <SimpleAvatar src={request.image} alt={request.name} fallback={request.name[0]} className="w-14 h-14 border-2 border-[#00FFB3]" />
              <div className="flex-1">
                <h4 className="text-white">{request.name}, {request.age}</h4>
                <div className="flex items-center gap-1.5 text-[#C5C5C5] text-sm">
                  <MapPin className="w-3.5 h-3.5 text-[#00FFB3]" />
                  <span>{request.distance}m</span>
                  <span className="text-[#00FFB3]">• {request.mutualInterests} intereses en común</span>
                </div>
              </div>
            </div>

            {acceptedId === request.id ? (
              <div className="bg-[#00FFB3]/20 border border-[#00FFB3]/50 rounded-xl py-2 text-center">
                <span className="text-[#00FFB3]">✓ Aceptado</span>
              </div>
            ) : (
              <div className="flex gap-2">
                <SimpleButton
                  onClick={() => handleAccept(request.id)}
                  className="flex-1 h-10 rounded-xl bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] hover:shadow-lg text-black transition-all shadow-[#00FFB3]/30"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Aceptar
                </SimpleButton>
                <SimpleButton
                  onClick={() => handleReject(request.id)}
                  className="flex-1 h-10 rounded-xl bg-[#1A1A1A] border border-[#FF005C]/30 hover:bg-[#FF005C]/10 text-[#FF005C] transition-all"
                >
                  <X className="w-4 h-4 mr-2" />
                  Rechazar
                </SimpleButton>
              </div>
            )}
          </motion.div>
        ))}

        {/* Connected Tab */}
        {activeTab === 'connected' && connected.length === 0 && (
          <div className="text-center py-12">
            <Check className="w-16 h-16 text-[#00FFB3]/30 mx-auto mb-4" />
            <p className="text-[#C5C5C5]">No tenés conexiones confirmadas</p>
          </div>
        )}

        {activeTab === 'connected' && connected.map((connection, index) => (
          <motion.div
            key={connection.id}
            onClick={() => onUserSelect?.(connection)}
            className="bg-[#1A1A1A] border border-[#00FFB3]/20 rounded-2xl p-4 cursor-pointer hover:border-[#00FFB3]/50 transition-all"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3">
              <SimpleAvatar src={connection.image} alt={connection.name} fallback={connection.name[0]} className="w-14 h-14 border-2 border-[#00FFB3]" />
              <div className="flex-1">
                <h4 className="text-white mb-1">{connection.name}</h4>
                <div className="flex items-center gap-1.5 text-[#C5C5C5] text-sm">
                  <MapPin className="w-3.5 h-3.5 text-[#00FFB3]" />
                  <span>{connection.distance}m</span>
                </div>
              </div>
              <SimpleButton className="px-4 h-9 rounded-xl bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] hover:shadow-lg text-black text-sm transition-all shadow-[#00FFB3]/30">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat
              </SimpleButton>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Upgrade Modal */}
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
                  <Eye className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-white mb-2">Ver todos los visitantes</h3>
                <p className="text-[#C5C5C5] text-sm">
                  Con Premium podés ver quién visitó tu perfil sin límites
                </p>
              </div>

              <div className="bg-black/50 rounded-2xl p-4 mb-6">
                <p className="text-white text-sm mb-3">Con Premium desbloqueas:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-[#C5C5C5] text-sm">
                    <span className="text-[#00FFB3]">✓</span>
                    <span>Ver visitantes ilimitados</span>
                  </li>
                  <li className="flex items-start gap-2 text-[#C5C5C5] text-sm">
                    <span className="text-[#00FFB3]">✓</span>
                    <span>Señales ilimitadas</span>
                  </li>
                  <li className="flex items-start gap-2 text-[#C5C5C5] text-sm">
                    <span className="text-[#00FFB3]">✓</span>
                    <span>Crear eventos</span>
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
