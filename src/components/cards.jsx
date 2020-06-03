import React, { Component } from 'react'
import { Card, Icon, Label, Transition, Image } from 'semantic-ui-react'
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

    handleClickCardDescription(bug) {
        this.props.history.push({
            pathname: '/issue',
            state: { bug: bug.id }
        })
    }

    render() {
        const { bug } = this.props
        const { large } = this.state
        return (
            <Card fluid color='red' raised  >
                <Card.Content  >
                    <Card.Header style={{ marginTop: "20px" }}>
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
                    <Card.Description className='projectDescription' >
                        <div dangerouslySetInnerHTML={{ __html: element.wiki }} />
                        {Boolean(element.githublink) &&
                            <Image floated='right'><a href={element.githublink} rel='noopener noreferrer' target="_blank"><Icon name="github" size='big' /></a></Image>
                        }
                    </Card.Description>
                </Card.Content>
                <Card.Content>
                    <Card.Header>{element.name}</Card.Header>
                    <Card.Meta>
                        <Icon name='users' /> <Pluralize singular={'member'} count={element.members.length} />
                    </Card.Meta>
                </Card.Content>
            </Card>
        )
    }
}

class CommentCard extends Component {
    render() {
        const {comment,userId} = this.props
        return (
            <Card raised fluid color='red'>
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
                <Card.Content extra >
                    {moment(comment.created_at).fromNow()}
                    <span id='issueDetailCardTime' ><Icon name='user' />by {comment.creator_name}</span>
                </Card.Content>
            </Card>
        )
    }
}
export { IssueCard, ProjectCard, CommentCard }