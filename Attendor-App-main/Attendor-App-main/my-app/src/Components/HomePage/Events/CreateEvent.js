import React, {useRef, useState,useEffect} from 'react'
import {Card, Form,Container, Image,InputGroup} from 'react-bootstrap'
import {Button, Icon} from '@mui/material'
import {db,storage} from '../../../firebaseConfig'
import { addDoc,getDocs,collection, query, where,Timestamp  } from "firebase/firestore"
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

export default function CreateEvent() {


    const eventTitleRef = useRef()
    const eventLocationRef = useRef()
    const descriptionRef = useRef()
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState(null)
    const [imageUrl, setImageURL] = useState("")
    const [tempImgUrl, setTempImgUrl] =useState(no_Img)
    const {currentUser} = useAuth()
    const [dateValue, setValue] = useState(Date.now()) 
    const [closeIconShow, setCloseIconShow] = useState(false)
    const [cost,setCost] = useState(0)
    const [MaxParti, setMaxParti] = useState("No Limit")
    const fileRef = useRef()
    const costRef = useRef()
    const maxPartiRef = useRef()
    const history = useHistory()
    const categoryDic={
        '0': 'academic',
        '1': 'audition',
        '2': 'festival',
        '3': 'music',
        '4': 'party',
        '5': 'rave',
        '6': 'sports',
        '7': 'stand-up',
        '8': 'support group',
        '9': 'theater',
        '10': 'tournament'
}

function keepOnFormatStr(str)  {
        return str.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
    }    

const handleChangeDate = (newValue) => {

        setValue(newValue)

        };
        
function handleChangePicture(e) {
        setImage(e.target.files[0]);
        setTempImgUrl(URL.createObjectURL(e.target.files[0]))
        setCloseIconShow(true)
          }


function OnClickCloseIcon(){
    setCloseIconShow(false)
    setTempImgUrl(no_Img)
    fileRef.current.value = ''
}

function HandleCost(){

    if (costRef.current.value > 0){
        setCost(costRef.current.value)
        
    }
    else{
        setCost(0)
    }
}

const HandleMaxParti = (newValue) => {
    // console.log(newValue);
    if (newValue === null){
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

async function getCategoryFromAPI (){

    let descData = {
                    "events": [
                    {
                        "description":  descriptionRef.current.value
                    }
                    ]
                }
      
    console.log("The Json is: "+ JSON.stringify(descData));
    const response = await fetch("https://x21ad6xb6e.execute-api.us-east-1.amazonaws.com/beta", {
    method: "POST",
    headers: {'Content-Type': 'application/json'}, 
    body: JSON.stringify(descData)
    })
    const resJson = await response.json()
    console.log("Category Number: "+resJson.body.substr(1,1));
    let categoryIndex = resJson.body.substr(1,1)
    console.log("Category Name: "+ categoryDic[categoryIndex]);
    return( categoryDic[categoryIndex] )

    // set category from api into category variable
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
            const tempCategory = await getCategoryFromAPI()
            console.log(tempCategory);
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

                            await addDoc(collection(db, "Events"),{
                                userid: currentUser.uid,
                                title: formData.title,
                                location: formData.location,
                                eventDate: ftime,
                                eventImage: url, 
                                eventCost: Number(cost),
                                eventMaxParti: MaxParti,
                                description: keepOnFormatStr(formData.description),              
                                userAttended: [],         
                                userLiked:[],
                                createdTime:Timestamp.fromDate(new Date(Date.now())).toDate(),
                                eventCategory: tempCategory
                            });
                        });
                })}
            else{        
                    await addDoc(collection(db, "Events"),{
                        userid: currentUser.uid,
                        title: formData.title,
                        location: formData.location,
                        eventDate: ftime,
                        eventImage: imageUrl, 
                        eventCost: Number(cost),
                        eventMaxParti: MaxParti,
                        description: keepOnFormatStr(formData.description),              
                        userAttended: [],         
                        userLiked:[],
                        createdTime:Timestamp.fromDate(new Date(Date.now())).toDate(),
                        eventCategory: tempCategory
                    });
            }

            // console.log('event added!');
            // alert('Your event has created successfuly!')
            const timer = setTimeout(() => {
                history.push('/user/success',tempCategory)
                  }, 2000);
            // history.go(0)
        }catch(e){
            console.error("Error adding document: ", e);
        }
        setLoading(false)
        
    }

    return (
        
        <>
        <Container className = 'd-flex align-items-center justify-content-center' style={{minHeight:"100vh"}}  id="noNavBar" >
        <div className='w-100'> 
        <Container style={{minWidth:'350px',maxWidth:'400px'}}>
        <Card className='shadow rounded' style={{background:'#f0f2f5'}}>
            <Card.Body>
                <h2 className="text-center mb-4">Create New Event</h2>
                
                <Form onSubmit = {handleSubmit}>
                    <Form.Group id="eventname" >
                    <Form.Label>Event Title</Form.Label>
                        <TextField inputRef={eventTitleRef} placeholder='E.g. "The end of the world Party!"' id="eventTitle" size="small"  variant="outlined" required style={{background:'white',borderRadius:'5px',marginBottom: '10px',paddingTop:'5px',width:'100%',maxHeight:'50px'}} />
                    </Form.Group>
                    <Form.Group id="eventlocation">
                    <Form.Label>Event Location</Form.Label>
                        <TextField required placeholder='Where does your event occur?' inputRef={eventLocationRef} id="eventlocation" size="small"  variant="outlined" required style={{background:'white',borderRadius:'5px',marginBottom: '10px', paddingTop:'5px',width:'100%',maxHeight:'50px'}} />
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
                            inputFormat="dd/MM/yyyy HH:mm"
                            value={dateValue}
                            onChange={handleChangeDate}
                            renderInput={(params) => <TextField {...params} style={{background:'white',borderRadius:'5px',paddingTop:'5px',marginBottom: '10px'}}  />}
                            minDateTime={new Date(Date.now())}
                        />


                </LocalizationProvider>
            </div>
            
        </Form.Group>
              

                <Form.Group  id="eventPicture" className="mb-3 ">
                    <Form.Label>Upload Event pricture <span style={{fontSize:'12px',color:'grey'}}>(Optional)</span></Form.Label>
                    <Form.Control ref={fileRef} type="file" onChange={handleChangePicture} />
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
                        <Form.Control  placeholder="Free" type='number' min="0" ref={costRef} onChange={HandleCost}/>
                    </InputGroup>
                    </Form.Group>
                {/* https://react-bootstrap.github.io/components/input-group/ */}


                <Form.Group id="Maximum Participants" >
                        <Form.Label>Maximum Participants <span style={{fontSize:'12px',color:'grey'}}>(Optional)</span></Form.Label>
                        <Form.Control type="number" placeholder='Leave empty if no limit' min="1" ref={maxPartiRef} onChange={(e)=>{HandleMaxParti(e.target.value)}} style={{background:'white',borderRadius:'5px',marginBottom: '10px',paddingTop:'5px',width:'100%',maxHeight:'50px'}}/> 
                </Form.Group>


                <Form.Group id="description" >
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" placeholder='Tell us more details about your event' multiline="true" as="textarea" rows={5} ref={descriptionRef} required/> 
                    </Form.Group>

                    <Button disabled={loading} type='submit' className="w-100 mt-sm-2" variant='contained' color='primary'>
                        Create Event
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
