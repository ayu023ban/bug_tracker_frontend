import React, { Component } from 'react';
import {Container,Image} from 'semantic-ui-react'
import image from '../images/404.png'
class PageNotFound extends Component{
    render(){
        return(
            <Container className="ContainerDiv" style={{marginTop:0}}>
                <Image src={image} />
            </Container>
        )
    }
}
export default PageNotFound