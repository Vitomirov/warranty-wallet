import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/Styles.scss";
import "react-datepicker/dist/react-datepicker.css";
import App from "./App.jsx";

import("./features/auth/LogIn");
import("./features/auth/SignUp");

console.log("Rendering main.jsx");

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
