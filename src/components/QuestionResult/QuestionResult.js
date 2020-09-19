import React from "react";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Chart from "react-google-charts";
import { makeStyles } from "@material-ui/core/styles";
import { grayColor } from "assets/jss/material-dashboard-react.js";
import GridContainer from "components/Grid/GridContainer";
import StarIcon from "@material-ui/icons/Star";
import CardIcon from "components/Card/CardIcon.js";

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

export default function QuestionResult(props) {
  const question = props.question;
  const classes = useStyles();
  const getTableData = (q) => {
    let results = [["option", "count"]];
    q.options.forEach((option) => {
      results.push([option.option_description, parseInt(option.count)]);
    });
    return results;
  };

  const getTableData2 = (q) => {
    let results = [[], []];
    q.options.forEach((option) => {
      results[0].push(option.option_description);
      results[1].push(parseInt(option.count));
    });
    return results;
  };
  return (
    <GridItem xs={12} sm={6} md={6}>
      <Card>
        <CardHeader color="primary">
          <h4 className={classes.cardTitleWhite}>
            {question.question_description}
          </h4>
          <p className={classes.cardCategoryWhite}>
            Number of options: {question.options.length}
          </p>
        </CardHeader>
        <CardBody>
          <GridContainer
            direction="column"
            justify="center"
            alignItems="center"
          >
            <GridItem>
              <Chart
                width={"500px"}
                height={"300px"}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={getTableData(question)}
                options={{
                  title: "Answers",
                  // Just add this option
                  is3D: true,
                }}
              />
            </GridItem>

            <GridItem>
              <Card style={{ width: "20rem" }}>
                <CardHeader color="primary" icon>
                  <CardIcon color="primary">
                    <StarIcon />
                  </CardIcon>
                </CardHeader>
                <CardBody>
                  <h4 className={classes.cardTitle}>Question Score</h4>
                  <p>
                    <b>{question.score}</b>
                  </p>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </CardBody>
      </Card>
    </GridItem>
  );
}
