import { createContext, useState } from "react";
import { api } from "../utils/apiHelper";

import Cookies from "js-cookie";

// create UserContext
const UserContext = createContext(null);

export const UserProvider = (props) => {
    // check if authenticatedUser Cookie exists
    const cookie = Cookies.get("authenticatedUser");

    // set authUser State, if cookie exists use that, otherwise set to null
    const [authUser, setAuthUser] = useState(cookie ? JSON.parse(cookie) : null);

    // function to execute when signIn action is requested
    const signIn = async (credentials) => {

        // GET user from database
        const response = await api({ path: "users", method: "GET", credentials });

        // if everything is ok, set authUser State and authenticatedUser Cookie, return user
        if (response.status === 200) {
            let user = await response.json();
            user = { ...user, password: credentials.password }
            setAuthUser(user);
            Cookies.set("authenticatedUser", JSON.stringify(user), { expires: 1 });
            return user;
            // if failed to validate user
        } else if (response.status === 401) {
            return null;
            // otherwise throw an error
        } else {
            throw new Error();
        }
    }

    // function to execute when signOut action is requested
    const signOut = () => {
        // clear authUser state
        setAuthUser(null);
        // remove authenticatedUser cookie
        Cookies.remove("authenticatedUser");
    }

    // return/render HOC
    return (
        <UserContext.Provider value={{
            authUser,
            actions: {
                signIn,
                signOut
            }
        }}>
            {props.children}
        </UserContext.Provider>
    )
};

export default UserContext;