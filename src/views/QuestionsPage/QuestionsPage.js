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
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Table from "components/Table/Table.js";
import Snackbar from "components/Snackbar/Snackbar.js";
import AddAlert from "@material-ui/icons/AddAlert";

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

export default function QuestionsPage() {
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [numopts, setNumopts] = React.useState(1);
  const [options, setOptions] = React.useState({});
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [reset, setReset] = useState(0);
  const [notification, setNotification] = useState({
    color: "",
    message: "",
    open: false,
  });

  const classes = useStyles();

  useEffect(() => {
    const fetchQusetions = async () => {
      try {
        const resp = await Axios({
          method: "GET",
          url: `${BASE_URL}/dean/getquestions`,
          headers: {
            "Content-Type": "application/json",
          },
        });
        setQuestions(resp.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchQusetions();
  }, [reset]);

  useEffect(() => {
    if (questions.length) {
      setLoading(false);
    }
  }, [questions]);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleOption = () => {
    setOpen(false);
    setOpen2(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClose2 = () => {
    setOptions({});
    setOpen2(false);
  };

  const handleChange = (event) => {
    setNumopts(event.target.value);
  };

  const handleDesc = (event) => {
    setDesc(event.target.value);
  };

  const handleDesc2 = (event) => {
    setOptions({ ...options, [event.target.id]: event.target.value });
  };

  const handleSubmit = async () => {
    let respon = { question_description: desc, options: [] };
    for (const [key, value] of Object.entries(options)) {
      respon.options.push(value);
    }
    console.log(respon);
    try {
      const resp = await Axios({
        method: "POST",
        url: `${BASE_URL}/dean/addquestion`,
        headers: {
          "Content-Type": "application/json",
        },
        data: respon,
      });
      setReset(reset + 1);
      setOpen2(false);
      setNotification({
        color: "",
        message: "",
        open: false,
      });
      setNotification({
        color: "success",
        message: "Question added successfully",
        open: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const body = () => {
    let items = [];
    let id;
    for (let i = 1; i <= numopts; i++) {
      id = `${i}`;
      items.push(
        <TextField
          autoFocus
          margin="dense"
          id={id}
          label="Option description"
          inputProps={{ maxLength: 500 }}
          onChange={handleDesc2}
          fullWidth
        />
      );
    }
    return items;
  };
  const deleteHandle = async (event) => {
    try {
      const resp = await Axios({
        method: "GET",
        url: `${BASE_URL}/dean/removequestion/${event.target.name}`,
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLoading(true);
      setReset(reset + 1);
      setNotification({
        color: "",
        message: "",
        open: false,
      });
      setNotification({
        color: "success",
        message: "Question deleted successfully",
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
        message: "Cannot delete question since it's part of an active Survey",
        open: true,
      });
      console.log(err);
    }
  };

  const getTableData = (questions) => {
    let output = [];
    for (const question of questions) {
      let out = [];
      out.push(question.question_description);
      out.push(
        <Button
          onClick={deleteHandle}
          name={question.question_id}
          color="danger"
        >
          Remove question
        </Button>
      );
      output.push(out);
    }
    return output;
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
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Question Maker</h4>
            <p className={classes.cardCategoryWhite}>
              View list of questions and add new ones
            </p>
          </CardHeader>
          <CardBody>
            <Button type="button" color="primary" onClick={handleOpen}>
              Add Question
            </Button>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Add Question</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  To add a new question, enter the question description and
                  number of options
                </DialogContentText>
                <InputLabel id="num_opt">Number of options</InputLabel>
                <Select
                  labelId="num_opt"
                  id="num_opt"
                  value={numopts}
                  onChange={handleChange}
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                </Select>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Question description"
                  inputProps={{ maxLength: 500 }}
                  onChange={handleDesc}
                  fullWidth
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleOption} color="primary">
                  Continue
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={open2}
              onClose={handleClose2}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Add Options</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Add the question option descriptions, starting with the worst
                  one up to the best.
                </DialogContentText>
                {body()}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose2} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary">
                  Add Question
                </Button>
              </DialogActions>
            </Dialog>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Questions</h4>
            <p className={classes.cardCategoryWhite}>
              Here is the list of questions
            </p>
          </CardHeader>
          <CardBody>
            {!loading && (
              <Table
                tableHead={["Question Description", "Delete"]}
                tableData={getTableData(questions)}
                tableHeaderColor="primary"
              />
            )}
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
