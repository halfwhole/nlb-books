import React, { Component } from 'react'; import { Container, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withRouter } from 'react-router';
import { getRecords, deleteRecord, updateAllAvailabilities } from "../Actions";

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      records: [],
      refreshing: false
    }
    this.handleUpdate = this.handleUpdate.bind(this)
    this.refresh = this.refresh.bind(this)
  }

  componentDidMount() {
    this.refresh()
  }

  refresh() {
    getRecords().then(records => this.setState({ records, refreshing: false }))
  }

  handleUpdate() {
    this.setState({ refreshing: true })
    updateAllAvailabilities().then(this.refresh)
  }

  handleDelete(event, brn) {
    const { refreshing } = this.state
    if (refreshing) return;
    this.setState({ refreshing: true })
    event.stopPropagation()
    deleteRecord(brn).then(this.refresh)
  }

  filterAvailableRecords(records) {
    return records.filter(record => record.availabilities.some(availability => availability.statusDesc === "Not On Loan"))
  }

  filterUnavailableRecords(records) {
    return records.filter(record => record.availabilities.every(availability => !(availability.statusDesc === "Not On Loan")))
  }

  showAvailableRecords() {
    const { records } = this.state
    const { history } = this.props
    const availableRecords = this.filterAvailableRecords(records)
    return (
      <ListGroup>
        { availableRecords.map((record) =>
          <ListGroupItem key={record.brn} onClick={() => history.push('/book/' + record.brn)}>
            <strong>{ record.brn }</strong> { record.title }
            <FontAwesomeIcon onClick={(event) => this.handleDelete(event, record.brn)} className="float-right pointer" icon={faTrashAlt}/>
          </ListGroupItem> )}
      </ListGroup>
    )
  }

  showUnavailableRecords() {
    const { records } = this.state
    const { history } = this.props
    const unavailableRecords = this.filterUnavailableRecords(records)
    return (
      <ListGroup>
        { unavailableRecords.map((record) =>
          <ListGroupItem key={record.brn} onClick={() => history.push('/book/' + record.brn)}>
            <strong>{ record.brn }</strong> { record.title }
            <FontAwesomeIcon onClick={(event) => this.handleDelete(event, record.brn)} className="float-right pointer" icon={faTrashAlt}/>
          </ListGroupItem> )}
      </ListGroup>
    )
  }

  render () {
    const { refreshing } = this.state
    return (
      <Container>
        <p>
          Last updated ... (todo)
          <Button className="float-right" disabled={refreshing} color="success" onClick={this.handleUpdate}>
            Refresh <FontAwesomeIcon icon={faSyncAlt}/>
          </Button>
        </p>
        <h3>Filter</h3>
        <p>(todo)</p>
        <h3>Available books</h3>
        { this.showAvailableRecords() }
        <br/>
        <h3>Unavailable books</h3>
        { this.showUnavailableRecords() }
      </Container>
    )
  }
}

export default withRouter(Index)
