import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import { withStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Axios from "axios";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import QuestionResult from "components/QuestionResult/QuestionResult";

import { grayColor } from "assets/jss/material-dashboard-react.js";
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

export default function SurveyResult(props) {
  const [questions, setQuestions] = useState([]);
  const [rate, setRate] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [freetext, setFreetext] = useState([]);
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const resp = await Axios({
          method: "GET",
          url: "https://survey-ul.info/server/api/teacher/course/75/4",
          headers: {
            "Content-Type": "application/json",
          },
        });
        setRate(resp.data.participation_rate);
        setScore(parseFloat(resp.data.course_score));
        setFreetext(resp.data.free_text);
        setQuestions(resp.data.questions);
      } catch (err) {}
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    if (questions.length) {
      setLoading(false);
    }
  }, [questions]);

  const classes = useStyles();

  return loading ? (
    <CircularProgress />
  ) : (
    <GridContainer>
      <GridItem xs={12} sm={6} md={3}>
        <Card>
          <CardHeader color="warning" stats icon>
            <p className={classes.cardCategory}>Course Score</p>
            <h3 className={classes.cardTitle}></h3>
          </CardHeader>
          <CardBody></CardBody>
        </Card>
      </GridItem>
      {questions.map((question) => (
        <QuestionResult question={question} />
      ))}
      <QuestionResult question={questions[0]} />
    </GridContainer>
  );
}
