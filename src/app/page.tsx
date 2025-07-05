"use client";

import { ChangeEvent, useEffect, useState } from "react";

import { Advocate } from "./types";
import { Loading } from "./components/loading";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    console.log("fetching advocates...");
    fetch("/api/advocates").then((response) => {
      response
        .json()
        .then((jsonResponse) => {
          setAdvocates(jsonResponse.data);
          setFilteredAdvocates(jsonResponse.data);
        })
        // TODO: error handling
        .finally(() => setIsLoading(false));
    });
  }, []);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newSearchTermInput = e.target.value;
    setSearchTerm(newSearchTermInput);

    console.log("filtering advocates...");
    const filteredAdvocates = advocates.filter((advocate) => {
      return (
        advocate.firstName.includes(newSearchTermInput) ||
        advocate.lastName.includes(newSearchTermInput) ||
        advocate.city.includes(newSearchTermInput) ||
        advocate.degree.includes(newSearchTermInput) ||
        advocate.specialties.includes(newSearchTermInput) ||
        advocate.yearsOfExperience === +newSearchTermInput
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const resetSearch = () => {
    // TODO: use a confirmation modal that matches the design system
    // this causes DevTools to throw a warning. It can be safely ignored.
    if (confirm("Are you sure you want to reset your search?")) {
      setFilteredAdvocates(advocates);
      setSearchTerm("");
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
