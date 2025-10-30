import React, { useContext, useEffect, useRef } from "react";
import UserDetailContext from "../context/UserDetailContext";
import { useQuery } from "react-query";
import { useAuth } from "../context/AuthContext";
import { getUserFavorites } from "../utils/directFirebase";

const useFavourites = () => {
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const queryRef = useRef();
  const { currentUser: user } = useAuth();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: "allFavourites",
    queryFn: () => getUserFavorites(),
    onSuccess: (data) =>
      setUserDetails((prev) => ({ ...prev, favourites: data })),
    enabled: user !== undefined,
    staleTime: 30000,
  });

  queryRef.current = refetch;

  useEffect(() => {
    queryRef.current && queryRef.current();
  }, [userDetails?.token]);

  return { data, isError, isLoading, refetch };
};

export default useFavourites;
