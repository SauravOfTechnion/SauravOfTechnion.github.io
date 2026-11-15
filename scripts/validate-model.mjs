import { readFile } from "node:fs/promises";

const bytes = await readFile(new URL("../public/models/violin.glb", import.meta.url));
if (bytes.toString("ascii", 0, 4) !== "glTF" || bytes.readUInt32LE(4) !== 2 || bytes.readUInt32LE(8) !== bytes.length) throw new Error("Invalid violin GLB");
const jsonLength = bytes.readUInt32LE(12);
const model = JSON.parse(bytes.toString("utf8", 20, 20 + jsonLength));
if (model.buffers.some((buffer) => buffer.uri)) throw new Error("Model must embed geometry");
if (model.images.length < 2 || model.images.some((image) => image.uri)) throw new Error("Model must embed spruce and maple textures");
if (!model.meshes.length || !model.materials.length) throw new Error("Missing meshes or materials");
const triangles = model.meshes.flatMap((mesh) => mesh.primitives).reduce((sum, primitive) => sum + (model.accessors[primitive.indices]?.count ?? 0) / 3, 0);
for (const name of ["Carved spruce soundboard", "Arched two-piece maple back", "Cambered tapered ebony fingerboard", "Carved maple bridge"]) {
  const node = model.nodes.find((node) => node.name === name);
  if (!node || typeof node.mesh !== "number" || !model.meshes[node.mesh].primitives.length) throw new Error(`Missing instrument geometry: ${name}`);
}
console.log(JSON.stringify({ bytes: bytes.length, meshes: model.meshes.length, triangles, embeddedTextures: model.images.length, materials: model.materials.length }));
