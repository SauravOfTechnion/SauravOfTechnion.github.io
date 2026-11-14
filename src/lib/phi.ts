/** Golden ratio design constants (φ = 1.6180339887…) */
export const PHI = 1.6180339887;
export const PHI_INV = 1 / PHI; // ≈ 0.618

/** Base unit: 16px. Scale: 16, 26, 42, 68, 110 */
export const PHI_SPACE = {
  xs: 10, // 16 / φ
  sm: 16,
  md: 26, // 16 * φ
  lg: 42, // 16 * φ²
  xl: 68, // 16 * φ³
  "2xl": 110, // 16 * φ⁴
} as const;

/** Modular type scale: body 1rem × φⁿ */
export const PHI_TYPE = {
  xs: `${PHI_INV ** 2}rem`, // ~0.382
  sm: `${PHI_INV}rem`, // ~0.618
  base: "1rem",
  md: `${PHI}rem`, // ~1.618
  lg: `${PHI ** 2}rem`, // ~2.618
  xl: `${PHI ** 3}rem`, // ~4.236
} as const;

export const PHI_SPLIT = {
  major: `${PHI_INV * 100}%`, // 61.8%
  minor: `${(1 - PHI_INV) * 100}%`, // 38.2%
} as const;

export const ASPECT_PHI = "1.618 / 1";
