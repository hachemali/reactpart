import React,{useState} from "react";
// @material-ui/core components
import Axios from 'axios';
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
    new_password_2:"",
  });
  
  const updatePass = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };
  
  const [error, setError] = useState({message: "", isError: false}) 
const submitHandler = async (e) => {
e.preventDefault();
try {
  console.log(user);
const {new_password,new_password_2, old_password} = user;
setError({message: "", isError: false });
if(new_password === new_password_2){
const resp = await Axios({
    method: "POST",
    url: `http://localhost:3001/api/profile/password`,
    headers: {
      "Content-Type": "application/json",
    },
    data: user,
  });
  console.log(resp);
} catch (error) {
  console.log(error.message);
}
} else {
setError({message: "Password mismatch", isError: true})
}
  
};
  const [mail, setMail] = useState({
  new_email: "",
  });
  
  const updateMail = (event) => {
    setMail({ ...mail, [event.target.name]: event.target.value });
  };
  
  const submitHandler2 = async (e) => {
    e.preventDefault();
    try {
      console.log(user);
      const resp = await Axios({
        method: "POST",
        url: `http://localhost:3001/api/profile/email`,
        headers: {
          "Content-Type": "application/json",
        },
        data: mail,
      });
      console.log(resp);
    } catch (error) {
      console.log(error.message);
    }
  };
  
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Edit Email</h4>
              <p className={classes.cardCategoryWhite}>
                Update your current email address
              </p>
            </CardHeader>
            <CardBody>
            <form className={classes.form} noValidate onSubmit={submitHandler2}>
              <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                <TextField
                    label="Email address"
                    id="new_email"
                    fullWidth
                      required
                      name="new_email"
                      autoComplete="new_email"
                      autoFocus
                      onChange={updateMail}
                    
                  />
                </GridItem>
              </GridContainer>
              </form>
            </CardBody>
            <CardFooter>
              <Button color="primary"
              type="submit"
              variant="contained"
              className={classes.submit}>Update Email</Button>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
        <form className={classes.form} noValidate onSubmit={submitHandler}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Edit Password</h4>
              <p className={classes.cardCategoryWhite}>Update your Password</p>
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
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <TextField
                    id="new_password_2"
                    label="Confirm Password"
                    required
                    type="password"
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button type="submit"
              variant="contained"
              color="primary"
              className={classes.submit}>Update Password</Button>
            </CardFooter>
          </Card>
          </form>
        </GridItem>
      </GridContainer>
    </div>
  );
}
