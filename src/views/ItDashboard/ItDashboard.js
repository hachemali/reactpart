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
import { useCookies } from "react-cookie";
import Snackbar from "components/Snackbar/Snackbar.js";
import AddAlert from "@material-ui/icons/AddAlert";
import Button from "@material-ui/core/Button";

import { grayColor } from "assets/jss/material-dashboard-react.js";
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

export default function ItDashboard(props) {
  const [cookies] = useCookies([]);
  const [text, settext] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    color: "",
    message: "",
    open: false,
  });
  useEffect(() => {
    const fetchtext = async () => {
      try {
        const resp = await Axios({
          method: "GET",
          url: `${BASE_URL}/it/gettext`,
          headers: {
            "Content-Type": "application/json",
          },
        });
        settext(resp.data);
        console.log(resp.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchtext();
  }, []);

  useEffect(() => {
    if (text.length) {
      setLoading(false);
    }
  }, [text]);
  const classes = useStyles();

  const deleteHandle = async (event) => {
    let data = { id: event.target.id };
    try {
      const resp = await Axios({
        method: "POST",
        url: `${BASE_URL}/it/remove`,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      });
      setNotification({
        color: "",
        message: "",
        open: false,
      });
      setNotification({
        color: "success",
        message: "Log handled successfully",
        open: true,
      });
    } catch (err) {
      setNotification({
        color: "",
        message: "",
        open: false,
      });
      setNotification({
        color: "danger",
        message: "Error removing log",
        open: true,
      });
      console.log(err);
    }
  };
  const getTableData = (text) => {
    let courses = [];
    for (const inp of text) {
      let course = [];
      course.push(inp.text);
      course.push(inp.reason);
      course.push(
        <Button onClick={deleteHandle} id={inp.id} color="success">
          Validate
        </Button>
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
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Available Surveys</h4>
            <p className={classes.cardCategoryWhite}>
              Here is the list of free text entries the president flagged for
              checking
            </p>
          </CardHeader>
          <CardBody>
            {!Loading && (
              <Table
                tableHead={["Free Text", "Reason", "Validate"]}
                tableData={getTableData(text)}
                tableHeaderColor="primary"
              />
            )}
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
