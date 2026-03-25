# Story: React Keycloak Auth Integration

## 1. Story Context
**ID:** `0-3-react-keycloak-auth-integration`  
**Status:** `ready-for-dev`  
**Epic:** `Epic 1.2: Identity & Security`  
**As a:** Frontend Developer  
**I want to:** Implementare il flusso di autenticazione OIDC nel frontend React tramite Keycloak  
**So that:** Gli utenti possono accedere in sicurezza al chatbot e gestire le proprie sessioni.

---

## 2. Acceptance Criteria (BDD)

### Scenario 1: Redirect al Login
- **Given:** Un utente non autenticato accede alla Dashboard.
- **When:** La sessione non è presente.
- **Then:** Viene reindirizzato automaticamente alla pagina di login di Keycloak.

### Scenario 2: Gestione Sessione
- **Given:** Un utente autenticato.
- **When:** Ricarica la pagina.
- **Then:** La sessione persiste e il token JWT è disponibile nello store (Redux Toolkit).

### Scenario 3: Logout
- **Given:** Un utente autenticato.
- **When:** Clicca sul pulsante di Logout.
- **Then:** Viene disconnesso da Keycloak e reindirizzato alla Home.

---

## 3. Developer Context & Guardrails

### Technical Requirements
- **Framework:** React 19 + TypeScript.
- **Libreria:** `keycloak-js`.
- **Store:** Redux Toolkit per la persistenza del profilo utente.

### Architecture Compliance
- Utilizzare un **Auth Provider** (Context API) per iniettare l'istanza di Keycloak.
- Integrare il token JWT in tutte le chiamate Axios/Fetch verso il backend tramite intercettori.
- **Clean Code:** Gestione errori di autenticazione centralizzata.

### File Structure Requirements
- Crea `frontend/src/features/auth/AuthContext.tsx`.
- Crea `frontend/src/features/auth/hooks/useAuth.ts`.
- Aggiorna `frontend/src/store/slices/authSlice.ts`.

---

## 5. Story Completion Status
- [ ] Keycloak JS initialized
- [ ] Auth Provider implemented
- [ ] Token injection in API client functional
- [ ] Login/Logout flow working
- [ ] User profile in Redux store
