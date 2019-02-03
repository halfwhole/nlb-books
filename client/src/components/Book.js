import React, { Component } from 'react';
import { Container, Table } from 'reactstrap';
import { getRecord } from "../Actions";

class Book extends Component {
  constructor(props) {
    super(props)
    this.state = {
      content: []
    }
  }

  componentDidMount() {
    const { brn } = this.props.match.params
    getRecord(brn, (content) => this.setState({ content }))
    // TODO: ideally, this page should retrieve from _record_, not by querying NLB directly
  }

  showContent() {
    const { content } = this.state
    if (content.length === 0) return;
    return content.map((item) =>
      <tr key={item.ItemNo}>
        <td>{ item.BranchName }</td>
        <td>{ item.CallNumber }</td>
        <td>{ item.StatusDesc }</td>
        <td>{ item.StatusCode }</td>
      </tr>)
  }

  render () {
    const { content } = this.state
    const { brn } = this.props.match.params
    return (
      <Container>
        <p>This is the book page for { brn }.</p>
        <Table>
          <thead>
          <tr>
            <th>BranchName</th>
            <th>CallNumber</th>
            <th>StatusDesc</th>
            <th>StatusCode</th>
          </tr>
          </thead>
          <tbody>
          { this.showContent() }
          </tbody>
        </Table>
        <h2>JSON dump</h2>
        { JSON.stringify(content) }
      </Container>
    )
  }
}

export default Book

