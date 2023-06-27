import {
    Body1, Button, Card, CardHeader, Table, TableBody, TableCell, TableCellLayout, TableHeader, TableHeaderCell, TableRow, useArrowNavigationGroup, useFocusableGroup
} from "@fluentui/react-components";
import { Add16Regular, EditRegular } from "@fluentui/react-icons";
import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import DeleteDialog from './../../components/dialog/DeleteDialog';
import NotAuthorizeCard from './../../components/notauthorize/NotAuthorizeCard';
import icon from './../../Assets/wrench.png';
import { getNotifiche } from './../../components/notifiche/Notifiche';
import styles from './../../Style/Shared.module.css';
import authService from './../../components/api-authorization/AuthorizeService';


function AttrezzaturaList() {
    const api = "/api/Attrezzature/";
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const columns = [
        { columnKey: "nome", label: "Nome" },
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
            const getAule = async () => {
                const response = await fetch(api);
                const data = await response.json();
                setList(data);
                setLoading(false);
            };

            // call the function
            getAule().catch(console.error);
        }
    }, [authorize]);

    function handleCallback(childData) {
        Delete(childData);
    }

    async function Delete(id) {
        const response = await fetch(api + id, { method: 'DELETE' });
        const data = await response.status;
        console.log(data);
        if (data === 200 || data === 201 || data === 204) {
            getNotifiche("Attrezzatura Rimossa", true);
            document.getElementById(id).remove();
        } else {
            const status = await response.statusText
            console.log(status);
            getNotifiche("Errore! Non è stato possibile cancellare l'attrezzatura", false);
        }
    }

    function Contents() {
        return loading
            ? <p><em>Caricamento in corso... </em></p>
            : <Tabella />;
    }

    function Tabella() {
        return (
            <div>
                <Button appearance="primary" size="small" as="a" href="/attrezzature/" icon={<Add16Regular />}>Aggiungi</Button>
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
                                        {object.nome}
                                    </TableCellLayout>
                                </TableCell>
                                <TableCell role="gridcell" tabIndex={0} {...focusableGroupAttr}>
                                    <TableCellLayout>
                                        <Button className={styles.button} as="a" href={`/attrezzature/${object.id}`} icon={<EditRegular />} aria-label="Edit" />
                                        <DeleteDialog id={`${object.id}`} text="attrezzatura" callback={handleCallback} />
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
                <Contents />
            </Card>
        );
    }

    return authorize
        ? <CardTabella />
        : <NotAuthorizeCard />;
};

export default AttrezzaturaList;
