import React, {useRef, useState} from 'react'
import {Alert,Card,Form,Container,Row,Col,FloatingLabel} from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { Link , useHistory } from 'react-router-dom'
import {Button} from '@mui/material'
import { db ,auth} from '../../firebaseConfig'
import {doc , getDoc } from 'firebase/firestore'

export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login } = useAuth()
    const {currentUser}= useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const history = useHistory()

async function IsUserAddedDetails(user){
    try{
        const userID = user.uid
        console.log(userID)
        const docSnap = await getDoc(doc(db, 'users',userID))

        if (docSnap.exists()) {
            history.push('/user')
          } else {
            history.push('/userform')
          }
    }catch(error){
            console.log(error)
        }
}

 async function handleSubmit(e){
        e.preventDefault()

        try{
            setError("")
            setLoading(true)
            await login(emailRef.current.value , passwordRef.current.value)
            auth.onAuthStateChanged(function(user) {
                if (user) {
                    console.log(user)
                    IsUserAddedDetails(user)
                }
              });
           
            // history.push("/")
            
        }catch{
            setError('Email or Password are incorect')
        }
        setLoading(false)
        
    }
    return (
        <>

<       Container className = 'd-flex align-items-center justify-content-center' style={{minHeight:"100vh"}}  id="noNavBar" >
        <div className='w-100'> 
    <Container className='flex-warp'> 
        <Row>
            <Col style={{minWidth:'350px',maxWidth:'400px'}}>
                    <Card className='shadow rounded' style={{background:'#83c5be'}}>
                    <Card.Body>
                        <h2 className="text-center mb-4">Log In</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit = {handleSubmit}>
                            <Form.Group id="email">
                                <FloatingLabel label="Email"  className="mb-3">
                                <Form.Control type="email"  placeholder="name@example.com"  ref={emailRef} required/>
                                </FloatingLabel>
                                 
                            </Form.Group>    
                            <Form.Group id="password">
                                <FloatingLabel label="Password"  className="mb-3">                             
                                <Form.Control type='password' placeholder="Password" ref={passwordRef} required/> 
                                </FloatingLabel>
                            </Form.Group>
                            
                            <Button disabled={loading} type='submit' className="w-100 mt-sm-2" variant='contained' color='success'>
                                Log In
                            </Button>
                            <div className="w-100 text-center mt-2" >
                                <Link to='/forgot-password'>Forgot password ?</Link>
                            </div>
                        </Form>               
                    </Card.Body>
                </Card>
                    <div className="w-100 text-center mt-2" style={{fontSize: '20px'}}> 
                        Don't have account ? <Link to='/signup'>Sign Up</Link>    
                    </div>

        </Col>
        <Col md={{ span: 3,offset: 2 }} className='mb-md-4 text-left'  style={{minWidth:'400px',minHeight:'25vh'}}>
            <h1 style={{fontSize:'500%', color: '#00afb9'}}>Attendor</h1>
           <p style={{fontSize: '180%'}}> Find your event,<br/>
            and be part of a <strong>bigger</strong> comunity
            </p>
        </Col>
        </Row>
    </Container>
    </div>
</Container>     
    </>
    )
}
