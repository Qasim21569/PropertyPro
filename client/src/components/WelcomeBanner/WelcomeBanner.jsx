import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  HomeIcon, 
  ChartBarIcon, 
  PlusCircleIcon, 
  HeartIcon,
  CalendarDaysIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  StarIcon
} from "@heroicons/react/24/outline";

const WelcomeBanner = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProperties: 1547,
    activeUsers: 12400,
    completedBookings: 8950
  });

  if (!currentUser || !userProfile) return null;

  const isOwner = userProfile.role === "owner";
  const userName = userProfile.name || currentUser.email?.split('@')[0] || "User";
  const timeOfDay = new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 18 ? "Afternoon" : "Evening";

  const ownerActions = [
    {
      title: "Manage Properties",
      description: "View and edit your listings",
      icon: BuildingOfficeIcon,
      color: "bg-primary-500 hover:bg-primary-600",
      onClick: () => navigate("/dashboard/owner")
    },
    {
      title: "Add New Property", 
      description: "List a new property",
      icon: PlusCircleIcon,
      color: "bg-secondary-500 hover:bg-secondary-600",
      onClick: () => navigate("/dashboard/owner")
    }
  ];

  const userActions = [
    {
      title: "Browse Properties",
      description: "Find your dream home",
      icon: HomeIcon,
      color: "bg-primary-500 hover:bg-primary-600",
      onClick: () => navigate("/properties")
    },
    {
      title: "My Dashboard",
      description: "Manage bookings & favorites",
      icon: ChartBarIcon,
      color: "bg-secondary-500 hover:bg-secondary-600",
      onClick: () => navigate("/dashboard/user")
    },
    {
      title: "Favorites",
      description: "View saved properties",
      icon: HeartIcon,
      color: "bg-accent-500 hover:bg-accent-600",
      onClick: () => navigate("/favourites")
    }
  ];

  const actions = isOwner ? ownerActions : userActions;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 rounded-2xl shadow-floating border border-white/20"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIwLjEiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPgo8L3N2Zz4=')] bg-repeat"></div>
      </div>

      <div className="relative z-10 p-8">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Welcome Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <span className="text-2xl">👋</span>
                </div>
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-white">
                    Good {timeOfDay}, {userName}!
                  </h2>
                  <p className="text-primary-100 text-lg">
                    {isOwner ? "Ready to manage your property empire?" : "Let's find your perfect property"}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {actions.map((action, index) => (
                <motion.button
                  key={action.title}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={action.onClick}
                  className={`group relative overflow-hidden ${action.color} text-white p-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200`}
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <action.icon className="w-8 h-8 mb-1" />
                    <h3 className="font-semibold text-sm">{action.title}</h3>
                    <p className="text-xs opacity-90">{action.description}</p>
                  </div>
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <StarIcon className="w-5 h-5 mr-2 text-yellow-300" />
              Platform Stats
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-primary-100 text-sm">Total Properties</span>
                <span className="text-white font-bold">{stats.totalProperties.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-primary-100 text-sm">Active Users</span>
                <span className="text-white font-bold">{stats.activeUsers.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-primary-100 text-sm">Bookings Made</span>
                <span className="text-white font-bold">{stats.completedBookings.toLocaleString()}</span>
              </div>
            </div>

            {/* Achievement badge */}
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center space-x-2 text-yellow-300">
                <StarIcon className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {isOwner ? "Property Expert" : "Property Seeker"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom tip */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
        >
          <p className="text-primary-100 text-sm text-center">
            <span className="font-medium">💡 Pro Tip:</span> {isOwner 
              ? "Properties with professional photos get 3x more inquiries!"
              : "Use filters to find properties that match your exact preferences!"
            }
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WelcomeBanner;
