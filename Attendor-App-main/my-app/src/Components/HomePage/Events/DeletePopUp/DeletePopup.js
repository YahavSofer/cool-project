import React,{useState } from "react";
import "./Deletepopup.css";
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { db } from "../../../../firebaseConfig";
import {  collection,doc, updateDoc, arrayRemove,deleteDoc,query,where } from "firebase/firestore";


export default function DeletePopUp(props){
  // const [checkAttending,setCheckAttending] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleted,setDeleted] = useState(false)

  const handleClose =() =>{
            props.setTrigger(false)
  }


  const RemoveItemFromArray = async() =>{
    const UserAttendingArray = collection(db, "users");
    const q1 = query(UserAttendingArray,where('userLiked','array-contains',props.eventID)); 
    const q2 = query(UserAttendingArray,where('userAttended','array-contains',props.eventID)); 
    await updateDoc(q1, {
      userLiked: arrayRemove(props.eventID) })

    await updateDoc(q2, {
      userAttended: arrayRemove(props.eventID)
  })
  }

  const handleDelete = async() =>{

            setLoading(true)
            // console.log(props.currentUserID);
            const eventID = doc(db, "Events", props.eventID);
            await deleteDoc(eventID).then(
              RemoveItemFromArray()
            );
            setDeleted(true)
            setLoading(false)
            window.location.reload();
  }

  const OnLoadPopup =
                    <>
                        <CloseIcon className="close-btn" onClick={handleClose}/>
                        <Typography component={'header'} textAlign={'center'} color="#1b76d3">
                            Are you sure you want to delete this event?
                        </Typography>
                        
                        <span style={{ marginTop:'20px', display: 'flex',justifyContent:'space-evenly'}}>
                            <Button disabled={loading} variant="contained" color='error' startIcon={<DeleteIcon />} onClick={handleDelete} >Yes</Button>
                            <Button disabled={loading} variant="outlined" startIcon={<CancelIcon />} onClick={handleClose}>Maybe not</Button>
                        </span>
                    </>

  const OnConfirmedPopup =

                        <>
                          {/* <CloseIcon className="close-btn" onClick={handleClose}/> */}
                          <Typography component={'header'} textAlign={'center'} fontSize={'25px'} color="#1b76d3">
                            <b>Your event is successfully deletet!</b><br/>
                          </Typography>
                          <span style={{ marginTop:'20px', display: 'flex',justifyContent:'space-evenly'}}>
                              <Button disabled={loading} variant="outlined" startIcon={<CancelIcon />} onClick={handleClose}>Close</Button>
                          </span>
                        </>




  return( (props.trigger) ?
    <div className="popup">
      <div className="popup-inner">

      {!deleted ? OnLoadPopup : OnConfirmedPopup}
      
      </div>
    </div>
    : ""


  )
}