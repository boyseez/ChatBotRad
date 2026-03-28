# 🐾 ChatBootRad - Punti di Accesso ai Servizi

Benvenuto nel progetto **ChatBootRad**. Di seguito trovi tutti gli indirizzi, le credenziali e la struttura delle cartelle per gestire l'infrastruttura Docker.

---

## 🚀 Servizi Principali (GUI)

| Servizio               | URL Locale (Browser)                                               | Descrizione |
|:-----------------------|:-------------------------------------------------------------------| :--- |
| **Frontend UI**        | [http://localhost:5173](http://localhost:5173)                     | Interfaccia React per l'utente finale (Hot-Reload attivo). |
| **Backend Java**       | [http://localhost:8082](http://localhost:8082)                     | API Core del progetto (Spring Boot). |
| **Backend Swagger**    | [http://localhost:8082/swagger-ui.html](http://localhost:8082/swagger-ui.html) | Documentazione interattiva API Java. |
| **Keycloak Admin**     | [http://localhost:8888](http://localhost:8888)                     | Console Identity Provider (Auth, Realm, Client). |
| **Cheshire Cat Admin** | [http://localhost:1337/admin](http://localhost:1337/admin)         | Console di controllo del Gatto (Plugin, LLM, Memoria). |
| **Qdrant Dashboard**   | [http://localhost:6333/dashboard](http://localhost:6333/dashboard) | Interfaccia per monitorare i vettori e le collezioni. |
| **Mongo GUI**          | [http://localhost:4321](http://localhost:4321)                     | Manager grafico per i dati su MongoDB. |
| **Kibana (Logs)**      | [http://localhost:5601](http://localhost:5601)                     | Dashboard per visualizzazione e analisi dei log. |
| **Elasticsearch**      | [http://localhost:9200](http://localhost:9200)                     | Motore di ricerca e database dei log. |
| **Cheshire Cat API**   | [http://localhost:1337/docs](http://localhost:1337/docs)           | Documentazione Swagger per sviluppatori. |

---

## 🛠️ Credenziali e Connessioni

### 📊 ELK Stack (Logging)
- **Kibana:** [http://localhost:5601](http://localhost:5601) (Senza autenticazione in dev)
- **Elasticsearch Host:** `http://localhost:9200`
- **Logstash Config:** `docker/services/logstash/pipeline/logstash.conf`
- **Index Pattern Consigliato:** `chatboot-logs-*`

### 🍃 MongoDB
- **Host Interno:** `mongodb:27017`
- **Host Esterno:** `localhost:27017`
- **User/Password:** `admin` / `changeme`
- **Stringa Connessione Esterna:** `mongodb://admin:changeme@localhost:27017/`
- **Accesso GUI:** Accessibile su [http://localhost:4321](http://localhost:4321).

### 🔑 Keycloak (Identity Provider)
- **Host Interno:** `keycloak:8080`
- **Host Esterno:** [http://localhost:8888](http://localhost:8888)
- **Admin Console:** `admin` / `admin_pass`
- **Realm:** `ChatBot`

#### 🛡️ Clients OIDC
| Client ID | Type | Secret / Access |
| :--- | :--- | :--- |
| `chatbot-frontend` | Public | Accesso Libero (Redirect: `http://localhost:5173/*`) |
| `chatbot-backend` | Confidential | `chatbot-backend-secret-12345` |

#### 👥 Utenti di Test (Realm ChatBot)
| Username | Password | Ruoli |
| :--- | :--- | :--- |
| `admin-user` | `adminpassword123` | `ROLE_ADMIN`, `ROLE_USER` |
| `test-user` | `password123` | `ROLE_USER` |

### 🔑 Keycloak (PostgreSQL)
- **Host Interno:** `keycloak-db:5432`
- **Host Esterno:** `localhost:5433`
- **User/Password:** `keycloak` / `keycloak_db_pass`
- **Stringa Connessione Esterna:** `jdbc:postgresql://localhost:5433/keycloak`

### 🔍 Qdrant (Vector DB)
- **Host Interno:** `qdrant:6333`
- **Host Esterno:** `http://localhost:6333`

---

## 📂 Struttura Cartelle (Docker Mode)
Tutti i dati persistenti e le configurazioni si trovano all'interno della cartella `docker/volume/cbr_storage/`:

* `docker/volume/cbr_storage/cat_custom`: 🐱 **Importante:** Metti qui i tuoi plugin personalizzati.
* `docker/volume/cbr_storage/cat_metadata`: Configurazioni di sistema e database SQL interno del Gatto.
* `docker/volume/cbr_storage/mongo_data`: File fisici del database MongoDB.
* `docker/volume/cbr_storage/qdrant`: Indici vettoriali della memoria a lungo termine.

---

## ⚡ Comandi Rapidi (da eseguire nella root del progetto)

1. **Generazione Ambiente:**
   `./generate-env.sh` (Crea il file .env necessario per i percorsi assoluti)

2. **Riparazione Permessi (Ubuntu):**
   `sudo chown -R 1000:1000 docker/volume/cbr_storage && sudo chmod -R 775 docker/volume/cbr_storage`

3. **Avvio Silenzioso:**
   `docker compose up -d`

4. **Re-build Backend (senza cache):**
   `docker compose up -d --build --no-deps backend`

5. **Vedere se ci sono errori:**
   `docker compose logs -f backend` (o `cheshire-cat` per il gatto)

6. **Spegnimento Totale:**
   `docker compose down`
