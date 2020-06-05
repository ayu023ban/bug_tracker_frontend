import React, { Component } from 'react';
import { Segment, Button, Grid, Container, Header, Breadcrumb, Transition } from 'semantic-ui-react';
import './scss/homePage.scss'
import './scss/tinymce.css'
import { issue_url } from '../api-routes'
import { NormalPlaceholder } from '../components/placeholders'
import { IssueCard } from '../components/cards'

class HomePage extends Component {
    constructor(props) {
        super(props)
        this.updateIssue = this.updateIssue.bind(this)
        this.generateUrl = this.generateUrl.bind(this)
        this.state = {
            data: null,
            visible: false,
            tagView: { is: false, tag: { id: null, name: null } },
            isLoggedIn: false,
            activeDomain: null,
            activeStatus: null,
            important: false,
            myIssue: false,
        }
    }
    async componentDidMount() {
        let isLoggedIn = this.props.isLoggedIn || sessionStorage.getItem("isLoggedIn")
        let res = await fetch(issue_url, { headers: { Authorization: `Token ${sessionStorage.getItem("token")}` } })
        let data = await res.json()
        await this.setState({ data: data, isLoggedIn: isLoggedIn })
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
        if (Boolean(data)) {
            if (data.length !== 0) {
                listCards = data.map((bug) => {
                    return (
                        <IssueCard bug={bug} history={this.props.history} />
                    )
                })
            }
            else {
                listCards = <Segment>issues are not available</Segment>
            }
        }
        else {
            listCards =
                <Container>
                    <NormalPlaceholder />
                    <NormalPlaceholder />
                    <NormalPlaceholder />
                </Container>
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
        let q = (x.length !== 0) ? "?" : ""
        let url = base_url + q + params

        this.get_content(url)
    }
    async get_content(url) {
        const headers = JSON.parse(sessionStorage.getItem("header"))
        let response = await fetch(url, { method: "GET", headers: headers })

        if (response.status === 200) {
            let data = await response.json()
            this.setState({ data: data })
        }
        else {
            console.log(response)
        }
    }

    render() {
        const { visible, tagView } = this.state
        return (
            <Container className="ContainerDiv">

                <Breadcrumb size='huge' className="PageTopic" >
                    <Breadcrumb.Section>
                        <Header>{(tagView.is) ? `Issues tagged [${tagView.tag.name}]` : "Issues"}</Header>
                    </Breadcrumb.Section>
                </Breadcrumb>
                <Header dividing />
                {!tagView.is &&
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
                        <Header dividing />
                    </Container>
                }

                <Container >
                    {this.ListCards()}
                </Container>
            </Container>
        )
    }
}

class smallHomePage extends Component {
    state = {
        data:null,
        tag:this.props.location.state.tag
    }

    async componentDidMount(){
        let url = issue_url+`?tags=${this.state.tag.id}`
        const headers = JSON.parse(sessionStorage.getItem("header"))
        let response = await fetch(url, { method: "GET", headers: headers })
        if (response.status === 200) {
            let data = await response.json()
            this.setState({ data: data })
        }
        else {
            console.log(response)
        }
    }
    ListCards() {
        let listCards = []
        const { data } = this.state
        if (Boolean(data)) {
            if (data.length !== 0) {
                listCards = data.map((bug) => {
                    return (
                        <IssueCard bug={bug} history={this.props.history} />
                    )
                })
            }
            else {
                listCards = <Segment>issues are not available</Segment>
            }
        }
        else {
            listCards =
                <Container>
                    <NormalPlaceholder />
                    <NormalPlaceholder />
                    <NormalPlaceholder />
                </Container>
        }

        return listCards
    }
    render() {
        const { tag } = this.state
        return (
            <Container className="ContainerDiv">
                <Breadcrumb size='huge'>
                    <Breadcrumb.Section>
                        <Header>{`Issues tagged [${tag.name}]`}</Header>
                    </Breadcrumb.Section>
                </Breadcrumb>
                <Header dividing />
                <Container >
                    {this.ListCards()}
                </Container>
            </Container>
        )
    }
}
export {smallHomePage}
export default HomePage 