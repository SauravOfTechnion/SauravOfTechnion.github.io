import * as T from "three";

export type SculptureKind =
  | "violin"
  | "flight"
  | "neural"
  | "learning"
  | "jpmorgan"
  | "semiconductor"
  | "jlr"
  | "orbit";

type Sculpture = { root: T.Group; update: (time: number, energy: number, reduced: boolean) => void };
const tau = Math.PI * 2;
const metal = (color: string, roughness = 0.25, metalness = 0.8) =>
  new T.MeshStandardMaterial({ color, metalness, roughness });
const physical = (
  color: string,
  opts: Partial<T.MeshPhysicalMaterialParameters> = {},
) =>
  new T.MeshPhysicalMaterial({
    color,
    metalness: 0.78,
    roughness: 0.18,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    ...opts,
  });
const glow = (color: string, intensity = 1.6) =>
  new T.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: intensity,
    metalness: 0.35,
    roughness: 0.25,
  });

function mesh(
  geometry: T.BufferGeometry,
  material: T.Material,
  parent: T.Object3D,
  x = 0,
  y = 0,
  z = 0,
) {
  const object = new T.Mesh(geometry, material);
  object.position.set(x, y, z);
  parent.add(object);
  return object;
}

function ring(radius: number, thickness: number, material: T.Material, parent: T.Object3D, segments = 128) {
  return mesh(new T.TorusGeometry(radius, thickness, 10, segments), material, parent);
}

function flight(): Sculpture {
  const root = new T.Group();
  root.rotation.set(0.18, -0.2, -0.18);
  const silver = metal("#b7d5e8", 0.18);
  const dark = metal("#2c4564");
  const light = glow("#92d8ff");
  const gimbals: T.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const gimbal = ring(1.6 + i * 0.22, 0.023 - i * 0.004, i === 1 ? silver : dark, root);
    gimbal.rotation.set(i * 0.7 + 0.3, i * 0.6, i * 0.4);
    gimbals.push(gimbal);
    for (let j = 0; j < 24; j++) {
      const a = (j / 24) * tau;
      const tick = mesh(
        new T.BoxGeometry(0.015, j % 6 === 0 ? 0.1 : 0.045, 0.015),
        light,
        gimbal,
        Math.sin(a) * (1.6 + i * 0.22),
        Math.cos(a) * (1.6 + i * 0.22),
      );
      tick.rotation.z = -a;
    }
  }
  const craft = new T.Group();
  craft.rotation.set(-0.45, -0.35, -0.1);
  root.add(craft);
  const fuselage = mesh(new T.SphereGeometry(1, 32, 24), silver, craft);
  fuselage.scale.set(0.16, 1.18, 0.16);
  const cockpit = mesh(new T.SphereGeometry(1, 24, 16), dark, craft, 0, 0.47, 0.11);
  cockpit.scale.set(0.115, 0.39, 0.12);
  const wing = new T.Shape();
  wing.moveTo(0, 0.5);
  wing.lineTo(1.4, -0.5);
  wing.lineTo(1.4, -0.67);
  wing.lineTo(0, -0.32);
  wing.lineTo(-1.4, -0.67);
  wing.lineTo(-1.4, -0.5);
  wing.closePath();
  mesh(
    new T.ExtrudeGeometry(wing, {
      depth: 0.035,
      bevelEnabled: true,
      bevelSize: 0.025,
      bevelThickness: 0.02,
      bevelSegments: 2,
    }),
    silver,
    craft,
  );
  const tail = new T.Shape();
  tail.moveTo(0, -0.65);
  tail.lineTo(0.5, -1.1);
  tail.lineTo(-0.5, -1.1);
  tail.closePath();
  mesh(new T.ExtrudeGeometry(tail, { depth: 0.025, bevelEnabled: false }), dark, craft, 0, 0, 0.04);
  for (const sign of [-1, 1]) mesh(new T.SphereGeometry(0.035, 12, 8), light, craft, sign * 1.37, -0.56, 0.05);
  const trail = new T.Group();
  root.add(trail);
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * tau;
    const dot = mesh(
      new T.SphereGeometry(0.022, 8, 6),
      i % 4 === 0 ? light : dark,
      trail,
      Math.cos(a) * 2.15,
      Math.sin(a) * 2.15,
      Math.sin(a * 2) * 0.25,
    );
    dot.scale.setScalar(0.5 + i / 24);
  }
  return {
    root,
    update(time, energy, reduced) {
      gimbals[0].rotation.y = 0.3 + time * 0.08 + energy * 0.5;
      gimbals[1].rotation.x = 1 + time * 0.1;
      gimbals[2].rotation.z = 0.8 - time * 0.07;
      craft.rotation.z =
        -0.15 + (reduced ? energy * 0.3 : Math.sin(time * 0.7) * 0.06 + energy * Math.sin(time * 3) * 0.4);
      trail.rotation.z = -time * 0.12 - energy;
    },
  };
}

function neural(): Sculpture {
  const root = new T.Group();
  const network = new T.Group();
  root.add(network);
  const nodeMaterial = glow("#adbbff");
  const nodeGeo = new T.SphereGeometry(0.035, 12, 8);
  const positions: T.Vector3[] = [];
  const nodes: T.Mesh[] = [];
  for (let i = 0; i < 72; i++) {
    const y = 1 - (i / 71) * 2;
    const radius = Math.sqrt(1 - y * y);
    const a = i * 2.399963;
    const p = new T.Vector3(Math.cos(a) * radius, y, Math.sin(a) * radius).multiplyScalar(1.62);
    positions.push(p);
    nodes.push(mesh(nodeGeo, nodeMaterial, network, p.x, p.y, p.z));
  }
  const lines: number[] = [];
  positions.forEach((a, i) =>
    positions.slice(i + 1).forEach((b) => {
      if (a.distanceTo(b) < 0.84) lines.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }),
  );
  const connectionsGeo = new T.BufferGeometry();
  connectionsGeo.setAttribute("position", new T.Float32BufferAttribute(lines, 3));
  const connectionsMat = new T.LineBasicMaterial({ color: "#8e9de4", transparent: true, opacity: 0.35 });
  network.add(new T.LineSegments(connectionsGeo, connectionsMat));
  const core = mesh(
    new T.IcosahedronGeometry(0.64, 0),
    new T.MeshPhysicalMaterial({ color: "#8c8fe0", metalness: 0.65, roughness: 0.13, clearcoat: 1, iridescence: 1 }),
    root,
  );
  const inner = mesh(
    new T.IcosahedronGeometry(0.9, 1),
    new T.MeshBasicMaterial({ color: "#b8a7ff", wireframe: true, transparent: true, opacity: 0.25 }),
    root,
  );
  const orbitRing = ring(2.04, 0.012, metal("#b6a9e6"), root);
  orbitRing.rotation.set(1.1, 0.15, 0.5);
  const signal = mesh(new T.SphereGeometry(0.06, 16, 12), glow("#fff0ce"), orbitRing);
  return {
    root,
    update(time, energy, reduced) {
      network.rotation.y = time * 0.09;
      core.rotation.set(time * 0.13, time * -0.17, 0.2);
      core.scale.setScalar(1 + energy * 0.22);
      inner.rotation.y = -time * 0.08;
      connectionsMat.opacity = 0.35 + energy * 0.5;
      nodes.forEach((node, i) =>
        node.scale.setScalar(1 + energy * (reduced ? 1 : Math.max(0, Math.sin(i * 0.35 - time * 8))) * 2),
      );
      signal.position.set(Math.cos(time * 0.3) * 2.04, Math.sin(time * 0.3) * 2.04, 0);
    },
  };
}

function learning(): Sculpture {
  const root = new T.Group();
  root.rotation.set(0.3, 0.2, -0.2);
  const ribbonMaterial = new T.MeshPhysicalMaterial({
    color: "#7db4ab",
    metalness: 0.72,
    roughness: 0.2,
    clearcoat: 1,
    iridescence: 0.75,
  });
  const knot = mesh(new T.TorusKnotGeometry(1.05, 0.18, 180, 20, 2, 3), ribbonMaterial, root);
  const path = new T.CatmullRomCurve3(
    Array.from({ length: 150 }, (_, i) => {
      const t = (i / 150) * tau;
      return new T.Vector3(
        (1.6 + 0.14 * Math.cos(t * 3)) * Math.cos(t),
        (1.6 + 0.14 * Math.cos(t * 3)) * Math.sin(t),
        0.5 * Math.sin(t * 3),
      );
    }),
    true,
  );
  mesh(new T.TubeGeometry(path, 160, 0.009, 6, true), metal("#8dcabd"), root);
  const agents: T.Mesh[] = [];
  const agentMaterial = glow("#d8f7d1");
  for (let i = 0; i < 5; i++) agents.push(mesh(new T.SphereGeometry(i === 0 ? 0.1 : 0.04, 16, 12), agentMaterial, root));
  const outer = ring(2.1, 0.008, metal("#b4d2c9"), root);
  outer.rotation.x = 0.8;
  return {
    root,
    update(time, energy, reduced) {
      knot.rotation.y = time * 0.1;
      knot.rotation.z = energy * 0.4;
      knot.scale.setScalar(1 + energy * 0.06);
      agents.forEach((agent, i) => {
        const raw = time * 0.065 + i * 0.035 + energy * (reduced ? 0.3 : 0.1);
        agent.position.copy(path.getPointAt(((raw % 1) + 1) % 1));
        agent.scale.setScalar(1 + energy * 0.6);
      });
    },
  };
}

/**
 * JPMorganChase · Asset & Wealth Management:
 * Precision 8-wedge JPMorgan Octagon Vault emblem, 3D quantitative candlestick
 * yield-curve pillars, and orbiting TrustGPT semantic document rings.
 */
function jpmorgan(): Sculpture {
  const root = new T.Group();
  root.rotation.set(0.16, -0.28, 0.05);
  root.scale.setScalar(1.16);

  const gold = physical("#dfc07c", { metalness: 0.9, roughness: 0.15 });
  const bronze = physical("#8b6c39", { metalness: 0.85, roughness: 0.24 });
  const slate = physical("#1f2937", { metalness: 0.72, roughness: 0.28 });
  const platinum = metal("#cad5e2", 0.18, 0.88);
  const emerald = physical("#58b98b", { metalness: 0.65, roughness: 0.2, iridescence: 0.5 });
  const signalGlow = glow("#f8e3a3", 1.8);
  const emeraldGlow = glow("#8df5c4", 1.5);

  // Central JPMorgan-inspired Octagonal Crest Assembly
  const octagonGroup = new T.Group();
  root.add(octagonGroup);

  // Outer octagonal chamfered bezel (8-sided torus)
  const outerOctagon = mesh(new T.TorusGeometry(1.12, 0.032, 8, 8), gold, octagonGroup);
  outerOctagon.rotation.z = Math.PI / 8;
  const innerOctagon = mesh(new T.TorusGeometry(0.42, 0.02, 8, 8), bronze, octagonGroup, 0, 0, 0.05);
  innerOctagon.rotation.z = Math.PI / 8;

  // 8 precision geometric wedges forming the iconic JPMorgan octagon
  const wedgeShape = new T.Shape();
  wedgeShape.moveTo(0.46, 0.04);
  wedgeShape.lineTo(0.98, 0.04);
  wedgeShape.lineTo(0.84, 0.37);
  wedgeShape.lineTo(0.35, 0.17);
  wedgeShape.closePath();
  const wedgeGeo = new T.ExtrudeGeometry(wedgeShape, {
    depth: 0.12,
    bevelEnabled: true,
    bevelSize: 0.018,
    bevelThickness: 0.018,
    bevelSegments: 2,
  });
  wedgeGeo.center();

  const wedges: { mesh: T.Mesh; dir: T.Vector3; basePos: T.Vector3 }[] = [];
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * tau + Math.PI / 8;
    const dist = 0.68;
    const dir = new T.Vector3(Math.cos(angle), Math.sin(angle), 0);
    const basePos = dir.clone().multiplyScalar(dist);
    const w = mesh(wedgeGeo, i % 2 === 0 ? gold : bronze, octagonGroup, basePos.x, basePos.y, 0);
    w.rotation.z = angle - Math.PI / 9;
    wedges.push({ mesh: w, dir, basePos });
  }

  // Central wealth crystal core
  const coreCrystal = mesh(new T.OctahedronGeometry(0.28, 0), emerald, octagonGroup);

  // 3D Quantitative Yield Curve & Candlestick Array arcing below/around the vault
  const chartGroup = new T.Group();
  chartGroup.position.set(0, -0.15, -0.35);
  root.add(chartGroup);

  const candleCount = 11;
  const candles: { body: T.Mesh; wick: T.Mesh; dot: T.Mesh; baseHeight: number; baseY: number }[] = [];
  const curvePoints: T.Vector3[] = [];
  for (let i = 0; i < candleCount; i++) {
    const u = i / (candleCount - 1) - 0.5;
    const x = u * 2.75;
    const z = -Math.cos(u * Math.PI) * 0.42;
    const baseHeight = 0.28 + Math.pow(u + 0.55, 1.35) * 0.48 + (i % 2 === 0 ? 0.12 : -0.05);
    const baseY = -1.12 + u * 0.45 + (i % 3) * 0.08;
    const isBull = i % 3 !== 1;
    const wick = mesh(
      new T.CylinderGeometry(0.01, 0.01, baseHeight + 0.28, 8),
      platinum,
      chartGroup,
      x,
      baseY,
      z,
    );
    const body = mesh(
      new T.BoxGeometry(0.11, baseHeight, 0.11),
      isBull ? emerald : gold,
      chartGroup,
      x,
      baseY,
      z,
    );
    const dot = mesh(
      new T.SphereGeometry(0.032, 12, 8),
      isBull ? emeraldGlow : signalGlow,
      chartGroup,
      x,
      baseY + baseHeight * 0.5 + 0.16,
      z,
    );
    candles.push({ body, wick, dot, baseHeight, baseY });
    curvePoints.push(new T.Vector3(x, baseY + baseHeight * 0.5 + 0.16, z));
  }
  const yieldCurve = new T.CatmullRomCurve3(curvePoints);
  mesh(new T.TubeGeometry(yieldCurve, 96, 0.014, 8, false), gold, chartGroup);

  // Orbiting TrustGPT Document & Token Rings
  const trustOrbit1 = ring(1.88, 0.013, platinum, root);
  trustOrbit1.rotation.set(1.05, 0.28, -0.35);
  const trustOrbit2 = ring(2.08, 0.01, gold, root);
  trustOrbit2.rotation.set(-0.78, -0.32, 0.45);

  // Miniature Trust Document Plates on Orbit 1
  const docGeo = new T.BoxGeometry(0.16, 0.22, 0.018);
  const docs: T.Mesh[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * tau;
    const doc = mesh(
      docGeo,
      i % 2 === 0 ? gold : slate,
      trustOrbit1,
      Math.cos(a) * 1.88,
      Math.sin(a) * 1.88,
      0,
    );
    doc.rotation.z = a;
    docs.push(doc);
  }
  const ledgerSignal = mesh(new T.SphereGeometry(0.065, 16, 12), emeraldGlow, trustOrbit2);

  return {
    root,
    update(time, energy, reduced) {
      octagonGroup.rotation.z = reduced ? 0 : Math.sin(time * 0.35) * 0.08 - time * 0.06;
      coreCrystal.rotation.set(time * 0.4, time * 0.65, 0);
      coreCrystal.scale.setScalar(1 + energy * 0.32);

      wedges.forEach(({ mesh: w, dir, basePos }, i) => {
        const pulse = reduced
          ? energy * 0.14
          : Math.sin(time * 1.6 + i * 0.78) * 0.025 + energy * 0.18;
        w.position.copy(basePos).addScaledVector(dir, pulse);
        w.position.z = reduced ? 0 : Math.sin(time * 2 + i) * 0.03 * (1 + energy * 2);
      });

      candles.forEach((c, i) => {
        const wave = reduced ? 1 : 1 + Math.sin(time * 2.1 + i * 0.6) * (0.15 + energy * 0.45);
        c.body.scale.y = wave;
        c.wick.scale.y = 1 + (wave - 1) * 0.6;
        c.dot.position.y = c.baseY + c.baseHeight * wave * 0.5 + 0.16;
      });

      trustOrbit1.rotation.z = -0.35 + time * 0.11 + energy * 0.4;
      trustOrbit2.rotation.z = 0.45 - time * 0.09 - energy * 0.35;
      docs.forEach((d, i) => {
        d.rotation.x = time * 0.6 + i;
      });
      const a = time * (0.45 + energy * 0.8);
      ledgerSignal.position.set(Math.cos(a) * 2.08, Math.sin(a) * 2.08, 0);
    },
  };
}

/**
 * BharatSemi / 3rdiTech · Senior AI Engineer:
 * Multi-layer BGA/QFP semiconductor SoC package, 64 gold edge pins,
 * iridescent 4×4 TensorRT neural compute die, and EO/IR drone optical reticle.
 */
function semiconductor(): Sculpture {
  const root = new T.Group();
  root.rotation.set(0.62, -0.45, 0.18);
  root.scale.setScalar(1.18);

  const pcbEmerald = physical("#173b2d", { metalness: 0.45, roughness: 0.32, clearcoat: 0.85 });
  const interposerDark = physical("#18202c", { metalness: 0.75, roughness: 0.22 });
  const siliconWafer = physical("#293856", {
    metalness: 0.86,
    roughness: 0.08,
    clearcoat: 1,
    iridescence: 1,
    iridescenceIOR: 1.75,
  });
  const goldPin = metal("#ebbf64", 0.16, 0.92);
  const nickelIhs = metal("#b8c4d0", 0.2, 0.86);
  const coreActive = glow("#8cf6d4", 1.75);
  const reticleGlow = glow("#d5ffa0", 1.6);

  const chipGroup = new T.Group();
  root.add(chipGroup);

  // Base PCB substrate & stepped silicon interposer
  mesh(new T.BoxGeometry(2.36, 2.36, 0.11), pcbEmerald, chipGroup, 0, 0, -0.08);
  mesh(new T.BoxGeometry(1.88, 1.88, 0.09), interposerDark, chipGroup, 0, 0, 0.01);

  // Corner fiducial alignment rings on PCB
  for (const sx of [-1, 1]) {
    for (const sy of [-1, 1]) {
      mesh(new T.CylinderGeometry(0.065, 0.065, 0.02, 16), goldPin, chipGroup, sx * 1.0, sy * 1.0, -0.02).rotation.x =
        Math.PI / 2;
    }
  }

  // Brushed Nickel Integrated Heat Spreader (IHS) perimeter frame
  const barLong = new T.BoxGeometry(1.76, 0.12, 0.07);
  const barShort = new T.BoxGeometry(0.12, 1.52, 0.07);
  mesh(barLong, nickelIhs, chipGroup, 0, 0.82, 0.08);
  mesh(barLong, nickelIhs, chipGroup, 0, -0.82, 0.08);
  mesh(barShort, nickelIhs, chipGroup, -0.82, 0, 0.08);
  mesh(barShort, nickelIhs, chipGroup, 0.82, 0, 0.08);

  // Central Iridescent Photolithography Silicon Die
  mesh(new T.BoxGeometry(1.42, 1.42, 0.06), siliconWafer, chipGroup, 0, 0, 0.07);

  // 4×4 TensorRT Compute Core Matrix on the Silicon Die
  const cores: T.Mesh[] = [];
  const coreCaps: T.Mesh[] = [];
  const coreGeo = new T.BoxGeometry(0.26, 0.26, 0.055);
  const capGeo = new T.BoxGeometry(0.2, 0.2, 0.02);
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const cx = (col - 1.5) * 0.31;
      const cy = (row - 1.5) * 0.31;
      const coreBlock = mesh(coreGeo, siliconWafer, chipGroup, cx, cy, 0.12);
      const cap = mesh(
        capGeo,
        (row + col) % 2 === 0 ? coreActive : reticleGlow,
        chipGroup,
        cx,
        cy,
        0.155,
      );
      cores.push(coreBlock);
      coreCaps.push(cap);
    }
  }

  // 64 Gold Gull-Wing / QFP Pins (16 along each of the 4 sides) + Gold Interconnect Traces
  const pinHorizGeo = new T.BoxGeometry(0.28, 0.042, 0.032);
  const pinVertGeo = new T.BoxGeometry(0.042, 0.28, 0.032);
  const traceHorizGeo = new T.BoxGeometry(0.24, 0.016, 0.015);
  const traceVertGeo = new T.BoxGeometry(0.016, 0.24, 0.015);

  for (let i = 0; i < 16; i++) {
    const offset = (i - 7.5) * 0.11;
    for (const sign of [-1, 1]) {
      // Left & Right edge pins + traces
      mesh(pinHorizGeo, goldPin, chipGroup, sign * 1.3, offset, -0.06);
      mesh(traceHorizGeo, goldPin, chipGroup, sign * 1.04, offset, -0.015);
      // Top & Bottom edge pins + traces
      mesh(pinVertGeo, goldPin, chipGroup, offset, sign * 1.3, -0.06);
      mesh(traceVertGeo, goldPin, chipGroup, offset, sign * 1.04, -0.015);
    }
  }

  // Outer Silicon Wafer Ring with Fiducial Notch
  const waferRing = ring(2.04, 0.016, nickelIhs, root);
  for (let i = 0; i < 36; i++) {
    const a = (i / 36) * tau;
    const tick = mesh(
      new T.BoxGeometry(0.014, i % 9 === 0 ? 0.11 : 0.05, 0.014),
      goldPin,
      waferRing,
      Math.cos(a) * 2.04,
      Math.sin(a) * 2.04,
      0,
    );
    tick.rotation.z = a + Math.PI / 2;
  }

  // Floating EO/IR Drone Optical Perception Reticle above the Die
  const reticle = new T.Group();
  reticle.position.set(0, 0, 0.48);
  chipGroup.add(reticle);
  ring(0.68, 0.011, reticleGlow, reticle);
  ring(0.42, 0.008, coreActive, reticle);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * tau;
    const hair = mesh(
      new T.BoxGeometry(0.22, 0.014, 0.014),
      reticleGlow,
      reticle,
      Math.cos(a) * 0.68,
      Math.sin(a) * 0.68,
      0,
    );
    hair.rotation.z = a;
  }
  const scanNode = mesh(new T.SphereGeometry(0.045, 14, 10), reticleGlow, reticle, 0.68, 0, 0);

  return {
    root,
    update(time, energy, reduced) {
      chipGroup.rotation.z = reduced ? 0 : Math.sin(time * 0.35) * 0.12 + time * 0.05;
      waferRing.rotation.z = -time * 0.07 - energy * 0.4;
      reticle.rotation.z = time * (0.28 + energy * 1.2);
      reticle.position.z = 0.48 + (reduced ? 0 : Math.sin(time * 1.5) * 0.05 + energy * 0.14);

      coreCaps.forEach((cap, idx) => {
        const r = Math.floor(idx / 4);
        const c = idx % 4;
        const wave = reduced
          ? 1 + energy * 0.5
          : 0.65 + 0.55 * Math.sin(time * 4.2 - (r + c) * 0.75) + energy * 0.9;
        cap.scale.set(0.85 + wave * 0.18, 0.85 + wave * 0.18, 1 + wave * 1.4);
        cores[idx].position.z = 0.12 + (wave - 0.65) * 0.025;
      });

      const sa = time * 1.8;
      scanNode.position.set(Math.cos(sa) * 0.68, Math.sin(sa) * 0.68, 0);
    },
  };
}

/**
 * Jaguar Land Rover · ADAS Systems Engineer:
 * Sculpted 3D luxury Grand-Tourer fastback car body, 4 rotating multi-spoke alloy wheels,
 * leaping aerodynamic crest streamlines, and 360° ADAS LiDAR + Audionostics sensor rings.
 */
function jlr(): Sculpture {
  const root = new T.Group();
  root.rotation.set(0.24, -0.54, 0.05);
  root.scale.setScalar(1.26);

  const racingGreen = physical("#2d4c3e", {
    metalness: 0.82,
    roughness: 0.14,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
  });
  const liquidSilver = physical("#c5d0cb", {
    metalness: 0.9,
    roughness: 0.12,
    clearcoat: 1,
  });
  const glassCanopy = physical("#141f24", {
    metalness: 0.35,
    roughness: 0.05,
    clearcoat: 1,
  });
  const tireDark = new T.MeshStandardMaterial({ color: "#1a1d20", metalness: 0.25, roughness: 0.65 });
  const copperCrest = physical("#d9a96c", { metalness: 0.88, roughness: 0.18 });
  const headLight = glow("#dcfffb", 2.0);
  const tailLight = glow("#ff6e4a", 1.9);
  const lidarGlow = glow("#b5f59c", 1.5);

  const carGroup = new T.Group();
  carGroup.position.y = 0.08;
  root.add(carGroup);

  // Main Center Fastback Body Profile (X from -1.35 front nose to +1.32 rear tail)
  const bodyShape = new T.Shape();
  bodyShape.moveTo(-1.35, -0.14);
  bodyShape.lineTo(-1.32, 0.04);
  bodyShape.bezierCurveTo(-1.18, 0.14, -0.75, 0.18, -0.38, 0.2); // Long sculpted Jaguar/RR bonnet
  bodyShape.bezierCurveTo(-0.12, 0.38, 0.18, 0.46, 0.52, 0.43); // Raked windshield & coupe roof peak
  bodyShape.bezierCurveTo(0.88, 0.4, 1.18, 0.24, 1.32, 0.12); // Fastback Kamm tail slope
  bodyShape.lineTo(1.34, -0.08);
  bodyShape.lineTo(1.12, -0.16);
  bodyShape.lineTo(-1.18, -0.16);
  bodyShape.closePath();

  const mainBodyGeo = new T.ExtrudeGeometry(bodyShape, {
    depth: 0.64,
    bevelEnabled: true,
    bevelSize: 0.06,
    bevelThickness: 0.06,
    bevelSegments: 4,
  });
  mainBodyGeo.center();
  mesh(mainBodyGeo, racingGreen, carGroup, 0, 0.12, 0);

  // Sculpted Left & Right Muscular Fender Haunches (wide automotive stance)
  const fenderShape = new T.Shape();
  fenderShape.moveTo(-1.28, -0.16);
  fenderShape.bezierCurveTo(-1.15, 0.1, -0.62, 0.14, -0.35, 0.06);
  fenderShape.bezierCurveTo(0.0, 0.04, 0.35, 0.08, 0.62, 0.18);
  fenderShape.bezierCurveTo(0.95, 0.22, 1.22, 0.12, 1.3, -0.1);
  fenderShape.lineTo(1.18, -0.18);
  fenderShape.lineTo(-1.18, -0.18);
  fenderShape.closePath();

  const fenderGeo = new T.ExtrudeGeometry(fenderShape, {
    depth: 0.18,
    bevelEnabled: true,
    bevelSize: 0.055,
    bevelThickness: 0.055,
    bevelSegments: 3,
  });
  fenderGeo.center();
  for (const sign of [-1, 1]) {
    mesh(fenderGeo, racingGreen, carGroup, 0, 0.01, sign * 0.41);
    // Brushed silver side rocker sill blade
    mesh(new T.BoxGeometry(1.5, 0.028, 0.04), liquidSilver, carGroup, 0, -0.15, sign * 0.54);
  }

  // Tinted Glass Cabin Canopy + Roof-Mounted ADAS LiDAR Sensor Pod
  const cabinGeo = new T.SphereGeometry(1, 28, 18);
  const cabin = mesh(cabinGeo, glassCanopy, carGroup, 0.16, 0.23, 0);
  cabin.scale.set(0.66, 0.2, 0.33);
  mesh(new T.CylinderGeometry(0.06, 0.08, 0.05, 16), copperCrest, carGroup, -0.05, 0.44, 0);
  mesh(new T.CylinderGeometry(0.055, 0.055, 0.025, 16), lidarGlow, carGroup, -0.05, 0.465, 0);

  // Sculpted Oval Badge & Leaper Crest Halo Framing the Vehicle
  const badgeHalo = ring(1.42, 0.014, copperCrest, root);
  badgeHalo.scale.set(1.25, 0.68, 1);
  badgeHalo.position.set(0, 0.18, -0.22);

  // Front Grille & Signature J-Blade LED Headlamps + Full-Width Rear LED Taillight Bar
  mesh(new T.BoxGeometry(0.05, 0.1, 0.54), glassCanopy, carGroup, -1.35, -0.02, 0);
  mesh(new T.BoxGeometry(0.06, 0.022, 0.5), liquidSilver, carGroup, -1.36, -0.02, 0);
  for (const sign of [-1, 1]) {
    const headlamp = mesh(new T.BoxGeometry(0.16, 0.028, 0.14), headLight, carGroup, -1.28, 0.05, sign * 0.38);
    headlamp.rotation.y = sign * 0.25;
  }
  mesh(new T.BoxGeometry(0.05, 0.036, 0.88), tailLight, carGroup, 1.33, 0.08, 0);

  // 4 Multi-Spoke Alloy Wheels with Brake Calipers
  const wheels: T.Group[] = [];
  const wheelCoords: [number, number][] = [
    [-0.82, 0.52],
    [-0.82, -0.52],
    [0.82, 0.52],
    [0.82, -0.52],
  ];
  for (const [wx, wz] of wheelCoords) {
    const wGroup = new T.Group();
    wGroup.position.set(wx, -0.14, wz);
    carGroup.add(wGroup);
    mesh(new T.TorusGeometry(0.22, 0.075, 14, 32), tireDark, wGroup);
    mesh(new T.TorusGeometry(0.155, 0.02, 10, 24), liquidSilver, wGroup);
    const hub = mesh(new T.CylinderGeometry(0.055, 0.055, 0.08, 16), copperCrest, wGroup);
    hub.rotation.x = Math.PI / 2;
    for (let s = 0; s < 6; s++) {
      const sa = (s / 6) * Math.PI;
      const spoke = mesh(new T.BoxGeometry(0.3, 0.024, 0.024), liquidSilver, wGroup);
      spoke.rotation.z = sa;
    }
    wheels.push(wGroup);
  }

  // Sculpted Leaping Crest & Wind-Tunnel Aerodynamic Streamlines over the Car
  const aeroLines: T.Mesh[] = [];
  for (const zOff of [-0.28, 0, 0.28]) {
    const isCenter = zOff === 0;
    const pts = [
      new T.Vector3(-1.55, -0.02, zOff * 0.7),
      new T.Vector3(-0.95, isCenter ? 0.28 : 0.2, zOff),
      new T.Vector3(-0.15, isCenter ? 0.58 : 0.42, zOff * 1.05),
      new T.Vector3(0.65, isCenter ? 0.62 : 0.46, zOff),
      new T.Vector3(1.58, isCenter ? 0.26 : 0.16, zOff * 0.8),
    ];
    const aeroCurve = new T.CatmullRomCurve3(pts);
    const tube = mesh(
      new T.TubeGeometry(aeroCurve, 72, isCenter ? 0.018 : 0.01, 8, false),
      isCenter ? copperCrest : liquidSilver,
      carGroup,
    );
    aeroLines.push(tube);
  }

  // 360° ADAS LiDAR & Ultrasonic Parking-Assist Field + Audionostics Acoustic Ring
  const lidarField = new T.Group();
  lidarField.position.y = -0.34;
  lidarField.rotation.x = Math.PI / 2;
  root.add(lidarField);

  const innerLidar = ring(1.68, 0.01, lidarGlow, lidarField);
  const outerLidar = ring(2.06, 0.013, liquidSilver, lidarField);
  for (let i = 0; i < 36; i++) {
    const a = (i / 36) * tau;
    const tick = mesh(
      new T.BoxGeometry(0.015, i % 3 === 0 ? 0.1 : 0.045, 0.015),
      i % 3 === 0 ? lidarGlow : copperCrest,
      outerLidar,
      Math.cos(a) * 2.06,
      Math.sin(a) * 2.06,
      0,
    );
    tick.rotation.z = a + Math.PI / 2;
  }

  // Audionostics harmonic waveform ring (patented engine-sound diagnostics)
  const audioPoints = Array.from({ length: 120 }, (_, i) => {
    const a = (i / 120) * tau;
    const r = 1.87 + Math.sin(a * 12) * 0.055;
    return new T.Vector3(Math.cos(a) * r, Math.sin(a) * r, Math.cos(a * 6) * 0.04);
  });
  const audioRing = mesh(
    new T.TubeGeometry(new T.CatmullRomCurve3(audioPoints, true), 140, 0.009, 6, true),
    copperCrest,
    lidarField,
  );

  return {
    root,
    update(time, energy, reduced) {
      const speed = reduced ? 0 : time * (2.6 + energy * 7);
      wheels.forEach((w) => {
        w.rotation.z = -speed;
      });
      carGroup.position.y = 0.08 + (reduced ? 0 : Math.sin(time * 1.4) * 0.025);
      carGroup.rotation.z = reduced ? 0 : Math.sin(time * 0.9) * 0.02 + energy * 0.06;
      carGroup.position.x = reduced ? 0 : Math.sin(energy * Math.PI) * -0.14;

      innerLidar.rotation.z = time * 0.18 + energy * 0.8;
      outerLidar.rotation.z = -time * 0.1 + energy * 0.4;
      audioRing.rotation.z = time * 0.25 - energy * 0.9;
      audioRing.scale.setScalar(1 + energy * 0.08);
      aeroLines.forEach((line, idx) => {
        line.position.y = reduced ? 0 : Math.sin(time * 2.2 + idx) * 0.015 * (1 + energy * 2);
      });
    },
  };
}

/**
 * Geodesic Career Orbit & Guidance Armillary:
 * Connects IIT Madras → JLR → BharatSemi → JPMorganChase → Technion (Haifa).
 */
function orbit(): Sculpture {
  const root = new T.Group();
  root.rotation.set(0.24, -0.35, 0.12);
  root.scale.setScalar(1.15);

  const brass = physical("#d4b475", { metalness: 0.86, roughness: 0.18 });
  const sage = physical("#7ea172", { metalness: 0.68, roughness: 0.22, iridescence: 0.65 });
  const darkCore = physical("#1d2820", { metalness: 0.6, roughness: 0.28, clearcoat: 1 });
  const beaconGlow = glow("#d5ffa0", 1.9);

  const globe = new T.Group();
  root.add(globe);

  mesh(new T.IcosahedronGeometry(0.86, 2), darkCore, globe);
  mesh(
    new T.IcosahedronGeometry(1.12, 1),
    new T.MeshBasicMaterial({ color: "#9eb882", wireframe: true, transparent: true, opacity: 0.32 }),
    globe,
  );

  // 5 Career Milestone Coordinates on the Sphere
  const waypoints = [
    new T.Vector3(0.45, 0.22, 0.98).normalize().multiplyScalar(1.14), // IIT Madras
    new T.Vector3(-0.35, 0.78, 0.62).normalize().multiplyScalar(1.14), // Jaguar Land Rover
    new T.Vector3(0.68, 0.35, 0.72).normalize().multiplyScalar(1.14), // BharatSemi
    new T.Vector3(-0.78, 0.55, 0.48).normalize().multiplyScalar(1.14), // JPMorganChase
    new T.Vector3(0.22, 0.68, 0.88).normalize().multiplyScalar(1.14), // Technion · Haifa
  ];

  waypoints.forEach((wp) => {
    mesh(new T.SphereGeometry(0.055, 14, 10), beaconGlow, globe, wp.x, wp.y, wp.z);
  });

  // Elevated great-circle trajectory spline linking all 5 milestones
  const arcPoints: T.Vector3[] = [];
  for (let i = 0; i < waypoints.length; i++) {
    const a = waypoints[i];
    const b = waypoints[(i + 1) % waypoints.length];
    for (let s = 0; s < 16; s++) {
      const t = s / 16;
      const p = a
        .clone()
        .lerp(b, t)
        .normalize()
        .multiplyScalar(1.14 + Math.sin(t * Math.PI) * 0.28);
      arcPoints.push(p);
    }
  }
  const trajectory = new T.CatmullRomCurve3(arcPoints, true);
  mesh(new T.TubeGeometry(trajectory, 140, 0.014, 8, true), brass, globe);
  const probe = mesh(new T.SphereGeometry(0.075, 16, 12), beaconGlow, globe);

  const armillary1 = ring(1.62, 0.015, brass, root);
  armillary1.rotation.set(0.9, 0.2, 0.3);
  const armillary2 = ring(1.94, 0.012, sage, root);
  armillary2.rotation.set(-0.6, 0.5, -0.2);

  return {
    root,
    update(time, energy, reduced) {
      globe.rotation.y = time * 0.14 + energy * 0.5;
      armillary1.rotation.z = time * 0.09 - energy * 0.3;
      armillary2.rotation.x = -0.6 + Math.sin(time * 0.4) * 0.15;
      const rawU = time * 0.08 + (reduced ? energy * 0.25 : energy * 0.12);
      const u = ((rawU % 1) + 1) % 1;
      probe.position.copy(trajectory.getPointAt(u));
      probe.scale.setScalar(1 + energy * 0.5);
    },
  };
}

export async function createSculpture(kind: SculptureKind): Promise<Sculpture> {
  if (kind === "violin") return (await import("./violin-asset")).loadViolin();
  return { flight, neural, learning, jpmorgan, semiconductor, jlr, orbit }[kind]();
}
