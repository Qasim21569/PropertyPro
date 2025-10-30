import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  MapPinIcon, 
  HomeIcon,
  BanknotesIcon,
  UserGroupIcon,
  EyeIcon,
  CalendarDaysIcon
} from "@heroicons/react/24/outline";
import Heart from "../Heart/Heart";
import { useAuth } from "../../context/AuthContext";
import { addBookingDirect } from "../../utils/directFirebase";
import { toast } from "react-toastify";

const PropertyCard = ({ card }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    }
    return `₹${price?.toLocaleString()}`;
  };

  const handleCardClick = () => {
    navigate(`/properties/${card.id}`);
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/properties/${card.id}`);
  };

  const handleQuickBook = async (e) => {
    e.stopPropagation();
    
    if (!currentUser) {
      toast.error("Please sign in to book a visit");
      navigate("/?login=1");
      return;
    }

    // Check if user is the owner of this property
    if (card.ownerId === currentUser.uid) {
      toast.error("You cannot book a visit to your own property");
      return;
    }

    try {
      // Quick book for tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const booking = {
        propertyId: card.id,
        propertyTitle: card.title,
        date: tomorrow.toISOString().split('T')[0],
        status: "pending",
        createdAt: new Date(),
        propertyAddress: card.address,
        propertyCity: card.city
      };

      const success = await addBookingDirect(currentUser.uid, booking);
      
      if (success) {
        toast.success("Quick visit booked for tomorrow! Check your dashboard for details.");
      }
    } catch (error) {
      console.error("Error booking visit:", error);
      toast.error("Failed to book visit. Please try again.");
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="property-card cursor-pointer group"
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className="relative overflow-hidden bg-neutral-100">
        <img 
          src={card.image || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500"} 
          alt={card.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Heart/Favorite Button */}
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors duration-200">
            <Heart id={card?.id} />
          </div>
        </div>

        {/* Property Type Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-primary-500/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
            Premium
          </span>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={handleViewDetails}
            className="bg-white/90 backdrop-blur-sm text-neutral-900 px-4 py-2 rounded-lg font-medium shadow-lg hover:bg-white transition-colors duration-200 flex items-center space-x-2"
          >
            <EyeIcon className="w-4 h-4" />
            <span>View Details</span>
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-3">
        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BanknotesIcon className="w-5 h-5 text-secondary-500" />
            <span className="text-2xl font-bold text-neutral-900">
              {formatPrice(card.price)}
            </span>
          </div>
          <span className="text-sm text-neutral-500 bg-neutral-100 px-2 py-1 rounded-full">
            For Sale
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-neutral-900 line-clamp-1 group-hover:text-primary-600 transition-colors duration-200">
          {card.title}
        </h3>

        {/* Location */}
        <div className="flex items-center space-x-2 text-neutral-600">
          <MapPinIcon className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm line-clamp-1">
            {card.address}, {card.city}
          </span>
        </div>

        {/* Property Features */}
        {card.facilities && (
          <div className="flex items-center space-x-4 text-sm text-neutral-600 py-2 border-t border-neutral-100">
            {card.facilities?.bedrooms && (
              <div className="flex items-center space-x-1">
                <HomeIcon className="w-4 h-4" />
                <span>{card.facilities.bedrooms} Bed</span>
              </div>
            )}
            {card.facilities?.bathrooms && (
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-current rounded-full opacity-60"></div>
                <span>{card.facilities.bathrooms} Bath</span>
              </div>
            )}
            {card.facilities?.parkings && (
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 border-2 border-current rounded opacity-60"></div>
                <span>{card.facilities.parkings} Park</span>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-neutral-600 line-clamp-2 leading-relaxed">
          {card.description}
        </p>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-3 border-t border-neutral-100">
          <button
            onClick={handleViewDetails}
            className="flex-1 btn-outline text-xs py-2 flex items-center justify-center space-x-1"
          >
            <EyeIcon className="w-3 h-3" />
            <span>Details</span>
          </button>
          {card.ownerId === currentUser?.uid ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate("/dashboard/owner");
              }}
              className="flex-1 btn-primary text-xs py-2 flex items-center justify-center space-x-1"
            >
              <UserGroupIcon className="w-3 h-3" />
              <span>Manage</span>
            </button>
          ) : (
            <button
              onClick={handleQuickBook}
              className="flex-1 btn-primary text-xs py-2 flex items-center justify-center space-x-1"
            >
              <CalendarDaysIcon className="w-3 h-3" />
              <span>Quick Book</span>
            </button>
          )}
        </div>

        {/* Owner Info */}
        <div className="flex items-center space-x-2 pt-2">
          <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-semibold">
              {card.ownerEmail?.charAt(0).toUpperCase() || 'O'}
            </span>
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-900">Property Owner</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
