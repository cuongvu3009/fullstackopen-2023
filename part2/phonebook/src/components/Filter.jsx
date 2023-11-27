function Filter({ persons, search, setSearch }) {
  const filteredPersons = Array.isArray(persons)
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <>
      Filter shown with:{" "}
      <input
        type="search"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
      />
      <ul>
        {search &&
          filteredPersons.map(({ name, number }) => (
            <li key={name}>
              {name} : {number}
            </li>
          ))}
      </ul>
    </>
  );
}

export default Filter;
