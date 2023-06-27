import React, { Component, Fragment } from 'react';
import { NavItem, NavLink  } from 'reactstrap';
import { Link } from 'react-router-dom';
import authService from './AuthorizeService';
import { ApplicationPaths } from './ApiAuthorizationConstants';
import './../NavMenu.css';
import { ArrowHookDownRight16Regular, ArrowHookDownLeft16Regular, PersonAdd16Regular } from "@fluentui/react-icons";



export class LoginMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      userName: null
    };
  }

  componentDidMount() {
    this._subscription = authService.subscribe(() => this.populateState());
    this.populateState();
  }

  componentWillUnmount() {
    authService.unsubscribe(this._subscription);
  }

  async populateState() {
    const [isAuthenticated, user] = await Promise.all([authService.isAuthenticated(), authService.getUser()])
    this.setState({
      isAuthenticated,
      userName: user && user.name
    });
    }

  render() {
    const { isAuthenticated, userName } = this.state;
    if (!isAuthenticated) {
      const registerPath = `${ApplicationPaths.Register}`;
      const loginPath = `${ApplicationPaths.Login}`;
      return this.anonymousView(registerPath, loginPath);
    } else {
      const profilePath = `${ApplicationPaths.Profile}`;
      const logoutPath = `${ApplicationPaths.LogOut}`;
      const logoutState = { local: true };
      return this.authenticatedView(userName, profilePath, logoutPath, logoutState);
    }
  }

  authenticatedView(userName, profilePath, logoutPath, logoutState) {
    return (<Fragment>
      <NavItem>
            <NavLink tag={Link} className="text-dark navlink" to={profilePath}>Hello {userName}</NavLink>
      </NavItem>
      <NavItem>
            <NavLink replace tag={Link} className="text-dark navlink" to={logoutPath} state={logoutState}
                ><ArrowHookDownLeft16Regular className="navsvg" />Logout</NavLink>
      </NavItem>
    </Fragment>);
  }

  anonymousView(registerPath, loginPath) {
    return (<Fragment>
      <NavItem>
            <NavLink tag={Link} className="text-dark navlink" to={registerPath}><PersonAdd16Regular className="navsvg" />Register</NavLink>
      </NavItem>
      <NavItem>
            <NavLink tag={Link} className="text-dark navlink" to={loginPath}><ArrowHookDownRight16Regular className="navsvg" />Login</NavLink>
      </NavItem>
    </Fragment>);
    }
}
