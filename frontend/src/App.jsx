import {BrowserRouter, Routes, Route} from "react-router-dom"
import Login from "./components/Login"
import ProtectedRoute from "./components/ProtectedRoute"
import SuperDashboard from "./components/SuperDashboard"
import OwnerDashboard from "./components/OwnerDashboard"
import RestaurantOwners from "./components/RestaurantOwners"
import Admins from "./components/Admins"
import RestaurantsAdmin from "./components/RestaurantsAdmin"
import Restaurants_Owner from "./components/Restaurants_Owner"
import Profile from "./components/Profile"
import Menus from "./components/Menus"

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
        <Route path="/owner-dashboard" element={
          <ProtectedRoute allowedRole={"RESTAURANT_OWNER"}>
            <OwnerDashboard/>
          </ProtectedRoute>
        }/>
        <Route path="/owner-dashboard/restaurants" element={
          <ProtectedRoute allowedRole={"RESTAURANT_OWNER"}>
            <Restaurants_Owner/>
          </ProtectedRoute>
        }/>
        <Route path="/owner-dashboard/profile" element={
          <ProtectedRoute allowedRole={"RESTAURANT_OWNER"}>
            <Profile/>
          </ProtectedRoute>
        }/>
        <Route path="/admin-dashboard/profile" element={
          <ProtectedRoute allowedRole={"SUPER_ADMIN"}>
            <Profile/>
          </ProtectedRoute>
        }/>
        <Route path="/owner-dashboard/menus-builder" element={
          <ProtectedRoute allowedRole={"RESTAURANT_OWNER"}>
            <Menus/>
          </ProtectedRoute>
        }/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
