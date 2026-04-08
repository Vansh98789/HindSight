import {Navigate, Route, Routes } from "react-router-dom"

import LandingPage from "./features/LandingPage/LandingPage"
import Signup from "./features/AuthPage/Singup"
import Login from "./features/AuthPage/Login"
import DashBoard from "./features/DashBoard/DashBoard"
import MyDecision from "./features/DashBoard/MyDecision"
import Pending from "./features/DashBoard/Pending"
import CreateDecision from "./features/DashBoard/CreateDecision"
import Analytics from "./features/DashBoard/Analytics"

function App() {

  return (
    <>
          <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/login" element={<Login/>}/>
            * <Route path="/dashboard" element={<DashBoard/>}>
              <Route index element={<Navigate to="myDecision" replace />} />
              <Route path="myDecision" element={<MyDecision/>}/>
              <Route path="pending" element={<Pending/>}/>
              <Route path="createDecision" element={<CreateDecision/>}/>
              <Route path="analytics" element={<Analytics/>}/>
            </Route> 

          </Routes>

    </>
  )
}

export default App