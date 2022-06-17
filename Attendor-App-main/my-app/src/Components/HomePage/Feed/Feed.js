import React ,{useEffect,useState} from 'react'
import { Container } from 'react-bootstrap'
import Event from '../Events/Event'

import {db} from '../../../firebaseConfig'
import {getDocs,collection,orderBy,query} from "firebase/firestore"

export default function Feed() {
    const [eventsData, setEventData] = useState([]);


    useEffect(() => {
      // onload - get all events from firestore

      const getEvents = async () => {
        const AllEvents =collection(db,'Events')
        const q = query(AllEvents, orderBy("createdTime", "desc"));
        const querySnapshot = await getDocs(q)
        .then(function(qSanpshot) {

          console.log(qSanpshot.docs);
          let array = qSanpshot.docs
          let currentIndex = array.length,  randomIndex;

          while (currentIndex != 0) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
              array[randomIndex], array[currentIndex]];
          }

          return array.map(doc => Object.assign(doc.data(), {id: doc.id})
          // return qSanpshot.docs.map(doc => Object.assign(doc.data(), {id: doc.id})
          )})

        setEventData(querySnapshot);
        // console.log(querySnapshot);
      };
  
      getEvents();
    }, []);



    return (
        <>
    <Container>

    {/* this is the way to render the posts */}

    {eventsData.map((e) => (
          <Event key={e.id} event={e} />
        ))}    


    </Container>
    </>
    )
}
