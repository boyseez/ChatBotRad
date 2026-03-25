---
project_name: "ChatBot"
status: "Completed"
version: "1.0"
stepsCompleted: [1, 2, 3, 4, 5, 6, 7]
created_date: "2026-03-25"
inputDocuments:
  - "design-artifacts/E-PRD/prd.md"
  - "_bmad-output/planning-artifacts/epics.md"
  - "_bmad-output/planning-artifacts/project-context.md"
---

# Solution Design: Sistema RAG Multimodale per Chatbot

## 1. Executive Summary
Documento di architettura tecnica per il sistema RAG multimodale focalizzato su tracciabilità 1:1 e zero allucinazioni. Il sistema integra Cheshire Cat AI per il recupero delle informazioni e Spring Boot come orchestratore sicuro.

## 2. Architectural Vision
**Core Principle:** Retrieval-Only RAG. Nessuna risposta viene generata senza una fonte verificabile (PDF o Video).
**Stack Strategy:** Microservizi dockerizzati, comunicazione reattiva (WebFlux), identità centralizzata (Keycloak).

## 3. Technology Stack Summary
- **Frontend:** React 19, TypeScript, Tailwind 4, Shadcn UI.
- **Backend:** Spring Boot 3.4.3 (Java 21), WebFlux.
- **RAG Engine:** Cheshire Cat AI.
- **Identity:** Keycloak (OIDC).
- **Persistence:** MongoDB Reactive (Meta/Logs) + Qdrant (Vectors).

## 4. Project Context Analysis

### Requirements Overview

**Functional Requirements:**
Focus su estrazione multimodale (PDF/Video), tracciabilità della fonte e integrazione sicura. Il sistema funge da ponte tra la conoscenza aziendale (manuali) e l'operatività (Salesforce/SAP).

**Non-Functional Requirements:**
Latenza < 2s, 99% uptime (fallback cloud), sicurezza via JWT/Keycloak, scalabilità tramite Docker.

**Scale & Complexity:**
- Primary domain: AI-Driven Enterprise Support (RAG)
- Complexity level: Medium-High
- Estimated architectural components: 6 (Frontend, Spring Gateway, Keycloak, Cheshire Cat, MongoDB, Qdrant)

### Technical Constraints & Dependencies
- Cheshire Cat AI come motore RAG core.
- Keycloak per l'identità (vincolo enterprise).
- MongoDB per i metadati persistenti.

### Cross-Cutting Concerns Identified
- **Security:** Gestione centralizzata dei token e permessi.
- **Observability:** Logging completo su MongoDB per audit trail.
- **Data Integrity:** Sincronizzazione metadati tra Qdrant (vettori) e MongoDB (documenti).

## 5. Starter Template Evaluation

### Primary Technology Domain
Container-Native Full-Stack RAG Architecture (Microservices in Docker).

### Selected Starters & Rationale

**Full-Stack Orchestration: Docker Compose (Modular-Include)**
- Rationale: Tutti i servizi sono dockerizzati e orchestrati via Docker Compose Modular-Include (`docker-compose.yml` + `docker/services/`). 

**Frontend Core: React 19 (Vite) Docker-Ready**
- Rationale: Container dedicato, ottimizzato per React 19, Tailwind 4 e Shadcn UI.

**Backend Core: Spring Boot 3.4.3 (Java 21) Docker-Ready**
- Rationale: Container Spring Boot WebFlux con supporto nativo per lo stack reattivo e sicurezza OAuth2 (Keycloak).

**AI & Vector Storage: Cheshire Cat + Qdrant (Docker Core)**
- Rationale: Stack RAG pre-configurato e isolato in container dedicati per il recupero multimodale.

## 6. Core Architectural Decisions

### Data Architecture
- **Database:** MongoDB Reactive + Qdrant (Vector).
- **Validation Strategy:** **Zod** (Frontend) e **JSR-303 Bean Validation** (Backend) per garantire coerenza dei dati end-to-end.
- **Migration & Testing:** Uso di **Testcontainers** per i test di integrazione con MongoDB.

### Authentication & Security
- **Identity Provider:** **Keycloak** (OIDC).
- **Pattern:** Spring Boot agisce come **OAuth2 Resource Server** validando i JWT emessi da Keycloak.
- **Frontend Auth:** Integrazione con Keycloak via OIDC Public Client pattern (token gestito via React Context/Redux).

### API & Communication Patterns
- **Protocol:** RESTful via **Spring WebFlux** (Non-blocking).
- **Real-time:** Supporto per WebSockets/SSE per lo streaming delle risposte dal Cheshire Cat.
- **Documentation:** **OpenAPI 3 (SpringDoc)** automatizzata via `/swagger-ui.html`.

### Frontend Architecture
- **Framework:** React 19 + TypeScript.
- **Styling:** Tailwind CSS 4 + Shadcn UI.
- **State Management:** **Redux Toolkit** per la gestione di sessioni e preferenze utente.

## 7. Implementation Patterns & Consistency Rules

### Clean Code Mandates (Absolute Rule)
Tutto il codice prodotto (Backend, Frontend, Plugin) DEVE rispettare rigorosamente i principi del **Clean Code**:
- **Nomi Significativi:** Variabili, metodi e classi devono rivelare l'intento.
- **Funzioni Piccole (SRP):** Ogni funzione/metodo deve fare una sola cosa bene.
- **SOLID Principles:** Seguire SRP, OCP, LSP, ISP e DIP in tutto il sistema.
- **Commenti (Perché, non Cosa):** Spiegare il perché di scelte non ovvie.
- **DRY:** Evitare duplicazioni logiche centralizzando le utility.

### Naming Patterns
- **Backend:** `it.peoplefirs.chatboot` (package), `camelCase` (metodi).
- **Frontend:** `PascalCase` (componenti), `kebab-case` (utility/file).
- **API:** `/api/v1/resource-name` (plurale, kebab-case).

### Structure Patterns
- **Backend:** Layered Architecture (Controller -> Service -> Repository).
- **Frontend:** Feature-based Organization (src/features/feature-name/...).

### Format Patterns
- **API Wrapper:** `{ success, data, error, timestamp }`.
- **JSON Style:** `camelCase` ovunque.

## 8. Project Structure & Boundaries

### Infrastructure & Security Foundation (Priority 0)
- **Docker Modularity:** Configurazione via `docker/services/` (keycloak.yml, keycloak-db.yml, backend.yml, frontend.yml, cheshire-cat.yml, mongodb.yml, qdrant.yml).
- **Auth Setup:** Inizializzazione Realm Keycloak e Client OIDC come prima attività di implementazione.
- **Env Management:** `generate-env.sh` per la gestione sicura dei segreti e variabili d'ambiente.

### Backend Organization (Spring Boot)
```
backend/ChatBoot/
├── src/main/java/it/peoplefirs/chatboot/
│   ├── config/             # Configurazione Keycloak, MongoDB, WebClient
│   ├── controllers/        # RestController (WebFlux)
│   ├── services/           # Orchestrazione RAG e Business Logic
│   ├── repositories/       # Reactive MongoDB Repositories
│   ├── models/             # entities/ (Mongo) e dtos/ (Zod-aligned)
│   ├── clients/            # Cheshire Cat AI WebClient
│   └── exception/          # Global Error Handling (Problem Details)
```

### Frontend Organization (React 19)
```
frontend/src/
├── features/               # Feature-based: chat/, auth/, documents/
├── components/             # ui/ (Shadcn), shared/
├── store/                  # Redux Toolkit Slices
├── types/                  # Interfacce TS e Schemi Zod
├── services/               # API clients
```

### Architectural Boundaries
- **Security Boundary:** Nessun servizio è accessibile senza token JWT validato (eccetto login Keycloak).
- **Service Boundary:** Cheshire Cat isolato; Backend gateway unico punto di accesso per il RAG.
- **Data Boundary:** MongoDB per persistenza metadati; Qdrant per persistenza vettoriale.

## 9. Architecture Validation Results

### Coherence Validation ✅
- **Decision Compatibility:** Stack reattivo end-to-end (WebFlux + React 19) coerente con i requisiti di bassa latenza.
- **Pattern Consistency:** Validazione speculare (Zod/Bean Validation) e Naming universale garantiscono zero conflitti tra agenti.

### Requirements Coverage Validation ✅
- **Functional Coverage:** Tutte le Epics del PM hanno una casa tecnica definita nel Solution Design.
- **Non-Functional Coverage:** Sicurezza (Keycloak), Scalabilità (Docker) e Performance (WebFlux) sono "built-in".

### Architecture Completeness Checklist
- [x] Requisiti analizzati e mappati.
- [x] Stack tecnologico (Docker-First) definito.
- [x] Decisioni Core (Auth/Data/API) documentate.
- [x] Pattern di implementazione (Clean Code) stabiliti.
- [x] Struttura di progetto (Fase 0 Keycloak) validata.

## 10. Current Workflow State
- **Step 1:** Initialization [COMPLETED]
- **Step 2:** Project Context Analysis [COMPLETED]
- **Step 3:** Starter Template Evaluation [COMPLETED]
- **Step 4:** Architectural Decisions [COMPLETED]
- **Step 5:** Implementation Patterns [COMPLETED]
- **Step 6:** Project Structure [COMPLETED]
- **Step 7:** Validation [COMPLETED]
