import React, { Component } from 'react'
import { Container, Label, Card, Header, Breadcrumb, Segment, Button, Icon, Divider, Modal, Dropdown, Popup } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import './scss/tinymce.css'
import { issue_url, comment_url, project_url } from "../api-routes"
import WebSocketInstance from './websocket'
import moment from 'moment'
import Pluralize from 'react-pluralize'
import EditorPage from './editor'
import './scss/issueDetail.scss'
import { IssueForm } from '../components/forms'
import { filter } from '../components/helperFunctions'
import { NormalPlaceholder, BigPlaceholder } from '../components/placeholders'
import { CommentCard } from '../components/cards'
class IssueDetail extends Component {
    constructor(props) {
        super(props)
        this.handleEditorChange = this.handleEditorChange.bind(this)
        this.assignDropClick = this.assignDropClick.bind(this)
        this.commentsLoderFromWebsocket = this.commentsLoderFromWebsocket.bind(this)
        this.newCommentFromWebsocket = this.newCommentFromWebsocket.bind(this)
        this.goToCorrespondingProject = this.goToCorrespondingProject.bind(this)
        this.settingToggle = this.settingToggle.bind(this)
        this.updateIssue = this.updateIssue.bind(this)
        this.newCommentFromWebsocket = this.newCommentFromWebsocket.bind(this)
        this.fetchCommentFromWebSocket = this.fetchCommentFromWebSocket.bind(this)
        if (this.props.location.state === undefined) {
            this.props.location.state = { bug: 1 } //giving temporary id
            this.props.history.push({ pathname: "/home" })
        }
        this.state = {
            id: this.props.location.state.bug,
            comments: null,
            bug: null,
            settingsOpen: false,
            updateForm: false,
            update: [],
            members_data_for_search: [],
            updateFormDescription: null,
            deleteCommentModalOpen: false,
            deleteIssueModalOpen: false,
            editAssign: false
        }
    }

    async componentDidMount() {
        let header = JSON.parse(sessionStorage.getItem("header"))
        WebSocketInstance.connect(`ws://localhost:8000/bug_reporter/ws/comments/${this.state.id}`)
        WebSocketInstance.addCallbacks(this.commentsLoderFromWebsocket, this.newCommentFromWebsocket)
        this.ma = setInterval(this.fetchCommentFromWebSocket, 500)
        const issueurl = issue_url + this.state.id.toString() + "/"
        const res = await fetch(issueurl, { headers: header })
        if (res.status === 200) {
            const data = await res.json()
            await this.setState({ bug: data, activeStatus: data.status, activeDomain: data.domain })
            this.setPermissions()
        }
        else this.props.history.replace("/issues")
    }

    fetchCommentFromWebSocket() {
        if (WebSocketInstance.state() === 1) {
            clearInterval(this.ma)
            WebSocketInstance.fetchMessages()
        }
    }

    commentsLoderFromWebsocket(data) {
        const comments = data["data"]
        this.setState({ comments: comments })
    }

    newCommentFromWebsocket(data) {
        const comment = data.data
        this.setState({ comments: [comment, ...this.state.comments] })
    }

    async setPermissions() {
        const projectId = this.state.bug.project
        const url = project_url + projectId.toString() + "/"
        const header = JSON.parse(sessionStorage.getItem("header"))
        const res = await fetch(url, { method: "GET", headers: header })
        let members = await res.json()
        let members_data_for_search = []
        for (let i = 0; i < members.members.length; i++) {
            let obj = {
                key: members.members[i],
                text: members.member_names[i],
                value: members.member_names[i]
            }
            members_data_for_search.push(obj)
        }
        members = members.members
        const user = JSON.parse(sessionStorage.getItem("user_data"))
        const userId = user.id
        const isMaster = user.isMaster
        const isuserACreator = this.state.bug.creator === userId || isMaster
        const isUserAMember = members.includes(userId) || isMaster
        this.setState({
            isUserAMember: isUserAMember,
            isuserACreator: isuserACreator,
            members_data_for_search: members_data_for_search
        })
    }
    DeleteClickHandler(id) {
        this.setState({ commentToBeDelete: id })
        this.toggleDeleteComment()
    }

    listComments() {
        const { comments } = this.state
        const userId = JSON.parse(sessionStorage.getItem("user_data")).id
        let list;
        if (Boolean(comments)) {
            if (comments.length !== 0) {
                list = comments.map(comment =>
                    <CommentCard key={comment.id} history={this.props.history} comment={comment} userId={userId} onCommentTrashClick={(id) => { this.DeleteClickHandler(id) }} />
                )
            }
            else {
                list = <Segment raised>no comments available</Segment>
            }
        }
        else list =
            <Container>
                <NormalPlaceholder />
                <NormalPlaceholder />
                <NormalPlaceholder />
            </Container>

        return list
    }

    deleteComment() {
        const url = comment_url + this.state.commentToBeDelete.toString() + "/"
        fetch(url, {
            method: 'DELETE',
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': `Token ${sessionStorage.getItem('token')}`,
            }
        }).then((res) => {
            if (res.status === 204) {
                WebSocketInstance.fetchMessages()
                this.toggleDeleteComment()
            }
            else {
                console.log(res)
            }
        })

    }

    handleEditorChange(content) {
        this.setState({ commentDescription: content })
    }
    onCommentSubmit() {
        WebSocketInstance.newComment(this.state.commentDescription)
    }

    deleteIssue() {
        const url = issue_url + this.state.id.toString() + "/"
        fetch(url, {
            method: 'DELETE',
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': `Token ${sessionStorage.getItem('token')}`,
            }
        })
            .then((res) => {
                (res.status === 204) ? (this.props.history.push({ pathname: "/home" })) : (console.log(res))
            })
    }

    updateIssue(data) {
        data = JSON.stringify(data)
        const url = issue_url + this.state.id.toString() + "/"
        fetch(url, {
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
            this.setState({ bug: data })
            this.formToggle()
        })
    }

    domainUpdate(string) {
        const url = issue_url + this.state.id.toString() + "/"
        fetch(url, {
            method: 'PATCH',
            body: JSON.stringify({ domain: string }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': `Token ${sessionStorage.getItem('token')}`,
            },
        }).then((res) => {
            if (res.status === 200) {
                this.setState({ activeDomain: string })
            }
            else {
                console.log(res)
            }
        })
    }

    statusUpdate(string) {
        const url = issue_url + this.state.id.toString() + "/"
        fetch(url, {
            method: 'PATCH',
            body: JSON.stringify({ status: string }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': `Token ${sessionStorage.getItem('token')}`,
            },
        }).then((res) => {
            if (res.status === 200) {
                this.setState({ activeStatus: string })
            }
            else {
                console.log(res)
            }
        })
    }

    goToCorrespondingProject() {
        this.props.history.push({
            pathname: '/project',
            state: { id: this.state.bug.project }
        })
    }

    setImportant() {
        const url = issue_url + this.state.id.toString() + "/"
        const imp = this.state.bug.important
        fetch(url, {
            method: 'PATCH',
            body: JSON.stringify({ important: !imp }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': `Token ${sessionStorage.getItem('token')}`,
            },
        }).then(res => {
            if (res.status === 200) {
                this.setState({ bug: { ...this.state.bug, important: !imp } })
            }
            else {
                console.log(res)
            }
        })
    }

    assignComponent() {
        let search;
        if (this.state.isUserAMember) {
            search =
                <span style={{ display: "flex", alignItems: "center" }}>
                    {(this.state.editAssign) ?
                        <Dropdown
                            placeholder='Select Member to assign'
                            fluid
                            search
                            clearable
                            closeOnChange={false}
                            onClose={() => { this.setState({ editAssign: !this.state.editAssign }) }}
                            selection
                            onChange={this.assignDropClick}
                            options={this.state.members_data_for_search}
                        />
                        :
                        <span>
                            {(this.state.bug.assigned_to != null) ?
                                <span>
                                    assigned to <span onClick={() => { this.creatorClick(this.state.bug.assigned_to) }} style={{ cursor: "pointer", fontWeight: "bold" }}>{this.state.bug.assigned_name}</span>
                                </span>
                                :
                                <span>assign to team member</span>
                            }
                            <Button icon="edit" style={{ backgroundColor: "inherit" }} onClick={() => { this.setState({ editAssign: !this.state.editAssign }) }} />
                        </span>
                    }
                </span>
        }
        else if (this.state.bug.assigned_to != null) {
            search = <span>assigned to <span onClick={() => { this.creatorClick(this.state.bug.assigned_to) }} style={{ cursor: "pointer", fontWeight: "bold" }}>{this.state.bug.assigned_name}</span></span>
        }
        else {
            search = <span></span>
        }
        return search
    }

    async assignDropClick(event, data) {
        const member = this.state.members_data_for_search.find(o => o.value === data.value)
        let member_id
        if (member !== undefined) {
            member_id = member.key

        }
        else {
            member_id = "None"
        }
        let url = `${issue_url}${this.state.id}/assign/?assign_to=${member_id}`
        console.log(url)
        const headers = JSON.parse(sessionStorage.getItem("header"))
        let res = await fetch(url, { method: "GET", headers: headers })
        if (res.status === 202) {
            data = await res.json()
            this.setState({ bug: data })
        }
    }
    toggleDeleteIssue = () => this.setState({ deleteIssueModalOpen: !this.state.deleteIssueModalOpen })
    commentToggle = () => this.setState({ commentOpen: !this.state.commentOpen })
    settingToggle = () => this.setState({ settingsOpen: !this.state.settingsOpen })
    formToggle = () => this.setState({ updateForm: !this.state.updateForm })
    toggleDeleteComment = () => this.setState({ deleteCommentModalOpen: !this.state.deleteCommentModalOpen })
    creatorClick(id) {
        this.props.history.push({
            pathname: '/user',
            state: { id: id }
        })
    }
    render() {
        const { bug, commentOpen, updateForm, isUserAMember, isuserACreator } = this.state
        if (this.state.bug !== undefined) {
            return (
                <Container fluid className="ContainerDiv"  >
                    <Container>
                        <Header>
                            <Breadcrumb as={Header}>
                                <Breadcrumb.Section className='previousSection' as={Link} to='/home'>Issues</Breadcrumb.Section>
                                <Breadcrumb.Divider><Icon name='angle right' /></Breadcrumb.Divider>
                                <Breadcrumb.Section>{Boolean(bug) && bug.name}</Breadcrumb.Section>
                            </Breadcrumb>
                        </Header>
                        <Divider section />
                        <div className="main-issue-box">
                            {!(updateForm) ?
                                Boolean(bug) ?
                                    <Card fluid color='red' className='IssueTop issue-head'>
                                        <Card.Content>
                                            <Card.Header as='h2'>{bug.name}
                                                {(isUserAMember || isuserACreator) &&
                                                    <Popup
                                                        onOpen={this.settingToggle}
                                                        open={this.state.settingsOpen}
                                                        onClose={this.settingToggle}
                                                        on='click'
                                                        pinned
                                                        position="bottom right"
                                                        trigger={<Icon name='ellipsis vertical' style={{ cursor: "pointer", float: "right" }} color='grey' onClick={this.settingToggle} />}
                                                    >
                                                        <div>
                                                            <Button.Group vertical>
                                                                <Button.Group basic vertical>
                                                                    {isuserACreator && <Button icon="trash" content="delete" name="trash" onClick={() => { this.toggleDeleteIssue(); this.settingToggle() }} labelPosition='left' />}
                                                                    <Button icon="edit" content="edit" labelPosition='left' onClick={(event) => { this.formToggle(); this.settingToggle() }} />
                                                                    {isUserAMember && <Button active={bug.important} icon={bug.important ? "check square" : "check square outline"} content="important" labelPosition='left' onClick={(event) => this.setImportant()} />}
                                                                </Button.Group>
                                                                <Divider hidden />
                                                                <Button.Group basic vertical>
                                                                    <Button active={this.state.activeDomain === 'f'} content="frontend" onClick={(event) => this.domainUpdate('f')} />
                                                                    <Button active={this.state.activeDomain === 'b'} content="backend" onClick={(event) => this.domainUpdate('b')} />
                                                                </Button.Group>
                                                                <Divider hidden />
                                                                <Button.Group basic vertical>
                                                                    <Button active={this.state.activeStatus === 'P'} onClick={(event) => this.statusUpdate('P')} content="pending" />
                                                                    <Button active={this.state.activeStatus === 'R'} onClick={(event) => this.statusUpdate('R')} content="resolved" />
                                                                    <Button active={this.state.activeStatus === 'T'} onClick={(event) => this.statusUpdate('T')} content="to be discussed" />
                                                                </Button.Group>
                                                            </Button.Group>
                                                        </div>
                                                    </Popup>
                                                }
                                            </Card.Header>
                                            <Label ribbon='right' style={{ cursor: "pointer" }} onClick={this.goToCorrespondingProject}>{bug.project_name}</Label>
                                            <Card.Meta>reported by <span onClick={() => { this.creatorClick(bug.creator) }} style={{ cursor: "pointer", fontWeight: "bold" }}>{bug.creator_name}</span></Card.Meta>
                                        </Card.Content>
                                        <Card.Content>
                                            <Card.Description><div dangerouslySetInnerHTML={{ __html: bug.description }} /></Card.Description>
                                        </Card.Content>
                                        <Card.Content extra style={{ display: "grid", gridTemplateColumns: "auto auto auto", justifyContent: "space-between", alignItems: "center" }} >
                                            <span><Icon name='comments outline' /><Pluralize singular={'comment'} count={bug.no_of_comments} /></span>
                                            {this.assignComponent()}
                                            <span id='issueDetailCardTime' ><Icon name='clock' />{moment(bug.issued_at).fromNow()}</span>
                                        </Card.Content>
                                    </Card>
                                    : <BigPlaceholder />
                                :
                                <Segment className='update-segment'>
                                    <IssueForm initialValues={filter(bug, ["name", "description"])} isDomain={false} onSubmit={this.updateIssue} isClose={true} onClose={() => { this.formToggle() }} submitName="Update" />
                                </Segment>
                            }
                        </div>
                        <Header as="h2" color='red' className='projects-header'>
                            Comments
                    {Boolean(bug) &&
                                <Button className='add-button' onClick={this.commentToggle}><Icon name={(commentOpen) ? "minus" : "plus"} size='big' /></Button>
                            }
                        </Header>
                        {commentOpen &&
                            <Card color='red' fluid>
                                <Card.Content>
                                    <EditorPage onEditorChange={this.handleEditorChange} placeholder="Write your comment" />
                                    <Button
                                        positive
                                        icon='checkmark'
                                        content="Create"
                                        onClick={(event) => this.onCommentSubmit()}
                                    />
                                </Card.Content>
                            </Card>
                        }
                        <Divider section />
                        <Container>
                            {this.listComments()}
                        </Container>
                        <Modal open={this.state.deleteCommentModalOpen} dimmer onClose={() => { this.toggleDeleteComment() }} basic size='small'>
                            <Header icon='archive' content='Delete this Comment' />
                            <Modal.Content>
                                <p>
                                    Do you really want to remove this comment? This action is not reversible.
                          </p>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button basic color='red' inverted onClick={() => { this.toggleDeleteComment() }}>
                                    <Icon name='remove' /> No
                          </Button>
                                <Button color='green' inverted onClick={() => { this.deleteComment() }}>
                                    <Icon name='checkmark' /> Yes
                          </Button>
                            </Modal.Actions>
                        </Modal>

                        <Modal basic open={this.state.deleteIssueModalOpen} onOpen={() => { this.toggleDeleteIssue() }} onClose={() => { this.toggleDeleteIssue() }} closeIcon>
                            <Header icon='archive' content='Delete This Issue' />
                            <Modal.Actions >
                                <Button color='green' icon='checkmark' content='Yes' onClick={(event) => this.deleteIssue()} />
                            </Modal.Actions>
                        </Modal>

                    </Container>
                </Container>
            )
        }
        else {
            return (
                <div>
                    bug not found
                </div>
            )
        }
    }
}
export default IssueDetail