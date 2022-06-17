import React,{useState } from "react";
import "./attendPopup.css";
import CloseIcon from '@mui/icons-material/Close'
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CancelIcon from '@mui/icons-material/Cancel';
import AssistantIcon from '@mui/icons-material/Assistant';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { db } from "../../../../firebaseConfig";
import {  doc, updateDoc, arrayUnion } from "firebase/firestore";
import Card from '@mui/material/Card';
import { useHistory } from 'react-router-dom'

// import PropTypes from "prop-types";   //npm install prop-types --save


export default function AttendPopUp(props){
  // const [checkAttending,setCheckAttending] = useState(false)
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const temp = props.eventCategory


  const handleClose =() =>{
            props.setTrigger(false)
            if (!props.checkAttending){
              props.setAttendValue(false)
            }
  }

  const handleAttend = async() =>{

            setLoading(true)
            // console.log(props.currentUserID);
            const UserAttendingArray = doc(db, "users", props.currentUserID);
            await updateDoc(UserAttendingArray, {
              userAttended: arrayUnion(props.eventID)
          }).then(console.log('event added to user attending list'))


            const eventsAttendings = doc(db, "Events", props.eventID);
            await updateDoc(eventsAttendings, {
              userAttended: arrayUnion(props.currentUserID)
          }).then(console.log('secceed'));

          props.setAttendingCounter(props.attendingCounter+1);
          if((props.attendingCounter === props.eventMaxParti)&& !props.attendValue){
              props.setDisabledButton(true)
            }

            props.setCheckAttending(true)

            setLoading(false)

  }

  const OnLoadPopup =
                    <>
                        <CloseIcon className="close-btn" onClick={handleClose}/>
                        <Typography component={'header'} textAlign={'center'} color="#1b76d3">
                            It is time to join to <b>{props.username}</b> 
                        </Typography>
                        
                        <span style={{ marginTop:'20px', display: 'flex',justifyContent:'space-evenly'}}>
                            <Button disabled={loading} variant="contained" startIcon={<EventAvailableIcon />} onClick={handleAttend} >Attend</Button>
                            <Button disabled={loading} variant="outlined" startIcon={<CancelIcon />} onClick={handleClose}>Not Now</Button>
                        </span>
                    </>

  const OnConfirmedPopup =

                        <>
                          {/* <CloseIcon className="close-btn" onClick={handleClose}/> */}
                          <Typography component={'header'} textAlign={'center'} fontSize={'25px'} color="#1b76d3">
                            <b>You have successfully registered for the event!</b><br/>
                          </Typography>
                          <Typography component={'p'} textAlign={'left'} color="#1b76d3" >
                            <div style={{ fontSize:'18px',marginLeft:'60px'}}>
                              <b>Event Details</b><br/>
                            </div>
                            </Typography>
                            <Card style={{backgroundColor:"#white",border:`2px solid #1b76d3`, width:"450px", display:'inline-block',marginLeft:'60px'}}>
                            <Typography>
                              <div style={{fontSize:'15px', textAlign:'left', marginLeft:'5px'}} >
                                  <b>Event:</b> {props.eventTitle}<br/>
                                  <b>Date&Time:</b> {props.eventDate} {props.eventTime}<br/>
                                  <b>Location:</b> {props.eventLocation}<br/>
                            </div> 
                          </Typography>
                          </Card>
                          <span style={{ marginTop:'20px', display: 'flex',justifyContent:'space-evenly'}}>
                              <Button disabled={loading} variant="contained" startIcon={<AssistantIcon />} onClick={()=>{history.push('/user/recommendations',props.eventCategory)}} >Get recommendations</Button>
                              <Button disabled={loading} variant="outlined" startIcon={<CancelIcon />} onClick={handleClose}>Close</Button>
                          </span>
                        </>




  return( (props.trigger) ?
    <div className="popup">
      <div className="popup-inner">

      {!props.checkAttending ? OnLoadPopup : OnConfirmedPopup}
      
      </div>
    </div>
    : ""


  )
}