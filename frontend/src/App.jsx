import {BrowserRouter, Routes, Route} from "react-router-dom"
import Login from "./components/Login"
import ProtectedRoute from "./components/ProtectedRoute"
import SuperDashboard from "./components/SuperDashboard"
import OwnerDashboard from "./components/OwnerDashboard"

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/admin-dashboard" element={
          <ProtectedRoute allowedRole={"SUPER_ADMIN"}>
            <SuperDashboard></SuperDashboard>
          </ProtectedRoute>
        }/>
        <Route path="/owner-dashboard" element={
          <ProtectedRoute allowedRole={"RESTAURANT_OWNER"}>
            <OwnerDashboard></OwnerDashboard>
          </ProtectedRoute>
        }/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
