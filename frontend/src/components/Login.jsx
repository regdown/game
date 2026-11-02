import { useState } from 'react';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('prisoner');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username, role);
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">Join the Game</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Role Preference</label>
          <select
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="prisoner">Prisoner</option>
            <option value="police">Police</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Enter City
        </button>
      </form>
    </div>
  );
}

export default Login;
