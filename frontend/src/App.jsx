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
import PublicMenu from "./components/PublicMenu"
import PublicRestaurant from "./components/PublicRestaurant"
import NotFound from "./components/notFound"
import Inactive from "./components/Inactive"
import Home from "./components/Home"
import GetStarted from "./components/GetStarted"
import Signup from "./components/Signup"
import Subscription from "./components/Subscription"
import Activate from "./components/Activate"
import Unsubscribers from "./components/Unsubscribers"
import Verification from "./components/Verification"
import Success from "./components/Success"
import Payment from "./components/Payment"

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/activate" element={<Activate/>}/>
        <Route path="/verification" element={<Verification/>}/>
        <Route path="/subscription" element={
          <ProtectedRoute allowedRole={"UNSUBSCRIBER"}>
            <Subscription/>
          </ProtectedRoute>
        }/>
        <Route path="/payment" element={
          <ProtectedRoute allowedRole={"UNSUBSCRIBER"}>
            <Payment/>
          </ProtectedRoute>
        }/>
        {/* <Route path="/success" element={
          // <ProtectedRoute allowedRole={"RESTAURANT_OWNER"}>
            <Success/>
          // </ProtectedRoute>
        }/> */}
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
        <Route path="/admin-dashboard/unsubscribers" element={
          <ProtectedRoute allowedRole={"SUPER_ADMIN"}>
            <Unsubscribers></Unsubscribers>
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
        <Route path="/contact-us" element={<GetStarted/>}/>
        <Route path="/not-found" element={<NotFound/>}/>
        <Route path="/inactive" element={<Inactive/>}/>
        <Route path="/:restaurantSlug/:menuId" element={<PublicMenu/>}/>
        <Route path="/:restaurantSlug" element={<PublicRestaurant/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
