import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();

  const handleExploreClick = () => {
    if (currentUser) {
      // Redirect based on user role
      const dashboard = userProfile?.role === "owner" ? "/dashboard/owner" : "/dashboard/user";
      navigate(dashboard);
    } else {
      navigate("/properties");
    }
  };

  return (
    <section className="hero-gradient min-h-screen flex items-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-accent-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="page-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left side - Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-4"
            >
              <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-primary-700 border border-primary-200">
                <span className="w-2 h-2 bg-secondary-500 rounded-full mr-2 animate-pulse"></span>
                #1 Property Platform in Your City
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight">
                Find Your
                <span className="gradient-text block">Dream Property</span>
                Today
              </h1>
              
              <p className="text-xl text-neutral-600 leading-relaxed max-w-lg">
                Discover premium residential and commercial properties with PropertyPro. 
                Your trusted partner in finding the perfect space for your next chapter.
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={handleExploreClick}
                className="btn-primary text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                {currentUser ? (
                  userProfile?.role === "owner" ? "Manage Properties" : "Browse Properties"
                ) : (
                  "Explore Properties"
                )}
              </button>
              
              <button
                onClick={() => navigate("/properties")}
                className="btn-outline text-lg px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-200"
              >
                View All Listings
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="grid grid-cols-3 gap-8 pt-8 border-t border-neutral-200"
            >
              <div className="text-center space-y-2">
                <div className="text-3xl lg:text-4xl font-bold text-neutral-900">
                  <CountUp start={1200} end={1500} duration={3} />
                  <span className="text-secondary-500">+</span>
                </div>
                <p className="text-sm text-neutral-600 font-medium">Premium Properties</p>
              </div>

              <div className="text-center space-y-2">
                <div className="text-3xl lg:text-4xl font-bold text-neutral-900">
                  <CountUp start={950} end={1200} duration={3} />
                  <span className="text-secondary-500">+</span>
                </div>
                <p className="text-sm text-neutral-600 font-medium">Happy Families</p>
              </div>

              <div className="text-center space-y-2">
                <div className="text-3xl lg:text-4xl font-bold text-neutral-900">
                  <CountUp end={15} duration={3} />
                  <span className="text-secondary-500">+</span>
                </div>
                <p className="text-sm text-neutral-600 font-medium">Years Experience</p>
              </div>
            </motion.div>
          </div>

          {/* Right side - Image */}
          <div className="relative lg:justify-self-end">
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="relative"
            >
              {/* Decorative background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl transform rotate-6 scale-105 opacity-10"></div>
              
              {/* Main image container */}
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-floating border border-white/50">
                <img
                  src="./hero-image.png"
                  alt="Premium Properties"
                  className="w-full h-96 lg:h-[32rem] object-cover"
                />
                
                {/* Floating card overlay */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-neutral-600">Featured Property</span>
                    <span className="px-2 py-1 bg-secondary-100 text-secondary-700 text-xs font-medium rounded-full">
                      Available Now
                    </span>
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-1">Luxury Villa in Prime Location</h3>
                  <p className="text-2xl font-bold text-primary-600">₹2.5 Cr</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

export default Hero;
