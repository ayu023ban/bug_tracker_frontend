import React, { Component } from 'react'
import _ from 'lodash'
import { Input, Menu, Icon,Popup, Button, Search } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
export default class NavBar extends Component {
  constructor(props) {
    super(props)
    this.logout = this.logout.bind(this)
    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.state = {
      activeItem: 'home',
      isLoggedIn: false,
      isLoadingSearch:false
    }

  }


  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  logout() {

    fetch("http://localhost:8000/bug_reporter/users/logout/", {
      method: 'GET',
      headers: { "Authorization": `Token ${sessionStorage.getItem("token")}` }
    }).then((res) => {
      console.log(res)
      if (res.status === 200) {
        sessionStorage.removeItem("isLoggedIn")
        sessionStorage.removeItem("token")
        sessionStorage.removeItem("user_data")
        sessionStorage.removeItem("header")
        this.props.onLogout()
        this.render()
      }
    })
  }

  log_button() {
    if (!this.state.isLoggedIn) {
      return <Menu.Item
        name='login'
      ><a href="https://internet.channeli.in/oauth/authorise/?client_id=l1Wb17BXy5ZoQeJ1fzOtZutOObUrzSi9fW1xxLGR&redirect_url=http://localhost:8000/bug_reporter/login/&state=RANDOM_STATE_STRING&scope=Person">
          <Popup content='Sign In' position='bottom right' trigger={<Icon name='sign in' size='large'/>} />
        </a>
      </Menu.Item>
    }
    else {
      return <Menu.Item
        as={Button}
        name='logout'
        onClick={this.logout}
      ><Popup content='Sign Out' position='bottom right' trigger={<Icon name='sign out' size='large' />} />
      </Menu.Item>
    }
  }

  componentDidMount() {
    const isLoggedIn = this.props.isLoggedIn || sessionStorage.getItem("isLoggedIn")
    this.setState({ isLoggedIn: isLoggedIn })
  }

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoadingSearch: true, value })
    const re = new RegExp(_.escapeRegExp(value, 'i'))
    console.log(re)
  }


  render() {
    const { activeItem } = this.state

    return (
      <Menu icon className="navbar">
        <Menu.Item
          name='projects'
          active={activeItem === 'projects'}
          onClick={this.handleItemClick}
        ><Popup content='Click to Close Sidebar' trigger={<Icon name='bars' size='large'/>} /></Menu.Item>
        <Menu.Item as={Link}
          name='home'
          to='/home'
          active={activeItem === 'home'}
          onClick={this.handleItemClick}
        ><Popup content='Home' trigger={<Icon name='home' size='large'/>} />
        </Menu.Item>
        <Menu.Item>
          {/* <Input className="search" icon='search' placeholder='Search...' /> */}
          <Search fluid loading={this.state.isLoadingSearch} onSearchChange={this.handleSearchChange} results={this.state.searchResult}></Search>
        </Menu.Item>
        <Menu.Menu position='right'>
          {this.log_button()}
        </Menu.Menu>
      </Menu>
    )
  }
}