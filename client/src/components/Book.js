import React, { Component } from 'react';
import { Container, Table, Button, Row, Col } from 'reactstrap';
import { faSpinner, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { getRecord, updateAvailabilities, getLastUpdated } from "../Actions";

class Book extends Component {
  constructor(props) {
    super(props)
    this.state = {
      availabilities: null,
      record: null,
      refreshing: false,
      lastUpdated: null,
      showAvailableOnly: false
    }
    this.refresh = this.refresh.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
  }

  componentDidMount() {
    this.refresh()
  }

  refresh() {
    const { brn } = this.props.match.params
    const a = getRecord(brn).then(record => {
      this.setState({ record, availabilities: record.availabilities })
    })
    const b = getLastUpdated(brn).then(lastUpdated => {
      this.setState({ lastUpdated: lastUpdated })
    })
    Promise.all([a, b]).then(() => this.setState({ refreshing: false }))
  }

  handleUpdate() {
    const { brn } = this.props.match.params
    this.setState({ refreshing: true })
    updateAvailabilities(brn).then(this.refresh)
  }

  showContent() {
    const { availabilities, showAvailableOnly } = this.state
    if (availabilities.length === 0) return
    return availabilities
      // TODO: refactor this 'Available', 'Not On Loan' into another common location?
      .filter((availability) => !showAvailableOnly || ['Available', 'Not On Loan'].includes(availability.statusDesc))
      .map((availability, index) =>
        <tr key={index}>
          <td>{ availability.branchName }</td>
          <td>{ availability.callNumber }</td>
          <td>{ availability.statusDesc }</td>
        </tr>)
  }

  render () {
    const { availabilities, record, refreshing, lastUpdated, showAvailableOnly } = this.state
    const { brn } = this.props.match.params
    const { history } = this.props
    return (
      <Container>
        <Row className="mt-2">
          <Col>
            <strong>BRN: </strong>{ brn }
          </Col>
          <Col>
            <Button className="float-right" onClick={() => history.push('/')}>
              Back
            </Button>
            <Button className="float-right mr-2" onClick={() => this.setState({ showAvailableOnly: !showAvailableOnly })}>
              { showAvailableOnly ? 'Show All' : 'Show Available Only' }
            </Button>
            <Button color="success" className="float-right mr-2" disabled={refreshing} onClick={this.handleUpdate}>
              { refreshing
                ? <div>Refreshing <FontAwesomeIcon icon={faSyncAlt} spin/></div>
                : <div>Refresh <FontAwesomeIcon icon={faSyncAlt}/></div> }
            </Button>
          </Col>
        </Row>
        { record === null ? <div>Loading record details... <FontAwesomeIcon icon={faSpinner} spin/></div> :
          record.error ? <p>Error: { record.errorMessage }</p> :
          <div>
            <p><strong>Author: </strong>{ record.author }</p>
            <p><strong>Title: </strong>{ record.title }</p>
            <p><i>Last updated { lastUpdated } ago</i></p>
          </div>
        }
        { availabilities === null ? <div>Loading availabilities... <FontAwesomeIcon icon={faSpinner} spin/></div> :
          availabilities.error ? <p>Error: { availabilities.errorMessage }</p> :
          <Table>
            <thead>
            <tr>
              <th>Branch name</th>
              <th>Call number</th>
              <th>Status</th>
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
