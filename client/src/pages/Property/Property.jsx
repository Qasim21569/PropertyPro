import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { getPropertiesDirect, addBookingDirect } from "../../utils/directFirebase";
import { toast } from "react-toastify";
import Heart from "../../components/Heart/Heart";
import {
  MapPinIcon,
  HomeIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  UserIcon,
  ShareIcon,
  PhoneIcon,
  EnvelopeIcon,
  CameraIcon,
  ShieldCheckIcon,
  StarIcon,
  ArrowLeftIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartSolidIcon,
  StarIcon as StarSolidIcon,
} from "@heroicons/react/24/solid";

const Property = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);

  // Sample images for demo - in real app, would come from property data
  const propertyImages = [
    property?.image || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200",
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200",
    "https://images.unsplash.com/photo-1616137466211-f939fc8d2bb5?w=1200",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200"
  ];

  useEffect(() => {
    loadPropertyDetails();
  }, [propertyId]);

  const loadPropertyDetails = async () => {
    try {
      setLoading(true);
      // Get all properties and find the specific one
      const properties = await getPropertiesDirect();
      
      const foundProperty = properties.find(p => p.id === propertyId);
      
      if (foundProperty) {
        setProperty(foundProperty);
      } else {
        setError("Property not found");
      }
    } catch (err) {
      console.error("Error loading property:", err);
      setError("Failed to load property details");
    } finally {
      setLoading(false);
    }
  };

  const handleBookVisit = async () => {
    if (!currentUser) {
      toast.error("Please sign in to book a visit");
      return;
    }

    // Check if user is the owner of this property
    if (property.ownerId === currentUser.uid) {
      toast.error("You cannot book a visit to your own property");
      return;
    }

    if (!bookingDate) {
      toast.error("Please select a date for your visit");
      return;
    }

    try {
      setBookingLoading(true);
      
      const booking = {
        propertyId: propertyId,
        propertyTitle: property.title,
        date: bookingDate,
        status: "pending",
        createdAt: new Date(),
        propertyAddress: property.address,
        propertyCity: property.city
      };

      const success = await addBookingDirect(currentUser.uid, booking);
      
      if (success) {
        toast.success("Visit booked successfully! You'll receive a confirmation email.");
        setShowBookingForm(false);
        setShowBookingSuccess(true);
        setBookingDate("");
        
        // Send booking email notification
        try {
          const emailData = {
            userEmail: currentUser.email,
            userName: userProfile?.name || currentUser.email,
            propertyTitle: property.title,
            propertyAddress: `${property.address}, ${property.city}`,
            bookingDate: bookingDate,
            propertyOwnerEmail: property.ownerEmail
          };
          
          // Here you would call your email service
          // Email notification would be sent in production
        } catch (emailError) {
          console.error("Error sending email:", emailError);
        }
      }
    } catch (error) {
      console.error("Error booking visit:", error);
      toast.error("Failed to book visit. Please try again.");
    } finally {
      setBookingLoading(false);
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
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Loading Property</h3>
          <p className="text-neutral-600">Getting all the details for you...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Property Not Found</h3>
          <p className="text-neutral-600 mb-6">{error || "The property you're looking for doesn't exist."}</p>
          <button
            onClick={() => navigate("/properties")}
            className="btn-primary"
          >
            Browse All Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Back Button */}
      <div className="bg-white border-b border-neutral-200">
        <div className="page-container py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-colors duration-200"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Back to Properties</span>
          </button>
        </div>
      </div>

      {/* Image Gallery Section */}
      <div className="relative">
        <div className="h-96 lg:h-[500px] overflow-hidden bg-neutral-100">
          <img
            src={propertyImages[currentImageIndex]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          
          {/* Image Navigation */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {propertyImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Overlay Actions */}
          <div className="absolute top-4 right-4 flex space-x-3">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
              <Heart id={property.id} />
            </div>
            <button className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-colors duration-200">
              <ShareIcon className="w-5 h-5 text-neutral-700" />
            </button>
          </div>
        </div>
      </div>

      <div className="page-container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Header */}
            <div className="bg-white rounded-2xl shadow-card border border-neutral-200 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-neutral-900 mb-2">{property.title}</h1>
                  <div className="flex items-center space-x-2 text-neutral-600 mb-4">
                    <MapPinIcon className="w-5 h-5" />
                    <span className="text-lg">{property.address}, {property.city}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <StarSolidIcon key={i} className="w-5 h-5" />
                      ))}
                    </div>
                    <span className="text-neutral-600">(4.8) • 24 reviews</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-600 mb-1">
                    {formatPrice(property.price)}
                  </div>
                  <span className="text-neutral-500">Total Price</span>
                </div>
              </div>

              {/* Property Features */}
              {property.facilities && (
                <div className="grid grid-cols-3 gap-6 py-6 border-t border-neutral-200">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <HomeIcon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="font-semibold text-neutral-900">{property.facilities?.bedrooms || 'N/A'}</div>
                    <div className="text-sm text-neutral-600">Bedrooms</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <div className="w-6 h-6 bg-secondary-600 rounded-full"></div>
                    </div>
                    <div className="font-semibold text-neutral-900">{property.facilities?.bathrooms || 'N/A'}</div>
                    <div className="text-sm text-neutral-600">Bathrooms</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <div className="w-6 h-6 border-2 border-accent-600 rounded"></div>
                    </div>
                    <div className="font-semibold text-neutral-900">{property.facilities?.parkings || 'N/A'}</div>
                    <div className="text-sm text-neutral-600">Parking</div>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-card border border-neutral-200 p-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">About This Property</h2>
              <p className="text-neutral-700 leading-relaxed text-lg">
                {property.description}
              </p>
            </div>

            {/* Property Owner */}
            <div className="bg-white rounded-2xl shadow-card border border-neutral-200 p-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Property Owner</h2>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-semibold">
                    {property.ownerEmail?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-900">Property Owner</h3>
                  <p className="text-neutral-600">{property.ownerEmail}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <StarSolidIcon key={i} className="w-4 h-4" />
                      ))}
                    </div>
                    <span className="text-sm text-neutral-600">Verified Owner</span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button className="p-3 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors duration-200">
                    <PhoneIcon className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors duration-200">
                    <EnvelopeIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-card border border-neutral-200 p-6">
                <div className="text-center mb-6">
                  <div className="text-2xl font-bold text-primary-600 mb-1">
                    {formatPrice(property.price)}
                  </div>
                  <span className="text-neutral-500">Total Price</span>
                </div>

                {showBookingSuccess ? (
                  <div className="text-center space-y-4 mb-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircleIcon className="w-8 h-8 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2">Booking Confirmed!</h3>
                      <p className="text-sm text-neutral-600 mb-4">
                        Your visit has been scheduled. You'll receive a confirmation email shortly.
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => navigate("/dashboard/user")}
                        className="flex-1 btn-primary text-sm py-2"
                      >
                        View My Bookings
                      </button>
                      <button
                        onClick={() => setShowBookingSuccess(false)}
                        className="flex-1 btn-outline text-sm py-2"
                      >
                        Book Another
                      </button>
                    </div>
                  </div>
                ) : !showBookingForm ? (
                  property.ownerId === currentUser?.uid ? (
                    <div className="text-center space-y-3 mb-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                        <UserIcon className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900 mb-1">Your Property</h3>
                        <p className="text-sm text-neutral-600">
                          This is your listed property. You can manage it from your dashboard.
                        </p>
                      </div>
                      <button
                        onClick={() => navigate("/dashboard/owner")}
                        className="w-full btn-outline text-lg py-3"
                      >
                        Manage Property
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (!currentUser) {
                          toast.error("Please sign in to book a visit");
                          navigate("/?login=1");
                          return;
                        }
                        setShowBookingForm(true);
                      }}
                      className="w-full btn-primary text-lg py-4 mb-4"
                    >
                      Book Property Visit
                    </button>
                  )
                ) : (
                  <div className="space-y-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-900 mb-2">
                        Select Visit Date
                      </label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                        className="w-full px-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <p className="text-xs text-neutral-500 mt-1">
                        Available for visits within the next 30 days
                      </p>
                    </div>
                    
                    {bookingDate && (
                      <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2 text-primary-700">
                          <CalendarDaysIcon className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Visit scheduled for {new Date(bookingDate).toLocaleDateString('en-IN', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-primary-600 mt-1">
                          Property owner will contact you to confirm the time
                        </p>
                      </div>
                    )}
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setShowBookingForm(false);
                          setBookingDate("");
                        }}
                        className="flex-1 btn-outline"
                        disabled={bookingLoading}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleBookVisit}
                        disabled={bookingLoading || !bookingDate}
                        className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {bookingLoading ? "Booking..." : "Confirm"}
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3 text-sm text-neutral-600">
                  <div className="flex items-center space-x-2">
                    <ShieldCheckIcon className="w-4 h-4 text-green-500" />
                    <span>Verified Property</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CalendarDaysIcon className="w-4 h-4 text-blue-500" />
                    <span>Free Cancellation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <UserIcon className="w-4 h-4 text-purple-500" />
                    <span>Professional Owner</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Property;