import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users:  []
    }
  }
  componentDidMount() {
    fetch('/users')
      .then(res => res.json())
      .then(users => this.setState({ users }));
  }

  render () {
    return (
      <Container>
        <Row className="mb-2">
          <Col>This is the index page.</Col>
        </Row>
        <Row>
          <h1>Users</h1>
        </Row>
        <Row>
          <ul>
          { this.state.users.map((user) => <li key={user.id}>{user.username}</li>) }
          </ul>
        </Row>
      </Container>
    )
  }
}

export default Index;