import { useEffect, useState } from "react";

import { Advocate } from "../types";

export const useAdvocateSearchData = () => {
  const [count, setCount] = useState(0);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const updateSearch = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    const params = getParamsWithOverrides({
      page: 1,
      search: newSearchTerm,
    });
    fetchData(params);
  };

  useEffect(() => {
    fetchData();
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
