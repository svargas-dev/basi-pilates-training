import { useEffect, useState } from "react";
import allData from "./assets/data.json";

import "./App.css";

const data = allData["0"].filter(
  (datum) =>
    datum.program_name.toLowerCase().includes("comprehensive global") &&
    datum.program_type === "Teacher Training" &&
    datum.studio_country !== "United States of America" &&
    datum.studio_country !== "Russian Federation",
);

const countries = data.reduce((acc, datum) => {
  if (!acc.includes(datum.studio_country)) {
    acc.push(datum.studio_country);
  }
  return acc;
}, []);

function App() {
  const [filteredData, setFilteredData] = useState(data);
  const [activeCountries, setActiveCountries] = useState([]);

  const handleClick = (country) => {
    if (activeCountries.includes(country)) {
      setActiveCountries(activeCountries.filter((c) => c !== country));
    } else {
      setActiveCountries([...activeCountries, country]);
    }
  };

  useEffect(() => {
    setFilteredData(
      data.filter((datum) => activeCountries.includes(datum.studio_country)),
    );
  }, [activeCountries]);

  return (
    <>
      <h1>Basi Training</h1>
      <div className="card">
        {countries.map((country) => (
          <button
            key={country}
            className={activeCountries.includes(country) ? "active" : undefined}
            onClick={() => handleClick(country)}
          >
            {country}
          </button>
        ))}
      </div>
      <h2>Number of studios: {filteredData.length}</h2>

      {filteredData.map((datum) => (
        <div key={datum.studio_name} className="card">
          <h3>{datum.studio_name}</h3>
          <p>{datum.studio_city}</p>
          <p>{datum.studio_country}</p>
          <details>
            <summary>See all info</summary>
            <code>
              <pre>{JSON.stringify(datum, null, 4)}</pre>
            </code>
          </details>
        </div>
      ))}

      {/* <code> */}
      {/*   <pre> {JSON.stringify(filteredData, null, 4)}</pre> */}
      {/* </code> */}
    </>
  );
}

export default App;
