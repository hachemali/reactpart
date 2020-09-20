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
import { useCookies } from "react-cookie";
import Snackbar from "components/Snackbar/Snackbar.js";
import AddAlert from "@material-ui/icons/AddAlert";

import { grayColor } from "assets/jss/material-dashboard-react.js";
import { useRadioGroup } from "@material-ui/core";

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

export default function Dashboard(props) {
  const [cookies] = useCookies([]);
  const [students, setstudents] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [done, setDone] = useState();
  const [total, setTotal] = useState();
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
          url: "https://survey-ul.info/server/api/student/courses",
          headers: {
            "Content-Type": "application/json",
          },
        });
        setstudents(resp.data.surveys);
        setDone(resp.data.voted_count);
        setTotal(resp.data.total_courses);
      } catch (err) {
        console.log(err);
      }
    };
    fetchStudents();
    if (props.location.state) {
      setNotification({
        color: props.location.state.color,
        message: props.location.state.message,
        open: true,
      });
    }
  }, []);

  useEffect(() => {
    if (students.length) {
      setLoading(false);
    }
  }, [students]);
  const classes = useStyles();
  const getTableData = (students) => {
    let courses = [];
    for (const student of students) {
      let course = [];
      course.push(student.course_code);
      course.push(student.course_name);
      course.push(
        <a
          href={`http://localhost:3000/admin/student/course/${student.section_id}/${student.department_id}/${student.course_code}/${student.course_name}`}
        >
          {student.course_code}
        </a>
      );
      courses.push(course);
    }
    return courses;
  };

  return (
    <GridContainer>
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
      <GridItem xs={12} sm={6} md={3}>
        <Card>
          <CardHeader color="warning" stats icon>
            <CardIcon color="warning">
              <Icon>content_copy</Icon>
            </CardIcon>
            <p className={classes.cardCategory}>Completed surveys</p>
            <h3 className={classes.cardTitle}>
              {done}/{total}
            </h3>
          </CardHeader>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Available Surveys</h4>
            <p className={classes.cardCategoryWhite}>
              Here are the remaining surveys to submit
            </p>
          </CardHeader>
          <CardBody>
            {!Loading && (
              <Table
                tableHead={["Course Code", "Course Name", "Survey Link"]}
                tableData={getTableData(students)}
                tableHeaderColor="primary"
              />
            )}
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
