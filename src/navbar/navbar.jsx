import React, { Component } from 'react'
import { Menu, Icon, Popup, Button, Header } from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom'
import Avatar from 'react-avatar'
import { setCookie } from '../components/helperFunctions'
export default class NavBar extends Component {
  constructor(props) {
    super(props)
    this.logout = this.logout.bind(this)
    this.state = {
      activeItem: 'home',
      menuVisible: false,
      redirectToProfile: false
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
    const user_data = JSON.parse(sessionStorage.getItem("user_data"))
    return (
      <Menu icon className="navbar">
        {this.props.isLoggedIn && <Menu.Item
          name='projects'
          active={activeItem === 'projects'}
          onClick={(e) => {
            this.handleItemClick(e, "projects")
            this.props.onSideBarButton()
          }}
        ><Popup content='Click to Toggle Sidebar' trigger={<Icon name='bars' size='large' />} /></Menu.Item>
        }
        {this.props.isLoggedIn && <Menu.Item as={Link}
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
          <Menu.Item position='right'>
            <Popup
              style={{ padding: 0 }}
              onOpen={() => { this.setState({ menuVisible: !this.state.menuVisible }) }}
              open={this.state.menuVisible}
              onClose={() => { this.setState({ menuVisible: !this.state.menuVisible }) }}
              on='click'
              pinned
              position="bottom right"
              trigger={<div><Avatar style={{cursor:"pointer"}} round name={user_data.full_name} size={30} /></div>}
            >
              <div>
                <div style={{ padding: "1rem", display: "grid", gridTemplateColumns: "auto auto", alignItems: "center" }}>
                  <Avatar round name={user_data.full_name} size={60} />
                  <Header style={{ marginTop: 0, marginLeft: "1rem" }}>{user_data.full_name}</Header>
                </div>
                <Button.Group basic fluid vertical>
                  <Button
                    icon="user"
                    content="Profile"
                    labelPosition='left'
                    onClick={() => {
                      this.setState({ redirectToProfile: true, menuVisible: !this.state.menuVisible })
                      setTimeout(() => { this.setState({ redirectToProfile: false }) }, 1000)
                    }} />
                  <Button icon="sign out" content="Log Out" labelPosition='left' onClick={this.logout} />
                </Button.Group>
              </div>
            </Popup>
          </Menu.Item>
        }
        {this.state.redirectToProfile &&
          <Redirect to={{ pathname: "/user", state: { id: user_data.id } }} />
        }
      </Menu>
    )
  }
}