import { Body1, Button, Card, CardFooter, CardHeader, Input, Label, makeStyles, shorthands } from "@fluentui/react-components";
import { ArrowHookDownLeftFilled, SaveRegular } from "@fluentui/react-icons";
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import icon from './../../Assets/wrench.png';
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

function Attrezzatura() {
    const param = useParams();
    const api = "/api/Attrezzature/";
    const [object, setObject] = useState({ id: 0, nome: "" });
    const [authorize, setAuthorize] = useState(false);

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
                const getObject = async () => {
                    if (param !== undefined && param.id !== undefined) {
                        const response = await fetch(api + param.id);
                        const data = await response.json();
                        setObject(data);
                    }
                };
                // call the function
                getObject().catch(console.error);
            }
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
            default:
        }
    }, 1000);

    async function Edit() {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(object)
        };
        const response = await fetch(api + object.id, requestOptions);
        const data = await response.status;
        console.log(data);
        if (data === 200 || data === 201 || data === 204) {
            getNotifiche("Attrezzatura Modificata", true);
        } else {
            const status = await response.statusText;
            console.log(status);
            getNotifiche("Errore! Non è stato possibile modificare l'attrezzatura", false);
        }
    }

    async function Add() {

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(object),
        };
        const response = await fetch(api, requestOptions);
        const data = await response.status;
        console.log(data);
        if (data === 200 || data === 201 || data === 204) {
            getNotifiche("Attrezzatura Aggiunta", true);
        } else {
            const status = await response.statusText;
            console.log(status);
            getNotifiche("Errore! Non è stato possibile aggiungere l'attrezzatura", false);
        }
    }

    function MyCardTitolo() {
        return object.id === 0
            ? <b>Aggiungi Attrezzatura</b>
            : <b>Modifica Attrezzatura</b>;
    }

    function MyCard(props) {
        const instyle = useStyles();

        return (
            <Card className={styles.card} appearance="filled">
                <CardHeader
                    image={{
                        as: "img",
                        src: icon,
                        alt: "Wrench icon",
                        rel: "Wrench icons created by Freepik - Flaticon",
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
                            <Label htmlFor="Nome" weight="semibold">
                                Nome Attrezzatura
                            </Label>
                            <Input id="Nome" defaultValue={object.nome} onChange={handleChange} required />
                        </div>
                    </form>
                </div>
                <CardFooter>
                    <Button appearance="primary" type="submit" form="Form" icon={<SaveRegular fontSize={16} />}>Salva</Button>
                    <Button as="a" href="/attrezzature/lista" icon={<ArrowHookDownLeftFilled fontSize={16} />}>Torna alla lista attrezzature</Button>
                </CardFooter>
                <ToastContainer />
            </Card>
        );
    }

    return authorize
        ? <MyCard />
        : <NotAuthorizeCard />;
};

export default Attrezzatura;
