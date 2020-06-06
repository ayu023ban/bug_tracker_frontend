import React, { Component } from 'react'
import { Container, Card, Segment, Header, Divider } from 'semantic-ui-react'
import Avatar from 'react-avatar'
import { user_url } from '../api-routes'
import './scss/users.scss'
import { CardPlaceHolder } from '../components/placeholders'

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
        }).then(data => this.setState({ users: data.results }))
    }

    listUser() {
        const { users } = this.state
        let list = ""
        if (users !== null) {
            if (users.length !== 0) {
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
                list = <Card.Group itemsPerRow="3">{list}</Card.Group>
            }
            else {
                list = <Segment>
                    Users are not available
                </Segment>

            }
        }
        else {
            list =
                <Card.Group itemsPerRow="3">
                    <CardPlaceHolder />
                    <CardPlaceHolder />
                    <CardPlaceHolder />
                    <CardPlaceHolder />
                    <CardPlaceHolder />
                    <CardPlaceHolder />
                </Card.Group>
        }
        return list
    }

    render() {
        return (
            <Container className="ContainerDiv" >
                <Header as="h2" color='red' className='projects-header'>Users</Header>
                <Divider section />
                {this.listUser()}
            </Container>
        )
    }

}
export default UserList