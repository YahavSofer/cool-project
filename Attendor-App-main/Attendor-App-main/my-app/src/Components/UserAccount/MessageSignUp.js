import React from 'react'
import {Card,Container} from 'react-bootstrap'
import {Button} from '@mui/material'
import { Link } from 'react-router-dom'

export default function MessageSignUp() {
    return (
        <>
        <Container className = 'd-flex align-items-center justify-content-center' style={{minHeight:"100vh"}}  id="noNavBar" >
        <div className='w-100'> 
        <Container style={{minWidth:'350px',maxWidth:'400px'}}>
        <Card className='shadow rounded' style={{minHeight:'400px',background:'#83c5be'}}>
            <Card.Body>
                <h2 className="text-center mb-4">Email Sent</h2>
                <Card className="text-center mb-4" style={{justifyContent:'center', display: 'flex',alignItems:'center',background:'#e5e5e5',minHeight:'250px'}}>
                    <p style={{color:'#0081A7',fontSize:'18px'}}>verification email sent to your email address, Please check your email.
                    </p>
                </Card>
                <Link to='/' style={{color: '#FFF', textDecoration: 'none'}}><Button type='submit' className="w-100 mt-sm-2" variant='contained' color='primary'>Log In</Button></Link>
            </Card.Body>  
        </Card>
            </Container>

            </div>
</Container>     
    </>
    )
}
