import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import './sidebar.css'
class SideBar extends Component {
    state = { activeItem: 'home' }
    handleItemClick = (e, { name }) => this.setState({ activeItem: name })
    render() {
        const { activeItem } = this.state
        return (
            <Menu vertical secondary size='large' className="SideBar" color='red'>
                <Menu.Item as={Link}
                    name='home'
                    to='/home'
                    active={activeItem === 'home'}
                    onClick={this.handleItemClick}
                />
                <Menu.Item
                className="workspace"
                    name='Work Space'
                    header
                    active
                />
                <Menu.Item as={Link}
                    to='/projects'
                    name='Projects'
                    active={activeItem === 'Projects'}
                    onClick={this.handleItemClick}
                />
                <Menu.Item as={Link}
                    to='/home'
                    name='Issues'
                    active={activeItem === 'Issues'}
                    onClick={this.handleItemClick}
                />
                <Menu.Item as={Link}
                    to='/MyPage'
                    name='My Page'
                    active={activeItem === 'My Page'}
                    onClick={this.handleItemClick}
                />
                <Menu.Item as={Link}
                    className='users'
                    active={activeItem === 'Users'}
                    onClick={this.handleItemClick}
                    to='/users'
                    name='Users'
                />
            </Menu>

        )
    }
}
export default SideBar