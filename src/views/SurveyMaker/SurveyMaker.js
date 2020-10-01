import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Axios from "axios";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import Icon from "@material-ui/core/Icon";
import { BASE_URL, CL_URL } from "../../config";
import { grayColor } from "assets/jss/material-dashboard-react.js";
import Button from "components/CustomButtons/Button.js";

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

export default function SurveyMaker() {
  const classes = useStyles();
  const onClick1 = () => {
    document.location.href = `${CL_URL}/dean/question`;
  };
  const onClick2 = () => {
    document.location.href = `${CL_URL}/dean/list`;
  };
  const onClick3 = () => {
    document.location.href = `${CL_URL}/dean/package`;
  };
  return (
    <GridContainer>
      <GridItem xs>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Question Maker</h4>
            <p className={classes.cardCategoryWhite}>
              View list of questions and add new ones
            </p>
          </CardHeader>
          <CardBody>
            <Button type="button" color="primary" onClick={onClick1}>
              View Questions
            </Button>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>List Maker</h4>
            <p className={classes.cardCategoryWhite}>
              View lists and add new ones
            </p>
          </CardHeader>
          <CardBody>
            <Button type="button" color="primary" onClick={onClick2}>
              View Lists
            </Button>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Survey Maker</h4>
            <p className={classes.cardCategoryWhite}>
              View list of surveys and add new ones
            </p>
          </CardHeader>
          <CardBody>
            <Button type="button" color="primary" onClick={onClick3}>
              View Surveys
            </Button>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
