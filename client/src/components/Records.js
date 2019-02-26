import React, { Component } from 'react';
import { Container, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getRecords, createRecord } from "../Actions";

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
    getRecords().then(records => this.setState({ records, submitting: false }))
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
          <Button disabled={submitting}>
            Submit { submitting ? <FontAwesomeIcon icon={faSpinner} spin/> : null }
          </Button>
        </Form>
        <br/>
      </Container>
    )
  }
}

export default Records