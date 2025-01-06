import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../utils/apiHelper";

const Courses = () => {
    // ref for useEffect to ensure it does not execute on re-render
    const hasRunRef = useRef(false);

    // reference to useNavigate hook
    const navigate = useNavigate();

    // state for Course Data
    const [courses, setCourses] = useState([]);

    // api call to retreive Courses
    const fetchData = async () => {
        try {
            // GET all courses
            const response = await api({ path: "courses", method: "GET" });
            // if everything is as expected, await response and set course data
            if (response.status === 200) {
                const coursesData = await response.json();
                setCourses(coursesData.courses);
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
    };

    // call fetchData
    useEffect(() => {
        // using ref so we can ensure this only runs as needed
        if (!hasRunRef.current) {
            fetchData();
            hasRunRef.current = true;
        }
    }, []);

    // local CreateCourse component
    const CreateCourse = () => {
        return (
            <Link className="course--module course--add--module" to="courses/create">
                <span className="course--add--title">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 13 13" className="add" >
                        <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 " />
                    </svg>
                    New Course
                </span>
            </Link>
        )
    };

    // return/render below content
    return (
        <main>
            <div className="wrap main--grid">
                {/* map through courses data */}
                {courses.map(course => (
                    <Link key={course.id} className="course--module course--link" to={`/courses/${course.id}`} >
                        <h2 className="course--label">Course</h2>
                        <h3 className="course--title">{course.title}</h3>
                    </Link>
                ))}
                {/* local component */}
                <CreateCourse />
            </div>
        </main>
    )
};

export default Courses;