import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { getUserBookings, getUserFavorites, getPropertiesDirect, addBookingDirect } from "../../utils/directFirebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  HomeIcon,
  HeartIcon,
  CalendarDaysIcon,
  EyeIcon,
  XMarkIcon,
  MapPinIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/outline";
import "./UserDashboard.css";

const UserDashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [favoriteProperties, setFavoriteProperties] = useState([]);
  const [recentProperties, setRecentProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("browse");

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
      return;
    }

    if (userProfile?.role !== "user") {
      navigate("/dashboard/owner");
      return;
    }

    loadUserData();
  }, [currentUser, userProfile]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Load bookings
      const userBookings = await getUserBookings();
      setBookings(userBookings);

      // Load favorites
      const userFavorites = await getUserFavorites();
      setFavorites(userFavorites);

      // Load all properties
      const allProperties = await getPropertiesDirect();
      
      // Load favorite properties details
      if (userFavorites.length > 0) {
        const favoriteProps = allProperties.filter(prop => 
          userFavorites.includes(prop.id)
        );
        setFavoriteProperties(favoriteProps);
      }
      
      // Load recent properties (last 6)
      setRecentProperties(allProperties.slice(0, 6));
    } catch (error) {
      console.error("Error loading user data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (propertyId) => {
    try {
      // For now, just remove from local state
      setBookings(bookings.filter(booking => booking.propertyId !== propertyId));
      toast.success("Booking cancelled!");
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  const handleBookProperty = async (propertyId, propertyTitle, property) => {
    try {
      // Check if user is the owner of this property
      if (property.ownerId === currentUser.uid) {
        toast.error("You cannot book a visit to your own property");
        return;
      }

      const booking = {
        propertyId,
        propertyTitle,
        date: new Date().toLocaleDateString(),
        status: "pending",
        createdAt: new Date()
      };
      
      const success = await addBookingDirect(currentUser.uid, booking);
      if (success) {
        setBookings([...bookings, booking]);
        toast.success("Property visit booked successfully!");
      }
    } catch (error) {
      console.error("Error booking property:", error);
    }
  };

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    }
    return `₹${price?.toLocaleString()}`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case "pending":
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      default:
        return <ExclamationCircleIcon className="w-5 h-5 text-red-500" />;
    }
  };

  if (!currentUser || loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 bg-primary-500 rounded-full animate-bounce"></div>
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Loading Dashboard</h3>
          <p className="text-neutral-600">Getting your personalized data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="page-container py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                Welcome back, {userProfile?.name || currentUser?.email?.split('@')[0] || "User"}! 👋
              </h1>
              <p className="text-neutral-600 text-lg">
                Manage your property interests and bookings
              </p>
            </div>
            <div className="hidden lg:flex items-center space-x-6 text-center">
              <div className="bg-primary-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-primary-600">{bookings.length}</div>
                <div className="text-sm text-neutral-600">Active Bookings</div>
              </div>
              <div className="bg-secondary-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-secondary-600">{favorites.length}</div>
                <div className="text-sm text-neutral-600">Favorites</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-neutral-200">
        <div className="page-container">
          <nav className="flex space-x-8">
            {[
              { id: "browse", label: "Browse Properties", icon: HomeIcon },
              { id: "bookings", label: `My Bookings (${bookings.length})`, icon: CalendarDaysIcon },
              { id: "favorites", label: `Favorites (${favorites.length})`, icon: HeartIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="page-container py-8">
        {/* Browse Properties Tab */}
        {activeTab === "browse" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-neutral-900">Available Properties</h2>
              <button
                onClick={() => navigate("/properties")}
                className="btn-primary"
              >
                View All Properties
              </button>
            </div>
            
            {recentProperties.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-card border border-neutral-200 p-12 text-center">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HomeIcon className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Properties Available</h3>
                <p className="text-neutral-600 mb-6">Check back later for new listings</p>
                <button
                  onClick={() => navigate("/properties")}
                  className="btn-primary"
                >
                  Browse All Properties
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentProperties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-card border border-neutral-200 overflow-hidden hover:shadow-floating transition-shadow duration-300"
                  >
                    <div className="relative">
                      <img 
                        src={property.image || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500"} 
                        alt={property.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 bg-primary-500/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                          Available
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <BanknotesIcon className="w-5 h-5 text-secondary-500" />
                          <span className="text-xl font-bold text-neutral-900">
                            {formatPrice(property.price)}
                          </span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-1">
                        {property.title}
                      </h3>
                      
                      <div className="flex items-center space-x-2 text-neutral-600 mb-4">
                        <MapPinIcon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm line-clamp-1">
                          {property.address}, {property.city}
                        </span>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={() => navigate(`/properties/${property.id}`)}
                          className="flex-1 btn-outline text-sm py-2"
                        >
                          <EyeIcon className="w-4 h-4 mr-2" />
                          View Details
                        </button>
                        {property.ownerId === currentUser?.uid ? (
                          <button
                            onClick={() => navigate("/dashboard/owner")}
                            className="flex-1 btn-primary text-sm py-2"
                          >
                            Manage Property
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBookProperty(property.id, property.title, property)}
                            className="flex-1 btn-primary text-sm py-2"
                          >
                            Book Visit
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-neutral-900 mb-8">My Property Visit Bookings</h2>
            
            {bookings.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-card border border-neutral-200 p-12 text-center">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarDaysIcon className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Bookings Yet</h3>
                <p className="text-neutral-600 mb-6">Start browsing properties to book a visit!</p>
                <button
                  onClick={() => navigate("/properties")}
                  className="btn-primary"
                >
                  Browse Properties
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.map((booking, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-card border border-neutral-200 p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(booking.status)}
                        <span className={`text-sm font-medium capitalize ${
                          booking.status === "confirmed" ? "text-green-600" :
                          booking.status === "pending" ? "text-yellow-600" : "text-red-600"
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCancelBooking(booking.propertyId)}
                        className="text-neutral-400 hover:text-red-500 transition-colors duration-200"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-2">
                      {booking.propertyTitle}
                    </h3>
                    
                    <div className="flex items-center space-x-2 text-neutral-600 mb-4">
                      <CalendarDaysIcon className="w-4 h-4" />
                      <span className="text-sm">Visit Date: {booking.date}</span>
                    </div>
                    
                    <button
                      onClick={() => navigate(`/properties/${booking.propertyId}`)}
                      className="w-full btn-outline text-sm py-2"
                    >
                      <EyeIcon className="w-4 h-4 mr-2" />
                      View Property
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Favorites Tab */}
        {activeTab === "favorites" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-neutral-900 mb-8">Favorite Properties</h2>
            
            {favoriteProperties.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-card border border-neutral-200 p-12 text-center">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HeartIcon className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Favorites Yet</h3>
                <p className="text-neutral-600 mb-6">Add some properties to your favorites!</p>
                <button
                  onClick={() => navigate("/properties")}
                  className="btn-primary"
                >
                  Browse Properties
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteProperties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-card border border-neutral-200 overflow-hidden hover:shadow-floating transition-shadow duration-300"
                  >
                    <div className="relative">
                      <img 
                        src={property.image || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500"} 
                        alt={property.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                          <HeartIcon className="w-5 h-5 text-red-500 fill-current" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <BanknotesIcon className="w-5 h-5 text-secondary-500" />
                        <span className="text-xl font-bold text-neutral-900">
                          {formatPrice(property.price)}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-1">
                        {property.title}
                      </h3>
                      
                      <div className="flex items-center space-x-2 text-neutral-600 mb-4">
                        <MapPinIcon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm line-clamp-1">
                          {property.city}, {property.country}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => navigate(`/properties/${property.id}`)}
                        className="w-full btn-primary text-sm py-2"
                      >
                        <EyeIcon className="w-4 h-4 mr-2" />
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
