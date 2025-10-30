import React from 'react'
import Contact from "../components/Contact/Contact";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import Hero from "../components/Hero/Hero";
import Value from "../components/Value/Value";
import WelcomeBanner from "../components/WelcomeBanner/WelcomeBanner";


const Website = () => {
  return (
    <div className="App">
    <div>
      <div className="white-gradient" />
      <Hero />
    </div>
    <div className="paddings innerWidth">
      <WelcomeBanner />
    </div>
    {/* Removed Companies and Residencies sections from homepage */}
    <Value/>
    <Contact/>
  </div>
  )
}

export default Website