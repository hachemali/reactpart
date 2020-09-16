/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useState, useContext, useEffect } from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";
import Axios from "axios";

// core components
import Admin from "layouts/Admin.js";
import Teacher from "layouts/Teacher";
import SurveyResult from "views/SurveyResult/SurveyResult";
import SignIn from "views/SignIn/SignIn";
import Reset from "views/PassReset/PassReset";
import { Context as AuthContext } from "context/User";
import { LOGIN_USER } from "context/actionTypes";

import "assets/css/material-dashboard-react.css?v=1.9.0";

const hist = createBrowserHistory();

export default function App() {
  const { authUser, setAuthUser } = useContext(AuthContext);
  const [login, setLogin] = useState(false);
  const [cookies, setCookie] = useCookies([]);

  useEffect(() => {
    const checkLogin = async () => {
      if (!authUser.isAuth && cookies.x_auth_token) {
        Axios.defaults.headers.common["x_auth_token"] = cookies.x_auth_token;
        try {
          const resp = await Axios.get(
            `https://survey-ul.info/server/api/auth/check`
          );
          setAuthUser({
            action: LOGIN_USER,
            data: resp.data,
          });
        } catch (err) {
          document.cookie =
            "x_auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          delete Axios.defaults.headers.common["x_auth_token"];
        }
      }
      setLogin(true);
    };
    checkLogin();
  }, []);

  if (login && authUser.isAuth) {
    switch (authUser.user.role) {
      case "student":
        return (
          <Router history={hist}>
            <Switch>
              <Route path="/admin" component={Admin} />
              <Redirect from="/" to="/admin/dashboard" />
            </Switch>
          </Router>
        );
      case "teacher":
        return (
          <Router history={hist}>
            <Switch>
              <Route path="/teacher" component={Teacher} />
              <Redirect from="/" to="/teacher/dashboard" />
            </Switch>
          </Router>
        );
    }
  } else if (login)
    return (
      <Router history={hist}>
        <Switch>
          <Route path="/signin" component={SignIn} />
          <Route path="/passReset" component={Reset} />
          <Redirect from="/" to="/signin" />
        </Switch>
      </Router>
    );
  return "";
}
