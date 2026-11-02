import React, { useRef, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/three';
import { useFrame } from '@react-three/fiber';
import { getRoomCoordinates } from './GameMap3D';

function PlayerAvatar({ user }) {
    const meshRef = useRef();

    // Determine target position based on location
    const targetPos = getRoomCoordinates(user.location);
    // Add slight offset so player isn't exactly at 0,0 of the room
    const targetX = targetPos[0] + 0.5;
    const targetZ = targetPos[2] + 0.5;

    // Smooth animation for movement using react-spring
    const { position } = useSpring({
        position: [targetX, 0.6, targetZ], // Y is 0.6 to sit on top of the floor (0.5 tall capsule + 0.1 offset)
        config: { mass: 1, tension: 170, friction: 26 }
    });

    // Idle floating animation
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
        }
    });

    const isPolice = user.role === 'police';
    const playerColor = isPolice ? '#60a5fa' : '#fb923c'; // Blue for police, Orange for prisoner
    const visorColor = isPolice ? '#1e3a8a' : '#7c2d12';

    return (
        <animated.group position={position}>
            <group ref={meshRef}>
                {/* Body */}
                <mesh castShadow receiveShadow position={[0, 0, 0]}>
                    <capsuleGeometry args={[0.3, 0.6, 4, 16]} />
                    <meshStandardMaterial color={playerColor} roughness={0.4} metalness={0.1} />
                </mesh>

                {/* Visor / Face */}
                <mesh castShadow position={[0, 0.3, 0.25]}>
                    <boxGeometry args={[0.4, 0.2, 0.2]} />
                    <meshStandardMaterial color={visorColor} roughness={0.2} metalness={0.8} />
                </mesh>

                {/* Weapon indicator (if any) */}
                {user.weapon !== 'none' && (
                    <mesh castShadow position={[0.4, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
                        <cylinderGeometry args={[0.02, 0.02, 0.6]} />
                        <meshStandardMaterial color="#ef4444" metalness={0.8} />
                    </mesh>
                )}
            </group>
        </animated.group>
    );
}

export default PlayerAvatar;
