import React, { Component } from 'react'
import { Loader, Dimmer, Container } from 'semantic-ui-react'
import { Redirect } from 'react-router'
import { setCookie } from '../components/helperFunctions'
class LoginComp extends Component {
    constructor(props) {
        super(props)
        this.state = { isRequestSuccessful: false, isRequestNotSuccessful: false }
    }
    async componentDidMount() {
        let url = window.location.href
        let code = (url.match(/code=([^&]+)/) || [])[1]
        let body = JSON.stringify({ code: code })
        let header = { "Content-type": "application/json; charset=UTF-8"}
        console.log(header)
        if (code !== undefined) {
            let res = await fetch(
                "http://localhost:8000/bug_reporter/users/login/",
                { method: "POST", body: body, headers: header })
            if (res.status === 202) {
                let data = await res.json()
                if (data.token !== undefined) {
                    sessionStorage.setItem("token", data.token)
                    sessionStorage.setItem("isLoggedIn", true)
                    sessionStorage.setItem("user_data", JSON.stringify(data.user_data))
                    sessionStorage.setItem("header", JSON.stringify({ Authorization: `Token ${sessionStorage.getItem("token")}` }))
                    this.props.onLogin()
                    this.setState({ isRequestSuccessful: true })
                    setCookie("token", data.token, data.expires_in)
                }
            }
            else {
                console.log(res)
                // this.setState({ isRequestNotSuccessful: true,res:await res.text() })
            }
        }
    }


    render() {
        if (this.state.isRequestSuccessful) {
            return <Redirect to='/' />
        }
        if (this.state.isRequestNotSuccessful) {
            return <Redirect to={{
                pathname: '/beforelogin',
                state: { error: "You are Disabled by the Master Please Contact Your senior.",res:this.state.res}
            }} />
        }
        else {
            return (
                <Container className="ContainerDiv">
                    <Dimmer active>
                        <Loader size='massive'>Logging In</Loader>
                    </Dimmer>
                </Container>
            )
        }

    }
}
export default LoginComp