import React, { Component } from 'react'
import { Input, Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faHome } from "@fortawesome/free-solid-svg-icons";
export default class NavBar extends Component {
  state = { activeItem: 'home' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <Menu className="navbar">
        <Menu.Item as={Link}
          to='/home'
          active={activeItem === 'home'}
          onClick={this.handleItemClick}
        ><FontAwesomeIcon icon={faHome} /></Menu.Item>
        <Menu.Item
          as={Link}
          to='/projects'
          name='projects'
          active={activeItem === 'projects'}
          onClick={this.handleItemClick}
        />
        <Menu.Item
          as={Link}
          to='/issues'
          name='Issues'
          active={activeItem === 'Issues'}
          onClick={this.handleItemClick}
        />
        <Menu.Menu position='right'>
          <Menu.Item>
            <Input icon='search' placeholder='Search...' />
          </Menu.Item>
          <Menu.Item
            as={Link}
            to='/login'
            name='login'
          />
          <Menu.Item
            as={Link}
            to='/logout'
            name='logout'
          />
        </Menu.Menu>
      </Menu>
    )
  }
}