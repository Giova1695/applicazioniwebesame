import {
    Body1, Button, Card, CardHeader, Table, TableBody, TableCell, TableCellLayout, TableHeader, TableHeaderCell, TableRow, useArrowNavigationGroup, useFocusableGroup
} from "@fluentui/react-components";
import { Add16Regular, EditRegular } from "@fluentui/react-icons";
import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Moment from 'react-moment';

import DeleteDialog from './../../components/dialog/DeleteDialog';
import icon from './../../Assets/schedule.png';
import { getNotifiche } from './../../components/notifiche/Notifiche';
import styles from './../../Style/Shared.module.css';
import authService from './../../components/api-authorization/AuthorizeService';


function PrenotazioneList() {
    const api = "/api/Prenotazioni/";
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [authorize, setAuthorize] = useState(false);

    const columns = [
        { columnKey: "nome", label: "Nome" },
        { columnKey: "tipo", label: "Tipo" },
        { columnKey: "partecipantiMax", label: "N\u00B0 Massimo Partecipanti" },
        { columnKey: "dataInizio", label: "Ora e Data Inizio" },
        { columnKey: "dataFine", label: "Ora e Data Fine" },
        { columnKey: "aula", label: "Aula" },
        { columnKey: "azioni", label: "Azioni" },
    ];


    const keyboardNavAttr = useArrowNavigationGroup({ axis: "grid" });
    const focusableGroupAttr = useFocusableGroup({ tabBehavior: "limited-trap-focus", });

    useEffect(() => {
        const check = async () => {
            const isAuthorize = await authService.isResp();
            setAuthorize(isAuthorize);
        };
        check().catch(console.error);

        // declare the async data fetching function
        const getAule = async () => {
            const response = await fetch(api);
            const data = await response.json();
            setList(data);
            setLoading(false);
        };

        // call the function
        getAule()
            // make sure to catch any error
            .catch(console.error);
    }, [])

    function handleCallback(childData) {
        Delete(childData);
    }

    async function Delete(id) {
        const response = await fetch(api + id, { method: 'DELETE' });
        const data = await response.status;
        console.log(data);
        if (data === 200 || data === 201 || data === 204) {
            getNotifiche("Prenotazione Eliminata", true);
            document.getElementById(id).remove();
        } else {
            const status = await response.statusText
            console.log(status);
            getNotifiche("Errore! Non è stato possibile cancellare la prenotazione", false);
        }
    }

    function Contents() {
        return loading
            ? <p><em>Caricamento in corso... </em></p>
            : <Tabella />;
    }

    function AuthorizeAction(props) {

        return authorize
            ?
            <TableCell role="gridcell" tabIndex={0} {...focusableGroupAttr}>
                <TableCellLayout>
                    <Button className={styles.button} as="a" href={`/prenotazioni/${props.object.id}`} icon={<EditRegular />} aria-label="Edit" />
                    <DeleteDialog id={`${props.object.id}`} text="prenotazione" callback={handleCallback} />
                </TableCellLayout>
            </TableCell>
            :
            <React.Fragment></React.Fragment>
    }

    function AuthorizeButton() {
        return authorize
            ?
            <Button appearance="primary" size="small" as="a" href="/prenotazioni" icon={<Add16Regular />}>Aggiungi</Button>
            :
            <React.Fragment></React.Fragment>
    }

    function Tabella() {
        return (
            <div>
                <AuthorizeButton />
                <Table
                    {...keyboardNavAttr}
                    role="grid"
                    aria-label="Table with grid keyboard navigation">
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => {
                                if (column.label === "Azioni") {
                                    if (authorize) {
                                        return (
                                            <TableHeaderCell key={column.columnKey}>
                                                <b>{column.label}</b>
                                            </TableHeaderCell>
                                        );
                                    } else {
                                        return <React.Fragment></React.Fragment>;
                                    }
                                } else {
                                    return (
                                        <TableHeaderCell key={column.columnKey}>
                                            <b>{column.label}</b>
                                        </TableHeaderCell>
                                    );
                                }
                            })}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {list.map((object) => (
                            <TableRow key={object.id} id={object.id} >
                                <TableCell>
                                    <TableCellLayout>
                                        {object.nome}
                                    </TableCellLayout>
                                </TableCell>
                                <TableCell>
                                    {object.tipo}
                                </TableCell>
                                <TableCell>
                                    {object.partecipantiMax}
                                </TableCell>
                                <TableCell>
                                    <Moment format="H:mm - DD/MM/YYYY">{object.dataInizio}</Moment>
                                </TableCell>
                                <TableCell>
                                    <Moment format="H:mm - DD/MM/YYYY">{object.dataFine}</Moment>
                                </TableCell>
                                <TableCell>
                                    {object.aula.nome}
                                </TableCell>
                                <AuthorizeAction object={object} />
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <ToastContainer />
            </div>
        );
    }

    function CardTabella() {
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
                            <b>Lista Prenotazioni</b>
                        </Body1>
                    }
                />
                <Contents />
            </Card>
        );
    }

    return (
        <CardTabella />
    );
};

export default PrenotazioneList;
