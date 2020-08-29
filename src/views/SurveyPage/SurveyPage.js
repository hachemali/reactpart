import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import Icon from "@material-ui/core/Icon";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

import { grayColor } from "assets/jss/material-dashboard-react.js";
const GreenRadio = withStyles({
  root: {
    color: green[400],
    '&$checked': {
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
  const [students, setstudents] = useState([]);
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const resp = await Axios({
          method: "GET",
          url: "http://localhost:3000/student/course/"+props.match.params.student.section_id/+props.match.params.studentDepartment_id,
          headers: {
            "Content-Type": "application/json",
          },
        });
        setstudents(resp.data);
      } catch (err) {}
    };
    fetchStudents();
  }, []);
  handleRadio = (value) => this.setState({ complaintTypeId: value })
  const classes = useStyles();
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Survey</h4>
            <p className={classes.cardCategoryWhite}>
              Check answers carefully
            </p>
          </CardHeader>
          <CardBody>
            <form className={classes.root} noValidate autoComplete="off">
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <p>QUESTION HERE</p>
                </GridItem>
              </GridContainer>
              <GridContainer>
              <div>
              {this.props.student.options.option_description.map(function (complaintType){
                return <label key={complaintType.student.options.option_id}>
                <input type="radio"
                value={complaintType.student.options.option_id}
                name="option"
                key={complaintType.student.options.option_id}
                onChange={(event)=>this.props.handleRadio(event.target.value)}/>
                </label>
              },this)}
            </div>
              </GridContainer>
            </form>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
