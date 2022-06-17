import React , {useState, useEffect} from 'react'
import {Card , Button , Alert} from 'react-bootstrap'
import {  useAuth } from '../../context/AuthContext'
import { Link,useHistory } from 'react-router-dom'
import {db} from '../../firebaseConfig'
import { doc,getDoc,getDocs,collection,where,query} from "firebase/firestore"
import Avatar from '@mui/material/Avatar'
import { Container,Row,Col} from 'react-bootstrap'


export default function UserProfile() {
    const [error, setError] = useState('')
    const {currentUser , logout} = useAuth()
    const history = useHistory()
    const [profileImage,setProfileImage] = useState()
    const [isProfilePic,setIsProfilePic] = useState(false)
    const [firstName,setFirstName] = useState()
    const [lastName,setLastName] = useState()
    const [userGender,setGender] = useState()
    const [userBirthDay,setBirthday] = useState()

    async function handleLogout(){
        setError('')

        try{
            await logout()
            history.push('/')
        }catch{
            setError('Failed to log out')
        }

    } 

    useEffect(() => {
        // onload - get all events from firestore
      
        // set user profile in event profile picture. if they dont have, place icon insted
        const getUserProfileImg = async () => {
          const userDoc = await getDoc(doc(db,'users',currentUser.uid))
          .then( u =>{
                      setProfileImage(u.data().profileImage);
                      setFirstName(u.data().first);
                      setLastName(u.data().last);
                      setGender(u.data().gender)
                      const d = (u.data().birthday.toDate())
                      setBirthday(d.getDate()+ '/'+(d.getMonth()+1)+'/'+d.getFullYear())

                      console.log(d.getDate());
                     console.log(u.data());

          } )
            
        };
        getUserProfileImg();
        
        if (profileImage !== ""){
          setIsProfilePic(true)
        } 
      }, []);

    
    return (
        <>  <div style={{
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)',
            minWidth: '600px'
          }} >
            <Card style={{background:'#f0f2f5'}} >
                <Card.Body>
                <Row>
                <h2 style={{display:"inline"}} className="text-center mb-4" >My Profile </h2>
                </Row>
                <Row>
                <Col>
                {error && <Alert variant="danger">{error}</Alert>}
                <strong>Email : </strong>{currentUser.email}<br></br>
                <strong>First Name : </strong>{firstName}<br></br>
                <strong>Last Name : </strong>{lastName}<br></br>
                <strong>Gender : </strong>{userGender}<br></br>
                <strong>Birthday : </strong>{userBirthDay}<br></br>
                <Link to='/user/update-password' className="btn btn-primary" style={{marginTop:"10px"}}>Change Password</Link>
                </Col>
                <Col>
                {isProfilePic?
                <Avatar src={profileImage} aria-label="user-name" sx={{ width: 200, height: 200 }}/>   
                :
                <Avatar src="" aria-label="user-name"/>    
                }
                </Col>
                </Row>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2"> 
               <Button variant='link' onClick={handleLogout}>Log Out</Button>  
            </div>
            </div>
        </>

    )
}
