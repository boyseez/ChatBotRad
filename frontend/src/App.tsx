import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import Home from "@/Home.tsx";
import LoginPage from "@/page/login-page.tsx";
import DashboardPage from "./page/dashboard-page";
import { useLogger } from "@/util/useLogger";
import { useEffect } from "react";

export function App() {
  const logger = useLogger("App");

  useEffect(() => {
    // ─── Livelli di Log ───────────────────────────────────────────────────
    logger.trace("Dettaglio granulare (es. variabili interne)");
    logger.debug("Informazioni di debug per lo sviluppo");
    logger.info("Messaggio informativo generale");
    logger.success("Operazione completata con successo!");
    logger.warn("Avvertimento: qualcosa non è ottimale");
    logger.error("Errore critico rilevato", { error: "Dettaglio errore" });

    // ─── Utility ──────────────────────────────────────────────────────────

    // 1. Gruppi (Raggruppa i log nella console del browser)
    logger.group("Inizializzazione Moduli", () => {
      logger.debug("Modulo A caricato");
      logger.debug("Modulo B caricato");
    });

    // 2. Timer (Misura quanto tempo impiega un blocco di codice)
    const stopTimer = logger.time("Richiesta API");
    setTimeout(() => {
      stopTimer(); // Stampa il tempo trascorso
    }, 200);

    // 3. History e Clear
    console.log("Storico log finora:", logger.history());
    // logger.clear(); // Pulisce la console e lo storico se necessario

  }, [logger]);

  return (

      <BrowserRouter>
 <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/login">login</Link> |{" "}
        <Link to="/dashboard">Dashboard</Link>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
      </BrowserRouter>
  )
}

export default App
