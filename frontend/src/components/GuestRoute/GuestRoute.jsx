import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const GuestRoute = () => {
  const isAuth=useSelector((state)=>state.auth.isAuth)
  return( 
  isAuth?
  <Navigate to='/rooms'/>:
  <Outlet/>
  );
};

export default GuestRoute;
