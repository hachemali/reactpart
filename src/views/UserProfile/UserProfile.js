import React, { useState } from "react";
// @material-ui/core components
import Axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import TextField from "@material-ui/core/TextField";
import Snackbar from "components/Snackbar/Snackbar.js";
import AddAlert from "@material-ui/icons/AddAlert";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
};

const useStyles = makeStyles(styles);

export default function UserProfile() {
  const classes = useStyles();
  const [user, setUser] = useState({
    old_password: "",
    new_password: "",
    new_password_2: "",
  });
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("danger");

  const updatePass = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    let resp;
    try {
      const { new_password, new_password_2, old_password } = user;
      if (new_password === new_password_2) {
        resp = await Axios({
          method: "POST",
          url: `https://survey-ul.info/server/api/profile/password`,
          headers: {
            "Content-Type": "application/json",
          },
          data: { new_password, old_password },
        });
        document.getElementById("form").reset();
        setOpen(false);
        setMessage("Password changed successfully!");
        setColor("success");
        setOpen(true);
      } else {
        setOpen(false);
        setMessage("Passwords don't match");
        setColor("danger");
        setOpen(true);
      }
    } catch (error) {
      switch (error.response.status) {
        case 401:
          setOpen(false);
          setMessage("Incorrect password. Please try again");
          setColor("danger");
          setOpen(true);
          break;

        default:
          setOpen(false);
          setMessage("An error occured. Please try again later");
          setColor("danger");
          setOpen(true);
          break;
      }
    }
  };

  return (
    <div>
      <Snackbar
        place={"tc"}
        color={color}
        icon={AddAlert}
        message={message}
        open={open}
        closeNotification={() => setOpen(false)}
        close
      />
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <form
            className={classes.form}
            noValidate
            onSubmit={submitHandler}
            id="form"
          >
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Edit Password</h4>
                <p className={classes.cardCategoryWhite}>
                  Update your Password
                </p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    <TextField
                      id="old_password"
                      label="Old Password"
                      type="password"
                      name="old_password"
                      autoComplete="old_password"
                      required
                      autoFocus
                      onChange={updatePass}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    <TextField
                      id="new_password"
                      label="New Password"
                      required
                      type="password"
                      name="new_password"
                      onChange={updatePass}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <TextField
                      id="new_password_2"
                      label="Confirm Password"
                      required
                      name="new_password_2"
                      type="password"
                      onChange={updatePass}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Update Password
                </Button>
              </CardFooter>
            </Card>
          </form>
        </GridItem>
      </GridContainer>
    </div>
  );
}
