# Story: Cheshire Cat AI Core Configuration

## 1. Story Context
**ID:** `1-1-cheshire-cat-core-config`  
**Status:** `ready-for-dev`  
**Epic:** `Epic 1.1: Multimodal Retrieval Engine`  
**As a:** AI/RAG Engineer  
**I want to:** Configurare il Cheshire Cat Core in Docker per il chunking di PDF e Video  
**So that:** Il sistema può indicizzare correttamente la base di conoscenza e recuperare frammenti precisi.

---

## 2. Acceptance Criteria (BDD)

### Scenario 1: Chunking PDF
- **Given:** Un documento PDF caricato nella memoria del Cat.
- **When:** Il Cat processa il file.
- **Then:** Il file viene diviso in chunk semantici e salvato in Qdrant con metadati sulla pagina.

### Scenario 2: Recupero Multimodale
- **Given:** Una query specifica dell'utente.
- **When:** Interrogo il Cat tramite le sue API REST/WebSocket.
- **Then:** Ricevo i top-5 chunk più rilevanti con relativo score di similarità.

### Scenario 3: Zero-Hallucination Threshold
- **Given:** Una query fuori contesto.
- **When:** Il Cat interroga il Vector DB.
- **Then:** Se lo score è inferiore a 0.75, deve rispondere "Non so" (secondo il PRD).

---

## 3. Developer Context & Guardrails

### Technical Requirements
- **Core:** Cheshire Cat AI (Docker image).
- **Vector DB:** Qdrant (gestito dal Cat).
- **LLM:** Google Gemini API (via LiteLLM o plugin Cat).

### Architecture Compliance
- Utilizzare i volumi Docker per la persistenza dei dati del Cat.
- Configurare il plugin `semantic_chunking` per preservare il contesto di tabelle e liste.
- **Clean Code:** Configurazione del Cat tramite file YAML/ENV puliti.

---

## 5. Story Completion Status
- [ ] Cheshire Cat Container running
- [ ] Qdrant integration verified
- [ ] PDF Chunking plugin configured
- [ ] Threshold for Zero-Hallucination active
