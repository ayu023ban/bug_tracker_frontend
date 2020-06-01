import React, { Component } from 'react'
import { Container, Card, Segment, Header, Divider } from 'semantic-ui-react'
import Avatar from 'react-avatar'
import {user_url} from '../routes'
import './scss/users.scss'

class UserList extends Component {
    constructor(props) {
        super(props)
        this.state = { users: null }
    }

    componentDidMount() {
        const headers = JSON.parse(sessionStorage.getItem("header"))
        fetch(user_url, { method: "GET", headers: headers }).then((res) => {
            if (res.status === 200) {
                return res.json()
            }
            else {
                console.log(res)
            }
        }).then(data => this.setState({ users: data }))
    }

    listUser() {
        const { users } = this.state
        let list = ""
        if (users !== null) {
            list = users.map(user =>
                <Card raised color='red' onClick={() => {
                    this.props.history.push({
                        pathname: '/user',
                        state: { id: user.id }
                    })
                }}>
                    <Card.Content>
                        <div className="user-card-content">
                            <Avatar className='avatar' round textSizeRatio='2.5' size='40' name={user.full_name} />
                            <div className="user-content">
                                <span>{user.full_name}</span>
                                <span>{user.email}</span>
                            </div>
                        </div>
                    </Card.Content>
                </Card>
            )
        }
        else {
            list = <Segment>
                Users are not available
                </Segment>

        }
        return list
    }

    render() {
        return (
            <Container>
                <Header as="h2" color='red' className='projects-header'>Users</Header>
                <Divider section />
                <Card.Group itemsPerRow="3">
                    {this.listUser()}
                </Card.Group>
            </Container>
        )
    }

}
export default UserList