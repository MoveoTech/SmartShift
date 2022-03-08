import React, { useEffect, useState } from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css"
//Explore more Monday React Components here: https://style.monday.com/
import AttentionBox from "monday-ui-react-core/dist/AttentionBox.js"
import ManagerForm from "./components/manager";

let employees = [];

let query = 'query { boards (ids:2381712326) {name columns { title type } items {column_values { id text }}}}';

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
    console.log(res.data)
    employees = res.data.boards});

const monday = mondaySdk();
// monday.setToken('eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjE0OTQxMzU2NywidWlkIjoyNzY4NjQxMywiaWFkIjoiMjAyMi0wMy0wN1QxMzo1ODo1OC4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTEwMjMyOCwicmduIjoidXNlMSJ9.nv5EkOYruDh2KcuEH5ySf2Bb8kCnnZShfj0ouF6bm4Q')
// monday.oauth({clientId:'171c7a6221dabf3951dc245aa5750e30'});

function App() {

  return (

   <div className="App">
<ManagerForm/>
</div>
  );
}

export default App;


