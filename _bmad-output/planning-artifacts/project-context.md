# Project Context: Sistema RAG Multimodale per Chatbot

## Project Overview
**Vision:** Fornire ai dipendenti un supporto decisionale e procedurale istantaneo basato su manuali tecnici (PDF) e video di formazione.
**Core Principle:** Retrieval-Only RAG con tracciabilità 1:1 tra risposta e fonte originale per garantire zero allucinazioni.

## Tech Stack
- **Frontend:** React 19, TypeScript, Tailwind 4, Lucide Icons, Shadcn UI.
- **Backend Orchestrator:** Spring Boot 3.4 (Java 21), Spring WebFlux (Reactive Stack).
- **RAG Engine:** Cheshire Cat AI (FastAPI-based Core).
- **Identity & Access Management:** Keycloak (OIDC/OAuth2).
- **Vector Database:** Qdrant (gestito dal Cheshire Cat).
- **NoSQL Database:** MongoDB (per log sessioni, metadati utenti e audit trail).
- **Infrastruttura:** Docker Compose per l'orchestrazione di tutti i servizi.

## Architectural Flow
1. **Frontend:** Gestisce l'interazione utente e l'autenticazione delegata al Backend.
2. **Spring Boot (Gateway & Auth Manager):** 
   - Gestisce il flusso OIDC con **Keycloak** (Backend-side).
   - Valida i token e protegge le API.
   - Funge da proxy reattivo tra Frontend e Cheshire Cat.
   - Gestisce la persistenza dei log e metadati su MongoDB.
3. **Cheshire Cat:** 
   - Esegue il chunking e l'embedding dei documenti (PDF/Video).
   - Interroga Qdrant per il recupero delle informazioni.
   - Restituisce la risposta con i metadati della fonte.

## Development Rules & Conventions
- **Backend:** 
  - Seguire il pattern Reactive (Project Reactor) in Spring Boot.
  - Usare Lombok per ridurre il boilerplate.
  - Configurare `application.properties` tramite variabili d'ambiente Docker.
- **Frontend:** 
  - Utilizzare componenti funzionali con Hook.
  - Sviluppare interfacce responsive e accessibili.
  - Gestire i log tramite l'utility `useLogger` già presente.
- **RAG:** 
  - Non permettere mai risposte senza fonte verificabile.
  - Mantenere la logica di estrazione pura (Zero-Hallucination).

## Current Status (Sprint 1: Foundation)
- [x] PRD e Epics aggiornati con lo stack reale.
- [x] Struttura base del Backend Spring Boot e Frontend React pronta.
- [x] Infrastruttura Docker Compose con Qdrant e MongoDB definita.
- [ ] Integrazione Keycloak nel flusso Auth.
- [ ] Configurazione Cheshire Cat e connessione con Spring Boot.
