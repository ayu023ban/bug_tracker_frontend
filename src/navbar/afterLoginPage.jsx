import React, { Component } from 'react'
import {Segment,Loader,Dimmer} from 'semantic-ui-react'
import axios from 'axios'
import { Redirect } from 'react-router'
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
                    }
                    else {
                        console.log(res)
                    }
                }
            })
        }
    }

    // login(){
    //     let url = window.location.href
    //     let code = (url.match(/code=([^&]+)/) || [])[1]
    //     console.log(code)
    //     if (code !== undefined) {
    //         axios.post("http://localhost:8000/bug_reporter/users/login/",{ "code": code }).then((res) => {
    //             console.log(res)
    //             if (res.status === 202) {
    //                 if (res.data.token !== undefined) {
    //                     sessionStorage.setItem("token", res.data.token)
    //                     sessionStorage.setItem("isLoggedIn", true)
    //                     sessionStorage.setItem("user_data", JSON.stringify(res.data.user_data))
    //                     sessionStorage.setItem("header",JSON.stringify({ Authorization: `Token ${sessionStorage.getItem("token")}`}))
    //                     console.log(res.data.token)
    //                     console.log(res.data.user_data)
    //                     this.props.onLogin()
    //                     return(
    //                         <Redirect to='/' />
    //                         )
    //                 }
    //                 else {
    //                     console.log(res)
    //                     return(
    //                         <div>login failed </div>
    //                         )
    //                 }
    //             }
    //             else{
    //                 console.log(res)
    //                     return(
    //                         <div>login failed </div>
    //                         )
    //             }
    //         })
    //     }
    // }


    render() {
        if (this.state.isRequestSuccessful) {
            return <Redirect to='/' />
        }
        else {
            return (
                <Segment>
                    <Dimmer active>
                        <Loader size='massive'>Logging In</Loader>
                    </Dimmer>
                    </Segment>
            )
        }
            
    }
}
export default LoginComp