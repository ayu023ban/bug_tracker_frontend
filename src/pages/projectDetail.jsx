import React, { Component } from 'react'
import { Container, Header, Breadcrumb, Icon, Divider, Card, Segment, Grid } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import './scss/projectDetail.scss'
class ProjectDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.location.state.id,
            data: null
        }

    }

    componentWillMount() {
        const url = `http://localhost:8000/bug_reporter/projects/${this.state.id}/`
        fetch(url, JSON.parse(sessionStorage.getItem("header"))).then(res => res.json()).then((data) => {
            this.setState({ data: data }, () => {
                console.log("rendered")
                this.render()
            })

        })
    }


    render() {
        const { data } = this.state
        console.log(data)
        if (data !== null) {
            return (
                <Container >
                    <Header>
                        <Breadcrumb as={Header}>
                            <Breadcrumb.Section className='previousSection' as={Link} to='/projects'>Projects</Breadcrumb.Section>
                            <Breadcrumb.Divider><Icon name='angle right' /></Breadcrumb.Divider>
                            <Breadcrumb.Section>{data.name}</Breadcrumb.Section>
                        </Breadcrumb>
                    </Header>
                    <Divider section />
                    <Card fluid>
                        <Card.Content className="CardTop" >
                            <Card.Description textAlign='center'>{data.wiki}</Card.Description>
                        </Card.Content>
                        <Card.Content>
                            <Header as='h2' textAlign='center'>
                                {data.name}
                            </Header>
                        </Card.Content>
                        <Card.Content>
                          <Grid columns={3} divided >
                              <Grid.Row>
                                  <Grid.Column textAlign='center'>
                                      <Icon name='user' />
                                  </Grid.Column>
                                  <Grid.Column textAlign='center'>
                                      <Icon name='user' />
                                  </Grid.Column>
                                  <Grid.Column textAlign='center'>
                                      <Icon name='user' />
                                  </Grid.Column>
                              </Grid.Row>
                          </Grid>
                        </Card.Content>
                    </Card>
                </Container>
            )
        }
        else {
            return (
                <div>fdaklm</div>
            )
        }
    }
}

export default ProjectDetail