// src/types/epKeys.ts
const r = () => Math.random().toString(36).slice(2, 8);
const ts = () => new Date().toISOString().replace(/[-:.TZ]/g, "");

export const epNewE = () => `E_${ts()}_${r()}`;
export const epNewB = () => `B_${r()}_${r()}`;
export const epNewP = () => `P_${r()}_${r()}`;
export const epNewL = () => `L_${r()}_${r()}`;
