/* eslint-disable react/prop-types */

const Total = (props) => {
  return (
    <p>
      <strong>Number of Exercises: </strong>
      {props.courses.parts.reduce(
        (accumulator, current) => accumulator + current.exercises,
        0
      )}
    </p>
  );
};

export default Total;
