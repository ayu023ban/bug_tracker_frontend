import React, { Component } from 'react'
import { Container, Header, Breadcrumb, Segment, Icon, Divider, Card, Modal, Grid, Button, Dropdown, Feed, Form } from 'semantic-ui-react'
import moment from 'moment'
import Pluralize from 'react-pluralize'
import { Link } from 'react-router-dom'
import Avatar from 'react-avatar'
import './scss/projectDetail.scss'
import axios from 'axios'
import {IssueCard} from './homePage'
class ProjectDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.location.state.id,
            data: null,
            openModal1: false,
            openModal2: false,
            activeDomain: "f",
            values:{name:"",description:""}
        }
        this.deleteCurrentProject = this.deleteCurrentProject.bind(this)
        this.onChange = this.onChange.bind(this)
    }

    deleteProjectModalShow = () => this.setState({ openModal1: true })
    deleteProjectModalClose = () => this.setState({ openModal1: false })
    newIssueShow = () => this.setState({ openModal2: true })
    newIssueClose = () => this.setState({ openModal2: false })

    handleDomainClick = (name) => this.setState({ activeDomain: name })


    componentWillMount() {
        const project_detail_url = `http://localhost:8000/bug_reporter/projects/${this.state.id}/`
        const get_issues_url = project_detail_url + "bugs/"
        const headers = JSON.parse(sessionStorage.getItem("header"))
        fetch(project_detail_url, { headers: headers }).then(res => res.json()).then((data) => {
            this.setState({ data: data, member_names: data.member_names, warning_text: "Your are trying to delete the whole project,all issues and comments related to this will also be deleted. \n Are you sure?" })
        })
        fetch(get_issues_url, { headers: headers }).then(issue_res => issue_res.json()).then((issue_data) => {
            this.setState({ issue_data: issue_data })
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

    onChange(event, data) {
        const user_id = data.value.map((element) => {
            let obj = this.state.user_data_for_search.find(o => o.text === element)
            return Number(obj.key)
        })
        const body = JSON.stringify({ members: user_id })
        const url = `http://localhost:8000/bug_reporter/projects/${this.state.id}/update_members/`
        const params = { method: 'PATCH', body: body, headers: { 'Content-Type': 'application/json', "Authorization": `Token ${sessionStorage.getItem("token")}` } }
        fetch(url, params).then(res => res.json()).then(res => res.user_ids).then((user_ids) => {
            const user_names = user_ids.map((id) => {
                return this.state.user_data_for_search.find(o => o.key === id.toString()).text
            })
            this.setState({ member_names: user_names })
        })
    }

    search_component() {
        const user_id = JSON.parse(sessionStorage.getItem("user_data")).id
        const { data } = this.state
        const search = (user_id === data.creator) ? (
            <Dropdown
                placeholder='Add Members'
                fluid
                multiple
                onChange={this.onChange}
                search
                selection
                options={this.state.user_data_for_search}
            />
        ) : (<Component>
            <Icon name='users' /><Pluralize singular={'member'} count={data.members.length} />
        </Component>
            )
        return search

    }

    DisPlayMembers() {
        const { member_names } = this.state
        if (member_names) {
            const list = member_names.map(element =>
                <Feed.Event>
                    <Feed.Label>
                        <Avatar name={element} size='40' />
                    </Feed.Label>
                    <Feed.Content>
                        <Feed.Summary>
                            {element}
                        </Feed.Summary>
                    </Feed.Content>
                </Feed.Event>
            )

            const final_list = <Feed>{list}</Feed>
            return final_list
        }
        else return <Feed.Event><Feed.Label>No members</Feed.Label></Feed.Event>

    }

    ListCards() {
        let listCards = []
        const { issue_data } = this.state
        if (issue_data !== undefined) {
            listCards = issue_data.map((bug) => {
                return (
                  <IssueCard bug={bug} history={this.props.history} />
                )
            })
        }
        else {
            listCards = <Segment>issues are not awailable</Segment>
        }
        return listCards
    }

    creator() {

        if (this.state.data !== null && this.state.user_data_for_search !== undefined) {
            return this.state.user_data_for_search.find(o => Number(o.key) === this.state.data.creator).text
        }
        return "anonymous"
    }

    onModal2Change = e => {
        const { name, value } = e.target
        this.setState({
            values: { ...this.state.values, [name]: value }
        })
    }

    createIssue(data){
        console.log(data)
        const url = 'http://localhost:8000/bug_reporter/bugs/'
        const header = {
            "Content-Type": "application/json",
            // 'Accept':"application/json; charset=UTF-8",
            "Authorization": `Token ${sessionStorage.getItem("token")}`
        }
        axios.post(url,data,{headers:header}).then((res)=>{
            if(res.status===201){
                this.newIssueClose()
            }
            else{
                console.log(res)
            }
        }).catch((res)=>{
            console.log(res)
        }
        )
    }

    onSubmit = e => {
        let data = this.state.values
        data.domain = this.state.activeDomain
        data.project = this.state.id
        data = JSON.stringify(data)
        this.createIssue(data)
    }

    render() {
        const { data } = this.state
        const { openModal1 } = this.state
        const { openModal2 } = this.state
        const { activeDomain } = this.state
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


                    <Card color='red' fluid>
                        <Card.Content className="CardTop" textAlign='center' >
                            <Card.Description>{data.wiki}</Card.Description>
                        </Card.Content>
                        <Card.Content textAlign='center'>
                            <Header as='h2'>
                                {data.name}
                            </Header>
                        </Card.Content>
                        <Card.Content extra>created by {this.creator()} {moment(data.created_at).fromNow()}</Card.Content>
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
                                        <Button className='delete' icon onClick={this.deleteProjectModalShow}><Icon color='red' name='delete' />Delete</Button>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Card.Content>
                    </Card>


                    <Container fluid className="memberContainer">
                        <Card color='red' className="members">
                            <Card.Content textAlign='center' >
                                <Card.Header>Members</Card.Header>
                            </Card.Content>
                            <Card.Content>
                                {this.DisPlayMembers()}
                            </Card.Content>
                        </Card>
                    </Container>

                    <Header size='large' color='red'>Issues<Button className='addIssueButton' onClick={this.newIssueShow} icon='plus' size='large' /></Header>
                    <Divider section />

                    <Container className="issueCardGroup" >
                        {this.ListCards()}
                    </Container>

                    <Modal open={openModal1} basic onClose={this.deleteProjectModalClose} size='small'>
                        <Header icon='archive' content='Delete the Current Project' />
                        <Modal.Content>
                            <p>
                                {this.state.warning_text.split('\n').map((item, key) => {
                                    return <span key={key}>{item}<br /></span>
                                })}
                            </p>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button basic color='red' onClick={this.deleteProjectModalClose} inverted>
                                <Icon name='remove' /> No
                                            </Button>
                            <Button color='green' onClick={this.deleteCurrentProject} inverted>
                                <Icon name='checkmark' /> Yes
                                            </Button>
                        </Modal.Actions>
                    </Modal>

                    <Modal dimmer open={openModal2} onClose={this.newIssueClose} closeOnDocumentClick closeOnDimmerClick closeOnEscape >
                        <Modal.Header>Create New Issue</Modal.Header>
                        <Modal.Content image>
                            <Modal.Description>
                                <Form>
                                    <Form.Input label='Name' name='name' onChange={this.onModal2Change} value = {this.state.name} placeholder='Title' />
                                    <Form.TextArea label='Descrpition' onChange={this.onModal2Change} name='description' value={this.state.description} placeholder='Write short description about the Issue  ' />
                                    <Form.Field>
                                        <Button.Group>
                                            <Button content='Front End' basic={activeDomain !== "f"} onClick={() => { this.handleDomainClick("f") }} color='olive' />
                                            <Button content='Back End' basic={activeDomain !== "b"} onClick={() => { this.handleDomainClick("b") }} color='blue' />
                                            <Button content='Other' basic={activeDomain !== "o"} onClick={() => { this.handleDomainClick("o") }} color='purple' />
                                        </Button.Group>
                                    </Form.Field>
                                    <Button
                                        positive
                                        type='submit'
                                        icon='checkmark'
                                        content="Create"
                                        onClick={(event) => this.onSubmit()}
                                    />
                                </Form>

                            </Modal.Description>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color='black' onClick={this.newIssueClose} content='Cancel' />
                        </Modal.Actions>
                    </Modal>


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