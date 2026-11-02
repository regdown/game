import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Actions from './components/Actions';
import GameMap from './components/GameMap';
import { useLanguage } from './context/LanguageContext';
import { Globe, Clock } from 'lucide-react';

const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000');

function App() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [gameTime, setGameTime] = useState(8); // Default 8 AM
  const { t, toggleLanguage } = useLanguage();

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('token');
    if (token) {
        socket.emit('auto_login', { token }, (res) => {
            if (!res.error) {
                setUser(res.user);
                if (res.time) setGameTime(res.time.hour);
            } else {
                localStorage.removeItem('token');
            }
            setLoading(false);
        });
    } else {
        setLoading(false);
    }

    socket.on('user_update', (updatedUser) => {
      setUser(updatedUser);
    });

    socket.on('time_update', ({ hour }) => {
        setGameTime(hour);
    });

    return () => {
      socket.off('user_update');
      socket.off('time_update');
    };
  }, []);

  const handleAction = (actionName, payload = null) => {
    import('./utils/sounds').then(({ playSound }) => playSound('click'));

    const callback = (res) => {
      import('./utils/sounds').then(({ playSound }) => {
          if (res.error) playSound('error');
          else if (res.success !== false) playSound('success');
      });

      if (res.error) {
        setMessage(`Error: ${res.error}`);
      } else {
        setMessage(res.message || 'Action successful.');
      }
      setTimeout(() => setMessage(''), 4000);
    };

    if (payload !== null) {
        socket.emit(actionName, payload, callback);
    } else {
        socket.emit(actionName, callback);
    }
  };

  const handleAuth = (action, username, password, role) => {
      socket.emit(action, { username, password, role }, (res) => {
          if (res.error) {
              import('./utils/sounds').then(({ playSound }) => playSound('error'));
              const errPrefix = action === 'login' ? t('msg_login_error') : t('msg_reg_error');
              setMessage(`${errPrefix}${res.error}`);
          } else {
              import('./utils/sounds').then(({ playSound }) => playSound('success'));
              localStorage.setItem('token', res.token);
              setUser(res.user);
              if (res.time) setGameTime(res.time.hour);
          }
          setTimeout(() => setMessage(''), 4000);
      });
  }

  const handleLogout = () => {
      localStorage.removeItem('token');
      setUser(null);
  };

  if (loading) {
      return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">{t('loading')}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans bg-[url('/bg.png')] bg-cover bg-center bg-fixed">
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <header className="relative z-10 p-4 bg-gray-800/80 backdrop-blur-md shadow-lg border-b border-gray-700 flex justify-between items-center px-8">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-md">
            {t('app_title')}
        </h1>

        {user && (
            <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
                <div className="flex items-center gap-2 text-xl font-mono text-gray-200 bg-gray-900/50 px-4 py-1 rounded-full border border-gray-600">
                    <Clock size={18} className={(gameTime >= 22 || gameTime < 6) ? "text-red-500" : "text-blue-400"} />
                    {gameTime.toString().padStart(2, '0')}:00
                </div>
                {(gameTime >= 22 || gameTime < 6) && (
                    <span className="text-red-500 text-xs font-bold uppercase tracking-widest mt-1 animate-pulse">
                        {t('clock_lockdown')}
                    </span>
                )}
            </div>
        )}

        <div className="flex items-center gap-4">
            <button
                onClick={toggleLanguage}
                className="flex items-center gap-1 text-gray-300 hover:text-white transition"
            >
                <Globe size={18} />
                <span className="font-bold">{t('btn_language')}</span>
            </button>

            {user && (
                <button onClick={handleLogout} className="text-sm bg-red-600/80 hover:bg-red-500 px-4 py-2 rounded-md transition font-semibold">
                    {t('logout')}
                </button>
            )}
        </div>
      </header>

      <main className="relative z-10 container mx-auto p-4 flex flex-col items-center mt-8">
        {message && (
          <div className="fixed top-20 right-4 p-4 bg-gray-800 border-l-4 border-blue-500 text-white rounded shadow-2xl z-50 animate-pulse">
            {message}
          </div>
        )}

        {!user ? (
          <Login onAuth={handleAuth} />
        ) : (
          <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3 bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-gray-700/50 h-[80vh] overflow-y-auto">
              <Dashboard user={user} />
            </div>
            <div className="lg:col-span-5 bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-gray-700/50 h-[80vh] flex flex-col">
              <GameMap user={user} onAction={handleAction} />
            </div>
            <div className="lg:col-span-4 bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-gray-700/50 h-[80vh] overflow-y-auto">
              <Actions user={user} onAction={handleAction} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
