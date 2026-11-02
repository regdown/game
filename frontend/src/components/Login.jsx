import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, User } from 'lucide-react';
import { playSound } from '../utils/sounds';

function Login({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('prisoner');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      onAuth(isLogin ? 'login' : 'register', username, password, role);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-md"
    >
      <h2 className="text-3xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        {isLogin ? 'Welcome Back' : 'Create Character'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Username</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your alias"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="password"
              className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        {!isLogin && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
            <label className="block text-sm font-medium mb-2 text-gray-300">Starting Role</label>
            <div className="grid grid-cols-2 gap-4">
                <div
                    onClick={() => { playSound('click'); setRole('prisoner'); }}
                    className={`cursor-pointer border p-3 rounded-lg flex flex-col items-center gap-2 transition-all ${role === 'prisoner' ? 'border-orange-500 bg-orange-500/20' : 'border-gray-600 hover:border-gray-400'}`}
                >
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">P</div>
                    <span className="text-sm font-bold text-orange-400">Prisoner</span>
                </div>
                <div
                    onClick={() => { playSound('click'); setRole('police'); }}
                    className={`cursor-pointer border p-3 rounded-lg flex flex-col items-center gap-2 transition-all ${role === 'police' ? 'border-blue-500 bg-blue-500/20' : 'border-gray-600 hover:border-gray-400'}`}
                >
                    <Shield size={32} className={role === 'police' ? 'text-blue-400' : 'text-gray-400'} />
                    <span className="text-sm font-bold text-blue-400">Police</span>
                </div>
            </div>
          </motion.div>
        )}

        <button
          type="submit"
          onMouseEnter={() => playSound('action')}
          onClick={() => playSound('click')}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-lg transform hover:-translate-y-0.5"
        >
          {isLogin ? 'Enter City' : 'Join the Game'}
        </button>
      </form>

      <div className="mt-6 text-center">
          <button
            onClick={() => { playSound('click'); setIsLogin(!isLogin); }}
            className="text-gray-400 hover:text-white transition-colors text-sm underline"
          >
              {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
          </button>
      </div>
    </motion.div>
  );
}

export default Login;
