export type EpSichtbarkeit = "Entwurf" | "öffentlich" | "lokal";

export interface EpMeta {
  createdAt: string;  // ISO
  updatedAt: string;  // ISO
  version: number;    // Schema-Version Phase 1 = 1
}

export interface EpBibelstelle {
  id: string;         // "B_*"
  ref: string;        // z.B. "Johannes 3,16"
  theologischeAuslegung: string;
  theologischeHintergruende?: string; // optional, lang
}

export interface EpPsychologie {
  id: string;         // "P_*"
  begriff: string;    // z.B. "Bindung"
  erklaerungKurz: string;
  psychologischeHintergruende?: string; // optional, lang
}

export interface EpBruecke {
  id: string;         // "L_*"
  text: string;       // der eigentliche Brückentext
  tags: string[];
}

export interface EpEintrag {
  id: string;                   // "E_*"
  bibelstelle: EpBibelstelle;
  psychologie: EpPsychologie;
  bruecke: EpBruecke;
  sichtbarkeit: EpSichtbarkeit;
  notiz: string;
  meta: EpMeta;
}

export type EpEintraege = EpEintrag[];
