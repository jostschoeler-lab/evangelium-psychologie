Rollback auf ab48243 – bestätigt


# Not-Bedürfnis-Jesus – Modularer App-Prototyp

Startergerüst (React + Vite + TypeScript + i18n) mit einfachem Sprach-Switcher (DE/EN/NO) und Basis-Struktur für spätere Module (Bibel, Psychologie, Crosslinks).

**Live:** https://evangelium-psychologie.vercel.app

---

## Inhalt

- ✅ React + Vite + TypeScript
- ✅ i18n (einfache, lokale Lösung via `src/i18n/index.ts`)
- ✅ Deploy über Vercel (Auto-Deploy bei Commits auf `main`)
- 🧱 Nächster Schritt: Unified-Editor (Bibel + Psychologie + Crosslink) als ein Formular

---

## Schnellstart (lokal)

**Voraussetzung:** Node.js ≥ 18 (empfohlen: 20 LTS) und npm.

```bash
# 1) Abhängigkeiten installieren
npm install

# 2) Dev-Server starten
npm run dev
# → öffne http://localhost:5173

# 3) Produktion bauen
npm run build

# 4) Build lokal ansehen
npm run preview
# → öffne die ausgegebene URL (z. B. http://localhost:4173)
