import React from 'react'
import { Container,Row,Col,Card} from 'react-bootstrap'
import Feed from './Feed/Feed'


export default function HomePage() {
    return (
        <>
    <div className='bodyDiv'>  
           
        <Container className='flex-warp' fluid>       
            <Row>
                <Feed/>
            </Row>
        </Container>
    </div>
    </>
    )
}
