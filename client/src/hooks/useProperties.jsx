import React from "react";
import { useQuery } from "react-query";
import { getPropertiesDirect } from "../utils/directFirebase";

const useProperties = () => {
  const { data, isLoading, isError, refetch } = useQuery(
    "allProperties",
    getPropertiesDirect,
    { refetchOnWindowFocus: false, retry: 0 }
  );

  return {
    data,
    isError,
    isLoading,
    refetch,
  };
};

export default useProperties;
