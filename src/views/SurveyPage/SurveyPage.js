import React, { useState, useEffect } from "react";
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
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const resp = await Axios({
          method: "GET",
          url: "https://survey-ul.info/server/api/student/course/66/1",
          headers: {
            "Content-Type": "application/json",
            x_auth_token:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDAsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNTk5MjE1MjE3LCJleHAiOjE1OTk0NzQ0MTd9.enQZyspGWUnYAZnKdRDFrrEG0FegiR4Ts6F1VpXgrLQ",
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
    console.log(result);
    if (Object.keys(result).length) {
      const fetchStudents = async () => {
        try {
          const resp = await Axios({
            method: "POST",
            url: "https://survey-ul.info/server/api/student/course/66",
            headers: {
              "Content-Type": "application/json",
              x_auth_token:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDAsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNTk5MjE1MjE3LCJleHAiOjE1OTk0NzQ0MTd9.enQZyspGWUnYAZnKdRDFrrEG0FegiR4Ts6F1VpXgrLQ",
            },
            data: result,
          });
          console.log(resp);
        } catch (error) {
          console.log(error.message);
        }
      };
      // DO NOT REMOVE THIS COMMENT
      fetchStudents();
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

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        {loading ? (
          <p>Loading</p>
        ) : (
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Survey</h4>
              <p className={classes.cardCategoryWhite}>
                Check answers carefully
              </p>
            </CardHeader>
            <CardBody>
              <form
                className={classes.root}
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
              >
                <GridContainer>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">SURVEY</FormLabel>
                    {lists.map((list) => {
                      let ans = list.questions.map((q) => {
                        return (
                          <div>
                            <p> {q.question_description}</p>
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
                          </div>
                        );
                      });
                      return ans;
                    })}
                    <TextField
                      id="free_text"
                      variant="outlined"
                      onChange={handleChange2}
                      label="Add notes here"
                      multiline={true}
                      color="secondary"
                    />
                    <Button
                      type="submit"
                      variant="outlined"
                      color="primary"
                      className={classes.button}
                    >
                      Check Answers
                    </Button>
                  </FormControl>
                </GridContainer>
              </form>
            </CardBody>
          </Card>
        )}
      </GridItem>
    </GridContainer>
  );
}
