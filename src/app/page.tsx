"use client";

import { ChangeEvent, useEffect, useState } from "react";

import { Advocate } from "./types";
import { Loading } from "./components/loading";

export default function Home() {
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const defaultParams = {
    offset: 10,
    page,
    search: searchTerm,
  };

  const getParamsWithOverrides = (overrides: {}) => ({
    ...defaultParams,
    ...overrides,
  });

  const fetchData = (params = defaultParams) => {
    const { offset, page: pageParam, search } = params;
    setIsLoading(true);

    fetch(
      `/api/advocates?search=${search}&page=${pageParam}&offset=${offset}`
    ).then((response) => {
      response
        .json()
        .then((jsonResponse) => {
          setFilteredAdvocates(jsonResponse.data);
        })
        // TODO: error handling
        .finally(() => setIsLoading(false));
    });
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateSearch = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    const params = getParamsWithOverrides({
      page: 1,
      search: newSearchTerm,
    });
    fetchData(params);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateSearch(e.target.value);
  };

  const resetSearch = () => {
    // TODO: use a confirmation modal that matches the design system
    // this causes DevTools to throw a warning. It can be safely ignored.
    if (confirm("Are you sure you want to reset your search?")) {
      updateSearch("");
    }
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div className="mb-10">
        <p>Search</p>
        <p>
          Searching for: <span id="search-term">{searchTerm}</span>
        </p>
        <input
          style={{ border: "1px solid black" }}
          value={searchTerm}
          onChange={onChange}
        />
        <button onClick={resetSearch}>Reset Search</button>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <table className="w-full table-auto">
          <thead className="sticky top-0 bg-white z-10 shadow-md">
            <tr>
              <th>Name</th>
              <th>City</th>
              <th>Degree</th>
              <th>Specialties</th>
              <th>Years of Experience</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdvocates.map((advocate) => {
              return (
                <tr key={`advocate-${advocate.id}`} className="odd:bg-gray-100">
                  <td>
                    {advocate.firstName} {advocate.lastName}
                  </td>
                  <td>{advocate.city}</td>
                  <td>{advocate.degree}</td>
                  <td>
                    <ul className="list-disc pl-16">
                      {advocate.specialties.map((s) => (
                        <li key={`specialty-${s}`}>{s}</li>
                      ))}
                    </ul>
                  </td>
                  <td>{advocate.yearsOfExperience}</td>
                  <td>
                    {advocate.phoneNumber
                      .toString(10)
                      .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </main>
  );
}
