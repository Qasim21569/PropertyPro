import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import useProperties from "../../hooks/useProperties";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import { useAuth } from "../../context/AuthContext";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  MapIcon,
  ListBulletIcon,
  AdjustmentsHorizontalIcon
} from "@heroicons/react/24/outline";

const Properties = () => {
  const { data, isError, isLoading } = useProperties();
  const { currentUser, userProfile } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    if (!data) return [];

    let filtered = data.filter((property) => {
      const matchesSearch = searchTerm === "" || 
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPrice = priceRange === "" || 
        (priceRange === "under-1cr" && property.price < 10000000) ||
        (priceRange === "1cr-5cr" && property.price >= 10000000 && property.price < 50000000) ||
        (priceRange === "5cr-10cr" && property.price >= 50000000 && property.price < 100000000) ||
        (priceRange === "above-10cr" && property.price >= 100000000);

      return matchesSearch && matchesPrice;
    });

    // Sort properties
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "newest":
          return new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0);
        case "oldest":
          return new Date(a.createdAt || a.updatedAt || 0) - new Date(b.createdAt || b.updatedAt || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [data, searchTerm, sortBy, priceRange, propertyType]);

  if (isError) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Error Loading Properties</h3>
          <p className="text-neutral-600">We couldn't load the properties. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 bg-primary-500 rounded-full animate-bounce"></div>
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Loading Properties</h3>
          <p className="text-neutral-600">Finding the best properties for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header Section */}
      <div className="bg-white border-b border-neutral-200">
        <div className="page-container section-padding">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">
              Discover Your Perfect Property
            </h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Browse our curated collection of premium properties across prime locations
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-2xl shadow-card border border-neutral-200 p-6 mb-8">
            <div className="grid lg:grid-cols-4 gap-4">
              {/* Search Input */}
              <div className="lg:col-span-2 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search by location, title, or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                />
              </div>

              {/* Price Range Filter */}
              <div>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                >
                  <option value="">All Price Ranges</option>
                  <option value="under-1cr">Under ₹1 Cr</option>
                  <option value="1cr-5cr">₹1 Cr - ₹5 Cr</option>
                  <option value="5cr-10cr">₹5 Cr - ₹10 Cr</option>
                  <option value="above-10cr">Above ₹10 Cr</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-semibold text-neutral-900">
                {filteredProperties.length} Properties Found
              </h2>
              {searchTerm && (
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  "{searchTerm}"
                </span>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-neutral-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === "grid" 
                    ? "bg-white shadow-sm text-primary-600" 
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                <div className="grid grid-cols-2 gap-1 w-4 h-4">
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                </div>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === "list" 
                    ? "bg-white shadow-sm text-primary-600" 
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                <ListBulletIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="page-container py-8">
        {filteredProperties.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🏠</span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">No Properties Found</h3>
            <p className="text-neutral-600 mb-6">
              {searchTerm 
                ? `No properties match your search for "${searchTerm}"`
                : "No properties are available right now"
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="btn-primary"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <motion.div
            layout
            className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1"
            }`}
          >
            {filteredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <PropertyCard card={property} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Call to Action for Property Owners */}
      {currentUser && userProfile?.role === "owner" && (
        <div className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
          <div className="page-container py-16 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to List Your Property?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of property owners who trust PropertyPro to showcase their listings
            </p>
            <button 
              onClick={() => window.location.href = "/dashboard/owner"}
              className="bg-white text-primary-600 hover:bg-neutral-50 font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              Add Your Property
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;
