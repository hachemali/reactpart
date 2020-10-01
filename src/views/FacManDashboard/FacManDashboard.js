import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Axios from "axios";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import Icon from "@material-ui/core/Icon";
import CircularProgress from "@material-ui/core/CircularProgress";

import { grayColor } from "assets/jss/material-dashboard-react.js";
import { useRadioGroup } from "@material-ui/core";
import { BASE_URL, CL_URL } from "../../config";
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

export default function FacManDashboard() {
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [score, setScore] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [choice, setChoice] = useState(false);
  const [curDep, setCurDep] = useState();
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const resp = await Axios({
          method: "GET",
          url: `${BASE_URL}/manager/departments`,
          headers: {
            "Content-Type": "application/json",
          },
        });
        setDepartments(resp.data);
      } catch (err) {}
    };
    const fetchScore = async () => {
      try {
        const resp = await Axios({
          method: "GET",
          url: `${BASE_URL}/manager/facbranchscore`,
          headers: {
            "Content-Type": "application/json",
          },
        });
        setScore(resp.data.score);
      } catch (err) {}
    };
    fetchDepartments();
    fetchScore();
  }, []);

  useEffect(() => {
    if (score != -1) {
      setLoading(false);
    }
  }, [score]);

  const classes = useStyles();
  const getTableDataDeps = (deps) => {
    return deps.map((dep) => [
      dep.department_name,
      dep.department_score,
      dep.department_participation,
      <a onClick={() => handleClick(dep.department_id)}>See Courses</a>,
    ]);
  };

  const getTableDataCourses = (courses) => {
    return courses.map((course) => [
      course.course_code,
      course.course_name,
      course.course_score,
      course.course_participation,
      <a href={`${CL_URL}/all/course/${course.course_id}/${curDep}`}>
        See Results
      </a>,
    ]);
  };

  const handleClick = async (id) => {
    try {
      const resp = await Axios({
        method: "GET",
        url: `${BASE_URL}/manager/courses/${id}`,
        headers: {
          "Content-Type": "application/json",
        },
      });
      setCourses(resp.data);
      setCurDep(id);
      setChoice(true);
    } catch (err) {}
  };
  return loading ? (
    <CircularProgress />
  ) : (
    <GridContainer>
      <GridItem xs={12} sm={6} md={3}>
        <Card>
          <CardHeader color="warning" stats icon>
            <CardIcon color="warning">
              <Icon>content_copy</Icon>
            </CardIcon>
            <p className={classes.cardCategory}>General Score</p>
            <h3 className={classes.cardTitle}>{score}</h3>
          </CardHeader>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Departments List</h4>
            <p className={classes.cardCategoryWhite}>
              List of Departments in your Faculty
            </p>
          </CardHeader>
          <CardBody>
            <Table
              tableHead={[
                "Department Name",
                "Score",
                "Participation",
                "Courses Link",
              ]}
              tableData={getTableDataDeps(departments)}
              tableHeaderColor="primary"
            />
          </CardBody>
        </Card>
      </GridItem>
      {choice && (
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Courses List</h4>
              <p className={classes.cardCategoryWhite}>
                List of Courses in chosen Department
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHead={[
                  "Course Code",
                  "Course Name",
                  "Score",
                  "Participation",
                  "Survey Link",
                ]}
                tableData={getTableDataCourses(courses)}
                tableHeaderColor="primary"
              />
            </CardBody>
          </Card>
        </GridItem>
      )}
    </GridContainer>
  );
}
