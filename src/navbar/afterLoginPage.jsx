import React, { Component } from 'react'
import { Segment, Loader, Dimmer } from 'semantic-ui-react'
import axios from 'axios'
import { Redirect } from 'react-router'
import { setCookie } from '../components/helperFunctions'
class LoginComp extends Component {
    constructor(props) {
        super(props)
        this.state = { isRequestSuccessful: false }
    }
    componentWillMount() {
        let url = window.location.href
        let code = (url.match(/code=([^&]+)/) || [])[1]
        console.log(code)
        if (code !== undefined) {
            axios.post("http://localhost:8000/bug_reporter/users/login/", { "code": code }).then((res) => {
                console.log(res)
                if (res.status === 202) {
                    if (res.data.token !== undefined) {
                        sessionStorage.setItem("token", res.data.token)
                        sessionStorage.setItem("isLoggedIn", true)
                        sessionStorage.setItem("user_data", JSON.stringify(res.data.user_data))
                        sessionStorage.setItem("header", JSON.stringify({ Authorization: `Token ${sessionStorage.getItem("token")}` }))
                        this.props.onLogin()
                        this.setState({ isRequestSuccessful: true })
                        setCookie("token", res.data.token, res.data.expires_in)
                    }
                    else {
                        console.log(res)
                    }
                }
            })
        }
    }


    render() {
        if (this.state.isRequestSuccessful) {
            return <Redirect to='/' />
        }
        else {
            return (
                <Segment className="ContainerDiv">
                    <Dimmer active>
                        <Loader size='massive'>Logging In</Loader>
                    </Dimmer>
                </Segment>
            )
        }

    }
}
export default LoginComp