import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { MapPin } from 'lucide-react';

const locations = [
  { id: 'cell', type: 'prisoner', color: 'bg-orange-950/80', hover: 'hover:bg-orange-900/90', border: 'border-orange-500/50', span: 'col-span-1 row-span-1', pattern: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0,0,0,0.5) 10px, rgba(0,0,0,0.5) 12px)' },
  { id: 'break_room', type: 'police', color: 'bg-blue-950/80', hover: 'hover:bg-blue-900/90', border: 'border-blue-500/50', span: 'col-span-1 row-span-1', pattern: 'radial-gradient(circle, rgba(255,255,255,0.05) 2px, transparent 2px)' },
  { id: 'yard', type: 'neutral', color: 'bg-stone-800/80', hover: 'hover:bg-stone-700/90', border: 'border-stone-500/50', span: 'col-span-2 row-span-2', pattern: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.2) 10px, rgba(0,0,0,0.2) 11px), repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(0,0,0,0.2) 10px, rgba(0,0,0,0.2) 11px)' },
  { id: 'gym', type: 'neutral', color: 'bg-red-950/80', hover: 'hover:bg-red-900/90', border: 'border-red-500/50', span: 'col-span-1 row-span-1', pattern: 'radial-gradient(circle, rgba(0,0,0,0.3) 2px, transparent 3px)' },
  { id: 'bank', type: 'neutral', color: 'bg-yellow-950/80', hover: 'hover:bg-yellow-900/90', border: 'border-yellow-500/50', span: 'col-span-1 row-span-1', pattern: 'linear-gradient(135deg, rgba(255,255,255,0.05) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.05) 75%, transparent 75%, transparent)' },
  { id: 'work_area', type: 'neutral', color: 'bg-emerald-950/80', hover: 'hover:bg-emerald-900/90', border: 'border-emerald-500/50', span: 'col-span-2 row-span-1', pattern: 'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(0,0,0,0.2) 20px, rgba(0,0,0,0.2) 21px)' },
];

function GameMap({ user, onAction }) {
  const { t } = useLanguage();

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-extrabold mb-6 text-white flex items-center gap-2 drop-shadow-md">
          {t('map_title')} <span className="text-xs font-mono text-blue-400 border border-blue-400/50 px-2 py-1 rounded-full bg-blue-900/20">BLUEPRINT</span>
      </h2>

      <div className="grid grid-cols-2 grid-rows-4 gap-4 flex-grow p-4 bg-blue-950/10 rounded-2xl border border-blue-500/20 shadow-inner">
        {locations.map((loc) => {
            const isCurrent = user.location === loc.id;
            const isAccessible = loc.type === 'neutral' || loc.type === user.role;
            const displayName = t(`location_${loc.id}`);

            return (
                <motion.div
                    key={loc.id}
                    whileHover={isAccessible && !isCurrent ? { scale: 1.03 } : {}}
                    whileTap={isAccessible && !isCurrent ? { scale: 0.97 } : {}}
                    className={`relative p-5 rounded-xl flex flex-col justify-between overflow-hidden transition-colors duration-300
                        ${loc.span}
                        ${isCurrent ? `${loc.color} ${loc.border} border-2 shadow-[0_0_20px_rgba(255,255,255,0.15)] ring-2 ring-white/20 z-10` : ''}
                        ${!isCurrent && isAccessible ? `${loc.color} border border-gray-700/50 ${loc.hover} cursor-pointer` : ''}
                        ${!isAccessible ? 'bg-gray-900/40 border border-gray-800/50 opacity-50 grayscale cursor-not-allowed' : ''}
                    `}
                    onClick={() => {
                        if (isAccessible && !isCurrent) {
                            onAction('move', { destination: loc.id });
                        }
                    }}
                >
                    {/* Pattern Overlay */}
                    <div
                        className="absolute inset-0 opacity-30 pointer-events-none mix-blend-overlay"
                        style={{ backgroundImage: loc.pattern, backgroundSize: '20px 20px' }}
                    ></div>

                    <div className="flex items-center gap-2 z-10">
                        {isCurrent && <MapPin className="text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]" size={24} />}
                        <span className="font-extrabold text-white tracking-wider drop-shadow-md text-lg">{displayName}</span>
                    </div>

                    {!isCurrent && isAccessible && (
                        <div className="mt-4 text-xs font-bold text-gray-300 uppercase opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-black/40 self-start px-2 py-1 rounded">
                            {t('btn_move')}
                        </div>
                    )}
                </motion.div>
            );
        })}
      </div>
    </div>
  );
}

export default GameMap;
