import React, { useContext, useEffect } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UserDetailContext from "../../context/UserDetailContext";
import { createUserProfileDirect } from "../../utils/directFirebase";
import useFavourites from "../../hooks/useFavourites";
import useBookings from "../../hooks/useBookings";

const Layout = () => {
  useFavourites();
  useBookings();

  const { currentUser: user } = useAuth();
  const { setUserDetails } = useContext(UserDetailContext);

  useEffect(() => {
    if (user) {
      // Set user details for the app (don't override the role)
      setUserDetails({
        favourites: [],
        bookings: [],
        token: user.uid, // Use Firebase UID as token
        user: {
          name: user.displayName || user.email,
          email: user.email,
          picture: user.photoURL || "https://via.placeholder.com/40"
        }
      });
    }
  }, [user, setUserDetails]);

  return (
    <>
      <div style={{ background: "var(--black)", overflow: "hidden" }}>
        <Header />
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Layout;