import React, { Component } from 'react';
import { Segment, Button, Container, Header, Breadcrumb, Card } from 'semantic-ui-react';
import './homePage.scss'
class HomePage extends Component {
    render() {
        return (
            <div className="HomePage">
                <Container>
                    <Breadcrumb size='huge' className="PageTopic" >
                        <Breadcrumb.Section>
                            <Header>Issues</Header>
                        </Breadcrumb.Section>
                    </Breadcrumb>
                    <Header dividing />
                    <Container>
                        <Segment.Group horizontal>
                            <Segment horizontal textAlign='center' children={Button} >
                                <Button basic color='red'> Front End</Button>
                                <Button basic color='blue' > Back End</Button>
                            </Segment>
                            <Segment horizontal textAlign='center' children={Button} >
                                <Button basic color='teal'> Latest</Button>
                                <Button basic color='blue'> My Issues</Button>
                                <Button basic color='green'> Tags</Button>
                                <Button basic color='violet' > Important</Button>
                            </Segment>
                        </Segment.Group>
                    </Container>

                    <Container textAlign='center'>
                        <Card color='red'></Card>
                    </Container>
                </Container>
            </div>
        )
    }
}


export default HomePage