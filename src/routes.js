/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import LibraryBooks from "@material-ui/icons/LibraryBoo ks";
import Unarchive from "@material-ui/icons/Unarchive";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import TeacherDashboard from "views/TeacherDashboard/TeacherDashboard";
import UserProfile from "views/UserProfile/UserProfile.js";
import SurveyPage from "views/SurveyPage/SurveyPage";
import SurveyResult from "views/SurveyResult/SurveyResult";
// core components/views for RTL layout

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin",
    role: "student",
    visible: true,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: TeacherDashboard,
    layout: "/teacher",
    role: "teacher",
    visible: true,
  },
  {
    path: "/user",
    name: "User Profile",
    icon: Person,
    component: UserProfile,
    layout: "/admin",
    role: "all",
    visible: true,
  },
  {
    path: "/student/:section_id/:Department_id",
    name: "Survey",
    icon: Unarchive,
    component: SurveyPage,
    layout: "/admin",
    role: "student",
    visible: false,
  },
  {
    path: "/course/:section_id/:department_id",
    name: "Results",
    icon: Unarchive,
    component: SurveyResult,
    layout: "/teacher",
    role: "teacher",
    visible: false,
  },
];

export default dashboardRoutes;
