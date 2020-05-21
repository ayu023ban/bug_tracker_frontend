import React, { Component } from 'react';
import { Segment, Button, Container, Header, Breadcrumb, Card, Icon, Transition, Label } from 'semantic-ui-react';
import moment from 'moment'
import './scss/homePage.scss'


class IssueCard extends Component {
    render() {
        const { bug } = this.props
        return (
            <Card fluid color='red'>
                <Card.Content>
                    <Card.Header>
                        <Icon name='plus' color='red' />{bug.name}<Label attached='top right'>{<Icon name='tasks' />}{bug.project_name}</Label>
                    </Card.Header>
                </Card.Content>
                <Transition.Group>
                    <Card.Content>
                        <Card.Description content={bug.description} />
                    </Card.Content>
                    <Card.Content extra >
                        {moment(bug.issued_at).fromNow()}
                    </Card.Content>
                </Transition.Group>
            </Card>
        )
    }
}




class HomePage extends Component {
    constructor(props) {
        super(props)
        this.updateIssue = this.updateIssue.bind(this)
        this.state = {
            data: [],
            isLoggedIn: false
        }
    }
    componentDidMount() {
        let isLoggedIn = this.props.isLoggedIn || sessionStorage.getItem("isLoggedIn")
        this.setState({ isLoggedIn: isLoggedIn })
        fetch('http://localhost:8000/bug_reporter/bugs/', { headers: { Authorization: `Token ${sessionStorage.getItem("token")}` } })
            .then(res => res.json())
            .then((data) => {
                this.setState({ data: data })
            });
    }
    fetch_content(type) {
        let base_url = "http://localhost:8000/bug_reporter/bugs/"
        switch (type) {
            case "latest":
                base_url += "?ordering=-issued_at"
                break
            case "P":
                base_url += "?status=P"
                break
            case "R":
                base_url += "?status=R"
                break
            case "T":
                base_url += "?status=T"
                break
            case "imp":
                base_url += "?important=true"
                break
            case "myissue":
                base_url += "mybugs/"
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

    ListCards() {
        let listCards = []
        const { data } = this.state
        if (this.state.isLoggedIn) {
            listCards = data.map((bug) => {
                return (
                 <IssueCard bug={bug} />   
                )
            })
        }
        else {
            listCards = <Segment>issues are not awailable</Segment>
        }
        return listCards
    }

    render() {
        return (
            <div className="HomePage">
                <Container>
                    <Breadcrumb size='huge' className="PageTopic" >
                        <Breadcrumb.Section>
                            <Header>Issues</Header>
                        </Breadcrumb.Section>
                    </Breadcrumb>
                    <Header dividing />
                    <Container>
                        <Segment.Group horizontal>
                            <Segment horizontal textAlign='center' children={Button} >
                                <Button basic color='red' onClick={(event) => { this.updateIssue("P") }}> Pending</Button>
                                <Button basic color='blue' onClick={(event) => { this.updateIssue("R") }} > Resolved</Button>
                                <Button basic color='green' onClick={(event) => { this.updateIssue("T") }} > To Be Discussed</Button>
                            </Segment>
                            <Segment horizontal textAlign='center' children={Button} >
                                <Button basic color='teal' onClick={(event) => { this.updateIssue("latest") }} > Latest</Button>
                                <Button basic color='blue' onClick={(event) => { this.updateIssue("myissue") }} > My Issues</Button>
                                <Button basic color='green' onClick={(event) => { this.updateIssue("tag") }} > Tags</Button>
                                <Button basic color='violet' onClick={(event) => { this.updateIssue("imp") }} > Important</Button>
                            </Segment>
                        </Segment.Group>
                    </Container>
                    <Header dividing />
                    <Container >
                        {this.ListCards()}
                    </Container>
                </Container>
            </div>
        )
    }
}

export {IssueCard}
export default HomePage