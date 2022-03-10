import React from "react";
import Button from "react-bootstrap/Button";
import "antd/dist/antd.css";
import mondaySdk from "monday-sdk-js";
import './manager.css'
const axios = require("axios");

const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjE0OTQxMzU2NywidWlkIjoyNzY4NjQxMywiaWFkIjoiMjAyMi0wMy0wN1QxMzo1ODo1OC4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTEwMjMyOCwicmduIjoidXNlMSJ9.nv5EkOYruDh2KcuEH5ySf2Bb8kCnnZShfj0ouF6bm4Q";

function ManagerForm() {
  const endpoint = "https://api.monday.com/v2";
  const headers = {
    "content-type": "application/json",
    Authorization: `${ACCESS_TOKEN}`,
  };
  const employeesAvail = [];
  let shiftItemData = [];
  let shifts = {};
  let globalBoardId;
  let globalItemId;

  const init = () => {
    mondayContext();
    fetchBoards();
  };

  const fetchBoards = async () => {
    let availBoardId;

    const graphqlQuery = {
      operationName: "fetchAuthor",
      query: `query{ boards {id name}}`,
      variables: {},
    };

    const response = await axios({
      url: endpoint,
      method: "post",
      headers: headers,
      data: graphqlQuery,
    });

    availBoardId = response.data.data.boards.find(
      (board) => board.name === "Availability"
    ).id;
    fetchAvailBoard(availBoardId);
    fetchShifts();
  };

  const fetchAvailBoard = async (board_id) => {
    const graphqlQuery = {
      operationName: "fetchAuthor",
      query: `{boards(ids: ${board_id}) {groups {id title items (limit: 15) {id name column_values {id title text value}}}}}`,
      variables: {},
    };

    const response = await axios({
      url: endpoint,
      method: "post",
      headers: headers,
      data: graphqlQuery,
    });

    response.data.data.boards[0].groups.forEach((group) => {
      group.items.forEach((item) => {
        employeesAvail.push({
          personId: item.column_values[0].value,
          name: item.column_values[0].text,
          date: item.column_values[2].text,
          role:
            item.column_values[1].text === null
              ? []
              : item.column_values[1].text.split(","),
          shift:
            item.column_values[3].text === null
              ? []
              : item.column_values[3].text.replace(/\s/g, "").split(","),
        });
      });
    });
  };

  const mondayContext = () => {
    const monday = mondaySdk();

    monday.listen("context", async (res) => {
      globalItemId = res.data.itemId;
      globalBoardId = res.data.boardId;
    });
  };

  const fetchShifts = async () => {
    const graphqlQuery = {
      operationName: "fetchAuthor",
      query: `query{ boards(ids:${globalBoardId}){items (ids: ${globalItemId}) {id name column_values {id title text}}} }`,
      variables: {},
    };

    const response = await axios({
      url: endpoint,
      method: "post",
      headers: headers,
      data: graphqlQuery,
    });

    shiftItemData = response.data.data;
    response.data.data.boards[0].items.forEach((item) => {
      console.log(item);
      shifts = {
        date: item.column_values[1].text,
        shift: item.column_values[2].text.split(","),
        role:
          item.column_values[0].text === null
            ? []
            : item.column_values[0].text.split(",").map(x=> x.trim()),
      };
    });
 
  };

  const generateEmployees = async () => {
    let date = shifts.date;
    let shift = shifts.shift;
    let role = shifts.role

    let person = employeesAvail.filter(
      (employee) =>
        employee.date === date &&
        employee.shift.some((r) => shift.indexOf(r) >= 0) &&
        employee.role.some((r) => role.includes(r))
    );

    let employees = person.map((x) => {
      let id = x.personId.substring(x.personId.indexOf("id") + 4);
      const myArray = id.slice(0, 8);
      let obj = {
        id: myArray,
      };
      return obj;
    });

    let employeesArr = [];

    employees.forEach((employee, i) => {
      employeesArr.push(
        `{\\\"id\\\" :${employee.id},\\\"kind\\\":\\\"person\\\"}`
      );
    });
let status="";
if(role){
  if(role.length ===person.length){
    console.log("complete")
    status="Complete"
  }
  if(role.length >person.length){
    console.log("partial")
    status="Partial"
  }

  if(person.length===0){
    console.log("none")
    status="None"
  }
}
    

    console.log(status)

    const graphqlQuery = {
      operationName: "fetchAuthor",
      query: ` mutation {
        change_multiple_column_values(item_id:${globalItemId}, board_id:${globalBoardId}, column_values: "{\\\"person\\\" : {\\\"personsAndTeams\\\":[${employeesArr.toString()}]}, \\\"status6\\\": {\\\"label\\\": \\\"${status}\\\"}}") {
          id
        }
      }`,
    };

    const response = await axios({
      url: endpoint,
      method: "post",
      headers: headers,
      data: graphqlQuery,
    });

    console.log(response)
  };



  init();
  return (
    <div className="container" id="btnCon">
      <Button id="generateBtn" onClick={generateEmployees}>Generate Employees</Button>
    </div>
  );
}

export default ManagerForm;
