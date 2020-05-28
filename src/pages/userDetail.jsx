import React, { Component } from "react";
import { Container, Card, Header, Menu, Form, Button, Breadcrumb, Icon, Divider, Grid, Segment, List } from "semantic-ui-react";
import { Link } from 'react-router-dom'
import Avatar from 'react-avatar'



class UserDetail extends Component {
    constructor(props) {
        super(props)
        this.updateForm = this.updateForm.bind(this)
        this.formSubmit = this.formSubmit.bind(this)
        this.state = {
            id: this.props.location.state.id,
            userData: null,
            update: {},
            activeItem: "Email"
        }
    }
    componentDidMount() {
        const url = `http://localhost:8000/bug_reporter/users/${this.state.id}/`
        const headers = JSON.parse(sessionStorage.getItem("header"))
        fetch(url, { method: "GET", headers: headers }).then((res) => {
            if (res.status === 200) {
                return res.json()
            }
            else { console.log(res) }
        }).then(data => this.setState({ userData: data }))
    }
    handleItemClick = (e, { name }) => {
        this.setState({ activeItem: name });
    }
    updateForm(e) {
        const { name, value } = e.target
        this.setState({
            update: { ...this.state.update, [name]: value }
        })
    }
    filter = function (obj, keys) {
        let result = {}
        keys.forEach(key => {
            if (obj.hasOwnProperty(key)) {
                result[key] = obj[key];
            }
        });
        return result;
    }
    async formSubmit() {
        let array;
        switch (this.state.activeItem) {
            case "Email":
                array = ["socialEmail"]
                break
            case "Username":
                array = ["username"]
                break
            case "Social Link":
                array = ["facebookLink", "socialEmail", "instagramLink", "linkedinLink"]
                break
            default:
                array=null
        }
        const data = JSON.stringify(this.filter(this.state.update,array))
        // console.log(data)
        const url = `http://localhost:8000/bug_reporter/users/${this.state.id}/`
        const headers={
            "Content-type": "application/json; charset=UTF-8",
            'Authorization': `Token ${sessionStorage.getItem('token')}`,
        }
        let response = await fetch(url,{method:"PATCH",body:data,headers:headers})
        if(response.status === 200){
            let updated_data = await response.json()
            let updated_user_data = Object.assign(this.state.userData,updated_data)
            this.setState({
                userData:updated_user_data
            })
        }
    }
    render() {
        const { userData } = this.state
        const { activeItem } = this.state;
        const isGithub = userData != null && userData.githubLink !== "" && userData.githubLink !== null && userData.githubLink !== undefined
        const isFacebook = userData != null && userData.facebookLink !== "" && userData.facebookLink !== null && userData.facebookLink !== undefined
        const isInstagram = userData != null && userData.instagramLink !== "" && userData.instagramLink !== null && userData.instagramLink !== undefined
        const isLinkedin = userData != null && userData.linkedinLink !== "" && userData.linkedinLink !== null && userData.linkedinLink !== undefined
        const isSocialEmail = userData != null && userData.socialEmail !== "" && userData.socialEmail !== null && userData.socialEmail !== undefined

        // console.log(isGithub, isFacebook, isInstagram)
        if (userData != null) {
            return (
                <Container>
                    <Header>
                        <Breadcrumb as={Header}>
                            <Breadcrumb.Section className='previousSection' as={Link} to='/users'>Issues</Breadcrumb.Section>
                            <Breadcrumb.Divider><Icon name='angle right' /></Breadcrumb.Divider>
                            <Breadcrumb.Section>{userData.username}</Breadcrumb.Section>
                        </Breadcrumb>
                    </Header>
                    <Divider section />
                    <Card fluid color='red' >
                        <Card.Content>
                            <Grid>
                                {/* <Grid.Row> */}
                                <Grid.Column width={5} >
                                    <Avatar name={userData.username} />
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
                            </Grid>
                            <List floated="right" horizontal relaxed >
                                {isGithub && <List.Item><Button circular icon='github' /></List.Item>}
                                {isFacebook && <List.Item><Button onClick={() => { window.open(userData.facebookLink, "_blank") }} circular color="facebook" icon="facebook" /></List.Item>}
                                {isLinkedin && <List.Item><Button onClick={() => { window.open(userData.instagramLink, "_blank") }} circular color="linkedin" icon="linkedin" /></List.Item>}
                                {isInstagram && <List.Item><Button onClick={() => { window.open(userData.instagramLink, "_blank") }} circular color="instagram" icon='instagram' /></List.Item>}
                            </List>
                        </Card.Content>
                    </Card>
                    <Menu attached="top" tabular>
                        <Menu.Item
                            name="Email"
                            active={activeItem === "Email"}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            name="Username"
                            active={activeItem === "Username"}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            name="Social Link"
                            active={activeItem === "Social Link"}
                            onClick={this.handleItemClick}
                        />
                    </Menu>
                    <Segment attached="bottom" className="form-segment">
                        {this.state.activeItem === "Email" &&
                            <Form className="email-form">
                                <Form.Input
                                    label="Email"
                                    placeholder="Email"
                                    name="socialEmail"
                                    value={this.state.update.socialEmail}
                                    onChange={this.updateForm}
                                />
                                <Form.Input
                                    label="Email Confirmation"
                                    placeholder="Email"
                                    name="socialEmailConfirmation"
                                    value={this.state.update.socialEmailConfirmation}
                                    onChange={this.updateForm}
                                />
                                <Button
                                    positive
                                    type="submit"
                                    icon="checkmark"
                                    content="Update"
                                    onClick={this.formSubmit}
                                    className="form-submit"
                                />
                            </Form>
                        }
                        {this.state.activeItem === "Username" &&
                            <Form className="username-form">
                                <Form.Input
                                    label="Username"
                                    placeholder="username"
                                    name="username"
                                    value={this.state.update.username}
                                    onChange={this.updateForm}
                                />
                                <Button
                                    positive
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
                                    name="githublink"
                                    value={this.state.update.githubLink}
                                    onChange={this.updateForm}
                                />
                                <Form.Input
                                    label="Facebook"
                                    placeholder="put your Facebook profile link here"
                                    name="facebookLink"
                                    value={this.state.update.facebookLink}
                                    onChange={this.updateForm}
                                />
                                <Form.Input
                                    label="LinkedIn"
                                    placeholder="put your Linked profile link here"
                                    name="linkedinLink"
                                    value={this.state.update.linkedinLink}
                                    onChange={this.updateForm}
                                />
                                <Form.Input
                                    label="Instagram"
                                    placeholder="put your Instagram profile link here"
                                    name="instagramLink"
                                    value={this.state.update.instagramLink}
                                    onChange={this.updateForm}
                                />
                                <Button
                                    positive
                                    type="submit"
                                    icon="checkmark"
                                    content="Update"
                                    onClick={this.formSubmit}
                                    className="social-submit"
                                />
                            </Form>
                        }
                    </Segment>
                </Container>
            )
        }
        else {
            return (
                <div>User Data is not available</div>
            )
        }

    }
}
export default UserDetail