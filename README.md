# Planner Studio

Planner Studio è un'applicazione semplice e intuitiva per la gestione dello studio e delle attività quotidiane. Permette di organizzare le materie scolastiche o universitarie e tracciare i task da completare.

## ✨ Funzionalità Principali
   * **Gestione Materie:** Crea e organizza facilmente le tue materie di studio.
   * **Tracking dei Task:** Aggiungi compiti specifici, imposta scadenze e monitora le pagine da studiare.
   * **Progressi in Tempo Reale:** Aggiorna le pagine studiate e vedi avanzare il completamento del task.
   * **Zero Installazione:** L'applicazione è portable. Non serve installare Python o database complessi.
   * **Salvataggio Automatico:** I tuoi dati vengono salvati in locale sul tuo computer.

## 📦 Come Installare
   1. Scarica il file `PlannerStudio.exe` che trovi nelle Release.
   2. Sposta il file in una cartella a tua scelta (es. sul Desktop o in Documenti).
   3. Doppio click per avviare.
   4. Nota: Al primo avvio verranno creati automaticamente i file di salvataggio (materie.json e task.json) nella stessa cartella.

## ⚠️ Note Importanti
   * I dati sono salvati in file .json. Si consiglia di non modificarli manualmente per evitare errori.
   * Quando un task viene completato al 100%, viene rimosso dalla lista attiva.
   * L'eseguibile non ha una firma digitale. Windows Defender e altri antivirus potrebbero segnalarlo come pericoloso o bloccarlo all'avvio. Si consiglia di aggiungere il file alle eccezioni dell'antivirus o cliccare su "Ulteriori informazioni" -> "Esegui comunque" se bloccato da Windows.

## 🛠️ Tecnologie Utilizzate

*   **Backend:** Python, Flask
*   **Frontend:** HTML5, CSS3, JavaScript
*   **Packaging:** PyInstaller (per la creazione dell'eseguibile)
