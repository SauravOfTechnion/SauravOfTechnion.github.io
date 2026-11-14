"use client";

import { useEffect, useRef, useState } from "react";
import { GoldenSpiral } from "@/components/golden-spiral";

/**
 * One object: a frosted violin, with the variable-L1 lookahead
 * traveling a golden spiral around it. Decorative. The page copy
 * carries the meaning if WebGL is unavailable.
 */
export function GuidanceStage() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let cleanup = () => {};

    void import("three").then(async (THREE) => {
      if (disposed || !hostRef.current) return;

      let RoomEnvironment: new () => import("three").Scene;
      try {
        ({ RoomEnvironment } = await import(
          "three/addons/environments/RoomEnvironment.js"
        ));
      } catch {
        setFailed(true);
        return;
      }

      const hostEl = hostRef.current;
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      if (!renderer.getContext()) {
        setFailed(true);
        renderer.dispose();
        return;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      hostEl.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 20);
      camera.position.set(0.15, 0.15, 4.15);

      const pmrem = new THREE.PMREMGenerator(renderer);
      const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = env;

      const resin = new THREE.Color("#e2b07a");
      const optic = new THREE.Color("#9aa6ff");

      const glass = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#efe6d4"),
        metalness: 0,
        roughness: 0.08,
        transmission: 0.62,
        thickness: 0.45,
        ior: 1.5,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        attenuationColor: new THREE.Color("#e2b07a"),
        attenuationDistance: 1.4,
      });
      const ebony = new THREE.MeshStandardMaterial({
        color: "#1a120c",
        roughness: 0.45,
        metalness: 0.05,
      });
      const stringMat = new THREE.MeshStandardMaterial({
        color: "#f4efe4",
        roughness: 0.35,
        metalness: 0.4,
      });
      const pathMat = new THREE.MeshStandardMaterial({
        color: resin,
        emissive: resin,
        emissiveIntensity: 0.35,
        roughness: 0.4,
      });
      const craftMat = new THREE.MeshStandardMaterial({
        color: optic,
        emissive: optic,
        emissiveIntensity: 0.8,
        roughness: 0.3,
      });

      const instrument = new THREE.Group();

      const bodyShape = new THREE.Shape();
      bodyShape.moveTo(0, 0.92);
      bodyShape.bezierCurveTo(0.22, 1.02, 0.48, 0.98, 0.52, 0.72);
      bodyShape.lineTo(0.34, 0.48);
      bodyShape.bezierCurveTo(0.16, 0.32, 0.12, 0.12, 0.16, -0.02);
      bodyShape.bezierCurveTo(0.2, -0.16, 0.36, -0.22, 0.5, -0.38);
      bodyShape.lineTo(0.62, -0.58);
      bodyShape.bezierCurveTo(0.7, -0.86, 0.48, -1.22, 0, -1.26);
      bodyShape.bezierCurveTo(-0.48, -1.22, -0.7, -0.86, -0.62, -0.58);
      bodyShape.lineTo(-0.5, -0.38);
      bodyShape.bezierCurveTo(-0.36, -0.22, -0.2, -0.16, -0.16, -0.02);
      bodyShape.bezierCurveTo(-0.12, 0.12, -0.16, 0.32, -0.34, 0.48);
      bodyShape.lineTo(-0.52, 0.72);
      bodyShape.bezierCurveTo(-0.48, 0.98, -0.22, 1.02, 0, 0.92);

      const body = new THREE.Mesh(
        new THREE.ExtrudeGeometry(bodyShape, {
          depth: 0.28,
          bevelEnabled: true,
          bevelThickness: 0.04,
          bevelSize: 0.035,
          bevelSegments: 2,
          curveSegments: 20,
        }),
        glass,
      );
      body.position.z = -0.14;
      instrument.add(body);

      const neck = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.62, 0.07), ebony);
      neck.position.set(0, 1.22, 0.02);
      instrument.add(neck);

      const fingerboard = new THREE.Mesh(
        new THREE.BoxGeometry(0.09, 1.15, 0.025),
        ebony,
      );
      fingerboard.position.set(0, 0.95, 0.12);
      instrument.add(fingerboard);

      const scrollPoints: import("three").Vector3[] = [];
      for (let i = 0; i < 40; i += 1) {
        const t = i / 39;
        const angle = t * Math.PI * 2.1;
        const radius = 0.13 * (1 - t * 0.55);
        scrollPoints.push(
          new THREE.Vector3(Math.sin(angle) * radius, 1.62 + t * 0.22, Math.cos(angle) * radius * 0.65),
        );
      }
      instrument.add(
        new THREE.Mesh(
          new THREE.TubeGeometry(new THREE.CatmullRomCurve3(scrollPoints), 48, 0.032, 8, false),
          ebony,
        ),
      );

      for (let i = 0; i < 4; i += 1) {
        const peg = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.1, 8), ebony);
        peg.rotation.z = Math.PI / 2;
        peg.position.set(i < 2 ? -0.07 : 0.07, 1.68 - (i % 2) * 0.07, 0);
        instrument.add(peg);
      }

      const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.07, 0.025), ebony);
      bridge.position.set(0, -0.12, 0.18);
      instrument.add(bridge);

      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.16, 0.02), ebony);
      tail.position.set(0, -0.95, 0.16);
      instrument.add(tail);

      for (let i = 0; i < 4; i += 1) {
        const x = -0.04 + i * 0.027;
        const string = new THREE.Mesh(
          new THREE.CylinderGeometry(0.0035, 0.0035, 2.35, 6),
          stringMat,
        );
        string.position.set(x, 0.28, 0.16);
        instrument.add(string);
      }

      const fHoleMat = new THREE.MeshStandardMaterial({
        color: "#120e0c",
        roughness: 0.6,
      });
      for (const sign of [1, -1]) {
        const hole: import("three").Vector3[] = [];
        for (let i = 0; i <= 20; i += 1) {
          const t = i / 20;
          hole.push(
            new THREE.Vector3(
              sign * (0.2 + Math.sin(t * Math.PI) * 0.045 * (t < 0.5 ? 1 : -0.6)),
              0.38 - t * 0.78,
              0.2,
            ),
          );
        }
        instrument.add(
          new THREE.Mesh(
            new THREE.TubeGeometry(new THREE.CatmullRomCurve3(hole), 24, 0.012, 6, false),
            fHoleMat,
          ),
        );
      }

      const bow = new THREE.Group();
      const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.008, 1.55, 8), pathMat);
      const hair = new THREE.Mesh(new THREE.BoxGeometry(0.01, 1.28, 0.008), stringMat);
      hair.position.x = 0.03;
      bow.add(stick, hair);
      bow.position.set(0.95, 0.05, 0.42);
      bow.rotation.z = 0.22;
      instrument.add(bow);

      const spiral: import("three").Vector3[] = [];
      for (let i = 0; i <= 90; i += 1) {
        const t = i / 90;
        const angle = -2.2 + t * Math.PI * 1.35;
        const radius = 1.05 * Math.pow(1.618, t * 0.55);
        spiral.push(
          new THREE.Vector3(Math.cos(angle) * radius * 0.85, Math.sin(angle) * radius * 0.7, 0.62),
        );
      }
      const flight = new THREE.CatmullRomCurve3(spiral);
      instrument.add(
        new THREE.Mesh(new THREE.TubeGeometry(flight, 80, 0.011, 8, false), pathMat),
      );

      const craft = new THREE.Mesh(new THREE.SphereGeometry(0.045, 20, 20), craftMat);
      const lookahead = new THREE.Mesh(
        new THREE.SphereGeometry(0.028, 16, 16),
        pathMat,
      );
      instrument.add(craft, lookahead);
      scene.add(instrument);

      scene.add(new THREE.AmbientLight(0xffffff, 0.55));
      const key = new THREE.DirectionalLight(resin, 2.4);
      key.position.set(-2.2, 2.4, 3.2);
      scene.add(key);
      const fill = new THREE.DirectionalLight(optic, 1.8);
      fill.position.set(2.4, 0.2, 2.6);
      scene.add(fill);
      const front = new THREE.PointLight(0xfff6ea, 12, 10);
      front.position.set(0.2, 0.2, 2.4);
      scene.add(front);

      const bounds = new THREE.Box3().setFromObject(instrument);
      instrument.position.sub(bounds.getCenter(new THREE.Vector3()));
      const fitted = bounds.getSize(new THREE.Vector3());
      const fitCamera = () => {
        const vertical = (camera.fov * Math.PI) / 180;
        const horizontal = 2 * Math.atan(Math.tan(vertical / 2) * camera.aspect);
        const distanceY = fitted.y / 2 / Math.tan(vertical / 2);
        const distanceX = fitted.x / 2 / Math.tan(horizontal / 2);
        camera.position.z = Math.max(distanceX, distanceY) * 1.28;
        camera.lookAt(0, 0, 0);
      };
      fitCamera();

      let targetX = 0;
      let targetY = 0.62;
      let visible = true;
      const pointer = (event: PointerEvent) => {
        const rect = hostEl.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        targetY = 0.62 + x * 0.45;
        targetX = -y * 0.28;
      };
      hostEl.addEventListener("pointermove", pointer);

      const resize = () => {
        const width = hostEl.clientWidth || 1;
        const height = hostEl.clientHeight || 1;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
        fitCamera();
      };
      resize();
      const observer = new ResizeObserver(resize);
      observer.observe(hostEl);
      const visibility = new IntersectionObserver(
        ([entry]) => {
          visible = entry?.isIntersecting ?? true;
        },
        { threshold: 0.05 },
      );
      visibility.observe(hostEl);

      const started = performance.now();
      let frame = 0;
      const tick = () => {
        frame = window.requestAnimationFrame(tick);
        if (!visible || document.hidden) return;
        const time = (performance.now() - started) / 1000;
        const along = (time * 0.045) % 1;
        craft.position.copy(flight.getPointAt(along));
        lookahead.position.copy(flight.getPointAt((along + 0.07) % 1));
        instrument.rotation.y += (targetY - instrument.rotation.y) * 0.05;
        instrument.rotation.x += (targetX - instrument.rotation.x) * 0.05;
        renderer.render(scene, camera);
      };
      tick();

      cleanup = () => {
        window.cancelAnimationFrame(frame);
        hostEl.removeEventListener("pointermove", pointer);
        observer.disconnect();
        visibility.disconnect();
        scene.traverse((object) => {
          const mesh = object as import("three").Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          const material = mesh.material;
          if (Array.isArray(material)) material.forEach((item) => item.dispose());
          else material?.dispose();
        });
        env.dispose();
        pmrem.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  if (failed) return <GoldenSpiral />;

  return (
    <div
      ref={hostRef}
      className="hero-stage"
      role="img"
      aria-label="Frosted glass violin with a golden-ratio guidance path. A point of light travels the spiral ahead of a second point, the way a guidance law looks ahead of an aircraft."
    />
  );
}
