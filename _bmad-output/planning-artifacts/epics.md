---
project_name: "Sistema RAG Multimodale per Chatbot Personalizzato"
status: "In Planning"
version: "1.0"
stepsCompleted: [1]
created_date: "2026-03-18"
roadmap_version: "v1-v2-v3"
input_source: "brainstorming-session-2026-03-18_10-21-58.md"
---

# Epics and Stories: Sistema RAG Multimodale per Chatbot

## Project Overview

**Vision:** Creare un sistema RAG multimodale (PDF + video) con tracciabilità completa, validazione automatica e supporto per dipendenti in task reali.

**Strategic Focus:** Non è un "chatbot fancy" — è **knowledge retrieval affidabile** con multimodale support. LLM è secondary. Ogni risposta deve essere tracciata a fonte (pagina PDF o timestamp video).

---

## Requirements Summary

### Functional Requirements (FRs)

**FR1:** Sistema deve estrarre frammenti diretti da PDF e video senza allucinazioni (Retrieval-Only RAG)
**FR2:** Ogni risposta deve includere tracciabilità completa: "Pagina X del PDF" o "Minuto Y:Z del video"
**FR3:** Sistema deve filtrare manuali automaticamente in base al contesto applicativo (Salesforce, SAP, etc.)
**FR4:** Supporto multimodale: visualizzare testo + video + screenshot + step-by-step guidance nella stessa conversazione
**FR5:** Interfaccia chatbot accessibile da Chrome plugin per dipendenti
**FR6:** Validazione automatica che risposte siano fedeli ai manuali, zero allucinazioni
**FR7:** Sistema deve supportare upload di manuali (PDF) e video YouTube
**FR8:** Dipendenti possono votare "utile?" su risposte (feedback loop)
**FR9:** Admin può gestire manuali (versioning, approval, history)
**FR10:** Sistema registra timestamp conversazione per tracciamento completo

### Non-Functional Requirements (NFRs)

**NFR1:** Performance: Latenza risposta < 2 secondi per query standard
**NFR2:** Scalabilità: Supportare 100+ concurrent users su infrastruttura ibrida (local + Google Cloud)
**NFR3:** Affidabilità: 99% uptime con fallback cloud automatico se local degrada
**NFR4:** Storage: Gestire 500GB+ di PDF e video (leverage Google Cloud Storage)
**NFR5:** Cost: Budget €300/3 mesi (~€100/mese)
**NFR6:** Tech Stack: TypeScript everywhere, microservices architecture (non monolith)
**NFR7:** Deployment: Dockerizzato con LiteLLM gateway
**NFR8:** Vector DB: Qdrant (local, vendor-agnostic)
**NFR9:** LLM Inference: Google Gemini API (~€20/mese)
**NFR10:** Modulare: Solo developer deve poter onboarde facilmente

### Architecture Requirements

**AR1:** Hybrid Local + Cloud design: Qdrant local per portabilità + Gemini API per prestazioni
**AR2:** Microservices per modulo: non monolith, deploy indipendente
**AR3:** LiteLLM gateway per switchability modelli LLM
**AR4:** Chrome plugin con fallback web per MVP
**AR5:** API-first design per integrazione con applicativi (Salesforce, SAP plugins)

### Key Insights (from Brainstorming)

- **RAG è il Core**, non LLM — Knowledge retrieval affidabile è il differenziatore
- **Tracciabilità è Feature, non Bug** — "risposta viene da pagina X" è il valore reale
- **MVP ≠ Simple** — Multimodale RAG + validazione + chunking intelligente = complex but focused
- **Learning Path è Chiaro**: V1 (Retrieval-Only) → V2 (Crowdsourcing) → V3 (Stateful Memory)

---

## Epic Breakdown by Version

### VERSION 1.0 — MVP: Retrieval-Only RAG + Basic Tracciabilità

**Epic 1.1: Multimodal Retrieval Engine (PDF + Video)**
- Chunking intelligente di PDF
- Estrazione video metadata (timestamps)
- Vector embedding con Qdrant local
- Retrieval con ranking per relevance

**Epic 1.2: Tracciabilità Completa**
- Annotazione di ogni risposta con fonte (PDF page/Video timestamp)
- UI per visualizzare link to source
- Admin view di audit trail conversazioni

**Epic 1.3: Context-Aware Filtering**
- Riconoscimento applicativo (Salesforce/SAP/etc)
- Filtraggio manuali per applicativo
- Knowledge base per mapping applicativo → manuali

**Epic 1.4: Zero-Hallucination Validation**
- Matching score tra risposta e chunk sorgente
- Reject respons if confidence < threshold
- Fallback "non so, consulta admin" message

**Epic 1.5: Chatbot UI + Chrome Plugin**
- Web interface per MVP
- Chrome plugin adapter
- Message formatting (text + video embed + screenshots)
- Conversation history storage

**Epic 1.6: Docker + LiteLLM Deployment**
- Docker compose per local setup (Qdrant + API)
- LiteLLM gateway config
- Google Gemini API integration (~€20/mese)
- Infra fallback cloud (Google Cloud Storage)

---

### VERSION 2.0 — Crowdsourced Validation + Knowledge Graph

**Epic 2.1: Feedback Loop (User Votes)**
- "Utile?" button on ogni risposta
- Aggregazione feedback per identificare gaps
- Auto-learning: risposte "no-utile" = segnale per ritraining

**Epic 2.2: Procedural Knowledge Graph**
- Linking chunks per relazioni logiche (prerequisites, workflow steps)
- Insegnare non solo risposta ma intero processo
- Visualization di workflow knowledge in UI

**Epic 2.3: Manual Versioning + Approval**
- Versioning per manuali
- Admin approval workflow
- Rollback capability
- Change tracking

**Epic 2.4: Advanced Analytics**
- Dashboard: Question patterns, gap analysis
- Real-time confidence scoring
- Auto-identification di knowledge base gaps

---

### VERSION 3.0 — Advanced: Stateful Memory + Auto-Translation

**Epic 3.1: Stateful Conversation Memory**
- Context retention across messages
- Natural dialogue, not single-turn QA
- Personalization per user (preferred manual language, etc)

**Epic 3.2: Auto-Translation**
- Multilingua support (manuali in lingua madre)
- Auto-translate request → retrieval in any language
- Team internazionale ready

**Epic 3.3: Advanced Specialization**
- Specialized chatbots per domain (Clienti, Opportunità, etc)
- Automatic routing basato su contesto
- Domain-specific RAG tuning

---

## Requirements Coverage Map

| Requirement | V1 | V2 | V3 | Epic |
|---|---|---|---|---|
| Multimodal retrieval | ✅ | ✅ | ✅ | 1.1 |
| Tracciabilità completa | ✅ | ✅ | ✅ | 1.2 |
| Context-aware filtering | ✅ | ✅ | ✅ | 1.3 |
| Zero-hallucination validation | ✅ | ✅ | ✅ | 1.4 |
| Chatbot UI + Chrome plugin | ✅ | ✅ | ✅ | 1.5 |
| Docker + LiteLLM | ✅ | ✅ | ✅ | 1.6 |
| Feedback loop (crowdsourcing) | — | ✅ | ✅ | 2.1 |
| Knowledge graph | — | ✅ | ✅ | 2.2 |
| Manual versioning | — | ✅ | ✅ | 2.3 |
| Analytics + confidence scoring | — | ✅ | ✅ | 2.4 |
| Stateful memory | — | — | ✅ | 3.1 |
| Auto-translation | — | — | ✅ | 3.2 |
| Specialization per domain | — | — | ✅ | 3.3 |

---

## Story Breakdown (Stories per Epic)

### VERSION 1.0 STORIES

#### Epic 1.1: Multimodal Retrieval Engine

**Story 1.1.1: PDF Chunking and Embedding**
- Load PDF, split into chunks (semantic boundaries)
- Generate embeddings con Qdrant
- Store in local Vector DB
- AC: Qdrant queries return top-5 relevant chunks with scores

**Story 1.1.2: Video Metadata Extraction**
- Parse video (local file or YouTube URL)
- Extract timestamps, segment boundaries
- Create searchable metadata
- AC: Query video returns relevant segments with timestamp

**Story 1.1.3: Unified Retrieval Interface**
- Single API endpoint for PDF + video queries
- Ranking algorithm (BM25 + semantic similarity)
- Return combined results sorted by relevance
- AC: Same query works for PDF and video

**Story 1.1.4: Chunking Intelligence**
- Implement semantic chunking (not just token limits)
- Preserve context (headers, lists, tables)
- Handle video transcripts as chunks
- AC: Chunks are semantically coherent and searchable

#### Epic 1.2: Tracciabilità Completa

**Story 1.2.1: Source Attribution in Responses**
- Every response includes source metadata
- PDF: page number, text excerpt
- Video: timestamp, segment description
- Format: "[Fonte: PDF p.5]" or "[Fonte: Video 3:45]"
- AC: 100% of responses have source attribution

**Story 1.2.2: Audit Trail Storage**
- Log every conversation turn with metadata
- Timestamp, user, query, response, source
- Store in persistent database
- AC: Admin can view full conversation history

**Story 1.2.3: Admin Source Verification UI**
- Dashboard to browse conversation audit trail
- View response + source side-by-side
- Click through to source document
- AC: Admin can verify any response's source in < 10 seconds

#### Epic 1.3: Context-Aware Filtering

**Story 1.3.1: Application Detection**
- Chatbot asks user "Which app? (Salesforce/SAP/etc)"
- Or detect from browser context
- Store user application preference
- AC: System correctly identifies application 95%+ accuracy

**Story 1.3.2: Manual-to-Application Mapping**
- Admin can tag manuali with application(s)
- Salesforce CRM manual → tag "Salesforce"
- SAP Procurement manual → tag "SAP"
- AC: Each manual has 1+ application tags

**Story 1.3.3: Filtered Retrieval**
- Retrieval only searches manuali tagged for user's application
- Prevents irrelevant results from other domains
- AC: Results are 100% relevant to selected application

#### Epic 1.4: Zero-Hallucination Validation

**Story 1.4.1: Confidence Scoring**
- For each response, calculate confidence = similarity(response, source_chunk)
- Threshold = 0.75 (tunable)
- Below threshold → "Non so" response
- AC: Confidence score < 0.75 triggers "Non so"

**Story 1.4.2: Chunk Fidelity Check**
- Verify response is direct extraction or close paraphrase of chunk
- Flag if LLM added new information
- AC: Response matches source within semantic similarity threshold

**Story 1.4.3: Fallback Response**
- If confidence too low, respond: "Non so. Consulta [link to manual] o contatta admin."
- Prevents hallucination completely
- AC: No hallucination responses in test set

#### Epic 1.5: Chatbot UI + Chrome Plugin

**Story 1.5.1: Web Chat Interface**
- Single-page app (React or similar)
- Message input, conversation history, source links
- Display video embeds in chat
- AC: Chat interface loads in < 1 second, responsive design

**Story 1.5.2: Message Formatting**
- Format responses with source attribution
- Embed video player for video responses
- Show screenshots if available
- AC: Video plays inline, source links clickable

**Story 1.5.3: Conversation History**
- Save all messages in browser + backend
- Retrieve history on page reload
- Export conversation as PDF
- AC: History persists across sessions

**Story 1.5.4: Chrome Plugin Adapter**
- Package chatbot as Chrome extension
- Inject widget into Salesforce/SAP pages
- Access chatbot without new tab
- AC: Plugin installs and loads chatbot in Chrome 100+

**Story 1.5.5: User Preferences**
- Save application preference (Salesforce/SAP)
- Save manual language preference (EN/IT/etc)
- Persist in local storage
- AC: Preferences saved and restored

#### Epic 1.6: Docker + LiteLLM Deployment

**Story 1.6.1: Docker Compose Setup**
- docker-compose.yml for local stack
- Services: Qdrant, API (Node.js), LiteLLM gateway
- Environment config for Google Cloud fallback
- AC: `docker-compose up` spins up full stack locally

**Story 1.6.2: LiteLLM Gateway Configuration**
- Configure LiteLLM to route to Google Gemini API
- Fallback to local LLM if cloud unavailable
- Cost tracking (€20/mese for Gemini)
- AC: Requests route correctly, costs tracked

**Story 1.6.3: Google Cloud Storage Integration**
- Upload PDF/video to Google Cloud Storage (5€/mese)
- Retrieve during chunking
- Handle fallback if local storage full
- AC: 500GB+ files accessible from Cloud Storage

**Story 1.6.4: Infra Monitoring**
- Health checks: Qdrant, API, LLM gateway
- Alert if local performance degrades
- Auto-failover to cloud
- AC: Failover happens within 30 seconds of local degradation

---

## Sprint Planning Overview

### SPRINT STRUCTURE

**Duration:** 2-week sprints (ideal per MVP complexity)

**V1 Sprints:** 3-4 sprints (~6-8 weeks for complete MVP)
**V2 Sprints:** 2-3 sprints (~4-6 weeks)
**V3 Sprints:** 2 sprints (~4 weeks)

### V1.0 SPRINT MAP

**SPRINT 1: Foundation (Retrieval Engine + Storage)**
- Stories: 1.1.1, 1.1.2, 1.1.3
- Deliverable: Local Qdrant + retrieval API working
- Output: `/api/search` endpoint returns top-5 chunks for query

**SPRINT 2: Validation + Traceability**
- Stories: 1.1.4, 1.2.1, 1.2.2, 1.4.1, 1.4.2
- Deliverable: Confidence scoring, source attribution, audit logs
- Output: Response format includes source + confidence

**SPRINT 3: Filtering + UI**
- Stories: 1.3.1, 1.3.2, 1.3.3, 1.5.1, 1.5.2
- Deliverable: Web chat interface, application filtering
- Output: Deployed web chat at localhost:3000

**SPRINT 4: Plugin + Deployment**
- Stories: 1.5.3, 1.5.4, 1.5.5, 1.6.1, 1.6.2, 1.6.3, 1.6.4, 1.4.3
- Deliverable: Chrome plugin + Docker stack fully functional
- Output: MVP ready for user testing

---

## Risks and Constraints

**Budget Constraint:** €300/3 mesi
- Mitigation: Qdrant local (free), Gemini API only for inference, lean architecture

**Solo Developer:** Complex multi-service system
- Mitigation: Microservices modules with clear boundaries, automated testing, Docker simplifies deployment

**PC Performance Limits:** Local inference may be slow
- Mitigation: Hybrid local+cloud, LiteLLM handles switching

**Chrome Plugin Risk:** Manifest changes in Chrome
- Mitigation: MVP with web fallback, plugin as enhancement not requirement

---

## Success Criteria for V1 MVP

- ✅ Retrieval-only RAG working end-to-end
- ✅ Zero hallucinations in test conversations
- ✅ 100% source attribution (every response traceable)
- ✅ Multimodal support (PDF + video) in demo
- ✅ Docker stack deployable locally + cloud fallback working
- ✅ Chrome plugin + web interface functional
- ✅ < €100/mese operational cost

---

## Next Steps

1. **Finalize Sprint 1 stories** with acceptance criteria details
2. **Set up development environment** (Docker, repo, CI/CD)
3. **Begin Sprint 1 implementation** (Retrieval engine + Vector DB)

