import * as T from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

/** Original Blender model; geometry and PBR wood images ship in one local GLB. */
export async function loadViolin() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const url = `${base}/models/violin.glb`;
  const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`Violin asset: ${response.status}`);
  const gltf = await new GLTFLoader().parseAsync(await response.arrayBuffer(), `${base}/models/`);
  const root = new T.Group();
  const model = gltf.scene;
  const bounds = new T.Box3().setFromObject(model);
  const size = bounds.getSize(new T.Vector3());
  const center = bounds.getCenter(new T.Vector3());
  model.position.sub(center);
  const wrapper = new T.Group(); wrapper.add(model);
  wrapper.scale.setScalar(4.6 / Math.max(size.x, size.y, size.z));
  // The authored export is Y-up, with the soundboard facing +Z.
  const presentation = new T.Group(); presentation.add(wrapper);
  presentation.rotation.set(-0.08, -0.18, 0.12);
  root.add(presentation);
  let bow: T.Object3D | undefined;
  model.traverse((object) => {
    if (/Bow.assembly/i.test(object.name)) bow = object;
    const mesh = object as T.Mesh;
    if (!mesh.isMesh) return;
    for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
      if (material instanceof T.MeshStandardMaterial && material.map) material.map.anisotropy = 4;
    }
  });
  const bowStart = bow?.position.clone();
  return { root, update(time: number, energy: number, reduced: boolean) {
    presentation.rotation.y = -0.18 + (reduced ? energy * 0.15 : Math.sin(time * 0.2) * 0.035);
    if (bow && bowStart) bow.position.x = bowStart.x + (reduced ? energy * 5 : Math.sin(time * 6) * energy * 12);
  } };
}
