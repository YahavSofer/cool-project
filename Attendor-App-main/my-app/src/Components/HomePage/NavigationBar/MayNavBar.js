import React, { useState,useEffect} from 'react'
import NavBar from './NavBar'
import { useLocation } from 'react-router-dom';


export default function MayNavBar() {
    const [isNavbarVisability,setIsNavbarVisability] = useState(false)
    const location = useLocation()

   useEffect(() =>{
        const currentRoute = location.pathname
        // console.log(currentRoute)
        const containsLandingPage = currentRoute.includes("user") //reaturn True if the user didnt sign in 
        // console.log(containsLandingPage);
        if  (containsLandingPage) {
            setIsNavbarVisability(true) 
        //   console.log("show NavBar" )
        }
        else{
            setIsNavbarVisability(false) 
            // console.log("hide NavBar" )
        }
    },[])

    return (
            <>
            {isNavbarVisability ? <NavBar /> :  null }

            </>
    )
}
