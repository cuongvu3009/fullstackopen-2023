/* eslint-disable react/prop-types */

import Content from "./Content";
import Header from "./Header";
import Total from "./Total";

const Course = ({ courses }) => {
  return (
    <div>
      {courses.map((course) => {
        return (
          <>
            <Header courses={course} />
            <Content courses={course} />
            <Total courses={course} />
          </>
        );
      })}
    </div>
  );
};

export default Course;
