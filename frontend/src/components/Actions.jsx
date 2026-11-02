import { useState } from 'react';
import { Pickaxe, Skull, Bed, Hammer, ArrowUpCircle, RefreshCcw, Vault } from 'lucide-react';
import { motion } from 'framer-motion';

function Actions({ user, onAction }) {
  const [bankAmount, setBankAmount] = useState('');
  const isPolice = user.role === 'police';
  const roomName = isPolice ? 'Break Room' : 'Cell';
  const roomLevel = isPolice ? user.break_room_level : user.cell_level;
  const upgradeCost = roomLevel * 100;

  const handleBankAction = (type) => {
      onAction(type, bankAmount);
      setBankAmount('');
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
          Actions Panel
      </h2>

      <div className="space-y-8 flex-grow">

        {/* Core Actions */}
        <div>
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3 font-semibold">City Streets</h3>
            <div className="grid grid-cols-2 gap-4">
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onAction('work')}
                className="bg-gradient-to-br from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white p-4 rounded-xl shadow-lg border border-emerald-500/50 flex flex-col items-center justify-center gap-2 group"
            >
                <Pickaxe className="group-hover:rotate-12 transition-transform" />
                <span className="font-bold">Work Shift</span>
                <span className="text-[10px] uppercase bg-black/30 px-2 py-1 rounded-full">-20 Stamina</span>
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onAction('steal')}
                className="bg-gradient-to-br from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white p-4 rounded-xl shadow-lg border border-red-500/50 flex flex-col items-center justify-center gap-2 group"
            >
                <Skull className="group-hover:scale-110 transition-transform" />
                <span className="font-bold">Heal / Steal</span>
                <span className="text-[10px] uppercase bg-black/30 px-2 py-1 rounded-full">-30 STA | Risk DMG</span>
            </motion.button>
            </div>

            <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onAction('rest')}
            className="w-full mt-4 bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white p-4 rounded-xl shadow-lg border border-blue-500/50 flex items-center justify-center gap-3"
            >
            <Bed />
            <span className="font-bold text-lg">Rest & Recover</span>
            </motion.button>
        </div>

        {/* Banking */}
        <div>
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3 font-semibold flex items-center gap-2"><Vault size={14}/> City Bank</h3>
            <div className="flex gap-2">
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
                    Deposit
                </button>
                <button
                    onClick={() => handleBankAction('withdraw')}
                    className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-semibold transition"
                >
                    Withdraw
                </button>
            </div>
        </div>

        {/* Upgrades */}
        <div>
          <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3 font-semibold">Facilities & Black Market</h3>
          <div className="space-y-3">
            <button
              onClick={() => onAction('upgrade_room')}
              disabled={user.money < upgradeCost}
              className={`w-full p-3 rounded-xl flex justify-between items-center transition border ${user.money < upgradeCost ? 'bg-gray-800/50 border-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700 border-gray-600 hover:border-gray-500 text-white'}`}
            >
              <div className="flex items-center gap-2"><ArrowUpCircle size={18} /> Upgrade {roomName}</div>
              <span className={`font-mono ${user.money < upgradeCost ? 'text-red-900' : 'text-yellow-400'}`}>${upgradeCost.toLocaleString()}</span>
            </button>

            <button
              onClick={() => onAction('craft_weapon')}
              disabled={user.money < 200 || user.weapon !== 'none'}
              className={`w-full p-3 rounded-xl flex justify-between items-center transition border ${user.money < 200 || user.weapon !== 'none' ? 'bg-gray-800/50 border-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700 border-gray-600 hover:border-gray-500 text-white'}`}
            >
              <div className="flex items-center gap-2"><Hammer size={18} /> Craft Shiv</div>
              <span className={`font-mono ${user.money < 200 ? 'text-red-900' : 'text-yellow-400'}`}>$200</span>
            </button>

            <button
              onClick={() => onAction('switch_role')}
              className="w-full bg-purple-900/40 hover:bg-purple-800/60 border border-purple-700/50 text-purple-200 p-3 rounded-xl mt-4 flex items-center justify-center gap-2 transition"
            >
              <RefreshCcw size={18} />
              {isPolice ? 'Go Rogue (Become Prisoner)' : 'Bribe Police Chief ($500 & 100 EXP)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Actions;
