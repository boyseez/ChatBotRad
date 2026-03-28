# Story: BFF-based Authentication Integration (React)

## 1. Story Context
**ID:** `0-3-react-bff-auth-integration`  
**Status:** `ready-for-dev`  
**Epic:** `Epic 1.2: Identity & Security`  
**As a:** Frontend Developer  
**I want to:** Integrare il frontend con il backend BFF (Spring Boot) per gestire l'autenticazione tramite cookie sicuri  
**So that:** I token non sono mai esposti nel browser e l'utente può accedere in sicurezza tramite Authorization Code Flow gestito dal backend.

---

## 2. Acceptance Criteria (BDD)

### Scenario 1: Verifica Stato Sessione
- **Given:** Un utente accede alla Dashboard.
- **When:** L'app carica per la prima volta.
- **Then:** Viene effettuata una chiamata GET a `/api/v1/auth/me` per recuperare i dati del profilo utente.

### Scenario 2: Reindirizzamento al Login (BFF)
- **Given:** Un utente non autenticato accede a una rotta protetta.
- **When:** La chiamata a `/api/v1/auth/me` restituisce `401 Unauthorized`.
- **Then:** L'utente viene reindirizzato all'endpoint del backend `/oauth2/authorization/keycloak` per iniziare il login.

### Scenario 3: Logout Sicuro
- **Given:** Un utente autenticato.
- **When:** Clicca sul pulsante di Logout.
- **Then:** Viene inviata una richiesta POST a `/api/v1/auth/logout` per terminare la sessione lato server e invalidare i cookie.

---

## 3. Developer Context & Guardrails

### Technical Requirements
- **Framework:** React 19 + TypeScript.
- **Session Management:** Cookie **HttpOnly**, **Secure**, **SameSite=Strict**.
- **Security:** Protezione CSRF tramite `X-XSRF-TOKEN`.

### Architecture Compliance
- **Nessuna libreria Keycloak-JS nel frontend.**
- Il frontend agisce come un client "stupido" rispetto all'auth: si limita a reagire agli stati 401.
- **Store:** Redux Toolkit per memorizzare il profilo utente una volta loggato.

### File Structure Requirements
- Aggiorna `frontend/src/store/slices/authSlice.ts`.
- Crea `frontend/src/features/auth/useBffAuth.ts` (custom hook).
- Modifica gli intercettori Axios per gestire il reindirizzamento al login su 401.

---

## 5. Story Completion Status
- [ ] Backend `/api/v1/auth/me` endpoint accessible
- [ ] Login redirect logic in Frontend functional
- [ ] User profile persisted in Redux (via Cookie session)
- [ ] Logout flow working through Backend
- [ ] CSRF token handling verified
