import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// import Calculator from "./Calculator";
import MathQuillKeyboard from "./MathQuillKeyboard";
// import MathLiveComponent from "./MathLiveComponent";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <Calculator /> */}
    <MathQuillKeyboard />
    {/* <MathLiveComponent /> */}
  </React.StrictMode>
);
