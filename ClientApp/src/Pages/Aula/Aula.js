import { Body1, Button, Card, CardFooter, CardHeader, Checkbox, Input, Label, makeStyles, shorthands } from "@fluentui/react-components";
import { ArrowHookDownLeftFilled, SaveRegular } from "@fluentui/react-icons";
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import door from './../../Assets/door.png';
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

function Aula() {
    const api = "/api/Aule/";
    const param = useParams();
    const [loading, setLoading] = useState(true);
    const [authorize, setAuthorize] = useState(false);
    const [object, setObject] = useState({ id: 0, nome: "", capienzaMin: 1, capienzaMax: 20, attrezzatura: [] });
    const [attrezzature, setAttrezzature] = useState([{id:0, nome:""}]);

    useEffect(() => {
        const check = async () => {
            const isAdmin = await authService.isAdmin();
            setAuthorize(isAdmin);
        };
        check().catch(console.error);
    }, []);


    useEffect(() => {
        if (authorize) {
            if (param !== undefined && param.id !== undefined) {
                const getAula = async () => {
                    if (param !== undefined && param.id !== undefined) {
                        const response = await fetch(api + param.id);
                        const data = await response.json();
                        setObject(data);
                    }
                };
                // call the function
                getAula().catch(console.error);
            }

            const getAttrezzature = async () => {
                const response = await fetch('/api/Attrezzature/');
                const data = await response.json();
                setAttrezzature(data);
                setLoading(false);
            };
            // call the function
            getAttrezzature().catch(console.error);
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
            case "CapienzaMin":
                object.capienzaMin = value;
                if (value >= 1 && value <= 1000) {
                    document.getElementById("CapienzaMax").min = value;
                }
                break;
            case "CapienzaMax":
                object.capienzaMax = value;
                break;
            default:
        }
    }, 1000);

    const handleChangeAttrezzatura = (event) => {
        const id = event.target.id;
        const name = event.target.name;
        const value = event.target.checked;

        if (value) {
            const attrezzatura = {
                id: 0,
                nome: ""
            }
            attrezzatura.id = id;
            attrezzatura.nome = name;
            object.attrezzatura.push(attrezzatura);
        } else {
            // eslint-disable-next-line eqeqeq
            const index = object.attrezzatura.findIndex((item) => item.id == id);
            if (index > -1) {
                object.attrezzatura.splice(index, 1);
            }
        }
    };

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
                getNotifiche("Aula Modificata", true);
            } else {
                const statusText = await response.statusText;
                console.log(statusText);
                getNotifiche("Errore! Non \u00E8 stato possibile modificare l'aula", false);
            }
        } else {
            getNotifiche("Errore! Non \u00E8 stato possibile aggiungere l'aula", false);
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
                getNotifiche("Aula Aggiunta", true);
            } else {
                const statusText = await response.statusText;
                console.log(statusText);
                getNotifiche("Errore! Non \u00E8 stato possibile aggiungere l'aula", false);
            }
        } else {
            getNotifiche("Errore! Non \u00E8 stato possibile aggiungere l'aula", false);
        }
    }

    function checkIsJson(response) {
        const contentType = response.headers.get("content-type");
        return (contentType && contentType.indexOf("application/json") !== -1);
    }

    function checkResponse(status) {
        return (status === 200 || status === 201 || status === 204);
    }

    function MyCardTitolo() {
        return object.id === 0
            ? <b>Aggiungi Aula</b>
            : <b>Modifica Aula</b>;
    }

    function Contents() {
        return loading
            ? <p><em>Caricamento in corso... </em></p>
            : <ListaAttrezzature />;
    }

    function ListaAttrezzature() {
        return (
            attrezzature.map((attrezzatura) => (
                <div key={attrezzatura.id} >
                    <Checkbox id={attrezzatura.id} name={attrezzatura.nome} label={attrezzatura.nome} onChange={handleChangeAttrezzatura} defaultChecked={HasAttrezzatura(attrezzatura) }/>
                </div>
            ))
        );
    }

    function HasAttrezzatura(props) {
        return object.attrezzatura && object.attrezzatura.some((attrezzatura) => attrezzatura.id === props.id);
    }

    function MyCard(props) {
        const instyle= useStyles();

        return (
            <Card className={styles.card} appearance="filled">
                <CardHeader
                    image={{
                        as: "img",
                        src: door,
                        alt: "Door icon",
                        rel: "Furniture and household icons created by Good Ware - Flaticon",
                        width: 32,
                    }}

                    header={
                        <Body1>
                            <MyCardTitolo />
                        </Body1>
                    }
                />
                <div >
                    <form id="Form" onSubmit={handleSubmit}>
                        <div className={instyle.root}>
                            <Label htmlFor="AulaNome" weight="semibold">
                                Nome Aula
                            </Label>
                            <Input id="Nome" defaultValue={object.nome} onChange={handleChange} required/>
                        </div>
                        <div className={instyle.root}>
                            <Label htmlFor="CapienzaMin" weight="semibold">
                                Capienza Minima
                            </Label>
                            <Input id="CapienzaMin" type="number" defaultValue={object.capienzaMin} onChange={handleChange} min="1" max="1000" required />
                        </div>
                        <div className={instyle.root}>
                            <Label htmlFor="CapienzaMax" weight="semibold">
                                Capienza Massima
                            </Label>
                            <Input id="CapienzaMax" type="number" defaultValue={object.capienzaMax} onChange={handleChange} min="1" max="1000" required />
                        </div>
                        <div className={instyle.root}>
                            <Label weight="semibold">
                                Attrezzature
                            </Label>
                            <Contents />
                        </div>
                    </form>
                </div>
                <CardFooter>
                    <Button appearance="primary" type="submit" form="Form" icon={<SaveRegular fontSize={16}/>}>Salva</Button>
                    <Button as="a" href="/aule/lista" icon={<ArrowHookDownLeftFilled fontSize={16} />}>Torna a lista aule </Button>
                </CardFooter>
                <ToastContainer />
            </Card>
        );
    }

    return authorize
        ? <MyCard />
        : <NotAuthorizeCard />;
};

export default Aula;
