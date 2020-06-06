import React, { Component } from 'react';
import { Segment, Button, Grid, Container, Header, Breadcrumb, Transition } from 'semantic-ui-react';
import './scss/homePage.scss'
import './scss/tinymce.css'
import { issue_url } from '../api-routes'
import { NormalPlaceholder } from '../components/placeholders'
import { IssueCard } from '../components/cards'
import { PaginationContainer } from '../components/helperComponents';

class HomePage extends Component {
    constructor(props) {
        super(props)
        this.updateIssue = this.updateIssue.bind(this)
        this.generateUrl = this.generateUrl.bind(this)
        this.state = {
            data: null,
            visible: false,
            isLoggedIn: false,
            activeDomain: null,
            activeStatus: null,
            important: false,
            isCreatedByMeIssue: false,
            isReportedToMeIssue: false,
            data_pag: { count: null, url: issue_url + "?page=1" },
        }
    }
    async componentDidMount() {
        let isLoggedIn = this.props.isLoggedIn || sessionStorage.getItem("isLoggedIn")
        let res = await fetch(this.state.data_pag.url, { headers: { Authorization: `Token ${sessionStorage.getItem("token")}` } })
        let data = await res.json()
        await this.setState({ data: data.results, data_pag: { ...this.state.data_pag, count: data.count }, isLoggedIn: isLoggedIn })
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
                base_url += `?creator=${JSON.parse(sessionStorage.getItem("user_data")).id}`
                break
            default:
                base_url += ""
        }

        fetch(base_url, { headers: { Authorization: `Token ${sessionStorage.getItem("token")}` } })
            .then((res => res.json()))
            .then((data) => {
                this.setState({ data: data.results })
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
    async handleCreatedByMeIssueClick() {
        await this.setState({ isCreatedByMeIssue: !this.state.isCreatedByMeIssue })
        this.generateUrl()
    }
    async handleReportedToMeIssueClick() {
        await this.setState({ isReportedToMeIssue: !this.state.isReportedToMeIssue })
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
        if (this.state.isCreatedByMeIssue) {
            x.push(`creator=${JSON.parse(sessionStorage.getItem("user_data")).id}`)
        }
        if (this.state.isReportedToMeIssue) {
            x.push(`assigned_to=${JSON.parse(sessionStorage.getItem("user_data")).id}`)
        }
        let params = x.join("&")
        let q = (x.length !== 0) ? "?" : ""
        let url = base_url + q + params + ((x.length !== 0) ? "&page=1" : "?page=1")
        console.log(url)
        this.get_content(url)
    }
    async get_content(url) {
        const headers = JSON.parse(sessionStorage.getItem("header"))
        let response = await fetch(url, { method: "GET", headers: headers })

        if (response.status === 200) {
            let data = await response.json()
            this.setState({ data: data.results, data_pag: { count: data.count, url: url } })
        }
        else {
            console.log(response)
        }
    }
    render() {
        const { visible } = this.state
        return (
            <Container fluid className="ContainerDiv">
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
                                        <Button.Group vertical>
                                            <Button color='red' basic={!(this.state.activeStatus === "P")} onClick={() => { this.handleStatusClick("P") }}> Pending</Button>
                                            <Button color='blue' basic={!(this.state.activeStatus === "R")} onClick={() => { this.handleStatusClick("R") }} > Resolved</Button>
                                            <Button color='green' basic={!(this.state.activeStatus === "T")} onClick={() => { this.handleStatusClick("T") }} > To Be Discussed</Button>
                                        </Button.Group>
                                    </Grid.Column>
                                    <Grid.Column textAlign='center' style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                                        <Button.Group vertical>
                                            <Button color='red' basic={!(this.state.activeDomain === "f")} onClick={() => { this.handleDomainClick("f") }}> Front End</Button>
                                            <Button color='blue' basic={!(this.state.activeDomain === "b")} onClick={() => { this.handleDomainClick("b") }} > Back End</Button>
                                            <Button color='green' basic={!(this.state.activeDomain === "o")} onClick={() => { this.handleDomainClick("o") }} > Other</Button>
                                        </Button.Group>
                                    </Grid.Column>
                                    <Grid.Column textAlign='center' style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                                        <Button.Group vertical>
                                            <Button basic={!this.state.isCreatedByMeIssue} color='red' onClick={(event) => { this.handleCreatedByMeIssueClick() }}> Created By Issues</Button>
                                            <Button basic={!this.state.isReportedToMeIssue} color='blue' onClick={(event) => { this.handleReportedToMeIssueClick() }}> Reported By Issues</Button>
                                        </Button.Group>
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
                <PaginationContainer onPageChange={(data) => { this.setState({ data: data }) }} data_pag={this.state.data_pag} />
                <Container >
                    {this.ListCards()}
                </Container>
                <PaginationContainer onPageChange={(data) => { this.setState({ data: data }) }} data_pag={this.state.data_pag} />
                </Container>
            </Container>
        )
    }
}

class smallHomePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
            tag: this.props.location.state.tag,
            data_pag: { count: null, url: issue_url + `?tags=${this.props.location.state.tag.id}&page=1` },
        }
    }


    async componentDidMount() {
        let url = issue_url + `?tags=${this.state.tag.id}`
        const headers = JSON.parse(sessionStorage.getItem("header"))
        let response = await fetch(url, { method: "GET", headers: headers })
        if (response.status === 200) {
            let data = await response.json()
            this.setState({ data: data.results, data_pag: { ...this.state.data_pag, count: data.count } })
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
            <Container fluid className="ContainerDiv">
                <Container>
                    <Breadcrumb size='huge'>
                        <Breadcrumb.Section>
                            <Header>{`Issues tagged [${tag.name}]`}</Header>
                        </Breadcrumb.Section>
                    </Breadcrumb>
                    <Header dividing />
                    <PaginationContainer onPageChange={(data) => { this.setState({ data: data }) }} data_pag={this.state.data_pag} />
                    <Container >
                        {this.ListCards()}
                    </Container>
                    <PaginationContainer onPageChange={(data) => { this.setState({ data: data }) }} data_pag={this.state.data_pag} />
                </Container>
            </Container>
        )
    }
}
export { smallHomePage }
export default HomePage 