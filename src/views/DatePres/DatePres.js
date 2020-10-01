import React, { useState, useEffect, useRef } from "react";
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
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import Snackbar from "components/Snackbar/Snackbar.js";
import AddAlert from "@material-ui/icons/AddAlert";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
  DatePicker,
} from "@material-ui/pickers";

import { grayColor } from "assets/jss/material-dashboard-react.js";
import { BASE_URL, CL_URL } from "../../config";
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

export default function DatePres() {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [choice1, setChoice1] = useState(false);
  const [curBranchset, setCurBranchset] = useState();
  const [curBranchunset, setCurBranchunset] = useState();
  const [br, setBr] = useState("");
  const [brid, setBrid] = useState("");
  const [choice3, setChoice3] = useState(false);
  const [curFac, setCurFac] = useState();
  const [setDates, setSetDates] = useState({});
  const [unsetDates, setUnsetDates] = useState({});
  const [newDates, setNewDates] = useState({});
  const [notification, setNotification] = useState({
    color: "",
    message: "",
    open: false,
  });
  const myRef = useRef(null);
  const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop);
  useEffect(() => {
    const fetchDate = async () => {
      try {
        const resp = await Axios({
          method: "GET",
          url: `${BASE_URL}/dean/getdatepres`,
          headers: {
            "Content-Type": "application/json",
          },
        });
        setFaculties(resp.data);
      } catch (err) {}
    };
    fetchDate();
  }, []);

  useEffect(() => {
    if (faculties.length) {
      faculties.forEach((fac) => {
        fac.branches.forEach((branch) => {
          branch.set_deps.forEach((dep) => {
            let sd = setDates;
            sd[`${branch.branch_name}${dep.department_id}`] = {
              start_date: dep.start_date,
              end_date: dep.end_date,
            };
            setSetDates(sd);
          });
          branch.unset_deps.forEach((dep) => {
            setUnsetDates({
              ...unsetDates,
              [`${branch.branch_name}${dep.department_id}`]: {
                start_date: dep.start_date,
                end_date: dep.end_date,
              },
            });
          });
        });
      });

      setLoading(false);
    }
  }, [faculties]);

  const classes = useStyles();

  const getTableDataBranches = (branches) => {
    return branches.map((br) => [
      br.branch_name,
      `${br.set_count} / ${br.total_count}`,
      <a
        onClick={() =>
          handleClick1(br.set_deps, br.unset_deps, br.branch_name, br.branch_id)
        }
      >
        See Departments
      </a>,
    ]);
  };

  const getTableDataFaculties = (facs) => {
    return facs.map((fac) => [
      fac.faculty_name,
      `${fac.set_count} / ${fac.total_count}`,
      <a onClick={() => handleClick3(fac.branches)}>Branches</a>,
    ]);
  };

  const getTableDataDepsSet = (deps) => {
    return deps.map((dep) => [
      dep.department_name,
      <KeyboardDatePicker
        // disablePast
        disableToolbar
        variant="inline"
        format="P"
        mask=" __/__/____"
        margin="normal"
        label="Date picker"
        value={setDates[`${br}${dep.department_id}`].start_date}
        onChange={(e) => handleDateChange(e, dep.department_id, "start_date")}
        KeyboardButtonProps={{
          "aria-label": "change date",
        }}
      />,
      <KeyboardDatePicker
        disablePast
        disableToolbar
        variant="inline"
        format="P"
        mask=" __/__/____"
        margin="normal"
        label="Date picker"
        value={setDates[`${br}${dep.department_id}`].end_date}
        onChange={(e) => handleDateChange(e, dep.department_id, "end_date")}
        KeyboardButtonProps={{
          "aria-label": "change date",
        }}
      />,
    ]);
  };
  const getTableDataDepsUnset = (deps) => {
    return deps.map((dep) => [
      dep.department_name,
      <KeyboardDatePicker
        // disablePast
        disableToolbar
        variant="inline"
        format="P"
        mask=" __/__/____"
        margin="normal"
        label="Date picker"
        value={unsetDates[`${br}${dep.department_id}`].start_date}
        onChange={(e) => handleDateChange2(e, dep.department_id, "start_date")}
        KeyboardButtonProps={{
          "aria-label": "change date",
        }}
      />,
      <KeyboardDatePicker
        disablePast
        disableToolbar
        variant="inline"
        format="P"
        mask=" __/__/____"
        margin="normal"
        label="Date picker"
        value={unsetDates[`${br}${dep.department_id}`].end_date}
        onChange={(e) => handleDateChange2(e, dep.department_id, "end_date")}
        KeyboardButtonProps={{
          "aria-label": "change date",
        }}
      />,
    ]);
  };

  const handleClick1 = async (set, unset, name, id) => {
    setCurBranchset(set);
    setCurBranchunset(unset);
    setBr(name);
    setBrid(id);
    setChoice1(true);
  };

  const handleClick3 = async (branches) => {
    setCurFac(branches);
    setChoice3(true);
    setChoice1(false);
  };

  const handleDateChange = (e, dep, type) => {
    let cur = setDates[`${br}${dep}`];
    if (type == "start_date") {
      setSetDates({
        ...setDates,
        [`${br}${dep}`]: {
          start_date: e,
          end_date: cur.end_date,
        },
      });
      setNewDates({
        ...newDates,
        [`${br}${dep}`]: {
          department_id: dep,
          branch_id: brid,
          start_date: e,
          end_date: cur.end_date,
        },
      });
    } else {
      setSetDates({
        ...setDates,
        [`${br}${dep}`]: {
          start_date: cur.start_date,
          end_date: e,
        },
      });
      setNewDates({
        ...newDates,
        [`${br}${dep}`]: {
          department_id: dep,
          branch_id: brid,
          start_date: cur.start_date,
          end_date: e,
        },
      });
    }
  };

  const handleDateChange2 = (e, dep, type) => {
    let cur = setDates[`${br}${dep}`];
    if (type == "start_date") {
      setUnsetDates({
        ...unsetDates,
        [`${br}${dep}`]: {
          start_date: e,
          end_date: cur.end_date,
        },
      });
      setNewDates({
        ...newDates,
        [`${br}${dep}`]: {
          department_id: dep,
          branch_id: brid,
          start_date: e,
          end_date: cur.end_date,
        },
      });
    } else {
      setUnsetDates({
        ...unsetDates,
        [`${br}_${dep}`]: {
          start_date: cur.start_date,
          end_date: e,
        },
      });
      setNewDates({
        ...newDates,
        [`${br}${dep}`]: {
          department_id: dep,
          branch_id: brid,
          start_date: cur.start_date,
          end_date: e,
        },
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const resp = await Axios({
        method: "POST",
        url: `${BASE_URL}/dean/setdates`,
        headers: {
          "Content-Type": "application/json",
        },
        data: newDates,
      });
      setNotification({
        color: "",
        message: "",
        open: false,
      });
      setNotification({
        color: "success",
        message: "Dates Changed successfully",
        open: true,
      });
    } catch (error) {
      console.log(error);
      setNotification({
        color: "",
        message: "",
        open: false,
      });
      setNotification({
        color: "danger",
        message:
          "An error occured while updating dates. Please try again later",
        open: true,
      });
    }
  };
  return loading ? (
    <CircularProgress />
  ) : (
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
            <h4 className={classes.cardTitleWhite}>Faculties List</h4>
            <p className={classes.cardCategoryWhite}>
              List of all Faculties at the Lebanese University
            </p>
          </CardHeader>
          <CardBody>
            <Table
              tableHead={["Faculty Name", "Set Date Count", "See Branches"]}
              tableData={getTableDataFaculties(faculties)}
              tableHeaderColor="primary"
            />
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        {choice3 && (
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Branches List</h4>
              <p className={classes.cardCategoryWhite}>
                List of Branches of chosen Faculty
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHead={["Branch City", "Set Date Count", "See Branches"]}
                tableData={getTableDataBranches(curFac)}
                tableHeaderColor="primary"
              />
            </CardBody>
          </Card>
        )}
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        {choice1 && (
          <div ref={myRef}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Card>
                <CardHeader color="primary">
                  <h4 className={classes.cardTitleWhite}>Unset Dates</h4>
                  <p className={classes.cardCategoryWhite}>
                    List of Departments with no currently set survey start date
                  </p>
                </CardHeader>
                <CardBody>
                  <Table
                    tableHead={["Department Name", "Start Date", "End Date"]}
                    tableData={getTableDataDepsUnset(curBranchunset)}
                    tableHeaderColor="primary"
                  />
                </CardBody>
              </Card>
              <Card>
                <CardHeader color="primary">
                  <h4 className={classes.cardTitleWhite}>Departments List</h4>
                  <p className={classes.cardCategoryWhite}>
                    List of Departments in chosen Branch
                  </p>
                </CardHeader>
                <CardBody>
                  <Table
                    tableHead={["Department Name", "Start Date", "End Date"]}
                    tableData={getTableDataDepsSet(curBranchset)}
                    tableHeaderColor="primary"
                  />
                  <Button type="button" color="success" onClick={handleSubmit}>
                    Update New Dates
                  </Button>
                </CardBody>
              </Card>
            </MuiPickersUtilsProvider>
          </div>
        )}
      </GridItem>
    </GridContainer>
  );
}
