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
      <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
          {t('actions_panel')}
      </h2>

      <div className="space-y-8 flex-grow">

        {/* Contextual Location Actions */}
        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50 relative overflow-hidden">
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4 font-semibold z-10 relative">Location Actions</h3>

            {user.location === 'work_area' && (
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onAction('work')}
                    className="w-full bg-gradient-to-br from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white p-4 rounded-xl shadow-lg border border-emerald-500/50 flex items-center justify-between z-10 relative"
                >
                    <div className="flex items-center gap-2"><Pickaxe /> <span className="font-bold">{t('work_shift')}</span></div>
                    <span className="text-xs font-mono bg-black/30 px-2 py-1 rounded-full">{t('work_cost')}</span>
                </motion.button>
            )}

            {(user.location === 'yard' || user.location === 'work_area') && (
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onAction('steal')}
                    className="w-full mt-3 bg-gradient-to-br from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white p-4 rounded-xl shadow-lg border border-red-500/50 flex items-center justify-between z-10 relative"
                >
                    <div className="flex items-center gap-2"><Skull /> <span className="font-bold">{t('heal_steal')}</span></div>
                    <span className="text-xs font-mono bg-black/30 px-2 py-1 rounded-full">{t('steal_cost')}</span>
                </motion.button>
            )}

            {(user.location === 'cell' || user.location === 'break_room') && (
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onAction('rest')}
                    className="w-full bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white p-4 rounded-xl shadow-lg border border-blue-500/50 flex items-center justify-center gap-3 z-10 relative"
                >
                    <Bed /> <span className="font-bold text-lg">{t('rest_recover')}</span>
                </motion.button>
            )}

            {user.location === 'gym' && (
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onAction('train')}
                    className="w-full bg-gradient-to-br from-orange-600 to-orange-800 hover:from-orange-500 hover:to-orange-700 text-white p-4 rounded-xl shadow-lg border border-orange-500/50 flex items-center justify-between z-10 relative"
                >
                    <div className="flex items-center gap-2"><Pickaxe /> <span className="font-bold">{t('train_gym')}</span></div>
                    <span className="text-xs font-mono bg-black/30 px-2 py-1 rounded-full">-40 STA | +1 STR</span>
                </motion.button>
            )}

            {user.location === 'bank' && (
                <div className="flex gap-2 z-10 relative mt-2">
                    <input
                        type="number"
                        value={bankAmount}
                        onChange={(e) => setBankAmount(e.target.value)}
                        placeholder="Amount..."
                        className="flex-grow bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                    <button
                        onClick={() => handleBankAction('deposit')}
                        className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-semibold transition"
                    >
                        {t('deposit')}
                    </button>
                    <button
                        onClick={() => handleBankAction('withdraw')}
                        className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-semibold transition"
                    >
                        {t('withdraw')}
                    </button>
                </div>
            )}
        </div>

        {/* Upgrades */}
        <div>
          <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3 font-semibold">{t('facilities')}</h3>
          <div className="space-y-3">
            <button
              onClick={() => onAction('upgrade_room')}
              disabled={user.money < upgradeCost}
              className={`w-full p-3 rounded-xl flex justify-between items-center transition border ${user.money < upgradeCost ? 'bg-gray-800/50 border-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700 border-gray-600 hover:border-gray-500 text-white'}`}
            >
              <div className="flex items-center gap-2"><ArrowUpCircle size={18} /> {t('upgrade')} {roomName}</div>
              <span className={`font-mono ${user.money < upgradeCost ? 'text-red-900' : 'text-yellow-400'}`}>${upgradeCost.toLocaleString()}</span>
            </button>

            <button
              onClick={() => onAction('craft_weapon')}
              disabled={user.money < 200 || user.weapon !== 'none'}
              className={`w-full p-3 rounded-xl flex justify-between items-center transition border ${user.money < 200 || user.weapon !== 'none' ? 'bg-gray-800/50 border-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700 border-gray-600 hover:border-gray-500 text-white'}`}
            >
              <div className="flex items-center gap-2"><Hammer size={18} /> {t('craft_shiv')}</div>
              <span className={`font-mono ${user.money < 200 ? 'text-red-900' : 'text-yellow-400'}`}>$200</span>
            </button>

            <button
              onClick={() => onAction('switch_role')}
              className="w-full bg-purple-900/40 hover:bg-purple-800/60 border border-purple-700/50 text-purple-200 p-3 rounded-xl mt-4 flex items-center justify-center gap-2 transition"
            >
              <RefreshCcw size={18} />
              {isPolice ? t('switch_rogue') : t('switch_bribe')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Actions;
