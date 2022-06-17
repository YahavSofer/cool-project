import React from 'react'
import {Container} from 'react-bootstrap'
import {useRouteMatch, Switch} from 'react-router-dom'
import Feed from './HomePage/Feed/Feed'
import UserProfile from './HomePage/UserProfile'
import MayNavBar from './HomePage/NavigationBar/MayNavBar'
import CreateEvent from './HomePage/Events/CreateEvent'
import UpdatePassword from './UserAccount/UpdatePassword'
import PrivateRoute from './PrivateRoute'
import HomePage from './HomePage/HomePage'
import UserRecommendations from './HomePage/Recommendations/UserRecommendations'
import UpdateEvent from './HomePage/Events/UpdateEvent'
import UpcominEvents from './HomePage/FilterdEvents/UpcomingEvents'
import LikedEvents from './HomePage/FilterdEvents/LikedEvents'
import MyEvents from './HomePage/FilterdEvents/MyEvents'
import EventSuccess from './HomePage/Events/EventSuccess'
import AttendEvents from './HomePage/FilterdEvents/AttendEvents'

export default function HomePageRoutes(){

    const match = useRouteMatch();

    return (
            <div>
            {/* {console.log({match})} */}
            <div style={{marginBottom:'12%'}}>
            <MayNavBar/>
            </div>
            <Container  >
                    <Switch>
                            <PrivateRoute  exact path={`${match.url}/`} component={HomePage} />
                            <PrivateRoute  exact path={`${match.url}/feed`} component={Feed} />
                            <PrivateRoute  path={`${match.url}/recommendations`} component={UserRecommendations} />
                            <PrivateRoute  path={`${match.url}/update-password`} component={UpdatePassword} />
                            <PrivateRoute  path={`${match.url}/profile`} component={UserProfile} />
                            <PrivateRoute  path={`${match.url}/create-event`} component={CreateEvent} /> 
                            <PrivateRoute  path={`${match.url}/update-event`} component={UpdateEvent} /> 
                            <PrivateRoute  path={`${match.url}/liked-events`} component={LikedEvents} /> 
                            <PrivateRoute  path={`${match.url}/upcoming-events`} component={UpcominEvents} />
                            <PrivateRoute  path={`${match.url}/my-events`} component={MyEvents} />
                            <PrivateRoute  path={`${match.url}/success`} component={EventSuccess} />
                            <PrivateRoute  path={`${match.url}/attend-events`} component={AttendEvents} /> 

                    </Switch>
            </Container>
            </div>
        )
      }
    

