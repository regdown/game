import { Canvas } from '@react-three/fiber';
import { OrthographicCamera, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';

function Scene({ children }) {
  return (
    <div className="absolute inset-0 z-0 bg-gray-950">
        <Canvas shadows>
            {/* Isometric Camera Setup */}
            <OrthographicCamera
                makeDefault
                position={[20, 20, 20]}
                zoom={45}
                near={-100}
                far={100}
            />

            {/* Atmospheric Lighting */}
            <ambientLight intensity={0.3} />
            <directionalLight
                position={[15, 30, 15]}
                intensity={2}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-far={100}
                shadow-camera-left={-30}
                shadow-camera-right={30}
                shadow-camera-top={30}
                shadow-camera-bottom={-30}
                shadow-bias={-0.0001}
            />

            {/* Environment mapping for nice reflections */}
            <Environment preset="city" />

            {/* Content (Map and Players) */}
            {children}

            {/* Post-Processing Effects for Modern Game Look */}
            <EffectComposer>
                <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={0.5} />
                <Noise opacity={0.02} />
                <Vignette eskil={false} offset={0.1} darkness={1.1} />
            </EffectComposer>
        </Canvas>
    </div>
  );
}

export default Scene;
