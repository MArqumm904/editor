import React from "react";
import Navbar from "../components/Navbar";
import DonateHERO from "../components/HERO.JSX";
import Donors from "../components/Donors";
import Footer from "../components/Footer";
import AdComponent from "../components/AdComponents/AdComponent";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-page bg-gray-50">
      <Navbar />

      <DonateHERO />

      <div className="ad-container">
        <AdComponent slot="6058134393" />
      </div>

      {/* <Donors /> */}

      <div className="ad-container">
        <AdComponent slot="2118889384"  />
      </div>

      <div className="ad-container">
        <AdComponent slot="7528603513" />
      </div>

      <Footer />
    </div>
  );
};

export default Home;
