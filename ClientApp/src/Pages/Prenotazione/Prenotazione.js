import {
    Body1, Button, Card, CardFooter, CardHeader, Combobox, Input, Label, makeStyles, Option, shorthands,
    Table, TableBody, TableCell, TableCellLayout, TableHeader, TableHeaderCell, TableRow
} from "@fluentui/react-components";
import { ArrowHookDownLeftFilled, SaveRegular } from "@fluentui/react-icons";
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import icon from './../../Assets/schedule.png';
import wrench from './../../Assets/wrench.png';
import authService from './../../components/api-authorization/AuthorizeService';
import NotAuthorizeCard from './../../components/notauthorize/NotAuthorizeCard';
import { getNotifiche } from './../../components/notifiche/Notifiche';
import styles from './../../Style/Shared.module.css';


const useStyles = makeStyles({
    root: {
        // Stack the label above the field
        display: "flex",
        flexDirection: "column",
        // Use 2px gap below the label (per the design system)
        ...shorthands.gap("2px"),
        // Prevent the example from taking the full width of the page (optional)
        maxWidth: "400px",
        marginTop: "10px",
    },
});

function Prenotazione() {
    const param = useParams();
    const api = "/api/Prenotazioni/";
    const [loading, setLoading] = useState(true);
    const [authorize, setAuthorize] = useState(false);
    const [object, setObject] = useState({ id: 0, nome: "", tipo: "", partecipantiMax: 1, dataInizio: "", dataFine: "", aula: []});
    const [aule, setAule] = useState({ id: 0, nome: "", capienzaMin: 1, capienzaMax: 20, attrezzatura: [] });
    const [attrezzatura, setAttrezzatura] = useState([]);
    const columnsAttrezzatura = [
        { columnKey: "nomeAttr", label: "Nome" },
    ];

    useEffect(() => {
        const check = async () => {
            const isAdmin = await authService.isResp();
            setAuthorize(isAdmin);
        };
        check().catch(console.error);
    }, []);

    useEffect(() => {
        if (authorize) {
            if (param !== undefined && param.id !== undefined) {
                const getPrenotazione = async () => {
                    if (param !== undefined && param.id !== undefined) {
                        const response = await fetch(api + param.id);
                        const data = await response.json();
                        setObject(data);
                    }
                };
                // call the function
                getPrenotazione().catch(console.error);
            }

            const getAule = async () => {
                const response = await fetch('/api/Aule/');
                const data = await response.json();
                setAule(data);
                setLoading(false);
            };
            // call the function
            getAule().catch(console.error);
        }
    }, [authorize, param])

    const handleSubmit = (event) => {
        event.preventDefault();
        if (object.id != null && object.id !== undefined && object.id !== 0) {
            Edit();
        } else {
            Add();
        }
    }

    const handleChange = debounce((event) => {
        const name = event.target.id;
        const value = event.target.value;
        switch (name) {
            case "Nome":
                object.nome = value;
                break;
            case "Tipo":
                object.tipo = value;
                break;
            case "PartecipantiMax":
                object.partecipantiMax = value;
                break;
            case "DataInizio":
                object.dataInizio = value;
                if (value != null && value !== undefined) {
                    document.getElementById("DataFine").min = value;
                }
                break;
            case "DataFine":
                object.dataFine = value;
                break;
            default:
        }
    }, 1000);

    const handleChangeTipo = debounce((SelectionEvents, OptionOnSelectData) => {
        object.tipo = OptionOnSelectData.optionValue;
    }, 1000);

    const handleChangeAule = debounce((SelectionEvents, OptionOnSelectData) => {
        var nome = OptionOnSelectData.optionValue;
        const index = aule.findIndex((aula) => aula.nome === nome);
        if (index > -1) {
            object.aula = aule[index];
            setAttrezzatura(object.aula.attrezzatura);
            console.log(object.aula);
        }
    }, 1000);

    async function Edit() {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(object)
        };
        const response = await fetch(api + object.id, requestOptions);
        if (checkIsJson(response)) {
            const status = await response.status;
            if (checkResponse(status)) {
                getNotifiche("Prenotazione Modificata", true);
            } else {
                const statusText = await response.statusText;
                console.log(statusText);
                getNotifiche("Errore! Non \u00E8 stato possibile modificare la prenotazione", false);
            }
        } else {
            getNotifiche("Errore! Non \u00E8 stato possibile modificare la prenotazione", false);
        }
    }

    async function Add() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(object)
        };
        const response = await fetch(api, requestOptions);
        if (checkIsJson(response)) {
            const status = await response.status;
            if (checkResponse(status)) {
                getNotifiche("Prenotazione Aggiunta", true);
            } else {
                const statusText = await response.statusText;
                console.log(statusText);
                getNotifiche("Errore! Non \u00E8 stato possibile aggiungere la prenotazione", false);
            }
        } else {
            getNotifiche("Errore! Non \u00E8 stato possibile aggiungere la prenotazione", false);
        }
    }

    function checkIsJson(response) {
        const contentType = response.headers.get("content-type");
        return (contentType && contentType.indexOf("application/json") !== -1);
    }

    function checkResponse(status) {
        return (status === 200 || status === 201 || status === 204);
    }

    function CardTitolo() {
        return object.id === 0
            ? <b>Aggiungi Prenotazione</b>
            : <b>Modifica Prenotazione</b>;
    }

    function Contents() {
        return loading
            ? <p><em>Caricamento in corso.. </em></p>
            : <ListaAule />;
    }

    function ListaAule() {
        return (
            <Combobox
                id="Aule"
                aria-labelledby="Aule"
                placeholder="Seleziona un'aula"
                defaultSelectedOptions={[object.aula.nome]}
                defaultValue={object.aula.nome}
                onOptionSelect={handleChangeAule}
                required
            >
                {aule.map((aula) => (
                    <Option key={aula.id} value={aula.nome}>
                        {aula.nome}
                    </Option>
                ))}
            </Combobox>
        );
    }

    function TabellaAttrezzatura() {
        return (
            <div>
                <Table
                    role="grid"
                    aria-label="Table with grid keyboard navigation">
                    <TableHeader>
                        <TableRow>
                            {columnsAttrezzatura.map((column) => (
                                <TableHeaderCell key={column.columnKey}>
                                    <b>{column.label}</b>
                                </TableHeaderCell>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {attrezzatura.map((object) => (
                            <TableRow key={object.id} id={object.id} >
                                <TableCell>
                                    <TableCellLayout>
                                        {object.nome}
                                    </TableCellLayout>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <ToastContainer />
            </div>
        );
    }

    function CardTabellaAttrezzatura() {
        return (
            <Card className={styles.card} appearance="filled">
                <CardHeader
                    image={{
                        as: "img",
                        src: wrench,
                        alt: "Wrench icon",
                        rel: "Wrench icons created by Freepik - Flaticon",
                        width: 32,
                    }}
                    header={
                        <Body1>
                            <b>Lista Attrezzature</b>
                        </Body1>
                    }
                />
                <TabellaAttrezzatura />
            </Card>
        );
    }



    function MyCard(props) {
        const instyle = useStyles();
        const options = ["Lezione", "Esame", "Conferenza", "Riunione"];

        return (
            <Card className={styles.card} appearance="filled">
                <CardHeader
                    image={{
                        as: "img",
                        src: icon,
                        alt: "Calendar with clock icon",
                        rel: "Calendar icons created by Freepik - Flaticon",
                        width: 32,
                    }}

                    header={
                        <Body1>
                            <CardTitolo />
                        </Body1>
                    }
                />
                <div className={styles.mygrid}>
                    <form id="Form" autoComplete="off" onSubmit={handleSubmit}>
                        <div className={instyle.root}>
                            <Label weight="semibold">
                                Aule
                            </Label>
                            <Contents />
                        </div>
                        <div className={instyle.root}>
                            <Label htmlFor="Nome" weight="semibold">
                                Nome Prenotazione
                            </Label>
                            <Input id="Nome" defaultValue={object.nome} onChange={handleChange} required />
                        </div>
                        <div className={instyle.root}>
                            <Label weight="semibold">
                                Tipo
                            </Label>
                            <Combobox
                                id="Tipo"
                                aria-labelledby="Tipo"
                                defaultSelectedOptions={[object.tipo]}
                                defaultValue={object.tipo}
                                onOptionSelect={handleChangeTipo}
                            >
                            {options.map((option) => (
                                <Option key={option} value={option}>
                                    {option}
                                </Option>
                            ))}
                            </Combobox>
                        </div>
                        <div className={instyle.root}>
                            <Label htmlFor="PartecipantiMax" weight="semibold">
                                N&deg; Massimo Partecipanti
                            </Label>
                            <Input id="PartecipantiMax" type="number" defaultValue={object.partecipantiMax} onChange={handleChange} min="1" max="200" required />
                        </div>
                        <div className={instyle.root}>
                            <Label htmlFor="DataInizio" weight="semibold">
                                Data e Ora Inizio
                            </Label>
                            <Input id="DataInizio" type="datetime-local" defaultValue={object.dataInizio} onChange={handleChange} required />
                        </div>
                        <div className={instyle.root}>
                            <Label htmlFor="DataFine" weight="semibold">
                                Data e Ora Fine
                            </Label>
                            <Input id="DataFine" type="datetime-local" defaultValue={object.dataFine} onChange={handleChange} required />
                        </div>
                    </form>
                    <CardTabellaAttrezzatura />
                </div>
                <CardFooter>
                    <Button appearance="primary" type="submit" form="Form" icon={<SaveRegular fontSize={16} />}>Salva</Button>
                    <Button as="a" href="/prenotazioni/lista" icon={<ArrowHookDownLeftFilled fontSize={16} />}>Torna a lista prenotazioni</Button>
                </CardFooter>
                <ToastContainer />
            </Card>
        );
    }

    return authorize
        ? <MyCard />
        : <NotAuthorizeCard />;
};

export default Prenotazione;
