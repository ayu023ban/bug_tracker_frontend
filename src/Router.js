import React, { Component } from 'react';
import NavBar from './navbar/navbar'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import HomePage from './pages/homePage'
import LoginPage from './pages/loginPage'
import PageNotFound from './pages/pageNotFound'
import SideBar from './navbar/sidebar'

class Router extends Component {
    render() {
      const login = true
      const supportsHistory = 'pushState' in window.history
      return (
          <BrowserRouter forceRefresh={!supportsHistory}>
            <NavBar />
            <SideBar/>
            <Switch>
              <Route exact path='/' component={HomePage} />
              <Route exact path='/login' component={LoginPage} />
              <Route exact path='/home' render={() => (
                login === true ? (<HomePage />) : (<LoginPage />)
              )} />
              <Route component={PageNotFound} />
            </Switch>
          </BrowserRouter>
      );
    }
  
  }
  
  export default Router;