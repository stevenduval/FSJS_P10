import { Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import Courses from "./components/Courses";
import CourseDetail from "./components/CourseDetail";
import UserSignIn from "./components/UserSignIn";
import UserSignUp from "./components/UserSignUp";
import UserSignOut from "./components/UserSignOut";
import CreateCourse from "./components/CreateCourse";
import UpdateCourse from "./components/UpdateCourse";
import PrivateRoute from "./components/PrivateRoute";
import NotFound from "./components/NotFound";
import Forbidden from "./components/Forbidden";
import UnhandledError from "./components/UnHandledError";

const App = () => {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={ <Courses /> } />
                <Route path="courses/:id" element={ <CourseDetail /> } />
                <Route path="signin" element={ <UserSignIn /> } />
                <Route path="signup" element={ <UserSignUp /> } />
                <Route path="signout" element={ <UserSignOut /> } />
                <Route element={ <PrivateRoute /> } >
                    <Route path="courses/create" element={ <CreateCourse /> } />
                    <Route path="courses/:id/update" element={ <UpdateCourse /> } />
                </Route>
                <Route path="forbidden" element={ <Forbidden /> } />
                <Route path="error" element={ <UnhandledError/>} />
                <Route path="*" element={ <NotFound /> } />
            </Routes>
        </>
    )
};

export default App;