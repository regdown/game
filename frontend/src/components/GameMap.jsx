import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { MapPin } from 'lucide-react';

const locations = [
  { id: 'cell', type: 'prisoner', color: 'bg-orange-900/50', hover: 'hover:bg-orange-800/60', border: 'border-orange-500/50' },
  { id: 'break_room', type: 'police', color: 'bg-blue-900/50', hover: 'hover:bg-blue-800/60', border: 'border-blue-500/50' },
  { id: 'yard', type: 'neutral', color: 'bg-gray-700/50', hover: 'hover:bg-gray-600/60', border: 'border-gray-500/50' },
  { id: 'gym', type: 'neutral', color: 'bg-red-900/50', hover: 'hover:bg-red-800/60', border: 'border-red-500/50' },
  { id: 'bank', type: 'neutral', color: 'bg-yellow-900/50', hover: 'hover:bg-yellow-800/60', border: 'border-yellow-500/50' },
  { id: 'work_area', type: 'neutral', color: 'bg-emerald-900/50', hover: 'hover:bg-emerald-800/60', border: 'border-emerald-500/50' },
];

function GameMap({ user, onAction }) {
  const { t } = useLanguage();

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
          {t('map_title')}
      </h2>

      <div className="grid grid-cols-2 gap-3 flex-grow">
        {locations.map((loc) => {
            const isCurrent = user.location === loc.id;
            const isAccessible = loc.type === 'neutral' || loc.type === user.role;
            const displayName = t(`location_${loc.id}`);

            return (
                <motion.div
                    key={loc.id}
                    whileHover={isAccessible && !isCurrent ? { scale: 1.02 } : {}}
                    className={`relative p-4 rounded-xl border flex flex-col justify-between overflow-hidden transition-all
                        ${isCurrent ? `${loc.color} ${loc.border} shadow-[0_0_15px_rgba(255,255,255,0.2)] scale-[1.02]` : ''}
                        ${!isCurrent && isAccessible ? `${loc.color} border-gray-700 ${loc.hover} cursor-pointer opacity-80` : ''}
                        ${!isAccessible ? 'bg-gray-900/80 border-gray-800 opacity-40 grayscale cursor-not-allowed' : ''}
                    `}
                    onClick={() => {
                        if (isAccessible && !isCurrent) {
                            onAction('move', { destination: loc.id });
                        }
                    }}
                >
                    <div className="flex items-center gap-2 z-10">
                        {isCurrent && <MapPin className="text-white animate-bounce" size={20} />}
                        <span className="font-bold text-white tracking-wide">{displayName}</span>
                    </div>

                    {!isCurrent && isAccessible && (
                        <div className="mt-4 text-xs font-semibold text-gray-300 uppercase opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            {t('btn_move')}
                        </div>
                    )}

                    {/* Stylized background lines for texture */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #fff 10px, #fff 11px)' }}></div>
                </motion.div>
            );
        })}
      </div>
    </div>
  );
}

export default GameMap;
