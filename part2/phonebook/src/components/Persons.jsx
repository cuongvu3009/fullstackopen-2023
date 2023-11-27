function Persons({ persons, deletePerson }) {
  return (
    <ul>
      {Array.isArray(persons) && persons.length > 0 ? (
        persons.map(({ name, number }) => (
          <li key={name}>
            {name} : {number}
            <button onClick={() => deletePerson(name)}>Delete</button>
          </li>
        ))
      ) : (
        <li>No persons available</li>
      )}
    </ul>
  );
}

export default Persons;
