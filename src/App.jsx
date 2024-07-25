import { useEffect, useState } from "react";
import allData from "./assets/data.json";

import "./App.css";

const data = allData["0"];

const courses = data
  .reduce((acc, datum) => {
    if (!acc.includes(datum.program_name)) {
      acc.push(datum.program_name);
    }
    return acc;
  }, [])
  .sort();

const countries = data
  .reduce((acc, datum) => {
    if (!acc.includes(datum.studio_country)) {
      acc.push(datum.studio_country);
    }
    return acc;
  }, [])
  .sort();

function App() {
  const [filteredData, setFilteredData] = useState(data);
  const [activeCourses, setActiveCourses] = useState([]);
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
      <h1>BASI Teacher Training Courses</h1>
      <h2>Filter by course</h2>
      <div className="card">
        {courses.map((course) => (
          <button
            key={course}
            className={activeCourses.includes(course) ? "active" : undefined}
            onClick={() =>
              setActiveCourses(
                activeCourses.includes(course)
                  ? activeCourses.filter((c) => c !== course)
                  : [...activeCourses, course],
              )
            }
          >
            {course}
          </button>
        ))}
      </div>

      <h2>Filter by country</h2>
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
    </>
  );
}

export default App;
