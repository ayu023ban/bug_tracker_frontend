import React, { Component } from 'react'
import { Segment, Container, Breadcrumb, Header, Button, Card, Icon, Image, Divider } from 'semantic-ui-react'
import Pluralize from 'react-pluralize'
import "./scss/projectPage.scss"
import Axios from 'axios'

class ProjectPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            isLoggedIn: false
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

    listProjects() {
        let listCards = []
        let { data } = this.state
        if (this.state.isLoggedIn) {
            console.log(data)
            listCards = data.map(element =>
                <Card color='red' raised>
                    <Card.Content>
                        <Card.Description>
                            {element.wiki}
                            <Image floated='right' ><Icon name="github" size='big' /></Image>
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
            listCards = <Segment>"Projects are now available"</Segment>
        }


        return listCards
    }

    render() {
        return (
            <Container>
                <Breadcrumb size='huge' className="PageTopic" >
                    <Breadcrumb.Section>
                        <Header>Projects</Header>
                    </Breadcrumb.Section>
                </Breadcrumb>
                <Divider section />
                <Segment horizontal textAlign='center' children={Button} >
                    <Button basic color='teal' onClick={(event) => { this.updateIssue("latest") }} > Latest</Button>
                    <Button basic color='blue' onClick={(event) => { this.updateIssue("myissue") }} > My Issues</Button>
                    <Button basic color='green' onClick={(event) => { this.updateIssue("tag") }} > Tags</Button>
                    <Button basic color='violet' onClick={(event) => { this.updateIssue("imp") }} > Important</Button>
                </Segment>
                <Divider section />
                <Container>
                    <Card.Group itemsPerRow='2'>
                        {this.listProjects()}
                    </Card.Group>

                </Container>
            </Container>
        )
    }
}

export default ProjectPage