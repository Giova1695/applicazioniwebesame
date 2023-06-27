# Progetto esame Applicazioni Web
Si tratta di applicazione realizzata con ASP.NET Core 7 e React con autenticazione, che permette di eseguire la prenotazione delle aule.
## Autenticazione 
È possibile autenticarsi sia con account locale sia tramite OAuth 2 di Google.
Esistono 3 diversi livelli utente:
- Admin
- Responsabile
- Base

## Frontend
- È stato realizzato in REACT, utilizzando le linee guida del Fluent Design di Microsoft aggiornate a Windows 11.
In particolare è stata usata la libreria Fluent UI React v 9 (https://react.fluentui.dev/)
- Si trova nella cartella *Client App*
- Se gli utenti provano ad accedere ad una schermata per la quale non hanno i permessi, viene visualizzata una schermata di accesso negato.
- È stata utilizzata la libreria React Toastify ( https://github.com/fkhadra/react-toastify) per mostrare a schermo delle notifiche i risultati delle operazioni CRUD fatte con il backend.
- È composto dai seguenti percorsi:
#### Home 
- Visibile a tutti gli utenti senza autenticazione
#### Prenotazioni
- Visibile e accessibile solo agli utenti autenticati.
- Solo gli utenti di livello responsabile possono creare, modificare, cancellare una prenotazione
#### Aule
- Visibile e accessibile solo agli utenti autenticati.
- Solo gli utenti di livello admin possono aggiungere, modificare ed eliminare le aule.
#### Attrezzature
- Visibile e accessibile solo agli utenti autenticati di livello admin.
- Solo gli utenti di livello admin possono aggiungere, modificare ed eliminare le attrezzature.
#### Utenti
- Visibile e accessibile solo agli utenti autenticati di livello admin.
- Solo gli utenti di livello admin possono modificare il ruolo di un utente ed eliminarlo.

## Backend
- Il backend è stato realizzato in ASP.NET Core 7 con Entity Framework
- Per la gestione degli utenti è stata utilizzata la Microsoft identity platform 
- Il file program.cs è stato impostato per aggiungere:
	- il supporto ai ruoli e per trasmetterli nei token inviati al frontend
	- il supporto all'OAuth 2 di Google
	- l'inizializzazione del database al primo avvio con alcuni dati di esempio
	- creazione dell'utente amministratore
- Per la **connessione al database** si deve impostare la connection string nel file appsetting.json 
- Il backend è strutturato in questa modo:

#### Models
- Contiene le classi per la creazione delle tabelle a database
	- Attrezzatura
	- Aula
	- AulaAttrezzatura
	- Prenotazione 
	- ApplicationUser
#### DTO
- Contiente le classi utilizzate per comunicare con il frontend. 
	- AttrezzaturaDto
	- AulaDto
	- PrenotazioneDto
	- UtenteDto
#### Controller
- Contiene i controller che gestiscono gli endpoint Rest per la comunicazione con il frontend
- È disponibile la suite swagger per visualizzarli 
- Sono disponibili i seguenti controller:
	- AttrezzaturaController: endpoint accessibili solo agli utenti autenticati con ruolo Admin
	- AulaController: endpoint accessibili solo agli utenti autenticati. Le operazioni PUT, POST e DELETE sono esclusive degli utenti con ruolo Admin
	- PrenotazioneController: endpoint accessibili solo agli utenti autenticati
	- UtenteController: endpoint accessibili solo agli utenti autenticati di ruolo admin
