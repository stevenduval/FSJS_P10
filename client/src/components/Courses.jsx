import { useEffect, useState } from "react";
import { apiHelper } from "../utils/apiHelper";
import { Link } from "react-router-dom";

const Courses = () => {
    // state for Course Data
    const [courses, setCourses] = useState([]);

    // api call to retreive Courses
    const fetchData = async () => {
        try {
            const response = await apiHelper({ path: "/courses", method: "GET" })
            const coursesData = await response.json();
            setCourses(coursesData.courses);
        } catch (error) {
            console.log("Error:", error);
        }
    };

    // call fetchData only when component is rendered
    useEffect(() => {
        fetchData();
    }, []);

    // local CreateCourse component
    const CreateCourse = () => {
        return (
            <Link className="course--module course--add--module" href="create-course.html">
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