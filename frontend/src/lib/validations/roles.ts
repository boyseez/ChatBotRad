/**
 * Mappatura dei ruoli tecnici (Spring Security) verso etichette leggibili per l'utente.
 */
export const ROLE_LABELS: Record<string, string> = {
  ROLE_ADMIN: "Amministratore",
  ROLE_USER: "Dipendente",
  // Aggiungi qui altri ruoli in futuro (es. ROLE_MANAGER: "Responsabile")
};

/**
 * Ritorna l'etichetta leggibile del ruolo primario dell'utente.
 * Se il ruolo non è mappato, ritorna il nome del ruolo senza il prefisso ROLE_.
 */
export const getRoleLabel = (roles: string[] | undefined): string => {
  if (!roles || roles.length === 0) return "Ospite";
  
  // Diamo priorità ad ADMIN se l'utente ha più ruoli
  const primaryRole = roles.includes("ROLE_ADMIN") ? "ROLE_ADMIN" : roles[0];
  
  return ROLE_LABELS[primaryRole] || primaryRole.replace("ROLE_", "");
};
