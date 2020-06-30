import React, { Component } from 'react'
import { Container, Header, Breadcrumb, Segment, Icon, Divider, Card, Modal, Grid, Button, Dropdown, Feed, Placeholder } from 'semantic-ui-react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import Avatar from 'react-avatar'
import './scss/projectDetail.scss'
import { project_url, user_url, issue_url } from '../api-routes'
import axios from 'axios'
import { IssueCard } from '../components/cards'
import { ProjectForm, IssueForm } from '../components/forms'
import { filter } from '../components/helperFunctions'
import { NormalPlaceholder, BigPlaceholder } from '../components/placeholders'
import { IssueFilter, PaginationContainer } from '../components/helperComponents'




class ProjectDetail extends Component {
    constructor(props) {
        super(props)
        const warning_text = "Your are trying to delete the whole project,all issues and comments related to this will also be deleted. \n Are you sure?"
        if (this.props.location.state === undefined) {
            this.props.location.state = { id: 1 } //giving temporary id
            this.props.history.push({ pathname: "/projects" })
        }
        this.state = {
            id: this.props.location.state.id,
            data: null,
            issue_data: null,
            issue_data_pag: { count: null, url: issue_url + `?project=${this.props.location.state.id}&page=1` },
            member_names: null,
            member_ids: [],
            openModal1: false,
            openModal2: false,
            warning_text: warning_text,
            isUserATeamMember: false,
            isUserACreator: false,
            activeDomain: "f",
            updatingForm: false,
        }
        this.deleteCurrentProject = this.deleteCurrentProject.bind(this)
        this.onChange = this.onChange.bind(this)
        this.createIssue = this.createIssue.bind(this)
        this.updateFormToggle = this.updateFormToggle.bind(this)
        this.get_issue_content = this.get_issue_content.bind(this)
    }

    deleteProjectModalShow = () => this.setState({ openModal1: true })
    deleteProjectModalClose = () => this.setState({ openModal1: false })
    newIssueShow = () => this.setState({ openModal2: true })
    newIssueClose = () => this.setState({ openModal2: false })
    updateFormToggle = () => this.setState({ updatingForm: !this.state.updatingForm })


    async componentDidMount() {
        const project_detail_url = project_url + this.state.id.toString() + "/"
        const get_issues_url = issue_url + `?project=${this.state.id}&page=1`
        const headers = JSON.parse(sessionStorage.getItem("header"))
        let project_res = await fetch(project_detail_url, { headers: headers })
        let data = await project_res.json()
        await this.setState({ data: data, member_names: data.member_names, member_ids: data.members })
        let issues_res = await fetch(get_issues_url, { headers: headers })
        let issue_data = await issues_res.json()
        await this.setState({ issue_data: issue_data.results, issue_data_pag: { ...this.state.issue_data_pag, count: issue_data.count }, })
        if (project_res === 200 && issues_res === 200) {
            this.setPermissions()
            this.stateOptions()
        }
    }

    deleteCurrentProject() {
        console.log(this.state.id)
        const url = project_url + this.state.id.toString() + "/"
        const headers = JSON.parse(sessionStorage.getItem("header"))
        fetch(url, { method: 'DELETE', headers: headers }).then((res) => {
            if (res.status === 204) {
                this.props.history.push({
                    pathname: "/projects"
                }
                )
            }
        })
    }

    stateOptions() {
        const header = JSON.parse(sessionStorage.getItem("header"))
        fetch(user_url, { headers: header }).then(res => res.json()).then((data) => {
            data = data.results
            const user_data = data.map((element) => {
                return {
                    key: element.id.toString(),
                    text: element.full_name,
                    value: element.full_name
                }
            })
            this.setState({ user_data_for_search: user_data })
        })
    }

    async get_issue_content(url) {
        const headers = JSON.parse(sessionStorage.getItem("header"))
        let response = await fetch(url, { method: "GET", headers: headers })

        if (response.status === 200) {
            let data = await response.json()
            this.setState({ issue_data: data.results, issue_data_pag: { count: data.count, url: url } })
        }
        else {
            console.log(response)
        }
    }

    onChange(event, data) {
        const user_id = data.value.map((element) => {
            let obj = this.state.user_data_for_search.find(o => o.text === element)
            return Number(obj.key)
        })
        const body = JSON.stringify({ members: user_id })
        const url = project_url + this.state.id.toString() + "/update_members/"
        const params = { method: 'PATCH', body: body, headers: { 'Content-Type': 'application/json', "Authorization": `Token ${sessionStorage.getItem("token")}` } }
        fetch(url, params).then(res => res.json()).then(res => res.user_ids).then((user_ids) => {
            const user_names = user_ids.map((id) => {
                return this.state.user_data_for_search.find(o => o.key === id.toString()).text
            })
            this.setState({ member_names: user_names, member_ids: user_ids })
        })
    }

    search_component() {
        const search = <Dropdown
            placeholder='Add Members'
            fluid
            multiple
            onChange={this.onChange}
            search
            selection
            options={this.state.user_data_for_search}
        />
        return search

    }
    setPermissions() {
        const user_id = JSON.parse(sessionStorage.getItem("user_data")).id
        const isCreator = this.state.data.creator === user_id
        const isMember = this.state.member_ids.includes(user_id)
        this.setState({ isUserATeamMember: isMember, isUserACreator: isCreator })
    }
    DisPlayMembers() {
        const { member_names } = this.state
        if (member_names) {
            if (member_names.length !== 0) {
                const list = member_names.map(element =>
                    <Feed.Event >
                        <Feed.Label>
                            <Avatar name={element} size='40' />
                        </Feed.Label>
                        <Feed.Content>
                            <Feed.Summary>
                                {element}
                            </Feed.Summary>
                        </Feed.Content>
                    </Feed.Event>
                )
                const final_list = <Feed>{list}</Feed>
                return final_list
            }
            else return <Feed.Event><Feed.Label>No members</Feed.Label></Feed.Event>
        }
        else {
            return <Placeholder>
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
            </Placeholder>
        }

    }
    ListCards() {
        let listCards = []
        const { issue_data } = this.state
        if (Boolean(issue_data)) {
            if (issue_data.length !== 0) {
                listCards = issue_data.map((bug) => {
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

    creator() {

        if (this.state.data !== null && this.state.user_data_for_search !== undefined) {
            return this.state.user_data_for_search.find(o => Number(o.key) === this.state.data.creator).text
        }
        return "anonymous"
    }
    creatorClick(id) {
        this.props.history.push({
            pathname: '/user',
            state: { id: id }
        })
    }
    async createIssue(data) {
        data.status = "P"
        data.project = this.state.id
        const header = {
            "Content-Type": "application/json",
            "Authorization": `Token ${sessionStorage.getItem("token")}`
        }
        let res = await axios.post(issue_url, data, { headers: header })
        if (res.status === 201) {
            this.newIssueClose()
            this.setState({
                issue_data: [res.data, ...this.state.issue_data]
            })
        }
        else {
            console.log(res)
        }
    }

    updateProject(data) {
        data = JSON.stringify(data)
        const project_detail_url = project_url + this.state.id.toString() + "/"
        fetch(project_detail_url, {
            method: 'PATCH', body: data,
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': `Token ${sessionStorage.getItem('token')}`,
            },
        }).then((res) => {
            if (res.status === 200) {
                return res.json()
            }
            else {
                console.log(res)
            }
        }).then((data) => {
            this.setState({ data: data })
            this.updateFormToggle()
        })
    }
    renderProjectCard() {
        let { data, isUserACreator, isUserATeamMember } = this.state
        if (Boolean(data)) {
            return <Card color='red' fluid>
                <Card.Content className="CardTop"  >
                    <Card.Description><div dangerouslySetInnerHTML={{ __html: data.wiki }} /></Card.Description>
                </Card.Content>
                <Card.Content textAlign='center'>
                    <Header as='h2'>
                        {data.name}
                    </Header>
                </Card.Content>
                <Card.Content extra>created by {this.creator()} {moment(data.created_at).fromNow()}</Card.Content>
                {isUserATeamMember &&
                    <Card.Content>
                        <Grid columns={3} divided >
                            <Grid.Row textAlign='center'>
                                <Grid.Column >
                                    {this.search_component()}
                                </Grid.Column>
                                <Grid.Column >
                                    <Icon name='edit' onClick={this.updateFormToggle} />
                                </Grid.Column>
                                <Grid.Column >
                                    <Button disabled={!isUserACreator} style={{ margin: "0", padding: "0" }} className='delete' icon onClick={this.deleteProjectModalShow}><Icon color='red' name='delete' />Delete</Button>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Card.Content>
                }
            </Card>
        }
        else {
            return <BigPlaceholder />
        }
    }

    render() {
        const { data, openModal1, openModal2, updatingForm } = this.state
        return (
            <Container fluid className="ContainerDiv" >
                <Container>
                    <Header>
                        <Breadcrumb as={Header}>
                            <Breadcrumb.Section className='previousSection' as={Link} to='/projects'>Projects</Breadcrumb.Section>
                            <Breadcrumb.Divider><Icon name='angle right' /></Breadcrumb.Divider>
                            <Breadcrumb.Section>{Boolean(data) ? data.name : <Placeholder><Placeholder.Line /></Placeholder>}</Breadcrumb.Section>
                        </Breadcrumb>
                    </Header>
                    <Divider section />
                    {!updatingForm &&
                        this.renderProjectCard()
                    }
                    {updatingForm &&
                        <Card fluid color='red'>
                            <Card.Content>
                                <ProjectForm onClose={this.updateFormToggle} isClose initialValues={filter(this.state.data, ["name", "wiki", "githublink"])} submitName="Update" onSubmit={(data) => { this.updateProject(data) }} />
                            </Card.Content>
                        </Card>

                    }

                    <Container fluid className="memberContainer">
                        <Card color='red' className="members">
                            <Card.Content textAlign='center' >
                                <Card.Header>Members</Card.Header>
                            </Card.Content>
                            <Card.Content>
                                {this.DisPlayMembers()}
                            </Card.Content>
                        </Card>
                    </Container>

                    <Header size='large' color='red'>
                        Issues
                {Boolean(data) ? <Button className='addIssueButton' onClick={this.newIssueShow} icon='plus' size='large' /> : null}
                    </Header>
                    <Divider section />
                    <IssueFilter url={issue_url + `?project=${this.state.id}`} get_content={this.get_issue_content} />
                    <PaginationContainer onPageChange={(data,url) => { this.setState({ issue_data: data,issue_data_pag:{...this.state.issue_data_pag,url:url} }) }} data_pag={this.state.issue_data_pag} />
                    <Container className="issueCardGroup" get_content={this.get_issue_content} >
                        {this.ListCards()}
                    </Container>
                    <PaginationContainer onPageChange={(data,url) => { this.setState({ issue_data: data ,issue_data_pag:{...this.state.issue_data_pag,url:url}}) }} data_pag={this.state.issue_data_pag} />
                    <Modal open={openModal1} basic onClose={this.deleteProjectModalClose} size='small'>
                        <Header icon='archive' content='Delete the Current Project' />
                        <Modal.Content>
                            <p>
                                {this.state.warning_text.split('\n').map((item, key) => {
                                    return <span key={key}>{item}<br /></span>
                                })}
                            </p>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button basic color='red' onClick={this.deleteProjectModalClose} inverted>
                                <Icon name='remove' /> No
                                            </Button>
                            <Button color='green' onClick={this.deleteCurrentProject} inverted>
                                <Icon name='checkmark' /> Yes
                                            </Button>
                        </Modal.Actions>
                    </Modal>

                    <Modal dimmer open={openModal2} onClose={this.newIssueClose} closeOnEscape size='large' >
                        <Modal.Header>Create New Issue</Modal.Header>
                        <Modal.Content scrolling>
                            <Modal.Description>
                                <IssueForm tags={true} onSubmit={this.createIssue} submitName="Create" isDomain={true} />
                            </Modal.Description>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color='black' onClick={this.newIssueClose} content='Cancel' />
                        </Modal.Actions>
                    </Modal>
                </Container>
            </Container>
        )
    }
}
export default ProjectDetail
