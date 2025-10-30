import { Suspense, useState } from "react";
import "./App.css";
import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Website from "./pages/Website";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Properties from "./pages/Properties/Properties";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Property from "./pages/Property/Property";
import UserDetailContext from "./context/UserDetailContext";
import Bookings from "./pages/Bookings/Bookings";
import Favourites from "./pages/Favourites/Favourites";
import { AuthProvider } from "./context/AuthContext";
import OwnerDashboard from "./pages/OwnerDashboard/OwnerDashboard";
import UserDashboard from "./pages/UserDashboard/UserDashboard";

function App() {
  const queryClient = new QueryClient();

  const [userDetails, setUserDetails] = useState({
    favourites: [],
    bookings: [],
    token: null,
  });

  return (
    <AuthProvider>
      <UserDetailContext.Provider value={{ userDetails, setUserDetails }}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Website />} />
                  <Route path="/properties">
                    <Route index element={<Properties />} />
                    <Route path=":propertyId" element={<Property />} />
                  </Route>
                  <Route path="/bookings" element={
                    <ProtectedRoute>
                      <Bookings />
                    </ProtectedRoute>
                  } />
                  <Route path="/favourites" element={
                    <ProtectedRoute>
                      <Favourites />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard/user" element={
                    <ProtectedRoute>
                      <UserDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard/owner" element={
                    <ProtectedRoute>
                      <OwnerDashboard />
                    </ProtectedRoute>
                  } />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
          <ToastContainer />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </UserDetailContext.Provider>
    </AuthProvider>
  );
}

export default App;
