import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

// Define the blueprint layout coordinates [x, z, width, depth]
const roomLayout = {
    cell: { pos: [-5, -5], size: [4, 4], color: '#f97316' }, // Orange
    break_room: { pos: [5, -5], size: [4, 4], color: '#3b82f6' }, // Blue
    yard: { pos: [0, 0], size: [14, 6], color: '#78716c' }, // Stone
    gym: { pos: [-5, 5], size: [4, 4], color: '#ef4444' }, // Red
    bank: { pos: [5, 5], size: [4, 4], color: '#eab308' }, // Yellow
    work_area: { pos: [0, 9], size: [14, 4], color: '#10b981' }, // Emerald
};

// Map logical IDs to coordinates for player movement
export const getRoomCoordinates = (roomId) => {
    const room = roomLayout[roomId];
    if (room) {
        return [room.pos[0], 0, room.pos[1]]; // Y is 0 (ground level)
    }
    return [0, 0, 0];
};

function Room({ id, pos, size, color, isAccessible, isCurrent, onClick }) {
    const { t } = useLanguage();

    // Y-position tweaks for visual hierarchy
    const yPos = isCurrent ? 0.2 : 0;

    return (
        <group position={[pos[0], yPos, pos[1]]}>
            {/* Floor */}
            <mesh
                receiveShadow
                position={[0, -0.25, 0]}
                onClick={(e) => {
                    e.stopPropagation();
                    if (isAccessible && !isCurrent) onClick(id);
                }}
                onPointerOver={() => { document.body.style.cursor = isAccessible && !isCurrent ? 'pointer' : 'default'; }}
                onPointerOut={() => { document.body.style.cursor = 'default'; }}
            >
                <boxGeometry args={[size[0] - 0.2, 0.5, size[1] - 0.2]} />
                <meshStandardMaterial
                    color={isAccessible ? color : '#333'}
                    roughness={0.8}
                    emissive={isCurrent ? color : '#000'}
                    emissiveIntensity={isCurrent ? 0.4 : 0}
                />
            </mesh>

            {/* Room Props based on ID */}
            {id === 'cell' && (
                <mesh position={[-1, 0.2, -1]} castShadow>
                    <boxGeometry args={[1, 0.4, 2]} />
                    <meshStandardMaterial color="#94a3b8" />
                </mesh>
            )}

            {id === 'break_room' && (
                <group position={[0, 0.3, 0]}>
                    <mesh castShadow position={[0, 0, 0]}><boxGeometry args={[2, 0.1, 1]} /><meshStandardMaterial color="#475569" /></mesh>
                    <mesh castShadow position={[-0.8, -0.15, 0]}><cylinderGeometry args={[0.05, 0.05, 0.3]} /><meshStandardMaterial color="#cbd5e1" /></mesh>
                    <mesh castShadow position={[0.8, -0.15, 0]}><cylinderGeometry args={[0.05, 0.05, 0.3]} /><meshStandardMaterial color="#cbd5e1" /></mesh>
                </group>
            )}

            {id === 'gym' && (
                <group position={[0, 0.2, 0]}>
                    <mesh castShadow position={[-1, 0, 0]}><cylinderGeometry args={[0.3, 0.3, 0.1]} rotation={[Math.PI/2, 0, 0]}/><meshStandardMaterial color="#1f2937" /></mesh>
                    <mesh castShadow position={[1, 0, 0]}><cylinderGeometry args={[0.3, 0.3, 0.1]} rotation={[Math.PI/2, 0, 0]}/><meshStandardMaterial color="#1f2937" /></mesh>
                    <mesh castShadow position={[0, 0, 0]}><cylinderGeometry args={[0.05, 0.05, 2]} rotation={[0, 0, Math.PI/2]}/><meshStandardMaterial color="#94a3b8" /></mesh>
                </group>
            )}

            {id === 'bank' && (
                <mesh position={[0, 0.5, -1]} castShadow>
                    <boxGeometry args={[2, 1, 0.5]} />
                    <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
                </mesh>
            )}

            {id === 'work_area' && (
                <group position={[0, 0.2, 0]}>
                    {[...Array(4)].map((_, i) => (
                        <mesh key={i} castShadow position={[-4 + i*2.5, 0, 0]}>
                            <boxGeometry args={[1.5, 0.4, 1.5]} />
                            <meshStandardMaterial color="#8b5cf6" />
                        </mesh>
                    ))}
                </group>
            )}

            {/* Optional: Add 3D Text here later for room names */}
        </group>
    );
}

function GameMap3D({ user, onAction }) {
    return (
        <group>
            {/* Base Platform / Grid */}
            <mesh receiveShadow position={[0, -0.6, 2]}>
                <boxGeometry args={[18, 0.2, 22]} />
                <meshStandardMaterial color="#1e293b" roughness={0.9} />
            </mesh>

            {/* Rooms */}
            {Object.entries(roomLayout).map(([id, data]) => {
                const isCurrent = user.location === id;
                const isAccessible = data.color !== '#333' && (data.type === undefined || data.type === user.role); // Simplified logic for now

                return (
                    <Room
                        key={id}
                        id={id}
                        pos={data.pos}
                        size={data.size}
                        color={data.color}
                        isAccessible={true} // Allow clicking any room for now based on lockdown rules handled by backend
                        isCurrent={isCurrent}
                        onClick={(dest) => onAction('move', { destination: dest })}
                    />
                );
            })}
        </group>
    );
}

export default GameMap3D;
