import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Stars, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import "../styles/investigation-galaxy.css";

const STAGE_COPY = {
  idle: ["READY TO INVESTIGATE", "Waiting for a claim"],
  claim_received: ["CLAIM RECEIVED", "Establishing the investigation core"],
  claim_decomposed: [
    "DECOMPOSING CLAIM",
    "Breaking the statement into verifiable parts",
  ],
  search_started: ["SEARCHING LIVE WEB", "Scanning for relevant sources"],
  search_completed: [
    "EVIDENCE DISCOVERED",
    "Sources have entered the evidence field",
  ],
  analysis_started: [
    "ANALYZING EVIDENCE",
    "Evaluating relevance and reliability",
  ],
  evidence_insufficient: [
    "EVIDENCE GAP DETECTED",
    "The agent is looking for more information",
  ],
  additional_search: ["EXPANDING THE SEARCH", "Following new evidence trails"],
  comparison_started: [
    "COMPARING SOURCES",
    "Looking for corroboration and contradictions",
  ],
  synthesis_started: [
    "SYNTHESIZING FINDINGS",
    "Connecting evidence to the original claim",
  ],
  completed: ["INVESTIGATION COMPLETE", "The evidence trail is ready"],
  error: ["INVESTIGATION INTERRUPTED", "The backend reported an error"],
};

const normalizeStage = (stage = "idle") =>
  String(stage).toLowerCase().replaceAll("-", "_").replaceAll(" ", "_");

function BlackHole({ stage, intensity = 1 }) {
  const group = useRef();
  const disk = useRef();
  const halo = useRef();
  const uniforms = useRef({
    uTime: { value: 0 },
    uIntensity: { value: intensity },
  });
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.12 * intensity;
    }

    uniforms.current.uTime.value = state.clock.elapsedTime;
    uniforms.current.uIntensity.value = intensity;
  });
  const ringColor =
    stage === "error"
      ? "#ff5f7e"
      : stage === "completed"
        ? "#f5ff67"
        : "#8b8dff";
  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[0.78, 48, 48]} />
        <meshBasicMaterial color="#02030b" />
      </mesh>
      <mesh ref={halo} rotation={[Math.PI / 2.35, 0.18, 0]}>
        <torusGeometry args={[1.02, 0.055, 12, 128]} />
        <meshBasicMaterial
          color={ringColor}
          transparent
          opacity={0.38}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={disk} rotation={[Math.PI / 2.3, 0.08, 0]}>
        <torusGeometry args={[1.16, 0.16, 16, 160]} />
        <meshBasicMaterial
          color={ringColor}
          transparent
          opacity={stage === "completed" ? 0.7 : 0.46}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2.3, 0.08, 0]}>
        <torusGeometry args={[1.43, 0.018, 8, 160]} />
        <meshBasicMaterial
          color="#f5ff67"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <pointLight color={ringColor} intensity={1.7 * intensity} distance={6} />
    </group>
  );
}

function OrbitingEntities({
  entities = [],
  stage,
  showLabels = true,
  intensity = 1,
}) {
  const root = useRef();
  const normalized = useMemo(
    () =>
      (entities || []).slice(0, 36).map((entity, i) => {
        const angle = (i / Math.max(entities.length, 1)) * Math.PI * 2;
        const radius = 2.1 + (i % 4) * 0.34;
        const status = String(
          entity.status || entity.relationship || entity.type || "source",
        ).toLowerCase();
        let color = "#b8a0ff";
        if (status.includes("support")) color = "#55e6a5";
        else if (status.includes("contradict")) color = "#ff647c";
        else if (status.includes("partial")) color = "#f5ff67";
        else if (status.includes("uncertain") || status.includes("unknown"))
          color = "#bd91ff";
        return {
          ...entity,
          _key: entity.id || entity.url || `${entity.title || "entity"}-${i}`,
          angle,
          radius,
          color,
          size: status.includes("claim") ? 0.105 : 0.055 + (i % 3) * 0.012,
        };
      }),
    [entities],
  );
  useFrame((state) => {
    if (root.current && stage !== "completed" && stage !== "error")
      root.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.08) * 0.12;
  });
  return (
    <group ref={root}>
      {normalized.map((item) => {
        const orbitSpeed =
          stage === "search_started" || stage === "additional_search"
            ? 0.32 * intensity
            : stage === "completed"
              ? 0.035
              : 0.12 * intensity;
        const angle = item.angle + (stage === "idle" ? 0 : orbitSpeed * 0.08);
        const x = Math.cos(angle) * item.radius;
        const z = Math.sin(angle) * item.radius;
        const y = Math.sin(item.angle * 2.1) * 0.52;
        return (
          <group key={item._key} position={[x, y, z]}>
            <mesh>
              <sphereGeometry args={[item.size, 16, 16]} />
              <meshBasicMaterial color={item.color} />
            </mesh>
            <pointLight color={item.color} intensity={0.22} distance={0.65} />
            {showLabels && (
              <Html
                distanceFactor={10}
                position={[0.12, 0.12, 0]}
                center
                style={{ pointerEvents: "none" }}
              >
                <div
                  className="tt-galaxy-node-label"
                  title={item.title || item.name || ""}
                >
                  {String(
                    item.title || item.name || item.type || "Evidence",
                  ).slice(0, 28)}
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

function Scene({ stage, entities, intensity, showLabels, paused }) {
  const group = useRef();
  useFrame((_, delta) => {
    if (!paused && group.current)
      group.current.rotation.y +=
        delta * (stage === "completed" ? 0.012 : 0.028 * intensity);
  });
  return (
    <group ref={group}>
      <Stars
        radius={70}
        depth={35}
        count={
          stage === "search_started" || stage === "additional_search"
            ? 1700
            : 900
        }
        factor={3.2}
        saturation={0}
        fade
        speed={paused ? 0 : 0.35 * intensity}
      />
      <Sparkles
        count={
          stage === "search_started" || stage === "additional_search" ? 150 : 70
        }
        scale={[10, 5, 10]}
        size={2.2}
        speed={paused ? 0 : 0.18 * intensity}
        color="#b8baff"
      />
      <BlackHole stage={stage} intensity={intensity} />
      <OrbitingEntities
        entities={entities}
        stage={stage}
        showLabels={showLabels}
        intensity={intensity}
      />
    </group>
  );
}

/**
 * Reusable VeriX investigation visualization.
 * stage must come from a real backend event; this component does not advance stages on timers.
 * entities can be claim subclaims and evidence records from the current investigation.
 */
export default function InvestigationGalaxy({
  stage = "idle",
  entities = [],
  intensity = 1,
  showLabels = true,
  paused = false,
  className = "",
  title = "VeriX INVESTIGATION",
  eventMessage = "",
  onRetry,
}) {
  const activeStage = normalizeStage(stage);
  const copy = STAGE_COPY[activeStage] || [
    activeStage.replaceAll("_", " ").toUpperCase(),
    "Following the investigation",
  ];
  const isError = activeStage === "error";
  const isComplete = activeStage === "completed";
  return (
    <section
      className={`tt-galaxy-shell ${className}`}
      aria-live="polite"
      aria-busy={!isComplete && !isError && activeStage !== "idle"}
    >
      <div className="tt-galaxy-canvas">
        <Canvas
          camera={{ position: [0, 0.2, 8.2], fov: 46 }}
          dpr={[1, 1.7]}
          gl={{ alpha: true, antialias: true }}
        >
          <color attach="background" args={["#080a1c"]} />
          <fog attach="fog" args={["#080a1c", 10, 25]} />
          <ambientLight intensity={0.4} />
          <Suspense fallback={null}>
            <Scene
              stage={activeStage}
              entities={entities}
              intensity={Math.max(0.1, Math.min(2.5, intensity))}
              showLabels={showLabels}
              paused={paused}
            />
          </Suspense>
        </Canvas>
        <div className="tt-galaxy-vignette" />
        <div className="tt-galaxy-topline">
          <span className="tt-galaxy-dot" />
          {title}
          <span className="tt-galaxy-topline-right">LIVE EVIDENCE ENGINE</span>
        </div>
        <div className="tt-galaxy-status">
          <div
            className={`tt-galaxy-eyebrow ${isError ? "is-error" : isComplete ? "is-complete" : ""}`}
          >
            {isComplete
              ? "● ANALYSIS COMPLETE"
              : isError
                ? "● SYSTEM INTERRUPTED"
                : activeStage === "idle"
                  ? "● STANDING BY"
                  : "● INVESTIGATION IN PROGRESS"}
          </div>
          <h2>{copy[0]}</h2>
          <p>{eventMessage || copy[1]}</p>
          <div
            className="tt-galaxy-stage-track"
            aria-label={`Current stage: ${copy[0]}`}
          >
            {[
              "claim_decomposed",
              "search_started",
              "analysis_started",
              "comparison_started",
              "synthesis_started",
              "completed",
            ].map((step) => {
              const stages = Object.keys(STAGE_COPY);
              const currentIndex = stages.indexOf(activeStage);
              const stepIndex = stages.indexOf(step);
              const active = activeStage === step;
              const done =
                isComplete || (currentIndex >= 0 && currentIndex > stepIndex);
              return (
                <span
                  key={step}
                  className={`tt-galaxy-stage-segment ${active ? "active" : ""} ${done ? "done" : ""}`}
                  title={step.replaceAll("_", " ")}
                />
              );
            })}
          </div>
          <div className="tt-galaxy-meta">
            <span>{entities.length} evidence entities in view</span>
            <span>
              {isComplete
                ? "RESULT READY"
                : isError
                  ? "ACTION REQUIRED"
                  : paused
                    ? "PAUSED"
                    : "FOLLOWING BACKEND EVENTS"}
            </span>
          </div>
          {isError && onRetry && (
            <button type="button" className="tt-galaxy-retry" onClick={onRetry}>
              Retry investigation
            </button>
          )}
        </div>
        <div className="tt-galaxy-corner tt-galaxy-corner-bl">
          EVIDENCE FIELD / 3D
        </div>
        <div className="tt-galaxy-corner tt-galaxy-corner-br">
          TT—{activeStage.toUpperCase().slice(0, 14)}
        </div>
      </div>
    </section>
  );
}
