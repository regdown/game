function Dashboard({ user }) {
  const isPolice = user.role === 'police';
  const roomName = isPolice ? 'Break Room' : 'Cell';
  const roomLevel = isPolice ? user.break_room_level : user.cell_level;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2 flex justify-between items-center">
        <span>{user.username}</span>
        <span className={`text-sm px-2 py-1 rounded uppercase tracking-wide font-bold ${isPolice ? 'bg-blue-600' : 'bg-orange-600'}`}>
          {user.role}
        </span>
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-700 p-3 rounded">
          <p className="text-gray-400 text-sm">Stamina</p>
          <p className="text-xl font-mono text-green-400">{user.stamina}</p>
        </div>
        <div className="bg-gray-700 p-3 rounded">
          <p className="text-gray-400 text-sm">Money</p>
          <p className="text-xl font-mono text-yellow-400">${user.money}</p>
        </div>
        <div className="bg-gray-700 p-3 rounded">
          <p className="text-gray-400 text-sm">Experience</p>
          <p className="text-xl font-mono text-purple-400">{user.exp}</p>
        </div>
        <div className="bg-gray-700 p-3 rounded">
          <p className="text-gray-400 text-sm">{roomName} Lvl</p>
          <p className="text-xl font-mono">{roomLevel}</p>
        </div>
        <div className="col-span-2 bg-gray-700 p-3 rounded">
          <p className="text-gray-400 text-sm">Weapon</p>
          <p className="text-xl capitalize">{user.weapon}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
