import React, { Component } from 'react'
import _ from 'lodash'
import { Menu, Icon, Popup, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { setCookie } from '../components/helperFunctions'
export default class NavBar extends Component {
  constructor(props) {
    super(props)
    this.logout = this.logout.bind(this)
    this.state = {
      activeItem: 'home',
    }

  }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  async logout() {
    let res = await fetch("http://localhost:8000/bug_reporter/users/logout/", {
      method: 'GET',
      headers: { "Authorization": `Token ${sessionStorage.getItem("token")}` }
    })
    if (res.status === 200) {
      sessionStorage.removeItem("isLoggedIn")
      sessionStorage.removeItem("token")
      sessionStorage.removeItem("user_data")
      sessionStorage.removeItem("header")
      setCookie("token", "", "-1")
      this.props.onLogout()
    }

  }

  render() {
    const { activeItem } = this.state

    return (
      <Menu icon className="navbar">
        {this.props.isLoggedIn &&<Menu.Item
          name='projects'
          active={activeItem === 'projects'}
          onClick={(e) => {
            this.handleItemClick(e, "projects")
            this.props.onSideBarButton()
          }}
        ><Popup content='Click to Toggle Sidebar' trigger={<Icon name='bars' size='large' />} /></Menu.Item>
        }
        {this.props.isLoggedIn &&<Menu.Item as={Link}
          position='left'
          name='home'
          to='/home'
          active={activeItem === 'home'}
          onClick={this.handleItemClick}
        ><Popup content='Home' trigger={<Icon name='home' size='large' />} />
        </Menu.Item>
        }
        <Menu.Item header as='h3' id="Title">
        Bug Reporter
        </Menu.Item>
        {this.props.isLoggedIn &&
          <Menu.Item
            position='right'
            as={Button}
            name='logout'
            onClick={this.logout}
          ><Popup content='Sign Out' position='bottom right' trigger={<Icon name='sign out' size='large' />} />
          </Menu.Item>
        }
      </Menu>
    )
  }
}