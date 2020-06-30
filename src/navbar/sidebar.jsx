import React, { Component } from 'react'
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import './sidebar.scss'
class SideBar extends Component {
    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };
    state = { activeItem: 'home' }
    componentDidMount(){
        this.setActiveItem(this.props.location.pathname)
    }
    setActiveItem(pathname){
        let temp;
        switch (pathname) {
            case "/projects":
                temp = "Projects"
                break;
            case "/project":
                temp = "Projects"
                break;
            case "/issues":
                temp = "Issues"
                break;
            case "/issue":
                temp = "Issues"
                break;
            case "/home":
                temp = "home"
                break;
            case "/users":
                temp = "Users"
                break;
            case "/user":
                temp = "Users"
                break;
            default:
                temp = this.state.activeItem
        }
        this.setState({activeItem:temp})
    }
    componentDidUpdate(prevprops) {
        if (this.props.location !== prevprops.location) {
            this.setActiveItem(this.props.location.pathname)
        }
    }
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
                    to='/issues'
                    name='Issues'
                    active={activeItem === 'Issues'}
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
export default withRouter(SideBar)