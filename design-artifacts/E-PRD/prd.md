# Product Requirements Document (PRD): Sistema RAG Multimodale

## 1. Executive Summary
**Project Name:** Sistema RAG Multimodale per Chatbot Personalizzato.
**Vision:** Fornire ai dipendenti un supporto decisionale e procedurale istantaneo basato su manuali tecnici (PDF) e video di formazione (YouTube/Locali).
**Core Value:** Tracciabilità 1:1 tra risposta e fonte originale (Retrieval-Only RAG) per garantire zero allucinazioni e massima affidabilità.

## 2. Goals & Success Metrics
*   **G1: Accuratezza Assoluta:** Ogni risposta generata deve essere estratta direttamente dai manuali validati.
*   **G2: Tracciabilità Totale:** Ogni risposta deve includere metadati sulla fonte (pagina PDF o timestamp video).
*   **G3: Efficienza Operativa:** Ridurre del 30% il tempo di ricerca manuale per procedure SAP/Salesforce.
*   **Metrics (KPI):**
    *   Latenza risposta < 2 secondi.
    *   Budget operativo < €100/mese (Gemini API + Local Qdrant).
    *   Accuratezza test set > 95% (risposte corrette vs "Non so").

## 3. Target Users & Context
*   **Dipendenti Operativi:** Utenti Salesforce/SAP che necessitano di istruzioni "just-in-time".
*   **Knowledge Admins:** Esperti che caricano e taggano i manuali.
*   **Applicativi Target:** Salesforce CRM, SAP ERP, Portali interni Chrome-based.

## 4. Functional Requirements (FR)
| ID | Requirement | Description |
|---|---|---|
| **FR1** | **Multimodal Engine** | Supporto per chunking semantico di PDF e metadati video (timestamps). |
| **FR2** | **Source Attribution** | Ogni risposta riporta link a fonte (es: "[Fonte: PDF p.12]"). |
| **FR3** | **Zero-Hallucination** | Score di confidenza > 0.75; se inferiore, risponde "Non so". |
| **FR4** | **Context Filtering** | Chatbot rileva applicativo in uso e filtra i manuali pertinenti. |
| **FR5** | **UI/UX Chatbot** | Web interface + Chrome Plugin con embedding video inline. |
| **FR6** | **History & Logs** | Audit trail completo di ogni conversazione per admin. |

## 5. Non-Functional Requirements (NFR)
| ID | Requirement | Description |
|---|---|---|
| **NFR1** | **Performance** | Risposta API < 2s; caricamento UI < 1s. |
| **NFR2** | **Scalability** | Supporto per 100+ utenti concurrent su infrastruttura ibrida. |
| **NFR3** | **Security** | Nessun dato sensibile inviato a LLM (solo chunk anonimizzati). |
| **NFR4** | **Cost Control** | Gemini API budget limitato a €20/mese. |
| **NFR5** | **Availability** | Fallback automatico su Google Cloud se l'istanza locale degrada. |

## 6. Technical Architecture & Stack
*   **Frontend:** React/TypeScript (Web App) + Manifest V3 (Chrome Plugin).
*   **Backend:** Node.js (Express/FastAPI) in microservizi.
*   **Vector DB:** Qdrant (Local Docker instance).
*   **LLM Gateway:** LiteLLM per il routing delle query.
*   **Inference:** Google Gemini API (Cloud) con fallback locale opzionale.
*   **Storage:** Google Cloud Storage per file multimodali > 500GB.
*   **Deployment:** Docker Compose per orchestratura servizi.

## 7. Roadmap (V1 MVP)
*   **Sprint 1: Foundation** (Qdrant, Chunking PDF, Retrieval API).
*   **Sprint 2: Validation** (Confidence Scoring, Traceability, Audit logs).
*   **Sprint 3: UI & Filtering** (Web Chat UI, Salesforce/SAP tags).
*   **Sprint 4: Plugin & Deploy** (Chrome Extension, Docker stack completo).

## 8. Risks & Mitigations
*   **Rischio:** Allucinazioni residue dell'LLM.
    *   **Mitigazione:** Sistema "Retrieval-Only" (solo estrazione frammenti, no libera generazione).
*   **Rischio:** Latenza rete per video YouTube.
    *   **Mitigazione:** Caching locale dei metadati e timestamps dei segmenti.

---
**Status:** Approvato (Versione 1.0)
**Data:** 19 Marzo 2026
