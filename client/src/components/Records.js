import React, { Component } from 'react';
import { Container, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getRecords, createRecord, deleteRecord } from "../Actions";

class Records extends Component {

  constructor(props) {
    super(props)
    this.state = {
      brn: '',
      records: null,
      submitting: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.refresh = this.refresh.bind(this)
  }

  componentDidMount() {
    this.refresh()
  }

  // once submitted, gets records (again), then sets submitting back to false. to be called after every api action
  refresh() {
    getRecords().then(records => this.setState({ records }))
    this.setState({ submitting: false })
  }

  handleChange(event) {
    this.setState({ brn: event.target.value })
  }

  handleSubmit(event) {
    const { brn } = this.state
    event.preventDefault()
    this.setState({ submitting: true })
    createRecord(brn).then(this.refresh)
  }

  handleDelete(brn) {
    this.setState({ submitting: true })
    deleteRecord(brn).then(this.refresh)
  }

  showRecords() {
    const { records, submitting } = this.state
    return (
      <ul>
        { records === null ? <div>Loading records... <FontAwesomeIcon icon={faSpinner} spin/></div> :
          records.map((record) =>
            <li key={record.brn}>
            { record.brn }&nbsp;
            <Button color="danger" onClick={() => this.handleDelete(record.brn)} disabled={submitting}>Delete</Button>
            </li>
          )
        }
      </ul>
    )
  }

  render() {
    const { submitting } = this.state
    return (
      <Container>
        <h2>Add Record</h2>
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="brn">BRN</Label>
            <Input type="number" value={this.state.brn} onChange={this.handleChange} name="brn" id="brn"/>
          </FormGroup>
          <Button disabled={submitting}>Submit</Button>
        </Form>
        <br/>
        <h2>Current Records</h2>
        {this.showRecords()}
      </Container>
    )
  }
}

export default Records