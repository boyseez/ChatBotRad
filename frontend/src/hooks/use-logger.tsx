import React, { useCallback, useRef } from "react";

/**
 * Livelli disponibili per il logger, in ordine crescente di severità.
 *
 * - `trace` – Dettagli molto granulari, utili solo in fase di sviluppo profondo.
 * - `debug` – Informazioni di debug, variabili intermedie, stati interni.
 * - `info`  – Messaggi informativi generali sul flusso dell'applicazione.
 * - `success` – Conferma che un'operazione è andata a buon fine.
 * - `warn`  – Situazioni anomale ma non bloccanti.
 * - `error` – Errori che compromettono il corretto funzionamento.
 */
export type LogLevel =
    | "trace"
    | "debug"
    | "info"
    | "success"
    | "warn"
    | "error";

/**
 * Rappresenta una singola entry di log salvata nello storico interno.
 */
export interface LogEntry {
  /** Livello di severità del log. */
  level: LogLevel;

  /** Testo del messaggio registrato. */
  message: string;

  /**
   * Timestamp ISO 8601 del momento in cui il log è stato registrato.
   * @example "2024-06-15T10:30:00.123Z"
   */
  timestamp: string;

  /** Namespace del logger che ha prodotto l'entry. */
  namespace: string;

  /** Dati aggiuntivi opzionali allegati al log (oggetti, array, primitive, ecc.). */
  data?: unknown;
}

/**
 * Opzioni di configurazione del logger.
 * Possono essere fornite direttamente all'hook oppure ereditate dalle
 * variabili d'ambiente Vite (`VITE_LOG_LEVEL`, `VITE_LOG_ENABLED`).
 */
export interface LoggerOptions {
  /**
   * Livello minimo da loggare. I messaggi con priorità inferiore vengono
   * silenziosamente ignorati.
   * @default valore di `VITE_LOG_LEVEL`, oppure `"trace"` se non definito
   */
  minLevel?: LogLevel;

  /**
   * Abilita o disabilita completamente il logger.
   * Quando `false`, nessun messaggio viene stampato né salvato nello storico.
   * @default `true` (oppure `false` se `VITE_LOG_ENABLED === "false"`)
   */
  enabled?: boolean;
}

/**
 * Interfaccia pubblica restituita dall'hook `useLogger`.
 * Espone metodi di logging per ogni livello, utilità di raggruppamento e
 * misurazione delle performance, e accesso allo storico dei log.
 */
export interface Logger {
  /**
   * Registra un messaggio al livello `trace`.
   * Usato per dettagli molto granulari, raramente necessari in produzione.
   *
   * @param message - Testo descrittivo del messaggio.
   * @param data    - Dati opzionali da allegare (oggetti, valori, ecc.).
   */
  trace: (message: string, data?: unknown) => void;

  /**
   * Registra un messaggio al livello `debug`.
   * Adatto per valori di variabili, stati interni e informazioni di sviluppo.
   *
   * @param message - Testo descrittivo del messaggio.
   * @param data    - Dati opzionali da allegare.
   */
  debug: (message: string, data?: unknown) => void;

  /**
   * Registra un messaggio al livello `info`.
   * Usato per descrivere il normale flusso dell'applicazione.
   *
   * @param message - Testo descrittivo del messaggio.
   * @param data    - Dati opzionali da allegare.
   */
  info: (message: string, data?: unknown) => void;

  /**
   * Registra un messaggio al livello `success`.
   * Indica il completamento positivo di un'operazione significativa.
   *
   * @param message - Testo descrittivo del messaggio.
   * @param data    - Dati opzionali da allegare.
   */
  success: (message: string, data?: unknown) => void;

  /**
   * Registra un messaggio al livello `warn`.
   * Segnala situazioni anomale o potenzialmente problematiche che non
   * bloccano il flusso applicativo.
   *
   * @param message - Testo descrittivo del messaggio.
   * @param data    - Dati opzionali da allegare.
   */
  warn: (message: string, data?: unknown) => void;

  /**
   * Registra un messaggio al livello `error`.
   * Usato per errori che compromettono il corretto funzionamento di una
   * funzionalità o dell'intera applicazione.
   *
   * @param message - Testo descrittivo del messaggio.
   * @param data    - Dati opzionali da allegare (es. oggetto `Error`, risposta HTTP, ecc.).
   */
  error: (message: string, data?: unknown) => void;

  /**
   * Raggruppa una serie di log in un gruppo collassabile nella console del browser.
   * Utile per correlare logicamente più messaggi in una singola operazione composita.
   *
   * @param label - Etichetta visualizzata come intestazione del gruppo.
   * @param fn    - Funzione che contiene le chiamate di log da raggruppare.
   *
   * @example
   * logger.group("Inizializzazione store", () => {
   *   logger.debug("Caricamento stato iniziale");
   *   logger.info("Store pronto");
   * });
   */
  group: (label: string, fn: () => void) => void;

  /**
   * Avvia un timer di performance identificato da un'etichetta.
   * Restituisce una funzione `stop` che, quando invocata, stampa il tempo
   * trascorso in millisecondi.
   *
   * @param label - Nome identificativo del timer (es. `"fetch-users"`).
   * @returns Funzione `stop` da chiamare al termine dell'operazione da misurare.
   *
   * @example
   * const stop = logger.time("caricamento-dati");
   * await fetchData();
   * stop(); // → ⏱ Timer "caricamento-dati" terminato { elapsedMs: 123.45 }
   */
  time: (label: string) => () => void;

  /**
   * Restituisce una copia immutabile dello storico di tutti i log registrati
   * nella sessione corrente del componente.
   * Utile per ispezione, esportazione o test.
   *
   * @returns Array di {@link LogEntry} in ordine cronologico.
   *
   * @example
   * const entries = logger.history();
   * console.table(entries);
   */
  history: () => LogEntry[];

  /**
   * Svuota lo storico interno e chiama `console.clear()` per pulire la console
   * del browser. Registra automaticamente un messaggio `info` di conferma.
   *
   * @example
   * logger.clear(); // → [INFO] Console pulita
   */
  clear: () => void;
}

/**
 * Mappa delle priorità numeriche associate a ciascun livello di log.
 * Usata internamente per filtrare i messaggi al di sotto di `minLevel`.
 */
const LEVEL_PRIORITY: Record<LogLevel, number> = {
  trace: 0,
  debug: 1,
  info: 2,
  success: 3,
  warn: 4,
  error: 5,
};

/**
 * Configurazione visiva (etichetta e stile CSS) per ogni livello di log.
 * Applicata tramite le direttive `%c` di `console.log`.
 */
const LEVEL_STYLES: Record<LogLevel, { label: string; css: string }> = {
  trace:   { label: " TRACE  ", css: "background: #6b7280; color: white; border-radius: 2px; font-weight: bold" },
  debug:   { label: " DEBUG  ", css: "background: #06b6d4; color: black; border-radius: 2px; font-weight: bold" },
  info:    { label: " INFO   ", css: "background: #3b82f6; color: white; border-radius: 2px; font-weight: bold" },
  success: { label: " SUCCESS", css: "background: #10b981; color: black; border-radius: 2px; font-weight: bold" },
  warn:    { label: " WARN   ", css: "background: #f59e0b; color: black; border-radius: 2px; font-weight: bold" },
  error:   { label: " ERROR  ", css: "background: #ef4444; color: white; border-radius: 2px; font-weight: bold" },
};

/**
 * Genera una stringa timestamp leggibile nel formato `[HH:mm:ss.ms]`.
 *
 * @returns Stringa formattata, es. `[14:05:03.042]`.
 */
function formatTimestamp(): string {
  const now = new Date();
  return `[${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}.${String(now.getMilliseconds()).padStart(3, "0")}]`;
}

/**
 * Hook React per il logging avanzato e strutturato in console.
 *
 * ### Funzionalità
 * - **Livelli di log** – `trace`, `debug`, `info`, `success`, `warn`, `error`
 *   con filtraggio per severità minima.
 * - **Namespace** – ogni messaggio è etichettato con il contesto di provenienza.
 * - **Storico interno** – tutti i log vengono salvati in memoria e accessibili
 *   via `logger.history()`.
 * - **Grouping** – raggruppa log correlati in blocchi collassabili nella console.
 * - **Timer** – misura il tempo di esecuzione di operazioni asincrone o sincrone.
 * - **Configurazione via env** – `VITE_LOG_LEVEL` e `VITE_LOG_ENABLED` permettono
 *   di controllare il comportamento senza modificare il codice.
 *
 * ### Variabili d'ambiente supportate (Vite)
 * | Variabile          | Tipo      | Default   | Descrizione                              |
 * |--------------------|-----------|-----------|------------------------------------------|
 * | `VITE_LOG_LEVEL`   | `LogLevel`| `"trace"` | Livello minimo loggato globalmente.      |
 * | `VITE_LOG_ENABLED` | `string`  | `"true"`  | Imposta `"false"` per disabilitare tutto.|
 *
 * @param namespace - Etichetta del contesto di utilizzo (default: `"App"`).
 *                    Viene visualizzata in ogni riga di log.
 * @param options   - Configurazione opzionale che sovrascrive i valori env.
 * @returns Oggetto {@link Logger} con tutti i metodi di logging.
 *
 * @example
 * // Utilizzo base
 * const logger = useLogger("UserProfile");
 * logger.info("Componente montato");
 * logger.debug("Props ricevute", { userId: 42 });
 *
 * @example
 * // Con configurazione esplicita
 * const logger = useLogger("Checkout", { minLevel: "warn", enabled: true });
 * logger.warn("Carrello vuoto");
 * logger.error("Pagamento fallito", new Error("Timeout"));
 *
 * @example
 * // Timer di performance
 * const stop = logger.time("fetch-ordini");
 * await loadOrders();
 * stop(); // stampa il tempo trascorso
 *
 * @example
 * // Gruppo di log correlati
 * logger.group("Sincronizzazione dati", () => {
 *   logger.debug("Inizio sync");
 *   logger.success("Sync completata");
 * });
 *
 * @example
 * // Accesso allo storico
 * const entries = logger.history();
 * const errors = entries.filter(e => e.level === "error");
 */
export function useLogger(namespace: string = "App", options: LoggerOptions = {}): Logger {
  const rawViteLogLevel = import.meta.env.VITE_LOG_LEVEL;
  const rawViteEnabled = import.meta.env.VITE_LOG_ENABLED;

  const envMinLevel = (rawViteLogLevel as LogLevel) || "trace";
  const envEnabled = rawViteEnabled !== "false";

  const { minLevel = envMinLevel, enabled = envEnabled } = options;

  const historyRef = useRef<LogEntry[]>([]);

  /**
   * Funzione interna di logging: verifica i filtri, formatta il messaggio
   * con stili CSS e lo invia alla funzione `console` appropriata,
   * salvando l'entry nello storico.
   */
  const log = useCallback(
      (level: LogLevel, message: string, data?: unknown): void => {
        if (!enabled) return;
        if (LEVEL_PRIORITY[level] < LEVEL_PRIORITY[minLevel]) return;

        const style = LEVEL_STYLES[level];
        const ts = formatTimestamp();

        const consoleFn =
            level === "error"
                ? console.error
                : level === "warn"
                    ? console.warn
                    : level === "trace" || level === "debug"
                        ? console.debug
                        : console.log;

        const args = [
          `%c${ts}%c ${style.label} %c[${namespace}] %c${message}`,
          "color: gray; font-size: 10px;",
          style.css,
          "color: #d946ef; font-weight: bold;",
          "",
        ];

        if (data !== undefined && data !== null) consoleFn(...args, data);
        else consoleFn(...args);

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

  const group = useCallback((label: string, fn: () => void): void => {
    console.group(`%c▶ ${label}`, "color: #d946ef; font-weight: bold;");
    try { fn(); } finally { console.groupEnd(); }
  }, []);

  const time = useCallback((label: string): (() => void) => {
    const start = performance.now();
    log("debug", `⏱ Timer avviato: ${label}`);
    return () => {
      const elapsed = (performance.now() - start).toFixed(2);
      log("info", `⏱ Timer "${label}" terminato`, { elapsedMs: Number(elapsed) });
    };
  }, [log]);

  const history = useCallback((): LogEntry[] => [...historyRef.current], []);

  const clear = useCallback((): void => {
    historyRef.current = [];
    console.clear();
    log("info", "Console pulita");
  }, [log]);

  return React.useMemo(() => ({
    trace:   (m: string, d?: unknown) => log("trace",   m, d),
    debug:   (m: string, d?: unknown) => log("debug",   m, d),
    info:    (m: string, d?: unknown) => log("info",    m, d),
    success: (m: string, d?: unknown) => log("success", m, d),
    warn:    (m: string, d?: unknown) => log("warn",    m, d),
    error:   (m: string, d?: unknown) => log("error",   m, d),
    group,
    time,
    history,
    clear,
  }), [log, group, time, history, clear]);
  }