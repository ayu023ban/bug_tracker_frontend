import React, { Component } from 'react'
import { Container, Header, Breadcrumb, Icon, Divider, Card, Modal, Grid, Button, Dropdown } from 'semantic-ui-react'
import Pluralize from 'react-pluralize'
import { Link } from 'react-router-dom'
import './scss/projectDetail.scss'
class ProjectDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.location.state.id,
            data: null,
            open: false
        }
        this.deleteCurrentProject = this.deleteCurrentProject.bind(this)
        this.addMembers = this.addMembers.bind(this)
        this.onChange = this.onChange.bind(this)
    }

    show = () => this.setState({ open: true })
    close = () => this.setState({ open: false })


    componentWillMount() {
        const url = `http://localhost:8000/bug_reporter/projects/${this.state.id}/`
        const headers = JSON.parse(sessionStorage.getItem("header"))
        fetch(url, { headers: headers }).then(res => res.json()).then((data) => {
            this.setState({ data: data }, () => {
                this.render()
            })

        })
        this.stateOptions()
    }


    deleteCurrentProject() {
        console.log(this.state.id)
        const url = `http://localhost:8000/bug_reporter/projects/${this.state.id}/`
        const headers = JSON.parse(sessionStorage.getItem("header"))
        fetch(url, { method: 'DELETE', headers: headers }).then((res) => {
            if (res.status === 204) {
                this.props.history.push({
                    pathname: "/projects"
                }
                )
            }
        })
    }

    stateOptions() {
        const url = "http://localhost:8000/bug_reporter/users/"
        const header = JSON.parse(sessionStorage.getItem("header"))
        fetch(url, { headers: header }).then(res => res.json()).then((data) => {
            const user_data = data.map((element) => {
                return {
                    key: element.id.toString(),
                    text: element.username,
                    value: element.username
                }
            })
            this.setState({ user_data_for_search: user_data })
        })
    }
    addMembers() {
        console.log(this.state.user_ids)
    }

    onChange(event, data) {
        const user_id = data.value.map((element) => {
            let obj = this.state.user_data_for_search.find(o => o.text === element)
            return Number(obj.key)
        })
        const body = JSON.stringify({ members: user_id })
        const url = `http://localhost:8000/bug_reporter/projects/${this.state.id}/update_members/`
        fetch(url, { method: 'PATCH', body: body, headers: { 'Content-Type': 'application/json', "Authorization": `Token ${sessionStorage.getItem("token")}` } }).then(res => res.json()).then((data) => {
            console.log(data.data)
        })
    }

    search_component() {
        const user_id = JSON.parse(sessionStorage.getItem("user_data")).id
        const {data} = this.state
        const search = (user_id === data.creator) ? (
            <Dropdown
                placeholder='Add Members'
                fluid
                multiple
                onChange={this.onChange}
                search
                selection
                onClose={this.addMembers}
                options={this.state.user_data_for_search}
            />
        ) : (<Component>
            <Icon name='users' /><Pluralize singular={'member'} count={data.members.length} />
        </Component>
            )
        return search
    }

    render() {
        const { data } = this.state
        const { open } = this.state
        if (data !== null) {
            return (
                <Container >
                    <Header>
                        <Breadcrumb as={Header}>
                            <Breadcrumb.Section className='previousSection' as={Link} to='/projects'>Projects</Breadcrumb.Section>
                            <Breadcrumb.Divider><Icon name='angle right' /></Breadcrumb.Divider>
                            <Breadcrumb.Section>{data.name}</Breadcrumb.Section>
                        </Breadcrumb>
                    </Header>
                    <Divider section />
                    <Card fluid>
                        <Card.Content className="CardTop" textAlign='center' >
                            <Card.Description>{data.wiki}</Card.Description>
                        </Card.Content>
                        <Card.Content>
                            <Header as='h2' textAlign='center'>
                                {data.name}
                            </Header>
                        </Card.Content>
                        <Card.Content>
                            <Grid columns={3} divided >
                                <Grid.Row textAlign='center'>
                                    <Grid.Column >
                                        {this.search_component()}
                                    </Grid.Column>
                                    <Grid.Column >
                                        <Icon name='user' />
                                    </Grid.Column>
                                    <Grid.Column >
                                        <Modal open={open} basic trigger={<Button className='delete' icon onClick={this.show}><Icon color='red' name='delete' />Delete</Button>} closeOnDimmerClick closeOnDocumentClick size='small'>
                                            <Header icon='archive' content='Archive Old Messages' />
                                            <Modal.Content>
                                                <p>
                                                    Your inbox is getting full, would you like us to enable automatic
                                                    archiving of old messages?
                                                </p>
                                            </Modal.Content>
                                            <Modal.Actions>
                                                <Button basic color='red' onClick={this.close} inverted>
                                                    <Icon name='remove' /> No
                                            </Button>
                                                <Button color='green' onClick={this.deleteCurrentProject} inverted>
                                                    <Icon name='checkmark' /> Yes
                                            </Button>
                                            </Modal.Actions>
                                        </Modal>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Card.Content>
                    </Card>





                </Container>
            )
        }
        else {
            return (
                <div>fdaklm</div>
            )
        }
    }
}

export default ProjectDetail