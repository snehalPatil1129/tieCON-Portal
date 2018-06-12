import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
import 'flag-icon-css/css/flag-icon.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'simple-line-icons/css/simple-line-icons.css';
import '../scss/style.scss';
import '../scss/core/_dropdown-menu-right.scss';
import Full from './containers/Full/';
import Login from './views/Pages/Login/';
import Logout from './views/Pages/logOut/';
import Register from './views/Pages/Register/Register';
import SessionQuestions from './views/SessionQuestions/SessionQuestions';
import '../customStyle.css';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import reducer from './store/reducer';
import thunk from 'redux-thunk';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, composeEnhancers(
  applyMiddleware(thunk)
));

let Routes = (
  <Switch>
      <Route path="/dashboard" name="Home" component={Full} />
      <Route path="/rooms" name="Home" component={Full} />
      <Route path="/events" name="Home" component={Full} />
      <Route path="/session" name="Home" component={Full} />
      <Route path="/attendance" name="Home" component={Full} />
      <Route path="/attendee" name="Home" component={Full} />
      <Route path="/speakers" name="Home" component={Full} />
      <Route path="/questions" name="Home" component={Full} />
      <Route path="/registration" name="Home" component={Full} />
      <Route path="/registrationList" name="Home" component={Full} />
      <Route path="/sponsor" name="Home" component={Full} />
      <Route path="/staticPages/aboutUs" name="Home" component={Full} />
      <Route path="/staticPages/locationDetails" name="Home" component={Full} />
      <Route path='/staticPages/aboutEternus' name='AboutEternusSoltions' component={Full} />
      <Route path="/staticPages/helpDesk" name="Home" component={Full} />
      <Route path='/attendeeReport' name='Home' component={Full} />
      <Route path='/sessionReport' name='Home' component={Full} />
      <Route path='/sessionsReport' name='Home' component={Full} />
      <Route path="/user" name="Home" component={Full} />
      <Route path="/role" name="Home" component={Full} />
      <Route path='/initialQuestions' name='Home' component={Full} />
      <Route path='/dynamicQuestions' name='Home' component={Full} />
      <Route path='/sessionRegistration' name='Home' component={Full} />
      <Route exact path="/sessionQuestions" name="Session Questions" component={SessionQuestions} />
      <Route exact path="/register" name="Register" component={Register} />
      <Route exact path="/logOut" name="logOut" component={Logout} />
      <Route path="/" name="Login" component={Login} />
    </Switch>
);

ReactDOM.render((
  <Provider store={store}>
    <HashRouter>
      {Routes}
    </HashRouter>
  </Provider>
), document.getElementById('root'));
