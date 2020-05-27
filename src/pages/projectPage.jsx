import React, { Component } from 'react'
import { Segment, Container, Modal, Header, Button, Card, Icon, Image, Divider, Form } from 'semantic-ui-react'
import Pluralize from 'react-pluralize'
import "./scss/projectPage.scss"
import Axios from 'axios'
import EditorPage from './editor'
class ProjectPage extends Component {
    constructor(props) {
        super(props)
        this.handleProjectDescriptionEditorChange = this.handleProjectDescriptionEditorChange.bind(this)
        this.state = {
            data: [],
            isLoggedIn: false,
        }
    }
    componentDidMount() {
        let isLoggedIn = this.props.isLoggedIn || sessionStorage.getItem("isLoggedIn")
        this.setState({ isLoggedIn: isLoggedIn })
        Axios.get('http://localhost:8000/bug_reporter/projects/', { headers: { Authorization: `Token ${sessionStorage.getItem("token")}` } })
            .then(res => res.data)
            .then((data) => {
                this.setState({ data: data })
            });
    }

    handleClickCardDescription(id) {
        this.props.history.push({
            pathname: '/project',
            state: { id: id }
        })
    }
    listProjects() {
        let listCards = []
        let { data } = this.state
        if (this.state.isLoggedIn) {
            listCards = data.map(element =>
                <Card color='red' raised onClick={() => { this.handleClickCardDescription(element.id) }}  >
                    <Card.Content>
                        <Card.Description className='projectDescription' >
                            <div dangerouslySetInnerHTML={{ __html: element.wiki }} />
                            <Image floated='right'><a href={element.githublink} target="_blank"><Icon name="github" size='big' /></a></Image>
                        </Card.Description>
                    </Card.Content>
                    <Card.Content>
                        <Card.Header>{element.name}</Card.Header>
                        <Card.Meta>
                            <Icon name='users' /> <Pluralize singular={'member'} count={element.members.length} />
                        </Card.Meta>
                    </Card.Content>
                </Card>
            )
        }
        else {
            listCards = <Segment >"Projects are not available"</Segment>
        }


        return listCards
    }

    show = (dimmer) => () => this.setState({ dimmer, open: true })
    close = () => this.setState({ open: false })

    createProject(body) {
        fetch('http://localhost:8000/bug_reporter/projects/', {
            method: 'POST',
            body: body,
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Authorization": `Token ${sessionStorage.getItem("token")}`
            },
        }).then((res) => {
            if (res.status === 201) {
                this.close()
            }
        })

    }

    updateType(input) {
        this.setState({
            type: input
        })
        this.updateProjects()
    }

    onChange = e => {
        const { name, value } = e.target
        this.setState({
            values: { ...this.state.values, [name]: value }
        })
    }

    handleProjectDescriptionEditorChange(content){
        this.setState({
            values: { ...this.state.values, "wiki": content }
        })

    }

    onSubmit = e => {
        let data = JSON.stringify(this.state.values)
        this.createProject(data);
    }

    fetch_content(type) {
        let base_url = "http://localhost:8000/bug_reporter/projects/"
        let userId = JSON.parse(sessionStorage.getItem("user_data")).id
        switch (type) {
            case "latest":
                base_url += "?ordering=-created_at"
                break
            case "myprojects":
                base_url += `?creator=${userId}`
                break
            case "collaborated":
                base_url += `?members=${userId}`
                break
            default:
                base_url += ""
        }
        fetch(base_url, { headers: { Authorization: `Token ${sessionStorage.getItem("token")}` } })
            .then((res => res.json()))
            .then((data) => {
                this.setState({ data: data })
            })

    }

    updateIssue = (string) => {
        this.setState({
            type: string
        })
        this.fetch_content(string)
    }


    render() {
        const { open, dimmer } = this.state
        return (
            <Container className='project-box'>
                <Header as="h2" color='red' className='projects-header'>Projects<Icon className='add-button' onClick={this.show('blurring')} name='plus' size='large' /></Header>
                <Divider section />
                <Segment horizontal textAlign='center' children={Button} >
                    <Button basic color='teal' onClick={(event) => { this.updateIssue("latest") }} > Latest</Button>
                    <Button basic color='blue' onClick={(event) => { this.updateIssue("myprojects") }} > My Projects</Button>
                    {/* <Button basic color='green' onClick={(event) => { this.updateIssue("tag") }} > Tags</Button> */}
                    <Button basic color='violet' onClick={(event) => { this.updateIssue("collaborated") }} > Collaborated</Button>
                </Segment>
                <Divider section />
                <Container>
                    <Card.Group itemsPerRow='2'>
                        {this.listProjects()}
                    </Card.Group>

                </Container>

                <Modal open={open} onClose={this.close} closeOnDocumentClick closeOnDimmerClick closeOnEscape size='large' >
                    <Modal.Header>Create New Project</Modal.Header>
                    <Modal.Content scrolling size='large'>
                        <Modal.Description>

                            <Form>
                            <Form.Input label="Title" name="name" value={this.state.name} onChange={this.onChange} placeholder="Title" />
                            <EditorPage onEditorChange={this.handleProjectDescriptionEditorChange} placeholder="Descrpition" />
                            <Form.Input label="Git Link" name="githublink" onChange={this.onChange} value={this.state.githublink} />
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
                        <Button color='black' onClick={this.close}>
                            Cancel
                    </Button>
                    </Modal.Actions>
                </Modal>
            </Container>
        )
    }
}

export default ProjectPage