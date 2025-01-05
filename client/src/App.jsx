import { Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import Courses from "./components/Courses";
import CourseDetail from "./components/CourseDetail";

const App = () => {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<Courses />}/>
                <Route path="/courses/:id" element={<CourseDetail />}/>
            </Routes>
        </>
    )
};

export default App;