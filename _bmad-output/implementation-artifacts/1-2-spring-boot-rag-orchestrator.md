# Story: Spring Boot RAG Orchestrator

## 1. Story Context
**ID:** `1-2-spring-boot-rag-orchestrator`  
**Status:** `ready-for-dev`  
**Epic:** `Epic 1.3: Spring Boot Communication Gateway`  
**As a:** Backend Developer  
**I want to:** Implementare il servizio Spring Boot che orchestra il flusso tra il Frontend e il Cheshire Cat AI  
**So that:** Le richieste vengono validate, arricchite e inoltrate in modo sicuro al motore RAG.

---

## 2. Acceptance Criteria (BDD)

### Scenario 1: Comunicazione WebFlux con il Cat
- **Given:** Una richiesta di chat valida dal Frontend.
- **When:** Lo Spring Gateway inoltra la query al Cheshire Cat tramite WebClient/WebSocket.
- **Then:** Riceve la risposta reattiva (streaming) e la inoltra al Frontend senza bloccare i thread.

### Scenario 2: Persistenza su MongoDB
- **Given:** Una sessione di chat attiva.
- **When:** Una risposta viene ricevuta dal Cat.
- **Then:** Il log completo (query, risposta, fonti, timestamp) viene salvato su MongoDB Reactive.

### Scenario 3: Arricchimento Risposta (Tracciabilità)
- **Given:** I metadati del Cat sulla fonte.
- **When:** Lo Spring Boot arricchisce l'oggetto di risposta.
- **Then:** Include link diretti o riferimenti formattati (es. "Pagina X") per il Frontend.

---

## 3. Developer Context & Guardrails

### Technical Requirements
- **Framework:** Spring Boot 3.4.3 (WebFlux reattivo).
- **Client:** Spring WebClient (REST) e Reactive WebSocket Client.
- **Data:** Spring Data MongoDB Reactive.

### Architecture Compliance
- Utilizzare il pattern **Controller-Service-Repository**.
- DTO validati con Bean Validation e speculari a quelli del Frontend (Zod).
- **Clean Code:** Gestione errori centralizzata con `ProblemDetail`.

### File Structure Requirements
- Crea `it.peoplefirs.chatboot.controllers.ChatController`.
- Crea `it.peoplefirs.chatboot.services.RagOrchestrationService`.
- Crea `it.peoplefirs.chatboot.clients.CheshireCatClient`.

---

## 5. Story Completion Status
- [ ] WebClient/WebSocket for Cat implemented
- [ ] Chat flow end-to-end working re-actively
- [ ] MongoDB persistence for logs active
- [ ] Exception handling (RFC 7807) implemented
