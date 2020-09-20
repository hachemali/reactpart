import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import { withStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Axios from "axios";
import Button from "@material-ui/core/Button";
import Snackbar from "components/Snackbar/Snackbar.js";
import AddAlert from "@material-ui/icons/AddAlert";

import { grayColor } from "assets/jss/material-dashboard-react.js";
const GreenRadio = withStyles({
  root: {
    color: green[400],
    "&$checked": {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);
const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardCategory: {
    color: grayColor[0],
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    paddingTop: "10px",
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
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
  cardTitle: {
    color: grayColor[2],
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: grayColor[1],
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};

const useStyles = makeStyles(styles);

export default function SurveyPage(props) {
  const [lists, setLists] = useState([]);
  const [teacher, setTeacher] = useState({});
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rates, setRates] = useState({});
  const [freetext, setFreetext] = useState("");
  const [result, setresult] = useState({});
  const [redirect, setRedirect] = useState(false);
  const [notification, setNotification] = useState({
    color: "",
    message: "",
    open: false,
  });
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const resp = await Axios({
          method: "GET",
          url: `https://survey-ul.info/server/api/student/course/${props.match.params.section_id}/${props.match.params.Department_id}`,
          headers: {
            "Content-Type": "application/json",
          },
        });
        setLists(resp.data.lists);
        setTeacher(resp.data.teacher);
      } catch (err) {}
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    lists.forEach((list) => {
      list.questions.forEach((question) => {
        let temp = answers;
        temp.push({
          question_id: question.question_id,
          weight: parseInt(question.weight),
          number_options: question.number_options,
          rate: "1",
        });
        setAnswers(temp);
        temp = rates;
        let val = question.question_id;
        temp[val] = 1;
        setRates(temp);
      });
    });
    if (lists.length) {
      setLoading(false);
    }
  }, [lists]);

  useEffect(() => {
    if (Object.keys(result).length) {
      const sendSurvey = async () => {
        try {
          const resp = await Axios({
            method: "POST",
            url: `https://survey-ul.info/server/api/student/course/${props.match.params.section_id}`,
            headers: {
              "Content-Type": "application/json",
            },
            data: result,
          });
          setRedirect(true);
        } catch (error) {
          setNotification({
            color: "danger",
            message:
              "An error occured while submitting survey. Please try again",
            open: true,
          });
          console.log(error.message);
        }
      };
      sendSurvey();
    }
  }, [result]);

  const handleChange = (event) => {
    setRates({ ...rates, [event.target.name]: parseInt(event.target.value) });
  };

  const handleChange2 = (event) => {
    setFreetext(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let temp = answers;
    temp.forEach((answer) => {
      answer.rate = rates[answer.question_id];
    });
    setresult({
      teacher_id: teacher.teacher_id,
      free_text: freetext,
      answers: temp,
    });
  };

  const classes = useStyles();
  if (redirect) {
    return (
      <Redirect
        to={{
          pathname: "/admin/dashboard",
          state: {
            color: "success",
            message: "Survey submitted successfully",
          },
        }}
      />
    );
  }

  return loading ? (
    <p>Loading</p>
  ) : (
    <div>
      <Snackbar
        place={"tc"}
        color={notification.color}
        icon={AddAlert}
        message={notification.message}
        open={notification.open}
        closeNotification={() =>
          setNotification({ color: "", message: "", open: false })
        }
        close
      />
      <GridContainer justify="center" alignItems="center">
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Survey Questionnaire</h4>
              <p className={classes.cardCategoryWhite}>
                Check answers carefully
              </p>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs>
                  <b>Course Code:</b> {props.match.params.code}{" "}
                </GridItem>
                <GridItem xs>
                  <b>Course Name:</b> {props.match.params.name}{" "}
                </GridItem>
                <GridItem xs>
                  <b>Course Instructor:</b> {teacher.first_name}{" "}
                  {teacher.last_name}
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
        <form
          className={classes.root}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <FormControl component="fieldset">
            {lists.map((list) => {
              let ans = list.questions.map((q) => {
                return (
                  <GridItem xs={12} sm={12} md={12}>
                    <Card>
                      <CardHeader color="primary">
                        <h4 className={classes.cardTitleWhite}>
                          {q.question_description}
                        </h4>
                        <p className={classes.cardCategoryWhite}></p>
                      </CardHeader>
                      <CardBody>
                        <RadioGroup
                          name={String(q.question_id)}
                          value={rates[q.question_id]}
                          onChange={handleChange}
                        >
                          {q.options.map((opt, count) => {
                            return (
                              <FormControlLabel
                                value={count + 1}
                                control={<Radio />}
                                label={opt.option_description}
                              />
                            );
                          })}
                        </RadioGroup>
                      </CardBody>
                    </Card>
                  </GridItem>
                );
              });
              return ans;
            })}
            <GridItem xs={12}>
              <Card>
                <CardHeader color="primary">
                  <h4 className={classes.cardTitleWhite}>
                    Enter any additional comments here (optional)
                  </h4>
                  <p className={classes.cardCategoryWhite}>
                    Warning: The free text input section is not completely
                    anonymous, if your comment is innapropriate it will be
                    reported and your ID will be known.
                  </p>
                </CardHeader>
                <CardBody>
                  <TextField
                    id="free_text"
                    variant="outlined"
                    fullWidth
                    onChange={handleChange2}
                    label="Add any comments here"
                    multiline={true}
                    color="secondary"
                    inputProps={{ maxLength: 500 }}
                  />
                </CardBody>
              </Card>
            </GridItem>
            <GridItem xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Submit Survey
              </Button>
            </GridItem>
          </FormControl>
        </form>
      </GridContainer>
    </div>
  );
}
