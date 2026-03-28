# Logging strutturato in Spring WebFlux (Production Ready)

## 📌 Obiettivo

Implementare un sistema di logging robusto e scalabile per un'applicazione Spring WebFlux che permetta:

- Tracciamento delle richieste (correlationId)
- Compatibilità con sistemi di log centralizzati (Elastic Stack, Kibana)
- Supporto per architetture a microservizi
- Logging strutturato in formato JSON

---

## 🧩 Componenti implementati

### 1. CorrelationIdWebFilter

#### ✅ Scopo
Gestire un identificativo univoco (`correlationId`) per ogni richiesta HTTP.

#### 🔧 Funzionalità
- Legge `X-Correlation-Id` dall'header (se presente)
- Genera un UUID se assente
- Inserisce il valore in:
    - Reactor Context (per WebFlux)
    - MDC (per logging)
- Aggiunge anche il campo `service`

#### 💡 Perché è stato fatto così
- Permette di tracciare una richiesta attraverso più microservizi
- Centralizza la gestione del contesto
- Evita duplicazioni nei controller

---

### 2. ReactorMdcConfiguration

#### ✅ Scopo
Garantire la propagazione del contesto MDC nei flussi reattivi (`Mono` / `Flux`)

#### 🔧 Funzionalità
- Usa `Hooks.onEachOperator` per intercettare le operazioni Reactor
- Copia i dati dal `Reactor Context` dentro l’MDC
- Mantiene il `correlationId` consistente nei log

#### 💡 Problema risolto
In WebFlux:
- l'MDC **non è thread-safe**
- i thread cambiano frequentemente

👉 Senza questo componente:
- i log perderebbero il `correlationId`
- i dati sarebbero incoerenti

---

### 3. MdcContextLifter

#### ✅ Scopo
Bridge tra Reactor Context e MDC

#### 🔧 Funzionalità
- Intercetta eventi Reactor (`onNext`, `onError`, `onComplete`)
- Copia i valori dal Context all’MDC

#### 💡 Perché serve
- Reactor usa un modello asincrono
- MDC è basato su ThreadLocal

👉 Questa classe rende compatibili i due mondi

---

### 4. WebClientConfig

#### ✅ Scopo
Propagare automaticamente il `correlationId` verso altri microservizi

#### 🔧 Funzionalità
- Intercetta le chiamate HTTP in uscita
- Legge il `correlationId` dal Reactor Context
- Lo inserisce nell’header `X-Correlation-Id`

#### 💡 Perché è importante
- Permette il **tracing distribuito**
- Tutti i servizi condividono lo stesso identificativo

---

## 🧠 Scelte architetturali

### ❌ Perché NON usare MDC direttamente nei controller

- WebFlux è asincrono
- MDC usa ThreadLocal
- I thread cambiano durante l’esecuzione

👉 Risultato:
- log inconsistenti
- perdita di contesto

---

### ✅ Perché usare Reactor Context

- È progettato per ambienti reattivi
- Propaga correttamente i dati tra thread
- È l’approccio ufficiale per WebFlux

---

### ✅ Perché usare un WebFilter

- È un punto centrale
- Evita duplicazione di codice
- Applica la logica a tutte le richieste

---

### ✅ Perché usare correlationId

Permette di:
- Tracciare una richiesta end-to-end
- Debuggare facilmente problemi distribuiti
- Collegare log tra microservizi

---

## 📊 Risultato finale

Ogni log contiene automaticamente:

```json
{
  "@timestamp": "...",
  "message": "Accesso endpoint ADMIN",
  "correlationId": "abc-123",
  "service": "chatboot"
}
