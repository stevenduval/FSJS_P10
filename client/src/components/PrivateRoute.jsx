import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import UserContext from "../context/UserContext";

const PrivateRoute = () => {
    // get authUser from userContext
    const { authUser } = useContext(UserContext);
    
    // reference to useLocation Hook
    const location = useLocation();

    // if user is authenticated send them to where the belong, otherwise send them to sign in and preserve where they came from
    return authUser ? <Outlet /> :  <Navigate to="signin" state={{ from: location.pathname }} replace />
}

export default PrivateRoute;