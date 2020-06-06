import React, { Component } from 'react'
import { Container, Button, Header,Image, Message, Grid } from 'semantic-ui-react'
import ill1 from '../images/ill1.jpg'
class LoginPage extends Component {


  render() {
    if (this.props.location.state) {
      console.log(this.props.location.state.res)
    }
    return (
      <Container fluid className="ContainerDiv" style={{marginTop:0}}>
        <Grid columns={2} style={{height:"100%",margin:0,padding:0}} >
          <Grid.Column width={10} style={{padding:0}}>
          <Image fluid src={ill1} style={{height:"100%"}} />
          </Grid.Column>
          <Grid.Column  textAlign='center' fluid style={{width:"37%",alignSelf:"center"}}>
            <Header as="h1">User Login</Header>
            <Button 
            primary 
            href="https://internet.channeli.in/oauth/authorise/?client_id=l1Wb17BXy5ZoQeJ1fzOtZutOObUrzSi9fW1xxLGR&redirect_url=http://localhost:8000/bug_reporter/login/&state=RANDOM_STATE_STRING&scope=Person" 
            fluid content="Login With Omniport" />
            {this.props.location.state &&
              <Message style={{marginTop:"5rem"}} negative content={this.props.location.state.error} header="Login Failed" />
            }
          </Grid.Column>
        </Grid>
      </Container>
    )
  }
}
export default LoginPage
