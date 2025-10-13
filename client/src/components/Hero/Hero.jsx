import "./Hero.css";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import SearchBar from "../SearchBar/SearchBar";
const Hero = () => {
  return (
    <section className="hero-wrapper">
      <div className="paddings innerWidth flexCenter hero-container">
        {/* left side */}
        <div className="flexColStart hero-left">
          <div className="hero-title">
            <div className="orange-circle" />
            <motion.h1
            initial={{ y: "2rem", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 2,
              type: "ease-in",
            }}
            >
              Discover <br />
              Premium Properties
              <br /> in Mumbai
            </motion.h1>
          </div>
          <div className="flexColStart secondaryText flexhero-des">
            <span>Find premium residential and commercial properties in Mumbai's prime locations</span>
            <span>Your trusted partner for real estate investments in India's financial capital</span>
          </div>

          <SearchBar/>

          <div className="flexCenter stats">
            <div className="flexColCenter stat">
              <span>
                <CountUp start={1200} end={1500} duration={4} /> <span>+</span>
              </span>
              <span className="secondaryText">Premium Properties</span>
            </div>

            <div className="flexColCenter stat">
              <span>
                <CountUp start={950} end={1200} duration={4} /> <span>+</span>
              </span>
              <span className="secondaryText">Happy Families</span>
            </div>

            <div className="flexColCenter stat">
              <span>
                <CountUp end={15} /> <span>+</span>
              </span>
              <span className="secondaryText">Years Experience</span>
            </div>
          </div>
        </div>

        {/* right side */}
        <div className="flexCenter hero-right">
          <motion.div
            initial={{ x: "7rem", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 2,
              type: "ease-in",
            }}
            className="image-container"
          >
            <img src="./hero-image.png" alt="houses" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
