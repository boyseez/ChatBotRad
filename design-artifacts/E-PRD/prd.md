# Product Requirements Document (PRD): Sistema RAG Multimodale

## 1. Executive Summary
**Project Name:** Sistema RAG Multimodale per Chatbot Personalizzato.
**Vision:** Fornire ai dipendenti un supporto decisionale e procedurale istantaneo basato su manuali tecnici (PDF) e video di formazione (YouTube/Locali).
**Core Value:** Tracciabilità 1:1 tra risposta e fonte originale (Retrieval-Only RAG) tramite Cheshire Cat AI per garantire zero allucinazioni e massima affidabilità.

## 2. Goals & Success Metrics
*   **G1: Accuratezza Assoluta:** Ogni risposta generata deve essere estratta direttamente dai manuali validati.
*   **G2: Tracciabilità Totale:** Ogni risposta deve includere metadati sulla fonte (pagina PDF o timestamp video).
*   **G3: Autenticazione Enterprise:** Accesso sicuro e centralizzato tramite Keycloak.
*   **Metrics (KPI):**
    *   Latenza risposta < 2 secondi.
    *   Accuratezza test set > 95% (risposte corrette vs "Non so").
    *   Integrazione Keycloak funzionante con RBAC (Role-Based Access Control).

## 3. Target Users & Context
*   **Dipendenti Operativi:** Utenti Salesforce/SAP che necessitano di istruzioni "just-in-time".
*   **Knowledge Admins:** Esperti che caricano e taggano i manuali.
*   **IT Admins:** Gestione identità e permessi tramite Keycloak.

## 4. Functional Requirements (FR)
| ID | Requirement | Description |
|---|---|---|
| **FR1** | **Multimodal Engine** | Integrazione con Cheshire Cat AI per chunking di PDF e video. |
| **FR2** | **Source Attribution** | Ogni risposta riporta link a fonte tramite i metadati del Cat. |
| **FR3** | **Zero-Hallucination** | Validazione stringente dei chunk estratti dal Vector DB. |
| **FR4** | **Identity Management** | Single Sign-On (SSO) e gestione sessioni tramite Keycloak. |
| **FR5** | **UI/UX Chatbot** | Web interface + Chrome Plugin con embedding video inline. |
| **FR6** | **History & Logs** | Audit trail completo memorizzato su MongoDB. |

## 5. Non-Functional Requirements (NFR)
| ID | Requirement | Description |
|---|---|---|
| **NFR1** | **Performance** | Spring Boot WebFlux per gestire stream asincroni e alta concurrency. |
| **NFR2** | **Security** | Comunicazione sicura tramite token JWT validati da Keycloak. |
| **NFR3** | **Scalability** | Architettura a microservizi dockerizzata (Spring Boot, Cat, Qdrant). |
| **NFR4** | **Storage** | Persistenza documentale su MongoDB e Vector storage su Qdrant. |

## 6. Technical Architecture & Stack
*   **Frontend:** React 19 / TypeScript / Tailwind 4.
*   **Backend Orchestrator:** Spring Boot 3.4 (Java 21) WebFlux.
    *   *Ruolo:* Gateway tra Frontend e Cheshire Cat AI.
    *   *Auth:* Gestione sicurezza e integrazione con **Keycloak**.
    *   *Data:* Persistenza metadati e log su **MongoDB**.
*   **RAG Engine:** Cheshire Cat AI (connesso via WebSocket/REST al Backend).
*   **Vector DB:** Qdrant (gestito dal Cat).
*   **Deployment:** Docker Compose (Stack completo: Frontend, Backend, Keycloak, MongoDB, Cheshire Cat, Qdrant).

## 7. Roadmap (V1 MVP)
*   **Sprint 1: Foundation** (Docker Stack, Qdrant, Cheshire Cat Basic Setup).
*   **Sprint 2: Auth & Security** (Integrazione Keycloak su Spring Boot e React).
*   **Sprint 3: RAG Implementation** (Upload PDF/Video, Chunking, Retrieval API).
*   **Sprint 4: UI & Plugin** (Web Dashboard finale e prototipo Chrome Extension).

## 8. Risks & Mitigations
*   **Rischio:** Complessità integrazione Keycloak/Spring Security.
    *   **Mitigazione:** Uso di Spring Boot Starter OAuth2 Resource Server.
*   **Rischio:** Disallineamento tra Cat e Backend.
    *   **Mitigazione:** Definizione di API contract chiare tramite OpenAPI/Swagger.

---
**Status:** Aggiornato (Versione 1.1 - Stack Reale + Keycloak)
**Data:** 25 Marzo 2026
