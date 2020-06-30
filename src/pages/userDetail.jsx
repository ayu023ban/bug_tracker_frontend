import React, { Component } from "react";
import { Container, Card, Header, Menu, Form, Button, Input, Breadcrumb, Icon, Divider, Grid, Segment, List, Popup } from "semantic-ui-react";
import { Link } from 'react-router-dom'
import Avatar from 'react-avatar'
import { user_url } from '../api-routes'
import { filter } from '../components/helperFunctions'
import { BigPlaceholder } from "../components/placeholders";
function isEmail(str) {
    var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(str)
};


class UserDetail extends Component {
    constructor(props) {
        super(props)
        this.updateForm = this.updateForm.bind(this)
        this.formSubmit = this.formSubmit.bind(this)
        this.toggleDisable = this.toggleDisable.bind(this)
        this.toggleMaster = this.toggleMaster.bind(this)
        this.state = {
            id: this.props.location.state.id,
            userData: null,
            menuVisible: false,
            update: {
                socialEmail: "",
                full_name: ""
            },
            errors: {
                email: false,
                emailConfirm: false,
                full_name: false,
                github: false,
                instagram: false,
                facebook: false,
                linkedin: false
            },
            activeItem: "Email"
        }
    }
    async componentDidMount() {
        const url = user_url + this.state.id.toString() + "/"
        const headers = JSON.parse(sessionStorage.getItem("header"))
        let res = await fetch(url, { method: "GET", headers: headers })
        if (res.status === 200) {
            res = await res.json()
            await this.setState({ userData: res, update: res })
            this.getGithubHandle()
        }
        else { console.log(res) }

    }
    handleItemClick = (e, { name }) => {
        this.setState({ activeItem: name });
    }
    getGithubHandle() {
        let { userData } = this.state
        let githubregex = /^https?:\/\/(www.)?github\.com\/(\w+)\/?$/
        let githubHandle = (userData && Boolean(userData.githubLink)) ? userData.githubLink.match(githubregex)[2] : null
        return githubHandle
    }

    updateForm(e) {
        const { name, value } = e.target
        let errorname, error, regex
        switch (name) {
            case "socialEmail":
                errorname = "email"
                !isEmail(value) && value.length > 0 ? error = {
                    content: "please enter valid email address",
                    pointing: 'below'
                } : error = false
                break
            case "socialEmailConfirmation":
                errorname = "emailConfirm"
                this.state.update.socialEmail !== value && value.length!==0 ?
                    error = {
                        content: "email does not match with the above",
                        pointing: "below"
                    } : error = false
                break
            case "full_name":
                errorname = "full_name"
                regex = /^[\w ]+$/
                !regex.test(value) ? error = {
                    content: "write name in correct format",
                    pointing: "below"
                } : error = false
                break
            case "githubLink":
                errorname = 'github'
                regex = /^https?:\/\/(www.)?github\.com\/(\w+)\/?$/
                !regex.test(value) && value.length > 0 ? error = {
                    content: "write correct github profile link",
                    pointing: "below"
                } : error = false
                break
            case "facebookLink":
                errorname = 'facebook'
                regex = /^https?:\/\/(www.)?facebook\.com\/(\w+)\/?$/
                !regex.test(value) && value.length > 0 ? error = {
                    content: "write correct facebook profile link",
                    pointing: "below"
                } : error = false
                break
            case "linkedinLink":
                errorname = 'linkedin'
                regex = /^https?:\/\/(www.)?linkedin\.com\/in\/([\w-]+)\/?$/
                !regex.test(value) && value.length > 0 ? error = {
                    content: "write correct linkedin profile link",
                    pointing: "below"
                } : error = false
                break
            case "instagramLink":
                errorname = 'instagram'
                regex = /^https?:\/\/(www.)?instagram\.com\/([\w-]+)\/?$/
                !regex.test(value) && value.length > 0 ? error = {
                    content: "write correct instagram profile link",
                    pointing: "below"
                } : error = false
                break
            default:
                console.log("noerror")
        }
        this.setState({
            update: { ...this.state.update, [name]: value },
            errors: { ...this.state.errors, [errorname]: error }
        })
    }
    async formSubmit() {
        let array;
        switch (this.state.activeItem) {
            case "Email":
                array = ["socialEmail"]
                break
            case "Full Name":
                array = ["username", "first_name", "last_name", "full_name"]
                let name = this.state.update.full_name.split(" ")
                let first_name = name[0]
                let last_name = (name[1]) ? name[1] : ""
                let full_name = first_name + ((name[1]) ? " " : "") + last_name
                let username = first_name.toLowerCase() + ((name[1]) ? "_" : "") + last_name.toLowerCase()
                await this.setState({
                    update: { ...this.state.update, first_name: first_name, last_name: last_name, username: username, full_name: full_name }
                })
                break

            case "Social Link":
                array = ["facebookLink", "githubLink", "instagramLink", "linkedinLink"]
                break
            default:
                array = null
        }
        const data = JSON.stringify(filter(this.state.update, array))
        console.log(data)
        const url = user_url + this.state.id.toString() + "/"
        const headers = {
            "Content-type": "application/json; charset=UTF-8",
            'Authorization': `Token ${sessionStorage.getItem('token')}`,
        }
        let response = await fetch(url, { method: "PATCH", body: data, headers: headers })
        if (response.status === 200) {
            let updated_data = await response.json()
            let updated_user_data = Object.assign(this.state.userData, updated_data)
            this.setState({
                userData: updated_user_data
            })
        }
    }
    copy(e){
        e.preventDefault()
        alert("email copying is not allowed")
    }
    async toggleDisable() {
        const url = user_url + this.state.id.toString() + "/disable/"
        const headers = {
            'Authorization': `Token ${sessionStorage.getItem('token')}`,
        }
        let res = await fetch(url, { method: "GET", headers: headers })
        if (res.status === 200) {
            const data = await res.json()
            this.setState({ menuVisible: !this.state.menuVisible, userData: data })
        }
    }
    async toggleMaster() {
        const url = user_url + this.state.id.toString() + "/master/"
        const headers = {
            'Authorization': `Token ${sessionStorage.getItem('token')}`,
        }
        let res = await fetch(url, { method: "GET", headers: headers })
        if (res.status === 200) {
            const data = await res.json()
            this.setState({ menuVisible: !this.state.menuVisible, userData: data })
        }
    }

    render() {
        const { userData, activeItem } = this.state
        const isUserCreator = this.state.id === JSON.parse(sessionStorage.getItem("user_data")).id
        const isGithub = userData != null && userData.githubLink !== "" && userData.githubLink !== null && userData.githubLink !== undefined
        const isFacebook = userData != null && userData.facebookLink !== "" && userData.facebookLink !== null && userData.facebookLink !== undefined
        const isInstagram = userData != null && userData.instagramLink !== "" && userData.instagramLink !== null && userData.instagramLink !== undefined
        const isLinkedin = userData != null && userData.linkedinLink !== "" && userData.linkedinLink !== null && userData.linkedinLink !== undefined
        const isSocialEmail = userData != null && userData.socialEmail !== "" && userData.socialEmail !== null && userData.socialEmail !== undefined
        return (
            <Container fluid className="ContainerDiv">
                <Container>
                    <Header>
                        <Breadcrumb as={Header}>
                            <Breadcrumb.Section className='previousSection' as={Link} to='/users'>Users</Breadcrumb.Section>
                            <Breadcrumb.Divider><Icon name='angle right' /></Breadcrumb.Divider>
                            <Breadcrumb.Section>{Boolean(userData) && userData.full_name}</Breadcrumb.Section>
                        </Breadcrumb>
                    </Header>
                    <Divider section />
                    {Boolean(userData) ?
                        <Card fluid color='red' >
                            <Card.Content >
                                <Grid>
                                    <Grid.Column width={5} >
                                        <Avatar size='225' name={userData.full_name} githubHandle={this.getGithubHandle()} />
                                    </Grid.Column>
                                    <Grid.Column width={10}>
                                        <Grid>
                                            <Grid.Row columns={2}>
                                                <Grid.Column >
                                                    <Segment>
                                                        <Header>Username</Header>
                                                        {userData.username}
                                                    </Segment>
                                                </Grid.Column>
                                                <Grid.Column >
                                                    <Segment>
                                                        <Header>Institute Email</Header>
                                                        {userData.email}
                                                    </Segment>
                                                </Grid.Column>
                                            </Grid.Row>
                                            <Grid.Row columns={2}>
                                                <Grid.Column >
                                                    <Segment>
                                                        <Header>Enrollment No.</Header>
                                                        {userData.enroll_no}
                                                    </Segment>
                                                </Grid.Column>
                                                {isSocialEmail &&
                                                    <Grid.Column >
                                                        <Segment>
                                                            <Header>Email</Header>
                                                            {userData.socialEmail}
                                                        </Segment>
                                                    </Grid.Column>}
                                            </Grid.Row>
                                        </Grid>
                                    </Grid.Column>
                                    {JSON.parse(sessionStorage.getItem("user_data")).isMaster && JSON.parse(sessionStorage.getItem("user_data")).id !== this.state.id &&
                                        <Grid.Column width={1}>
                                            <Popup
                                                style={{ padding: 0 }}
                                                onOpen={() => { this.setState({ menuVisible: !this.state.menuVisible }) }}
                                                open={this.state.menuVisible}
                                                onClose={() => { this.setState({ menuVisible: !this.state.menuVisible }) }}
                                                on='click'
                                                pinned
                                                position="bottom right"
                                                trigger={<Icon name='ellipsis vertical' style={{ cursor: "pointer" }} color='grey' onClick={() => { this.setState({ menuVisible: !this.state.menuVisible }) }} />}
                                            >
                                                <div>
                                                    <Button.Group basic vertical>
                                                        <Button icon={userData.isDisabled ? "circle outline" : "ban"} content={userData.isDisabled ? "enable" : "Disable"} labelPosition='left' onClick={this.toggleDisable} />
                                                        <Button icon={userData.isMaster ? "user cancel" : "user secret"} content={userData.isMaster ? "remove Master" : "make Master"} labelPosition='left' onClick={this.toggleMaster} />
                                                    </Button.Group>
                                                </div>
                                            </Popup>
                                        </Grid.Column>
                                    }
                                </Grid>
                                <List floated="right" horizontal relaxed >
                                    {isGithub && <List.Item><Button onClick={() => { window.open(userData.githubLink, "_blank") }} circular color="github" icon="github" /></List.Item>}
                                    {isFacebook && <List.Item><Button onClick={() => { window.open(userData.facebookLink, "_blank") }} circular color="facebook" icon="facebook" /></List.Item>}
                                    {isLinkedin && <List.Item><Button onClick={() => { window.open(userData.instagramLink, "_blank") }} circular color="linkedin" icon="linkedin" /></List.Item>}
                                    {isInstagram && <List.Item><Button onClick={() => { window.open(userData.instagramLink, "_blank") }} circular color="instagram" icon='instagram' /></List.Item>}
                                </List>
                            </Card.Content>
                        </Card>
                        :
                        <BigPlaceholder />
                    }
                    <Divider hidden section />
                    {isUserCreator &&
                        <Menu attached="top" tabular>
                            <Menu.Item
                                name="Email"
                                active={activeItem === "Email"}
                                onClick={this.handleItemClick}
                            />
                            <Menu.Item
                                name="Full Name"
                                active={activeItem === "Full Name"}
                                onClick={this.handleItemClick}
                            />
                            <Menu.Item
                                name="Social Link"
                                active={activeItem === "Social Link"}
                                onClick={this.handleItemClick}
                            />
                        </Menu>
                    }
                    {Boolean(userData) ? isUserCreator &&
                        <Segment attached="bottom" className="form-segment">
                            {this.state.activeItem === "Email" &&
                                <Form className="email-form">
                                    <Form.Field
                                    onCopy={this.copy}
                                        style={{user_select:"null"}}
                                        control={Input}
                                        required
                                        error={this.state.errors.email}
                                        label="Email"
                                        placeholder="Email"
                                        name="socialEmail"
                                        value={this.state.update.socialEmail}
                                        onChange={this.updateForm}
                                    />
                                    <Form.Field
                                        control={Input}
                                        required
                                        error={this.state.errors.emailConfirm}
                                        label="Email Confirmation"
                                        placeholder="Email"
                                        name="socialEmailConfirmation"
                                        value={this.state.update.socialEmailConfirmation}
                                        onChange={this.updateForm}
                                    />
                                    <Button
                                        positive
                                        type="submit"
                                        disabled={this.state.errors.email || this.state.errors.emailConfirm || this.state.update.socialEmail == null || this.state.update.socialEmail.length === 0 || this.state.update.socialEmailConfirmation === undefined || this.state.update.socialEmailConfirmation.length === 0 }
                                        icon="checkmark"
                                        content="Update"
                                        onClick={this.formSubmit}
                                        className="form-submit"
                                    />
                                </Form>
                            }
                            {this.state.activeItem === "Full Name" &&
                                <Form>
                                    <Form.Field
                                        control={Input}
                                        required
                                        error={this.state.errors.full_name}
                                        label="Full Name"
                                        placeholder="Full Name"
                                        name="full_name"
                                        value={this.state.update.full_name}
                                        onChange={this.updateForm}
                                    />
                                    <Button
                                        positive
                                        disabled={this.state.errors.full_name || this.state.update.full_name.length === 0}
                                        type="submit"
                                        icon="checkmark"
                                        content="Update"
                                        onClick={this.formSubmit}
                                        className="username-submit"
                                    />
                                </Form>
                            }
                            {this.state.activeItem === "Social Link" &&
                                <Form className="social-form">
                                    <Form.Input
                                        label="GitHub"
                                        placeholder="put your Github profile link here"
                                        error={this.state.errors.github}
                                        name="githubLink"
                                        value={this.state.update.githubLink}
                                        onChange={this.updateForm}
                                    />
                                    <Form.Input
                                        label="Facebook"
                                        error={this.state.errors.facebook}
                                        placeholder="put your Facebook profile link here"
                                        name="facebookLink"
                                        value={this.state.update.facebookLink}
                                        onChange={this.updateForm}
                                    />
                                    <Form.Input
                                        label="LinkedIn"
                                        error={this.state.errors.linkedin}
                                        placeholder="put your Linked profile link here"
                                        name="linkedinLink"
                                        value={this.state.update.linkedinLink}
                                        onChange={this.updateForm}
                                    />
                                    <Form.Input
                                        label="Instagram"
                                        error={this.state.errors.instagram}
                                        placeholder="put your Instagram profile link here"
                                        name="instagramLink"
                                        value={this.state.update.instagramLink}
                                        onChange={this.updateForm}
                                    />
                                    <Button
                                        positive
                                        disabled={this.state.errors.facebook || this.state.errors.linkedin || this.state.errors.instagram || this.state.errors.github}
                                        type="submit"
                                        icon="checkmark"
                                        content="Update"
                                        onClick={this.formSubmit}
                                        className="social-submit"
                                    />
                                </Form>
                            }
                        </Segment>
                        :
                        <BigPlaceholder />
                    }
                    <Divider hidden section />
                    <div style={{ display: "grid", gridTemplateColumns: "auto auto", justifyContent: "space-evenly" }} >
                        <Segment circular style={{ width: 175, height: 175, margin: "0" }}>
                            <Header as='h2'>
                                Projects
                                <Header.Subheader>{Boolean(userData) && userData.no_of_projects}</Header.Subheader>
                            </Header>
                        </Segment>
                        <Segment circular inverted style={{ width: 175, height: 175, margin: "0" }}>
                            <Header inverted as='h2'>
                                Issues
                            <Header.Subheader>{Boolean(userData) && userData.no_of_issues}</Header.Subheader>
                            </Header>
                        </Segment>
                    </div>
                </Container>
            </Container>
        )
    }
}
export default UserDetail