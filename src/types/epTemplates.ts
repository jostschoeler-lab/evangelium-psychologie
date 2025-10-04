import { EpEintrag } from "./epTypes";
import { epNewE, epNewB, epNewP, epNewL } from "./epKeys";
export const epNewEintrag = (): EpEintrag => ({
  id: epNewE(),
  bibelstelle: {
    id: epNewB(),
    ref: "",
    theologischeAuslegung: "",
    theologischeHintergruende: ""
  },
  psychologie: {
    id: epNewP(),
    begriff: "",
    erklaerungKurz: "",
    psychologischeHintergruende: ""
  },
  bruecke: {
    id: epNewL(),
    text: "",
    tags: []
  },
  sichtbarkeit: "Entwurf",
  notiz: "",
  meta: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), version: 1 }
});
