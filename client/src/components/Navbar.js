import React, { Component } from 'react';
import { Navbar, Nav, NavLink } from 'reactstrap';
import { withRouter } from 'react-router';

class MyNavbar extends Component {
  render() {
    const { history } = this.props;
    return (
      <Navbar color="light">
        <Nav>
          <NavLink href="#" onClick={ () => history.push("/") }>Home</NavLink>
          <NavLink href="#" onClick={ () => history.push("/records") }>Records</NavLink>
        </Nav>
      </Navbar>
    )
  }
}

export default withRouter(MyNavbar)
