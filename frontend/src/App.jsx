import {BrowserRouter, Routes, Route} from "react-router-dom"
import Login from "./components/Login"
import ProtectedRoute from "./components/ProtectedRoute"
import SuperDashboard from "./components/SuperDashboard"
import OwnerDashboard from "./components/OwnerDashboard"
import RestaurantOwners from "./components/RestaurantOwners"
import Admins from "./components/Admins"
import RestaurantsAdmin from "./components/RestaurantsAdmin"

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
        <Route path="/admin-dashboard/restaurant-owners" element={
          <ProtectedRoute allowedRole={"SUPER_ADMIN"}>
            <RestaurantOwners></RestaurantOwners>
          </ProtectedRoute>
        }/>
        <Route path="/admin-dashboard/admins" element={
          <ProtectedRoute allowedRole={"SUPER_ADMIN"}>
            <Admins/>
          </ProtectedRoute>
        }/>
        <Route path="/admin-dashboard/restaurants" element={
          <ProtectedRoute allowedRole={"SUPER_ADMIN"}>
            <RestaurantsAdmin/>
          </ProtectedRoute>
        }/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
