import * as T from "three";

export type SculptureKind = "violin" | "flight" | "neural" | "learning";
type Sculpture = { root: T.Group; update: (time: number, energy: number, reduced: boolean) => void };
const tau = Math.PI * 2;
const metal = (color: string, roughness = 0.25) => new T.MeshStandardMaterial({ color, metalness: 0.8, roughness });
const glow = (color: string) => new T.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.6, metalness: 0.35, roughness: 0.25 });
function mesh(geometry: T.BufferGeometry, material: T.Material, parent: T.Object3D, x = 0, y = 0, z = 0) {
  const object = new T.Mesh(geometry, material);
  object.position.set(x, y, z);
  parent.add(object);
  return object;
}
function ring(radius: number, thickness: number, material: T.Material, parent: T.Object3D) {
  return mesh(new T.TorusGeometry(radius, thickness, 8, 128), material, parent);
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
      const a = j / 24 * tau;
      const tick = mesh(new T.BoxGeometry(0.015, j % 6 === 0 ? 0.1 : 0.045, 0.015), light, gimbal, Math.sin(a) * (1.6 + i * 0.22), Math.cos(a) * (1.6 + i * 0.22));
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
  wing.moveTo(0, 0.5); wing.lineTo(1.4, -0.5); wing.lineTo(1.4, -0.67); wing.lineTo(0, -0.32);
  wing.lineTo(-1.4, -0.67); wing.lineTo(-1.4, -0.5); wing.closePath();
  mesh(new T.ExtrudeGeometry(wing, { depth: 0.035, bevelEnabled: true, bevelSize: 0.025, bevelThickness: 0.02, bevelSegments: 2 }), silver, craft);
  const tail = new T.Shape();
  tail.moveTo(0, -0.65); tail.lineTo(0.5, -1.1); tail.lineTo(-0.5, -1.1); tail.closePath();
  mesh(new T.ExtrudeGeometry(tail, { depth: 0.025, bevelEnabled: false }), dark, craft, 0, 0, 0.04);
  for (const sign of [-1, 1]) mesh(new T.SphereGeometry(0.035, 12, 8), light, craft, sign * 1.37, -0.56, 0.05);
  const trail = new T.Group();
  root.add(trail);
  for (let i = 0; i < 24; i++) {
    const a = i / 24 * tau;
    const dot = mesh(new T.SphereGeometry(0.022, 8, 6), i % 4 === 0 ? light : dark, trail, Math.cos(a) * 2.15, Math.sin(a) * 2.15, Math.sin(a * 2) * 0.25);
    dot.scale.setScalar(0.5 + i / 24);
  }
  return { root, update(time, energy, reduced) {
    gimbals[0].rotation.y = 0.3 + time * 0.08 + energy * 0.5;
    gimbals[1].rotation.x = 1 + time * 0.1;
    gimbals[2].rotation.z = 0.8 - time * 0.07;
    craft.rotation.z = -0.15 + (reduced ? energy * 0.3 : Math.sin(time * 0.7) * 0.06 + energy * Math.sin(time * 3) * 0.4);
    trail.rotation.z = -time * 0.12 - energy;
  } };
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
    const y = 1 - i / 71 * 2;
    const radius = Math.sqrt(1 - y * y);
    const a = i * 2.399963;
    const p = new T.Vector3(Math.cos(a) * radius, y, Math.sin(a) * radius).multiplyScalar(1.62);
    positions.push(p);
    nodes.push(mesh(nodeGeo, nodeMaterial, network, p.x, p.y, p.z));
  }
  const lines: number[] = [];
  positions.forEach((a, i) => positions.slice(i + 1).forEach((b) => { if (a.distanceTo(b) < 0.84) lines.push(a.x, a.y, a.z, b.x, b.y, b.z); }));
  const connectionsGeo = new T.BufferGeometry();
  connectionsGeo.setAttribute("position", new T.Float32BufferAttribute(lines, 3));
  const connectionsMat = new T.LineBasicMaterial({ color: "#8e9de4", transparent: true, opacity: 0.35 });
  network.add(new T.LineSegments(connectionsGeo, connectionsMat));
  const core = mesh(new T.IcosahedronGeometry(0.64, 0), new T.MeshPhysicalMaterial({ color: "#8c8fe0", metalness: 0.65, roughness: 0.13, clearcoat: 1, iridescence: 1 }), root);
  const inner = mesh(new T.IcosahedronGeometry(0.9, 1), new T.MeshBasicMaterial({ color: "#b8a7ff", wireframe: true, transparent: true, opacity: 0.25 }), root);
  const orbit = ring(2.04, 0.012, metal("#b6a9e6"), root);
  orbit.rotation.set(1.1, 0.15, 0.5);
  const signal = mesh(new T.SphereGeometry(0.06, 16, 12), glow("#fff0ce"), orbit);
  return { root, update(time, energy, reduced) {
    network.rotation.y = time * 0.09;
    core.rotation.set(time * 0.13, time * -0.17, 0.2);
    core.scale.setScalar(1 + energy * 0.22);
    inner.rotation.y = -time * 0.08;
    connectionsMat.opacity = 0.35 + energy * 0.5;
    nodes.forEach((node, i) => node.scale.setScalar(1 + energy * (reduced ? 1 : Math.max(0, Math.sin(i * 0.35 - time * 8))) * 2));
    signal.position.set(Math.cos(time * 0.3) * 2.04, Math.sin(time * 0.3) * 2.04, 0);
  } };
}

function learning(): Sculpture {
  const root = new T.Group();
  root.rotation.set(0.3, 0.2, -0.2);
  const ribbonMaterial = new T.MeshPhysicalMaterial({ color: "#7db4ab", metalness: 0.72, roughness: 0.2, clearcoat: 1, iridescence: 0.75 });
  const knot = mesh(new T.TorusKnotGeometry(1.05, 0.18, 180, 20, 2, 3), ribbonMaterial, root);
  const path = new T.CatmullRomCurve3(Array.from({ length: 150 }, (_, i) => {
    const t = i / 150 * tau;
    return new T.Vector3((1.6 + 0.14 * Math.cos(t * 3)) * Math.cos(t), (1.6 + 0.14 * Math.cos(t * 3)) * Math.sin(t), 0.5 * Math.sin(t * 3));
  }), true);
  mesh(new T.TubeGeometry(path, 160, 0.009, 6, true), metal("#8dcabd"), root);
  const agents: T.Mesh[] = [];
  const agentMaterial = glow("#d8f7d1");
  for (let i = 0; i < 5; i++) agents.push(mesh(new T.SphereGeometry(i === 0 ? 0.1 : 0.04, 16, 12), agentMaterial, root));
  const outer = ring(2.1, 0.008, metal("#b4d2c9"), root);
  outer.rotation.x = 0.8;
  return { root, update(time, energy, reduced) {
    knot.rotation.y = time * 0.1;
    knot.rotation.z = energy * 0.4;
    knot.scale.setScalar(1 + energy * 0.06);
    agents.forEach((agent, i) => {
      agent.position.copy(path.getPointAt((time * 0.065 + i * 0.035 + energy * (reduced ? 0.3 : 0.1)) % 1));
      agent.scale.setScalar(1 + energy * 0.6);
    });
  } };
}

export async function createSculpture(kind: SculptureKind): Promise<Sculpture> {
  if (kind === "violin") return (await import("./violin-asset")).loadViolin();
  return { flight, neural, learning }[kind]();
}
