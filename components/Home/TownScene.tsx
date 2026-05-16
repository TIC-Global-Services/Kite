"use client";

import { useRef, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations, Environment, Stats } from "@react-three/drei";
import * as THREE from "three";
import { useControls, folder } from "leva";

// ── Place data ────────────────────────────────────────────────────────────

export interface PlaceConfig {
  id: number;
  url: string;
  position: [number, number, number];
  rotation: [number, number, number]; // euler angles in radians
  name: string;
  desc: string;
  targetSize: number; // per-model base size in world units
}

export const PLACES: PlaceConfig[] = [
  // Row 1 — left to right (places 1–4)
  {
    id: 1,
    url: "/Models/1.glb",
    position: [-35, 0, 38],
    rotation: [0, Math.PI, 0],
    targetSize: 90,
    name: "The Archive",
    desc: "Where every signal is received and catalogued with perfect recall.",
  },
  {
    id: 2,
    url: "/Models/2.glb",
    position: [78, -2, 39],
    rotation: [0, 0, 0],
    targetSize: 22,
    name: "The Relay",
    desc: "Intelligence branches outward, connecting every thread of the network.",
  },
  {
    id: 3,
    url: "/Models/3.glb",
    position: [-25, -3, 53],
    rotation: [0, Math.PI, 0],
    targetSize: 28,
    name: "The Core",
    desc: "The heart of Kite — where raw context becomes decisive understanding.",
  },
  {
    id: 4,
    url: "/Models/4.glb",
    position: [-105, -4, 85],
    rotation: [0, Math.PI, 0],
    targetSize: 22,
    name: "The Bridge",
    desc: "Decisions cross into action through a network of coordinated agents.",
  },
  // Direction turns here — row 2 comes back left (places 5–7)
  {
    id: 5,
    url: "/Models/5.glb",
    position: [50, 0, -30],
    rotation: [0, 0, 0],
    targetSize: 26,
    name: "The Horizon",
    desc: "Where Kite's reach extends — output meets the real world.",
  },
  {
    id: 6,
    url: "/Models/6.glb",
    position: [-58, 0, 85],
    rotation: [0, Math.PI, 0],
    targetSize: 22,
    name: "The Forge",
    desc: "Raw intelligence is shaped into precise, deployable action.",
  },
  {
    id: 7,
    url: "/Models/7.glb",
    position: [-40, 0, 50],
    rotation: [0, -Math.PI, 0],
    targetSize: 28,
    name: "The Nexus",
    desc: "All systems converge — the living center of the Kite network.",
  },
  {
    id: 8,
    url: "/Models/8.glb",
    position: [40, -5, -65],
    rotation: [0, 0, 0],
    targetSize: 28,
    name: "The Vault",
    desc: "Secured intelligence — where critical knowledge is preserved and protected.",
  },
];



// ── Camera waypoints (one per model, index 0 = start overview) ────────────

const WAYPOINTS = [
  // 0 — original canvas camera position, target nearest model cluster
  { pos: [-55,  8,  45], target: [-30,  5,  20] },
  // 1 — Archive  [-35, 0, 38]  size 90  rot π (faces -Z) → camera on -Z side
  { pos: [-22, 8, 63], target: [-22,  5,  46] },
  // 2 — Relay    [ 78,-2, 39]  size 22  rot 0  (faces +Z) → camera on +Z side
  { pos: [ 26,  24,  83], target: [ 25,  -2,  20] },
  // 3 — Core     [-25, 0, 53]  size 28  rot π (faces -Z) → camera on -Z side
  { pos: [24, 7,  6], target: [107,  1,  5] },
  // 4 — Bridge  [-105, 0, 85]  size 22  rot π (faces -Z) → camera on -Z side
  { pos: [25,  7,  -30], target: [128,  -3,  -30] },
  // 5 — Horizon  [ 50, 0,-30]  size 26  rot 0  (faces +Z) → camera on +Z side
  { pos: [ 0, 7,   -19], target: [ -2,  4, -55] },
  // 6 — Forge    [-58, 0, 85]  size 22  rot π (faces -Z) → camera on -Z side
  { pos: [-1,  16,  -12], target: [-27,  11,  -11] },
  // 7 — Nexus    [-40, 0, 50]  size 28  rot-π (faces -Z) → camera on -Z side
  { pos: [-35, 20,  20], target: [0,  -2,  -15] },
  // 8 — Vault    [ 40,-5,-65]  size 28  rot 0  (faces +Z) → camera on +Z side
  { pos: [ -52,  53, 76], target: [ 49,  -71, -72] },
] as const;

// ── Scroll-driven camera ────────────────────────────────────────────────────

const WAYPOINT_NAMES = ["Start","Archive","Relay","Core","Bridge","Horizon","Forge","Nexus","Vault"];

function CameraRig({ progressRef, debugRef }: { progressRef: React.RefObject<number>; debugRef: React.RefObject<HTMLDivElement | null> }) {
  const { camera } = useThree();
  const _pos    = useRef(new THREE.Vector3());
  const _target = useRef(new THREE.Vector3());

  const wp = useControls("Camera Waypoints", {
    "0 — Start":   folder({ w0px:{value:WAYPOINTS[0].pos[0],step:1,label:"Pos X"},   w0py:{value:WAYPOINTS[0].pos[1],step:1,label:"Pos Y"},   w0pz:{value:WAYPOINTS[0].pos[2],step:1,label:"Pos Z"},   w0tx:{value:WAYPOINTS[0].target[0],step:1,label:"Tgt X"},  w0ty:{value:WAYPOINTS[0].target[1],step:1,label:"Tgt Y"},  w0tz:{value:WAYPOINTS[0].target[2],step:1,label:"Tgt Z"}  }, {collapsed:true}),
    "1 — Archive": folder({ w1px:{value:WAYPOINTS[1].pos[0],step:1,label:"Pos X"},   w1py:{value:WAYPOINTS[1].pos[1],step:1,label:"Pos Y"},  w1pz:{value:WAYPOINTS[1].pos[2],step:1,label:"Pos Z"},  w1tx:{value:WAYPOINTS[1].target[0],step:1,label:"Tgt X"}, w1ty:{value:WAYPOINTS[1].target[1],step:1,label:"Tgt Y"},  w1tz:{value:WAYPOINTS[1].target[2],step:1,label:"Tgt Z"}  }, {collapsed:true}),
    "2 — Relay":   folder({ w2px:{value:WAYPOINTS[2].pos[0],step:1,label:"Pos X"},   w2py:{value:WAYPOINTS[2].pos[1],step:1,label:"Pos Y"},   w2pz:{value:WAYPOINTS[2].pos[2],step:1,label:"Pos Z"},   w2tx:{value:WAYPOINTS[2].target[0],step:1,label:"Tgt X"},  w2ty:{value:WAYPOINTS[2].target[1],step:1,label:"Tgt Y"},  w2tz:{value:WAYPOINTS[2].target[2],step:1,label:"Tgt Z"}  }, {collapsed:true}),
    "3 — Core":    folder({ w3px:{value:WAYPOINTS[3].pos[0],step:1,label:"Pos X"},   w3py:{value:WAYPOINTS[3].pos[1],step:1,label:"Pos Y"},  w3pz:{value:WAYPOINTS[3].pos[2],step:1,label:"Pos Z"},   w3tx:{value:WAYPOINTS[3].target[0],step:1,label:"Tgt X"}, w3ty:{value:WAYPOINTS[3].target[1],step:1,label:"Tgt Y"},  w3tz:{value:WAYPOINTS[3].target[2],step:1,label:"Tgt Z"}  }, {collapsed:true}),
    "4 — Bridge":  folder({ w4px:{value:WAYPOINTS[4].pos[0],step:1,label:"Pos X"},  w4py:{value:WAYPOINTS[4].pos[1],step:1,label:"Pos Y"},   w4pz:{value:WAYPOINTS[4].pos[2],step:1,label:"Pos Z"},   w4tx:{value:WAYPOINTS[4].target[0],step:1,label:"Tgt X"}, w4ty:{value:WAYPOINTS[4].target[1],step:1,label:"Tgt Y"},  w4tz:{value:WAYPOINTS[4].target[2],step:1,label:"Tgt Z"}  }, {collapsed:true}),
    "5 — Horizon": folder({ w5px:{value:WAYPOINTS[5].pos[0],step:1,label:"Pos X"},   w5py:{value:WAYPOINTS[5].pos[1],step:1,label:"Pos Y"},  w5pz:{value:WAYPOINTS[5].pos[2],step:1,label:"Pos Z"},   w5tx:{value:WAYPOINTS[5].target[0],step:1,label:"Tgt X"}, w5ty:{value:WAYPOINTS[5].target[1],step:1,label:"Tgt Y"},  w5tz:{value:WAYPOINTS[5].target[2],step:1,label:"Tgt Z"} }, {collapsed:true}),
    "6 — Forge":   folder({ w6px:{value:WAYPOINTS[6].pos[0],step:1,label:"Pos X"},   w6py:{value:WAYPOINTS[6].pos[1],step:1,label:"Pos Y"},   w6pz:{value:WAYPOINTS[6].pos[2],step:1,label:"Pos Z"},   w6tx:{value:WAYPOINTS[6].target[0],step:1,label:"Tgt X"}, w6ty:{value:WAYPOINTS[6].target[1],step:1,label:"Tgt Y"},  w6tz:{value:WAYPOINTS[6].target[2],step:1,label:"Tgt Z"}  }, {collapsed:true}),
    "7 — Nexus":   folder({ w7px:{value:WAYPOINTS[7].pos[0],step:1,label:"Pos X"},   w7py:{value:WAYPOINTS[7].pos[1],step:1,label:"Pos Y"},  w7pz:{value:WAYPOINTS[7].pos[2],step:1,label:"Pos Z"},   w7tx:{value:WAYPOINTS[7].target[0],step:1,label:"Tgt X"}, w7ty:{value:WAYPOINTS[7].target[1],step:1,label:"Tgt Y"},  w7tz:{value:WAYPOINTS[7].target[2],step:1,label:"Tgt Z"}  }, {collapsed:true}),
    "8 — Vault":   folder({ w8px:{value:WAYPOINTS[8].pos[0],step:1,label:"Pos X"},   w8py:{value:WAYPOINTS[8].pos[1],step:1,label:"Pos Y"},   w8pz:{value:WAYPOINTS[8].pos[2],step:1,label:"Pos Z"},  w8tx:{value:WAYPOINTS[8].target[0],step:1,label:"Tgt X"},  w8ty:{value:WAYPOINTS[8].target[1],step:1,label:"Tgt Y"},  w8tz:{value:WAYPOINTS[8].target[2],step:1,label:"Tgt Z"} }, {collapsed:true}),
  } as any) as Record<string, number>;

  useFrame(() => {
    const p = THREE.MathUtils.clamp(progressRef.current ?? 0, 0, 1);
    const last = WAYPOINTS.length - 1;
    const raw  = p * last;
    const i    = Math.min(Math.floor(raw), last - 1);
    const t    = raw - i;

    const ai = i, bi = i + 1;
    const ax = wp[`w${ai}px`], ay = wp[`w${ai}py`], az = wp[`w${ai}pz`];
    const bx = wp[`w${bi}px`], by = wp[`w${bi}py`], bz = wp[`w${bi}pz`];
    const atx = wp[`w${ai}tx`], aty = wp[`w${ai}ty`], atz = wp[`w${ai}tz`];
    const btx = wp[`w${bi}tx`], bty = wp[`w${bi}ty`], btz = wp[`w${bi}tz`];

    _pos.current.set(ax + (bx-ax)*t, ay + (by-ay)*t, az + (bz-az)*t);
    _target.current.set(atx + (btx-atx)*t, aty + (bty-aty)*t, atz + (btz-atz)*t);

    camera.position.copy(_pos.current);
    camera.lookAt(_target.current);

    if (debugRef.current) {
      debugRef.current.textContent = `Waypoint ${i} → ${i+1}  |  ${WAYPOINT_NAMES[i]} → ${WAYPOINT_NAMES[i+1]}  |  t=${t.toFixed(2)}`;
    }
  });

  return null;
}

// ── Place model ────────────────────────────────────────────────────────────

function Place({
  url,
  position,
  rotation,
  targetSize,
  sizeMultiplier,
}: {
  url: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  targetSize: number;
  sizeMultiplier: number;
}) {
  const { scene, animations } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);
  const { actions } = useAnimations(animations, groupRef);

  useEffect(() => {
    Object.values(actions).forEach((action) => action?.reset().play());
  }, [actions]);

  const nativeRef = useRef<{ maxDim: number; minY: number } | null>(null);
  if (!nativeRef.current) {
    // Compute bounding box at the scene's actual scale so maxDim = visual world-space size.
    // Do NOT force scale to (1,1,1) — if GLB has a non-unit root scale (e.g. cm→m = 0.01),
    // forcing to 1 makes maxDim 100× too large and groupScale 100× too small.
    scene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0 && isFinite(maxDim)) {
      nativeRef.current = { maxDim, minY: box.min.y };
    }
  }

  const [groupScale, yOff] = useMemo(() => {
    const native = nativeRef.current;
    if (!native) return [1, 0] as [number, number];
    const s = (targetSize * sizeMultiplier) / native.maxDim;
    return [s, -(native.minY * s)] as [number, number];
  }, [targetSize, sizeMultiplier]);

  return (
    <group
      ref={groupRef}
      position={[position[0], position[1] + yOff, position[2]]}
      rotation={rotation ?? [0, 0, 0]}
      scale={groupScale}
    >
      <primitive object={scene} />
    </group>
  );
}

// ── Scene content ──────────────────────────────────────────────────────────

const ENV_PRESETS = [
  "apartment",
  "city",
  "dawn",
  "forest",
  "lobby",
  "night",
  "park",
  "studio",
  "sunset",
  "warehouse",
] as const;

const S = 1; // step for position sliders
const R = 0.05; // step for rotation sliders

function SceneContent() {
  // ── Env / lighting ────────────────────────────────────────────────────
  const {
    envPreset,
    envVisible,
    envBlur,
    groundVisible,
    groundSize,
    groundY,
    groundColor,
    groundOpacity,
    ambientIntensity,
    sunIntensity,
    sunX,
    sunY,
    sunZ,
    fillIntensity,
    sizeMultiplier,
  } = useControls({
    Environment: folder({
      envPreset: { value: "sunset", options: ENV_PRESETS, label: "Preset" },
      envVisible: { value: false, label: "Show Background" },
      envBlur: { value: 0, min: 0, max: 1, step: 0.01, label: "Blur" },
    }),
    Ground: folder({
      groundVisible: { value: false, label: "Show Plane" },
      groundSize: { value: 150, min: 10, max: 2000, step: 10, label: "Size" },
      groundY: { value: 0, min: -20, max: 20, step: 0.1, label: "Y Offset" },
      groundColor: { value: "#5f5435", label: "Color" },
      groundOpacity: { value: 1, min: 0, max: 1, step: 0.01, label: "Opacity" },
    }),
    Lighting: folder({
      ambientIntensity: { value: 0.8, min: 0, max: 3, step: 0.05 },
      sunIntensity: { value: 2.5, min: 0, max: 6, step: 0.1 },
      sunX: { value: 20, min: -200, max: 200, step: S },
      sunY: { value: 60, min: 0, max: 200, step: S },
      sunZ: { value: 20, min: -200, max: 200, step: S },
      fillIntensity: { value: 0.5, min: 0, max: 2, step: 0.05 },
    }),
    Models: folder({
      sizeMultiplier: {
        value: 1.0,
        min: 0.2,
        max: 4,
        step: 0.05,
        label: "Global Scale ×",
      },
    }),
  });

  // ── Per-place positions & Y rotation ──────────────────────────────────
  const pp = useControls("Places", {
    "Place 1": folder(
      {
        p1x: { value: PLACES[0].position[0], step: S, label: "X" },
        p1y: { value: PLACES[0].position[1], step: S, label: "Y" },
        p1z: { value: PLACES[0].position[2], step: S, label: "Z" },
        p1ry: {
          value: Math.PI,
          min: -Math.PI,
          max: Math.PI,
          step: R,
          label: "Rot Y",
        },
        p1s: { value: 1.0, min: 0.05, max: 5, step: 0.05, label: "Scale ×" },
      },
      { collapsed: true },
    ),
    "Place 2": folder(
      {
        p2x: { value: PLACES[1].position[0], step: S, label: "X" },
        p2y: { value: PLACES[1].position[1], step: S, label: "Y" },
        p2z: { value: PLACES[1].position[2], step: S, label: "Z" },
        p2ry: {
          value: 0,
          min: -Math.PI,
          max: Math.PI,
          step: R,
          label: "Rot Y",
        },
        p2s: { value: 2.15, min: 0.05, max: 5, step: 0.05, label: "Scale ×" },
      },
      { collapsed: true },
    ),
    "Place 3": folder(
      {
        p3x: { value: PLACES[2].position[0], step: S, label: "X" },
        p3y: { value: PLACES[2].position[1], step: S, label: "Y" },
        p3z: { value: PLACES[2].position[2], step: S, label: "Z" },
        p3ry: {
          value: Math.PI,
          min: -Math.PI,
          max: Math.PI,
          step: R,
          label: "Rot Y",
        },
        p3s: { value: 1.0, min: 0.05, max: 5, step: 0.05, label: "Scale ×" },
      },
      { collapsed: true },
    ),
    "Place 4": folder(
      {
        p4x: { value: PLACES[3].position[0], step: S, label: "X" },
        p4y: { value: PLACES[3].position[1], step: S, label: "Y" },
        p4z: { value: PLACES[3].position[2], step: S, label: "Z" },
        p4ry: {
          value: PLACES[3].rotation[1],
          min: -Math.PI,
          max: Math.PI,
          step: R,
          label: "Rot Y",
        },
        p4s: { value: 1, min: 0.05, max: 5, step: 0.05, label: "Scale ×" },
      },
      { collapsed: true },
    ),
    "Place 5": folder(
      {
        p5x: { value: PLACES[4].position[0], step: S, label: "X" },
        p5y: { value: PLACES[4].position[1], step: S, label: "Y" },
        p5z: { value: PLACES[4].position[2], step: S, label: "Z" },
        p5ry: {
          value: 0,
          min: -Math.PI,
          max: Math.PI,
          step: R,
          label: "Rot Y",
        },
        p5s: { value: 1.0, min: 0.05, max: 5, step: 0.05, label: "Scale ×" },
      },
      { collapsed: true },
    ),
    "Place 6": folder(
      {
        p6x: { value: PLACES[5].position[0], step: S, label: "X" },
        p6y: { value: PLACES[5].position[1], step: S, label: "Y" },
        p6z: { value: PLACES[5].position[2], step: S, label: "Z" },
        p6ry: {
          value: PLACES[5].rotation[1],
          min: -Math.PI,
          max: Math.PI,
          step: R,
          label: "Rot Y",
        },
        p6s: { value: 1.5, min: 0.05, max: 5, step: 0.05, label: "Scale ×" },
      },
      { collapsed: true },
    ),
    "Place 7": folder(
      {
        p7x: { value: PLACES[6].position[0], step: S, label: "X" },
        p7y: { value: PLACES[6].position[1], step: S, label: "Y" },
        p7z: { value: PLACES[6].position[2], step: S, label: "Z" },
        p7ry: {
          value: PLACES[6].rotation[1],
          min: -Math.PI,
          max: Math.PI,
          step: R,
          label: "Rot Y",
        },
        p7s: { value: 1.70, min: 0.05, max: 5, step: 0.05, label: "Scale ×" },
      },
      { collapsed: true },
    ),
    "Place 8": folder(
      {
        p8x: { value: PLACES[7].position[0], step: S, label: "X" },
        p8y: { value: PLACES[7].position[1], step: S, label: "Y" },
        p8z: { value: PLACES[7].position[2], step: S, label: "Z" },
        p8ry: {
          value: PLACES[7].rotation[1],
          min: -Math.PI,
          max: Math.PI,
          step: R,
          label: "Rot Y",
        },
        p8s: { value: 1.75, min: 0.05, max: 5, step: 0.05, label: "Scale ×" },
      },
      { collapsed: true },
    ),
  });


  // ── Live place configs from Leva ──────────────────────────────────────

  // ── Per-place scale multipliers ───────────────────────────────────────
  const perPlaceScale = [
    pp.p1s,
    pp.p2s,
    pp.p3s,
    pp.p4s,
    pp.p5s,
    pp.p6s,
    pp.p7s,
    pp.p8s,
  ];
  const livePlaces: PlaceConfig[] = [
    {
      ...PLACES[0],
      position: [pp.p1x, pp.p1y, pp.p1z],
      rotation: [0, pp.p1ry, 0],
    },
    {
      ...PLACES[1],
      position: [pp.p2x, pp.p2y, pp.p2z],
      rotation: [0, pp.p2ry, 0],
    },
    {
      ...PLACES[2],
      position: [pp.p3x, pp.p3y, pp.p3z],
      rotation: [0, pp.p3ry, 0],
    },
    {
      ...PLACES[3],
      position: [pp.p4x, pp.p4y, pp.p4z],
      rotation: [0, pp.p4ry, 0],
    },
    {
      ...PLACES[4],
      position: [pp.p5x, pp.p5y, pp.p5z],
      rotation: [0, pp.p5ry, 0],
    },
    {
      ...PLACES[5],
      position: [pp.p6x, pp.p6y, pp.p6z],
      rotation: [0, pp.p6ry, 0],
    },
    {
      ...PLACES[6],
      position: [pp.p7x, pp.p7y, pp.p7z],
      rotation: [0, pp.p7ry, 0],
    },
    {
      ...PLACES[7],
      position: [pp.p8x, pp.p8y, pp.p8z],
      rotation: [0, pp.p8ry, 0],
    },
  ];

  return (
    <>
      <Stats />

      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        position={[sunX, sunY, sunZ]}
        intensity={sunIntensity}
      />
      <directionalLight
        position={[-30, 50, -20]}
        intensity={fillIntensity}
        color="#fff5e0"
      />
      <hemisphereLight args={["#fff8ee", "#d4c9a8", 0.4]} />

      <Environment
        preset={envPreset as (typeof ENV_PRESETS)[number]}
        background={envVisible}
        backgroundBlurriness={envBlur}
      />

      {groundVisible && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, groundY, 0]}>
          <planeGeometry args={[groundSize, groundSize]} />
          <meshStandardMaterial
            color={groundColor}
            opacity={groundOpacity}
            transparent={groundOpacity < 1}
            roughness={1}
          />
        </mesh>
      )}

      {livePlaces.map((p, i) => (
        <Place
          key={p.id}
          url={p.url}
          position={p.position}
          rotation={p.rotation}
          targetSize={p.targetSize}
          sizeMultiplier={sizeMultiplier * perPlaceScale[i]}
        />
      ))}
    </>
  );
}

useGLTF.setDecoderPath("/draco/");
PLACES.forEach(({ url }) => useGLTF.preload(url));

// ── Canvas ────────────────────────────────────────────────────────────────

export default function TownScene({
  progressRef,
}: {
  progressRef: React.RefObject<number>;
}) {
  const debugRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="w-full h-full relative">
      <Canvas
        className="w-full h-full"
        camera={{ position: [-56, 7, 47], fov: 55, near: 0.1, far: 600 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        <CameraRig progressRef={progressRef} debugRef={debugRef} />
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
      <div
        ref={debugRef}
        className="absolute bottom-4 left-4 font-mono text-xs text-white bg-black/60 px-2 py-1 rounded pointer-events-none"
      />
    </div>
  );
}
