import React, { Component } from 'react'
import WebSocketInstance from './websocket'
import { Container, Button, Form } from 'semantic-ui-react'
class LoginPage extends Component {
  state = {value:""}
  clickhandler() {
    // console.log('hda')
    WebSocketInstance.bug_id = 1
    WebSocketInstance.connect()
  }
  clickhandler2() {
    WebSocketInstance.fetchMessages()
  }
  inputchange(e){
    this.setState({value:e.target.value})
  }  
  sendbu(){
    // console.log('mdfas')
    WebSocketInstance.newComment(this.state.value)
  }

  render() {
    return (
      <Container>
        <Button content='click' onClick={this.clickhandler.bind(this)} />
        <Button content='click2' onClick={this.clickhandler2.bind(this)} />
        <Form.Input value = {this.state.value} onChange={this.inputchange.bind(this)} />
        <Button content="submit" onClick={this.sendbu.bind(this)} />
      </Container>
    )
  }
}
export default LoginPage
