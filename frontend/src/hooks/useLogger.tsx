import { useCallback, useRef, useEffect } from "react";

// ─── Tipi ────────────────────────────────────────────────────────────────────

export type LogLevel = "trace" | "debug" | "info" | "success" | "warn" | "error";

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  namespace: string;
  data?: unknown;
}

export interface LoggerOptions {
  minLevel?: LogLevel;
  enabled?: boolean;
}

export interface Logger {
  trace:   (message: string, data?: unknown) => void;
  debug:   (message: string, data?: unknown) => void;
  info:    (message: string, data?: unknown) => void;
  success: (message: string, data?: unknown) => void;
  warn:    (message: string, data?: unknown) => void;
  error:   (message: string, data?: unknown) => void;
  group:   (label: string, fn: () => void) => void;
  time:    (label: string) => () => void;
  history: () => LogEntry[];
  clear:   () => void;
}

// ─── Helper Interni ──────────────────────────────────────────────────────────

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  trace: 0, debug: 1, info: 2, success: 3, warn: 4, error: 5,
};

const LEVEL_STYLES: Record<LogLevel, { label: string; css: string }> = {
  trace:   { label: " TRACE ",   css: "background: #6b7280; color: white; border-radius: 2px; font-weight: bold" },
  debug:   { label: " DEBUG ",   css: "background: #06b6d4; color: black; border-radius: 2px; font-weight: bold" },
  info:    { label: " INFO  ",   css: "background: #3b82f6; color: white; border-radius: 2px; font-weight: bold" },
  success: { label: " SUCCESS",  css: "background: #10b981; color: black; border-radius: 2px; font-weight: bold" },
  warn:    { label: " WARN  ",  css: "background: #f59e0b; color: black; border-radius: 2px; font-weight: bold" },
  error:   { label: " ERROR ",   css: "background: #ef4444; color: white; border-radius: 2px; font-weight: bold" },
};

function formatTimestamp(): string {
  const now = new Date();
  return `[${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}.${String(now.getMilliseconds()).padStart(3, "0")}]`;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLogger(
  namespace: string = "App",
  options: LoggerOptions = {}
): Logger {
  // Diagnostica rapida: vediamo cosa legge Vite
  const rawViteLogLevel = import.meta.env.VITE_LOG_LEVEL;
  const rawViteEnabled = import.meta.env.VITE_LOG_ENABLED;

  const envMinLevel = (rawViteLogLevel as LogLevel) || "trace";
  const envEnabled  = rawViteEnabled !== "false";

  const { 
    minLevel = envMinLevel, 
    enabled = envEnabled 
  } = options;

  const historyRef = useRef<LogEntry[]>([]);

  // Debug interno all'avvio dell'hook (solo se namespace è 'Home' per non intasare)
  useEffect(() => {
    if (namespace === 'Home') {
      console.log('🔍 Logger Diagnostic:', {
        envFile_Level: rawViteLogLevel,
        envFile_Enabled: rawViteEnabled,
        resolvedMinLevel: minLevel,
        resolvedEnabled: enabled
      });
    }
  }, [namespace, rawViteLogLevel, rawViteEnabled, minLevel, enabled]);

  const log = useCallback(
    (level: LogLevel, message: string, data?: unknown): void => {
      if (!enabled) return;
      if (LEVEL_PRIORITY[level] < LEVEL_PRIORITY[minLevel]) return;

      const style = LEVEL_STYLES[level];
      const ts = formatTimestamp();
      
      const consoleFn =
        level === "error" ? console.error
        : level === "warn"  ? console.warn
        : level === "trace" || level === "debug" ? console.debug
        : console.log;

      const args = [
        `%c${ts}%c ${style.label} %c[${namespace}] %c${message}`,
        "color: gray; font-size: 10px;",
        style.css,
        "color: #d946ef; font-weight: bold;",
        "",
      ];

      if (data !== undefined && data !== null) {
        consoleFn(...args, data);
      } else {
        consoleFn(...args);
      }

      historyRef.current.push({
        level,
        message,
        timestamp: new Date().toISOString(),
        namespace,
        data,
      });
    },
    [namespace, minLevel, enabled]
  );

  const group = useCallback(
    (label: string, fn: () => void): void => {
      console.group(`%c▶ ${label}`, "color: #d946ef; font-weight: bold;");
      try { fn(); } finally { console.groupEnd(); }
    },
    []
  );

  const time = useCallback(
    (label: string): (() => void) => {
      const start = performance.now();
      log("debug", `⏱ Timer avviato: ${label}`);
      return () => {
        const elapsed = (performance.now() - start).toFixed(2);
        log("info", `⏱ Timer "${label}" terminato`, { elapsedMs: Number(elapsed) });
      };
    },
    [log]
  );

  const history = useCallback((): LogEntry[] => [...historyRef.current], []);

  const clear = useCallback((): void => {
    historyRef.current = [];
    console.clear();
    log("info", "Console pulita");
  }, [log]);

  return {
    trace:   useCallback((msg, data) => log("trace",   msg, data), [log]),
    debug:   useCallback((msg, data) => log("debug",   msg, data), [log]),
    info:    useCallback((msg, data) => log("info",    msg, data), [log]),
    success: useCallback((msg, data) => log("success", msg, data), [log]),
    warn:    useCallback((msg, data) => log("warn",    msg, data), [log]),
    error:   useCallback((msg, data) => log("error",   msg, data), [log]),
    group,
    time,
    history,
    clear,
  };
}
