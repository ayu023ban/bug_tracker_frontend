import React, { Component } from 'react';
import NavBar from './navbar/navbar'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import HomePage from './pages/homePage'
import ProjectPage from './pages/projectPage'
import PageNotFound from './pages/pageNotFound'
import SideBar from './navbar/sidebar'
import EditorPage from './pages/editor'
import LoginComp from './navbar/login'
import ProjectDetail from './pages/projectDetail'
import IssueDetail from './pages/issueDetail'
import loginPage from './pages/loginPage'
class Router extends Component {
  constructor(props) {
    super(props)
    this.handleLogIn = this.handleLogIn.bind(this)
    this.handleLogOut = this.handleLogOut.bind(this)
    this.state={isLoggedIn:false}
  }
  handleLogIn() {
    this.setState({ isLoggedIn: true })
    this.render()
  }
  handleLogOut(){
    this.setState({isLoggedIn:false})
    this.render()
  }
  render() {
    const {isLoggedIn} = this.state
    const supportsHistory = 'pushState' in window.history
    return (
      <BrowserRouter forceRefresh={!supportsHistory}>
        <NavBar isLoggedIn={isLoggedIn} onLogout = {this.handleLogOut} />
        <SideBar />
        <Switch>
        <Route exact path='/product' component={loginPage} />
          <Route exact path='/' render={(props)=><HomePage {...props} isLoggedIn={isLoggedIn} />} />
          <Route exact path='/login' render={(props) => <LoginComp {...props} onLogin={this.handleLogIn} />} />
          <Route exact path='/project' render={(props) => <ProjectDetail {...props} isLoggedIn={isLoggedIn} />} />
          <Route exact path='/projects' render={(props) => <ProjectPage {...props} isLoggedIn={isLoggedIn} />} />
          <Route exact path='/issue' render={(props) => <IssueDetail {...props} isLoggedIn={isLoggedIn} />} />
          <Route exact path='/editor' component={EditorPage} />
          <Route exact path='/home' render={(props)=><HomePage {...props} isLoggedIn={isLoggedIn} />} />
          <Route component={PageNotFound} />
        </Switch>
      </BrowserRouter>
    );
  }

}

export default Router;