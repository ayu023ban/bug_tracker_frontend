import React, { Component } from 'react'
import { Container, Card, Header, Breadcrumb, Button, Icon, Divider, Modal } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { Editor } from '@tinymce/tinymce-react';
import './scss/tinymce.css'
import moment from 'moment'
import Pluralize from 'react-pluralize'
// import Avatar from 'react-avatar'
// import { Editor } from '@tinymce/tinymce-react';
import EditorPage from './editor'
import Background from '../images/options.jpg'
import './scss/issueDetail.scss'

class IssueDetail extends Component {
    constructor(props) {
        super(props)
        this.handleEditorChange = this.handleEditorChange.bind(this)
        this.settingToggle = this.settingToggle.bind(this)
        this.state = {
            id: this.props.location.state.bug.id,
            bug: this.props.location.state.bug,
            comments: null,
            commentOpen: false,
            settingsOpen: false
        }
    }

    componentDidMount() {
        let url = `http://localhost:8000/bug_reporter/comments/?bug=${this.state.id}&ordering=-created_at`
        let header = JSON.parse(sessionStorage.getItem("header"))
        fetch(url, { headers: header }).then(res => res.json()).then((data) => {
            // console.log(data)
            this.setState({ comments: data })
        })
    }

    listComments() {
        const { comments } = this.state
        let list;
        if (comments != null) {
            list = comments.map(comment =>

                <Card raised fluid color='red'>
                    <Card.Content>
                        <Card.Description>
                            {/* <Editor value={comment.description}
                            disabled={true}
                            apiKey="81jvj4ftt29hdio9oky5wnvlxtugicmawfi048fvjjf2dlg8"
                            init={{
                                menubar: false,
                                plugins:'a11ychecker placeholder code advcode casechange formatpainter linkchecker autolink lists checklist media  permanentpen powerpaste quickbars codesample table advtable tinymcespellchecker autoresize',
                                toolbar: false,
                                statusbar: false,
                                autoresize_bottom_margin: 0,
                                autoresize_overflow_padding: 0,
                            }} /> */}
                            <div dangerouslySetInnerHTML={{ __html: comment.description }} />
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra >
                        {moment(comment.created_at).fromNow()}
                        <span id='issueDetailCardTime' ><Icon name='user' />by {comment.creator_name}</span>
                    </Card.Content>
                </Card>
            )
        }
        else {
            list = "no comments available"
        }
        return list
    }

    handleEditorChange(content) {
        // console.log(content)
        this.setState({ commentDescription: content })
    }
    onCommentSubmit() {
        let data = {}
        data.description = this.state.commentDescription
        data.bug = this.state.id
        console.log(data)
        const url = 'http://localhost:8000/bug_reporter/comments/'
        const header = {
            "Content-Type": "application/json",
            "Authorization": `Token ${sessionStorage.getItem("token")}`
        }
        data = JSON.stringify(data)
        fetch(url, { method: "POST", body: data, headers: header }).then(res => res.json()).then((data) => {
            console.log(data)
        })
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
                if(res.status === 204){
                    this.props.history.push({
                        pathname: "/home"
                    })
                }
                else{
                    console.log(res)
                }
                }) // or res.json()
            // .then(res => console.log(res))
    }


    // commentShow = () => this.setState({ commentOpen: true })
    // commentClose = () => this.setState({ commentOpen: false })
    commentToggle = () => this.setState({ commentOpen: !this.state.commentOpen })
    settingToggle = () => this.setState({ settingsOpen: !this.state.settingsOpen })

    render() {
        const { bug } = this.state
        const { commentOpen } = this.state
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
                <Card fluid color='red' className='IssueTop'>
                    <Card.Content>
                        <Card.Header as='h2'>bug.name <Icon name='setting' className='add-button' size='large' color='red' onClick={this.settingToggle} /></Card.Header>
                        <Card.Meta>reported by {bug.creator_name}</Card.Meta>
                        <Card.Description content={bug.description} />
                    </Card.Content>
                    <Card.Content extra><Icon name='comments outline' /><Pluralize singular={'comment'} count={bug.no_of_comments} /> <span id='issueDetailCardTime' ><Icon name='clock' />{moment(bug.issued_at).fromNow()}</span> </Card.Content>
                </Card>
                <Header as="h2" color='red' className='projects-header'>Comments<Button className='add-button' onClick={this.commentToggle}><Icon name={(commentOpen) ? "minus" : "plus"} size='big' /></Button></Header>
                {commentOpen &&
                    <Card color='red' fluid>
                        <Card.Content>
                            <EditorPage onEditorChange={this.handleEditorChange} />
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

                {/* <Modal open={commentOpen} closeIcon closeOnDocumentClick closeOnDimmerClick closeOnEscape onClose={this.commentClose} >
                    <Header icon='comment' content='Write your Comment' />
                    <Modal.Content>
                        <EditorPage onEditorChange={this.handleEditorChange} />
                        <Button
                            positive
                            icon='checkmark'
                            content="Send"
                            onClick={(event) => this.onCommentSubmit()}
                        />
                    </Modal.Content>
                </Modal> */}
                {this.state.settingsOpen &&
                    <div className='settings' style={{ backgroundImage: `url("${Background}")` }} >
                        <div className="close"><Icon name="times" size='large' onClick={this.settingToggle} /></div>
                        <div className="setting-box">
                            <div className="delete">
                                <Modal basic trigger={<Icon name='trash' size='large' />} closeIcon>
                                    <Header icon='archive' content='Delete This Issue' />
                                    <Modal.Actions >
                                        {/* <Button color='red'onClick={} icon='remove'  content='No' /> */}
                                        <Button color='green' icon='checkmark' content='Yes' onClick={(event) => this.deleteIssue()} />
                                    </Modal.Actions>
                                </Modal>
                            </div>
                            <div className="update">
                                <Icon name='edit' size='large' onClick={(event) => this.formOpen()} />
                            </div>
                            <div className="important">
                                <Icon name="check square" onClick={(event) => this.important()} />
                            </div>
                            <div className="project">
                                <Link to={{
                                    pathname: '/project/',
                                    state: {
                                        ProjectId: bug.project
                                    }
                                }}>
                                    <Icon name="arrow right" />
                                </Link>
                            </div>
                            <div className="line"></div>
                        </div>
                        <div className="second-box">
                            <div className="type">
                                <Button color='white' className={this.state.active1 === 'front' ? 'selected' : ''} onClick={(event) => this.typeUpdate('front')} >Frontend</Button>
                                <Button color='white' className={this.state.active1 === 'back' ? 'selected' : ''} onClick={(event) => this.typeUpdate('back')} >Backend</Button>
                            </div>
                            <div className="status">
                                <Button color='white' className={this.state.active2 === 'pending' ? 'selected' : ''} onClick={(event) => this.statusUpdate('pending')} >pending</Button>
                                <Button color='white' className={this.state.active2 === 'resolved' ? 'selected' : ''} onClick={(event) => this.statusUpdate('resolved')} >resolved</Button>
                                <Button color='white ' className={this.state.active2 === 'to be discussed' ? 'selected' : ''} onClick={(event) => this.statusUpdate('to be discussed')} >to be discussed</Button>
                            </div>
                        </div>
                    </div>
                }
            </Container>
        )
    }

}

export default IssueDetail