# Story: Spring Boot Security Integration (Keycloak)

## 1. Story Context
**ID:** `0-2-spring-boot-security-integration`  
**Status:** `ready-for-dev`  
**Epic:** `Epic 1.2: Identity & Security`  
**As a:** Backend Developer  
**I want to:** Configurare Spring Security per proteggere le API del backend tramite Keycloak  
**So that:** Solo gli utenti autenticati con un token JWT valido possono interagire con il sistema.

---

## 2. Acceptance Criteria (BDD)

### Scenario 1: Protezione delle API
- **Given:** Un endpoint protetto (es. `/api/v1/chat`).
- **When:** Invio una richiesta senza Header Authorization.
- **Then:** Ricevo un errore `401 Unauthorized`.

### Scenario 2: Validazione JWT
- **Given:** Un JWT valido emesso dal Realm "ChatBot" di Keycloak.
- **When:** Invio una richiesta con l'Header `Authorization: Bearer <JWT>`.
- **Then:** La richiesta viene accettata e ricevo `200 OK`.

### Scenario 3: RBAC (Role-Based Access Control)
- **Given:** Un utente con ruolo `ROLE_USER`.
- **When:** Tenta di accedere a un endpoint riservato ad `ADMIN`.
- **Then:** Ricevo un errore `403 Forbidden`.

---

## 3. Developer Context & Guardrails

### Technical Requirements
- **Framework:** Spring Boot 3.4.3 + Spring Security + OAuth2 Resource Server.
- **Libreria:** `spring-boot-starter-oauth2-resource-server`.
- **Java:** 21 (WebFlux reattivo).

### Architecture Compliance
- Utilizzare **Spring Security Filter Chain** reattivo (`SecurityWebFilterChain`).
- Mappare i ruoli di Keycloak (solitamente in `realm_access.roles`) in `GrantedAuthority` di Spring Security (prefisso `ROLE_`).
- **Clean Code:** Configurazione centralizzata in una classe `SecurityConfig`.

### File Structure Requirements
- Modifica `backend/ChatBoot/src/main/java/it/peoplefirs/chatboot/config/SecurityConfig.java`.
- Aggiorna `application.properties` con `spring.security.oauth2.resourceserver.jwt.jwk-set-uri`.

---

## 4. Implementation Details (Lates Tech Info)
- **JWT Decoder:** Configurare il decoder per puntare all'endpoint di Keycloak (`/realms/ChatBot/protocol/openid-connect/certs`).
- **CORS:** Abilitare CORS per permettere le chiamate dal frontend (`localhost:5173`).

---

## 5. Story Completion Status
- [ ] SecurityWebFilterChain configured
- [ ] JWT Decoder functional
- [ ] Keycloak Roles to Authorities mapping complete
- [ ] CORS configured for Frontend
