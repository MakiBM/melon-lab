import React from "react";
import ReactDOM from "react-dom";
import App from "./legacyComponents/app/App";

xit("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
});
