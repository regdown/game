import { Shield, Coins, Battery, Heart, Star, Home, Landmark, Sword, MapPin, Dumbbell } from 'lucide-react';
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
    <div className="h-full flex flex-col relative">
      {/* Decorative tech background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl shadow-lg border ${isPolice ? 'bg-blue-900/40 border-blue-500/50 text-blue-400' : 'bg-orange-900/40 border-orange-500/50 text-orange-400'}`}>
                {isPolice ? <Shield size={32} /> : <div className="w-8 h-8 flex items-center justify-center font-extrabold text-xl">P</div>}
            </div>
            <div>
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight">{user.username}</h2>
                <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${isPolice ? 'border-blue-500/50 bg-blue-900/50 text-blue-300' : 'border-orange-500/50 bg-orange-900/50 text-orange-300'} font-bold tracking-widest uppercase`}>
                        {isPolice ? t('role_police') : t('role_prisoner')}
                    </span>
                    <span className="text-xs font-mono text-gray-400 bg-black/50 px-2 py-0.5 rounded-full">
                        LVL {Math.floor(user.exp / 100) + 1}
                    </span>
                </div>
            </div>
        </div>
      </div>

      <div className="space-y-6 flex-grow">
        {/* Modern Status Bars */}
        <div className="space-y-5 bg-black/20 p-5 rounded-2xl border border-gray-800/50 backdrop-blur-sm shadow-inner">
            <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2 text-gray-400">
                    <span className="flex items-center gap-2"><Heart size={14} className="text-red-500 animate-pulse" /> {t('health')}</span>
                    <span className="font-mono text-red-100">{user.health} <span className="text-gray-600">/ {maxHealth}</span></span>
                </div>
                <div className="h-2.5 w-full bg-gray-900 rounded-full overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)] border border-gray-800">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${healthPercent}%` }}
                        transition={{ duration: 0.5, type: 'spring' }}
                        className="h-full bg-gradient-to-r from-red-700 via-red-500 to-red-400 shadow-[0_0_10px_rgba(239,68,68,0.5)] relative"
                    >
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] w-full h-full animate-[shimmer_2s_infinite]"></div>
                    </motion.div>
                </div>
            </div>

            <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2 text-gray-400">
                    <span className="flex items-center gap-2"><Battery size={14} className="text-green-400" /> {t('stamina')}</span>
                    <span className="font-mono text-green-100">{user.stamina} <span className="text-gray-600">/ {maxStamina}</span></span>
                </div>
                <div className="h-2.5 w-full bg-gray-900 rounded-full overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)] border border-gray-800">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${staminaPercent}%` }}
                        transition={{ duration: 0.5, type: 'spring' }}
                        className="h-full bg-gradient-to-r from-green-700 via-green-500 to-green-400 shadow-[0_0_10px_rgba(34,197,94,0.5)] relative"
                    >
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] w-full h-full animate-[shimmer_2s_infinite]"></div>
                    </motion.div>
                </div>
            </div>
        </div>

        {/* Cyberpunk-esque Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-b from-gray-800/80 to-gray-900/90 p-4 rounded-xl border border-gray-700/60 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5"><Coins size={12} className="text-yellow-400"/> {t('cash')}</p>
                <p className="text-xl font-mono font-bold text-white">${user.money.toLocaleString()}</p>
            </div>

            <div className="bg-gradient-to-b from-gray-800/80 to-gray-900/90 p-4 rounded-xl border border-gray-700/60 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5"><Landmark size={12} className="text-blue-400"/> {t('bank')}</p>
                <p className="text-xl font-mono font-bold text-white">${user.bank.toLocaleString()}</p>
            </div>

            <div className="bg-gradient-to-b from-gray-800/80 to-gray-900/90 p-4 rounded-xl border border-gray-700/60 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5"><Star size={12} className="text-purple-400"/> {t('exp')}</p>
                <p className="text-xl font-mono font-bold text-white">{user.exp.toLocaleString()}</p>
            </div>
        </div>

        {/* Secondary Info Grid */}
        <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-900/60 p-4 rounded-xl border border-gray-800 flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-lg shadow-inner"><Dumbbell size={18} className="text-orange-400" /></div>
                <div>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Strength</p>
                    <p className="text-lg font-mono font-bold text-gray-200">{user.strength || 10}</p>
                </div>
            </div>

            <div className="bg-gray-900/60 p-4 rounded-xl border border-gray-800 flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-lg shadow-inner"><Home size={18} className="text-teal-400" /></div>
                <div>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{roomName}</p>
                    <p className="text-lg font-mono font-bold text-gray-200">LVL {roomLevel}</p>
                </div>
            </div>
        </div>

        {/* Current State Footer */}
        <div className="bg-gradient-to-r from-gray-900/80 via-gray-800/50 to-gray-900/80 p-4 rounded-xl border border-gray-700/30 flex items-center justify-between shadow-2xl mt-auto">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <MapPin size={22} className="text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]" />
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                </div>
                <div>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Current Location</p>
                    <p className="text-sm font-bold capitalize text-white">{user.location === 'cell' ? t('location_cell') : (user.location === 'break_room' ? t('location_break_room') : user.location)}</p>
                </div>
            </div>

            <div className="h-8 w-px bg-gray-700 mx-4"></div>

            <div className="flex items-center gap-3">
                <Sword size={22} className={user.weapon !== 'none' ? 'text-red-400 drop-shadow-[0_0_5px_rgba(248,113,113,0.8)]' : 'text-gray-600'} />
                <div>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{t('equipped_weapon')}</p>
                    <p className="text-sm font-bold capitalize text-white">{user.weapon}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
