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

export default function ListsPage() {
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [desc, setDesc] = useState("");
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [lists, setLists] = useState([]);
  const [reset, setReset] = useState(0);
  const [q, setQ] = useState({});
  const [w, setW] = useState({});
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
    const fetchLists = async () => {
      try {
        const resp = await Axios({
          method: "GET",
          url: `${BASE_URL}/dean/getlists`,
          headers: {
            "Content-Type": "application/json",
          },
        });
        setLists(resp.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchQusetions();
    fetchLists();
  }, [reset]);

  useEffect(() => {
    if (lists.length && questions.length) {
      setLoading(false);
    }
  }, [lists]);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleOption = (e) => {
    e.preventDefault();
    setOpen(false);
    setOpen2(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClose2 = () => {
    setOpen2(false);
  };

  const handleDesc = (event) => {
    setDesc(event.target.value);
  };
  const handleName = (event) => {
    setTitle(event.target.value);
  };

  const handleCount = (event) => {
    setCount(parseInt(event.target.value));
  };

  const handleSubmit = async () => {
    if (Object.keys(q).length != count || Object.keys(w).length != count) {
      setNotification({
        color: "danger",
        message: "Please fill all fields",
        open: true,
      });
    } else {
      let respon = { list_description: desc, list_name: title, questions: [] };
      for (const [key, value] of Object.entries(q)) {
        respon.questions.push({ id: value, weight: w[key] });
      }

      console.log(respon);
      try {
        const resp = await Axios({
          method: "POST",
          url: `${BASE_URL}/dean/addlist`,
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
          message: "List added successfully",
          open: true,
        });
        setQ({});
        setW({});
      } catch (error) {
        console.log(error);
        setNotification({
          color: "",
          message: "",
          open: false,
        });
        setNotification({
          color: "danger",
          message: "An error occured, please try again",
          open: true,
        });
      }
    }
  };

  const handleQ = (event) => {
    setQ({ ...q, [event.target.name.id]: event.target.value });
  };

  const handleW = (event) => {
    setW({ ...w, [event.target.name.id]: event.target.value });
  };

  const menuItems = () => {
    let output = [];
    for (const question of questions) {
      output.push(
        <MenuItem value={`${question.question_id}`}>
          {question.question_description}
        </MenuItem>
      );
    }
    return output;
  };

  const body = () => {
    let items = [];
    let id;
    for (let i = 1; i <= count; i++) {
      id = parseInt(i);
      items.push(
        <GridItem xs={12} sm={12} md={12}>
          <InputLabel>Question</InputLabel>
          <Select
            id={id}
            value={q[id]}
            onChange={handleQ}
            inputProps={{
              name: { id },
              id: { id },
            }}
          >
            {menuItems()}
          </Select>
        </GridItem>
      );
      items.push(
        <GridItem xs={12} sm={12} md={12}>
          <InputLabel>Weight</InputLabel>
          <Select
            id={id}
            value={w[id]}
            onChange={handleW}
            inputProps={{
              name: { id },
              id: { id },
            }}
          >
            <MenuItem value={0}>0</MenuItem>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
          </Select>
        </GridItem>
      );
    }
    return items;
  };
  const deleteHandle = async (event) => {
    try {
      const resp = await Axios({
        method: "GET",
        url: `${BASE_URL}/dean/removelist/${event.target.name}`,
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
        message: "List deleted successfully",
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
        message: "Cannot delete list since it's part of an active Survey",
        open: true,
      });
      console.log(err);
    }
  };

  const getTableData = (lists) => {
    let output = [];
    for (const list of lists) {
      let out = [];
      out.push(list.list_name);
      out.push(list.list_description);
      out.push(
        <Button onClick={deleteHandle} name={list.list_id} color="danger">
          Remove List
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
            <h4 className={classes.cardTitleWhite}>List Maker</h4>
            <p className={classes.cardCategoryWhite}>
              Add a new list of questions
            </p>
          </CardHeader>
          <CardBody>
            <Button type="button" color="primary" onClick={handleOpen}>
              Add List
            </Button>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Add List</DialogTitle>
              <form onSubmit={handleOption}>
                <DialogContent>
                  <DialogContentText>
                    To add a new list, enter the list name and description and
                    the number of questions in the list
                  </DialogContentText>

                  <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="name"
                    label="List Name"
                    inputProps={{ maxLength: 30 }}
                    onChange={handleName}
                    fullWidth
                  />
                  <TextField
                    required
                    autoFocus
                    margin="dense"
                    id="desc"
                    label="List description"
                    inputProps={{ maxLength: 100 }}
                    onChange={handleDesc}
                    fullWidth
                  />
                  <InputLabel id="num_quest">Number of questions</InputLabel>
                  <Select
                    labelId="num_quest"
                    id="num_quest"
                    value={count}
                    onChange={handleCount}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={6}>6</MenuItem>
                    <MenuItem value={7}>7</MenuItem>
                    <MenuItem value={8}>8</MenuItem>
                    <MenuItem value={9}>9</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                  </Select>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Cancel
                  </Button>
                  <Button type="submit" color="primary">
                    Continue
                  </Button>
                </DialogActions>
              </form>
            </Dialog>
            <Dialog
              open={open2}
              onClose={handleClose2}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Add Questions</DialogTitle>
              <DialogContent>
                <DialogContentText>Add the list questions</DialogContentText>
                <GridContainer>{body()}</GridContainer>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose2} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary">
                  Add List
                </Button>
              </DialogActions>
            </Dialog>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Lists</h4>
            <p className={classes.cardCategoryWhite}>
              Here are all current lists
            </p>
          </CardHeader>
          <CardBody>
            {!loading && (
              <Table
                tableHead={["List Name", "List Description", "Delete"]}
                tableData={getTableData(lists)}
                tableHeaderColor="primary"
              />
            )}
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
