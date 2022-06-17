import React from "react";
import { AuthProvider} from "../context/AuthContext";
import {BrowserRouter as Router, Switch ,Route} from 'react-router-dom'
import AccountRoutes from "./AccountRoutes";


function App() {

  return (
        <Router>
            <AuthProvider>
                  <Switch>         
                       <Route path='/' component={AccountRoutes} />         
                   </Switch>
            </AuthProvider>
        </Router>




  )
}
export default App;