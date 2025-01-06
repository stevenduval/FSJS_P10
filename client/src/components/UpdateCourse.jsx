import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../utils/apiHelper";
import UserContext from "../context/UserContext";
import ValidationErrors from "./ValidationErrors";

const UpdateCourse = () => {
    // ref for useEffect to ensure it does not execute on re-render
    const hasRunRef = useRef(false);

    // reference to useNavigate hook
    const navigate = useNavigate();

    // get authorized user data from User Context
    const { authUser } = useContext(UserContext);

    // descruture id from URL as courseId
    let { id: courseId } = useParams();

    // set refs for FormData
    const titleUpdate = useRef(null);
    const descriptionUpdate = useRef(null);
    const estimatedTimeUpdate = useRef(null);
    const materialsNeededUpdate = useRef(null);

    // state for Course Data
    const [course, setCourse] = useState([]);

    // state for Errors
    const [errors, setErrors] = useState([]);

    // destructuring course variables
    const { title, description, estimatedTime, materialsNeeded } = course;

    // api call to retreive Courses
    const fetchData = async () => {
        try {
            // GET course info for the current course we are on
            const response = await api({ path: `courses/${courseId}`, method: "GET" });
            // if everything is as expected, await response
            if (response.status === 200) {
                const courseData = await response.json();
                // check that current user is allowed to update, if not redirect to forbidden path
                if (authUser?.id !== courseData.courses[0].userId) { navigate("/forbidden", { replace: true }); }
                // set course data
                setCourse(courseData.courses[0]);
            // if not found, send to not found route
            } else if (response.status === 404) {
                navigate("/notfound", { replace: true });
            // otherwise send to error route
            } else {
                navigate("/error", { replace: true })
            }
        } catch (error) {
            // if any other error, log and send to error route
            console.log("Error:", error);
            navigate("/error", { replace: true });
        }
    };

    // call fetchData
    useEffect(() => {
        // using ref so we can ensure this only runs as needed
        if (!hasRunRef.current) {
            fetchData();
            hasRunRef.current = true;
        }
    }, []);

    // function to execute when form is submitted
    const handleSubmit = async (event) => {
        // prevent form from redirecting
        event.preventDefault();

        // body object to send in PUT request
        const body = {
            title: titleUpdate.current.value,
            description: descriptionUpdate.current.value,
            estimatedTime: estimatedTimeUpdate.current.value,
            materialsNeeded: materialsNeededUpdate.current.value,
            userId: authUser.id
        }

        try {
            // PUT/update course
            const response = await api({ path: `courses/${courseId}`, method: "PUT", body, credentials: authUser });
            // if everything is as expected, redirect to course that was updated
            if (response.status === 204) {
                navigate(`/courses/${courseId}`, { replace: true });
            // if validation error, await response and set errors 
            } else if (response.status === 400) {
                const data = await response.json();
                setErrors(data.errors);
            // if forbidden to update, redirect to forbidden path
            } else if (response.status === 403) {
                navigate("/forbidden", { replace: true });
            // otherwise send to error route
            } else {
                navigate("/error", { replace: true });
            }
        } catch (error) {
            // if any other error, log and send to error route
            console.log("Error:", error);
            navigate("/error", { replace: true });
        }
    }

    // function to execute when cancel button is clicked
    const handleCancel = (event) => {
        // prevent form from redirecting
        event.preventDefault();
        // navigate to home page
        navigate("/", { replace: true });
    }

    // return/render below content
    return (
        <main>
            <div className="wrap">
                <h2>Update Course</h2>
                <ValidationErrors errors={errors} />
                <form onSubmit={handleSubmit}>
                    <div className="main--flex">
                        <div>
                            <label htmlFor="courseTitle">Course Title</label>
                            <input id="courseTitle" name="courseTitle" type="text" defaultValue={title} ref={titleUpdate} />
                            <p>By {course.User?.firstName} {course.User?.lastName}</p>
                            <label htmlFor="courseDescription">Course Description</label>
                            <textarea id="courseDescription" name="courseDescription" defaultValue={description} ref={descriptionUpdate} />
                        </div>
                        <div>
                            <label htmlFor="estimatedTime">Estimated Time</label>
                            <input id="estimatedTime" name="estimatedTime" type="text" defaultValue={estimatedTime} ref={estimatedTimeUpdate} />
                            <label htmlFor="materialsNeeded">Materials Needed</label>
                            <textarea id="materialsNeeded" name="materialsNeeded" defaultValue={materialsNeeded} ref={materialsNeededUpdate} />
                        </div>
                    </div>
                    <button className="button" type="submit">
                        Update Course
                    </button>
                    <button className="button button-secondary" onClick={handleCancel}>
                        Cancel
                    </button>
                </form>
            </div>
        </main>
    )
}

export default UpdateCourse;