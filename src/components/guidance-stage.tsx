"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { GoldenSpiral } from "@/components/golden-spiral";
import type { SculptureKind } from "@/lib/sculptures";

type Props = { kind: SculptureKind; paused: boolean; impulse: number; reset: number };

/** Lazy, shared renderer; animation and pointer state never cause React renders. */
export function GuidanceStage(props: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const controls = useRef(props);
  const wake = useRef(() => {});
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");
  const helpId = useId();
  useEffect(() => { controls.current = props; wake.current(); }, [props]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let teardown = () => {};
    let started = false;
    const initialize = async () => {
      if (started || disposed) return;
      started = true;
      try {
        const [T, { RoomEnvironment }, { createSculpture }] = await Promise.all([
          import("three"), import("three/addons/environments/RoomEnvironment.js"), import("@/lib/sculptures"),
        ]);
        if (disposed) return;
        const renderer = new T.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
        teardown = () => { renderer.dispose(); renderer.domElement.remove(); };
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
        renderer.setClearColor(0, 0);
        renderer.toneMapping = T.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 0.9;
        renderer.domElement.setAttribute("aria-hidden", "true");
        host.appendChild(renderer.domElement);
        const scene = new T.Scene();
        const camera = new T.PerspectiveCamera(35, 1, 0.1, 50);
        const pmrem = new T.PMREMGenerator(renderer);
        const room = new RoomEnvironment();
        const environment = pmrem.fromScene(room, 0.04);
        room.dispose(); pmrem.dispose();
        teardown = () => { environment.dispose(); renderer.dispose(); renderer.domElement.remove(); };
        scene.environment = environment.texture;
        scene.add(new T.HemisphereLight(0xfff4db, 0x353c29, 1.4));
        const key = new T.DirectionalLight(0xffedd2, 2.5); key.position.set(-3, 4, 5);
        const rim = new T.DirectionalLight(0xe4efd5, 2); rim.position.set(3, 1, -2);
        scene.add(key, rim);
        const pivot = new T.Group(); scene.add(pivot);
        const cache = new Map<SculptureKind, Awaited<ReturnType<typeof createSculpture>>>();
        const failedKinds = new Set<SculptureKind>();
        let kind = controls.current.kind;
        let stageReady = true;
        let sculpture: Awaited<ReturnType<typeof createSculpture>>;
        try { sculpture = await createSculpture(kind); }
        catch {
          failedKinds.add(kind); stageReady = false;
          kind = "flight"; sculpture = await createSculpture(kind);
        }
        if (disposed) { sculpture.root.traverse((object) => { const mesh = object as import("three").Mesh; mesh.geometry?.dispose(); if (Array.isArray(mesh.material)) mesh.material.forEach((material) => material.dispose()); else mesh.material?.dispose(); }); environment.dispose(); renderer.dispose(); renderer.domElement.remove(); return; }
        cache.set(kind, sculpture); pivot.add(sculpture.root);
        const dust = new Float32Array(180 * 3);
        for (let i = 0; i < 180; i++) {
          const a = i * 2.399963; const r = 2.2 + (i % 19) * 0.09;
          dust[i * 3] = Math.cos(a) * r; dust[i * 3 + 1] = Math.sin(a) * r; dust[i * 3 + 2] = Math.sin(i * 17.3) * 1.5 - 1;
        }
        const dustGeo = new T.BufferGeometry(); dustGeo.setAttribute("position", new T.BufferAttribute(dust, 3));
        const dustMat = new T.PointsMaterial({ color: 0xa3b8e9, size: 0.014, transparent: true, opacity: 0.55 });
        scene.add(new T.Points(dustGeo, dustMat));
        let frame = 0, time = 0, last = 0, energy = 0, targetX = 0, targetY = 0, pointerX = 0, pointerY = 0;
        let visible = true, dragging = false, contextFailed = false, loading = false;
        let lastPointerX = 0, lastPointerY = 0;
        let lastImpulse = controls.current.impulse, lastReset = controls.current.reset;
        const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
        const render = (now: number) => {
          frame = 0;
          if (disposed || !visible || document.hidden || contextFailed) return;
          const state = controls.current;
          const dt = Math.min((now - (last || now)) / 1000, 0.04); last = now;
          if (kind === state.kind && !stageReady) { stageReady = true; setStatus("ready"); }
          if (kind !== state.kind) {
            if (failedKinds.has(state.kind)) {
              if (stageReady) { stageReady = false; setStatus("failed"); }
            } else {
            const cached = cache.get(state.kind);
            if (cached) {
              pivot.remove(sculpture.root); kind = state.kind; sculpture = cached; pivot.add(sculpture.root);
              targetX = targetY = pointerX = pointerY = energy = 0;
              if (!stageReady) { stageReady = true; setStatus("ready"); }
            } else if (!loading) {
              loading = true;
              void createSculpture(state.kind).then((next) => {
                if (disposed) { next.root.traverse((object) => { const mesh = object as import("three").Mesh; mesh.geometry?.dispose(); if (Array.isArray(mesh.material)) mesh.material.forEach((material) => material.dispose()); else mesh.material?.dispose(); }); return; }
                cache.set(state.kind, next); loading = false; request();
              }).catch(() => { failedKinds.add(state.kind); loading = false; stageReady = false; if (!disposed) setStatus("failed"); });
            }
            }
          }
          if (lastReset !== state.reset) { targetX = targetY = pointerX = pointerY = 0; lastReset = state.reset; }
          if (lastImpulse !== state.impulse) { energy = 1; lastImpulse = state.impulse; }
          const animated = stageReady && !state.paused && !motion.matches;
          if (animated) { time += dt; energy *= Math.exp(-dt * 1.6); }
          const blend = motion.matches ? 1 : 1 - Math.exp(-dt * 9);
          const x = targetX + (motion.matches ? 0 : pointerY * 0.1);
          const y = targetY + (motion.matches ? 0 : pointerX * 0.17);
          pivot.rotation.x += (x - pivot.rotation.x) * blend;
          pivot.rotation.y += (y - pivot.rotation.y) * blend;
          pivot.position.y = animated ? Math.sin(time * 0.65) * 0.045 : 0;
          sculpture.update(time, energy, motion.matches);
          renderer.render(scene, camera);
          const settling = Math.abs(x - pivot.rotation.x) + Math.abs(y - pivot.rotation.y) > 0.001;
          if (animated || settling) frame = requestAnimationFrame(render);
        };
        const request = () => {
          if (!frame && visible && !document.hidden && !disposed && !contextFailed) { last = performance.now(); frame = requestAnimationFrame(render); }
        };
        wake.current = request;
        const resize = () => {
          const width = Math.max(host.clientWidth, 1), height = Math.max(host.clientHeight, 1);
          camera.aspect = width / height; camera.position.set(0, 0.05, Math.max(7.8, 7 / camera.aspect));
          camera.updateProjectionMatrix(); renderer.setSize(width, height, false); request();
        };
        const down = (event: PointerEvent) => {
          if (event.button !== 0) return;
          dragging = true; lastPointerX = event.clientX; lastPointerY = event.clientY;
          host.setPointerCapture(event.pointerId); host.dataset.dragging = "true";
        };
        const move = (event: PointerEvent) => {
          const rect = host.getBoundingClientRect();
          pointerX = (event.clientX - rect.left) / rect.width - 0.5; pointerY = (event.clientY - rect.top) / rect.height - 0.5;
          if (dragging) {
            targetY += (event.clientX - lastPointerX) * 0.008;
            targetX = T.MathUtils.clamp(targetX + (event.clientY - lastPointerY) * 0.005, -0.8, 0.8);
            lastPointerX = event.clientX; lastPointerY = event.clientY;
          }
          request();
        };
        const up = () => { dragging = false; host.dataset.dragging = "false"; };
        const leave = () => { pointerX = pointerY = 0; request(); };
        const keyboard = (event: KeyboardEvent) => {
          if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(event.key)) return;
          event.preventDefault();
          if (event.key === "ArrowLeft") targetY -= 0.2;
          if (event.key === "ArrowRight") targetY += 0.2;
          if (event.key === "ArrowUp") targetX = Math.max(-0.8, targetX - 0.15);
          if (event.key === "ArrowDown") targetX = Math.min(0.8, targetX + 0.15);
          if (event.key === "Home") targetX = targetY = 0;
          request();
        };
        const visibilityChange = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else request(); };
        const contextLost = (event: Event) => { event.preventDefault(); contextFailed = true; cancelAnimationFrame(frame); setStatus("failed"); };
        host.addEventListener("pointerdown", down); host.addEventListener("pointermove", move);
        host.addEventListener("pointerup", up); host.addEventListener("pointercancel", up); host.addEventListener("lostpointercapture", up);
        host.addEventListener("pointerleave", leave); host.addEventListener("keydown", keyboard);
        renderer.domElement.addEventListener("webglcontextlost", contextLost);
        document.addEventListener("visibilitychange", visibilityChange); motion.addEventListener("change", request);
        const sizeObserver = new ResizeObserver(resize); sizeObserver.observe(host);
        const visibilityObserver = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting; if (visible) request(); else { cancelAnimationFrame(frame); frame = 0; }
        }); visibilityObserver.observe(host);
        teardown = () => {
          cancelAnimationFrame(frame); wake.current = () => {};
          sizeObserver.disconnect(); visibilityObserver.disconnect();
          host.removeEventListener("pointerdown", down); host.removeEventListener("pointermove", move);
          host.removeEventListener("pointerup", up); host.removeEventListener("pointercancel", up); host.removeEventListener("lostpointercapture", up);
          host.removeEventListener("pointerleave", leave); host.removeEventListener("keydown", keyboard);
          renderer.domElement.removeEventListener("webglcontextlost", contextLost);
          document.removeEventListener("visibilitychange", visibilityChange); motion.removeEventListener("change", request);
          const geometries = new Set<import("three").BufferGeometry>(), materials = new Set<import("three").Material>(), textures = new Set<import("three").Texture>();
          cache.forEach(({ root }) => root.traverse((object) => {
            const objectMesh = object as import("three").Mesh;
            if (objectMesh.geometry) geometries.add(objectMesh.geometry);
            if (Array.isArray(objectMesh.material)) objectMesh.material.forEach((material) => materials.add(material));
            else if (objectMesh.material) materials.add(objectMesh.material);
          }));
          materials.forEach((material) => { for (const value of Object.values(material)) if (value instanceof T.Texture) textures.add(value); material.dispose(); });
          geometries.forEach((geometry) => geometry.dispose()); textures.forEach((texture) => texture.dispose());
          dustGeo.dispose(); dustMat.dispose(); environment.dispose(); renderer.dispose(); renderer.domElement.remove();
        };
        resize(); setStatus(stageReady ? "ready" : "failed");
      } catch { teardown(); if (!disposed) setStatus("failed"); }
    };
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { observer.disconnect(); void initialize(); } }, { rootMargin: "150px" });
    observer.observe(host);
    return () => { disposed = true; observer.disconnect(); teardown(); };
  }, []);

  return <>
    <div ref={hostRef} className="sculpture-canvas" tabIndex={status === "ready" ? 0 : -1} role="group"
      aria-label={`Interactive ${props.kind} sculpture`} aria-describedby={helpId} data-status={status} />
    <span id={helpId} className="sr-only">Drag to rotate. Keyboard: arrow keys rotate, Home resets the view.</span>
    {status !== "ready" && <div className="stage-fallback">
      {props.kind === "violin" ? <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/models/violin-preview.png`} alt="Studio render of the original Blender violin and bow" fill sizes="(max-width: 760px) 88vw, 50vw" className="violin-preview" /> : <GoldenSpiral />}
      <p role="status">{status === "failed" ? "3D could not load. Try another sculpture or reload." : "Preparing the instrument…"}</p></div>}
  </>;
}
