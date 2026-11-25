import { Canvas } from '@react-three/fiber'
import { Float, Html, OrbitControls, Sparkles } from '@react-three/drei'
import type { Lesson } from '../types'

interface UniverseSceneProps {
  lessons: Lesson[]
  completedIds: string[]
  onSelect: (lesson: Lesson) => void
}

function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.075, 0.38, 8]} />
        <meshStandardMaterial color="#a96f4b" roughness={1} />
      </mesh>
      <mesh position={[0, 0.48, 0]} castShadow>
        <sphereGeometry args={[0.23, 16, 14]} />
        <meshStandardMaterial color="#77b978" roughness={1} />
      </mesh>
      <mesh position={[-0.12, 0.58, 0.04]} castShadow>
        <sphereGeometry args={[0.15, 14, 12]} />
        <meshStandardMaterial color="#8bc987" roughness={1} />
      </mesh>
      <mesh position={[0.13, 0.59, -0.02]} castShadow>
        <sphereGeometry args={[0.15, 14, 12]} />
        <meshStandardMaterial color="#68aa70" roughness={1} />
      </mesh>
    </group>
  )
}

function LittleHouse({ color = '#f4bd72', scale = 1 }: { color?: string; scale?: number }) {
  return (
    <group scale={scale}>
      <mesh position={[0, 0.28, 0]} castShadow>
        <boxGeometry args={[0.62, 0.52, 0.5]} />
        <meshStandardMaterial color="#fff0d7" roughness={1} />
      </mesh>
      <mesh position={[0, 0.66, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[0.52, 0.42, 4]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>
      <mesh position={[0, 0.19, 0.254]}>
        <boxGeometry args={[0.15, 0.32, 0.025]} />
        <meshStandardMaterial color="#a86d4d" roughness={1} />
      </mesh>
      {[-0.2, 0.2].map((x) => (
        <mesh key={x} position={[x, 0.39, 0.258]}>
          <boxGeometry args={[0.12, 0.13, 0.025]} />
          <meshStandardMaterial color="#8bc8d2" roughness={0.65} />
        </mesh>
      ))}
    </group>
  )
}

function ShopFront({ color = '#e9a15d' }: { color?: string }) {
  return (
    <group>
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.7, 0.45, 0.5]} />
        <meshStandardMaterial color="#fff0d7" roughness={1} />
      </mesh>
      <mesh position={[0, 0.53, 0.02]} castShadow>
        <boxGeometry args={[0.82, 0.12, 0.62]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>
      <mesh position={[0, 0.72, 0.02]}>
        <boxGeometry args={[0.8, 0.3, 0.06]} />
        <meshStandardMaterial color="#fff7e9" roughness={1} />
      </mesh>
      <mesh position={[0, 0.72, 0.057]}>
        <boxGeometry args={[0.8, 0.055, 0.012]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>
    </group>
  )
}

function MosqueMiniature() {
  return (
    <group>
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.72, 0.5, 0.58]} />
        <meshStandardMaterial color="#fff0d9" roughness={1} />
      </mesh>
      <mesh position={[0, 0.58, 0]} castShadow>
        <sphereGeometry args={[0.25, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#78b8a2" roughness={0.9} />
      </mesh>
      <mesh position={[0.46, 0.43, -0.05]}>
        <cylinderGeometry args={[0.055, 0.07, 0.82, 10]} />
        <meshStandardMaterial color="#f3d59a" roughness={1} />
      </mesh>
      <mesh position={[0.46, 0.88, -0.05]}>
        <coneGeometry args={[0.09, 0.18, 10]} />
        <meshStandardMaterial color="#78b8a2" roughness={1} />
      </mesh>
    </group>
  )
}

function TrainMiniature() {
  return (
    <group>
      <mesh position={[0, 0.26, 0]} castShadow>
        <boxGeometry args={[0.78, 0.38, 0.43]} />
        <meshStandardMaterial color="#91c7d8" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.48, 0.02]}>
        <boxGeometry args={[0.58, 0.16, 0.42]} />
        <meshStandardMaterial color="#fff0d9" roughness={1} />
      </mesh>
      {[-0.23, 0.23].map((x) => (
        <mesh key={x} position={[x, 0.06, 0.22]}>
          <cylinderGeometry args={[0.09, 0.09, 0.07, 14]} />
          <meshStandardMaterial color="#6f777b" roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

function PalmTree({ position = [0.34, 0, 0] as [number, number, number] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.28, 0]} rotation={[0, 0, -0.12]}>
        <cylinderGeometry args={[0.035, 0.055, 0.62, 8]} />
        <meshStandardMaterial color="#a9794c" roughness={1} />
      </mesh>
      {[0, 1, 2, 3, 4].map((index) => (
        <mesh key={index} position={[0, 0.62, 0]} rotation={[0.1, (Math.PI * 2 * index) / 5, 0.28]}>
          <capsuleGeometry args={[0.055, 0.3, 3, 6]} />
          <meshStandardMaterial color="#62a979" roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

function DestinationModel({ lesson }: { lesson: Lesson }) {
  if (lesson.id === 'mosque') return <MosqueMiniature />
  if (lesson.id === 'station') return <TrainMiniature />
  if (lesson.id === 'park') return <Tree position={[0.28, 0, 0]} scale={0.95} />
  if (lesson.id === 'beach') return <PalmTree />
  if (['canteen', 'market', 'restaurant'].includes(lesson.id)) return <ShopFront color={lesson.color} />
  return <LittleHouse color={lesson.color} scale={lesson.id === 'hospital' ? 1.08 : 0.92} />
}

function Mascot({
  position,
  shirt,
  hair,
  skin = '#d99b72',
  scale = 1,
  wave = false,
}: {
  position: [number, number, number]
  shirt: string
  hair: string
  skin?: string
  scale?: number
  wave?: boolean
}) {
  return (
    <Float speed={1.5} rotationIntensity={0.04} floatIntensity={0.07}>
      <group position={position} scale={scale} rotation={[0, -0.12, 0]}>
        <mesh position={[0, 0.34, 0]} castShadow>
          <capsuleGeometry args={[0.18, 0.35, 4, 10]} />
          <meshStandardMaterial color={shirt} roughness={0.95} />
        </mesh>
        <mesh position={[0, 0.91, 0]} castShadow>
          <sphereGeometry args={[0.285, 24, 20]} />
          <meshStandardMaterial color={skin} roughness={0.98} />
        </mesh>
        <mesh position={[0, 1.105, -0.005]} scale={[1.03, 0.62, 1.02]} castShadow>
          <sphereGeometry args={[0.29, 20, 16]} />
          <meshStandardMaterial color={hair} roughness={1} />
        </mesh>
        <mesh position={[-0.235, 0.99, 0.005]}>
          <sphereGeometry args={[0.095, 14, 12]} />
          <meshStandardMaterial color={hair} roughness={1} />
        </mesh>
        <mesh position={[0.235, 0.99, 0.005]}>
          <sphereGeometry args={[0.095, 14, 12]} />
          <meshStandardMaterial color={hair} roughness={1} />
        </mesh>
        {[-0.095, 0.095].map((x) => (
          <group key={x} position={[x, 0.94, 0.252]}>
            <mesh>
              <sphereGeometry args={[0.043, 12, 10]} />
              <meshStandardMaterial color="#fffdf7" roughness={0.6} />
            </mesh>
            <mesh position={[0, -0.002, 0.035]}>
              <sphereGeometry args={[0.023, 10, 8]} />
              <meshStandardMaterial color="#34302d" roughness={0.8} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 0.865, 0.27]}>
          <sphereGeometry args={[0.035, 10, 8]} />
          <meshStandardMaterial color="#c57f5e" roughness={1} />
        </mesh>
        <mesh position={[0, 0.81, 0.264]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.055, 0.008, 6, 18, Math.PI]} />
          <meshStandardMaterial color="#854e45" roughness={1} />
        </mesh>
        <mesh position={[-0.27, 0.42, 0]} rotation={[0, 0, wave ? -0.85 : -0.32]} castShadow>
          <capsuleGeometry args={[0.055, 0.25, 3, 8]} />
          <meshStandardMaterial color={shirt} roughness={0.95} />
        </mesh>
        <mesh position={[0.27, 0.42, 0]} rotation={[0, 0, wave ? 0.9 : 0.32]} castShadow>
          <capsuleGeometry args={[0.055, 0.25, 3, 8]} />
          <meshStandardMaterial color={shirt} roughness={0.95} />
        </mesh>
        <mesh position={[-0.105, -0.02, 0]} castShadow>
          <capsuleGeometry args={[0.065, 0.19, 3, 8]} />
          <meshStandardMaterial color="#53647a" roughness={1} />
        </mesh>
        <mesh position={[0.105, -0.02, 0]} castShadow>
          <capsuleGeometry args={[0.065, 0.19, 3, 8]} />
          <meshStandardMaterial color="#53647a" roughness={1} />
        </mesh>
        <mesh position={[-0.11, -0.12, 0.06]}>
          <sphereGeometry args={[0.09, 12, 10]} />
          <meshStandardMaterial color="#f1d8bd" roughness={1} />
        </mesh>
        <mesh position={[0.11, -0.12, 0.06]}>
          <sphereGeometry args={[0.09, 12, 10]} />
          <meshStandardMaterial color="#f1d8bd" roughness={1} />
        </mesh>
      </group>
    </Float>
  )
}

function FloatingIsland({ lesson, completed, onSelect }: { lesson: Lesson; completed: boolean; onSelect: (lesson: Lesson) => void }) {
  return (
    <group position={lesson.orbitPosition}>
      <Float speed={1.05} rotationIntensity={0.12} floatIntensity={0.18}>
        <group
          onClick={(event) => { event.stopPropagation(); onSelect(lesson) }}
          onPointerOver={() => { document.body.style.cursor = 'pointer' }}
          onPointerOut={() => { document.body.style.cursor = 'auto' }}
        >
          <mesh position={[0, -0.1, 0]} castShadow>
            <cylinderGeometry args={[0.62, 0.49, 0.28, 18]} />
            <meshStandardMaterial color="#bd956e" roughness={1} />
          </mesh>
          <mesh position={[0, 0.045, 0]} castShadow>
            <cylinderGeometry args={[0.62, 0.62, 0.07, 18]} />
            <meshStandardMaterial color="#a7ce91" roughness={1} />
          </mesh>
          <group position={[0, 0.08, 0]}>
            <DestinationModel lesson={lesson} />
          </group>
          <mesh
            position={[0, 0.02, 0.42]}
            onClick={(event) => { event.stopPropagation(); onSelect(lesson) }}
            onPointerOver={() => { document.body.style.cursor = 'pointer' }}
            onPointerOut={() => { document.body.style.cursor = 'auto' }}
          >
            <sphereGeometry args={[0.08, 10, 8]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
          <mesh position={[0, 0.48, 0]} onClick={(event) => { event.stopPropagation(); onSelect(lesson) }}>
            <sphereGeometry args={[0.72, 18, 14]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
          <Html center distanceFactor={10} position={[0, -0.76, 0]}>
            <button className={`planet-label ${completed ? 'completed' : ''}`} onClick={() => onSelect(lesson)} type="button">
              <span>{lesson.name}</span>
              <span className="planet-label-arabic" dir="rtl">{lesson.arabicName}</span>
              {completed && <span className="planet-check">✓</span>}
            </button>
          </Html>
        </group>
      </Float>
    </group>
  )
}

function CentralIsland() {
  return (
    <group position={[0, -0.1, 0]}>
      <mesh position={[0, -0.24, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.42, 1.12, 0.42, 28]} />
        <meshStandardMaterial color="#bd956e" roughness={1} />
      </mesh>
      <mesh position={[0, -0.02, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.42, 1.42, 0.1, 28]} />
        <meshStandardMaterial color="#a7ce91" roughness={1} />
      </mesh>
      <group position={[0, 0.02, -0.28]} scale={1.12}>
        <LittleHouse color="#e99d65" />
      </group>
      <Tree position={[-0.9, 0.03, 0.2]} scale={0.9} />
      <Tree position={[0.88, 0.03, 0.18]} scale={0.84} />
      <Mascot position={[-0.43, 0.23, 0.48]} shirt="#e67f59" hair="#49372f" scale={0.84} wave />
      <Mascot position={[0.43, 0.23, 0.48]} shirt="#6e9fce" hair="#3d302d" skin="#e6b18a" scale={0.84} />
      <Html center distanceFactor={8} position={[0, -0.72, 0.12]}>
        <div className="sun-label">MULAI PETUALANGAN</div>
      </Html>
    </group>
  )
}

function SceneContents({ lessons, completedIds, onSelect }: UniverseSceneProps) {
  return (
    <>
      <color attach="background" args={['#d9edf2']} />
      <hemisphereLight args={['#fff7e9', '#8ebc9d', 1.55]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 7]} intensity={2.2} color="#fff4df" castShadow />
      <directionalLight position={[-5, 3, -4]} intensity={0.65} color="#d3e7ff" />
      <Sparkles count={85} scale={15} size={2.1} speed={0.22} color="#fff8e8" opacity={0.72} />
      <Float speed={0.45} rotationIntensity={0.015} floatIntensity={0.035}>
        <CentralIsland />
      </Float>
      {lessons.map((lesson) => (
        <FloatingIsland key={lesson.id} lesson={lesson} completed={completedIds.includes(lesson.id)} onSelect={onSelect} />
      ))}
      <OrbitControls enablePan={false} minDistance={9.5} maxDistance={15} enableDamping dampingFactor={0.07} autoRotate autoRotateSpeed={0.12} maxPolarAngle={Math.PI * 0.72} minPolarAngle={Math.PI * 0.28} />
    </>
  )
}

export default function UniverseScene(props: UniverseSceneProps) {
  return (
    <div className="universe-canvas">
      <Canvas camera={{ position: [0, 0.4, 12.8], fov: 42 }} dpr={[1, 1.5]} shadows gl={{ antialias: true, alpha: true }}>
        <SceneContents {...props} />
      </Canvas>
      <div className="canvas-hint">Geser untuk melihat dunia · Scroll untuk memperbesar</div>
    </div>
  )
}
