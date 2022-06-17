import React ,{useEffect,useState} from 'react'
import { Container } from 'react-bootstrap'
import Event from '../Events/Event'
import {db} from '../../../firebaseConfig'
import {getDocs,collection,query,startAt,orderBy,Timestamp} from "firebase/firestore"
import Button from '@mui/material/Button'
import { Link,useHistory } from "react-router-dom"
import UndoIcon from '@mui/icons-material/Undo';

export default function Feed() {
    const [eventsData, setEventData] = useState([]);
    const history =useHistory()

    useEffect(() => {
      // onload - get all events from firestore
      const getEvents = async () => {
        
        let timestamp = new Date(Timestamp.now().seconds*1000).setHours(24,0,0,0)
        console.log(timestamp);
        const eventsDB = collection(db, "Events")
        const q = query(eventsDB, orderBy("eventDate"), startAt(timestamp)); 
        const querySnapshot = await getDocs(q).then(res =>{
                return res.docs.map(doc => Object.assign(doc.data(), {id: doc.id})
        )})
        console.log(querySnapshot);
        setEventData(querySnapshot);


      };
  
      getEvents();

    }, []);



    return (
        <>
    <h2 style={{color:'#1b76d3'}} className="text-center mb-4" >Upcoming Events </h2>
    <h6 className="text-center mb-4"  style={{color:'#1b76d3', margin:-20}}>Events sorted by dates from today onwards</h6>
    <Button variant="contained" startIcon={<UndoIcon/>} style={{backgroundColor:'#1b76d3', position:'absolute', right:'79%', top:'26%'}}><Link to='/user' style={{ color: '#FFF', textDecoration: 'none', fontWeight:'bold' }}>Back to Feed</Link></Button>

    <Container>

    {/* this is the way to render the posts */}
    
    {eventsData.map((e) => (
          <Event key={e.id} event={e} />
        ))}    


    </Container>
    </>
    )
}