import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Actions from './components/Actions';

const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000');

function App() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('token');
    if (token) {
        socket.emit('auto_login', { token }, (res) => {
            if (!res.error) {
                setUser(res.user);
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

    return () => {
      socket.off('user_update');
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
              setMessage(`${action === 'login' ? 'Login' : 'Registration'} Error: ${res.error}`);
          } else {
              import('./utils/sounds').then(({ playSound }) => playSound('success'));
              localStorage.setItem('token', res.token);
              setUser(res.user);
          }
          setTimeout(() => setMessage(''), 4000);
      });
  }

  const handleLogout = () => {
      localStorage.removeItem('token');
      setUser(null);
  };

  if (loading) {
      return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans bg-[url('/bg.png')] bg-cover bg-center bg-fixed">
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <header className="relative z-10 p-4 bg-gray-800/80 backdrop-blur-md shadow-lg border-b border-gray-700 flex justify-between items-center px-8">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-md">
            Prison Break RPG
        </h1>
        {user && (
            <button onClick={handleLogout} className="text-sm bg-red-600/80 hover:bg-red-500 px-4 py-2 rounded-md transition font-semibold">
                Logout
            </button>
        )}
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
          <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-gray-700/50">
              <Dashboard user={user} />
            </div>
            <div className="lg:col-span-7 bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-gray-700/50">
              <Actions user={user} onAction={handleAction} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
