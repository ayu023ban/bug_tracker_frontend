import React, { Component } from 'react'
import { Card, Icon, Label, Transition, Image, Grid } from 'semantic-ui-react'
import moment from 'moment'
import Pluralize from 'react-pluralize'

class IssueCard extends Component {
    constructor(props) {
        super(props)
        this.handleClickCardDescription = this.handleClickCardDescription.bind(this)
        this.state = {
            large: false
        }
    }

    toggle = () => this.setState({ large: !this.state.large })

    creatorClick(id) {
        this.props.history.push({
            pathname: '/user',
            state: { id: id }
        })
    }
    projectClick(id) {
        this.props.history.push({
            pathname: '/project',
            state: { id: id }
        })
    }

    handleClickCardDescription(bug) {
        this.props.history.push({
            pathname: '/issue',
            state: { bug: bug.id }
        })
    }

    render() {
        const { bug } = this.props
        const { large } = this.state
        const backgroundColor = (bug.status === "P") ? "red" : (bug.status === "R") ? "green" : "yellow"
        return (
            <Card fluid color={backgroundColor} raised  >
                <Card.Content  >
                    <Card.Header style={{ marginTop: 10 }}>
                        <Icon name={(large) ? ("minus") : ("plus")} size='large' onClick={this.toggle} color='red' />
                        {bug.name}
                        <Icon name='reply' className='add-button' color='red' size='large' onClick={() => { this.handleClickCardDescription(bug) }} />
                    </Card.Header>
                </Card.Content>
                {large &&
                    <Transition.Group >
                        <Card.Content extra style={{ backgroundColor: "#fafafa", gridTemplateColumns: "auto auto", justifyContent: "space-between" }} >
                            <span>project: <span onClick={() => { this.projectClick(bug.project) }} style={{ cursor: "pointer", fontWeight: "bold" }}>{bug.project_name}</span></span>

                            {Boolean(bug.assigned_name) ?
                                <span>
                                    assigned to
                                    <span onClick={() => { this.creatorClick(bug.assigned_to) }} style={{ cursor: "pointer", fontWeight: "bold" }}>
                                        {bug.assigned_name}
                                    </span>
                                </span>
                                :
                                <span></span>}
                        </Card.Content>
                        <Card.Content   >
                            <Card.Description >
                                <div dangerouslySetInnerHTML={{ __html: bug.description }} />
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra style={{ backgroundColor: "#f6f6f6" }} className="grid_3_column" >
                            <span>
                                <Icon name='comment' /><Pluralize singular={'comment'} count={bug.no_of_comments} />
                            </span>
                            <span>reported by <span onClick={() => { this.creatorClick(bug.creator) }} style={{ cursor: "pointer", fontWeight: "bold" }}>{bug.creator_name}</span></span>
                            <span>
                                <Icon name='clock' />{moment(bug.issued_at).fromNow()}
                            </span>
                        </Card.Content>
                    </Transition.Group>
                }
            </Card>
        )
    }
}

class ProjectCard extends Component {
    handleClickCardDescription(id) {
        this.props.history.push({
            pathname: '/project',
            state: { id: id }
        })
    }
    render() {
        const element = this.props.project
        return (
            <Card color='red' fluid raised onClick={() => { this.handleClickCardDescription(element.id) }}  >
                <Card.Content>
                    <Card.Header>{element.name}</Card.Header>
                </Card.Content>
                <Card.Content>
                    <Card.Description className='projectDescription' >
                        <div dangerouslySetInnerHTML={{ __html: element.wiki }} />
                    </Card.Description>
                </Card.Content>
                <Card.Content extra style={{ display: "grid", gridTemplateColumns: "auto auto auto", justifyContent: "space-around", alignItems: "center", justifyItems: "center" }} >
                    <span><Icon name='users' /> <Pluralize singular={'member'} count={element.members.length} /></span>
                    <span><Icon name='bug' /> <Pluralize singular={'issue'} count={element.no_of_issues} /></span>
                    <span>{Boolean(element.githublink) && <a href={element.githublink} rel='noopener noreferrer' target="_blank"><Icon name="github" /></a>}</span>
                </Card.Content>
            </Card>
        )
    }
}

class CommentCard extends Component {
    creatorClick(id) {
        this.props.history.push({
            pathname: '/user',
            state: { id: id }
        })
    }
    render() {
        const { comment, userId } = this.props
        return (
            <Card raised fluid color='red'>
                <Card.Content extra style={{backgroundColor:"#f5f5f5"}} >
                    <span onClick={() => { this.creatorClick(comment.creator) }} style={{ cursor: "pointer", fontWeight: "bold" }}>
                        {comment.creator_name}
                    </span> commented {moment(comment.created_at).fromNow()}
                </Card.Content>
                <Card.Content>
                    <Card.Description className="commentCardDescription">
                        <div dangerouslySetInnerHTML={{ __html: comment.description }} />
                        {userId === comment.creator &&
                            <Icon name='trash' size='large' color='red' onClick={() => {
                                console.log("test")
                                this.props.onCommentTrashClick(comment.id)
                            }} />
                        }
                    </Card.Description>
                </Card.Content>

            </Card>
        )
    }
}
export { IssueCard, ProjectCard, CommentCard }