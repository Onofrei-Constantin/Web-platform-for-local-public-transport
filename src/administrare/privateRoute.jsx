import React from 'react';
import {  Outlet, Navigate  } from 'react-router-dom';


const PrivateRoute = () => {

    return (localStorage.getItem("authToken") && localStorage.getItem("authRefreshToken")) ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
