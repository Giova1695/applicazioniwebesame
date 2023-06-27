import {Body1, Card, CardHeader} from "@fluentui/react-components";
import React from 'react';
import 'react-toastify/dist/ReactToastify.css';

import icon from './../../Assets/rejected.png';
import styles from './../../Style/Shared.module.css';

function NotAuthorizeCard() {
    function MyCard() {
        return (
            <Card className={styles.card} appearance="filled">
                <CardHeader
                    image={{
                        as: "img",
                        src: icon,
                        alt: "Rejected icon",
                        rel: "Reject icons created by Freepik - Flaticon",
                        width: 32,
                    }}
                    header={
                        <Body1>
                            <b>Accesso Non Autorizzato </b>
                        </Body1>
                    }
                />
                <p>Non hai i permessi per visualizzare questa pagina</p>
            </Card>
        );
    }

    return (
        <MyCard />
    );
};

export default NotAuthorizeCard;
