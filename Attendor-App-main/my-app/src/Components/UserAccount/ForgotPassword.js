import React, {useRef, useState} from 'react'
import {Alert, Card, Col, Container, Form, Row,FloatingLabel} from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import {Button} from '@mui/material'
import { createTheme,ThemeProvider } from '@mui/material/styles'


export default function ForgotPassword() {
    const emailRef = useRef()
    const { resetPassword } = useAuth()
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)



const theme = createTheme({
  palette: {
    success: {
      main: '#00897b',
      darker: '#005f56',
    }
  },
});

 async function handleSubmit(e){
        e.preventDefault()

        try{
            setMessage("")
            setError("")
            setLoading(true)
            await resetPassword(emailRef.current.value)
            setMessage('Check your inbox for further instructions')
        }catch{
            setError("Failed to reset password")
        }
        setLoading(false)
        
    }
    return (
        <>        
        
        <Container className = 'd-flex align-items-center justify-content-center' style={{minHeight:"100vh"}}  id="noNavBar" >
        <div className='w-100'> 
        <Container  className='flex-warp'>
            <Row>
                <Col style={{minWidth:'350px',maxWidth:'400px'}}>
                    <Card style={{minHeight:'350px'}}>
                        < Card.Body className = 'align-items-center flex-column'>
                            <h2 className="text-center mb-4">Password Reset</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {message && <Alert variant="success">{message}</Alert>}
                            <Form onSubmit = {handleSubmit}>
                                <Form.Group id="email">
                                    <FloatingLabel label="Email"  className="mb-3">
                                    <Form.Control type="email"  placeholder="name@example.com"  ref={emailRef} required/>
                                    </FloatingLabel>
                                </Form.Group>    
                                <ThemeProvider theme={theme}>
                                <Button disabled={loading} type='submit' className="w-100 mt-sm-2" variant='contained' color='success'>
                                    Reset Password
                                </Button>
                                </ThemeProvider>
                            </Form>               
                        </Card.Body>
                    </Card>
            <div className="w-100 text-center mt-2"> 
                Don't have account ? <Link to='/signup'>Sign Up</Link>    
            </div>               
                </Col>

            </Row>

        </Container>
        </div>
</Container>     
    </>
    )
}
