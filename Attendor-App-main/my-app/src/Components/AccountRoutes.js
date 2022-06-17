import React from 'react'
import {Route,useRouteMatch} from 'react-router-dom'
import Login from './UserAccount/Login'
import MessageSignUp from './UserAccount/MessageSignUp'
import Signup from './UserAccount/Signup'
import ForgotPassword from './UserAccount/ForgotPassword'
import UserForm from './UserAccount/UserForm'
import PrivateRoute from './PrivateRoute'
import {Container} from 'react-bootstrap'
import HomePageRoutes from './HomePageRoutes'

export default function AccountRoutes() {

    const match = useRouteMatch()

    return (
        <>
        <Container>
        <div>        
        {/* <Route exact path={`${match.url}`} component={Login} /> */}
        <Route exact path="/" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/messagesignup" component={MessageSignUp} />
        <PrivateRoute path="/userform" component={UserForm} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <PrivateRoute path="/user" component={HomePageRoutes} />
        
        </div>
        </Container>

        </>
    )
}
