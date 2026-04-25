import {Navigate, Route, Routes } from "react-router-dom"

import LandingPage from "./features/LandingPage/LandingPage"
import Signup from "./features/AuthPage/Singup"
import Login from "./features/AuthPage/Login"
import DashBoard from "./features/DashBoard/DashBoard"
import MyDecision from "./features/DashBoard/MyDecision"
import ReviewDecision from "./features/DashBoard/ReviewDecision"
import Profile from "./features/DashBoard/Profile"
import ChangePassword from "./features/DashBoard/ChangePassword"
import DecisionDetail from "./features/DashBoard/DecisionDetail"
import EditDecision from "./features/DashBoard/EditDecision"
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
              <Route path="/dashboard" element={<DashBoard/>}>
              <Route index element={<Navigate to="myDecision" replace />} />
              <Route path="myDecision" element={<MyDecision/>}/>
              <Route path="pending" element={<Pending/>}/>
              <Route path="createDecision" element={<CreateDecision/>}/>
              <Route path="analytics" element={<Analytics/>}/>
              <Route path="decision/:id" element={<DecisionDetail/>}/>
              <Route path="review/:id" element={<ReviewDecision/>}/>
              <Route path="edit/:id" element={<EditDecision/>}/>
              <Route path="profile" element={<Profile/>}/>
              <Route path="change-password" element={<ChangePassword/>}/>


            </Route> 

          </Routes>

    </>
  )
}

export default App