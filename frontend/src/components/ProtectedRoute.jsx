import React from 'react'
import {Navigate} from "react-router-dom"

function ProtectedRoute({allowedRole, children}){
    const role = localStorage.getItem("role");
    if (role !== allowedRole) {
        return <Navigate to="/login"/>
    }
    return children;
}

export default ProtectedRoute