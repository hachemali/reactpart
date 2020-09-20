import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Axios from "axios";
import { Context as AuthContext } from "../../context/User";
import { LOGIN_USER } from "../../context/actionTypes";
import campus from "assets/img/campus.jpg";
import Snackbar from "components/Snackbar/Snackbar.js";
import AddAlert from "@material-ui/icons/AddAlert";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: `url("${campus}")`,
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn(props) {
  const classes = useStyles();

  const { setAuthUser } = useContext(AuthContext);

  const [user, setUser] = useState({
    id: "",
    password: "",
    role: "",
  });

  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState();

  const [login, setLogin] = useState(false);

  const updateUser = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };
  const setCookie = (name, value) => {
    const d = new Date();
    d.setTime(d.getTime() + 3 * 24 * 60 * 60 * 100);
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    let resp;
    try {
      resp = await Axios({
        method: "POST",
        url: `https://survey-ul.info/server/api/auth/login`,
        headers: {
          "Content-Type": "application/json",
        },
        data: user,
      });
      setAuthUser({
        action: LOGIN_USER,
        data: { user: resp.data.user, role: resp.data.role },
      });
      setCookie("x_auth_token", resp.data.x_auth_token);
      Axios.defaults.headers.common["x_auth_token"] = resp.data.x_auth_token;

      setLogin(true);
      window.location.reload();
    } catch (error) {
      switch (error.response.status) {
        case 404:
          setMessage("User not found. Please try again");
          break;
        case 401:
          setMessage("Wrong id / password combo. Please try again");
          break;

        default:
          setMessage(
            "An error occured while logging in. Please try again later"
          );
          break;
      }
      setOpen(false);
      setOpen(true);
      console.log(error);
    }
  };

  return login ? (
    <Redirect
      to={{
        pathname: `/`,
      }}
    />
  ) : (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Snackbar
        place={"tc"}
        color={"danger"}
        icon={AddAlert}
        message={message}
        open={open}
        closeNotification={() => setOpen(false)}
        close
      />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={submitHandler}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="id"
              label="ID"
              name="id"
              autoComplete="id"
              autoFocus
              onChange={updateUser}
              value={user.id}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={updateUser}
              value={user.password}
            />
            <InputLabel id="role-label">Choose your level</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              name="role"
              onChange={updateUser}
              value={user.role}
              required
            >
              <MenuItem value={"student"}>Student</MenuItem>
              <MenuItem value={"staff"}>Staff</MenuItem>
            </Select>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/passreset" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
