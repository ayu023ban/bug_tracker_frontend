import React, { Component } from 'react'
import { Container, Pagination, Button, Transition, Segment, Grid, Header } from 'semantic-ui-react'
import { issue_url } from '../api-routes'
class PaginationContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data_pag: this.props.data_pag
        }
        this.pageChange = this.pageChange.bind(this)
    }
    componentDidUpdate(prevProps) {
        if (prevProps.data_pag !== this.props.data_pag) {
            this.setState({ data_pag: this.props.data_pag })
        }
    }
    activePage() {
        let regex = /^(.*)page=(\d*)(.*)$/
        return Number(this.state.data_pag.url.match(regex)[2])
    }
    async pageChange(e, d) {
        let regex = /page=\d+/
        let url = this.state.data_pag.url.replace(regex, `page=${d.activePage}`)
        let header = JSON.parse(sessionStorage.getItem("header"))
        let res = await fetch(url, { method: "Get", headers: header })
        let data = await res.json()
        await this.setState({ data_pag: { count: data.count, url: url } })
        this.props.onPageChange(data.results)
    }
    render() {
        const { data_pag } = this.state
        return (
            <Container>
                {data_pag.count > 10 &&
                    <Container textAlign='center' style={{ padding: "20px" }}>
                        <Pagination
                            activePage={this.activePage()}
                            firstItem={null} lastItem={null}
                            totalPages={Math.ceil(data_pag.count / 10)}
                            prevItem={this.activePage() === 1 ? null : undefined}
                            nextItem={this.activePage() === Math.ceil(data_pag.count / 10) ? null : undefined}
                            onPageChange={this.pageChange}
                            showFirstAndLastNav={true}
                        />
                    </Container>
                }
            </Container>
        )
    }
}

class IssueFilter extends Component {
    constructor(props) {
        super(props)
        this.generateUrl = this.generateUrl.bind(this)
        this.state = {
            visible: false,
            activeDomain: null,
            activeStatus: null,
            important: false,
            isCreatedByMeIssue: false,
            isReportedToMeIssue: false,
        }
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
        let base_url = this.props.url || issue_url;
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
        let regex = /.*\?.*/
        let q =(x.length !== 0)?(regex.test(base_url))?"&": "?" : ""
        let url = base_url + q + params + ((x.length !== 0 || regex.test(base_url)) ? "&page=1" : "?page=1")
        this.props.get_content(url)
    }
    render() {
        const { visible, activeDomain, activeStatus, important, isCreatedByMeIssue, isReportedToMeIssue } = this.state
        return (
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
                                        <Button color='red' basic={activeStatus !== "P"} onClick={() => { this.handleStatusClick("P") }}> Pending</Button>
                                        <Button color='green' basic={activeStatus !== "R"} onClick={() => { this.handleStatusClick("R") }} > Resolved</Button>
                                        <Button color='yellow' basic={activeStatus !== "T"} onClick={() => { this.handleStatusClick("T") }} > To Be Discussed</Button>
                                    </Button.Group>
                                </Grid.Column>
                                <Grid.Column textAlign='center' style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                                    <Button.Group vertical>
                                        <Button color='red' basic={activeDomain !== "f"} onClick={() => { this.handleDomainClick("f") }}> Front End</Button>
                                        <Button color='blue' basic={activeDomain !== "b"} onClick={() => { this.handleDomainClick("b") }} > Back End</Button>
                                        <Button color='green' basic={activeDomain !== "o"} onClick={() => { this.handleDomainClick("o") }} > Other</Button>
                                    </Button.Group>
                                </Grid.Column>
                                <Grid.Column textAlign='center' style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                                    <Button.Group vertical>
                                        <Button basic={!isCreatedByMeIssue} color='red' onClick={(event) => { this.handleCreatedByMeIssueClick() }}> Created By Issues</Button>
                                        <Button basic={!isReportedToMeIssue} color='blue' onClick={(event) => { this.handleReportedToMeIssueClick() }}> Reported By Issues</Button>
                                    </Button.Group>
                                </Grid.Column>
                                <Grid.Column textAlign='center' style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                                    <Button basic={!important} color='red' onClick={(event) => { this.handleImportantClick() }}> Important</Button>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>
                </Transition>
                <Header dividing />
            </Container>

        )
    }

}
export { PaginationContainer, IssueFilter }