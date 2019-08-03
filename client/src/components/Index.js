import React, { Component } from 'react';
import { Container, ListGroup, ListGroupItem, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Badge, Row } from 'reactstrap';
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faSyncAlt, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withRouter } from 'react-router';

import { getRecords, deleteRecord, getLibraries, getLastUpdatedAll, updateAllAvailabilities } from "../Actions";

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      records: [],
      libraries: [],
      filterLibraries: [],
      refreshing: false,
      dropdownOpen: false,
      lastUpdated: null
    }
    this.refresh = this.refresh.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.toggleDropdown = this.toggleDropdown.bind(this)
    this.filterAvailableRecords = this.filterAvailableRecords.bind(this)
    this.filterUnavailableRecords = this.filterUnavailableRecords.bind(this)
    this.isAvailable = this.isAvailable.bind(this)
  }

  componentDidMount() {
    this.refresh()
    getLibraries().then(libraries => this.setState({ libraries }))
  }

  refresh() {
    const a = getRecords().then(records => this.setState({ records }))
    const b = getLastUpdatedAll().then(lastUpdated => this.setState({ lastUpdated: lastUpdated }))
    Promise.all([a, b]).then(() => this.setState({ refreshing: false }))
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

  handleSelect(library) {
    const { filterLibraries } = this.state
    if (filterLibraries.includes(library)) {
      this.setState({ filterLibraries: filterLibraries.filter(lib => lib !== library) })
    } else {
      filterLibraries.push(library)
      filterLibraries.sort()
      this.setState({ filterLibraries })
    }
  }

  toggleDropdown() {
    this.setState(prevState => ({ dropdownOpen: !prevState.dropdownOpen }))
  }

  isAvailable(filterLibraries, availability) {
    return (filterLibraries.length === 0 || filterLibraries.includes(availability.branchName))
        && ['Not On Loan', 'Available'].includes(availability.statusDesc)
  }

  filterAvailableRecords(records) {
    const { filterLibraries } = this.state
    return records.filter(record => record.availabilities.some(availability => {
      return this.isAvailable(filterLibraries, availability)
    }))
  }

  filterUnavailableRecords(records) {
    const { filterLibraries } = this.state
    return records.filter(record => record.availabilities.every(availability => {
      return !(this.isAvailable(filterLibraries, availability))
    }))
  }

  showFilteredRecords(filterFn) {
    const { records } = this.state
    const { history } = this.props
    const availableRecords = filterFn(records)
    return (
      <ListGroup>
        { availableRecords.map((record) =>
          <ListGroupItem key={record.brn}>
            { record.title }
            <FontAwesomeIcon onClick={(event) => this.handleDelete(event, record.brn)} className="float-right pointer hover" icon={faTrashAlt}/>
            <FontAwesomeIcon onClick={() => history.push('/book/' + record.brn)} className=" mr-2 float-right pointer hover" icon={faInfoCircle}/>
          </ListGroupItem> )}
      </ListGroup>
    )
  }

  render () {
    const { refreshing, dropdownOpen, libraries, filterLibraries, lastUpdated } = this.state
    return (
      <Container>
        <Row className="mt-3 ml-2">
          { lastUpdated === null ? null : <p><i>Last updated {lastUpdated} ago</i></p> }
        </Row>
        <Row>
          <Dropdown className="ml-3" isOpen={dropdownOpen} toggle={this.toggleDropdown}>
            <DropdownToggle caret>Filter for libraries</DropdownToggle>
            <DropdownMenu>
              { libraries.map(library => <DropdownItem onClick={() => this.handleSelect(library)} key={library}>{library}</DropdownItem> )}
            </DropdownMenu>
          </Dropdown>
          <Button className="ml-2" disabled={refreshing} color="success" onClick={this.handleUpdate}>
            { refreshing
              ? <div>Refreshing <FontAwesomeIcon icon={faSyncAlt} spin/></div>
              : <div>Refresh <FontAwesomeIcon icon={faSyncAlt}/></div> }
          </Button>
        </Row>
        <Row className="mb-3">
          { filterLibraries.length > 0 ?
            <Container className="mt-2">
              { filterLibraries.map(lib => <Badge className="mt-2 mr-2" color="primary" pill>
                {lib} <span className="pointer" onClick={() => this.handleSelect(lib)}>&times;</span></Badge>) }
            </Container>
            : null }
        </Row>
        <h3 className="ml-1">Available books</h3>
        { this.showFilteredRecords(this.filterAvailableRecords) }
        <br/>
        <h3 className="ml-1">Unavailable books</h3>
        { this.showFilteredRecords(this.filterUnavailableRecords) }
      </Container>
    )
  }
}

export default withRouter(Index)
