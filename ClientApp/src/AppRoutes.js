import ApiAuthorzationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { Home } from "./components/Home";
import PrenotazioneList from "./Pages/Prenotazione/PrenotazioneList"
import Prenotazione from "./Pages/Prenotazione/Prenotazione"
import AulaList from "./Pages/Aula/AulaList"
import Aula from "./Pages/Aula/Aula"
import AttrezzaturaList from "./Pages/Attrezzatura/AttrezzaturaList"
import Attrezzatura from "./Pages/Attrezzatura/Attrezzatura"
import UtenteList from "./Pages/Utenti/UtenteList"
import Utente from "./Pages/Utenti/Utente"


const AppRoutes = [
      {
        index: true,
        element: <Home />
      },
    {
        path: '/prenotazioni/lista',
        requireAuth: true,
        element: <PrenotazioneList />
    },
    {
        path: '/prenotazioni/:id?',
        requireAuth: true,
        element: <Prenotazione />
    },
    {
        path: '/aule/lista',
        requireAuth: true,
        element: <AulaList />
    },
    {
        path: '/aule/:id?',
        requireAuth: true,
        element: <Aula />
    },
    {
        path: '/attrezzature/lista',
        requireAuth: true,
        element: <AttrezzaturaList />
    },
    {
        path: '/attrezzature/:id?',
        requireAuth: true,
        element: <Attrezzatura />
    },
    {
        path: '/utenti/lista',
        requireAuth: true,
        element: <UtenteList />
    },
    {
        path: '/utenti/:id',
        requireAuth: true,
        element: <Utente />
    },


  ...ApiAuthorzationRoutes
];

export default AppRoutes;
