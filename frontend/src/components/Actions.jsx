import { useState } from 'react';
import { Pickaxe, Skull, Bed, Hammer, ArrowUpCircle, RefreshCcw, Vault } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

function Actions({ user, onAction }) {
  const { t } = useLanguage();
  const [bankAmount, setBankAmount] = useState('');
  const isPolice = user.role === 'police';
  const roomName = isPolice ? t('location_break_room') : t('location_cell');
  const roomLevel = isPolice ? user.break_room_level : user.cell_level;
  const upgradeCost = roomLevel * 100;

  const handleBankAction = (type) => {
      onAction(type, bankAmount);
      setBankAmount('');
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-extrabold mb-6 text-white flex items-center gap-2 drop-shadow-md">
          {t('actions_panel')} <span className="text-xs font-mono text-purple-400 border border-purple-400/50 px-2 py-1 rounded-full bg-purple-900/20">INTERFACE</span>
      </h2>

      <div className="space-y-6 flex-grow">

        {/* Contextual Location Actions */}
        <div className="bg-gray-900/40 p-5 rounded-2xl border border-gray-700/50 relative overflow-hidden shadow-inner">
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4 font-bold z-10 relative flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span> Location Actions
            </h3>

            <div className="space-y-3 relative z-10">
                {user.location === 'work_area' && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onAction('work')}
                        className="w-full bg-gradient-to-r from-emerald-900 to-emerald-800 hover:from-emerald-800 hover:to-emerald-700 text-white p-4 rounded-xl shadow-lg border border-emerald-500/30 flex items-center justify-between group transition-all"
                    >
                        <div className="flex items-center gap-3"><Pickaxe className="text-emerald-400 group-hover:rotate-12 transition-transform" /> <span className="font-extrabold tracking-wide">{t('work_shift')}</span></div>
                        <span className="text-xs font-bold text-emerald-200 bg-black/40 px-3 py-1.5 rounded-md border border-emerald-900">{t('work_cost')}</span>
                    </motion.button>
                )}

                {(user.location === 'yard' || user.location === 'work_area') && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onAction('steal')}
                        className="w-full bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 text-white p-4 rounded-xl shadow-lg border border-red-500/30 flex items-center justify-between group transition-all"
                    >
                        <div className="flex items-center gap-3"><Skull className="text-red-400 group-hover:scale-110 transition-transform" /> <span className="font-extrabold tracking-wide">{t('heal_steal')}</span></div>
                        <span className="text-xs font-bold text-red-200 bg-black/40 px-3 py-1.5 rounded-md border border-red-900">{t('steal_cost')}</span>
                    </motion.button>
                )}

                {(user.location === 'cell' || user.location === 'break_room') && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onAction('rest')}
                        className="w-full bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white p-4 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.1)] border border-blue-500/30 flex items-center justify-center gap-3 transition-all"
                    >
                        <Bed className="text-blue-400" /> <span className="font-extrabold tracking-widest text-lg">{t('rest_recover')}</span>
                    </motion.button>
                )}

                {user.location === 'gym' && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onAction('train')}
                        className="w-full bg-gradient-to-r from-orange-900 to-orange-800 hover:from-orange-800 hover:to-orange-700 text-white p-4 rounded-xl shadow-lg border border-orange-500/30 flex items-center justify-between group transition-all"
                    >
                        <div className="flex items-center gap-3"><Pickaxe className="text-orange-400 group-hover:rotate-12 transition-transform" /> <span className="font-extrabold tracking-wide">{t('train_gym')}</span></div>
                        <span className="text-xs font-bold text-orange-200 bg-black/40 px-3 py-1.5 rounded-md border border-orange-900">-40 STA | +1 STR</span>
                    </motion.button>
                )}

                {user.location === 'bank' && (
                    <div className="flex gap-2 p-3 bg-black/30 rounded-xl border border-gray-800">
                        <input
                            type="number"
                            value={bankAmount}
                            onChange={(e) => setBankAmount(e.target.value)}
                            placeholder="Amount..."
                            className="flex-grow bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white font-mono focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                        />
                        <button
                            onClick={() => handleBankAction('deposit')}
                            className="bg-yellow-900/50 hover:bg-yellow-800/80 border border-yellow-700/50 text-yellow-200 px-4 py-2 rounded-lg font-bold transition-all shadow-sm"
                        >
                            {t('deposit')}
                        </button>
                        <button
                            onClick={() => handleBankAction('withdraw')}
                            className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-200 px-4 py-2 rounded-lg font-bold transition-all shadow-sm"
                        >
                            {t('withdraw')}
                        </button>
                    </div>
                )}

                {/* Fallback when no actions available */}
                {['cell', 'break_room', 'yard', 'work_area', 'gym', 'bank'].includes(user.location) === false && (
                    <div className="text-center p-4 text-gray-500 text-sm font-mono border border-gray-800 border-dashed rounded-xl">
                        No actions available here.
                    </div>
                )}
            </div>

            {/* Background texture for actions area */}
            <div className="absolute inset-0 opacity-5 pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 8px)' }}></div>
        </div>

        {/* Upgrades */}
        <div className="bg-gray-900/40 p-5 rounded-2xl border border-gray-700/50 shadow-inner">
          <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4 font-bold flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span> {t('facilities')}
          </h3>

          <div className="space-y-3">
            <motion.button
              whileHover={user.money >= upgradeCost ? { scale: 1.01 } : {}}
              onClick={() => onAction('upgrade_room')}
              disabled={user.money < upgradeCost}
              className={`w-full p-4 rounded-xl flex justify-between items-center transition-all border ${user.money < upgradeCost ? 'bg-gray-900/80 border-gray-800 text-gray-600 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700 border-gray-600 hover:border-gray-400 text-white shadow-md'}`}
            >
              <div className="flex items-center gap-3 font-bold tracking-wide"><ArrowUpCircle size={20} className={user.money >= upgradeCost ? 'text-blue-400' : 'text-gray-600'} /> {t('upgrade')} {roomName}</div>
              <span className={`font-mono text-sm font-bold bg-black/40 px-3 py-1 rounded-md border ${user.money < upgradeCost ? 'text-red-900 border-red-900/30' : 'text-yellow-400 border-yellow-700/50'}`}>${upgradeCost.toLocaleString()}</span>
            </motion.button>

            <motion.button
              whileHover={user.money >= 200 && user.weapon === 'none' ? { scale: 1.01 } : {}}
              onClick={() => onAction('craft_weapon')}
              disabled={user.money < 200 || user.weapon !== 'none'}
              className={`w-full p-4 rounded-xl flex justify-between items-center transition-all border ${user.money < 200 || user.weapon !== 'none' ? 'bg-gray-900/80 border-gray-800 text-gray-600 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700 border-gray-600 hover:border-gray-400 text-white shadow-md'}`}
            >
              <div className="flex items-center gap-3 font-bold tracking-wide"><Hammer size={20} className={user.money >= 200 && user.weapon === 'none' ? 'text-orange-400' : 'text-gray-600'} /> {t('craft_shiv')}</div>
              <span className={`font-mono text-sm font-bold bg-black/40 px-3 py-1 rounded-md border ${user.money < 200 ? 'text-red-900 border-red-900/30' : 'text-yellow-400 border-yellow-700/50'}`}>$200</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onAction('switch_role')}
              className="w-full bg-purple-900/30 hover:bg-purple-800/50 border border-purple-700/40 text-purple-200 p-4 rounded-xl mt-6 flex items-center justify-center gap-3 transition-all shadow-[0_0_15px_rgba(168,85,247,0.05)] font-bold tracking-wide"
            >
              <RefreshCcw size={20} className="text-purple-400" />
              {isPolice ? t('switch_rogue') : t('switch_bribe')}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Actions;
