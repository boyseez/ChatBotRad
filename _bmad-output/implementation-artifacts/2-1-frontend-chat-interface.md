# Story: Frontend Chat Interface

## 1. Story Context
**ID:** `2-1-frontend-chat-interface`  
**Status:** `ready-for-dev`  
**Epic:** `Epic 1.4: UI & Dashboard Integration`  
**As a:** Frontend Developer  
**I want to:** Creare l'interfaccia utente di chat moderna, responsive e basata su React 19  
**So that:** Gli utenti possono interagire con il chatbot in modo fluido e intuitivo.

---

## 2. Acceptance Criteria (BDD)

### Scenario 1: Invio Messaggio
- **Given:** Un utente autenticato nella Dashboard.
- **When:** Digita un messaggio e preme "Invia".
- **Then:** Il messaggio viene visualizzato immediatamente e viene mostrato uno stato di caricamento.

### Scenario 2: Streaming delle Risposte
- **Given:** Una risposta in arrivo dal backend.
- **When:** Il token stream viene ricevuto.
- **Then:** Il testo della risposta viene aggiornato in tempo reale nella finestra di chat.

### Scenario 3: Visualizzazione Fonti (Traceability)
- **Given:** Una risposta con metadati sulla fonte (PDF/Video).
- **When:** La risposta è completa.
- **Then:** Vengono visualizzati i badge cliccabili della fonte sotto il messaggio.

---

## 3. Developer Context & Guardrails

### Technical Requirements
- **Framework:** React 19 + TypeScript.
- **Styling:** Tailwind 4 + Shadcn UI.
- **State Management:** Redux Toolkit.

### Architecture Compliance
- Organizzazione feature-based (`src/features/chat/`).
- Validazione input tramite **Zod**.
- **Clean Code:** Componenti atomici e funzionali con Hook personalizzati.

### File Structure Requirements
- Crea `frontend/src/features/chat/components/ChatWindow.tsx`.
- Crea `frontend/src/features/chat/components/MessageList.tsx`.
- Crea `frontend/src/features/chat/hooks/useChat.ts`.

---

## 5. Story Completion Status
- [ ] Chat UI components implemented
- [ ] Message history rendering active
- [ ] Streaming (WS/SSE) functional
- [ ] Zod validation integrated
- [ ] Responsive design verified
