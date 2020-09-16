/*eslint-disable*/
import React, { useContext } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { NavLink, Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";
import Axios from "axios";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";
import Button from "components/CustomButtons/Button.js";

// core components
import AdminNavbarLinks from "components/Navbars/AdminNavbarLinks.js";
import { Context as AuthContext } from "../../context/User";
import { LOGOUT_USER } from "../../context/actionTypes";

import styles from "assets/jss/material-dashboard-react/components/sidebarStyle.js";

const useStyles = makeStyles(styles);

export default function Sidebar(props) {
  const [removeCookie] = useCookies([]);
  const { authUser, setAuthUser } = useContext(AuthContext);
  const classes = useStyles();
  // verifies if routeName is the one active (in browser input)
  function activeRoute(routeName) {
    return window.location.href.indexOf(routeName) > -1 ? true : false;
  }
  const { color, image, logoText, routes, role } = props;

  const logout = (event) => {
    event.preventDefault();
    document.cookie =
      "x_auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    delete Axios.defaults.headers.common["x_auth_token"];
    setAuthUser({
      action: LOGOUT_USER,
      payload: null,
    });

    return <Redirect to="/" />;
  };

  var links = (
    <List className={classes.list}>
      {routes
        .filter((route) => role.includes(route.role))
        .filter((route) => route.visible)
        .map((prop, key) => {
          var activePro = " ";
          var listItemClasses;
          if (prop.path === "/upgrade-to-pro") {
            activePro = classes.activePro + " ";
            listItemClasses = classNames({
              [" " + classes[color]]: true,
            });
          } else {
            listItemClasses = classNames({
              [" " + classes[color]]: activeRoute(prop.layout + prop.path),
            });
          }
          const whiteFontClasses = classNames({
            [" " + classes.whiteFont]: activeRoute(prop.layout + prop.path),
          });
          return (
            <NavLink
              to={prop.layout + prop.path}
              className={activePro + classes.item}
              activeClassName="active"
              key={key}
            >
              <ListItem button className={classes.itemLink + listItemClasses}>
                {typeof prop.icon === "string" ? (
                  <Icon
                    className={classNames(classes.itemIcon, whiteFontClasses)}
                  >
                    {prop.icon}
                  </Icon>
                ) : (
                  <prop.icon
                    className={classNames(classes.itemIcon, whiteFontClasses)}
                  />
                )}
                <ListItemText
                  primary={prop.name}
                  className={classNames(classes.itemText, whiteFontClasses)}
                  disableTypography={true}
                />
              </ListItem>
            </NavLink>
          );
        })}
      <ListItem button>
        <Button type="button" color="danger" onClick={logout}>
          Logout
        </Button>
      </ListItem>
    </List>
  );
  var brand = (
    <div className={classes.logo}>
      <a
        href="https://www.ul.edu.lb/"
        className={classNames(classes.logoLink)}
        target="_blank"
      >
        {logoText}
      </a>
    </div>
  );

  return (
    <div>
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          anchor="right"
          open={props.open}
          classes={{
            paper: classNames(classes.drawerPaper),
          }}
          onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>
            <AdminNavbarLinks />
            {links}
          </div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image + ")" }}
            />
          ) : null}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          anchor="left"
          variant="permanent"
          open
          classes={{
            paper: classNames(classes.drawerPaper),
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>{links}</div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image + ")" }}
            />
          ) : null}
        </Drawer>
      </Hidden>
    </div>
  );
}

Sidebar.propTypes = {
  handleDrawerToggle: PropTypes.func,
  bgColor: PropTypes.oneOf(["purple", "blue", "green", "orange", "red"]),
  logo: PropTypes.string,
  image: PropTypes.string,
  logoText: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  open: PropTypes.bool,
};
