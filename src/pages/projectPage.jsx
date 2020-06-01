import React, { Component } from 'react'
import { Segment, Container, Modal, Header, Button, Card, Icon, Image, Divider } from 'semantic-ui-react'
import Pluralize from 'react-pluralize'
import "./scss/projectPage.scss"
import Axios from 'axios'
import { project_url } from '../routes'
import { ProjectForm } from './projectDetail'


export function isGitUrl(str) {
    var regex = /^(?:git|ssh|https?|git@[-\w.]+):(\/\/)(github\.com)\/(\w{1,})\/(\w{1,})\/?$/;
    return regex.test(str);
};


class ProjectPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            isLoggedIn: false,
            projectNameError: false,
            projectLinkError: false,
            values: { name: "" }
        }
    }
    componentDidMount() {
        let isLoggedIn = this.props.isLoggedIn || sessionStorage.getItem("isLoggedIn")
        this.setState({ isLoggedIn: isLoggedIn })
        Axios.get(project_url, { headers: { Authorization: `Token ${sessionStorage.getItem("token")}` } })
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
                            <Image floated='right'><a href={element.githublink} rel='noopener noreferrer' target="_blank"><Icon name="github" size='big' /></a></Image>
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
        body = JSON.stringify(body)
        fetch(project_url, {
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
    fetch_content(type) {
        let base_url = project_url
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
        const { open } = this.state
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

                <Modal open={open} onClose={this.close} closeOnDimmerClick={false} closeOnEscape size='large' >
                    <Modal.Header>Create New Project</Modal.Header>
                    <Modal.Content scrolling size='large'>
                        <Modal.Description>
                            <ProjectForm submitName="create" onSubmit={(data) => { this.createProject(data) }} />
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