import React,{useState,useEffect}from 'react'
import {Card,Container} from 'react-bootstrap'
import Button from '@mui/material/Button'
import { Link } from "react-router-dom"
import UndoIcon from '@mui/icons-material/Undo';

export default function EventSuccess(props) {

    useEffect(() => {
        console.log(props.location.state) 

    }, [])
    return (
        <>
        <Container className = 'd-flex align-items-center justify-content-center' style={{minHeight:"20vh"}}  id="noNavBar" >
        <div className='w-100'> 
        <Container style={{minWidth:'350px',maxWidth:'400px'}}>
        <Card className='shadow rounded' style={{background:'#f0f2f5',minHeight:'400px'}}>
            <Card.Body>
                <h2 className="text-center mb-4"><div style={{marginBottom:'10px'}}>Oh Yeah!</div> Your event created successfully!</h2>
                <div style={{textAlign:'center',marginTop:'50px',marginBottom:'60px'}}>Your event has been assigned to <span style={{fontSize:'20px'}}><b>{props.location.state}</b></span> catergory.</div>
                
                <Button variant="contained" startIcon={<UndoIcon/>} style={{backgroundColor:'#1b76d3',alignSelf:'center',left:'25%', top:'25%'}}><Link to='/user' style={{ color: '#FFF', textDecoration: 'none', fontWeight:'bold' }}>Back to Feed</Link></Button>

            </Card.Body>
        </Card>

            </Container>
            </div>
</Container>   
    </>
    )
}
