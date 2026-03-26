# Story: Setup Infrastruttura Keycloak (Priority 0)

## 1. Story Context
**ID:** `0-1-keycloak-infrastructure-setup`  
**Status:** `ready-for-dev`  
**Epic:** `Epic 1.2: Identity & Security` (Priorità Architetturale 0)  
**As a:** DevOps / System Architect  
**I want to:** Configurare e alzare l'istanza di Keycloak con il suo database PostgreSQL tramite Docker Compose  
**So that:** Posso avere un Identity Provider centralizzato per gestire l'autenticazione del Backend e del Frontend.

---

## 2. Acceptance Criteria (BDD)

### Scenario 1: Keycloak e Postgres DB sono operativi
- **Given:** Il file `docker-compose.yml` e le definizioni in `docker/services/`.
- **When:** Eseguo `docker compose up -d keycloak keycloak-db`.
- **Then:** Entrambi i container sono nello stato `healthy` e Keycloak è accessibile su `http://localhost:8080`.

### Scenario 2: Realm e Client OIDC configurati
- **Given:** Keycloak attivo.
- **When:** Accedo alla console admin e configuro il Realm "ChatBot".
- **Then:** Deve esistere un Client `chatbot-backend` (Confidential) e un Client `chatbot-frontend` (Public).

### Scenario 3: Gestione Utenti e Ruoli
- **Given:** Il Realm "ChatBot".
- **When:** Creo un utente di test e definisco i ruoli `ROLE_USER` e `ROLE_ADMIN`.
- **Then:** L'utente deve poter effettuare il login e ricevere un JWT contenente i ruoli mappati.

---

## 3. Developer Context & Guardrails

### Technical Requirements
- **Keycloak Version:** 26.0+ (Quarkus-based).
- **Database:** PostgreSQL 16+.
- **Protocol:** OIDC (OpenID Connect).
- **Network:** I servizi devono essere nella rete Docker `cbr_network`.

### Architecture Compliance
- Seguire la struttura modulare `docker/services/` indicata nel Solution Design.
- Utilizzare variabili d'ambiente nel file `.env` per segreti (admin password, DB password).
- **Clean Code:** Configurazione YAML ordinata e commentata.

### File Structure Requirements
- Crea/Aggiorna `docker/services/keycloak.yml`.
- Crea/Aggiorna `docker/services/keycloak-db.yml`.
- Aggiorna `docker-compose.yml` per includere i nuovi file.
- Aggiorna `.env` con le nuove variabili.

---

## 4. Implementation Details

### Keycloak Config Details
- **Realm Name:** `ChatBot`
- **Frontend Client:** `chatbot-frontend` (Access Type: Public, Redirect URIs: `http://localhost:5173/*`)
- **Backend Client:** `chatbot-backend` (Access Type: Confidential, Service Accounts Enabled).

### Environment Variables
```env
# Keycloak
KC_DB=postgres
KC_DB_URL=jdbc:postgresql://keycloak-db:5432/keycloak
KC_DB_USERNAME=keycloak
KC_DB_PASSWORD=secret
KC_HOSTNAME=localhost
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=admin
```

---

## 5. Story Completion Status
- [x] Docker Services created
- [x] Keycloak & DB healthy
- [x] Realm "ChatBot" initialized
- [x] Clients OIDC configured
- [x] Test User created
