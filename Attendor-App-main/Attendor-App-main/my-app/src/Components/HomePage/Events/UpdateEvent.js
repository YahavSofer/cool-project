import React, {useRef, useState,useEffect} from 'react'
import {Card, Form,Container, Image,InputGroup} from 'react-bootstrap'
import {Button} from '@mui/material'
import {db,storage} from '../../../firebaseConfig'
import { setDoc,doc,getDocs,collection, query, where,Timestamp,getDownloadURL} from "firebase/firestore"
import TextField from '@mui/material/TextField'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import DateTimePicker from '@mui/lab/DateTimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import {  useAuth } from '../../../context/AuthContext'
import no_Img from '../../../images/no-image-available.jpeg'
import CloseIcon from '@mui/icons-material/Close'
import { useHistory } from 'react-router-dom'
import Tooltip from '@mui/material/Tooltip';
import HelpIcon from '@mui/icons-material/Help';


export default function UpdateEvent(props) {

    
    const eventTitleRef = useRef()
    const eventLocationRef = useRef()
    const descriptionRef = useRef()
    const currentEvent = props.location.state.event
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState(null)
    const [imageUrl, setImageURL] = useState("")
    const [tempImgUrl, setTempImgUrl] =useState(no_Img)
    const {currentUser} = useAuth()
    const [dateValue, setDateValue] = useState(Date.now())
    const [closeIconShow, setCloseIconShow] = useState(false)
    const [cost,setCost] = useState(0)
    const [MaxParti, setMaxParti] = useState("No Limit")
    const fileRef = useRef()
    const costRef = useRef()
    const maxPartiRef = useRef()
    const history = useHistory()

function keepOnFormatStr(str)  {
        return str.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
    }    

const handleChangeDate = (newValue) => {

        setDateValue(newValue)

        };
        
function handleChangePicture(e) {
        let t = e.target.files[0].type.split('/').pop().toLowerCase();
        if (t != "jpeg" && t != "jpg" && t != "png" && t != "bmp" && t != "gif") {
            alert('Please select a valid image file');
            e.target.value = null;

        }else{
            setImage(e.target.files[0]);
            setTempImgUrl(URL.createObjectURL(e.target.files[0]))
            setCloseIconShow(true)
          }
        }

function OnClickCloseIcon(){
    setCloseIconShow(false)
    setTempImgUrl(no_Img)
    fileRef.current.value = ''
}

function HandleCost(){
    // console.log(costRef.current.value);

    if (Number(costRef.current.value) > 0){
        setCost(costRef.current.value)
        
    }
    else{
        setCost(0)
    }
}

const HandleMaxParti = (newValue) => {
    // console.log(newValue);
    if (Number(newValue) === null || Number(newValue)===0){
        setMaxParti("No Limit")
        }
    else{
        setMaxParti(Number(newValue))
        }
    };

async function CountUserEvents(){
    const eventsDB = collection(db, "Events")
    const q = query(eventsDB, where("userid", "==", currentUser.uid)); 
    const querySnapshot = await getDocs(q).then(res =>{
            return res.size
        })
    return querySnapshot
}  

async function handleCreatePathName(){
    const eventCounter = ((await CountUserEvents()))
    const imgPath = currentUser.uid + '_' + eventCounter + '_event'
    console.log(imgPath , eventCounter)
    return imgPath
}

    async function handleSubmit(e){
        e.preventDefault()
        
        try{
            setLoading(true)

            const formData={
                title: eventTitleRef.current.value,
                location: eventLocationRef.current.value,
                description: keepOnFormatStr(descriptionRef.current.value)            
            }

            HandleCost()
            
            let timestemp = new Date(dateValue)
            let ftime =Timestamp.fromDate(timestemp).toDate()

            if(image !== null){
                const path = await handleCreatePathName()
                const ref = storage.ref(`/images/event_pictures/${path}`);

                const uploadTask = ref.put(image);
                uploadTask.on("state_changed", console.log, console.error,() => {
                    ref
                        .getDownloadURL()
                        .then(async (url)=>{
                            await setDoc(doc(db, "Events",currentEvent.e_id),{
                                userid: currentUser.uid,
                                title: formData.title,
                                location: formData.location,
                                eventDate: ftime,
                                eventImage: url, 
                                eventCost: Number(cost),
                                eventMaxParti: MaxParti,
                                description: keepOnFormatStr(formData.description),
                                userAttended: currentEvent.e_userAttended,         
                                userLiked: currentEvent.e_userLiked,
                                createdTime :currentEvent.e_createdTime,
                                eventCategory: currentEvent.e_category
                            });
                        });
                })}
            else{        
                    await setDoc(doc(db, "Events",currentEvent.e_id),{
                        userid: currentUser.uid,
                        title: formData.title,
                        location: formData.location,
                        eventDate: ftime,
                        eventImage: imageUrl, 
                        eventCost: Number(cost),
                        eventMaxParti: MaxParti,
                        description: keepOnFormatStr(formData.description),
                        userAttended: currentEvent.e_userAttended,         
                        userLiked: currentEvent.e_userLiked,
                        createdTime :currentEvent.e_createdTime,
                        eventCategory: currentEvent.e_category
                    });
            }

            // console.log('event added!');
            const timer = setTimeout(() => {
                history.push('/user')
                setLoading(false)
                  }, 2000);
        }catch(e){
            console.error("Error adding document: ", e);
            setLoading(false)
        }
        // setLoading(false)
        
    }

   useEffect(()=>{
        const currentEvent =props.location.state.event;
        console.log(currentEvent);

        let timestemp = new Date(currentEvent.e_eventDate.seconds*1000)
        let ftime =Timestamp.fromDate(timestemp).toDate()
        // console.log(ftime);

       eventTitleRef.current.value = currentEvent.e_title
       eventLocationRef.current.value=currentEvent.e_location
       setDateValue(ftime)
       
       if(currentEvent.e_eventImage !== ''){
            console.log("picURL: "+ currentEvent.e_eventImage)
            setTempImgUrl(currentEvent.e_eventImage)
            setImageURL(currentEvent.e_eventImage)
            setCloseIconShow(true)
        
       }else{
        setTempImgUrl(no_Img)
       }



        costRef.current.value = currentEvent.e_eventCost
        
        maxPartiRef.current.value = currentEvent.e_eventMaxParti
        descriptionRef.current.value = currentEvent.e_desc
        setCost(currentEvent.e_eventCost)
        setMaxParti(currentEvent.e_eventMaxParti)
   },[])



    return (
        
        <>
        <Container className = 'd-flex align-items-center justify-content-center' style={{minHeight:"100vh"}}  id="noNavBar" >
        <div className='w-100'> 
        <Container style={{minWidth:'350px',maxWidth:'400px'}}>
        <Card className='shadow rounded' style={{background:'#f0f2f5'}}>
            <Card.Body>
                <h2 className="text-center mb-4">Update Event</h2>
                <Form onSubmit = {handleSubmit}>
                    <Form.Group id="eventname" >
                    <Form.Label>Event Title</Form.Label>
                        {/* <Form.Label>Event Title</Form.Label>     */}
                        {/* <Form.Control type="text" ref={eventTitleRef} required/>  */}
                        <TextField  inputRef={eventTitleRef} placeholder='E.g. "The end of the world Party!"' id="eventTitle" size="small"  variant="outlined" required style={{background:'white',borderRadius:'5px',marginBottom: '10px',paddingTop:'5px',width:'100%',maxHeight:'50px'}} />
                    </Form.Group>
                    <Form.Group id="eventlocation">
                    <Form.Label>Event Location</Form.Label>
                        {/* <Form.Label>Event Location</Form.Label> */}
                        {/* <Form.Control type="text" ref={eventLocationRef} required/>  */}
                        <TextField  required inputRef={eventLocationRef} id="eventlocation" placeholder='Where does your event occur?' size="small"  variant="outlined" required style={{background:'white',borderRadius:'5px',marginBottom: '10px', paddingTop:'5px',width:'100%',maxHeight:'50px'}} />
                    </Form.Group>

                <Form.Group id="eventDate">
                <Form.Label>Event Date
                <Tooltip title='Enter future date for your event' placement="top-end" arrow>
                    <HelpIcon fontSize="small"/> 
                </Tooltip>  
                </Form.Label>
                <div>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                     <DateTimePicker
                            required
                            value={dateValue}
                            onChange={handleChangeDate}
                            renderInput={(params) => <TextField {...params} style={{background:'white',borderRadius:'5px',paddingTop:'5px',marginBottom: '10px'}}  />}
                            minDateTime={new Date(Date.now())}
                        />


                </LocalizationProvider>
            </div>
        </Form.Group>
                

                <Form.Group  id="eventPicture" className="mb-3 ">
                    <Form.Label>Upload Event pricture <span style={{fontSize:'12px',color:'grey'}}> (Optional)</span></Form.Label>
                    <Form.Control type="file"  ref={fileRef} accept="image/*" onChange={handleChangePicture} />
                    <Container style={{  display: 'inline-block',position: 'relative'}}>
                        {closeIconShow ? <CloseIcon  style={{ cursor:'pointer', position: 'absolute',right: '70px',top: '10px',lineHeight :'0'}} onClick={OnClickCloseIcon}/> : null}
                        <Image src={tempImgUrl} alt="" fluid className="w-50 h-50 mt-3 mx-auto d-block" rounded />
                    </Container>
                </Form.Group>

                <Form.Group id="cost" className="mb-3">
                <Form.Label htmlFor="inlineFormInputGroup" >
                        Event Cost <span style={{fontSize:'12px',color:'grey'}}> (Optional)</span>
                    </Form.Label>
                    <InputGroup className="mb-2">
                        <InputGroup.Text>$</InputGroup.Text>
                        <Form.Control id="inlineFormInputGroup" placeholder="Free" type='number' min="0" ref={costRef} onChange={HandleCost}/>
                    </InputGroup>
                    </Form.Group>
                {/* https://react-bootstrap.github.io/components/input-group/ */}


                <Form.Group id="Maximum Participants" >
                        <Form.Label>Maximum Participants <span style={{fontSize:'12px',color:'grey'}}> (Optional)</span></Form.Label>
                        <Form.Control type="number" placeholder='Leave empty if no limit' min="1" ref={maxPartiRef} onChange={(e)=>{HandleMaxParti(e.target.value)}} style={{background:'white',borderRadius:'5px',marginBottom: '10px',paddingTop:'5px',width:'100%',maxHeight:'50px'}}/> 
                </Form.Group>


                <Form.Group id="description" >
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" placeholder='Tell us more details about your event' multiline="true" as="textarea" rows={5} ref={descriptionRef} required/> 
                    </Form.Group>

                    <Button disabled={loading} type='submit' className="w-100 mt-sm-2" variant='contained' color='primary'>
                        Update Event
                    </Button>

                </Form>               
            </Card.Body>
        </Card>

            </Container>
            </div>
</Container>   
    </>
    )
}
