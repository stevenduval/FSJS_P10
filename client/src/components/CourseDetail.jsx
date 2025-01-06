import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../utils/apiHelper";
import UserContext from "../context/UserContext";
import Markdown from "react-markdown"

const CourseDetail = () => {
    // ref for useEffect to ensure it does not execute on re-render
    const hasRunRef = useRef(false);

    // reference to useNavigate hook
    const navigate = useNavigate();

    // get authUser from userContext
    const { authUser } = useContext(UserContext);

    // state for Course Data
    const [course, setCourse] = useState([]);

    // descruture id from URL as courseId
    let { id: courseId } = useParams();

    // destructuring course variables
    const { userId, title, description, estimatedTime, materialsNeeded } = course;

    // api call to retreive Current Course
    const fetchData = async () => {
        try {
            // GET course info for the current course we are on
            const response = await api({ path: `courses/${courseId}`, method: "GET" });
            // if everything is as expected, await response and set course data
            if (response.status === 200) {
                const courseData = await response.json();
                setCourse(courseData.courses[0]);
            }
            // if not found, send to not found route
            else if (response.status === 404) {
                navigate("/notfound", { replace: true });
            // otherwise send to error route
            } else {
                navigate("/error", { replace: true });
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

    // function to run when delete button is clicked
    const handleDelete = async () => {
        try {
            // DELETE current course are on
            const response = await api({ path: `courses/${courseId}`, method: "DELETE", credentials: authUser });
            // if everything is ok, route user to home once DELETE has occured
            if (response.status === 204) {
                navigate("/", { replace: true });
            // if not found, send to not found route
            } else if (response.status === 404) {
                navigate("/notfound", { replace: true });
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

    // local UpdateDeleteButtons component
    const UpdateDeleteButtons = () => {
        return (
            authUser?.id == userId ? (
                <>
                    <Link className="button" to={`/courses/${courseId}/update`}>
                        Update Course
                    </Link>
                    <Link className="button" to="#" onClick={handleDelete}>
                        Delete Course
                    </Link>
                </>
            ) : null
        )
    }

    // local Description component
    const Description = () => {
        return (
            description ? <Markdown>{description}</Markdown> : null
        )
    };

    // local EstimatedTime component
    const EstimatedTime = () => {
        return (
            <>
                <h3 className="course--detail--title">Estimated Time</h3>
                {estimatedTime ? <p>{estimatedTime}</p> : null}
            </>
        )
    };

    // local MaterialsNeeded component
    const MaterialsNeeded = () => {
        return (
            <>
                <h3 className="course--detail--title">Materials Needed</h3>
                {materialsNeeded ? (
                    <Markdown components={{
                        ul: ({ node, ...props }) => <ul className="course--detail--list" {...props} />
                    }}>{materialsNeeded}</Markdown>
                ) : null}
            </>
        )
    };

    // return/render below content
    return (
        <main>
            <div className="actions--bar">
                <div className="wrap">
                    <UpdateDeleteButtons />
                    <Link className="button button-secondary" to="/">
                        Return to List
                    </Link>
                </div>
            </div>
            <div className="wrap">
                <h2>Course Detail</h2>
                <form>
                    <div className="main--flex">
                        <div>
                            <h3 className="course--detail--title">Course</h3>
                            <h4 className="course--name">{title}</h4>
                            <p>By {course.User?.firstName} {course.User?.lastName}</p>
                            <Description />
                        </div>
                        <div>
                            <EstimatedTime />
                            <MaterialsNeeded />
                        </div>
                    </div>
                </form>
            </div>
        </main>

    )
};

export default CourseDetail;