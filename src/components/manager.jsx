import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { TimePicker } from "antd";
import moment from "moment";
import "antd/dist/antd.css";
import { useState } from "react";

function ManagerForm() {
    const fetch = require("node-fetch");
  const [newItem, setNewItem] = useState({
    // name: "",
    department: "",
    role: [],
    date: "",
    shift: "Morning",
    person: [],
  });


//  query {items_by_column_values (board_id: 2382298614, column_id: "name", column_value: "Task2") { id name }}

let query= "query{ boards(ids:2382298614){items{id name} } }"

  fetch ("https://api.monday.com/v2", {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization' : 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjE0OTQxMzU2NywidWlkIjoyNzY4NjQxMywiaWFkIjoiMjAyMi0wMy0wN1QxMzo1ODo1OC4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTEwMjMyOCwicmduIjoidXNlMSJ9.nv5EkOYruDh2KcuEH5ySf2Bb8kCnnZShfj0ouF6bm4Q'
     },
     body: JSON.stringify({
       'query' : query
     })
    })
     .then(res => res.json())
     .then(res => {
      console.log(res.data)})

//   let query = "query { items (ids: [2382298682]) { name }}";

//   fetch("https://api.monday.com/v2", {
//     method: "post",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization:
//         "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjE0OTQxMzU2NywidWlkIjoyNzY4NjQxMywiaWFkIjoiMjAyMi0wMy0wN1QxMzo1ODo1OC4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTEwMjMyOCwicmduIjoidXNlMSJ9.nv5EkOYruDh2KcuEH5ySf2Bb8kCnnZShfj0ouF6bm4Q",
//     },
//     body: JSON.stringify({
//       query: query,
//     }),
//   })
//     .then((res) => res.json())
//     .then((res) => {
//       setItemName(res.data.items[0].name);
//     });


  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(newItem);


//     fetch ("https://api.monday.com/v2", {
//   method: 'post',
//   headers: {
//     'Content-Type': 'application/json',
//     Authorization:
//           "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjE0OTQxMzU2NywidWlkIjoyNzY4NjQxMywiaWFkIjoiMjAyMi0wMy0wN1QxMzo1ODo1OC4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTEwMjMyOCwicmduIjoidXNlMSJ9.nv5EkOYruDh2KcuEH5ySf2Bb8kCnnZShfj0ouF6bm4Q",
//   },
//   body: JSON.stringify({
//     query : "mutation ($myBoardId:Int!, $myItemId:Int!, $myColumnValues:JSON!) { change_multiple_column_values(item_id:$myItemId, board_id:$myBoardId, column_values: $myColumnValues) { id } }",
//     variables : JSON.stringify({
//       myBoardId: 2382298614,
//       myItemId: 2388545340,
//       myColumnValues: `{\"name\" : \"${newItem.name}\"}`
//     })
//   })
// })

    var updateItem = `mutation {change_multiple_column_values (item_id: 2388545340, board_id: 2382298614, column_values: \"{\\\"department8\\\": {\\\"label\\\":\\\"${newItem.department}\\\"},\\\"shift\\\": {\\\"label\\\":\\\"${newItem.shift}\\\"},\\\"dropdown\\\":\\\"${newItem.role}\\\",\\\"date4\\\": {\\\"date\\\":\\\"${newItem.date}\\\"}}\") {id}}`;

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

  const addSelect= ()=>{

    var original = document.getElementById('roles');
    var clone = original.cloneNode(true); // "deep" clone
   clone.id = "roles" + 1; // there can only be one element with an ID
    original.parentNode.appendChild(clone);
  }

  return (
    <div className="container">
      {/* <h2>Add task requirements</h2>
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
<InputGroup className="role">
          <Form.Label>Role</Form.Label>
          <div id="select-wrapper" class="select-wrapper">
          <Form.Select
           id="roles"
            required
            aria-label="Default select example"
            onChange={(event) => {
              setNewItem({ ...newItem, role: event.target.value });
            }}
          >
            <option>Define</option>
            <option value="Designer">Designer</option>
            <option value="Developer">Developer</option>
            <option value="PM">PM</option>
          </Form.Select>
          </div>
          <Form.Control required type="number" defaultValue={1} />

        </InputGroup>
        <Button variant="light" onClick={addSelect}> + Add Role</Button> 
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
            <option selected value="Morning">
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
