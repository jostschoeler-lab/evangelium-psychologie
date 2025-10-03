// src/types.ts
export type Visibility = "draft" | "public";

export type UnifiedEntry = {
  bibleRef: string;
  bibleView: string;
  psychTerm: string;
  bridgeText: string;
  tags: string[];
  visibility: Visibility;
  note: string;
};
