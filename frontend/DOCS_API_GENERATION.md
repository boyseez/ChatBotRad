# Automazione Client API (RTK Query Codegen)

Questo progetto utilizza `@rtk-query/codegen-openapi` per generare automaticamente gli hooks di Redux Toolkit partendo dalla documentazione Swagger/OpenAPI del Backend.

## 🚀 Vantaggi
- **Sincronizzazione Totale**: Il Frontend riflette sempre le API del Backend.
- **Type Safety**: TypeScript ti avviserà se i dati restituiti dal server cambiano.
- **Zero Codice Manuale**: Non serve scrivere interfacce o chiamate Axios a mano.
- **Caching Automatico**: RTK Query gestisce la cache e il caricamento dei dati per te.

---

## 🛠️ Configurazione

I file coinvolti sono:
1. `openapi-config.ts`: Configurazione del generatore (URL Swagger, percorsi di output).
2. `src/store/api/baseApi.ts`: Definizione base (URL di base, gestione headers/CSRF).
3. `src/store/api/generatedApi.ts`: **[GENERATO]** Contiene tutti gli hooks e i tipi TypeScript.

---

## 🔄 Come Generare il Client

Assicurati che il **Backend sia avviato** e che lo Swagger sia raggiungibile (solitamente su `http://localhost:8080/v3/api-docs`).

Esegui il comando dalla root del progetto:

```bash
docker exec cbr_frontend npm run generate-api
```

Oppure, se sei dentro la cartella `frontend`:
```bash
npm run generate-api
```

---

## 📝 Esempio di Utilizzo

Una volta generata l'API, puoi usare gli hooks direttamente nei tuoi componenti. 

### Recupero dati (Query)
```tsx
import { useGetChatsQuery } from "@/store/api/generatedApi";

export function ChatList() {
  const { data: chats, isLoading, error } = useGetChatsQuery();

  if (isLoading) return <p>Caricamento...</p>;
  
  return (
    <ul>
      {chats?.map(chat => (
        <li key={chat.id}>{chat.title}</li>
      ))}
    </ul>
  );
}
```

### Invio dati (Mutation)
```tsx
import { useSendMessageMutation } from "@/store/api/generatedApi";

export function SendMessage() {
  const [sendMessage, { isLoading }] = useSendMessageMutation();

  const handleSend = async () => {
    await sendMessage({ content: "Ciao!" }).unwrap();
  };

  return (
    <button onClick={handleSend} disabled={isLoading}>
      Invia
    </button>
  );
}
```

---

## ⚠️ Note Importanti
- **Non modificare `generatedApi.ts`**: Ogni volta che lanci il comando, questo file viene sovrascritto. Eventuali personalizzazioni (come la gestione dei token) vanno fatte in `baseApi.ts`.
- **Regenerate spesso**: Lancia il comando ogni volta che il Backend aggiunge o modifica un endpoint.
