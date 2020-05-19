import React, { Component } from 'react'
import { Input, Menu, Icon, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
export default class NavBar extends Component {
  constructor(props) {
    super(props)
    this.logout = this.logout.bind(this)
    this.state = {
      activeItem: 'home',
      isLoggedIn: false
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
          <Icon size='large' name='sign-in' />
        </a>
      </Menu.Item>
    }
    else {
      return <Menu.Item
        as={Button}
        name='logout'
        onClick={this.logout}
      ><Icon name='sign out' size='large' />
      </Menu.Item>
    }
  }

  componentDidMount() {
    const isLoggedIn = this.props.isLoggedIn || sessionStorage.getItem("isLoggedIn")
    this.setState({ isLoggedIn: isLoggedIn })
  }


  render() {
    const { activeItem } = this.state

    return (
      <Menu icon className="navbar">
        <Menu.Item
          name='projects'
          active={activeItem === 'projects'}
          onClick={this.handleItemClick}
        ><Icon name='bars' size='large' /></Menu.Item>
        <Menu.Item as={Link}
          name='home'
          to='/home'
          active={activeItem === 'home'}
          onClick={this.handleItemClick}
        ><Icon name='home' size='large' />
        </Menu.Item>
        <Menu.Item>
          <Input className="search" icon='search' placeholder='Search...' />
        </Menu.Item>
        <Menu.Menu position='right'>
          {this.log_button()}
        </Menu.Menu>
      </Menu>
    )
  }
}