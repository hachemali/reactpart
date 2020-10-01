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
import PaginationTable2 from "components/PaginationTable2/PaginationTable2";
import { BASE_URL } from "../../config";

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

export default function SurveyResultPres(props) {
  const [questions, setQuestions] = useState([]);
  const [rate, setRate] = useState(0);
  const [score, setScore] = useState(0);
  const [participation, setParticipation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [freetext, setFreetext] = useState([]);
  const [courseinfo, setCourseinfo] = useState();
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const resp = await Axios({
          method: "GET",
          url: `${BASE_URL}/teacher/course/${props.match.params.section_id}/${props.match.params.department_id}`,
          headers: {
            "Content-Type": "application/json",
          },
        });
        setRate(resp.data.participation_rate);
        setScore(parseFloat(resp.data.course_score));
        setParticipation(parseFloat(resp.data.participation_rate));
        setFreetext(resp.data.free_text);
        setQuestions(resp.data.questions);
        setCourseinfo(resp.data.course_info);
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
      <GridItem xs={12} sm={12} md={12}>
        <GridContainer>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Course Score</h4>
              </CardHeader>
              <CardBody>
                <b>{score} / 100 </b>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Course Participation</h4>
              </CardHeader>
              <CardBody>
                <b>{participation} % </b>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={6}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Course Info</h4>
              </CardHeader>
              <CardBody>
                <p>
                  <b>Course Code:</b> {courseinfo.course_code}
                </p>
                <p>
                  <b>Course Name:</b> {courseinfo.course_name}
                </p>
                <p>
                  <b>Course Instructor:</b> {courseinfo.instructor}
                </p>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </GridItem>

      {questions.map((question) => (
        <QuestionResult question={question} />
      ))}
      <QuestionResult question={questions[0]} />
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Free Text Inputs</h4>
            <p className={classes.cardCategoryWhite}>
              These are extra comments by the students
            </p>
          </CardHeader>
          <CardBody>
            <PaginationTable2 input={freetext} />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
