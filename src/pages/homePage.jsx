import React, { Component } from 'react';
import { Segment, Container, Header, Breadcrumb } from 'semantic-ui-react';
import './scss/homePage.scss'
import './scss/tinymce.css'
import { issue_url } from '../api-routes'
import { NormalPlaceholder } from '../components/placeholders'
import { IssueCard } from '../components/cards'
import { PaginationContainer, IssueFilter } from '../components/helperComponents';

class HomePage extends Component {
    constructor(props) {
        super(props)
        this.updateIssue = this.updateIssue.bind(this)
        this.get_content = this.get_content.bind(this)
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
                        <IssueCard key={bug.id} bug={bug} history={this.props.history} />
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
        return (
            <Container fluid className="ContainerDiv">
                <Container>
                    <Breadcrumb size='huge' className="PageTopic" >
                        <Breadcrumb.Section>
                            <Header>Issues</Header>
                        </Breadcrumb.Section>
                    </Breadcrumb>
                    <Header dividing />
                    <IssueFilter get_content={this.get_content} />
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
                        <IssueCard key={bug.id} bug={bug} history={this.props.history} />
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