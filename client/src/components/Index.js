import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { withRouter } from 'react-router';
import { getRecords } from "../Actions";

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      records: []
    }
  }

  componentDidMount() {
    this.getRecords()
  }

  getRecords() {
    getRecords().then(records => this.setState({ records }))
  }

  showRecords() {
    const { records } = this.state
    const { history } = this.props
    return (
      <ul>
        { records.map((record) =>
          <li key={record.brn} onClick={() => history.push('/book/' + record.brn)}>
            { record.brn } { record.title }
          </li> )}
      </ul>
    )
  }

  render () {
    return (
      <Container>
        <h2>Records</h2>
        { this.showRecords() }
        <br/>
      </Container>
    )
  }
}

export default withRouter(Index)
