// Dev-only: forward browser console logs to Vite server console
if (import.meta.env.DEV && import.meta.hot) {
  const levels = ["log", "info", "warn", "error"] as const;

  const safe = (v: unknown): string => {
    if (typeof v === "string") return v;
    try {
      return JSON.stringify(v);
    } catch {
      try {
        return String(v);
      } catch {
        return "[Unserializable]";
      }
    }
  };

  levels.forEach((level) => {
    const orig = console[level].bind(console) as (...a: any[]) => void;
    console[level] = ((...args: any[]) => {
      try {
        import.meta.hot!.send("console", { level, args: args.map(safe) });
      } catch {
        // ignore relay errors
      }
      orig(...args);
    }) as any;
  });
}
