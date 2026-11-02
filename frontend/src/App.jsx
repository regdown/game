import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Actions from './components/Actions';

const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000');

function App() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.on('user_update', (updatedUser) => {
      setUser(updatedUser);
    });

    return () => {
      socket.off('user_update');
    };
  }, []);

  const handleAction = (actionName) => {
    socket.emit(actionName, (res) => {
      if (res.error) {
        setMessage(`Error: ${res.error}`);
      } else {
        setMessage(res.message || 'Action successful.');
      }
      setTimeout(() => setMessage(''), 5000);
    });
  };

  const handleLogin = (username, role) => {
      socket.emit('login', { username, role }, (res) => {
          if (res.error) {
              setMessage(`Login Error: ${res.error}`);
          } else {
              setUser(res.user);
          }
      });
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <header className="p-4 bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold text-center text-blue-400">Prison Break RPG</h1>
      </header>

      <main className="container mx-auto p-4 flex flex-col items-center">
        {message && (
          <div className="mb-4 p-3 bg-blue-900 text-blue-100 rounded-md shadow w-full max-w-md text-center">
            {message}
          </div>
        )}

        {!user ? (
          <Login onLogin={handleLogin} />
        ) : (
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <Dashboard user={user} />
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <Actions user={user} onAction={handleAction} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
