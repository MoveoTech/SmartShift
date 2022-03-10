import React from "react";
import Button from "react-bootstrap/Button";
import "antd/dist/antd.css";
import mondaySdk from "monday-sdk-js";
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
          date: item.column_values[1].text,
          shift: item.column_values[2].text,
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

    debugger;
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
      shifts = {
        date: item.column_values[2].text,
        shift: item.column_values[3].text.split(","),
      };
    });
    status();
  };

  const generateEmployees = async () => {
    let date = shifts.date;
    let shift = shifts.shift[0];
    let person = employeesAvail.filter(
      (employee) => employee.date === date && employee.shift === shift
    );
    // console.log(person[0].personId)
    // let personId = person[0].personId;
    // let id = personId.substring(personId.indexOf("id") + 4);
    // const myArray = id.slice( 0, 8);
    // console.log(myArray); // gmail.com

    // const graphqlQuery = JSON.stringify({
    //   query:
    //     "mutation ($myBoardId:Int!, $myItemId:Int!, $myColumnValues:JSON!) { change_multiple_column_values(item_id:$myItemId, board_id:$myBoardId, column_values: $myColumnValues) { id }}",
    //   variables: JSON.stringify({
    //     myBoardId: globalBoardId,
    //     myItemId: globalItemId,
    //     myColumnValues:
    //       '{"person": {"personAndTeams": [{"id": 27595764, "kind": "person"}, {"id": 27595795, "kind": "person"}, {"id": 27595879, "kind": "person"}]}}',
    //   }),
    // });

    const mondayClient = mondaySdk();

    const val = JSON.stringify({
      person: JSON.stringify({
        personAndTeams: [
          {
            id: "27595764",
            kind: "person"
          },
          {
            id: "27595795",
            kind: "person"
          }
        ]
      })
    })

    const res = await mondayClient.api(
      `mutation { change_multiple_column_values(item_id:2393218204, board_id:2382298614, column_values: \"${val}\") { id }}`,
      // {
      //   variables: JSON.stringify({
      //     myBoardId: globalBoardId,
      //     myItemId: globalItemId,
      //     myColumnValues:
      //       '{"person": {"personAndTeams": [{"id": 27595764, "kind": "person"}, {"id": 27595795, "kind": "person"}, {"id": 27595879, "kind": "person"}]}}',
      //   })
      // }
    )

    // const response = await axios({
    //   url: endpoint,
    //   method: "post",
    //   headers: headers,
    //   body: JSON.stringify({
    //     query:
    //       "mutation ($myBoardId:Int!, $myItemId:Int!, $myColumnValues:JSON!) { change_multiple_column_values(item_id:$myItemId, board_id:$myBoardId, column_values: $myColumnValues) { id }}",
    //     variables: JSON.stringify({
    //       myBoardId: globalBoardId,
    //       myItemId: globalItemId,
    //       myColumnValues:
    //         '{"person": {"personAndTeams": [{"id": 27595764, "kind": "person"}, {"id": 27595795, "kind": "person"}, {"id": 27595879, "kind": "person"}]}}',
    //     }),
    //   }),
    // });

    console.log(res.data);
  };

  const status = async () => {
    console.log(shiftItemData);
    let roles = [];
    console.log(shiftItemData.boards[0].items);
    shiftItemData.boards[0].items.map((item) => {
      roles.push({
        role:
          item.column_values[1].text !== null
            ? item.column_values[1].text.split(",")
            : [],
        shift:
          item.column_values[4].text !== ""
            ? item.column_values[4].text.split(",")
            : [],
      });
    });

    const endpoint = "https://api.monday.com/v2";
    const headers = {
      "content-type": "application/json",
      Authorization: `${ACCESS_TOKEN}`,
    };

    if (roles[0].shift.length === 0) {
      const graphqlQuery = {
        operationName: "fetchAuthor",
        query:
          "mutation ($myBoardId:Int!, $myItemId:Int!, $myColumnValues:JSON!) { change_multiple_column_values(item_id:$myItemId, board_id:$myBoardId, column_values: $myColumnValues) { id }}",
        variables: JSON.stringify({
          myBoardId: globalBoardId,
          myItemId: globalItemId,
          myColumnValues: '{"status1" : {"label" : "None"}}',
        }),
      };

      const response = await axios({
        url: endpoint,
        method: "post",
        headers: headers,
        data: graphqlQuery,
      });

      console.log(response);
    }

    if (roles[0].role.length > roles[0].shift.length) {
      const graphqlQuery = {
        operationName: "fetchAuthor",
        query:
          "mutation ($myBoardId:Int!, $myItemId:Int!, $myColumnValues:JSON!) { change_multiple_column_values(item_id:$myItemId, board_id:$myBoardId, column_values: $myColumnValues) { id }}",
        variables: JSON.stringify({
          myBoardId: globalBoardId,
          myItemId: globalItemId,
          myColumnValues: '{"status1" : {"label" : "Partial"}}',
        }),
      };

      const response = await axios({
        url: endpoint,
        method: "post",
        headers: headers,
        data: graphqlQuery,
      });

      console.log(response);
    }

    if (roles[0].role.length === roles[0].shift.length) {
      const graphqlQuery = {
        operationName: "fetchAuthor",
        query:
          "mutation ($myBoardId:Int!, $myItemId:Int!, $myColumnValues:JSON!) { change_multiple_column_values(item_id:$myItemId, board_id:$myBoardId, column_values: $myColumnValues) { id }}",
        variables: JSON.stringify({
          myBoardId: globalBoardId,
          myItemId: globalItemId,
          myColumnValues: '{"status1" : {"label" : "Complete"}}',
        }),
      };

      const response = await axios({
        url: endpoint,
        method: "post",
        headers: headers,
        data: graphqlQuery,
      });

      console.log(response);
    }
  };

  init();
  return (
    <div className="container">
      <Button onClick={generateEmployees}>Generate Employees</Button>
    </div>
  );
}

export default ManagerForm;
