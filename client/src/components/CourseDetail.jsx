import { useEffect, useState } from "react";
import { apiHelper } from "../utils/apiHelper";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

const CourseDetail = () => {
    // descruture id from URL as courseId
    let { id: courseId } = useParams();

    // state for Course Data
    const [course, setCourse] = useState([]);

    // destructuring course variables
    const { title, description, estimatedTime, materialsNeeded } = course;

    // api call to retreive Courses
    const fetchData = async () => {
        try {
            const response = await apiHelper({ path: `/courses/${courseId}`, method: "GET" })
            const courseData = await response.json();
            setCourse(courseData.courses[0]);
        } catch (error) {
            console.log("Error:", error);
        }
    };

    // call fetchData only when component is rendered
    useEffect(() => {
        fetchData();
    }, []);

    // local Description component
    const Description = () => {
        return (
            description ?  description.split(/\n\n/).map((desc, index) => <p key={index}>{desc}</p>) : null
        )
    };
   
    // local EstimatedTime component
    const EstimatedTime = () => {
        return (
            <>
                <h3 className="course--detail--title">Estimated Time</h3>
                { estimatedTime ? <p>{ estimatedTime }</p> : null }
            </>
        )
    };

    // local MaterialsNeeded component
    const MaterialsNeeded = () => {
        return (
            <>
                <h3 className="course--detail--title">Materials Needed</h3>
                {materialsNeeded ? (
                    <ul className="course--detail--list" key={courseId}>
                        {materialsNeeded.replaceAll("* ", "").split(/\n/).flatMap((material, index) => material && material ? <li key={index}>{material}</li> : [])}
                    </ul>
                ) : null}
            </>
        )
    };

    // return/render below content
    return (
        <main>
            <div className="actions--bar">
                <div className="wrap">
                    <Link className="button" to={`/courses/${courseId}/update`}>
                        Update Course
                    </Link>
                    <Link className="button" to="#">
                        Delete Course
                    </Link>
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