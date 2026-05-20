"use client";

import { useRef, useMemo, useEffect, useState, useCallback, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations, Environment, Stats } from "@react-three/drei";
import * as THREE from "three";
import { useControls, folder } from "leva";
import { motion, AnimatePresence } from "framer-motion";

// ── Place data ────────────────────────────────────────────────────────────

export interface PlaceConfig {
  id: number;
  url: string;
  position: [number, number, number];
  rotation: [number, number, number]; // euler angles in radians
  name: string;
  subText?: string;
  desc?: string;
  targetSize: number; // per-model base size in world units
  cx: number;   // content overlay X %
  cy: number;   // content overlay Y %
  maxW: number; // content overlay max-width px
  fontSize: number; // title font size rem
  descFontSize: number; // description font size rem
  nameHighlight?: string; // substring of name to render in orange
}

export const PLACES: PlaceConfig[] = [
  // Row 1 — left to right (places 1–4)
  {
    id: 1,
    url: "/Models/1.glb",
    position: [-35, 0, 38],
    rotation: [0, Math.PI, 0],
    targetSize: 90,
    name: "From Input to Intelligence",
    desc: "Every signal flows into a system purpose-built to interpret context, make intelligent decisions, and take meaningful action in real time—transforming raw inputs into precise, outcome-driven responses.",
    cx: 3, cy: 5, maxW: 520, fontSize: 1.5, descFontSize: 0.90,
  },
  {
    id: 2,
    url: "/Models/2.glb",
    position: [78, -2, 39],
    rotation: [0, 0, 0],
    targetSize: 22,
    name: "Orchestrate Intelligence",
    subText: "Unify Every Agent. Eliminate Fragmentation.",
    desc: "Break the barriers between disconnected AI systems. Kite brings agents together into a unified, real-time network that collaborates, thinks collectively, and operates as one intelligent workforce.",
    cx: 3, cy: 70, maxW: 600, fontSize: 1.5, descFontSize: 0.90,
  },
  {
    id: 3,
    url: "/Models/3.glb",
    position: [-25, -3, 53],
    rotation: [0, Math.PI, 0],
    targetSize: 28,
    name: "Composable Workflow Intelligence",
    desc: "Break the barriers between disconnected AI systems. Kite brings agents together into a unified, real-time network that collaborates, thinks collectively, and operates as one intelligent workforce.",
    cx: 60, cy: 5, maxW: 460, fontSize: 1.50, descFontSize: 0.90,
  },
  {
    id: 4,
    url: "/Models/4.glb",
    position: [-105, -4, 85],
    rotation: [0, Math.PI, 0],
    targetSize: 22,
    name: "Unified Tooling Layer",
    desc: "A powerful abstraction layer that seamlessly exposes browsers, databases, APIs, cloud platforms, and file systems to your workers. It standardizes access to external tools, enabling smooth integration, secure interactions, and consistent execution across diverse environments.",
    cx: 3, cy: 5, maxW: 550, fontSize: 1.50, descFontSize: 0.90,
  },
  // Direction turns here — row 2 comes back left (places 5–7)
  {
    id: 5,
    url: "/Models/5.glb",
    position: [50, 0, -30],
    rotation: [0, 0, 0],
    targetSize: 26,
    name: "Autonomous Execution Workers",
    desc: "Run tasks through isolated execution services designed for reliability and precision—handling both deterministic operations and LLM-driven actions. Each worker operates independently, ensuring scalable performance, fault tolerance, and consistent outcomes across every workflow.",
    cx: 3, cy: 5, maxW: 550, fontSize: 1.50, descFontSize: 0.90,
  },
  {
    id: 6,
    url: "/Models/6.glb",
    position: [-58, 0, 85],
    rotation: [0, Math.PI, 0],
    targetSize: 22,
    name: "Persistent Intelligence Layer",
    desc: "Maintain continuity with a robust memory system that stores embeddings, logs, task states, and structured knowledge over time. It enables your system to learn, adapt, and make more informed decisions—turning every interaction into lasting intelligence.",
    cx: 60, cy: 5, maxW: 520, fontSize: 1.50, descFontSize: 0.90,
  },
  {
    id: 7,
    url: "/Models/7.glb",
    position: [-40, 0, 50],
    rotation: [0, -Math.PI, 0],
    targetSize: 28,
    name: "Built-in Governance & Safety",
    desc: "A dedicated policy engine that enforces permissions, compliance rules, rate limits, and safety controls at every step. It ensures secure, reliable operations while maintaining strict governance—so every action stays aligned with defined boundaries and standards.",
    cx: 3, cy: 5, maxW: 500, fontSize: 1.50, descFontSize: 0.90,
  },
  {
    id: 8,
    url: "/Models/8.glb",
    position: [40, -5, -65],
    rotation: [0, 0, 0],
    targetSize: 28,
    name: "Introducing Kite AI",
    nameHighlight: "Kite AI",
    cx: 3, cy: 5, maxW: 520, fontSize: 5.25, descFontSize: 1.125,
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

function CameraRig({ progressRef, debugRef, isMobile }: { progressRef: React.RefObject<number>; debugRef: React.RefObject<HTMLDivElement | null>; isMobile: boolean }) {
  const { camera } = useThree();
  const _pos    = useRef(new THREE.Vector3());
  const _target = useRef(new THREE.Vector3());
  const _dir    = useRef(new THREE.Vector3());

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

    // Smoothstep eases the camera in/out at each waypoint instead of linear fly-through
    const ts = THREE.MathUtils.smoothstep(t, 0, 1);

    _pos.current.set(ax + (bx-ax)*ts, ay + (by-ay)*ts, az + (bz-az)*ts);
    _target.current.set(atx + (btx-atx)*ts, aty + (bty-aty)*ts, atz + (btz-atz)*ts);

    if (isMobile) {
      // Push camera further back so models appear smaller / more distant
      _dir.current.subVectors(_pos.current, _target.current).normalize();
      _pos.current.addScaledVector(_dir.current, 6);

      // At progress=0 tilt camera upward (raise target Y) so the town sits at
      // the bottom of the canvas frame. Fade the offset to 0 by progress=0.15.
      const tiltFade = 1 - THREE.MathUtils.clamp(p / 0.15, 0, 1);
      _target.current.y += 14 * tiltFade;
    }

    camera.position.copy(_pos.current);
    camera.lookAt(_target.current);

    if (debugRef.current) {
      debugRef.current.textContent = `Waypoint ${i} → ${i+1}  |  ${WAYPOINT_NAMES[i]} → ${WAYPOINT_NAMES[i+1]}  |  t=${t.toFixed(2)}`;
    }
  });

  return null;
}

// ── Mobile FOV override ────────────────────────────────────────────────────

function MobileFOV({ isMobile }: { isMobile: boolean }) {
  const { camera } = useThree();
  useEffect(() => {
    if (!isMobile) return;
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = 90;
    cam.updateProjectionMatrix();
  }, [isMobile, camera]);
  return null;
}

// ── Waypoint segment → content index sync ─────────────────────────────────

function WaypointSync({
  progressRef,
  onSegmentChange,
}: {
  progressRef: React.RefObject<number>;
  onSegmentChange: (i: number) => void;
}) {
  const lastEffective = useRef(-2);
  useFrame(() => {
    const p = THREE.MathUtils.clamp(progressRef.current ?? 0, 0, 1);
    const raw = p * (WAYPOINTS.length - 1);
    const seg = Math.min(Math.floor(raw), WAYPOINTS.length - 2);
    const t = raw - seg;
    // Only show content after 30% through each waypoint segment
    const effective = t >= 0.3 ? seg : -1;
    if (effective !== lastEffective.current) {
      lastEffective.current = effective;
      onSegmentChange(effective);
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
  isMobile,
}: {
  url: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  targetSize: number;
  sizeMultiplier: number;
  isMobile?: boolean;
}) {
  const { scene, animations } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);
  const { actions } = useAnimations(animations, groupRef);

  useEffect(() => {
    if (isMobile) return;
    Object.values(actions).forEach((action) => action?.reset().play());
  }, [actions, isMobile]);

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

function SceneContent({ isMobile }: { isMobile?: boolean }) {
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
      {/* <Stats /> */}

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

      {/* HDR environment is expensive on iOS — skip on mobile to prevent OOM crash */}
      {!isMobile && (
        <Environment
          preset={envPreset as (typeof ENV_PRESETS)[number]}
          background={envVisible}
          backgroundBlurriness={envBlur}
        />
      )}

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
          isMobile={isMobile}
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
  activePlaceIndex = -1,
  isMobile = false,
}: {
  progressRef: React.RefObject<number>;
  activePlaceIndex?: number;
  isMobile?: boolean;
}) {
  const debugRef = useRef<HTMLDivElement | null>(null);

  // Tracks which waypoint segment the camera is in (0 = WP0→1, 1 = WP1→2, …)
  const [waypointIndex, setWaypointIndex] = useState(0);
  const handleSegmentChange = useCallback((i: number) => setWaypointIndex(i), []);

  // Per-place content style controls
  const cp = useControls("Content Positions", {
    ...Object.fromEntries(
      PLACES.flatMap((p) => [
        [`p${p.id}x`,  { value: p.cx,       min: 0,   max: 95,   step: 1,    label: `P${p.id} X %`       }],
        [`p${p.id}y`,  { value: p.cy,       min: 0,   max: 95,   step: 1,    label: `P${p.id} Y %`       }],
        [`p${p.id}w`,  { value: p.maxW,     min: 100, max: 1200, step: 10,   label: `P${p.id} MaxW px`   }],
        [`p${p.id}fs`,  { value: p.fontSize,     min: 0.5, max: 6,    step: 0.05, label: `P${p.id} Title rem` }],
        [`p${p.id}dfs`, { value: p.descFontSize, min: 0.5, max: 4,    step: 0.05, label: `P${p.id} Desc rem`  }],
      ])
    ),
  }) as Record<string, number>;

  // Pick content by waypoint segment; hide only during t < 0.3 (handled by WaypointSync)
  const place = waypointIndex >= 0 ? PLACES[waypointIndex] : null;
  const cx = place ? cp[`p${place.id}x`]  : 5;
  const cy = place ? cp[`p${place.id}y`]  : 60;
  const cw = place ? cp[`p${place.id}w`]  : 420;
  const fs  = place ? cp[`p${place.id}fs`]  : 2.25;
  const dfs = place ? cp[`p${place.id}dfs`] : 1.125;

  return (
    <div className="w-full h-full relative">
      <Canvas
        className="w-full h-full"
        camera={{ position: [-56, 7, 47], fov: 55, near: 0.1, far: 600 }}
        // Cap DPR to 1 on mobile — iOS retina is DPR 2–3 which multiplies GPU
        // memory 4–9× and is the primary cause of the Safari OOM crash.
        dpr={isMobile ? 1 : [1, 2]}
        gl={{
          alpha: true,
          // Antialias is redundant at DPR≥2 and doubles framebuffer memory on mobile
          antialias: !isMobile,
          // "high-performance" on iOS allocates an oversized GPU context; "default" is safer
          powerPreference: isMobile ? "default" : "high-performance",
        }}
      >
        <MobileFOV isMobile={isMobile} />
        <CameraRig progressRef={progressRef} debugRef={debugRef} isMobile={isMobile} />
        <WaypointSync progressRef={progressRef} onSegmentChange={handleSegmentChange} />
        <Suspense fallback={null}>
          <SceneContent isMobile={isMobile} />
        </Suspense>
      </Canvas>

      {/* ── Content overlay ── */}
      <AnimatePresence>
        {place && (
          <motion.div
            key={place.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0, 1] }}
            className="absolute z-30 pointer-events-none select-none"
            style={isMobile ? {
              left: "0",
              right: "0",
              top: "4%",
              maxWidth: "100%",
              padding: "0 6%",
              textAlign: place.id === 8 ? "center" : "left",
            } : {
              left: `${cx}%`,
              top: `${cy}%`,
              maxWidth: cw,
            }}
          >
            <h2
              className="text-[#1C2632] font-light leading-[1.1] mb-1.5 drop-shadow-lg"
              style={{ fontSize: isMobile ? (place.id === 8 ? "clamp(2.25rem,10vw,3.5rem)" : `${Math.min(fs, 1.25)}rem`) : `${fs}rem` }}
            >
              {place.nameHighlight
                ? place.name.split(place.nameHighlight).flatMap((part, i, arr) =>
                    i < arr.length - 1
                      ? [part, <span key={i} className="text-[#ff6b00]">{place.nameHighlight}</span>]
                      : [part]
                  )
                : place.name}
            </h2>
            {place.subText && (
              <p className="font-ki text-[#ff6b00] mb-1" style={{ fontSize: isMobile ? "0.7rem" : undefined }}>
                {place.subText}
              </p>
            )}
            <p
              className="font-ki text-foreground leading-[1.4] drop-shadow"
              style={{ fontSize: isMobile ? "0.75rem" : `${dfs}rem` }}
            >
              {place.desc}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
