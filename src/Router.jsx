import React, { Component } from 'react';
import NavBar from './navbar/navbar'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import HomePage from './pages/homePage'
import ProjectPage from './pages/projectPage'
import PageNotFound from './pages/pageNotFound'
import SideBar from './navbar/sidebar'
import EditorPage from './pages/editor'
import LoginComp from './navbar/afterLoginPage'
import UserList from './pages/users'
import UserDetail from './pages/userDetail'
import ProjectDetail from './pages/projectDetail'
import IssueDetail from './pages/issueDetail'
import LoginPage from './pages/beforeLoginPage';
import { PublicRoute, PrivateRoute } from './routeComp'
// import { Transition } from 'semantic-ui-react'
class Router extends Component {
  constructor(props) {
    super(props)
    this.handleLogIn = this.handleLogIn.bind(this)
    this.handleLogOut = this.handleLogOut.bind(this)
    let login = Boolean(sessionStorage.getItem("isLoggedIn"))
    this.state = { isLoggedIn: login, open: true }
  }
  handleLogIn() {
    this.setState({ isLoggedIn: true })
  }
  handleLogOut() {
    this.setState({ isLoggedIn: false })
  }
  handleSideBarOpen = () => {
    this.setState((prevState) => ({ open: !prevState.open }))
  }
  render() {
    const { isLoggedIn, open } = this.state
    const supportsHistory = 'pushState' in window.history
    return (
      <BrowserRouter forceRefresh={!supportsHistory} >
        <NavBar isLoggedIn={isLoggedIn} onLogout={this.handleLogOut} onSideBarButton={this.handleSideBarOpen} />
        {open &&
          <SideBar />
        }
        <Switch>
          <PrivateRoute exact path="/" isLogin={isLoggedIn} component={HomePage} />
          <Route exact path='/login' render={(props) => <LoginComp {...props} onLogin={this.handleLogIn} />} />
          <PrivateRoute exact path='/project' isLogin={isLoggedIn} component={ProjectDetail} />
          <PrivateRoute  exact path="/home" isLogin={isLoggedIn} component={HomePage} />
          <PrivateRoute isLogin={isLoggedIn} exact path='/projects' component={ProjectPage} />
          <PrivateRoute isLogin={isLoggedIn} exact path='/issue' component={IssueDetail} />
          <PrivateRoute exact path='/editor' isLogin={isLoggedIn} component={EditorPage} />
          <PrivateRoute exact path='/users' isLogin={isLoggedIn} component={UserList} />
          <PublicRoute exact restricted path='/beforelogin' isLogin={isLoggedIn} component={LoginPage} />
          <PrivateRoute exact path='/user' isLogin={isLoggedIn} component={UserDetail} />
          <Route component={PageNotFound} />
        </Switch>
      </BrowserRouter>
    );
  }

}

export default Router;