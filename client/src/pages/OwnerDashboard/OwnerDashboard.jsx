import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { getPropertiesDirect, deletePropertyDirect, getOwnerBookings, updateBookingStatus } from "../../utils/directFirebase";
import { seedSampleProperties } from "../../utils/seedProperties";
import { sendBookingStatusEmail, formatBookingEmailData } from "../../utils/emailService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  PlusCircleIcon,
  BuildingOfficeIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  BanknotesIcon,
  ChartBarIcon,
  MapPinIcon,
  StarIcon
} from "@heroicons/react/24/outline";
import {
  StarIcon as StarSolidIcon,
} from "@heroicons/react/24/solid";

const OwnerDashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState("properties");
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalViews: 0,
    totalBookings: 0,
    monthlyRevenue: 0
  });
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
      return;
    }

    if (userProfile?.role !== "owner") {
      navigate("/dashboard/user");
      return;
    }

    loadOwnerData();
  }, [currentUser, userProfile]);

  const loadOwnerData = async () => {
    try {
      setLoading(true);
      
      // Load all properties and filter by current user
      const allProperties = await getPropertiesDirect();
      const ownerProperties = allProperties.filter(prop => prop.ownerId === currentUser?.uid);
      setProperties(ownerProperties);

      // Load bookings for owner's properties
      const ownerBookings = await getOwnerBookings(currentUser?.uid);
      setBookings(ownerBookings);

      // Calculate stats
      const pendingBookings = ownerBookings.filter(b => b.status === 'pending').length;
      const confirmedBookings = ownerBookings.filter(b => b.status === 'confirmed').length;
      
      setStats({
        totalProperties: ownerProperties.length,
        totalViews: ownerProperties.length * 45, // Mock data
        totalBookings: ownerBookings.length,
        pendingBookings: pendingBookings,
        confirmedBookings: confirmedBookings,
        monthlyRevenue: ownerProperties.reduce((sum, prop) => sum + (prop.price * 0.001), 0) // Mock 0.1% monthly revenue
      });
    } catch (error) {
      console.error("Error loading owner data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await deletePropertyDirect(propertyId);
        setProperties(properties.filter(p => p.id !== propertyId));
        toast.success("Property deleted successfully");
      } catch (error) {
        console.error("Error deleting property:", error);
        toast.error("Failed to delete property");
      }
    }
  };

  const handleSeedProperties = async () => {
    try {
      setSeeding(true);
      const success = await seedSampleProperties(currentUser.uid, currentUser.email);
      if (success) {
        toast.success("Sample properties added successfully!");
        loadOwnerData(); // Refresh the data
      } else {
        toast.error("Failed to add sample properties");
      }
    } catch (error) {
      console.error("Error seeding properties:", error);
      toast.error("Failed to add sample properties");
    } finally {
      setSeeding(false);
    }
  };

  const handleBookingAction = async (booking, action) => {
    try {
      const success = await updateBookingStatus(booking.userId, booking.id, action);
      if (success) {
        // Send email notification to user
        try {
          const property = properties.find(p => p.id === booking.propertyId);
          const user = {
            email: booking.userEmail,
            name: booking.userName
          };
          
          const emailData = formatBookingEmailData(booking, property, user, action, {
            ownerName: userProfile?.name || currentUser?.email,
            visitTime: action === 'confirmed' ? "Owner will contact you to confirm time" : undefined
          });
          
          const emailSent = await sendBookingStatusEmail(emailData);
          if (emailSent) {
            toast.success(`Booking ${action} and email notification sent!`);
          } else {
            toast.success(`Booking ${action} successfully! (Email notification failed)`);
          }
        } catch (emailError) {
          console.error("Error sending email:", emailError);
          toast.success(`Booking ${action} successfully! (Email notification failed)`);
        }
        
        // Refresh bookings
        const updatedBookings = await getOwnerBookings(currentUser?.uid);
        setBookings(updatedBookings);
        
        // Update stats
        const pendingBookings = updatedBookings.filter(b => b.status === 'pending').length;
        const confirmedBookings = updatedBookings.filter(b => b.status === 'confirmed').length;
        setStats(prev => ({
          ...prev,
          totalBookings: updatedBookings.length,
          pendingBookings: pendingBookings,
          confirmedBookings: confirmedBookings
        }));
      }
    } catch (error) {
      console.error("Error updating booking:", error);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 bg-primary-500 rounded-full animate-bounce"></div>
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Loading Dashboard</h3>
          <p className="text-neutral-600">Getting your property data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="page-container py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                Welcome back, {userProfile?.name || "Property Owner"}! 👋
              </h1>
              <p className="text-xl text-neutral-600">
                Manage your property portfolio and track performance
              </p>
            </div>
            <div className="flex space-x-4">
              {properties.length === 0 && (
                <button
                  onClick={handleSeedProperties}
                  disabled={seeding}
                  className="btn-outline text-lg px-6 py-3 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <BuildingOfficeIcon className="w-6 h-6" />
                  <span>{seeding ? "Adding..." : "Add Sample Properties"}</span>
                </button>
              )}
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary text-lg px-6 py-3 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <PlusCircleIcon className="w-6 h-6" />
                <span>Add New Property</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <BuildingOfficeIcon className="w-8 h-8 opacity-80" />
                <span className="text-primary-100 text-sm font-medium">Total</span>
              </div>
              <div className="text-3xl font-bold mb-1">{stats.totalProperties}</div>
              <div className="text-primary-100 text-sm">Properties Listed</div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl p-6 text-white shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <EyeIcon className="w-8 h-8 opacity-80" />
                <span className="text-secondary-100 text-sm font-medium">Views</span>
              </div>
              <div className="text-3xl font-bold mb-1">{stats.totalViews}</div>
              <div className="text-secondary-100 text-sm">Total Property Views</div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl p-6 text-white shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-200"
              onClick={() => setActiveTab("bookings")}
            >
              <div className="flex items-center justify-between mb-4">
                <CalendarDaysIcon className="w-8 h-8 opacity-80" />
                <span className="text-accent-100 text-sm font-medium">Bookings</span>
              </div>
              <div className="text-3xl font-bold mb-1">{stats.totalBookings}</div>
              <div className="text-accent-100 text-sm">
                {stats.pendingBookings || 0} Pending • {stats.confirmedBookings || 0} Confirmed
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <BanknotesIcon className="w-8 h-8 opacity-80" />
                <span className="text-green-100 text-sm font-medium">Revenue</span>
              </div>
              <div className="text-3xl font-bold mb-1">{formatPrice(stats.monthlyRevenue)}</div>
              <div className="text-green-100 text-sm">Est. Monthly</div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-neutral-200">
        <div className="page-container">
          <nav className="flex space-x-8">
            {[
              { id: "properties", label: `Properties (${properties.length})`, icon: BuildingOfficeIcon },
              { id: "bookings", label: `Bookings (${bookings.length})`, icon: CalendarDaysIcon }
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
        {/* Properties Tab */}
        {activeTab === "properties" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-neutral-900">Your Properties</h2>
              <div className="flex items-center space-x-4">
                <span className="text-neutral-600">{properties.length} properties</span>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-outline flex items-center space-x-2"
                >
                  <PlusCircleIcon className="w-4 h-4" />
                  <span>Add Property</span>
                </button>
              </div>
            </div>

        {properties.length === 0 ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center py-16 bg-white rounded-2xl shadow-card border border-neutral-200"
          >
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BuildingOfficeIcon className="w-12 h-12 text-neutral-400" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">No Properties Yet</h3>
            <p className="text-neutral-600 mb-6 max-w-md mx-auto">
              Start building your property portfolio by adding your first listing
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary text-lg px-8 py-3"
            >
              Add Your First Property
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {properties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-card border border-neutral-200 overflow-hidden hover:shadow-floating transition-shadow duration-300"
              >
                {/* Property Image */}
                <div className="relative h-48 bg-neutral-100">
                  <img
                    src={property.image || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500"}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                      Active
                    </span>
                  </div>
                </div>

                {/* Property Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-neutral-900 line-clamp-1">
                      {property.title}
                    </h3>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary-600">
                        {formatPrice(property.price)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-neutral-600 mb-4">
                    <MapPinIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm line-clamp-1">{property.address}, {property.city}</span>
                  </div>

                  {/* Property Stats */}
                  <div className="grid grid-cols-3 gap-4 py-3 border-t border-neutral-100 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-neutral-900">45</div>
                      <div className="text-xs text-neutral-600">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-neutral-900">8</div>
                      <div className="text-xs text-neutral-600">Bookings</div>
                    </div>
                    <div className="text-center">
                      <div className="flex justify-center text-yellow-400 mb-1">
                        <StarSolidIcon className="w-4 h-4" />
                      </div>
                      <div className="text-xs text-neutral-600">4.8 Rating</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/properties/${property.id}`)}
                      className="flex-1 btn-outline text-sm py-2 flex items-center justify-center space-x-1"
                    >
                      <EyeIcon className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    <button className="flex-1 btn-primary text-sm py-2 flex items-center justify-center space-x-1">
                      <PencilIcon className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProperty(property.id)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-neutral-900">Property Visit Bookings</h2>
              <div className="flex items-center space-x-4">
                <span className="text-neutral-600">{bookings.length} total bookings</span>
                <div className="flex space-x-2">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                    {stats.pendingBookings || 0} Pending
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    {stats.confirmedBookings || 0} Confirmed
                  </span>
                </div>
              </div>
            </div>

            {bookings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-card border border-neutral-200">
                <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CalendarDaysIcon className="w-12 h-12 text-neutral-400" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">No Bookings Yet</h3>
                <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                  When users book visits to your properties, they'll appear here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-card border border-neutral-200 p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {booking.userName?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-neutral-900">{booking.userName}</h3>
                            <p className="text-sm text-neutral-600">{booking.userEmail}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {booking.status}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-neutral-900 mb-1">Property</p>
                            <p className="text-sm text-neutral-600">{booking.propertyTitle}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neutral-900 mb-1">Visit Date</p>
                            <p className="text-sm text-neutral-600">{booking.date}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neutral-900 mb-1">Booked On</p>
                            <p className="text-sm text-neutral-600">
                              {new Date(booking.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {booking.status === 'pending' && (
                      <div className="flex space-x-3 pt-4 border-t border-neutral-200">
                        <button
                          onClick={() => handleBookingAction(booking, 'confirmed')}
                          className="flex-1 btn-primary text-sm py-2"
                        >
                          Confirm Visit
                        </button>
                        <button
                          onClick={() => handleBookingAction(booking, 'cancelled')}
                          className="flex-1 btn-outline text-sm py-2 text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => window.open(`mailto:${booking.userEmail}?subject=Property Visit - ${booking.propertyTitle}&body=Hi ${booking.userName},%0A%0ARegarding your visit request for ${booking.propertyTitle} on ${booking.date}...`)}
                          className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                        >
                          Email
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Property Modal */}
      {showCreateModal && (
        <CreatePropertyModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadOwnerData(); // Refresh data
          }}
        />
      )}
    </div>
  );
};

// Simple Create Property Modal Component
const CreatePropertyModal = ({ isOpen, onClose, onSuccess }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    address: "",
    city: "",
    country: "",
    image: "",
    facilities: {
      bedrooms: 1,
      bathrooms: 1,
      parkings: 1
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.price || !formData.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      
      const propertyData = {
        ...formData,
        price: parseFloat(formData.price),
        ownerId: currentUser.uid,
        ownerEmail: currentUser.email,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Use direct Firebase operation
      const { addPropertyDirect } = await import("../../utils/directFirebase");
      await addPropertyDirect(propertyData, currentUser.uid, currentUser.email);
      
      toast.success("Property added successfully!");
      onSuccess();
    } catch (error) {
      console.error("Error adding property:", error);
      toast.error("Failed to add property");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-floating max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-neutral-900">Add New Property</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Property Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="input"
                placeholder="Beautiful 3BHK Apartment"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="input"
                placeholder="5000000"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="input min-h-[100px] resize-none"
              placeholder="Describe your property..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Address *
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="input"
                placeholder="123 Main Street"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="input"
                placeholder="Enter city"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Country
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                className="input"
                placeholder="India"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              className="input"
              placeholder="https://example.com/property-image.jpg"
            />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Bedrooms
              </label>
              <input
                type="number"
                min="1"
                value={formData.facilities.bedrooms}
                onChange={(e) => setFormData({
                  ...formData, 
                  facilities: {...formData.facilities, bedrooms: parseInt(e.target.value)}
                })}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Bathrooms
              </label>
              <input
                type="number"
                min="1"
                value={formData.facilities.bathrooms}
                onChange={(e) => setFormData({
                  ...formData, 
                  facilities: {...formData.facilities, bathrooms: parseInt(e.target.value)}
                })}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Parking Spaces
              </label>
              <input
                type="number"
                min="0"
                value={formData.facilities.parkings}
                onChange={(e) => setFormData({
                  ...formData, 
                  facilities: {...formData.facilities, parkings: parseInt(e.target.value)}
                })}
                className="input"
              />
            </div>
          </div>

          <div className="flex space-x-4 pt-6 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-outline"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Adding Property..." : "Add Property"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default OwnerDashboard;