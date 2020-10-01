import React from "react";
import ReactDOM from "react-dom";
import { CookiesProvider } from "react-cookie";
import { Provider as AuthProvider } from "./context/User";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import App from "./App";

ReactDOM.render(
  <CookiesProvider>
    <AuthProvider>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <App />
      </MuiPickersUtilsProvider>
    </AuthProvider>
  </CookiesProvider>,
  document.getElementById("root")
);
