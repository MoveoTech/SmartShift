import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from 'react-bootstrap/InputGroup'
function ManagerForm() {
  return (
    <div className="App">
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Name</Form.Label>
          <Form.Control type="email" placeholder="Task Name" />
        </Form.Group>

        <InputGroup className="mb-3">
        <Form.Label>Role</Form.Label>
          <Form.Select aria-label="Default select example">
            <option>Define</option>
            <option value="Designer">Designer</option>
            <option value="Developer">Developer</option>
            <option value="PM">PM</option>
          </Form.Select>
          <InputGroup.Text id="basic-addon2">Quantity</InputGroup.Text>
        </InputGroup>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Role</Form.Label>
          <Form.Select aria-label="Default select example">
            <option>Define</option>
            <option value="Designer">Designer</option>
            <option value="Developer">Developer</option>
            <option value="PM">PM</option>
          </Form.Select>

          <Form.Select aria-label="Default select example">
            <option defaultValue={1}>1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Date</Form.Label>
          <Form.Control type="date" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Hours</Form.Label>
          <Form.Control type="password" />
        </Form.Group>

        <Button variant="primary" type="submit">
          Find available employees
        </Button>
      </Form>
    </div>
  );
}

export default ManagerForm;
