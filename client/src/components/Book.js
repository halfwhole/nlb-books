import React, { Component } from 'react';
import { Container, Table, Button } from 'reactstrap';
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { getRecord, updateAvailabilities } from "../Actions";

class Book extends Component {
  constructor(props) {
    super(props)
    this.state = {
      availabilities: null,
      record: null,
      refreshing: false
    }
    this.refresh = this.refresh.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
  }

  componentDidMount() {
    this.refresh()
  }

  refresh() {
    const { brn } = this.props.match.params
    getRecord(brn).then(record => {
      this.setState({ record, availabilities: record.availabilities, refreshing: false })
    })
  }

  handleUpdate() {
    const { brn } = this.props.match.params
    this.setState({ refreshing: true })
    updateAvailabilities(brn).then(this.refresh)

  }

  showContent() {
    const { availabilities } = this.state
    if (availabilities.length === 0) return
    return availabilities.map((availability, index) =>
      <tr key={index}>
        <td>{ availability.branchName }</td>
        <td>{ availability.callNumber }</td>
        <td>{ availability.statusDesc }</td>
      </tr>)
  }

  render () {
    const { availabilities, record, refreshing } = this.state
    const { brn } = this.props.match.params
    return (
      <Container>
        <Button color="success" disabled={refreshing} onClick={this.handleUpdate}>Refresh</Button>
        <p><strong>BRN: </strong>{ brn }</p>
        { record === null ? <div>Loading record details... <FontAwesomeIcon icon={faSpinner} spin/></div> :
          record.error ? <p>Error: { record.errorMessage }</p> :
          <div>
            <p><strong>Author: </strong>{ record.author }</p>
            <p><strong>Title: </strong>{ record.title }</p>
          </div>
        }
        { availabilities === null ? <div>Loading availabilities... <FontAwesomeIcon icon={faSpinner} spin/></div> :
          availabilities.error ? <p>Error: { availabilities.errorMessage }</p> :
          <Table>
            <thead>
            <tr>
              <th>BranchName</th>
              <th>CallNumber</th>
              <th>StatusDesc</th>
            </tr>
            </thead>
            <tbody>
            {this.showContent()}
            </tbody>
          </Table>
        }
      </Container>
    )
  }
}

export default Book
