import React, { Component } from 'react'
import { Container, Card, Header, Breadcrumb, Form, Segment, Button, Icon, Divider, Modal } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { Editor } from '@tinymce/tinymce-react';
import './scss/tinymce.css'
import WebSocketInstance from './websocket'
import moment from 'moment'
import Pluralize from 'react-pluralize'
import EditorPage from './editor'
import Background from '../images/options.jpg'
import './scss/issueDetail.scss'

class IssueDetail extends Component {
    constructor(props) {
        super(props)
        this.handleEditorChange = this.handleEditorChange.bind(this)
        this.commentsLoderFromWebsocket =this.commentsLoderFromWebsocket.bind(this)
        this.newCommentFromWebsocket = this.newCommentFromWebsocket.bind(this)
        this.handleUpdateEditorChange = this.handleUpdateEditorChange.bind(this)
        this.goToCorrespondingProject = this.goToCorrespondingProject.bind(this)
        this.settingToggle = this.settingToggle.bind(this)
        this.newCommentFromWebsocket = this.newCommentFromWebsocket.bind(this)
        this.fetchCommentFromWebSocket = this.fetchCommentFromWebSocket.bind(this)
        this.state = {
            id: this.props.location.state.bug,
            comments: null,
            settingsOpen: false,
            updateForm: false,
            update: [],
            updateFormDescription: null,
            deleteCommentModalOpen: false,
        }
    }

    componentDidMount() {
        let header = JSON.parse(sessionStorage.getItem("header"))
        WebSocketInstance.connect(`ws://localhost:8000/bug_reporter/ws/comments/${this.state.id}`)
        WebSocketInstance.addCallbacks(this.commentsLoderFromWebsocket,this.newCommentFromWebsocket)
        this.ma = setInterval(this.fetchCommentFromWebSocket,500)
        let issueurl = `http://localhost:8000/bug_reporter/bugs/${this.state.id}/`
        fetch(issueurl, { headers: header }).then(res => res.json()).then((data) => {
            this.setState({ bug: data, activeStatus: data.status, activeDomain: data.domain })
        })
        
    }
    fetchCommentFromWebSocket(){
        if(WebSocketInstance.state()===1){
            clearInterval(this.ma)
            WebSocketInstance.fetchMessages()
        }
    }
    commentsLoderFromWebsocket(data){
        console.log("test1")
        const comments = data["data"]
        this.setState({comments:comments})
    }
    newCommentFromWebsocket(data){
        console.log("test2")
        const comment = data.data
         this.setState({comments:[comment,...this.state.comments]}) 
    }

    listComments() {
        const { comments } = this.state
        let list;
        if (comments != null) {
            list = comments.map(comment =>
                <Card raised fluid color='red'>
                    <Card.Content>
                        <Card.Description className="commentCardDescription">
                            <div dangerouslySetInnerHTML={{ __html: comment.description }} />
                            <Icon name='trash' size='large' color='red' onClick={()=>{
                                this.setState({commentToBeDelete:comment.id})
                                this.toggleDeleteComment()
                            }}  />
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra >
                        {moment(comment.created_at).fromNow()}
                        <span id='issueDetailCardTime' ><Icon name='user' />by {comment.creator_name}</span>
                    </Card.Content>
                    
                </Card>            )
        }
        else {
            list = "no comments available"
        }
        return list
    }

    deleteComment(){
        const url = `http://localhost:8000/bug_reporter/comments/${this.state.commentToBeDelete}/`
        fetch(url,{
            method: 'DELETE',
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': `Token ${sessionStorage.getItem('token')}`,
            }
        }).then((res)=>{
            if(res.status === 204){
                WebSocketInstance.fetchMessages()
                this.toggleDeleteComment()
            }
            else{
                console.log(res)
            }
        })
        
    }

    handleEditorChange(content) {
        // console.log(content)
        this.setState({ commentDescription: content })
    }
    handleUpdateEditorChange(content) {
        this.setState({
            update: { ...this.state.update, "description": content }
        })
        // console.log(this.state.update)
    }

    onUpdate = e => {
        const { name, value } = e.target
        // console.log(this.state.update)
        this.setState({
            update: { ...this.state.update, [name]: value }
        })
    }


    onCommentSubmit() {
        WebSocketInstance.newComment(this.state.commentDescription)
    }

    deleteIssue() {
        const { id } = this.state
        fetch(`http://localhost:8000/bug_reporter/bugs/${id}/`, {
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

    updateIssue() {
        let data = JSON.stringify(this.state.update)
        let IssueId = this.state.id
        fetch(`http://localhost:8000/bug_reporter/bugs/${IssueId}/`, {
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
        let { id } = this.state
        fetch(`http://127.0.0.1:8000/bug_reporter/bugs/${id}/`, {
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
        let { id } = this.state
        fetch(`http://localhost:8000/bug_reporter/bugs/${id}/`, {
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
        const { id } = this.state
        const imp = this.state.bug.important 
        fetch(`http://127.0.0.1:8000/bug_reporter/bugs/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify({ important: !imp }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': `Token ${sessionStorage.getItem('token')}`,
            },
        }).then(res => {
            if(res.status===200){
                this.setState({bug: { ...this.state.bug, important: !imp}})
            }
            else{
                console.log(res)
            }
        })
    }


    commentToggle = () => this.setState({ commentOpen: !this.state.commentOpen })
    settingToggle = () => this.setState({ settingsOpen: !this.state.settingsOpen })
    formToggle = () => this.setState({ updateForm: !this.state.updateForm })
    toggleDeleteComment = () => this.setState({deleteCommentModalOpen:!this.state.deleteCommentModalOpen})
    render() {
        const { bug } = this.state
        const { commentOpen } = this.state
        const { updateForm } = this.state
        if (this.state.bug !== undefined) {
            return (
                <Container>
                    <Header>
                        <Breadcrumb as={Header}>
                            <Breadcrumb.Section className='previousSection' as={Link} to='/home'>Issues</Breadcrumb.Section>
                            <Breadcrumb.Divider><Icon name='angle right' /></Breadcrumb.Divider>
                            <Breadcrumb.Section>{bug.name}</Breadcrumb.Section>
                        </Breadcrumb>
                    </Header>
                    <Divider section />
                    <div className="main-issue-box">
                        {!updateForm &&
                            <Card fluid color='red' className='IssueTop issue-head'>
                                <Card.Content>
                                    <Card.Header as='h2'>{bug.name} <Icon name='setting' className='add-button' size='large' color='red' onClick={this.settingToggle} /></Card.Header>
                                    <Card.Meta>reported by {bug.creator_name}</Card.Meta>
                                </Card.Content>
                                <Card.Content>
                                    <Card.Description><div dangerouslySetInnerHTML={{ __html: bug.description }} /></Card.Description>
                                </Card.Content>
                                <Card.Content extra><Icon name='comments outline' /><Pluralize singular={'comment'} count={bug.no_of_comments} /> <span id='issueDetailCardTime' ><Icon name='clock' />{moment(bug.issued_at).fromNow()}</span> </Card.Content>
                            </Card>
                        }
                        {updateForm &&
                            <Segment className='update-segment'>
                                <Form className='update-form'>
                                    <Form.Input label='Title' placeholder='Title' name='name' value={this.state.update.title} onChange={this.onUpdate} />
                                    <EditorPage onEditorChange={this.handleUpdateEditorChange} placeholder="Description" />
                                    <Button positive type='submit' icon='checkmark' content="Update" onClick={(event) => this.updateIssue()} className='form-submit' />
                                    <div className='close'>
                                        <Icon name="times" onClick={(event) => this.formToggle()} />
                                    </div>
                                </Form>
                            </Segment>
                        }
                    </div>
                    <Header as="h2" color='red' className='projects-header'>Comments<Button className='add-button' onClick={this.commentToggle}><Icon name={(commentOpen) ? "minus" : "plus"} size='big' /></Button></Header>
                    {commentOpen &&
                        <Card color='red' fluid>
                            <Card.Content>
                                <EditorPage onEditorChange={this.handleEditorChange} placeholder="Write your comment" />
                                <Button
                                    positive
                                    icon='checkmark'
                                    content="Send"
                                    onClick={(event) => this.onCommentSubmit()}
                                />
                            </Card.Content>
                        </Card>
                    }
                    <Divider section />
                    <Container>
                        {this.listComments()}
                    </Container>
                    {this.state.settingsOpen &&
                        <div className='settings' style={{ backgroundImage: `url("${Background}")` }} >
                            <div className="close"><Icon name="times" size='large' onClick={this.settingToggle} /></div>
                            <div className="setting-box">
                                <div className="icon-back">
                                    <Modal basic trigger={<Icon name='trash' size='large' />} closeIcon>
                                        <Header icon='archive' content='Delete This Issue' />
                                        <Modal.Actions >
                                            {/* <Button color='red'onClick={} icon='remove'  content='No' /> */}
                                            <Button color='green' icon='checkmark' content='Yes' onClick={(event) => this.deleteIssue()} />
                                        </Modal.Actions>
                                    </Modal>
                                </div>
                                <div className="icon-back">
                                    <Icon name='edit' size='large' onClick={(event) => { this.settingToggle(); this.formToggle() }} />
                                </div>
                                <div className={`icon-back ${(this.state.bug.important)?"selected":""}`}>
                                    <Icon name="check square" onClick={(event) => this.setImportant()} />
                                </div>
                                <div className="icon-back">
                                    <Icon name="arrow right" onClick={this.goToCorrespondingProject} />
                                </div>
                                <div className="line"></div>
                            </div>
                            <div className="second-box">
                                <div className="type">
                                    <Button color='white' className={this.state.activeDomain === 'f' ? 'selected' : ''} onClick={(event) => this.domainUpdate('f')} >Frontend</Button>
                                    <Button color='white' className={this.state.activeDomain === 'b' ? 'selected' : ''} onClick={(event) => this.domainUpdate('b')} >Backend</Button>
                                </div>
                                <div className="status">
                                    <Button color='white' className={this.state.activeStatus === 'P' ? 'selected' : ''} onClick={(event) => this.statusUpdate('P')} >pending</Button>
                                    <Button color='white' className={this.state.activeStatus === 'R' ? 'selected' : ''} onClick={(event) => this.statusUpdate('R')} >resolved</Button>
                                    <Button color='white ' className={this.state.activeStatus === 'T' ? 'selected' : ''} onClick={(event) => this.statusUpdate('T')} >to be discussed</Button>
                                </div>
                            </div>
                        </div>
                    }

                    <Modal open = {this.state.deleteCommentModalOpen} dimmer onClose={()=>{this.toggleDeleteComment()}} basic size='small'>
                        <Header icon='archive'  content='Delete this Comment' />
                        <Modal.Content>
                          <p>
                            Do you really want to remove this comment? This action is not reversible.
                          </p>
                        </Modal.Content>
                        <Modal.Actions>
                          <Button basic color='red' inverted onClick={()=>{this.toggleDeleteComment()}}>
                            <Icon name='remove' /> No
                          </Button>
                          <Button color='green' inverted onClick={()=>{this.deleteComment()}}>
                            <Icon name='checkmark' /> Yes
                          </Button>
                        </Modal.Actions>
                      </Modal>
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