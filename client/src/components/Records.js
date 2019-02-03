import React, { Component } from 'react';
import { Container, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { getRecords, createRecord, deleteRecord } from "../Actions";

class Records extends Component {

  constructor(props) {
    super(props)
    this.state = {
      brn: '',
      records: []
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.getRecords()
  }

  getRecords() {
    getRecords(content => this.setState({ records: content }))
  }

  handleChange(event) {
    this.setState({ brn: event.target.value })
  }

  handleSubmit(event) {
    const { brn } = this.state
    event.preventDefault()
    createRecord(brn, () => { this.getRecords() })
  }

  showRecords() {
    const { records } = this.state
    return (
      <ul>
        { records.map((record) =>
          <li key={record.brn}>
            { record.brn }&nbsp;
            <Button color="danger" onClick={() => deleteRecord(record.brn, () => { this.getRecords() })}>Delete</Button>
          </li>
        )}
      </ul>
    )
  }

  render () {
    return (
      <Container>
        <h2>Add Record</h2>
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="brn">BRN</Label>
            <Input type="number" value={this.state.brn} onChange={this.handleChange} name="brn" id="brn"/>
          </FormGroup>
          <Button>Submit</Button>
        </Form>
        <br/>
        <h2>Current Records</h2>
        {this.showRecords()}
      </Container>
    )
  }
}

export default Records