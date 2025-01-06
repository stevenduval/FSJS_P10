import { useContext, useEffect } from "react"
import { Navigate } from "react-router-dom";
import UserContext from "../context/UserContext"

const UserSignOut = () => {
    // get actions from UserContext
    const { actions } = useContext(UserContext);
    // run signout action from userContext
    useEffect(() => actions.signOut());
    // this makes it so you cant go back in browser after signing out
    return <Navigate to="/" replace />
}

export default UserSignOut;