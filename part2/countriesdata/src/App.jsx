import { useEffect, useState } from "react";

import Results from "./components/Results";
import axios from "axios";

const BASE_URL = "https://restcountries.com/v3.1/all";

function App() {
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [allCountriesData, setCountriesData] = useState([]);

  useEffect(() => {
    axios.get(BASE_URL).then((response) => {
      setCountriesData(response.data);
    });
  }, []);

  useEffect(() => {
    setFilteredData(
      allCountriesData.filter((country) =>
        country.name.common.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [allCountriesData, search]);

  return (
    <div className="App">
      Find Countries:{" "}
      <input
        type="search"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
      />
      <Results filteredData={filteredData} search={search} />
    </div>
  );
}

export default App;
