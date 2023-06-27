import {
    Body1, Button, Card, CardHeader, Table, TableBody, TableCell, TableCellLayout, TableHeader, TableHeaderCell, TableRow, useArrowNavigationGroup, useFocusableGroup
} from "@fluentui/react-components";
import { EditRegular } from "@fluentui/react-icons";
import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import authService from '../../components/api-authorization/AuthorizeService';
import DeleteDialog from '../../components/dialog/DeleteDialog';
import NotAuthorizeCard from '../../components/notauthorize/NotAuthorizeCard';
import { getNotifiche } from '../../components/notifiche/Notifiche';
import icon from './../../Assets/group.png';
import styles from './../../Style/Shared.module.css';

function UtenteList() {
    const api = "/api/Utenti/";
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const columns = [
        { columnKey: "username", label: "Username" },
        { columnKey: "email", label: "Email" },
        { columnKey: "ruoli", label: "Ruoli" },
        { columnKey: "azioni", label: "Azioni" },
    ];
    const [authorize, setAuthorize] = useState(false);
    const keyboardNavAttr = useArrowNavigationGroup({ axis: "grid" });
    const focusableGroupAttr = useFocusableGroup({ tabBehavior: "limited-trap-focus", });

    useEffect(() => {
        const check = async () => {
            const isAdmin = await authService.isAdmin();
            setAuthorize(isAdmin);
        };
        check().catch(console.error);
    }, []);

    useEffect(() => {
        if (authorize) {
            // declare the async data fetching function
            const getValues = async () => {
                const response = await fetch(api);
                const data = await response.json();
                setList(data);
                setLoading(false);
            };

            // call the function
            getValues().catch(console.error);
        }
    }, [authorize]);

    function Contents() {
        return loading
            ? <p><em>Caricamento in corso... </em></p>
            : <Tabella />;
    }

    function handleCallback(childData) {
        Delete(childData);
    }

    async function Delete(id) {
        const response = await fetch(api + id, { method: 'DELETE' });
        const data = await response.status;
        console.log(data);
        if (data === 200 || data === 201 || data === 204) {
            getNotifiche("Utente Eliminato", true);
            document.getElementById(id).remove();
        } else {
            const status = await response.statusText
            console.log(status);
            getNotifiche("Errore! Non è stato possibile cancellare l'utente", false);
        }
    }

    function Tabella() {
        return (
            <div>
                <Table
                    {...keyboardNavAttr}
                    role="grid"
                    aria-label="Table with grid keyboard navigation">
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHeaderCell key={column.columnKey}>
                                    <b>{column.label}</b>
                                </TableHeaderCell>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {list.map((object) => (
                            <TableRow key={object.id} id={object.id} >
                                <TableCell>
                                    <TableCellLayout>
                                        {object.username}
                                    </TableCellLayout>
                                </TableCell>
                                <TableCell>
                                    <TableCellLayout>
                                        {object.email}
                                    </TableCellLayout>
                                </TableCell>
                                <TableCell>
                                    <TableCellLayout>
                                        {object.ruoli.map(ruolo =>
                                            ruolo + " "
                                        )}
                                    </TableCellLayout>
                                </TableCell>
                                <TableCell role="gridcell" tabIndex={0} {...focusableGroupAttr}>
                                    <TableCellLayout>
                                        <Button className={styles.button} as="a" href={`/utenti/${object.id}`} icon={<EditRegular />} aria-label="Edit" />
                                        <DeleteDialog id={`${object.id}`} text="utente" callback={handleCallback} />
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

    function CardTabella() {
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
                            <b>Lista Utenti</b>
                        </Body1>
                    }
                />
                <Contents />
            </Card>
        );
    }

    return authorize
        ? <CardTabella />
        : <NotAuthorizeCard />;
};

export default UtenteList;
