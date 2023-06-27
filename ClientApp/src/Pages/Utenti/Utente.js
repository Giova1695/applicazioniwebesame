import { Body1, Button, Card, CardFooter, CardHeader, Checkbox, Input, Label, makeStyles, shorthands } from "@fluentui/react-components";
import { ArrowHookDownLeftFilled, SaveRegular } from "@fluentui/react-icons";
import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import icon from './../../Assets/group.png';
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

function Utente() {
    const api = "/api/Utenti/";
    const param = useParams();
    const [authorize, setAuthorize] = useState(false);
    const [object, setObject] = useState({ id: 0, username: "", email: "", ruoli: [] });
    const [ruoli, setRuoli] = useState(["Responsabile"]);

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
        }
    }, [authorize, param])

    const handleSubmit = (event) => {
        event.preventDefault();
        if (object.id != null && object.id !== undefined && object.id !== 0) {
            Edit();
        }
    }

    const handleChangeRuoli = (event) => {
        const id = event.target.id;
        const name = event.target.name;
        const value = event.target.checked;

        if (value) {
            object.ruoli.push(name);
        } else {
            // eslint-disable-next-line
            const index = object.ruoli.findIndex((ruolo) => ruolo == name);
            if (index > -1) {
                object.ruoli.splice(index, 1);
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
        if (hasContentType(response)) {
            const status = await response.status;
            if (checkResponse(status)) {
                getNotifiche("Utente Modificato", true);
            } else {
                const statusText = await response.statusText;
                console.log(statusText);
                getNotifiche("Errore! Non \u00E8 stato possibile modificare l'utente", false);
            }
        } else {
            getNotifiche("Errore! Non \u00E8 stato possibile modificare l'utente", false);
        }
    }

    function hasContentType(response) {
        const contentType = response.headers.get("content-type");
        return (contentType == null);
    }

    function checkResponse(status) {
        return (status === 200 || status === 201 || status === 204);
    }

    function MyCardTitolo() {
        return <b>Modifica Utente</b>;
    }

    function Contents() {
        return <ListaRuoli />;
    }

    function ListaRuoli() {
        return (
            ruoli.map((ruolo) => (
                <div key={ruolo} >
                    <Checkbox id={ruolo} name={ruolo} label={ruolo} onChange={handleChangeRuoli} defaultChecked={HasAttrezzatura(ruolo)} />
                </div>
            ))
        );
    }

    function HasAttrezzatura(props) {
        return object.ruoli && object.ruoli.some((ruolo) => ruolo === props);
    }

    function MyCard(props) {
        const instyle = useStyles();

        return (
            <Card className={styles.card} appearance="filled">
                <CardHeader
                    image={{
                        as: "img",
                        src: icon,
                        alt: "People icon",
                        rel: "People icons created by Freepik - Flaticon",
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
                            <Label htmlFor="Username" weight="semibold">
                                Username
                            </Label>
                            <Input id="Username" defaultValue={object.username} disabled />
                        </div>
                        <div className={instyle.root}>
                            <Label htmlFor="Email" weight="semibold">
                                Email
                            </Label>
                            <Input id="Email" defaultValue={object.email} disabled />
                        </div>
                        <div className={instyle.root}>
                            <Label weight="semibold">
                                Ruoli
                            </Label>
                            <Contents />
                        </div>
                    </form>
                </div>
                <CardFooter>
                    <Button appearance="primary" type="submit" form="Form" icon={<SaveRegular fontSize={16} />}>Salva</Button>
                    <Button as="a" href="/utenti/lista" icon={<ArrowHookDownLeftFilled fontSize={16} />}>Torna a lista aule </Button>
                </CardFooter>
                <ToastContainer />
            </Card>
        );
    }

    return authorize
        ? <MyCard />
        : <NotAuthorizeCard />;
};

export default Utente;
