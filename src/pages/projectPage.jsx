import React, { Component } from 'react'
import { Segment, Container, Modal, Grid, Header, Button, Card, Icon, Divider } from 'semantic-ui-react'
import "./scss/projectPage.scss"
import Axios from 'axios'
import { project_url } from '../api-routes'
import { ProjectForm } from '../components/forms'
import { NormalPlaceholder } from '../components/placeholders'
import { ProjectCard } from '../components/cards'
import { PaginationContainer } from '../components/helperComponents'
export function isGitUrl(str) {
    var regex = /^(?:git|ssh|https?|git@[-\w.]+):(\/\/)(github\.com)\/(\w{1,})\/(\w{1,})\/?$/;
    return regex.test(str);
};


class ProjectPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
            isLoggedIn: false,
            projectNameError: false,
            projectLinkError: false,
            data_pag: { count: null, url: project_url + "?page=1" },
            values: { name: "" }
        }
    }
    componentDidMount() {
        let isLoggedIn = this.props.isLoggedIn || sessionStorage.getItem("isLoggedIn")
        this.setState({ isLoggedIn: isLoggedIn })
        Axios.get(project_url, { headers: { Authorization: `Token ${sessionStorage.getItem("token")}` } })
            .then(res => res.data)
            .then((data) => {
                this.setState({ data: data.results })
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
        if (Boolean(data)) {
            if (data.length !== 0) {
                listCards = data.map(element =>
                    <ProjectCard key={element.id} history={this.props.history} project={element} />
                )
                listCards = <Card.Group itemsPerRow='2'>{listCards}</Card.Group>
            }
            else {
                listCards = <Segment >"Projects are not available"</Segment>
            }
        }
        else {
            listCards =
                <Grid columns={2} stackable>
                    <Grid.Column>
                        <NormalPlaceholder />
                    </Grid.Column>
                    <Grid.Column>
                        <NormalPlaceholder />
                    </Grid.Column>
                    <Grid.Column>
                        <NormalPlaceholder />
                    </Grid.Column>
                </Grid>
        }
        return listCards
    }

    show = (dimmer) => () => this.setState({ dimmer, open: true })
    close = () => this.setState({ open: false })

    async createProject(body) {
        body = JSON.stringify(body)
        let res = await fetch(project_url, {
            method: 'POST',
            body: body,
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Authorization": `Token ${sessionStorage.getItem("token")}`
            },
        })
        if (res.status === 201) {
            res = await res.json()
            this.setState({
                data: [res, ...this.state.data]
            })
            this.close()
        }
        else { console.log(res) }
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
                base_url += "?ordering=-created_at&page=1"
                break
            case "myprojects":
                base_url += `?creator=${userId}&page=1`
                break
            case "collaborated":
                base_url += `?members=${userId}&page=1`
                break
            default:
                base_url += "?page=1"
        }
        fetch(base_url, { headers: { Authorization: `Token ${sessionStorage.getItem("token")}` } })
            .then((res => res.json()))
            .then((data) => {
                this.setState({ data: data.results, data_pag: { count: data.count, url: base_url } })
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
            <Container fluid className='ContainerDiv'>
                <Container>
                    <Header as="h2" color='red' className='projects-header'>Projects<Icon className='add-button' onClick={this.show('blurring')} name='plus' size='large' /></Header>
                    <Divider section />
                    <Segment horizontal textAlign='center' children={Button} >
                        <Button basic color='teal' onClick={(event) => { this.updateIssue("latest") }} > Latest</Button>
                        <Button basic color='blue' onClick={(event) => { this.updateIssue("myprojects") }} > My Projects</Button>
                        {/* <Button basic color='green' onClick={(event) => { this.updateIssue("tag") }} > Tags</Button> */}
                        <Button basic color='violet' onClick={(event) => { this.updateIssue("collaborated") }} > Collaborated</Button>
                    </Segment>
                    <Divider section />
                    <PaginationContainer onPageChange={(data, url) => { this.setState({ data: data, data_pag: { ...this.state.data_pag, url: url } }) }} data_pag={this.state.data_pag} />
                    {this.listProjects()}
                    <PaginationContainer onPageChange={(data, url) => { this.setState({ data: data, data_pag: { ...this.state.data_pag, url: url } }) }} data_pag={this.state.data_pag} />
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
            </Container>
        )
    }
}

export default ProjectPage