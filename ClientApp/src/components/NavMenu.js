import React, { Component } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Home16Regular, CalendarClock16Regular, ConferenceRoom16Regular, Wrench16Regular, PeopleCommunity16Filled } from "@fluentui/react-icons";
import { LoginMenu } from './api-authorization/LoginMenu';
import './NavMenu.css';

import authService from './api-authorization/AuthorizeService'


export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor (props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
      this.state = { collapsed: true, admin: false, auth: false};
    }
    
    componentDidMount() {
        this.isAuth();
    }

    async isAuth() {
        const check = await authService.isAuthenticated();
        this.setState({ auth: check }, () => {
            if (this.state.auth) {
                this.isAdmin();
            }
        });
    }

    async isAdmin() {
        const check = await authService.isAdmin();
        this.setState({ admin: check });
    }

    toggleNavbar () {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    adminRoute() {
        return (
        <React.Fragment>
            <NavItem >
                <NavLink tag={Link} className="text-dark navlink" to="/attrezzature/lista"><Wrench16Regular className="navsvg" />Attrezzature</NavLink>
                </NavItem>
                <NavItem >
                    <NavLink tag={Link} className="text-dark navlink" to="/utenti/lista"><PeopleCommunity16Filled className="navsvg" />Utenti</NavLink>
                </NavItem>
            </React.Fragment>
        );
    }

    renderAuthRoute() {
        return (
            <React.Fragment>
                <NavItem>
                    <NavLink tag={Link} className="text-dark navlink" to="/prenotazioni/lista"><CalendarClock16Regular className="navsvg" />Prenotazioni</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} className="text-dark navlink" to="/aule/lista"><ConferenceRoom16Regular className="navsvg" />Aule</NavLink>
                </NavItem>
            </React.Fragment>
        );
    }

    authRoute() {
        return (
            this.state.admin ?
            <React.Fragment>
                {this.renderAuthRoute()}
                {this.adminRoute()}
            </React.Fragment>
            :
            <React.Fragment>{this.renderAuthRoute()}</React.Fragment>
        );
    }

    showAuthRoute() {
        return this.state.auth
            ? this.authRoute()
            : <React.Fragment></React.Fragment>
    }

  render() {
    return (
        <header>
            <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3 navbar " container light>
                <NavbarBrand tag={Link} to="/">Aulos</NavbarBrand>
                <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
                <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
                <ul className="navbar-nav flex-grow">
                    <NavItem>
                      <NavLink tag={Link} className="text-dark navlink" to="/"><Home16Regular className="navsvg" />Home</NavLink>
                    </NavItem>
                    {this.showAuthRoute()}
                    <LoginMenu>
                    </LoginMenu>
                </ul>
            </Collapse>
        </Navbar>
      </header>
    );
  }
}
