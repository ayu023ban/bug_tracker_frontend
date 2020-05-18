import React, { Component } from 'react'
// import {Button, Icon} from 'semantic-ui-react'
import axios from 'axios'
class LoginComp extends Component {
    // constructor(props){
    //     super(props)
    //     // this.handleClick = this.handleClick.bind(this)
    // }
    componentDidMount() {
        let url = window.location.href
        // window.location.assign()
        let code = (url.match(/code=([^&]+)/) || [])[1]
        if (code !== undefined) {
            axios.post("http://localhost:8000/bug_reporter/users/login/", { code: code }).then((res) => {
                if (res.data.token !== undefined) {
                    sessionStorage.setItem("token", res.data.token)
                    sessionStorage.setItem("isLoggedIn",true)
                    console.log(res.data.token)
                    this.props.onLogin()
                }
            })
        }
    }


    render() {
        return null
    }
}
export default LoginComp