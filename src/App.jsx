import { useEffect, useMemo, useState } from "react";

import "./App.css";

function App() {
  const [data, setData] = useState();
  const [error, setError] = useState();

  const [filteredData, setFilteredData] = useState([]);
  const [activeCourses, setActiveCourses] = useState([]);
  const [activeCountries, setActiveCountries] = useState([]);

  const courses = useMemo(
    () =>
      data
        ?.reduce((acc, datum) => {
          if (!acc.includes(datum.program_name)) {
            acc.push(datum.program_name);
          }
          return acc;
        }, [])
        .sort() ?? [],
    [data],
  );

  const countries = useMemo(
    () =>
      data
        ?.reduce((acc, datum) => {
          if (!acc.includes(datum.studio_country)) {
            acc.push(datum.studio_country);
          }
          return acc;
        }, [])
        .sort() ?? [],
    [data],
  );

  useEffect(() => {
    if (data) {
      if (activeCourses.length === 0) {
        setFilteredData(
          data.filter((datum) =>
            activeCountries.includes(datum.studio_country),
          ),
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
    }
  }, [data, activeCountries, activeCourses]);

  useEffect(() => {
    let localData = localStorage.getItem("data");
    if (localData) {
      const TWELVE_HOURS = 43200;
      if (
        Math.floor(Date.now() / 1000) - JSON.parse(localData).timestamp >
        TWELVE_HOURS
      ) {
        localData = null;
      } else {
        setData(JSON.parse(localData).data);
      }
    }

    if (!localData) {
      fetch("https://www.basipilates.com/wp-json/api/search/get/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: "data[0][name]=program&data[0][value]=Teacher+Training",
      })
        .then((response) => {
          if (!response.ok) {
            setError({ message: "😿" });
          } else {
            return response.json();
          }
        })
        .then((data) => {
          if (!data[0]) return;

          setData(data[0]);
          localStorage.setItem(
            "data",
            JSON.stringify({
              timestamp: Math.floor(Date.now() / 1000),
              data: data[0],
            }),
          );
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  return (
    <>
      <header>
        <h1>BASI Pilates</h1>
        <h2>Teacher Training Courses</h2>
        <p>A very unofficial directory.</p>
      </header>

      {!data && !error && <p>Loading...</p>}
      {!!error && <p>Fail: {error.message}</p>}

      {!!data && data.length > 0 && (
        <>
          <h3>Filter by course</h3>
          <div>
            {courses.length > 0 &&
              courses.map((course) => (
                <button
                  key={toKebabCase(course)}
                  className={
                    activeCourses.includes(course) ? "active" : "inactive"
                  }
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

          <h3>Filter by country</h3>
          <div>
            {countries.length &&
              countries.map((country) => (
                <button
                  key={toKebabCase(country)}
                  className={
                    activeCountries.includes(country) ? "active" : "inactive"
                  }
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
              <a
                href={`https://www.basipilates.com/courses/${datum.friendly_id}`}
                target="_blank"
                rel="noreferrer"
              >
                See course page
              </a>
              <details>
                <summary>See raw info</summary>
                <code>
                  <pre>{JSON.stringify(cleanDatum(datum), null, 4)}</pre>
                </code>
              </details>
            </div>
          ))}
        </>
      )}
    </>
  );
}

const cleanDatum = (datum) => {
  const faculty = datum.faculty.filter((faculty) => {
    delete faculty.city;
    delete faculty.locality;
    if (faculty.deleted === false) {
      delete faculty.deleted;
    }
    delete faculty.country;
    delete faculty.postal_code;
    delete faculty.user;
    delete faculty.address;
    delete faculty.id;
    delete faculty.qualifications;
    delete faculty.title;
    if (faculty.active === true) {
      delete faculty.active;
    }

    return faculty;
  });

  return {
    modules: datum.modules
      .filter((module) => {
        const start = new Date(module.start);
        const now = new Date();
        return start >= now;
      })
      .map((module) => {
        delete module.qualifications;
        return {
          start: module.start.split("T")[0],
          end: module.end.split("T")[0],
        };
      }),
    observed_at: datum.observed_at.split("T")[0],
    faculty: faculty.length > 0 ? faculty : undefined,
  };
};

function toKebabCase(str) {
  return str
    .replace(/[^a-zA-Z0-9]/g, "-")
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase()
    .replace(/--+/g, "-");
}

export default App;
