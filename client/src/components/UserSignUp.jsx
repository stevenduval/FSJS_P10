import { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../utils/apiHelper";
import UserContext from "../context/UserContext";
import ValidationErrors from "./ValidationErrors";

const UserSignUp = () => {
    // reference to useNavigate hook
    const navigate = useNavigate();

    // get actions from User Context
    const { actions } = useContext(UserContext);

    // set refs for FormData
    const firstName = useRef(null);
    const lastName = useRef(null);
    const emailAddress = useRef(null);
    const password = useRef(null);

    // state for Errors
    const [errors, setErrors] = useState([]);

    // function to run when form is submitted
    const handleSubmit = async (event) => {
        // prevent form from redirecting
        event.preventDefault();

        // body to send as part of POST Request
        const body = {
            firstName: firstName.current.value,
            lastName: lastName.current.value,
            emailAddress: emailAddress.current.value,
            password: password.current.value
        }

        try {
            // POST/create new user
            const response = await api({ path: "users", method: "POST", body });
            // if everything is as expected
            if (response.status === 201) {
                // sign the user in via User Context signIn action
                await actions.signIn({ emailAddress: body.emailAddress, password: body.password });
                // navigate to home page 
                navigate("/", { replace: true })
            // if validation error, await response and set errors 
            } else if (response.status === 400) {
                const data = await response.json();
                setErrors(data.errors);
            // otherwise send to error route
            } else {
                navigate("/error", { replace: true });
            }
        } catch (error) {
            // if any other error, log and send to error route
            console.log("Error:", error);
            navigate("/error", { replace: true });;
        }
    }

    // function to execute when cancel button is clicked
    const handleCancel = (event) => {
        // prevent form from redirecting
        event.preventDefault();
        // navigate to home page
        navigate("/", { replace: true })
    }

    // return/render below content
    return (
        <main>
            <div className="form--centered">
                <h2>Sign Up</h2>
                <ValidationErrors errors={errors} />
                <form onSubmit={handleSubmit}>
                    <label htmlFor="firstName">First Name</label>
                    <input id="firstName" name="firstName" type="text" defaultValue="" ref={firstName} />
                    <label htmlFor="lastName">Last Name</label>
                    <input id="lastName" name="lastName" type="text" defaultValue="" ref={lastName} />
                    <label htmlFor="emailAddress">Email Address</label>
                    <input id="emailAddress" name="emailAddress" type="email" defaultValue="" ref={emailAddress} />
                    <label htmlFor="password">Password</label>
                    <input id="password" name="password" type="password" defaultValue="" ref={password} />
                    <button className="button" type="submit">
                        Sign Up
                    </button>
                    <button className="button button-secondary" onClick={handleCancel}>
                        Cancel
                    </button>
                </form>
                <p>
                    Already have a user account? Click here to <Link to="/signin">sign in</Link>!
                </p>
            </div>
        </main>
    )
}

export default UserSignUp;