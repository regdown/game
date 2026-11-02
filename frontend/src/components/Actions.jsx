function Actions({ user, onAction }) {
  const isPolice = user.role === 'police';
  const roomName = isPolice ? 'Break Room' : 'Cell';
  const roomLevel = isPolice ? user.break_room_level : user.cell_level;
  const upgradeCost = roomLevel * 100;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">Actions</h2>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onAction('work')}
            className="bg-green-700 hover:bg-green-600 text-white py-2 px-4 rounded shadow transition flex flex-col items-center"
          >
            <span className="font-bold">Work</span>
            <span className="text-xs opacity-75">-20 Stamina | +$</span>
          </button>

          <button
            onClick={() => onAction('steal')}
            className="bg-red-700 hover:bg-red-600 text-white py-2 px-4 rounded shadow transition flex flex-col items-center"
          >
            <span className="font-bold">Steal</span>
            <span className="text-xs opacity-75">-30 Stamina | High Risk</span>
          </button>
        </div>

        <button
          onClick={() => onAction('rest')}
          className="w-full bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded shadow transition flex flex-col items-center"
        >
          <span className="font-bold">Rest</span>
          <span className="text-xs opacity-75">Recover Stamina</span>
        </button>

        <div className="border-t border-gray-700 pt-4 mt-4">
          <h3 className="text-lg font-semibold mb-3">Upgrades & Crafting</h3>
          <div className="space-y-3">
            <button
              onClick={() => onAction('upgrade_room')}
              className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded flex justify-between items-center"
              disabled={user.money < upgradeCost}
            >
              <span>Upgrade {roomName}</span>
              <span className={user.money < upgradeCost ? 'text-red-400' : 'text-yellow-400'}>${upgradeCost}</span>
            </button>

            <button
              onClick={() => onAction('craft_weapon')}
              className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded flex justify-between items-center"
              disabled={user.money < 200 || user.weapon !== 'none'}
            >
              <span>Craft Shiv</span>
              <span className={user.money < 200 ? 'text-red-400' : 'text-yellow-400'}>$200</span>
            </button>

            <button
              onClick={() => onAction('switch_role')}
              className="w-full bg-purple-700 hover:bg-purple-600 text-white py-2 px-4 rounded mt-4"
            >
              Switch Role ({isPolice ? 'to Prisoner' : 'Bribe Police - $500'})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Actions;
