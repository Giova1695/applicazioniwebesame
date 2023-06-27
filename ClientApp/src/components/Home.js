import { Body1, Button, Card, CardFooter, CardHeader, CardPreview } from "@fluentui/react-components";
import { ArrowHookDownRight20Regular, PersonAdd20Regular } from "@fluentui/react-icons";
import React, { Component } from 'react';
import myimage from './../Assets/classroom.jpg';
import { ApplicationPaths } from './api-authorization/ApiAuthorizationConstants';
import authService from './api-authorization/AuthorizeService';



export class Home extends Component {
    static displayName = Home.name;
    constructor(props) {
        super(props);
        this.state = {auth: false };
    }

    componentDidMount() {
        this.isAuth();
    }

    async isAuth() {
        const check = await authService.isAuthenticated();
        this.setState({ auth: check });
    }

    showButton() {
        return this.state.auth
            ? <React.Fragment></React.Fragment>
            : <CardFooter>
                <Button as="a" href={ApplicationPaths.Register} size="large" icon={<PersonAdd20Regular fontSize={20} />}>Registrati</Button>
                <Button as="a" href={ApplicationPaths.Login} size="large" appearance="primary" icon={<ArrowHookDownRight20Regular fontSize={20} />}>Login</Button>
              </CardFooter>
    }

  render() {
    return (
        <Card>
            <CardHeader
                header={
                    <Body1>
                        <h2><b>Aulos - Prenotazioni Aule</b></h2>
                    </Body1>
                }
            />
            <CardPreview >
                <img
                    src={myimage}
                    alt="Wrinting on paper"
                    rel="Foto di Unseen Studio - Unsplash"
                />
            </CardPreview>
            {this.showButton()}
        </Card>
    );
  }
}
