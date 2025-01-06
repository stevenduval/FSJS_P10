import { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../context/UserContext";

const Header = () => {
    // get authUser from userContext
    const { authUser } = useContext(UserContext);

    // local SignedIn component
    const SignedIn = () => {
        return (
            <ul className="header--signedin">
                <li>Welcome, {authUser?.firstName} {authUser?.lastName}!</li>
                <li><Link to="signout">Sign Out</Link></li>
            </ul>
        )
    }

    // local SignedOut component
    const SignedOut = () => {
        return (
            <ul className="header--signedout">
                <li>
                    <Link to="/signup">Sign Up</Link>
                </li>
                <li>
                    <Link to="/signin">Sign In</Link>
                </li>
            </ul>
        )
    }

    // return/render below content
    return (
        <header>
            <div className="wrap header--flex">
                <h1 className="header--logo">
                    <Link to="/">
                        Courses
                    </Link>
                </h1>
                <nav>
                   { authUser ? <SignedIn /> : <SignedOut />}
                </nav>
            </div>
        </header>
    )
};

export default Header;