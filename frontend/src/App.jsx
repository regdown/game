import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Actions from './components/Actions';
import Scene from './components/3d/Scene';
import GameMap3D from './components/3d/GameMap3D';
import PlayerAvatar from './components/3d/PlayerAvatar';
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
    <div className="min-h-screen bg-gray-950 text-white font-sans relative overflow-x-hidden">

      {/* 3D Scene Background Layer (Replaces the 2D background when logged in) */}
      {user ? (
        <Scene>
            <GameMap3D user={user} onAction={handleAction} />
            <PlayerAvatar user={user} />
        </Scene>
      ) : (
        <>
            <div
                className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0 opacity-40 transition-opacity duration-1000"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1588667634694-813d1bd6d38a?q=80&w=2070&auto=format&fit=crop')` }}
            ></div>
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-gray-950/80 to-black z-0 pointer-events-none"></div>
            <div className="fixed inset-0 opacity-[0.03] z-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)' }}></div>
        </>
      )}

      {/* Persistent UI overlay on top of 3D / 2D background */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col">
          <header className="p-4 bg-gray-900/90 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-b border-gray-700/50 flex justify-between items-center px-8 pointer-events-auto">
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

          <main className="container mx-auto p-4 flex flex-col items-center mt-8 flex-grow">
            {message && (
              <div className="fixed top-20 right-4 p-4 bg-gray-800 border-l-4 border-blue-500 text-white rounded shadow-2xl z-50 animate-pulse pointer-events-auto">
                {message}
              </div>
            )}

            {!user ? (
              <div className="pointer-events-auto w-full flex justify-center">
                <Login onAuth={handleAuth} />
              </div>
            ) : (
              /* HUD Overlay - Only render Dashboard and Actions over the 3D scene */
              <div className="w-full max-w-7xl flex justify-between h-[80vh] gap-6 pointer-events-none">
                {/* Left Side: Dashboard */}
                <div className="w-[30%] min-w-[320px] pointer-events-auto">
                  <div className="bg-gray-900/70 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-gray-700/50 h-full overflow-y-auto">
                    <Dashboard user={user} />
                  </div>
                </div>

                {/* Middle: Empty space to see the 3D Map (handled by pointer-events-none on parent) */}
                <div className="flex-grow flex items-end justify-center pb-8 pointer-events-none">
                     <div className="bg-black/50 backdrop-blur-sm px-6 py-2 rounded-full border border-gray-700 text-gray-300 font-mono text-sm shadow-xl">
                         Click on a room in the 3D facility to move.
                     </div>
                </div>

                {/* Right Side: Actions */}
                <div className="w-[35%] min-w-[380px] pointer-events-auto">
                  <div className="bg-gray-900/70 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-gray-700/50 h-full overflow-y-auto">
                    <Actions user={user} onAction={handleAction} />
                  </div>
                </div>
              </div>
            )}
          </main>
      </div>
    </div>
  );
}

export default App;
