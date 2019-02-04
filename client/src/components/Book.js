import React, { Component } from 'react';
import { Container, Table } from 'reactstrap';
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { getBRNAvailability, getRecord } from "../Actions";

class Book extends Component {
  constructor(props) {
    super(props)
    this.state = {
      availability: null,
      record: null
    }
  }

  componentDidMount() {
    const { brn } = this.props.match.params
    getBRNAvailability(brn, (availability) => this.setState({ availability }))
    // TODO: ideally, this page should retrieve from _record_, not by querying NLB directly
    getRecord(brn, (record) => this.setState({ record }))
  }

  showContent() {
    const { availability } = this.state
    if (availability.length === 0) return
    return availability.map((item) =>
      <tr key={item.ItemNo}>
        <td>{ item.BranchName }</td>
        <td>{ item.CallNumber }</td>
        <td>{ item.StatusDesc }</td>
        <td>{ item.StatusCode }</td>
      </tr>)
  }

  render () {
    const { availability, record } = this.state
    const { brn } = this.props.match.params
    return (
      <Container>
        <p><strong>BRN: </strong>{ brn }</p>
        { record === null ? <div>Loading record details... <FontAwesomeIcon icon={faSpinner} spin/></div> :
          <div>
            <p><strong>Author: </strong>{ record.author }</p>
            <p><strong>Title: </strong>{ record.title }</p>
          </div>
        }
        { availability === null ? <div>Loading availability... <FontAwesomeIcon icon={faSpinner} spin/></div> :
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
            {this.showContent()}
            </tbody>
          </Table>
        }
        <h2> JSON dump</h2>
        {JSON.stringify(availability)}
      </Container>
    )
  }
}

export default Book

