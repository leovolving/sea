import { useEffect, useRef, useState } from "react";

import { Advocate } from "../types";

const DEBOUNCE_TIMEOUT = 300;

export const useAdvocateSearchData = () => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [count, setCount] = useState(0);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const clearExistingTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const defaultParams = {
    offset: 10,
    page,
    search: searchTerm,
  };

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
          setCount(jsonResponse.count);
        })
        // TODO: error handling
        .finally(() => setIsLoading(false));
    });
  };

  const getParamsWithOverrides = (overrides: {}) => ({
    ...defaultParams,
    ...overrides,
  });

  const updatePage = (newPage: number) => {
    setPage(newPage);
    const params = getParamsWithOverrides({
      page: newPage,
    });
    fetchData(params);
  };

  const fetchDataWithNewSearchParams = (newSearchTerm: string) => {
    const params = getParamsWithOverrides({
      page: 1,
      search: newSearchTerm,
    });
    fetchData(params);
  };

  const updateSearch = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    clearExistingTimeout();

    // debounce only if there is a search term
    // if we are clearing the search, we want to run that immediately
    if (searchTerm) {
      timeoutRef.current = setTimeout(() => {
        fetchDataWithNewSearchParams(newSearchTerm);
      }, DEBOUNCE_TIMEOUT);
    } else {
      fetchDataWithNewSearchParams(newSearchTerm);
    }
  };

  useEffect(() => {
    fetchData();

    return clearExistingTimeout;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    count,
    filteredAdvocates,
    isLoading,
    page,
    searchTerm,
    updatePage,
    updateSearch,
  };
};
