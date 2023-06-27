import {
    Dialog,
    DialogTrigger,
    DialogSurface,
    DialogTitle,
    DialogBody,
    DialogActions,
    DialogContent,
    Button,
} from "@fluentui/react-components";
import * as React from "react";
import { DeleteRegular, } from "@fluentui/react-icons";
import styles from './../../Style/Shared.module.css';

function DeleteDialog(props) {
    function sendData() {
        props.callback(props.id);
    }

    return (
        <Dialog>
            <DialogTrigger disableButtonEnhancement>
                <Button icon={<DeleteRegular />} aria-label="Delete" />
            </DialogTrigger>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>Conferma Cancellazione</DialogTitle>
                    <DialogContent>
                        Confermi di voler eliminare in modo definitivo questa {props.text}?
                    </DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="primary">Chiudi</Button>
                        </DialogTrigger>
                        <DialogTrigger>
                            <Button className={styles.error} appearance="secondary" onClick={sendData}>Conferma</Button>
                        </DialogTrigger>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};

export default DeleteDialog;