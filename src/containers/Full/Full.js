import React, { Component } from 'react';
import { Link, Switch, Route, Redirect } from 'react-router-dom';
import { Container } from 'reactstrap';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';
/** components import* */
import Dashboard from '../../views/Dashboard/';
import User from '../../views/Users/User/';
import Role from '../../views/Users/Role/';
import Reports from '../../views/Reports/Reports';
import Attendance from '../../views/Attendance/Attendance';
import Session from '../../views/Sessions/Session';
import Events from '../../views/Events/Events';
import Registration from '../../views/Registration/Registration';
import Rooms from '../../views/Rooms/Rooms';
import RegistrationList from '../../views/RegistrationList/registrationList';
import Attendee from '../../views/Attendee/Attendee';
import Speakers from '../../views/Speakers/Speakers';
import AttendeeReport from '../../views/Reports/Attendee Report/AttendeeReport';
import SessionReport from '../../views/Reports/Sessions Report/SessionReport';
import SessionsReport from '../../views/Reports/Sessions/sessions';
import AboutUs from '../../views/Static/AboutUs/AboutUs';
import LocationDetails from '../../views/Static/Location/Location';
import AboutEternus from '../../views/Static/AboutEternus/AboutEternus';
import HelpDesk from '../../views/Static/HelpDesk/HelpDesk';
import Sponsor from '../../views/Sponsor/Sponsor';
import Logout from '../../views/Pages/logOut/';
import * as firebase from 'firebase';
import 'firebase/firestore';
import InitialQuestions from '../../views/InitialQuestions/InitialQuestions';
import DynamicQuestions from '../../views/Questions/DynamicQuestions';
import SessionRegistration from '../../views/SessionRegistration/SessionRegistration';


class Full extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authUser: false,
      initialLoad: true,
      roles: [],
      isAdmin: false
    }
  }
  componentWillMount() {
    let thisRef = this;
    const roleItems = localStorage.getItem("roles");
    if (roleItems !== null) {
      const roles = localStorage.getItem("roles").split(",");
      roles.forEach(role => {
        if (role === 'Admin') {
          this.setState({
            isAdmin: true
          })
        }
      })
    }

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        thisRef.setState({
          authUser: true,
          initialLoad: false
        })
      }
      else {
        thisRef.setState({
          authUser: false,
          initialLoad: false
        })
      }
    }, function (err) {
      console.log("err", err);
    });
  }
  render() {
    if (!this.state.initialLoad) {
      if (this.state.authUser == true) {
        return (
          <div className="app">
            <Header />
            <div className="app-body">
              <Sidebar {...this.props} />
              <main className="main">
                <Breadcrumb />
                <Container fluid>
                  <Switch>
                    <Route isAdmin={this.state.isAdmin} path="/dashboard" name="Dashboard" component={Dashboard} />
                    <Route isAdmin={this.state.isAdmin} path="/user" name="User" component={User} />
                    <Route isAdmin={this.state.isAdmin} path="/role" name="Role" component={Role} />
                    <Route isAdmin={this.state.isAdmin} path="/events" name="Events" component={Events} />
                    <Route isAdmin={this.state.isAdmin} path='/registration' name='Registration' component={Registration} />
                    <Route isAdmin={this.state.isAdmin} path='/attendance' name='Attendance' component={Attendance} />
                    <Route isAdmin={this.state.isAdmin} path='/session' name='Session' component={Session} />
                    <Route isAdmin={this.state.isAdmin} path='/rooms' name='Rooms' component={Rooms} />
                    <Route isAdmin={this.state.isAdmin} path='/registrationList' name='Registration List' component={RegistrationList} />
                    <Route isAdmin={this.state.isAdmin} path='/attendee' name='Attendee' component={Attendee} />
                    <Route isAdmin={this.state.isAdmin} path='/speakers' name='Speakers' component={Speakers} />
                    <Route isAdmin={this.state.isAdmin} path='/attendeeReport' name='Attendee Report' component={AttendeeReport} />
                    <Route isAdmin={this.state.isAdmin} path='/sessionReport' name='Session Report' component={SessionReport} />
                    <Route isAdmin={this.state.isAdmin} path='/sessionsReport' name='Session Report' component={SessionsReport} />
                    <Route isAdmin={this.state.isAdmin} path='/staticPages/aboutUs' name='AboutUs' component={AboutUs} />
                    <Route isAdmin={this.state.isAdmin} path='/staticPages/locationDetails' name='location Details' component={LocationDetails} />
                    <Route isAdmin={this.state.isAdmin} path='/staticPages/aboutEternus' name='AboutEternusSoltions' component={AboutEternus} />
                    <Route isAdmin={this.state.isAdmin} path='/staticPages/helpDesk' name='HelpDesk' component={HelpDesk} />
                    <Route isAdmin={this.state.isAdmin} path='/sponsor' name='Sponsor' component={Sponsor} />
                    <Route isAdmin={this.state.isAdmin} path='/logOut' name='logOut' component={Logout} />
                    <Route isAdmin={this.state.isAdmin} path='/initialQuestions' name='Initial Questions' component={InitialQuestions} />
                    <Route isAdmin={this.state.isAdmin} path='/dynamicQuestions' name='Dynamic Questions' component={DynamicQuestions} />
                    <Route isAdmin={this.state.isAdmin} path='/sessionRegistration' name='Session Registration' component={SessionRegistration} />
                    <Redirect from="/" to="/dashboard" />
                  </Switch>
                </Container>
              </main>
              <Aside />
            </div>
            <Footer />
          </div>
        );
      }
      else {
        return (
          <Redirect from="/" to="/login" />
        );
      }
    } else {
      return (<span></span>);
    }
  }
}

export default Full;
