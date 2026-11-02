import { Shield, Coins, Battery, Heart, Star, Home, Landmark, Sword, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

function Dashboard({ user }) {
  const { t } = useLanguage();
  const isPolice = user.role === 'police';
  const roomName = isPolice ? t('location_break_room') : t('location_cell');
  const roomLevel = isPolice ? user.break_room_level : user.cell_level;

  const maxStamina = 100 + (roomLevel * (isPolice ? 20 : 10));
  const maxHealth = 100;

  const staminaPercent = Math.min((user.stamina / maxStamina) * 100, 100);
  const healthPercent = Math.min((user.health / maxHealth) * 100, 100);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${isPolice ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}`}>
                {isPolice ? <Shield size={28} /> : <div className="w-7 h-7 flex items-center justify-center font-bold text-lg">P</div>}
            </div>
            <div>
                <h2 className="text-2xl font-bold text-white">{user.username}</h2>
                <p className={`text-sm uppercase tracking-wider font-semibold ${isPolice ? 'text-blue-400' : 'text-orange-400'}`}>
                    {t('level')} {Math.floor(user.exp / 100) + 1} {isPolice ? t('role_police') : t('role_prisoner')}
                </p>
            </div>
        </div>
      </div>

      <div className="space-y-6 flex-grow">
        {/* Status Bars */}
        <div className="space-y-4">
            <div>
                <div className="flex justify-between text-sm mb-1 text-gray-300">
                    <span className="flex items-center gap-1"><Heart size={14} className="text-red-400" /> {t('health')}</span>
                    <span>{user.health} / {maxHealth}</span>
                </div>
                <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${healthPercent}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-red-600 to-red-400"
                    />
                </div>
            </div>
            <div>
                <div className="flex justify-between text-sm mb-1 text-gray-300">
                    <span className="flex items-center gap-1"><Battery size={14} className="text-green-400" /> {t('stamina')}</span>
                    <span>{user.stamina} / {maxStamina}</span>
                </div>
                <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${staminaPercent}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-green-600 to-green-400"
                    />
                </div>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50 hover:border-yellow-500/30 transition">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 flex items-center gap-2"><Coins size={14} className="text-yellow-400"/> {t('cash')}</p>
                <p className="text-2xl font-bold text-white">${user.money.toLocaleString()}</p>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50 hover:border-blue-500/30 transition">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 flex items-center gap-2"><Landmark size={14} className="text-blue-400"/> {t('bank')}</p>
                <p className="text-2xl font-bold text-white">${user.bank.toLocaleString()}</p>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50 hover:border-purple-500/30 transition">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 flex items-center gap-2"><Star size={14} className="text-purple-400"/> {t('exp')}</p>
                <p className="text-2xl font-bold text-white">{user.exp.toLocaleString()}</p>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50 hover:border-gray-400/30 transition">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 flex items-center gap-2"><Home size={14} /> {roomName}</p>
                <p className="text-2xl font-bold text-white">Lvl {roomLevel}</p>
            </div>
        </div>

        {/* Location & Weapon */}
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50 flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-lg"><MapPin size={20} className="text-blue-300" /></div>
                <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Location</p>
                    <p className="text-lg font-bold capitalize text-white">{user.location === 'cell' ? t('location_cell') : (user.location === 'break_room' ? t('location_break_room') : user.location)}</p>
                </div>
            </div>

            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50 flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-lg"><Sword size={20} className={user.weapon !== 'none' ? 'text-red-400' : 'text-gray-500'} /></div>
                <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider">{t('equipped_weapon')}</p>
                    <p className="text-lg font-bold capitalize text-white">{user.weapon}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
