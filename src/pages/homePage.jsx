import React, { Component } from 'react';
import { Segment, Button, Grid, Container, Header, Breadcrumb, Card, Icon, Transition, Label } from 'semantic-ui-react';
import moment from 'moment'
import './scss/homePage.scss'
import './scss/tinymce.css'
// import { Editor } from '@tinymce/tinymce-react';
import { issue_url } from '../routes'

class IssueCard extends Component {
    constructor(props) {
        super(props)
        this.handleClickCardDescription = this.handleClickCardDescription.bind(this)
        this.state = {
            large: false
        }
    }

    toggle = () => this.setState({ large: !this.state.large })

    handleClickCardDescription(bug) {
        this.props.history.push({
            pathname: '/issue',
            state: { bug: bug.id }
        })
    }

    render() {
        const { bug } = this.props
        const { large } = this.state
        // console.log(bug)
        return (
            <Card fluid color='red' raised  >
                <Card.Content  >
                    <Card.Header>
                        <Icon name={(large) ? ("minus") : ("plus")} size='large' onClick={this.toggle} color='red' />
                        {bug.name}
                        <Icon name='reply' className='add-button' color='red' size='large' onClick={() => { this.handleClickCardDescription(bug) }} />
                        <Label attached='top right'>{<Icon name='tasks' />}{bug.project_name}</Label>
                    </Card.Header>
                </Card.Content>
                {large &&
                    <Transition.Group >
                        <Card.Content   >
                            <Card.Description >
                                <div dangerouslySetInnerHTML={{ __html: bug.description }} />
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra >
                            {moment(bug.issued_at).fromNow()}
                        </Card.Content>
                    </Transition.Group>
                }
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
            visible: false,
            isLoggedIn: false,
            activeDomain: null,
            activeStatus: null,
            important: false,
            myIssue: false,
        }
    }
    componentDidMount() {
        let isLoggedIn = this.props.isLoggedIn || sessionStorage.getItem("isLoggedIn")
        this.setState({ isLoggedIn: isLoggedIn })
        fetch(issue_url, { headers: { Authorization: `Token ${sessionStorage.getItem("token")}` } })
            .then(res => res.json())
            .then((data) => {
                this.setState({ data: data })
            });
    }
    fetch_content(type) {
        let base_url = issue_url
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
                // base_url += "mybugs/"
                base_url += `?creator=${JSON.parse(sessionStorage.getItem("user_data")).id}`
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
                    <IssueCard bug={bug} history={this.props.history} />
                )
            })
        }
        else {
            listCards = <Segment>issues are not available</Segment>
        }
        return listCards
    }

    toggleFilter = () => this.setState({ visible: !this.state.visible })
    async handleStatusClick(status) {
        (status === this.state.activeStatus) ? await this.setState({ activeStatus: null }) : await this.setState({ activeStatus: status })
        this.generateUrl()

    }
    async handleDomainClick(domain) {
        (domain === this.state.activeDomain) ? await this.setState({ activeDomain: null }) : await this.setState({ activeDomain: domain })
        this.generateUrl()
    }
    async handlemyIssueClick() {
        await this.setState({ myIssue: !this.state.myIssue })
        this.generateUrl()
    }
    async handleImportantClick() {
        await this.setState({ important: !this.state.important })
        this.generateUrl()
    }

    generateUrl() {
        let base_url = issue_url
        let x = []
        if (this.state.activeDomain != null) {
            x.push(`domain=${this.state.activeDomain}`)
        }
        if (this.state.activeStatus != null) {
            x.push(`status=${this.state.activeStatus}`)
        }
        if (this.state.important) {
            x.push("important=true")
        }
        if (this.state.myIssue) {
            x.push(`creator=${JSON.parse(sessionStorage.getItem("user_data")).id}`)
        }
        let params = x.join("&")
        let url = base_url+"?"+params
        this.get_content(url)        
    }
    async get_content(url){
        const headers = JSON.parse(sessionStorage.getItem("header"))
        let response = await fetch(url,{method:"GET",headers:headers})
        
        if(response.status ===200){
            let data = await response.json()
            this.setState({data:data})
        }
        else{
            console.log(response)
        }
    }

    render() {
        const { visible } = this.state
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
                        <Button icon="options" content="filter" onClick={() => { this.toggleFilter() }} />
                        <Transition visible={visible} duration={500} animation="slide down">
                            <Segment>
                                <Grid style={{ justifyContent: "space-evenly" }}>
                                    <Grid.Row textAlign='center' columns={4}>
                                        <Grid.Column> <Header>Status</Header></Grid.Column>
                                        <Grid.Column><Header>Domain</Header></Grid.Column>
                                        <Grid.Column><Header>My Issues</Header></Grid.Column>
                                        <Grid.Column><Header>Important</Header></Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row textAlign='center' columns={4} >
                                        <Grid.Column textAlign='center' style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                                            <Button color='red' basic={!(this.state.activeStatus === "P")} onClick={() => { this.handleStatusClick("P") }}> Pending</Button>
                                            <Button color='blue' basic={!(this.state.activeStatus === "R")} onClick={() => { this.handleStatusClick("R") }} > Resolved</Button>
                                            <Button color='green' basic={!(this.state.activeStatus === "T")} onClick={() => { this.handleStatusClick("T") }} > To Be Discussed</Button>
                                        </Grid.Column>
                                        <Grid.Column textAlign='center' style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                                            <Button color='red' basic={!(this.state.activeDomain === "f")} onClick={() => { this.handleDomainClick("f") }}> Front End</Button>
                                            <Button color='blue' basic={!(this.state.activeDomain === "b")} onClick={() => { this.handleDomainClick("b") }} > Back End</Button>
                                            <Button color='green' basic={!(this.state.activeDomain === "o")} onClick={() => { this.handleDomainClick("o") }} > Other</Button>
                                        </Grid.Column>
                                        <Grid.Column textAlign='center' style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                                            <Button basic={!this.state.myIssue} color='red' onClick={(event) => { this.handlemyIssueClick() }}> My Issues</Button>
                                        </Grid.Column>
                                        <Grid.Column textAlign='center' style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                                            <Button basic={!this.state.important} color='red' onClick={(event) => { this.handleImportantClick() }}> Important</Button>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Segment>
                        </Transition>





                        {/* <Segment.Group horizontal>
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
                        </Segment.Group> */}
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

export { IssueCard }
export default HomePage