import { useContext, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import UserContext from "../context/UserContext";
import ValidationErrors from "./ValidationErrors";

const UserSignIn = () => {
    // reference to useNavigate hook
    const navigate = useNavigate();

    // reference to useLocation hook
    const location = useLocation();

    // get actions from User Context
    const { actions } = useContext(UserContext);

    // set refs for FormData
    const emailAddress = useRef(null);
    const password = useRef(null);

    // state for Errors
    const [errors, setErrors] = useState([]);

    // function to execute when form is submitted
    const handleSubmit = async (event) => {
        // prevent form from redirecting
        event.preventDefault();

        // set from location to use after user is signed in
        let from = location.state.from || "/";

        // credentials to validate user
        const credentials = {
            emailAddress: emailAddress.current.value,
            password: password.current.value
        }

        try {
            // use signIn action from userContext to validate user
            const user = await actions.signIn(credentials);
            // if user is validated navigate to from location defined above
            if (user) {
                navigate(from, { replace: true });
            // otherwise set error as sign is was not successful
            } else {
                setErrors(["Sign-in was unsuccessful"]);
            }
        } catch (error) {
            // if any other error, log and send to error route
            console.log("Error:", error);
            navigate("/error", { replace: true });
        }
    }

    // function to execite when cancel button is clicked
    const handleCancel = (event) => {
        // prevent form from redirecting
        event.preventDefault();
        // navigate to home page
        navigate("/", { replace: true });
    }

    // return/render below content
    return (
        <main>
            <div className="form--centered">
                <h2>Sign In</h2>
                <ValidationErrors errors={errors} />
                <form onSubmit={handleSubmit}>
                    <label htmlFor="emailAddress">Email Address</label>
                    <input id="emailAddress" name="emailAddress" type="email" defaultValue="" ref={emailAddress} />
                    <label htmlFor="password">Password</label>
                    <input id="password" name="password" type="password" defaultValue="" ref={password} />
                    <button className="button" type="submit">
                        Sign In
                    </button>
                    <button className="button button-secondary" onClick={handleCancel} >
                        Cancel
                    </button>
                </form>
                <p>
                    Don&apos;t have a user account? Click here to <Link to="/signup">sign up</Link>!
                </p>
            </div>
        </main>
    )
}

export default UserSignIn;