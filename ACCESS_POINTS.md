# 🐾 ChatBootRad - Punti di Accesso ai Servizi

Benvenuto nel progetto **ChatBootRad**. Di seguito trovi tutti gli indirizzi, le credenziali e la struttura delle cartelle per gestire l'infrastruttura Docker.

---

## 🚀 Servizi Principali (GUI)

| Servizio | URL Locale (Browser) | Descrizione |
| :--- | :--- | :--- |
| **Frontend (React)** | [http://localhost:5173](http://localhost:5173) | Interfaccia utente dell'applicazione. |
| **Cheshire Cat Admin** | [http://localhost:1337/admin](http://localhost:1337/admin) | Console di controllo del Gatto (Plugin, LLM, Memoria). |
| **Qdrant Dashboard** | [http://localhost:6333/dashboard](http://localhost:6333/dashboard) | Interfaccia per monitorare i vettori e le collezioni. |
| **Mongo Express** | [http://localhost:8081](http://localhost:8081) | Manager grafico per i dati su MongoDB. |
| **Cheshire Cat API** | [http://localhost:1337/docs](http://localhost:1337/docs) | Documentazione Swagger per sviluppatori. |

---

## 🛠️ Credenziali e Connessioni

### 🍃 MongoDB
- **Host Interno:** `mongo:27017`
- **User/Password:** `admin` / `password`
- **Accesso GUI:** Richiede login con `admin` / `password`.

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

## ⚡ Comandi Rapidi (da eseguire nella cartella `docker/`)

1. **Riparazione Permessi (Ubuntu):**
   `sudo chown -R 1000:1000 volume/cbr_storage && sudo chmod -R 775 volume/cbr_storage`

2. **Avvio Silenzioso:**
   `docker compose up -d`

3. **Vedere se ci sono errori:**
   `docker compose logs -f cheshire-cat`

4. **Spegnimento Totale:**
   `docker compose down`