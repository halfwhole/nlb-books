import React, { Component } from 'react';
import { Container, Table } from 'reactstrap';
import { withRouter } from 'react-router';

const testBrn = '200985763'

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
    fetch('/api/record')
      .then(res => res.json())
      .then(records => this.setState({ records: records }))
  }

  renderRecords() {
    const { records } = this.state
    const { history } = this.props
    return (
      <ul>
        { records.map((record) => <li onClick={() => history.push('/book/' + record.brn)}>{ record.brn }</li> )}
      </ul>
    )
  }


  render () {
    return (
      <Container>
        <h2>Records</h2>
        { this.renderRecords() }
        <br/>
      </Container>
    )
  }
}

export default withRouter(Index)
