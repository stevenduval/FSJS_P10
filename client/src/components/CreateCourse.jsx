import { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/apiHelper';
import UserContext from "../context/UserContext";
import ValidationErrors from './ValidationErrors';

const CreateCourse = () => {
    // reference to useNavigate hook
    const navigate = useNavigate();

    // get authUser from userContext
    const { authUser } = useContext(UserContext);
   
    // set refs for FormData
    const title = useRef(null);
    const description = useRef(null);
    const estimatedTime = useRef(null);
    const materialsNeeded = useRef(null);

    // state for errors
    const [errors, setErrors] = useState([]);

    // function to execute when submit button is clicked
    const handleSubmit = async (event) => {
        // prevent form from redirecting
        event.preventDefault();

        // body object to send in POST request
        const body = {
            title: title.current.value,
            description: description.current.value,
            estimatedTime: estimatedTime.current.value,
            materialsNeeded: materialsNeeded.current.value,
            userId: authUser.id
        }

        try {
            // POST new course
            const response = await api({ path: 'courses', method: 'POST', body, credentials: authUser });
            // if everything is as expected, redirect to location given via response header
            if (response.status === 201) {
                navigate(response.headers.get('Location'), { replace: true });
            // if validation error, await response and set errors    
            } else if (response.status === 400) {
                const data = await response.json();
                setErrors(data.errors);
            // otherwise send to error route
            } else {
                navigate("/error", { replace: true })
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
                <h2>Create Course</h2>
                <ValidationErrors errors={errors} />
                <form onSubmit={handleSubmit}>
                    <div className="main--flex">
                        <div>
                            <label htmlFor="courseTitle">Course Title</label>
                            <input id="courseTitle" name="courseTitle" type="text" defaultValue="" ref={title} />
                            <p>By {authUser?.firstName} {authUser?.lastName}</p>
                            <label htmlFor="courseDescription">Course Description</label>
                            <textarea id="courseDescription" name="courseDescription" defaultValue="" ref={description} />
                        </div>
                        <div>
                            <label htmlFor="estimatedTime">Estimated Time</label>
                            <input id="estimatedTime" name="estimatedTime" type="text" defaultValue="" ref={estimatedTime} />
                            <label htmlFor="materialsNeeded">Materials Needed</label>
                            <textarea id="materialsNeeded" name="materialsNeeded" defaultValue="" ref={materialsNeeded} />
                        </div>
                    </div>
                    <button className="button" type="submit">
                        Create Course
                    </button>
                    <button className="button button-secondary" onClick={handleCancel}>
                        Cancel
                    </button>
                </form>
            </div>
        </main>
    )
}

export default CreateCourse;