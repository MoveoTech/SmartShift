import React, { useEffect, useState } from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css"
//Explore more Monday React Components here: https://style.monday.com/
import ManagerForm from "./components/manager";

function App() {

  return (

   <div className="App">
<ManagerForm/>
</div>
  );
}

export default App;


