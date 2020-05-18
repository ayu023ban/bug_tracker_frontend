import React, { Component } from 'react';
import NavBar from './navbar/navbar'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import HomePage from './pages/homePage'
import ProjectPage from './pages/projectPage'
import LoginPage from './pages/loginPage'
import PageNotFound from './pages/pageNotFound'
import SideBar from './navbar/sidebar'
import EditorPage from './pages/editor'
import LoginComp from './navbar/login'
class Router extends Component {
  constructor(props) {
    super(props)
    this.handleLogIn = this.handleLogIn.bind(this)
    this.state={isLoggedIn:false}
  }
  handleLogIn() {
    console.log("madasd")
    this.setState({ isLoggedIn: true })
  }
  render() {
    const {isLoggedIn} = this.state
    const supportsHistory = 'pushState' in window.history
    return (
      <BrowserRouter forceRefresh={!supportsHistory}>
        <NavBar />
        <SideBar />
        <Switch>
          <Route exact path='/' render={(props)=><HomePage {...props} isLoggedIn={isLoggedIn} />} />
          <Route exact path='/login' render={(props) => <LoginComp {...props} onLogin={this.handleLogIn} />} />
          <Route exact path='/projects' render={(props) => <ProjectPage {...props} isLoggedIn={isLoggedIn} />} />
          <Route exact path='/editor' component={EditorPage} />
          <Route exact path='/home' render={(props)=><HomePage {...props} isLoggedIn={isLoggedIn} />} />
          <Route component={PageNotFound} />
        </Switch>
      </BrowserRouter>
    );
  }

}

export default Router;