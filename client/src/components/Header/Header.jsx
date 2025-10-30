import React, { useState, useContext, useRef, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import AuthModal from "../AuthModal/AuthModal";
import { motion, AnimatePresence } from "framer-motion";
import {
  HomeIcon,
  BuildingOfficeIcon,
  PlusCircleIcon,
  ChartBarIcon,
  HeartIcon,
  CalendarDaysIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon
} from "@heroicons/react/24/outline";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [authModalOpened, setAuthModalOpened] = useState(false);
  const { currentUser, userProfile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Open auth modal if redirected with ?login=1
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('login') === '1' && !currentUser) {
      setAuthModalOpened(true);
    }
  }, [location.search, currentUser]);

  const isOwner = userProfile?.role === "owner";
  const userName = userProfile?.name || currentUser?.email?.split('@')[0] || "User";

  const navigationItems = isOwner ? [
    {
      name: "Browse Properties",
      href: "/properties",
      icon: HomeIcon,
      current: location.pathname === "/properties"
    },
    {
      name: "My Properties",
      href: "/dashboard/owner",
      icon: BuildingOfficeIcon,
      current: location.pathname === "/dashboard/owner"
    },
    {
      name: "Add Property",
      href: "/dashboard/owner",
      icon: PlusCircleIcon,
      current: false,
      highlight: true
    }
  ] : [
    {
      name: "Browse Properties", 
      href: "/properties",
      icon: HomeIcon,
      current: location.pathname === "/properties"
    },
    {
      name: "My Dashboard",
      href: "/dashboard/user", 
      icon: ChartBarIcon,
      current: location.pathname === "/dashboard/user"
    },
    {
      name: "Favorites",
      href: "/favourites",
      icon: HeartIcon,
      current: location.pathname === "/favourites"
    },
    {
      name: "My Bookings",
      href: "/bookings",
      icon: CalendarDaysIcon,
      current: location.pathname === "/bookings"
    }
  ];

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md border-b border-neutral-200 sticky top-0 z-50">
        <div className="page-container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">P</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold gradient-text">PropertyPro</h1>
                <p className="text-xs text-neutral-500 -mt-1">Find Your Dream Home</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {currentUser && navigationItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) => `
                    flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${item.highlight 
                      ? 'bg-secondary-500 hover:bg-secondary-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5' 
                      : isActive || item.current
                        ? 'bg-primary-50 text-primary-700 border border-primary-200'
                        : 'text-neutral-700 hover:text-primary-600 hover:bg-neutral-50'
                    }
                  `}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
              
              {!currentUser && (
                <button
                  onClick={() => {
                    toast.info("Sign in to explore properties and access all features!", {
                      position: "top-center",
                      autoClose: 4000,
                    });
                    navigate("/?login=1");
                  }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 text-neutral-700 hover:text-primary-600 hover:bg-neutral-50"
                >
                  <HomeIcon className="w-4 h-4" />
                  <span>Browse Properties</span>
                </button>
              )}
            </nav>

            {/* Desktop Auth Section */}
            <div className="hidden lg:flex items-center space-x-4">
              {!currentUser ? (
                <button
                  onClick={() => setAuthModalOpened(true)}
                  className="btn-primary"
                >
                  Sign In
                </button>
              ) : (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-neutral-50 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-left hidden xl:block">
                      <p className="text-sm font-medium text-neutral-900">{userName}</p>
                      <p className="text-xs text-neutral-500 capitalize">{userProfile?.role || 'user'}</p>
                    </div>
                  </button>

                  {/* Profile Dropdown */}
                  <AnimatePresence>
                    {profileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-floating border border-neutral-200 py-2 z-50"
                      >
                        <div className="px-4 py-3 border-b border-neutral-200">
                          <p className="text-sm font-medium text-neutral-900">{userName}</p>
                          <p className="text-xs text-neutral-500">{currentUser.email}</p>
                          <span className="inline-block mt-1 px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full capitalize">
                            {userProfile?.role || 'user'}
                          </span>
                        </div>
                        
                        <div className="py-2">
                          <NavLink
                            to={isOwner ? "/dashboard/owner" : "/dashboard/user"}
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors duration-200"
                            onClick={() => setProfileMenuOpen(false)}
                          >
                            <ChartBarIcon className="w-4 h-4" />
                            <span>Dashboard</span>
                          </NavLink>
                          
                          <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors duration-200">
                            <Cog6ToothIcon className="w-4 h-4" />
                            <span>Settings</span>
                          </button>
                        </div>

                        <div className="border-t border-neutral-200 py-2">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                          >
                            <ArrowRightOnRectangleIcon className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors duration-200"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-neutral-200 bg-white"
            >
              <div className="page-container py-4 space-y-2">
                {currentUser ? (
                  <>
                    {/* User Info */}
                    <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">{userName}</p>
                        <p className="text-sm text-neutral-500 capitalize">{userProfile?.role || 'user'}</p>
                      </div>
                    </div>

                    {/* Mobile Navigation Items */}
                    {navigationItems.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) => `
                          flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200
                          ${item.highlight 
                            ? 'bg-secondary-500 text-white' 
                            : isActive || item.current
                              ? 'bg-primary-50 text-primary-700'
                              : 'text-neutral-700 hover:bg-neutral-50'
                          }
                        `}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                      </NavLink>
                    ))}

                    <div className="pt-4 border-t border-neutral-200">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        toast.info("Sign in to explore properties and access all features!", {
                          position: "top-center",
                          autoClose: 4000,
                        });
                        setMobileMenuOpen(false);
                        navigate("/?login=1");
                      }}
                      className="w-full flex items-center space-x-3 p-3 text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors duration-200"
                    >
                      <HomeIcon className="w-5 h-5" />
                      <span className="font-medium">Browse Properties</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setAuthModalOpened(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 p-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
                    >
                      <UserCircleIcon className="w-5 h-5" />
                      <span className="font-medium">Sign In</span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Auth Modal */}
      <AuthModal 
        opened={authModalOpened}
        setOpened={setAuthModalOpened}
      />
    </>
  );
};

export default Header;
