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

  useEffect(() => {
    if (activeCourses.length === 0) {
      setFilteredData(
        data.filter((datum) => activeCountries.includes(datum.studio_country)),
      );
    }
    if (activeCountries.length === 0) {
      setFilteredData(
        data
          .filter((datum) => activeCourses.includes(datum.program_name))
          .sort((a, b) => (a.studio_country < b.studio_country ? -1 : 1)),
      );
    }
    if (activeCourses.length > 0 && activeCountries.length > 0) {
      setFilteredData(
        data
          .filter(
            (datum) =>
              activeCourses.includes(datum.program_name) &&
              activeCountries.includes(datum.studio_country),
          )
          .sort((a, b) => (a.studio_country < b.studio_country ? -1 : 1)),
      );
    }
  }, [activeCountries, activeCourses]);

  return (
    <>
      <h1>BASI Pilates Teacher Training Courses</h1>

      <p>
        This is an unofficial directory of BASI teacher training studios. This
        may be outdated. Data retrieved 26 July 2024.
      </p>
      <h2>Filter by course</h2>
      <div>
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
      <div>
        {countries.map((country) => (
          <button
            key={country}
            className={activeCountries.includes(country) ? "active" : undefined}
            onClick={() =>
              setActiveCountries(
                activeCountries.includes(country)
                  ? activeCountries.filter((c) => c !== country)
                  : [...activeCountries, country],
              )
            }
          >
            {country}
          </button>
        ))}
      </div>
      <h2>Number of studios: {filteredData.length}</h2>

      {filteredData.map((datum) => (
        <div key={datum.course_id} className="card">
          <h3>{datum.studio_name}</h3>
          <p>
            <em>{datum.program_name}</em>
          </p>
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
