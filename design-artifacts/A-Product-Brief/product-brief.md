# Product Brief: Sistema RAG Multimodale per Chatbot Personalizzato

## 1. Product Vision
Creare un sistema di **Knowledge Retrieval affidabile** (RAG) che permetta ai dipendenti di consultare istantaneamente manuali (PDF) e formazione video (YouTube/Locali) attraverso un'interfaccia chatbot. Il focus non è la fluidità del dialogo, ma la **certezza della fonte**: ogni risposta deve essere tracciabile a una pagina specifica di un PDF o a un timestamp di un video.

## 2. Target Users
*   **Dipendenti Operativi:** Utilizzatori di software complessi (Salesforce, SAP, etc.) che necessitano di supporto procedurale "just-in-time" mentre lavorano.
*   **Knowledge Administrators:** Esperti di dominio che gestiscono e validano la base di conoscenza.

## 3. Problema e Soluzione
*   **Problema:** I dipendenti perdono tempo a cercare informazioni in manuali PDF lunghi o video di formazione, rischiando di eseguire procedure in modo errato o rallentando il flusso di lavoro.
*   **Soluzione:** Un chatbot multimodale accessibile (anche via Chrome plugin) che estrae frammenti pertinenti dai manuali e video, fornendo una risposta sintetica ma rigorosamente legata alla fonte originale (Retrieval-Only RAG).

## 4. Key Features (V1 MVP)
*   **Multimodal Retrieval Engine:** Supporto per il chunking intelligente di PDF e l'estrazione di segmenti video tramite timestamps.
*   **Tracciabilità Totale:** Annotazione automatica della fonte in ogni risposta (es. "Vedi PDF p.12" o "Video @ 02:45").
*   **Context-Aware Filtering:** Filtraggio automatico dei manuali basato sull'applicativo in uso (es. solo manuali Salesforce se l'utente è su Salesforce).
*   **Zero-Hallucination Validation:** Score di confidenza basato sulla similarità tra risposta e chunk sorgente; se < 0.75, il sistema dichiara di non sapere la risposta.
*   **Deployment Dockerizzato:** Stack completo (Qdrant, API, LiteLLM) eseguibile in locale con fallback su Google Cloud.

## 5. Non-Goals (Cosa NON faremo nella V1)
*   Supporto multilingua avanzato con traduzione automatica (V3).
*   Memoria a lungo termine della conversazione (V3).
*   Workflow di approvazione admin complesso per ogni manuale (V2).

## 6. Success Metrics
*   **Accuratezza:** 100% delle risposte generate devono essere supportate da una fonte valida presente nel database.
*   **Latenza:** Risposta < 2 secondi per query standard su infrastruttura ibrida.
*   **Engagement:** Il chatbot deve rispondere con successo ad almeno l'80% delle query poste durante i test (senza "Non so").
*   **Costo Operativo:** Mantenere i costi sotto i €100/mese utilizzando Gemini API e storage ottimizzato.

---
**Status:** Bozza in attesa di validazione
**Ultimo aggiornamento:** 19 Marzo 2026
