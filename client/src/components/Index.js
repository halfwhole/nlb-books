import React, { Component } from 'react';
import { Container, ListGroup, ListGroupItem, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Badge, Row, Col } from 'reactstrap';
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withRouter } from 'react-router';

import { getRecords, deleteRecord, getLibraries, updateAllAvailabilities } from "../Actions";

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      records: [],
      libraries: [],
      filterLibraries: [],
      refreshing: false,
      dropdownOpen: false
    }
    this.refresh = this.refresh.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.toggleDropdown = this.toggleDropdown.bind(this)
    this.filterAvailableRecords = this.filterAvailableRecords.bind(this)
    this.filterUnavailableRecords = this.filterUnavailableRecords.bind(this)
  }

  componentDidMount() {
    this.refresh()
    getLibraries().then(libraries => this.setState({ libraries }))
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

  handleSelect(library) {
    const { filterLibraries } = this.state
    if (filterLibraries.includes(library)) {
      this.setState({ filterLibraries: filterLibraries.filter(lib => lib != library) })
    } else {
      filterLibraries.push(library)
      filterLibraries.sort()
      this.setState({ filterLibraries })
    }
  }

  toggleDropdown() {
    this.setState(prevState => ({ dropdownOpen: !prevState.dropdownOpen }))
  }

  filterAvailableRecords(records) {
    const { filterLibraries } = this.state
    return records.filter(record => record.availabilities.some(availability => {
      return (filterLibraries.length === 0 ? true : filterLibraries.includes(availability.branchName)) && availability.statusDesc === "Not On Loan"
    }))
  }

  filterUnavailableRecords(records) {
    const { filterLibraries } = this.state
    return records.filter(record => record.availabilities.every(availability => {
      return !((filterLibraries.length === 0 ? true : filterLibraries.includes(availability.branchName)) && availability.statusDesc === "Not On Loan")
    }))
  }

  showFilteredRecords(filterFn) {
    const { records } = this.state
    const { history } = this.props
    const availableRecords = filterFn(records)
    return (
      <ListGroup>
        { availableRecords.map((record) =>
          <ListGroupItem key={record.brn} onClick={() => history.push('/book/' + record.brn)}>
            <strong>{ record.brn }</strong> { record.title }
            <FontAwesomeIcon onClick={(event) => this.handleDelete(event, record.brn)} className="float-right pointer hover" icon={faTrashAlt}/>
          </ListGroupItem> )}
      </ListGroup>
    )
  }

  render () {
    const { refreshing, dropdownOpen, libraries, filterLibraries } = this.state
    return (
      <Container>
        <Row className="mt-3 ml-2">
          <p>Last updated ... (todo)</p>
        </Row>
        <Row>
          <Dropdown className="ml-3" isOpen={dropdownOpen} toggle={this.toggleDropdown}>
            <DropdownToggle caret>Filter for libraries</DropdownToggle>
            <DropdownMenu>
              { libraries.map(library => <DropdownItem onClick={() => this.handleSelect(library)} key={library}>{library}</DropdownItem> )}
            </DropdownMenu>
          </Dropdown>
          <Button className="ml-2" disabled={refreshing} color="success" onClick={this.handleUpdate}>
            Refresh <FontAwesomeIcon icon={faSyncAlt}/>
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
        <h3>Available books</h3>
        { this.showFilteredRecords(this.filterAvailableRecords) }
        <br/>
        <h3>Unavailable books</h3>
        { this.showFilteredRecords(this.filterUnavailableRecords) }
      </Container>
    )
  }
}

export default withRouter(Index)
