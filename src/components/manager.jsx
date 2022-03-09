import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "antd/dist/antd.css";
import { useState } from "react";
import mondaySdk from "monday-sdk-js";
import { useEffect } from "react";

function ManagerForm() {
  const fetch = require("node-fetch");

  const [newItem, setNewItem] = useState({
    id: "",
    // name: "",
    department: "",
    role: [],
    date: "",
    shift: "Morning",
    person: [],
  });

  useEffect(() => {
    const monday = mondaySdk();
    monday.listen("context", (res) => {
      setNewItem({ ...newItem, id: res.data.itemId });
    });
  }, []);

  // let query= `query{ boards(ids:2382298614){items (ids: ${newItem.id}) { name} } }`
  // let name= fetch ("https://api.monday.com/v2", {
  //   method: 'post',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization' : "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjE0OTQxMzU2NywidWlkIjoyNzY4NjQxMywiaWFkIjoiMjAyMi0wMy0wN1QxMzo1ODo1OC4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTEwMjMyOCwicmduIjoidXNlMSJ9.nv5EkOYruDh2KcuEH5ySf2Bb8kCnnZShfj0ouF6bm4Q",

  //    },
  //    body: JSON.stringify({
  //      query : query
  //    })
  //   })
  //    .then(res => res.json())
  //    .then(res => console.log(JSON.stringify(res, null, 2)));

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(newItem);

    var updateItem = `mutation {change_multiple_column_values (item_id: ${newItem.id}, board_id: 2382298614, column_values: \"{\\\"department8\\\": {\\\"label\\\":\\\"${newItem.department}\\\"},\\\"shift\\\": {\\\"label\\\":\\\"${newItem.shift}\\\"},\\\"dropdown\\\":\\\"${newItem.role}\\\",\\\"date4\\\": {\\\"date\\\":\\\"${newItem.date}\\\"}}\") {id}}`;

    fetch("https://api.monday.com/v2", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjE0OTQxMzU2NywidWlkIjoyNzY4NjQxMywiaWFkIjoiMjAyMi0wMy0wN1QxMzo1ODo1OC4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTEwMjMyOCwicmduIjoidXNlMSJ9.nv5EkOYruDh2KcuEH5ySf2Bb8kCnnZShfj0ouF6bm4Q",
      },
      body: JSON.stringify({
        query: updateItem,
      }),
    })
      .then((res) => res.json())
      .then((res) => console.log(JSON.stringify(res, null, 2)));
  };

  const addSelect = () => {
    var original = document.getElementById("role");
    console.log(original)
    var clone = original.cloneNode(true); // "deep" clone
    // clone.id = "role" + 1; // there can only be one element with an ID
    original.parentNode.appendChild(clone);
  };

  return (
    <div className="container">
      {/* <h2>Task Name: {newItem.name} </h2>
      <br /> */}

      <Form onSubmit={handleSubmit}>
        {/* <InputGroup controlId="formBasicEmail">
          <Form.Label>Name</Form.Label>
          <Form.Control
            required
            type="text"
            // value={itemName}
            onChange={(event) => {
              setNewItem({ ...newItem, name: event.target.value });
            }}
          />
        </InputGroup> */}

        <InputGroup>
          <Form.Label>Department</Form.Label>
          <Form.Select
            required
            onChange={(event) => {
              setNewItem({ ...newItem, department: event.target.value });
            }}
          >
            <option>Choose your department</option>
            <option value="Alfa">Alfa</option>
            <option value="Bravo">Bravo</option>
            <option value="Boost">Boost</option>
          </Form.Select>
        </InputGroup>

        <Form.Group className="role_group">
        <Form.Label>Role</Form.Label>
        <div id="select-wrapper" className="select-wrapper">
          <InputGroup className="role" id="role">

              <Form.Select
                id="roles"
                required
                aria-label="Default select example"
                        onChange={(event) => {
                    const newRole = [...newItem.role];
                    newRole.push(event.target.value);
                    console.log(newRole)
                  setNewItem({ ...newItem, role: newRole});
                }}
              >
                <option>Define</option>
                <option value="Designer">Designer</option>
                <option value="Developer">Developer</option>
                <option value="PM">PM</option>
              </Form.Select>
           
            <Form.Control id="number" required type="number" defaultValue={1} />
      
          </InputGroup>
          </div>
          <button className="addRole" onClick={addSelect}>
            {" "}
            + Add Role
          </button>
        </Form.Group>

        <InputGroup>
          <Form.Label>Date</Form.Label>
          <Form.Control
            required
            type="date"
            onChange={(event) => {
              setNewItem({ ...newItem, date: event.target.value });
            }}
          />
        </InputGroup>

        <InputGroup>
          <Form.Label>Shift</Form.Label>
          <Form.Select
            aria-label="Default select example"
            required
            onChange={(event) => {
              console.log(event.target.value);
              setNewItem({ ...newItem, shift: event.target.value });
            }}
          >
            <option defaultValue value="Morning">
              Morning
            </option>
            <option value="Evening">Evening</option>
          </Form.Select>
        </InputGroup>

        <Button variant="primary" type="submit">
          Find available employees
        </Button>
      </Form>
    </div>
  );
}

export default ManagerForm;
