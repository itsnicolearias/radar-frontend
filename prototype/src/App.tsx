import { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import MapScreen from './components/MapScreen';
import ProfileScreen from './components/ProfileScreen';
import ChatScreen from './components/ChatScreen';
import EventsScreen from './components/EventsScreen';
import AuthScreen from './components/AuthScreen';
import VerificationScreen from './components/VerificationScreen';
import OwnProfileScreen from './components/OwnProfileScreen';
import NotificationToast from './components/NotificationToast';
import StatusBar from './components/StatusBar';
import HomeScreen from './components/HomeScreen';
import SignalsScreen from './components/SignalsScreen';

interface User {
  id: number;
  name: string;
  image: string;
  distance: number;
}

type Screen = 'home' | 'welcome' | 'auth' | 'verification' | 'map' | 'profile' | 'ownProfile' | 'chat' | 'events' | 'connections' | 'signals';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Array<{id: number; title: string; message: string}>>([]);
  const [userPlan, setUserPlan] = useState<'free' | 'premium'>('free');

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setCurrentScreen('profile');
  };

  const handleNavigate = (screen: string) => {
    if (screen === 'events') {
      setCurrentScreen('events');
    } else if (screen === 'map') {
      setCurrentScreen('map');
    } else if (screen === 'profile') {
      setCurrentScreen('ownProfile');
    } else if (screen === 'chats') {
      setCurrentScreen('chat');
    } else if (screen === 'connections') {
      setCurrentScreen('connections');
    }
  };

  const showNotification = (title: string, message: string) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, title, message }]);
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onOpenApp={() => setCurrentScreen('welcome')} />;

      case 'welcome':
        return (
          <WelcomeScreen
            onRegister={() => setCurrentScreen('auth')}
            onLogin={() => setCurrentScreen('auth')}
          />
        );

      case 'auth':
        return <AuthScreen onComplete={() => setCurrentScreen('verification')} />;

      case 'verification':
        return <VerificationScreen onComplete={() => {
          setCurrentScreen('map');
          // Mostrar notificación de bienvenida
          setTimeout(() => {
            showNotification('¡Bienvenido a Radar!', 'Tu cuenta está activa. Explorá quién está cerca.');
          }, 500);
        }} />;

      case 'map':
        return (
          <MapScreen
            onUserClick={(user) => {
              handleUserClick(user);
              // Simular notificaciones aleatorias
              const random = Math.random();
              if (random > 0.7) {
                setTimeout(() => {
                  showNotification('📡 Nuevas personas detectadas', '3 personas nuevas en tu radar');
                }, 2000);
              }
            }}
            onNavigate={handleNavigate}
            userPlan={userPlan}
          />
        );

      case 'profile':
        return selectedUser ? (
          <ProfileScreen
            user={selectedUser}
            onBack={() => setCurrentScreen('map')}
            onMessage={() => {
              setCurrentScreen('chat');
              showNotification('💬 Nuevo mensaje', `Mensaje de ${selectedUser.name}`);
            }}
          />
        ) : null;

      case 'ownProfile':
        return <OwnProfileScreen onBack={() => setCurrentScreen('map')} userPlan={userPlan} onUpgrade={() => setUserPlan('premium')} />;

      case 'chat':
        return (
          <ChatScreen
            user={selectedUser || undefined}
            onBack={() => {
              if (selectedUser) {
                setCurrentScreen('profile');
              } else {
                setCurrentScreen('map');
              }
            }}
            onUserSelect={(user) => {
              setSelectedUser(user);
            }}
            userPlan={userPlan}
          />
        );

      case 'events':
        return <EventsScreen onBack={() => setCurrentScreen('map')} userPlan={userPlan} />;

      case 'connections':
        return (
          <ChatScreen
            onBack={() => setCurrentScreen('map')}
            onUserSelect={(user) => {
              setSelectedUser(user);
            }}
            userPlan={userPlan}
          />
        );

      case 'signals':
        return <SignalsScreen onBack={() => setCurrentScreen('map')} userPlan={userPlan} />;

      default:
        return (
          <WelcomeScreen
            onRegister={() => setCurrentScreen('auth')}
            onLogin={() => setCurrentScreen('auth')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-8 p-8">
      {/* iPhone 14 Pro Frame */}
      <div className="relative">
        {/* Phone frame */}
        <div className="w-[393px] h-[852px] bg-black rounded-[60px] p-3 shadow-2xl">
          {/* Screen */}
          <div className="w-full h-full bg-white rounded-[48px] overflow-hidden relative">
            {/* Status Bar */}
            <StatusBar />

            {/* Dynamic Island */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[126px] h-[37px] bg-black rounded-full z-50" />

            {/* Screen content */}
            <div className="w-full h-full">
              {renderScreen()}
            </div>

            {/* Notifications */}
            {notifications.map((notif) => (
              <NotificationToast
                key={notif.id}
                title={notif.title}
                message={notif.message}
                onClose={() => removeNotification(notif.id)}
              />
            ))}
          </div>
        </div>

        {/* Phone buttons */}
        <div className="absolute -left-2 top-[180px] w-1 h-12 bg-black rounded-l-lg" />
        <div className="absolute -left-2 top-[240px] w-1 h-14 bg-black rounded-l-lg" />
        <div className="absolute -left-2 top-[305px] w-1 h-14 bg-black rounded-l-lg" />
        <div className="absolute -right-2 top-[220px] w-1 h-20 bg-black rounded-r-lg" />
      </div>

      {/* Demo Controls - Outside Phone Frame */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 shadow-2xl max-w-4xl">
        <h3 className="text-white text-center mb-4 text-sm opacity-70">Controles de Demo</h3>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setCurrentScreen('home')}
            className="px-5 py-2.5 bg-gradient-to-r from-[#0a0e27] via-[#1a1f3a] to-[#0f1419] hover:opacity-90 text-white rounded-xl text-sm transition-all shadow-lg border border-[#3EC8A7]/30"
          >
            📱 Home Screen
          </button>
          <button
            onClick={() => setCurrentScreen('welcome')}
            className="px-5 py-2.5 bg-gradient-to-r from-[#1E3A5F] to-[#3EC8A7] hover:opacity-90 text-white rounded-xl text-sm transition-all shadow-lg"
          >
            🏠 Bienvenida
          </button>
          <button
            onClick={() => setCurrentScreen('map')}
            className="px-5 py-2.5 bg-[#1E3A5F] hover:bg-[#2A4A6F] text-white rounded-xl text-sm transition-all shadow-lg"
          >
            📍 Radar
          </button>
          <button
            onClick={() => setCurrentScreen('chat')}
            className="px-5 py-2.5 bg-[#3EC8A7] hover:bg-[#35B396] text-white rounded-xl text-sm transition-all shadow-lg"
          >
            💬 Chats
          </button>
          <button
            onClick={() => setCurrentScreen('ownProfile')}
            className="px-5 py-2.5 bg-[#1E3A5F] hover:bg-[#2A4A6F] text-white rounded-xl text-sm transition-all shadow-lg"
          >
            👤 Mi Perfil
          </button>
          <button
            onClick={() => setCurrentScreen('signals')}
            className="px-5 py-2.5 bg-gradient-to-r from-[#0a1929] via-[#0d1f33] to-[#1E3A5F] hover:opacity-90 text-white rounded-xl text-sm transition-all shadow-lg border border-[#00FFB3]/50"
          >
            📡 Señales del Radar
          </button>
          <button
            onClick={() => setUserPlan(userPlan === 'free' ? 'premium' : 'free')}
            className={`px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg ${
              userPlan === 'premium'
                ? 'bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] text-black border border-[#00FFB3]'
                : 'bg-[#1A1A1A] text-white border border-[#00FFB3]/50'
            }`}
          >
            {userPlan === 'premium' ? '👑 Premium' : '🆓 Free'} (Toggle)
          </button>
          <button
            onClick={() => showNotification('📡 Radar actualizado', 'Nuevas personas detectadas en tu zona')}
            className="px-5 py-2.5 bg-[#FF005C] hover:bg-[#ff1a6a] text-white rounded-xl text-sm transition-all shadow-lg"
          >
            🔔 Test Notificación
          </button>
        </div>
      </div>
    </div>
  );
}
